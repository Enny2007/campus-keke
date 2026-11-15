import { randomInt, randomBytes, createHmac, createHash } from "crypto";

// Generate a six-digit OTP
export const generateOTP = (): string => {
  return randomInt(100000, 1000000).toString();
};

// Hash the OTP before storing it in the database
export const hashOTP = (otp: string): string => {
  const secret = process.env.OTP_SECRET;

  if (!secret) {
    throw new Error("OTP_SECRET is missing from environment variables.");
  }

  return createHmac("sha256", secret)
    .update(otp)
    .digest("hex");
};

// Set OTP expiry to 10 minutes
export const getOTPExpiry = (): Date => {
  return new Date(Date.now() + 10 * 60 * 1000);
};

// Generate a secure random verification token
export const generateVerificationToken = (): string => {
  return randomBytes(32).toString("hex");
};

// Hash the verification token before storing it
export const hashVerificationToken = (token: string): string => {
  return createHash("sha256")
    .update(token)
    .digest("hex");
};

// Set verification token expiry to 24 hours
export const getVerificationTokenExpiry = (): Date => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000);
};