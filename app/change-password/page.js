// "use client";
// import { ErrorMessage } from "@hookform/error-message";
// import { useMediaQuery } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";

// import Footer from "@/component/Footer";
// import { Routes } from "@/config/routes";
// import {
//   useChangePassword,
//   useForgotPasswordSendEmail,
//   useVerifyForgotPasswordToken,
// } from "@/helpers/hooks/forgotPassword/forgotPassword";
// import logo from "../../public/images/logo.webp";
// import { CustomButton } from "../ThemeRegistry";
// import CustomTextField from "@/component/CommonComponents/CustomTextField";

// const ChangePassword = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const token = searchParams.get("token");

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const changePassword = useChangePassword();

  
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({ mode: "onChange" });

//   const onSubmit = (data) => {
//     changePassword.mutate(
//       {
//         token,
//         current_password: data.current_password,
//         new_password: data.new_password,
//       },
     
//     );
//   };

//   return (
//     <div className=" flex flex-col bg-gray-50 h-full">
//       <div className="flex-1 flex justify-center items-center px-2 py-3">
//         <div className="w-full max-w-md">
//           <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
//             {/* Logo */}
//             <div className="flex justify-center mb-6">
//               <Image
//                 src={logo}
//                 width={isMobile ? 140 : 180}
//                 height={isMobile ? 30 : 40}
//                 alt="brand-logo"
//                 className="object-contain"
//                 style={{ width: "auto", height: "auto" }}
//                 priority
//               />
//             </div>

//             {/* Title */}

//             {/* Password Reset Form */}
//             {
//               <form onSubmit={handleSubmit(onSubmit)}>
//                 {/* Password Field */}
//                 <div className="mb-4">
//                   <label
//                     htmlFor="current_password"
//                     className="block text-sm font-semibold text-gray-700 mb-1"
//                   >
//                     Current Password
//                   </label>
//                   <CustomTextField
//                     id="current_password"
//                     type="password"
//                     placeholder="Enter Current Password"
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none transition-colors"
//                     {...register("current_password", {
//                       required: "Current password is required",
//                       minLength: {
//                         value: 8,
//                         message: "Password must be at least 8 characters",
//                       },
//                     })}
//                   />
//                   <ErrorMessage
//                     errors={errors}
//                     name="current_password"
//                     render={({ message }) => (
//                       <span className="text-red-500 text-xs mt-1">
//                         {message}
//                       </span>
//                     )}
//                   />
//                 </div>

//                 {/* Confirm Password Field */}
//                 <div className="mb-4">
//                   <label
//                     htmlFor="new_password"
//                     className="block text-sm font-semibold text-gray-700 mb-1"
//                   >
//                     New Password
//                   </label>
//                   <CustomTextField
//                     id="new_password"
//                     type="password"
//                     placeholder="Confirm new password"
//                     className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none transition-colors"
//                     {...register("new_password", {
//                       required: "Please Enter New password",
//                     })}
//                   />
//                   <ErrorMessage
//                     errors={errors}
//                     name="new_password"
//                     render={({ message }) => (
//                       <span className="text-red-500 text-xs mt-1">
//                         {message}
//                       </span>
//                     )}
//                   />
//                 </div>

//                 <div className="mt-6">
//                   <CustomButton
//                     type="submit"
//                     variant="contained"
//                     disabled={changePassword.isPending}
//                     className="w-full py-3 rounded-lg font-medium"
//                   >
//                     {changePassword.isPending ? (
//                       <span className="inline-flex items-center">
//                         <svg
//                           className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                         >
//                           <circle
//                             className="opacity-25"
//                             cx="12"
//                             cy="12"
//                             r="10"
//                             stroke="currentColor"
//                             strokeWidth="4"
//                           ></circle>
//                           <path
//                             className="opacity-75"
//                             fill="currentColor"
//                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                           ></path>
//                         </svg>
//                         Changing...
//                       </span>
//                     ) : (
//                       "Change Password"
//                     )}
//                   </CustomButton>
//                 </div>
//               </form>
//             }
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChangePassword;






"use client";

import { ErrorMessage } from "@hookform/error-message";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons

import Footer from "@/component/Footer";
import { Routes } from "@/config/routes";
import { useChangePassword } from "@/helpers/hooks/forgotPassword/forgotPassword";
import logo from "../../public/images/logo.webp";
import { CustomButton } from "../ThemeRegistry";
import CustomTextField from "@/component/CommonComponents/CustomTextField";

const ChangePassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  // States to toggle password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const onSubmit = (data) => {
    changePassword.mutate(
      {
        current_password: data.current_password,
        new_password: data.new_password,
      },
      
    );
  };

  return (
    <div className="flex flex-col flex-1 bg-gray-50 ">
      <div className="flex-1 flex justify-center items-center px-2 py-3">
        <div className="flex flex-col w-full max-w-md">
          <div className="flex flex-col bg-white rounded-2xl shadow-lg p-6 md:p-8">
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

            {/* Change Password Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Current Password */}
              <div className="flex flex-col mb-4 relative">
                <label htmlFor="current_password" className="block text-sm font-semibold text-gray-700 mb-1">
                  Current Password
                </label>
                <CustomTextField
                  id="current_password"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Enter Current Password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none transition-colors pr-10"
                  {...register("current_password", {
                    required: "Current password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                  })}
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
                <ErrorMessage
                  errors={errors}
                  name="current_password"
                  render={({ message }) => <span className="text-red-500 text-xs mt-1">{message}</span>}
                />
              </div>

              {/* New Password */}
              <div className="mb-4 relative">
                <label htmlFor="new_password" className="block text-sm font-semibold text-gray-700 mb-1">
                  New Password
                </label>
                <CustomTextField
                  id="new_password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none transition-colors pr-10"
                  {...register("new_password", {
                    required: "Please enter new password",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                  })}
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
                <ErrorMessage
                  errors={errors}
                  name="new_password"
                  render={({ message }) => <span className="text-red-500 text-xs mt-1">{message}</span>}
                />
              </div>

              <div className="mt-6">
                <CustomButton
                  type="submit"
                  variant="contained"
                  disabled={changePassword.isPending}
                  className="w-full py-3 rounded-lg font-medium"
                >
                  {changePassword.isPending ? "Changing..." : "Change Password"}
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
