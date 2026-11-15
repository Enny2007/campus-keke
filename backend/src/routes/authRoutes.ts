import { Router } from "express";
import { requestOTP } from "../controllers/requestOtpController";
import { registerStudent } from "../controllers/registerStudentController";
import { verifyEmail } from "../controllers/verificationController";
import { resendOTP } from "../controllers/resendOtpController";
import { login } from "../controllers/loginController";
import { verifyOTP } from "../controllers/verifyOtpController";

const router = Router();

// Student registration
router.post("/register", registerStudent);

// Student email verification
router.post("/verify-email", verifyEmail);

// Resend student verification OTP
router.post("/resend-otp", resendOTP);

// Student login
router.post("/login", login);

router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);

export default router;