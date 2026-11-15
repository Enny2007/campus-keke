import type { Request, Response } from "express";
import { verifyStudentEmail } from "../services/authService";

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    // Validate required fields
    if (!email || !otp) {
      res.status(400).json({
        message: "Email and verification code are required.",
      });
      return;
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(String(otp))) {
      res.status(400).json({
        message: "Please enter a valid six-digit verification code.",
      });
      return;
    }

    // Normalize email
    const normalizedEmail = String(email).trim().toLowerCase();

    // Call verification service
    const result = await verifyStudentEmail(
      normalizedEmail,
      String(otp)
    );

    if (!result.success) {
      res.status(400).json({
        message: result.message,
      });
      return;
    }

    res.status(200).json({
      message: result.message,
    });

  } catch (error) {
    console.error("Email verification error:", error);

    res.status(500).json({
      message: "Something went wrong while verifying your email.",
    });
  }
};