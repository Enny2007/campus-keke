import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import { login } from "../services/authService";

type LoginRole = "student" | "driver";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState<LoginRole>("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleChange = (newRole: LoginRole) => {
    setRole(newRole);
    setIdentifier("");
    setPassword("");
    setMessage("");
    setShowPassword(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");

    // Driver authentication is not implemented yet.
    if (role === "driver") {
      setMessage("Driver login is not available yet. Please check back later.");
      return;
    }

    if (!identifier.trim() || !password) {
      setMessage("Please enter your matric number and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Send login details to the backend.
      const result = await login({
        identifier,
        password,
        role: "student",
      });

      // Make sure the backend returned an authentication token.
      if (!result.token) {
        throw new Error(
          "Login was successful, but no authentication token was received.",
        );
      }

      // Save the authentication token.
      localStorage.setItem("token", result.token);

      // Save the logged-in student's information.
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      // Redirect to the student dashboard.
      navigate("/student/dashboard", {
        replace: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[470px] rounded-xl bg-[#FAF9F5] px-5 py-7 shadow-xl sm:px-8 lg:px-8 lg:py-8 xl:px-7">
        {/* Form heading */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#D7F0DF] bg-[#EAF8EE] px-3 py-1.5 text-[10px] font-bold tracking-[0.13em] text-[#087B45] sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00C96B]" />
            STUDENT & DRIVER ACCESS
          </span>

          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#173525] sm:text-3xl">
            Welcome back
          </h2>

          <p className="mt-1.5 text-sm leading-6 text-[#64748B]">
            Log in to continue your campus journey.
          </p>
        </div>

        {/* Student / Driver toggle */}
        <div
          className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-[#DCE5DC] bg-[#F0F2EC] p-1"
          role="group"
          aria-label="Choose account type"
        >
          <button
            type="button"
            onClick={() => handleRoleChange("student")}
            aria-pressed={role === "student"}
            className={`min-h-[42px] rounded-lg px-3 py-2 text-sm font-bold transition ${
              role === "student"
                ? "bg-[#00D36F] text-[#07351F] shadow-sm"
                : "text-[#64748B] hover:bg-white/70 hover:text-[#173525]"
            }`}
          >
            Student
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("driver")}
            aria-pressed={role === "driver"}
            className={`min-h-[42px] rounded-lg px-3 py-2 text-sm font-bold transition ${
              role === "driver"
                ? "bg-[#00D36F] text-[#07351F] shadow-sm"
                : "text-[#64748B] hover:bg-white/70 hover:text-[#173525]"
            }`}
          >
            Driver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Matric number or Driver ID */}
          <AuthInput
            id={role === "student" ? "matricNumber" : "driverId"}
            label={role === "student" ? "Matric number" : "Driver ID"}
            placeholder={
              role === "student"
                ? "Enter your matric number"
                : "Enter your driver ID"
            }
            autoComplete="on"
            value={identifier}
            onChange={(value) => {
              setIdentifier(value);
              setMessage("");
            }}
          />

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="loginPassword"
              className="block text-[13px] font-semibold text-[#263D30]"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="loginPassword"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setMessage("");
                }}
                required
                className="block h-[43px] w-full min-w-0 rounded-xl border border-[#DCE5DC] bg-white py-2 pl-3.5 pr-12 text-sm text-[#172B20] outline-none transition placeholder:text-[#929D95] hover:border-[#B7C9BA] focus:border-[#00C96B] focus:ring-4 focus:ring-[#00C96B]/10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-[#087B45] transition hover:text-[#00A957] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#00C96B]"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Login status message */}
          {message && (
            <p
              role="alert"
              aria-live="polite"
              className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-800"
            >
              {message}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#00D36F] px-5 py-3 text-sm font-bold text-[#07351F] shadow-sm transition hover:bg-[#00C565] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00D36F]/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Logging in..."
              : `Log in as ${role === "student" ? "student" : "driver"}`}

            {!isSubmitting && (
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            )}
          </button>
        </form>

        <div className="my-5 h-px bg-[#E5EAE4]" />

        {/* Role-specific footer */}
        {role === "student" ? (
          <p className="text-center text-sm leading-6 text-[#64748B]">
            New student?{" "}
            <Link
              to="/signup"
              className="font-bold text-[#087B45] transition hover:text-[#00A957] focus-visible:outline-none focus-visible:underline"
            >
              Create an account
            </Link>
          </p>
        ) : (
          <p className="text-center text-xs leading-5 text-[#879188]">
            Driver accounts are created by campus administrators. Contact your
            administrator if you need your driver ID or login assistance.
          </p>
        )}
      </div>
    </AuthLayout>
  );
};

export default Login;
