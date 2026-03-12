"use client";

import { Routes } from "@/config/routes";

import Footer from "@/component/Footer";
import TestimonialSlider from "@/component/TestimonialSlider";
import { useToken } from "@/helpers/Cookies/use-token";
import { authorizationAtom } from "@/helpers/hooks/authorization-atom/authorization-atom";
import { useLoginByEmailMutation } from "@/helpers/hooks/loginByEmail/loginByEmail";
import { setLocalStorageItem } from "@/helpers/localStorage";
import { ErrorMessage } from "@hookform/error-message";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { CircularProgress } from "@mui/material";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import logo from "../../public/images/logo.webp";
import { useSnackbar } from "../contexts/SnackbarContext";
import backIcon from "@/public/images/back-arrow.png";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const { setToken } = useToken();
  const [_, setAuthorized] = useAtom(authorizationAtom);
  const loginByEmail = useLoginByEmailMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = (data) => {
    loginByEmail.mutate(data, {
      onSuccess: (data) => {
        setToken(data.data.token);
        setLocalStorageItem("role", data.data.role);
        setLocalStorageItem("loginId", data.data.id);
        setAuthorized(true);
        router.push(
          data.data.role === "super_admin"
            ? Routes.mamAdmin
            : data.data.role === "admin"
            ? Routes.trainer
            : data.data.role === "trainer"
            ? Routes.customer
            : data.data.role === "customer"
            ? Routes.dietPlan
            : null
        );
        router.refresh();
        showSnackbar(data?.message, "success");
      },
      onError: (error) => {
        showSnackbar(error?.response?.data?.message, "error");
      },
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Main content wrapper */}
        <div className="flex-1 p-4">
           
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 lg:gap-8 gap-6 ">
            
            <div className="w-full max-w-lg mx-auto space-y-4 lg:space-y-8 flex flex-col lg:min-h-[88vh]">
               
              <div className="flex justify-center mb-2 lg:mb-16">
              
                <div className="p-3 rounded-full">
                  <Image
                    src={logo}
                    width={150}
                    height={150}
                    alt="brand-logo"
                    priority
                    fetchPriority="high"
                  />
                </div>
                
              </div>
               <h1 className="text-xl font-bold">
                    <button onClick={() => router.push(Routes.homepage)} className="flex items-center">
                      <Image
                        src={backIcon}
                        height={20}
                        width={20}
                        className="me-4 ms-1"
                        alt="back-icon"
                      />
                     Back to Home Page
                    </button>
                  </h1>
              <div>
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-bold">Sign In</h1>
                  <p className="text-gray-500 text-sm sm:text-base">
                    Welcome back! Please enter your details
                  </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4 h-20">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      Username
                    </label>
                    <input
                      className="bg-transparent appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-green-600"
                      name="email"
                      id="emailId"
                      type="email"
                      autoComplete="username"
                      placeholder="Enter your email"
                      {...register("email", {
                        required: "This field is required",
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="email"
                      render={({ message }) => (
                        <p className="errorMessage">{message}</p>
                      )}
                    />
                  </div>

                  <div className="mb-4 h-20">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                          required: "Password is required",
                        })}
                        autoComplete="current-password" // ✅ React expects camelCase
                        className="bg-transparent appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-green-600"
                      />

                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Link
                      href={Routes.forgotPassword}
                      style={{ color: "#00000", fontWeight: "500" }}
                      className="mb-3 text-sm font-bold"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <button
                    type="submit"
                    disabled={loginByEmail.isPending}
                    className="btn py-3 w-full bg-black hover:bg-gray-800 text-white"
                  >
                    <div className="text-white relative">
                      Continue
                      {loginByEmail.isPending && (
                        <CircularProgress
                          size={18}
                          sx={{
                            color: "white",
                            position: "absolute",
                            top: 2,
                            mx: 0.5,
                          }}
                        />
                      )}
                    </div>
                  </button>
                  <div className="flex justify-center m-3 space-x-2">
                    <span>Don’t have an account yet?</span>
                    <Link
                      href={Routes.register}
                      className="font-medium text-green-600 underline"
                    >
                      Sign Up
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* Feature Section */}
            <div className="bg-gradient-to-b  from-[#01943C] to-[#003839] p-8 text-white rounded-3xl hidden lg:flex flex-col min-h-[88vh]">
              <div className="h-full flex flex-col justify-between gap-6 sm:gap-12 lg:gap-20">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
                    Track your macros and plan meals for a healthier lifestyle.
                  </h2>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Take control of your nutrition with personalized meal
                      planning tools.
                    </li>
                    <li>
                      Easily track calories, macros, and daily intake to meet
                      your health goals.
                    </li>
                    <li>
                      Get custom meal suggestions based on your preferences and
                      dietary needs.
                    </li>
                    <li>
                      Whether you’re cutting, bulking, or just eating clean —
                      we’ve got you covered.
                    </li>
                  </ul>
                </div>
                <TestimonialSlider />
              </div>
            </div>
          </div>

          {/* Footer Component */}
        </div>
        <Footer />
      </div>
    </>
  );
}
