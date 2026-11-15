import db from "../config/db";
import {
  hashOTP,
  generateVerificationToken,
  hashVerificationToken,
  getVerificationTokenExpiry,
} from "./otpService";

interface VerifyOtpResult {
  success: boolean;
  message: string;
  verificationToken?: string;
}

export const verifyStudentOTP = async (
  email: string,
  submittedOTP: string
): Promise<VerifyOtpResult> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [sessions] = await connection.execute(
      `SELECT *
       FROM email_verification_sessions
       WHERE email = ?
       ORDER BY created_at DESC
       LIMIT 1
       FOR UPDATE`,
      [email]
    );

    const session = (sessions as any[])[0];

    if (!session) {
      await connection.rollback();

      return {
        success: false,
        message: "No verification request found. Please request a new code.",
      };
    }

    if (session.otp_consumed_at) {
      await connection.rollback();

      return {
        success: false,
        message: "This verification code has already been used.",
      };
    }

    if (session.attempts >= session.max_attempts) {
      await connection.rollback();

      return {
        success: false,
        message: "Too many incorrect attempts. Please request a new code.",
      };
    }

    if (new Date(session.expires_at).getTime() <= Date.now()) {
      await connection.rollback();

      return {
        success: false,
        message: "This verification code has expired. Please request another.",
      };
    }

    const submittedHash = hashOTP(submittedOTP);

    const isValid =
      submittedHash === session.otp_hash;

    if (!isValid) {
      await connection.execute(
        `UPDATE email_verification_sessions
         SET attempts = attempts + 1
         WHERE id = ?`,
        [session.id]
      );

      await connection.commit();

      return {
        success: false,
        message: "Incorrect verification code. Please try again.",
      };
    }

    // Generate the 24-hour verification token.
    const verificationToken = generateVerificationToken();

    const verificationTokenHash =
      hashVerificationToken(verificationToken);

    const verificationExpiry = getVerificationTokenExpiry();

    // Mark the OTP as used and save the verification token hash.
    await connection.execute(
      `UPDATE email_verification_sessions
       SET otp_consumed_at = CURRENT_TIMESTAMP,
           verified_at = CURRENT_TIMESTAMP,
           verification_expires_at = ?,
           verification_token_hash = ?
       WHERE id = ?`,
      [
        verificationExpiry,
        verificationTokenHash,
        session.id,
      ]
    );

    await connection.commit();

    return {
      success: true,
      message: "Email verified successfully.",
      verificationToken,
    };

  } catch (error) {
    await connection.rollback();
    throw error;

  } finally {
    connection.release();
  }
};