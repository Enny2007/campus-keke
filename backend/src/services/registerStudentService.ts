import db from "../config/db";
import bcrypt from "bcryptjs";
import { hashVerificationToken } from "./otpService";

interface RegisterStudentData {
  fullName: string;
  email: string;
  phone: string;
  matricNumber: string;
  password: string;
  verificationToken: string;
}

interface RegisterStudentResult {
  success: boolean;
  message: string;
  studentId?: number;
}

export const registerVerifiedStudent = async (
  data: RegisterStudentData
): Promise<RegisterStudentResult> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      fullName,
      email,
      phone,
      matricNumber,
      password,
      verificationToken,
    } = data;

    // Hash the submitted verification token.
    const tokenHash = hashVerificationToken(verificationToken);

    // Find and lock the matching verification session.
    const [sessions] = await connection.execute(
      `SELECT *
       FROM email_verification_sessions
       WHERE email = ?
       AND verification_token_hash = ?
       LIMIT 1
       FOR UPDATE`,
      [email, tokenHash]
    );

    const session = (sessions as any[])[0];

    if (!session) {
      await connection.rollback();

      return {
        success: false,
        message: "Email verification is required before registration.",
      };
    }

    // Confirm that the email was verified.
    if (!session.verified_at) {
      await connection.rollback();

      return {
        success: false,
        message: "Please verify your email before registering.",
      };
    }

    // Check whether the verification token has expired.
    if (
      new Date(session.verification_expires_at).getTime() <= Date.now()
    ) {
      await connection.rollback();

      return {
        success: false,
        message: "Your email verification has expired. Please verify again.",
      };
    }

    // Prevent the same token from being used twice.
    if (session.registration_used_at) {
      await connection.rollback();

      return {
        success: false,
        message: "This verification has already been used.",
      };
    }

    // Check for duplicate student details.
    const [existingStudents] = await connection.execute(
      `SELECT id
       FROM students
       WHERE email = ?
       OR phone = ?
       OR matric_number = ?
       LIMIT 1`,
      [email, phone, matricNumber]
    );

    if ((existingStudents as any[]).length > 0) {
      await connection.rollback();

      return {
        success: false,
        message: "Email, phone number or matric number is already registered.",
      };
    }

    // Hash the student's password.
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the verified student account.
    const [result] = await connection.execute(
      `INSERT INTO students
       (
         full_name,
         email,
         phone,
         matric_number,
         password_hash,
         email_verified_at,
         account_status
       )
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [
        fullName,
        email,
        phone,
        matricNumber,
        passwordHash,
        session.verified_at,
      ]
    );

    const studentId = (result as any).insertId;

    // Mark the verification token as used.
    await connection.execute(
      `UPDATE email_verification_sessions
       SET registration_used_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [session.id]
    );

    await connection.commit();

    return {
      success: true,
      message: "Your KekeGo account has been created successfully.",
      studentId,
    };

  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
};