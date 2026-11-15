import { Request, Response } from "express";
import { registerVerifiedStudent } from "../services/registerStudentService";

export const registerStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      fullName,
      email,
      phone,
      matricNumber,
      password,
      verificationToken,
    } = req.body;

    // Check that all required fields are provided.
    if (
      !fullName ||
      !email ||
      !phone ||
      !matricNumber ||
      !password ||
      !verificationToken
    ) {
      res.status(400).json({
        message: "Please provide all required registration details.",
      });
      return;
    }

    // Normalize student details.
    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();
    const normalizedMatric = matricNumber.trim().toUpperCase();

    // Validate the official student email.
    const studentEmailPattern =
      /^[^\s@]+@student\.babcock\.edu\.ng$/;

    if (!studentEmailPattern.test(normalizedEmail)) {
      res.status(400).json({
        message: "Please use your official Babcock student email.",
      });
      return;
    }

    // Validate password length.
    if (typeof password !== "string" || password.length < 8) {
      res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
      return;
    }

    if (
      typeof verificationToken !== "string" ||
      verificationToken.length !== 64
    ) {
      res.status(400).json({
        message: "Invalid email verification token.",
      });
      return;
    }

    // Register the verified student.
    const result = await registerVerifiedStudent({
      fullName: normalizedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      matricNumber: normalizedMatric,
      password,
      verificationToken,
    });

    if (!result.success) {
      res.status(400).json({
        message: result.message,
      });
      return;
    }

    res.status(201).json({
      message: result.message,
      studentId: result.studentId,
    });

  } catch (error) {
    console.error("Student registration controller error:", error);

    res.status(500).json({
      message: "Something went wrong while creating your account.",
    });
  }
};