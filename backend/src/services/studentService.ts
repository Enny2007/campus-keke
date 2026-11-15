import db from "../config/db";

export interface StudentProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  matricNumber: string;
  accountStatus: string;
}

export const getStudentProfile = async (
  studentId: string
): Promise<StudentProfile | null> => {
  const [rows] = await db.execute(
    `SELECT
      id,
      full_name AS fullName,
      email,
      phone,
      matric_number AS matricNumber,
      account_status AS accountStatus
    FROM students
    WHERE id = ?`,
    [studentId]
  );

  const students = rows as StudentProfile[];

  return students.length > 0 ? students[0] : null;
};