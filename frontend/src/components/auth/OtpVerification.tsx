import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

import { resendOTP, verifyOTP } from "../../services/authService";

interface OtpVerificationProps {
  email: string;
  onBack: () => void;
  onVerified: (verificationToken: string) => void;
}

const OtpVerification = ({
  email,
  onBack,
  onVerified,
}: OtpVerificationProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend OTP countdown
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setInterval(() => {
      setCountdown((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [countdown]);

  // Handle individual OTP input
  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updatedOtp = [...otp];
    updatedOtp[index] = digit;

    setOtp(updatedOtp);
    setMessage("");

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle pasting a complete OTP
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedDigits) return;

    const updatedOtp = [...otp];

    pastedDigits.split("").forEach((digit, index) => {
      updatedOtp[index] = digit;
    });

    setOtp(updatedOtp);
    setMessage("");

    const nextIndex = Math.min(pastedDigits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Verify email OTP
  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setMessage("Please enter all six digits of your verification code.");
      setMessageType("error");
      return;
    }

    setIsVerifying(true);
    setMessage("");

    try {
      const result = await verifyOTP({
        email,
        otp: enteredOtp,
      });

      if (!result.verificationToken) {
        throw new Error("Verification token was not received. Please try again.");
      }

      setMessage("Email verified successfully!");
      setMessageType("success");

      // Pass the verification token back to the signup page.
      window.setTimeout(() => {
        onVerified(result.verificationToken);
      }, 800);

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again.",
      );

      setMessageType("error");
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setIsResending(true);
    setMessage("");

    try {
      const result = await resendOTP(email);

      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);

      setMessage(result.message);
      setMessageType("success");

      inputRefs.current[0]?.focus();

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to resend your verification code.",
      );

      setMessageType("error");

      // If the backend rejects the request because of its cooldown,
      // allow the user to try again shortly.
      setCountdown(60);

    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-[470px] rounded-xl bg-[#FAF9F5] px-5 py-6 shadow-xl sm:px-8 lg:px-8 lg:py-8 xl:px-7">
      <div className="mb-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#D7F0DF] bg-[#EAF8EE] px-3 py-1.5 text-[10px] font-bold tracking-[0.13em] text-[#087B45] sm:text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00C96B]" />
          EMAIL VERIFICATION
        </span>

        <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF8EE] text-[#087B45]">
          <Mail size={27} />
        </div>

        <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-[#173525] sm:text-3xl">
          Verify your email
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#64748B]">
          We've sent a 6-digit verification code to:
        </p>

        <p className="mt-1 break-all text-sm font-bold text-[#087B45]">
          {email}
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-3 block text-sm font-semibold text-[#173525]">
            Enter verification code
          </label>

          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                aria-label={`Verification code digit ${index + 1}`}
                className="h-12 min-w-0 flex-1 rounded-xl border border-[#DCE5DC] bg-white text-center text-lg font-bold text-[#173525] outline-none transition focus:border-[#00C96B] focus:ring-4 focus:ring-[#00C96B]/10 sm:h-14 sm:text-xl"
              />
            ))}
          </div>
        </div>

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

        <button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying || otp.some((digit) => !digit)}
          className="group flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#00D36F] px-5 py-3 text-sm font-bold text-[#07351F] shadow-sm transition hover:bg-[#00C565] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isVerifying ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#07351F]/30 border-t-[#07351F]" />
              Verifying...
            </>
          ) : (
            <>
              Verify email
              <ArrowRight size={17} />
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-sm text-[#64748B]">Didn't receive the code?</p>

          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
            className="mt-2 text-sm font-bold text-[#087B45] transition hover:text-[#00A957] disabled:cursor-not-allowed disabled:text-[#94A3B8]"
          >
            {isResending
              ? "Sending code..."
              : countdown > 0
                ? `Resend code in ${countdown}s`
                : "Resend verification code"}
          </button>
        </div>

        <div className="border-t border-[#E5EAE4] pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-[#64748B] transition hover:text-[#087B45]"
          >
            <ArrowLeft size={16} />
            Back to registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;