import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/authMiddleware";
import { getStudentProfile } from "../services/studentService";

export const getMyProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const studentId = req.user?.sub;

    if (!studentId) {
      res.status(401).json({
        message: "Authentication required.",
      });
      return;
    }

    const student = await getStudentProfile(studentId);

    if (!student) {
      res.status(404).json({
        message: "Student account not found.",
      });
      return;
    }

    if (student.accountStatus !== "active") {
      res.status(403).json({
        message: "Your account is not active. Please contact the administrator.",
      });
      return;
    }

    res.status(200).json({
      message: "Student profile retrieved successfully.",
      user: student,
    });
  } catch (error) {
    console.error("Get student profile error:", error);

    res.status(500).json({
      message: "Unable to retrieve student profile.",
    });
  }
};