import type {
  SignUpData,
  SignUpResponse,
  LoginData,
  LoginResponse,
  RequestOtpResponse,
  VerifyOtpData,
  VerifyOtpResponse,
  ResendOtpResponse,
} from "../types/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const checkApiConfiguration = () => {
  if (!API_BASE_URL) {
    throw new Error("Backend API is not configured.");
  }
};

// STUDENT REGISTRATION
export const signUp = async (
  data: SignUpData & { verificationToken: string }
): Promise<SignUpResponse> => {
  checkApiConfiguration();

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to create your account.");
  }

  return result as SignUpResponse;
};

// STUDENT LOGIN
export const login = async (
  data: LoginData
): Promise<LoginResponse> => {
  checkApiConfiguration();

  if (data.role !== "student") {
    throw new Error("Driver login is not available yet.");
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      matricNumber: data.identifier.trim().toUpperCase(),
      password: data.password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to log in.");
  }

  return result as LoginResponse;
};

// REQUEST OTP
export const requestOTP = async (
  email: string
): Promise<RequestOtpResponse> => {
  checkApiConfiguration();

  const response = await fetch(`${API_BASE_URL}/auth/request-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to send verification code.");
  }

  return result as RequestOtpResponse;
};

// VERIFY OTP
export const verifyOTP = async (
  data: VerifyOtpData
): Promise<VerifyOtpResponse & { verificationToken: string }> => {
  checkApiConfiguration();

  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email.trim().toLowerCase(),
      otp: data.otp,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Email verification failed.");
  }

  return result as VerifyOtpResponse & {
    verificationToken: string;
  };
};

// RESEND OTP
export const resendOTP = async (
  email: string
): Promise<ResendOtpResponse> => {
  // The new request-otp endpoint handles both initial requests
  // and subsequent requests, including the 60-second cooldown.
  return requestOTP(email);
};