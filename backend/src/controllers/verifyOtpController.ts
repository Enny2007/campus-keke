import { Request, Response } from "express";
import { verifyStudentOTP } from "../services/verifyOtpService";

export const verifyOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    // Validate the email
    if (!email || typeof email !== "string") {
      res.status(400).json({
        message: "Please provide a valid email address.",
      });
      return;
    }

    // Validate the OTP
    if (
      !otp ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      res.status(400).json({
        message: "Please enter a valid six-digit verification code.",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify the OTP
    const result = await verifyStudentOTP(
      normalizedEmail,
      otp
    );

    if (!result.success) {
      res.status(400).json({
        message: result.message,
      });
      return;
    }

    // Return the verification token to the frontend.
    res.status(200).json({
      message: result.message,
      verificationToken: result.verificationToken,
    });

  } catch (error) {
    console.error("OTP verification controller error:", error);

    res.status(500).json({
      message: "Something went wrong while verifying your email.",
    });
  }
};