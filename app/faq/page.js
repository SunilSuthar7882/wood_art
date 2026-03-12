// "use client";

// import { Routes } from "@/config/routes";

// import Footer from "@/component/Footer";
// import TestimonialSlider from "@/component/TestimonialSlider";
// import { useToken } from "@/helpers/Cookies/use-token";
// import { authorizationAtom } from "@/helpers/hooks/authorization-atom/authorization-atom";
// import { useLoginByEmailMutation } from "@/helpers/hooks/loginByEmail/loginByEmail";
// import { setLocalStorageItem } from "@/helpers/localStorage";
// import { ErrorMessage } from "@hookform/error-message";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import { CircularProgress } from "@mui/material";
// import { useAtom } from "jotai";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import logo from "../public/images/logo.webp";
// import { useSnackbar } from "./contexts/SnackbarContext";

// export default function Home() {
//   const [showPassword, setShowPassword] = useState(false);
//   const { showSnackbar } = useSnackbar();
//   const router = useRouter();
//   const { setToken } = useToken();
//   const [_, setAuthorized] = useAtom(authorizationAtom);
//   const loginByEmail = useLoginByEmailMutation();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     mode: "onChange",
//   });

//   const onSubmit = (data) => {
//     loginByEmail.mutate(data, {
//       onSuccess: (data) => {
//         setToken(data.data.token);
//         setLocalStorageItem("role", data.data.role);
//         setLocalStorageItem("loginId", data.data.id);
//         setAuthorized(true);
//         router.push(
//           data.data.role === "super_admin"
//             ? Routes.mamAdmin
//             : data.data.role === "admin"
//             ? Routes.trainer
//             : data.data.role === "trainer"
//             ? Routes.customer
//             : data.data.role === "customer"
//             ? Routes.dietPlan
//             : null
//         );
//         router.refresh();
//         showSnackbar(data?.message, "success");
//       },
//       onError: (error) => {
//         showSnackbar(error?.response?.data?.message, "error");
//       },
//     });
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword((prev) => !prev);
//   };

//   return (
//     <>
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         {/* Main content wrapper */}
//         <div className="flex-1 p-4">
//           <div className="w-full grid grid-cols-1 lg:grid-cols-2 lg:gap-8 gap-6 ">
//             <div className="w-full max-w-lg mx-auto space-y-4 lg:space-y-8 flex flex-col lg:min-h-[88vh]">
//               <div className="flex justify-center mb-2 lg:mb-16">
//                 <div className="p-3 rounded-full">
//                   <Image
//                     src={logo}
//                     width={150}
//                     height={150}
//                     alt="brand-logo"
//                     priority
//                     fetchPriority="high"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <div className="space-y-2">
//                   <h1 className="text-3xl sm:text-4xl font-bold">Sign In</h1>
//                   <p className="text-gray-500 text-sm sm:text-base">
//                     Welcome back! Please enter your details
//                   </p>
//                 </div>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                   <div className="mb-4 h-20">
//                     <label
//                       className="block text-gray-700 text-sm font-bold mb-2"
//                       htmlFor="email"
//                     >
//                       Username
//                     </label>
//                     <input
//                       className="bg-transparent appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-green-600"
//                       name="email"
//                       id="emailId"
//                       type="email"
//                       autoComplete="username"
//                       placeholder="Enter your email"
//                       {...register("email", {
//                         required: "This field is required",
//                       })}
//                     />
//                     <ErrorMessage
//                       errors={errors}
//                       name="email"
//                       render={({ message }) => (
//                         <p className="errorMessage">{message}</p>
//                       )}
//                     />
//                   </div>

//                   <div className="mb-4 h-20">
//                     <label className="block text-gray-700 text-sm font-bold mb-2">
//                       Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         placeholder="Enter your password"
//                         type={showPassword ? "text" : "password"}
//                         {...register("password", {
//                           required: "Password is required",
//                         })}
//                         autoComplete="current-password" // ✅ React expects camelCase
//                         className="bg-transparent appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-green-600"
//                       />

