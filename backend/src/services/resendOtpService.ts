import type { RowDataPacket, ResultSetHeader } from "mysql2";

import db from "../config/db";
import { sendEmail } from "../config/email";

import {
  generateOTP,
  hashOTP,
  getOTPExpiry,
} from "./otpService";

interface StudentRecord extends RowDataPacket {
  id: number;
  full_name: string;
  account_status: string;
}

interface VerificationRecord extends RowDataPacket {
  id: number;
  created_at: Date;
}

export type ResendOTPResult = {
  success: boolean;
  message: string;
};

export const resendStudentOTP = async (
  email: string
): Promise<ResendOTPResult> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Find the student
    const [students] = await connection.execute<StudentRecord[]>(
      `SELECT id, full_name, account_status
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
        message: "Unable to process your request.",
      };
    }

    const student = students[0];

    // 2. Check account status
    if (student.account_status === "active") {
      await connection.rollback();

      return {
        success: false,
        message: "This account has already been verified.",
      };
    }

    // 3. Find the latest OTP
    const [verifications] = await connection.execute<VerificationRecord[]>(
      `SELECT id, created_at
       FROM email_verifications
       WHERE student_id = ?
       ORDER BY created_at DESC, id DESC
       LIMIT 1
       FOR UPDATE`,
      [student.id]
    );

    // 4. Enforce 60-second cooldown
    if (verifications.length > 0) {
      const lastOTPTime = new Date(
        verifications[0].created_at
      ).getTime();

      const elapsedTime = Date.now() - lastOTPTime;
      const cooldown = 60 * 1000;

      if (elapsedTime < cooldown) {
        await connection.rollback();

        return {
          success: false,
          message: "Please wait before requesting another verification code.",
        };
      }
    }

    // 5. Generate a new OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiry = getOTPExpiry();

    // 6. Invalidate previous OTPs
    await connection.execute(
      `UPDATE email_verifications
       SET consumed_at = CURRENT_TIMESTAMP
       WHERE student_id = ?
       AND consumed_at IS NULL`,
      [student.id]
    );

    // 7. Save the replacement OTP
    await connection.execute<ResultSetHeader>(
      `INSERT INTO email_verifications
       (student_id, otp_hash, expires_at)
       VALUES (?, ?, ?)`,
      [student.id, otpHash, expiry]
    );

    await connection.commit();

    // 8. Send the new OTP
    try {
      await sendEmail(
        email,
        "Your New KekeGo Verification Code",
        `Hello ${student.full_name},

Your new KekeGo verification code is:

${otp}

This code expires in 10 minutes.

Your previous verification code is no longer valid.

Thank you,
KekeGo Team`
      );

    } catch (emailError) {
      console.error("Resend OTP email error:", emailError);

      return {
        success: false,
        message: "We couldn't send your verification email. Please try again later.",
      };
    }

    return {
      success: true,
      message: "A new verification code has been sent to your email.",
    };

  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
};