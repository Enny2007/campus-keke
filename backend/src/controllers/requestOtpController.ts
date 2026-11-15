import { Request, Response } from "express";
import { requestStudentOTP } from "../services/requestOtpService";

export const requestOTP = async (
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

    // Only allow official Babcock student email addresses
    const studentEmailPattern =
      /^[^\s@]+@student\.babcock\.edu\.ng$/;

    if (!studentEmailPattern.test(normalizedEmail)) {
      res.status(400).json({
        message: "Please use your official Babcock student email.",
      });
      return;
    }

    // Request OTP
    const result = await requestStudentOTP(normalizedEmail);

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
    console.error("Request OTP controller error:", error);

    res.status(500).json({
      message: "Something went wrong while requesting your verification code.",
    });
  }
};