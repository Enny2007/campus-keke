import type { Request, Response } from "express";
import { resendStudentOTP } from "../services/resendOtpService";

export const resendOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== "string") {
      res.status(400).json({
        message: "Please provide a valid email address.",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Call resend OTP service
    const result = await resendStudentOTP(normalizedEmail);

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
    console.error("Resend OTP controller error:", error);

    res.status(500).json({
      message: "Something went wrong while requesting a new verification code.",
    });
  }
};