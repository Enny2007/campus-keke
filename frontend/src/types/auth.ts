export type UserRole = "student" | "driver";

// Student registration
export interface SignUpData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "student";
  matricNumber: string;
  verificationToken: string;
}

export interface SignUpResponse {
  message: string;
  studentId?: number;
}

// Login
export interface LoginData {
  identifier: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  message: string;
  token?: string;
  user?: {
    id?: string;
    fullName?: string;
    email?: string;
    matricNumber?: string;
    role: UserRole;
  };
}

// Request email verification code
export interface RequestOtpData {
  email: string;
}

export interface RequestOtpResponse {
  message: string;
}

// Verify email verification code
export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
}

// Resend verification code
export interface ResendOtpData {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
}

// Keep these aliases temporarily for components
// that may still use the old type names.
export type VerifyEmailData = VerifyOtpData;
export type VerifyEmailResponse = VerifyOtpResponse;