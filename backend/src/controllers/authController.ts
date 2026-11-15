import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";

import db from "../config/db";
import { sendEmail } from "../config/email";

import {
  generateOTP,
  hashOTP,
  getOTPExpiry,
} from "../services/otpService";


export const registerStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  let connection;

  try {
    // 1. Receive registration details
    const {
      fullName,
      email,
      phone,
      matricNumber,
      password,
    } = req.body;

    // 2. Check required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !matricNumber ||
      !password
    ) {
      res.status(400).json({
        message: "Please provide all required registration details.",
      });
      return;
    }

    // 3. Normalize input
    const normalizedName = String(fullName).trim();
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPhone = String(phone).trim();
    const normalizedMatric = String(matricNumber).trim().toUpperCase();

    // 4. Validate email
    const emailPattern = /^[^\s@]+@student\.babcock\.edu\.ng$/;

    if (!emailPattern.test(normalizedEmail)) {
      res.status(400).json({
        message: "Please use a valid Babcock student email.",
      });
      return;
    }

    // 5. Validate password
    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
      return;
    }

    // 6. Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // 7. Generate OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const otpExpiry = getOTPExpiry();

    // 8. Start database transaction
    connection = await db.getConnection();

    await connection.beginTransaction();

    // 9. Check for existing student details
    const [existingStudents] = await connection.execute<RowDataPacket[]>(
      `SELECT id
       FROM students
       WHERE email = ?
       OR phone = ?
       OR matric_number = ?
       LIMIT 1`,
      [
        normalizedEmail,
        normalizedPhone,
        normalizedMatric,
      ]
    );

    if (existingStudents.length > 0) {
      await connection.rollback();

      res.status(409).json({
        message: "An account already exists with this email, phone number or matric number.",
      });
      return;
    }

    // 10. Create pending student account
    const [studentResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO students
       (full_name, email, phone, matric_number, password_hash, account_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        normalizedName,
        normalizedEmail,
        normalizedPhone,
        normalizedMatric,
        passwordHash,
        "pending",
      ]
    );

    const studentId = studentResult.insertId;

    // 11. Save OTP hash
    await connection.execute<ResultSetHeader>(
      `INSERT INTO email_verifications
       (student_id, otp_hash, expires_at)
       VALUES (?, ?, ?)`,
      [
        studentId,
        otpHash,
        otpExpiry,
      ]
    );

    // 12. Commit database transaction
    await connection.commit();

    // 13. Send OTP to student's email
    try {
      await sendEmail(
        normalizedEmail,
        "KekeGo Email Verification",
        `Hello ${normalizedName},

Welcome to KekeGo!

Your email verification code is:

${otp}

This code expires in 10 minutes.

Please do not share this code with anyone.

Thank you,
KekeGo Team`
      );

    } catch (emailError) {
      console.error("OTP email delivery failed:", emailError);

      res.status(503).json({
        message: "Your account was created, but we couldn't send the verification email. Please request a new verification code.",
      });

      return;
    }

    // 14. Successful registration response
    res.status(201).json({
      message: "Registration successful! Please check your email for your verification code.",
      studentId,
    });

  } catch (error) {

    if (connection) {
      await connection.rollback();
    }

    console.error("Student registration error:", error);

    res.status(500).json({
      message: "Something went wrong during registration.",
    });

  } finally {

    if (connection) {
      connection.release();
    }

  }
};