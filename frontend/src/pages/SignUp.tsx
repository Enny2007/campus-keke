import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Eye, EyeOff, Mail, CheckCircle2 } from "lucide-react";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import OtpVerification from "../components/auth/OtpVerification";
import { requestOTP, signUp } from "../services/authService";

const SignUp = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);

  const [currentStep, setCurrentStep] = useState<"register" | "verify">(
    "register",
  );

  // Handle email changes
  const handleEmailChange = (value: string) => {
    setEmail(value);

    // Changing the email invalidates the previous verification.
    setIsEmailVerified(false);
    setVerificationToken("");

    setMessage("");
  };

  // Request email verification code
  const handleEmailVerification = async () => {
    if (!email.trim()) {
      setMessage("Please enter your email address first.");
      setMessageType("error");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const studentEmailPattern = /^[^\s@]+@student\.babcock\.edu\.ng$/;

    if (!studentEmailPattern.test(normalizedEmail)) {
      setMessage("Please use your official Babcock student email address.");
      setMessageType("error");
      return;
    }

    setIsRequestingOtp(true);
    setMessage("");

    try {
      const result = await requestOTP(normalizedEmail);

      setMessage(result.message);
      setMessageType("success");

      // Open the OTP verification screen.
      setCurrentStep("verify");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to send verification code. Please try again.",
      );

      setMessageType("error");
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // Called after successful OTP verification
  const handleEmailVerified = (token: string) => {
    setVerificationToken(token);
    setIsEmailVerified(true);

    setCurrentStep("register");

    setMessage("Your email address has been successfully verified.");
    setMessageType("success");
  };


// Submit student registration
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setMessage("");

      if (!isEmailVerified || !verificationToken) {
        setMessage("Please verify your email address before signing up.");
        setMessageType("error");
        return;
      }

      if (password !== confirmPassword) {
        setMessage("Your passwords do not match.");
        setMessageType("error");
        return;
      }

      // Password must contain at least 8 characters,
      // including at least one letter and one number.
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

      if (!passwordRegex.test(password)) {
        setMessage(
          "Password must be at least 8 characters long and contain both letters and numbers."
        );
        setMessageType("error");
        return;
      }

      setIsSubmitting(true);

      try {
        const result = await signUp({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          role: "student",
          matricNumber: matricNumber.trim().toUpperCase(),
          verificationToken,
        });

        setMessage(result.message);
        setMessageType("success");

        // Clear the temporary verification token.
        setVerificationToken("");

        // Redirect to login after successful registration.
        window.setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1800);

      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );

        setMessageType("error");

      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <AuthLayout>
      {currentStep === "verify" ? (
        <OtpVerification
          email={email.trim().toLowerCase()}
          onBack={() => {
            setCurrentStep("register");
            setMessage("");
          }}
          onVerified={handleEmailVerified}
        />
      ) : (
        <div className="w-full max-w-[470px] rounded-xl bg-[#FAF9F5] px-5 py-3 shadow-xl sm:px-8 lg:px-8 lg:py-6 xl:px-7">
          <div className="mb-5 sm:mb-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D7F0DF] bg-[#EAF8EE] px-3 py-1.5 text-[10px] font-bold tracking-[0.13em] text-[#087B45] sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C96B]" />
              STUDENT REGISTRATION
            </span>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#173525] sm:text-3xl">
              Create your account
            </h2>

            <p className="mt-1.5 text-sm text-[#64748B]">
              Enter your details to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full name */}
            <AuthInput
              id="fullName"
              label="Full name"
              placeholder="Enter your full name"
              autoComplete="name"
              value={fullName}
              onChange={setFullName}
            />

            {/* Email with verification control */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-[#173525]"
              >
                Email address
              </label>

              <div
                className={`flex min-h-[46px] items-center overflow-hidden rounded-xl border bg-white transition focus-within:ring-4 ${
                  isEmailVerified
                    ? "border-[#00C96B] focus-within:ring-[#00C96B]/10"
                    : "border-[#DCE5DC] focus-within:border-[#00C96B] focus-within:ring-[#00C96B]/10"
                }`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2 pl-3">
                  <Mail size={17} className="shrink-0 text-[#94A3B8]" />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@student.babcock.edu.ng"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => handleEmailChange(event.target.value)}
                    readOnly={isEmailVerified}
                    required
                    className="h-[46px] min-w-0 w-full bg-transparent text-sm text-[#173525] outline-none placeholder:text-[#94A3B8] read-only:cursor-not-allowed"
                  />
                </div>

                <div className="flex shrink-0 items-center justify-center px-3">
                  {isEmailVerified ? (
                    <CheckCircle2
                      size={23}
                      className="text-[#00B96B]"
                      aria-label="Email verified"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={handleEmailVerification}
                      disabled={isRequestingOtp}
                      className="whitespace-nowrap text-xs font-bold text-[#087B45] transition hover:text-[#00A957] focus-visible:outline-none focus-visible:underline disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer bg-gray-200 px-2.5 py-2 rounded-lg hover:bg-gray-300"
                    >
                      {isRequestingOtp ? "Sending..." : "Verify Email"}
                    </button>
                  )}
                </div>
              </div>

              {isEmailVerified && (
                <p className="mt-1.5 text-xs font-medium text-[#087B45]">
                  Email address successfully verified.
                </p>
              )}
            </div>

            {/* Phone and matric number */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <AuthInput
                id="phone"
                label="Phone number"
                type="tel"
                placeholder="080XXXXXXXX"
                autoComplete="tel"
                value={phone}
                onChange={setPhone}
              />

              <AuthInput
                id="matricNumber"
                label="Matric number"
                placeholder="Enter matric number"
                autoComplete="off"
                value={matricNumber}
                onChange={setMatricNumber}
              />
            </div>

            {/* Password and confirm password */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div className="relative">
                <AuthInput
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={setPassword}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-[37px] z-10 text-[#94A3B8] transition hover:text-[#087B45] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <AuthInput
                  id="confirmPassword"
                  label="Confirm password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter password again"
                  autoComplete="new-password"
                  minLength={8}
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-[37px] z-10 text-[#94A3B8] transition hover:text-[#087B45] cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Form messages */}
            {message && (
              <p
                role={messageType === "error" ? "alert" : "status"}
                aria-live="polite"
                className={`rounded-xl border px-3 py-2.5 text-xs leading-5 ${
                  messageType === "success"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#00D36F] px-5 py-3 text-sm font-bold text-[#07351F] shadow-sm transition hover:bg-[#00C565] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00D36F]/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#07351F]/30 border-t-[#07351F]" />
                  Creating account...
                </>
              ) : (
                <>
                  Create student account
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

            <p className="text-center text-[10px] leading-4 text-[#64748B]">
              By continuing, you agree to follow CampusKeke&apos;s account and
              ride safety guidelines.
            </p>
          </form>

          <div className="my-4 h-px bg-[#E5EAE4]" />

          <p className="text-center text-sm text-[#64748B]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-[#087B45] transition hover:text-[#00A957] focus-visible:outline-none focus-visible:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  );
};

export default SignUp;
