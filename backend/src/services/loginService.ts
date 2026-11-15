import type { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import db from "../config/db";

interface StudentRecord extends RowDataPacket {
  id: number;
  full_name: string;
  email: string;
  matric_number: string;
  password_hash: string;
  account_status: string;
}

export type LoginResult =
  | {
      success: true;
      token: string;
      user: {
        id: number;
        fullName: string;
        email: string;
        matricNumber: string;
        role: "student";
      };
    }
  | {
      success: false;
      message: string;
    };

export const loginStudent = async (
  matricNumber: string,
  password: string
): Promise<LoginResult> => {

  // 1. Find student using matric number
  const [students] = await db.execute<StudentRecord[]>(
    `SELECT id, full_name, email, matric_number,
            password_hash, account_status
     FROM students
     WHERE matric_number = ?
     LIMIT 1`,
    [matricNumber]
  );

  // 2. Check whether student exists
  if (students.length === 0) {
    return {
      success: false,
      message: "Invalid matric number or password.",
    };
  }

  const student = students[0];

  // 3. Compare submitted password with stored hash
  const passwordMatches = await bcrypt.compare(
    password,
    student.password_hash
  );

  if (!passwordMatches) {
    return {
      success: false,
      message: "Invalid matric number or password.",
    };
  }

  // 4. Check account status
  if (student.account_status === "pending") {
    return {
      success: false,
      message: "Please verify your email before logging in.",
    };
  }

  if (student.account_status !== "active") {
    return {
      success: false,
      message: "Your account is currently unavailable. Please contact the administrator.",
    };
  }

  // 5. Check JWT secret
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is missing from environment variables.");
  }

  // 6. Generate authentication token
  const token = jwt.sign(
    {
      role: "student",
      matricNumber: student.matric_number,
    },
    jwtSecret,
    {
      subject: String(student.id),
      expiresIn: "1d",
    }
  );

  // 7. Return authenticated student information
  return {
    success: true,
    token,
    user: {
      id: student.id,
      fullName: student.full_name,
      email: student.email,
      matricNumber: student.matric_number,
      role: "student",
    },
  };
};