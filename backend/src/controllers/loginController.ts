import type { Request, Response } from "express";
import { loginStudent } from "../services/loginService";

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { matricNumber, password } = req.body;

    // Validate required fields
    if (
      !matricNumber ||
      !password ||
      typeof matricNumber !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        message: "Matric number and password are required.",
      });
      return;
    }

    // Normalize matric number
    const normalizedMatric = matricNumber.trim().toUpperCase();

    // Call login service
    const result = await loginStudent(
      normalizedMatric,
      password
    );

    if (!result.success) {
      res.status(401).json({
        message: result.message,
      });
      return;
    }

    // Successful login
    res.status(200).json({
      message: "Login successful!",
      token: result.token,
      user: result.user,
    });

  } catch (error) {
    console.error("Student login error:", error);

    res.status(500).json({
      message: "Something went wrong during login.",
    });
  }
};