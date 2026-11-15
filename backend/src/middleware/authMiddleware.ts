import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthPayload {
  role: string;
  matricNumber: string;
  sub: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export const authenticateStudent = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // 1. Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Authentication required. Please log in.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    // 2. Check JWT secret
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is missing.");
    }

    // 3. Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // 4. Validate token payload
    if (
      typeof decoded === "string" ||
      decoded.role !== "student" ||
      !decoded.sub ||
      !decoded.matricNumber
    ) {
      res.status(401).json({
        message: "Invalid authentication token.",
      });
      return;
    }

    // 5. Attach authenticated user to request
    req.user = {
      role: "student",
      matricNumber: decoded.matricNumber,
      sub: decoded.sub,
    };

    // 6. Continue to requested route
    next();

  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      res.status(401).json({
        message: "Your session is invalid or has expired. Please log in again.",
      });
      return;
    }

    console.error("Authentication middleware error:", error);

    res.status(500).json({
      message: "Authentication error.",
    });
  }
};