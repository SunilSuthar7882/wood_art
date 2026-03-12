import { ErrorMessage } from "@hookform/error-message";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Footer from "@/component/Footer";
import { Routes } from "@/config/routes";
import {
  useForgotPassword,
  useForgotPasswordSendEmail,
  useVerifyForgotPasswordToken,
} from "@/helpers/hooks/forgotPassword/forgotPassword";
import logo from "../../public/images/logo.webp";
import { CustomButton } from "../ThemeRegistry";

const ForgotPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [tokenVerified, setTokenVerified] = useState(false);
  const [tokenVerificationAttempted, setTokenVerificationAttempted] =
    useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const forgotPasswordEmail = useForgotPasswordSendEmail();
  const forgotPassword = useForgotPassword();
  const verifyForgotPasswordToken = useVerifyForgotPasswordToken();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm({ mode: "onChange" });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch,
  } = useForm({ mode: "onChange" });

  // Watch password to confirm it matches with confirm password
  const password = watch("password", "");

  // Verify token when component mounts if token exists
  useEffect(() => {
    if (token && !tokenVerificationAttempted) {
      setTokenVerificationAttempted(true);

      verifyForgotPasswordToken.mutate(
        { token },
        {
          onSuccess: () => {
            setTokenVerified(true);
          },
          onError: () => {
            // On token verification failure, redirect to forgot password page
            router.push(Routes.forgotPassword);
          },
        }
      );
    }
  }, [token, tokenVerificationAttempted, verifyForgotPasswordToken, router]);

  const onSubmitEmail = (payload) => {
    forgotPasswordEmail.mutate(payload, {
      onSuccess: () => {
        // Success message is shown via the hook
      },
    });
  };

  const onSubmitPassword = (payload) => {
    forgotPassword.mutate(
      {
        token,
        password: payload.password,
      },
      {
        onSuccess: () => {
          // Redirect to login page after successful password reset
          router.push(Routes.login);
        },
        onError: () => {
          // On reset failure, redirect to forgot password page
          router.push(Routes.forgotPassword);
        },
      }
    );
  };

  // Loading states combined
  const isLoading =
    forgotPasswordEmail.isPending ||
    forgotPassword.isPending ||
    verifyForgotPasswordToken.isPending;

  // Determine which form to show
  const showPasswordResetForm = token && tokenVerified;

  return (
    <div className="min-h-screen min-w-full flex flex-col bg-gray-50">
      <div className="flex-1 flex justify-center items-center px-4 py-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src={logo}
                width={isMobile ? 140 : 180}
                height={isMobile ? 30 : 40}
                alt="brand-logo"
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </div>

            {/* Title */}
            <h2 className="text-center text-primary font-bold text-xl md:text-2xl mb-6">
              {showPasswordResetForm
                ? "Create New Password"
                : "Reset Your Password"}
            </h2>

            {/* Loading State */}
            {verifyForgotPasswordToken.isPending && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-2 text-gray-600">Verifying your request...</p>
              </div>
            )}

            {/* Email Form */}
            {!showPasswordResetForm && !verifyForgotPasswordToken.isPending && (
              <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
                <div className="mb-4">
                  <label
                    htmlFor="emailId"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="emailId"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none transition-colors"
                    {...registerEmail("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={emailErrors}
                    name="email"
                    render={({ message }) => (
                      <span className="text-red-500 text-xs mt-1">
                        {message}
                      </span>
                    )}
                  />
                </div>

                <div className="mt-6">
                  <CustomButton
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    className="w-full py-3 rounded-lg font-medium"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </CustomButton>
                </div>

                <div className="text-center mt-4">
                  <Link
                    href={Routes.login}
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    Remember your password? Login here
                  </Link>
                </div>
              </form>
            )}

            {/* Password Reset Form */}
            {showPasswordResetForm && (
              <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                {/* Password Field */}
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none transition-colors"
                    {...registerPassword("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={passwordErrors}
                    name="password"
                    render={({ message }) => (
                      <span className="text-red-500 text-xs mt-1">
                        {message}
                      </span>
                    )}
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none transition-colors"
                    {...registerPassword("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                  <ErrorMessage
                    errors={passwordErrors}
                    name="confirmPassword"
                    render={({ message }) => (
                      <span className="text-red-500 text-xs mt-1">
                        {message}
                      </span>
                    )}
                  />
                </div>

                <div className="mt-6">
                  <CustomButton
                    type="submit"
                    variant="contained"
                    disabled={forgotPassword.isPending}
                    className="w-full py-3 rounded-lg font-medium"
                  >
                    {forgotPassword.isPending ? (
                      <span className="inline-flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Resetting...
                      </span>
                    ) : (
                      "Reset Password"
                    )}
                  </CustomButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
