import db from "../config/db";
import { sendEmail } from "../config/email";
import {
  generateOTP,
  hashOTP,
  getOTPExpiry,
} from "./otpService";

interface RequestOtpResult {
  success: boolean;
  message: string;
}

export const requestStudentOTP = async (
  email: string
): Promise<RequestOtpResult> => {
  const normalizedEmail = email.trim().toLowerCase();

  const connection = await db.getConnection();

  let verificationId: number | undefined;
  let otp: string | undefined;

  try {
    await connection.beginTransaction();

    // Check whether this email already belongs to a student.
    const [existingStudents] = await connection.execute(
      `SELECT id FROM students WHERE email = ? LIMIT 1`,
      [normalizedEmail]
    );

    if ((existingStudents as any[]).length > 0) {
      await connection.rollback();

      return {
        success: false,
        message: "This email is already registered.",
      };
    }

    // Check the most recent OTP request.
    const [recentSessions] = await connection.execute(
      `SELECT id, created_at
       FROM email_verification_sessions
       WHERE email = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [normalizedEmail]
    );

    const recentSession = (recentSessions as any[])[0];

    if (recentSession) {
      const lastRequestTime = new Date(recentSession.created_at).getTime();
      const elapsedSeconds =
        (Date.now() - lastRequestTime) / 1000;

      if (elapsedSeconds < 60) {
        await connection.rollback();

        return {
          success: false,
          message: "Please wait before requesting another OTP.",
        };
      }
    }

    // Remove previous verification sessions for this email.
    await connection.execute(
      `DELETE FROM email_verification_sessions
       WHERE email = ?`,
      [normalizedEmail]
    );

    // Generate and hash a new OTP.
    otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = getOTPExpiry();

    // Save the new verification session.
    const [result] = await connection.execute(
      `INSERT INTO email_verification_sessions
       (email, otp_hash, expires_at)
       VALUES (?, ?, ?)`,
      [normalizedEmail, otpHash, expiresAt]
    );

    verificationId = (result as any).insertId;

    await connection.commit();

  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }

  // Send the OTP after the database transaction is complete.
  try {
    await sendEmail(
      normalizedEmail,
      "Verify Your KekeGo Email Address",
      `Your KekeGo verification code is ${otp}.

This code expires in 10 minutes.

If you did not request this code, please ignore this email.`
    );

    return {
      success: true,
      message: "Verification code sent to your email.",
    };

  } catch (error) {
    // Remove the session if the email could not be sent.
    if (verificationId !== undefined) {
      await db.execute(
        `DELETE FROM email_verification_sessions WHERE id = ?`,
        [verificationId]
      );
    }

    console.error("OTP email error:", error);

    return {
      success: false,
      message: "Unable to send verification code. Please try again.",
    };
  }
};