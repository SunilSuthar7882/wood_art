"use client";
import { useRouter } from "next/navigation";
import { Routes } from "@/config/routes";
import Image from "next/image";
import logo from "../../public/images/logo.webp";
import Link from "next/link";
import backIcon from "@/public/images/back-arrow.png";


const RegisterPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-100 to-white p-6">
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 shadow-xl text-center">
        {/* Icon */}
          <h1 className="text-xl font-bold">
                            <button onClick={() => router.back()} className="flex items-center">
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
        <div className="flex justify-center">
          <div className="p-1 rounded-full flex items-center justify-center">
            <Image
              src={logo}
              alt="Macros & Meals Logo"
              width={150}
              height={150}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Join Macros & Meals
        </h1>
        <p className="text-gray-500 mb-6">
          Start your journey to better health
        </p>

        <h2 className="text-md font-semibold text-gray-700 mb-4">
          Choose Your Role
        </h2>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Card */}
          <div
            onClick={() => router.push(Routes.customersubscriptions)}
            // onClick={() => router.push(Routes.customersignup)}
            className="cursor-pointer border-2 border-green-400 rounded-xl p-6 hover:shadow-lg transition bg-green-50"
          >
            <div className="mb-2">
              <div className="mx-auto bg-green-300 rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-black">👤</span>
              </div>
            </div>
            <h3 className="text-md font-semibold text-black">Customer</h3>
            <p className="text-sm text-gray-600 mt-1">
              Get personalized nutrition plans and track your progress
            </p>
          </div>

          {/* Trainer Card */}
          <div
            onClick={() => {
              localStorage.setItem("role", "trainer");
              router.push(Routes.subscriptions);
            }}
            className="cursor-pointer border-2 border-gray-200 hover:border-green-400 rounded-xl p-6 hover:shadow-lg transition"
          >
            <div className="mb-2">
              <div className="mx-auto bg-yellow-100 rounded-full w-10 h-10 flex items-center justify-center">
                <span className="text-yellow-600">💪</span>
              </div>
            </div>
            <h3 className="text-md font-semibold text-black">Trainer</h3>
            <p className="text-sm text-gray-600 mt-1">
              Help clients achieve their nutrition and fitness goals
            </p>
          </div>
        </div>
        <div className="flex justify-center m-3 space-x-2">
          <span>Already Have an Account?</span>
          <Link
            href={Routes.login}
            className="font-medium text-green-600 underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