//                       <button
//                         type="button"
//                         onClick={togglePasswordVisibility}
//                         className="absolute inset-y-0 right-3 flex items-center text-gray-500"
//                       >
//                         {showPassword ? (
//                           <VisibilityIcon />
//                         ) : (
//                           <VisibilityOffIcon />
//                         )}
//                       </button>
//                     </div>
//                     {errors.password && (
//                       <p className="text-red-500 text-sm">
//                         {errors.password.message}
//                       </p>
//                     )}
//                   </div>
//                   <div className="flex justify-end">
//                     <Link
//                       href={Routes.forgotPassword}
//                       style={{ color: "#00000", fontWeight: "500" }}
//                       className="mb-3 text-sm font-bold"
//                     >
//                       Forgot password?
//                     </Link>
//                   </div>
//                   <button
//                     type="submit"
//                     disabled={loginByEmail.isPending}
//                     className="btn py-3 w-full bg-black hover:bg-gray-800 text-white"
//                   >
//                     <div className="text-white relative">
//                       Continue
//                       {loginByEmail.isPending && (
//                         <CircularProgress
//                           size={18}
//                           sx={{
//                             color: "white",
//                             position: "absolute",
//                             top: 2,
//                             mx: 0.5,
//                           }}
//                         />
//                       )}
//                     </div>
//                   </button>
//                   <div className="flex justify-center m-3 space-x-2">
//                     <span>Don’t have an account yet?</span>
//                     <Link
//                       href={Routes.register}
//                       className="font-medium text-green-600 underline"
//                     >
//                       Sign Up
//                     </Link>
//                   </div>
//                 </form>
//               </div>
//             </div>

//             {/* Feature Section */}
//             <div className="bg-gradient-to-b  from-[#01943C] to-[#003839] p-8 text-white rounded-3xl hidden lg:flex flex-col min-h-[88vh]">
//               <div className="h-full flex flex-col justify-between gap-6 sm:gap-12 lg:gap-20">
//                 <div>
//                   <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
//                     Track your macros and plan meals for a healthier lifestyle.
//                   </h2>
//                   <ul className="list-disc pl-5 space-y-1">
//                     <li>
//                       Take control of your nutrition with personalized meal
//                       planning tools.
//                     </li>
//                     <li>
//                       Easily track calories, macros, and daily intake to meet
//                       your health goals.
//                     </li>
//                     <li>
//                       Get custom meal suggestions based on your preferences and
//                       dietary needs.
//                     </li>
//                     <li>
//                       Whether you’re cutting, bulking, or just eating clean —
//                       we’ve got you covered.
//                     </li>
//                   </ul>
//                 </div>
//                 <TestimonialSlider />
//               </div>
//             </div>
//           </div>

//           {/* Footer Component */}
//         </div>
//         <Footer />
//       </div>
//     </>
//   );
// }

import React from "react";
// pages/index.js
import HomePageHeader from "@/component/HomePageHeader";
import Link from "next/link";
import HomePageFooter from "@/component/HomePageFooter";
import { Calculator, Users, LineChart, Clock, Star } from "lucide-react";
import Image from "next/image";
import hygenicmealimage from "../../public/images/hygenicmealimage.webp";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const services = [
  {
    icon: <Calculator className="w-10 h-10 text-green-600" />,
    title: "Custom Macro Calculations",
    description:
      "Personalized macronutrient targets based on your goals, activity level, and body composition.",
    points: [
      "Body composition analysis",
      "Goal-specific ratios",
      "Real-time adjustments",
    ],
  },
  {
    icon: <Users className="w-10 h-10 text-green-600" />,
    title: "Personal Nutrition Coaching",
    description:
      "One-on-one guidance from certified nutritionists and registered dietitians.",
    points: ["Weekly check-ins", "Meal plan adjustments", "24/7 chat support"],
  },
  {
    icon: <LineChart className="w-10 h-10 text-green-600" />,
    title: "Progress Tracking",
    description:
      "Advanced analytics to monitor your journey and optimize your results.",
    points: [
      "Body metrics tracking",
      "Photo comparisons",
      "Performance insights",
    ],
  },
  {
    icon: <Clock className="w-10 h-10 text-green-600" />,
    title: "Meal Planning & Prep",
    description:
      "Streamlined meal planning with shopping lists and prep instructions.",
    points: ["Weekly meal plans", "Shopping lists", "Prep time optimization"],
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fitness Enthusiast",
    initials: "SJ",
    text: `"Macros & Meals completely transformed my relationship with food. I lost 25 pounds while gaining muscle, and I never felt deprived. The personalized approach made all the difference."`,
  },
  {
    name: "Mike Chen",
    role: "Busy Professional",
    initials: "MC",
    text: `"As someone who travels constantly for work, I thought proper nutrition was impossible. The meal planning service and macro tracking made it so simple. Down 30 pounds in 4 months!"`,
  },
  {
    name: "Emily Rodriguez",
    role: "New Mom",
    initials: "ER",
    text: `"After my pregnancy, I struggled to get back in shape. The nutrition coaching here was patient, understanding, and incredibly effective. I'm now in the best shape of my life!"`,
  },
];

