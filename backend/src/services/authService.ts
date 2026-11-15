import type { RowDataPacket } from "mysql2";
import { timingSafeEqual } from "crypto";

import db from "../config/db";
import { hashOTP } from "./otpService";

interface VerificationRecord extends RowDataPacket {
  id: number;
  student_id: number;
  otp_hash: string;
  expires_at: Date;
  attempts: number;
  max_attempts: number;
  consumed_at: Date | null;
}

interface StudentRecord extends RowDataPacket {
  id: number;
  account_status: string;
}

export type VerificationResult =
  | { success: true; message: string }
  | { success: false; message: string };

export const verifyStudentEmail = async (
  email: string,
  otp: string
): Promise<VerificationResult> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Find the student
    const [students] = await connection.execute<StudentRecord[]>(
      `SELECT id, account_status
       FROM students
       WHERE email = ?
       LIMIT 1
       FOR UPDATE`,
      [email]
    );

    if (students.length === 0) {
      await connection.rollback();

      return {
        success: false,
        message: "Student account not found.",
      };
    }

    const student = students[0];

    if (student.account_status === "active") {
      await connection.rollback();

      return {
        success: false,
        message: "This email has already been verified.",
      };
    }

    // 2. Find the latest verification code
    const [verifications] = await connection.execute<VerificationRecord[]>(
      `SELECT id, student_id, otp_hash, expires_at,
              attempts, max_attempts, consumed_at
       FROM email_verifications
       WHERE student_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT 1
       FOR UPDATE`,
      [student.id]
    );

    if (verifications.length === 0) {
      await connection.rollback();

      return {
        success: false,
        message: "No verification code found. Please request a new one.",
      };
    }

    const verification = verifications[0];

    // 3. Check whether the OTP was already used
    if (verification.consumed_at !== null) {
      await connection.rollback();

      return {
        success: false,
        message: "This verification code has already been used.",
      };
    }

    // 4. Check maximum attempts
    if (verification.attempts >= verification.max_attempts) {
      await connection.rollback();

      return {
        success: false,
        message: "Too many incorrect attempts. Please request a new code.",
      };
    }

    // 5. Check OTP expiration
    const expiryTime = new Date(verification.expires_at).getTime();

    if (Date.now() > expiryTime) {
      await connection.rollback();

      return {
        success: false,
        message: "Your verification code has expired. Please request a new one.",
      };
    }

    // 6. Hash the submitted OTP
    const submittedHash = hashOTP(otp);

    const storedHashBuffer = Buffer.from(verification.otp_hash, "hex");
    const submittedHashBuffer = Buffer.from(submittedHash, "hex");

    const isValid =
      storedHashBuffer.length === submittedHashBuffer.length &&
      timingSafeEqual(storedHashBuffer, submittedHashBuffer);

    // 7. Handle incorrect OTP
    if (!isValid) {
      await connection.execute(
        `UPDATE email_verifications
         SET attempts = attempts + 1
         WHERE id = ?`,
        [verification.id]
      );

      await connection.commit();

      return {
        success: false,
        message: "Incorrect verification code.",
      };
    }

    // 8. Activate student account
    await connection.execute(
      `UPDATE students
       SET account_status = 'active',
           email_verified_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [student.id]
    );

    // 9. Mark OTP as consumed
    await connection.execute(
      `UPDATE email_verifications
       SET consumed_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [verification.id]
    );

    await connection.commit();

    return {
      success: true,
      message: "Email verified successfully. Your account is now active.",
    };

  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
};