const faqs = [
  {
    question: "How does the personalized diet plan subscription work?",
    answer:
      "Once you subscribe, our registered dietitians will analyze your health goals, lifestyle, and preferences. Based on that, you’ll receive a customized meal plan and macro tracking guidance every week.",
  },
  {
    question: "Can I change or update my meal plan?",
    answer:
      "Yes, you can update your preferences anytime through your profile. Our dietitians will adjust your plan accordingly, whether you want to change ingredients, dietary restrictions, or fitness goals.",
  },
  {
    question: "Do you offer vegetarian, vegan, or gluten-free plans?",
    answer:
      "Absolutely! We provide customized plans for different dietary preferences, including vegetarian, vegan, gluten-free, keto, and low-carb options.",
  },
  {
    question: "How often will I receive new meal plans?",
    answer:
      "Meal plans are refreshed weekly to keep your diet interesting, balanced, and aligned with your current health and fitness goals.",
  },
  {
    question: "Do I get access to a dietitian for questions?",
    answer:
      "Yes, all subscriptions include direct access to certified dietitians for nutrition guidance, plan adjustments, and answering any specific questions.",
  },
  {
    question: "What support do I get with my subscription?",
    answer:
      "Our plans include 24/7 chat support, weekly check-ins with dietitians, progress tracking, and access to a recipe library tailored to your needs.",
  },
  {
    question: "Can I pause my subscription if I’m traveling or busy?",
    answer:
      "Yes, you can pause your subscription at any time and resume when you’re ready, without losing your progress or preferences.",
  },
  {
    question: "Are grocery lists included with the meal plans?",
    answer:
      "Yes, every meal plan comes with an easy-to-follow grocery list to make shopping quick and convenient.",
  },
  {
    question: "Do you track macros and calories for me?",
    answer:
      "Yes, our system calculates and tracks your macros and calories based on your health profile. This helps you stay on target with your fitness goals.",
  },
  {
    question: "Can families or couples use the same subscription?",
    answer:
      "Each subscription is designed for one individual’s personalized plan. However, we offer family and couple plan options where multiple users can receive tailored meal plans under one account.",
  },
  {
    question: "Is there a minimum subscription period?",
    answer:
      "No, you can choose between monthly, quarterly, or yearly subscriptions depending on your preference. You’re free to cancel anytime.",
  },
];

const HomePage = () => {
  return (
    <div className="h-full flex flex-col bg-gray-50 w-full">
      <HomePageHeader />

      <main className="flex-1 flex flex-col overflow-auto w-full">
        {/* Hero Section */}
        <div className="flex flex-col flex-1 overflow-auto">
          <section className=" flex-1 max-w-[1400px] mx-auto px-4  w-full">
            <Container maxWidth="md" sx={{ py: 12 }}>
              <Box textAlign="center" mb={6}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Frequently Asked Questions
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Everything you need to know about our diet planning and
                  nutrition subscriptions.
                </Typography>
              </Box>

              {faqs.map((faq, idx) => (
                <Accordion
                  key={idx}
                  sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: "grey.50",
                      borderRadius: "8px",
                      "&:hover": { backgroundColor: "grey.100" },
                    }}
                  >
                    <Typography fontWeight="600">{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary">{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Container>
          </section>
          <HomePageFooter />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
