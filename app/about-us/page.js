// pages/about.js
"use client";
import React from "react";
import HomePageHeader from "@/component/HomePageHeader";
import HomePageFooter from "@/component/HomePageFooter";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Salad,
  BookOpenCheck,
  Star,
  BarChart3,
  PieChart,
  Settings,
  Gauge,
} from "lucide-react";
import Image from "next/image";
import aboutImage from "../../public/images/hygenicmealimage.webp";
import Link from "next/link";
import { Routes } from "@/config/routes";
import { useRouter } from "next/navigation";

const differences = [
  {
    icon: <Salad className="w-10 h-10 text-green-600" />,
    title: "Science-Based Nutrition Plans",
    desc: "Unlike generic diet charts, our plans are customized based on your health profile, activity levels, and goals—making them sustainable long-term.",
  },
  {
    icon: <BookOpenCheck className="w-10 h-10 text-green-600" />,
    title: "Practical Recipes for Real Life",
    desc: "We focus on simple, tasty, and quick-to-cook meals that use everyday ingredients, so healthy eating becomes effortless.",
  },
  {
    icon: <Star className="w-10 h-10 text-green-600" />,
    title: "Beyond Tracking",
    desc: "Most websites only provide calorie/macro tracking. We combine personalized plans, education, and continuous support for real transformation.",
  },
];

const Calculators = [
  {
    icon: <Gauge className="w-10 h-10 text-green-600" />,
    title: "Step:1 Calculate Your BMR",
    steps: [
      "Start by entering your basic details.",
      "Our Basal Metabolic Rate (BMR) calculator determines how many calories your body needs at rest.",
    ],
  },
  {
    icon: <BarChart3 className="w-10 h-10 text-green-600" />,
    title: "Step:2 Find Your TDEE",
    steps: [
      "We’ll calculate your Total Daily Energy Expenditure (TDEE) based on your activity level.",
      "This gives us the exact number of calories your body needs each day to maintain, lose, or gain weight effectively.",
    ],
  },
  {
    icon: <PieChart className="w-10 h-10 text-green-600" />,
    title: "Step:3 Set Your Macros",
    steps: [
      "Once we know your TDEE, we’ll break it down into your ideal macronutrient targets—protein, carbs, and fats.",
      "Your nutrition stays balanced and tailored to your goals.",
    ],
  },
  {
    icon: <Settings className="w-10 h-10 text-green-600" />,
    title: "Step:4 Choose Your Diet & Customize",
    steps: [
      "Select your preferred eating style—carnivore, vegan, high protein, low carb, and more.",
      "Decide how many meals you want per day, and our platform instantly generates a tailored diet plan just for you.",
      "Edit & Personalize: Swap meals or individual foods to suit your tastes and needs.",
      "Easy Recipes: Every meal comes with simple recipes so you can cook confidently at home.",
      "Smart Shopping List: Automatically generate a shopping list with exact quantities, so you never overbuy or miss an ingredient.",
    ],
  },
];

const AboutPage = () => {
  const router = useRouter();
  return (
    // <div className="h-full flex flex-col bg-gray-50 w-full">
    //   <HomePageHeader />

    //   <main className="flex-1 flex flex-col overflow-auto w-full">
    //     {/* Hero Section */}
    //     <section className="flex-1 max-w-[1400px] mx-auto px-4 w-full">
    //       <Container maxWidth="lg" sx={{ py: 10 }}>
    //         <Grid container spacing={6} alignItems="center">
    //           <Grid item xs={12} md={6}>
    //             <Typography variant="h3" fontWeight="bold" gutterBottom>
    //               About Us
    //             </Typography>
    //             <Typography variant="subtitle1" color="text.secondary" paragraph>
    //               At <strong>Macros & Meals</strong>, we believe nutrition should be
    //               simple, personalized, and enjoyable. Our approach goes beyond
    //               traditional calorie counting—we provide complete nutrition
    //               plans, recipe ideas, and ongoing guidance tailored to your
    //               lifestyle.
    //             </Typography>
    //           </Grid>
    //           <Grid item xs={12} md={6}>
    //             <Image
    //               src={aboutImage}
    //               alt="About us"
    //               className="rounded-2xl shadow-lg"
    //             />
    //           </Grid>
    //         </Grid>
    //       </Container>
    //     </section>

    //     {/* Nutrition Plan */}
    //     <section className="py-12">
    //       <Container maxWidth="lg">
    //         <Typography variant="h4" fontWeight="bold" gutterBottom>
    //           Our Nutrition Plan
    //         </Typography>
    //         <Typography color="text.secondary" paragraph>
    //           Every person is unique—and so should be their nutrition. Our
    //           registered dietitians design <strong>personalized plans</strong>
    //           that align with your health goals, whether it’s fat loss, muscle
    //           gain, improved energy, or overall wellness.
    //         </Typography>
    //         <Typography color="text.secondary">
    //           Unlike one-size-fits-all diets, our plans adapt with you. As your
    //           body and goals change, so do your macros, meal suggestions, and
    //           strategies—ensuring progress that lasts.
    //         </Typography>
    //       </Container>
    //     </section>

    //     {/* Recipes */}
    //     <section className="py-12">
    //       <Container maxWidth="lg">
    //         <Typography variant="h4" fontWeight="bold" gutterBottom>
    //           Recipes That Fit Your Life
    //         </Typography>
    //         <Typography color="text.secondary" paragraph>
    //           Eating healthy doesn’t mean eating boring. Our recipe library is
    //           built to be <strong>tasty, quick, and practical</strong>. From
    //           high-protein snacks to balanced meals, you’ll always find options
    //           that suit your taste and time.
    //         </Typography>
    //         <Typography color="text.secondary">
    //           Each recipe comes with exact macro breakdowns and ingredient
    //           alternatives, making it easy to stay consistent no matter where
    //           you are.
    //         </Typography>
    //       </Container>
    //     </section>

    //     {/* How We’re Different */}
    //     <section className="py-12">
    //       <Container maxWidth="lg">
    //         <Typography
    //           variant="h4"
    //           fontWeight="bold"
    //           textAlign="center"
    //           gutterBottom
    //         >
    //           What Makes Us Different
    //         </Typography>
    //         <Grid container spacing={4} mt={2}>
    //           {differences.map((item, idx) => (
    //             <Grid item xs={12} sm={6} md={4} key={idx}>
    //               <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
    //                 <CardContent className="flex flex-col items-center text-center p-6">
    //                   {item.icon}
    //                   <Typography variant="h6" fontWeight="bold" mt={2}>
    //                     {item.title}
    //                   </Typography>
    //                   <Typography color="text.secondary" mt={1}>
    //                     {item.desc}
    //                   </Typography>
    //                 </CardContent>
    //               </Card>
    //             </Grid>
    //           ))}
    //         </Grid>
    //       </Container>
    //     </section>

    //     <HomePageFooter />
    //   </main>
    // </div>

    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 w-full">
      <HomePageHeader />

      <div className="flex flex-col flex-1 overflow-auto">
        <div className="mx-auto max-w-[1400px] p-4 w-full">
          {/* Hero About Section */}
          <div className="flex xs:flex-col sm:flex-col md:flex-col lg:flex-row xl:flex-row items-center xl:items-start w-full py-12 md:py-16 lg:py-20 gap-8 xl:gap-16">
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left relative">
              {/* Decorative elements */}
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-green-100 rounded-full opacity-40 animate-pulse hidden lg:block"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-100 rounded-full opacity-30 animate-pulse hidden lg:block"></div>

              <div className="relative z-10">
                <h1 className="text-5xl  text-green-600 font-bold mb-6">
                  About Us
                </h1>
                <h4 className="text-lg  text-green-600 font-bold mb-2">
                  Welcome to Macro And Meals – Nutrition Made Simple, Personal,
                  and Practical
                </h4>
                <div className="space-y-4 text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl">
                  <p className="text-base">
                    At{" "}
                    <strong className="text-green-700 font-bold">
                      Macros & Meals
                    </strong>
                    , we believe that building a sustainable, effective diet
                    plan shouldn&apos;t be complicated or overwhelming. Our
                    mission is to empower you with the tools and knowledge to
                    take control of your nutrition—no matter your lifestyle,
                    dietary preferences, or fitness goals.
                  </p>
                  <h4 className="text-lg  text-green-600 font-bold mb-0">
                    What We Do
                  </h4>
                  <p className="text-base">
                    Macro And Meals is an all-in-one online platform that helps
                    you create a personalized diet plan in just three easy
                    steps. Whether you&apos;re aiming to lose weight, gain
                    muscle, or simply eat healthier, our science-based approach
                    makes meal planning straightforward and stress-free.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex justify-center lg:justify-end relative max-w-[600px]">
              {/* Floating elements around image */}
              <div className="relative w-12 h-12 bg-green-200 rounded-full opacity-50 animate-bounce"></div>
              <div className="relative w-10 h-10 bg-blue-200 rounded-full opacity-40 animate-bounce delay-500"></div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                <Image
                  src={aboutImage}
                  alt="About us"
                  className="relative rounded-2xl shadow-2xl shadow-green-500/20 transform group-hover:scale-105 group-hover:-rotate-1 transition-all duration-500 border-4 border-white/50 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 my-2">
            <div className="max-w-[1400px] mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
                How It Works
              </h2>

              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                {Calculators.map((calc, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 
                transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20
                border border-green-100/50 hover:bg-white hover:border-green-200/70 group
                w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]
                min-w-[280px] max-w-[350px]"
                  >
                    {/* Icon Section - Fixed Height */}
                    <div className="flex justify-center mb-6">
                      <div
                        className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-4
                    group-hover:from-green-200 group-hover:to-emerald-200 
                    transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                      >
                        <div className="transform group-hover:scale-110 transition-transform duration-300">
                          {calc.icon}
                        </div>
                      </div>
                    </div>

                    {/* Title Section - Fixed Height */}
                    <div className="text-center mb-6 h-16 flex items-center justify-center">
                      <h3
                        className="font-semibold text-xl text-gray-900 group-hover:text-green-700 
                  transition-colors duration-300 leading-tight"
                      >
                        {calc.title}
                      </h3>
                    </div>

                    {/* Steps Section - Natural Height with Overflow */}
                    <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-50">
                      <ol className="text-sm text-left space-y-3 leading-relaxed list-decimal list-inside pr-2">
                        {calc.steps.map((step, i) => (
                          <li
                            key={i}
                            className="group-hover:translate-x-1 transition-transform duration-300 
                        text-gray-700 group-hover:text-gray-800"
                          >
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Step counter at the bottom */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Sections */}

          {/* <div className="flex flex-col gap-6 text-gray-700 text-base leading-relaxed">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-green-100/50">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                Once you're happy with your plan, you can:
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <span className="font-semibold text-green-700">
                    Download or Print:
                  </span>{" "}
                  Access your plan anytime from your account.
                </li>
                <li>
                  <span className="font-semibold text-green-700">
                    Email Delivery:
                  </span>{" "}
                  Get your complete plan and shopping list sent straight to your
                  inbox.
                </li>
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-green-100/50">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                Why Choose Macro And Meals?
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <span className="font-semibold text-green-700">
                    Personalized:
                  </span>{" "}
                  Every plan is built around your unique body, goals, and
                  preferences.
                </li>
                <li>
                  <span className="font-semibold text-green-700">
                    Flexible:
                  </span>{" "}
                  Edit your plan, swap recipes, and adjust your meals as you go.
                </li>
                <li>
                  <span className="font-semibold text-green-700">
                    Practical:
                  </span>{" "}
                  Get recipes and organized shopping lists to save time and
                  money.
                </li>
                <li>
                  <span className="font-semibold text-green-700">
                    Inclusive:
                  </span>{" "}
                  Supports all major diet types and lifestyles.
                </li>
              </ul>
              <p className="mt-4">
                Take the guesswork out of healthy eating. Let Macro And Meals
                guide you every step of the way—so you can focus on enjoying
                food, feeling great, and reaching your goals.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-md border border-green-100/50">
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                A Note from Our Founder
              </h2>
              <blockquote className="italic border-l-4 border-green-400 pl-4 text-gray-700">
                "As a certified personal trainer with over 23 years of
                experience in fitness and nutrition, I've seen firsthand how
                confusing and frustrating diet planning can be. I created Macro
                And Meals to simplify the process, combining science-backed
                tools with real-world practicality. My goal is to help you build
                a plan that works for your life—so you can spend less time
                stressing about food, and more time enjoying results."
              </blockquote>
              <p className="mt-4 font-semibold text-green-700">
                — Mike Burns, Founder
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch gap-8">
            <div className="flex flex-col flex-1">
              <h1 className="text-2xl text-green-600 font-bold mb-6 text-left">
                Our Nutrition Plan
              </h1>
              <div className="flex-1 space-y-6 text-gray-600 text-base leading-relaxed">
                <p className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md border border-green-100/50">
                  Every person is unique—and so should be their nutrition. Our
                  <span className="text-green-700 font-bold">
                    {" "}
                    registered dietitians
                  </span>{" "}
                  design{" "}
                  <strong className="text-green-600">
                    personalized plans
                  </strong>{" "}
                  that align with your health goals, whether it&apos;s fat loss,
                  muscle gain, improved energy, or overall wellness.
                </p>
                <p className="bg-white/60 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md border border-green-100/50">
                  Unlike one-size-fits-all diets, our plans adapt with you. As
                  your body and goals change, so do your macros, meal
                  suggestions, and strategies—ensuring
                  <span className="text-green-600 font-semibold">
                    {" "}
                    progress that lasts
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="flex flex-col flex-1">
              <h1 className="text-2xl text-green-600 font-bold mb-6 text-left">
                Recipes That Fit Your Life
              </h1>
              <div className="flex-1 space-y-6 text-gray-600 text-base leading-relaxed">
                <p className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md border border-green-100/50">
                  Eating healthy doesn&apos;t mean eating boring. Our recipe
                  library is built to be{" "}
                  <strong className="text-green-600">
                    tasty, quick, and practical
                  </strong>
                  . From high-protein snacks to balanced meals, you&apos;ll
                  always find options that suit your taste and time.
                </p>
                <p className="bg-white/60 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md border border-green-100/50">
                  Each recipe comes with exact macro breakdowns and ingredient
                  alternatives, making it easy to stay consistent no matter
                  where you are.
                </p>
              </div>
            </div>
          </div> */}

          <div className="space-y-12 my-8">
            {/* New Intro Section */}
            <div className="flex flex-col gap-6 text-gray-700 text-base leading-relaxed">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-green-100/50">
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  Once you&apos;re happy with your plan, you can:
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <span className="font-semibold text-green-700">
                      Download or Print:
                    </span>{" "}
                    Access your plan anytime from your account.
                  </li>
                  <li>
                    <span className="font-semibold text-green-700">
                      Email Delivery:
                    </span>{" "}
                    Get your complete plan and shopping list sent straight to
                    your inbox.
                  </li>
                </ul>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-green-100/50">
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  Why Choose Macro And Meals?
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <span className="font-semibold text-green-700">
                      Personalized:
                    </span>{" "}
                    Every plan is built around your unique body, goals, and
                    preferences.
                  </li>
                  <li>
                    <span className="font-semibold text-green-700">
                      Flexible:
                    </span>{" "}
                    Edit your plan, swap recipes, and adjust your meals as you
                    go.
                  </li>
                  <li>
                    <span className="font-semibold text-green-700">
                      Practical:
                    </span>{" "}
                    Get recipes and organized shopping lists to save time and
                    money.
                  </li>
                  <li>
                    <span className="font-semibold text-green-700">
                      Inclusive:
                    </span>{" "}
                    Supports all major diet types and lifestyles.
                  </li>
                </ul>
                <p className="mt-4">
                  Take the guesswork out of healthy eating. Let Macro And Meals
                  guide you every step of the way—so you can focus on enjoying
                  food, feeling great, and reaching your goals.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-md border border-green-100/50">
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  A Note from Our Founder
                </h2>
                <blockquote className="italic border-l-4 border-green-400 pl-4 text-gray-700">
                  &quot;As a certified personal trainer with over 23 years of
                  experience in fitness and nutrition, I&apos;ve seen firsthand
                  how confusing and frustrating diet planning can be. I created
                  Macro And Meals to simplify the process, combining
                  science-backed tools with real-world practicality. My goal is
                  to help you build a plan that works for your life—so you can
                  spend less time stressing about food, and more time enjoying
                  results.&quot;
                </blockquote>
                <p className="mt-4 font-semibold text-green-700">
                  — Mike Burns, Founder
                </p>
              </div>
            </div>

            {/* Existing Sections */}
            {/* <div className="flex flex-col lg:flex-row items-stretch gap-8">
              <div className="flex flex-col flex-1">
                <h1 className="text-2xl text-green-600 font-bold mb-6 text-left">
                  Our Nutrition Plan
                </h1>
                <div className="flex-1 space-y-6 text-gray-600 text-base leading-relaxed">
                  <p className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md border border-green-100/50">
                    Every person is unique—and so should be their nutrition. Our
                    <span className="text-green-700 font-bold">
                      {" "}
                      registered dietitians
                    </span>{" "}
                    design{" "}
                    <strong className="text-green-600">
                      personalized plans
                    </strong>{" "}
                    that align with your health goals, whether it&apos;s fat
                    loss, muscle gain, improved energy, or overall wellness.
                  </p>
                  <p className="bg-white/60 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md border border-green-100/50">
                    Unlike one-size-fits-all diets, our plans adapt with you. As
                    your body and goals change, so do your macros, meal
                    suggestions, and strategies—ensuring
                    <span className="text-green-600 font-semibold">
                      {" "}
                      progress that lasts
                    </span>
                    .
                  </p>
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <h1 className="text-2xl text-green-600 font-bold mb-6 text-left">
                  Recipes That Fit Your Life
                </h1>
                <div className="flex-1 space-y-6 text-gray-600 text-base leading-relaxed">
                  <p className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-md border border-green-100/50">
                    Eating healthy doesn&apos;t mean eating boring. Our recipe
                    library is built to be{" "}
                    <strong className="text-green-600">
                      tasty, quick, and practical
                    </strong>
                    . From high-protein snacks to balanced meals, you&apos;ll
                    always find options that suit your taste and time.
                  </p>
                  <p className="bg-white/60 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-sm hover:shadow-md border border-green-100/50">
                    Each recipe comes with exact macro breakdowns and ingredient
                    alternatives, making it easy to stay consistent no matter
                    where you are.
                  </p>
                </div>
              </div>
            </div> */}
          </div>

          {/* <div className="flex flex-col gap-8 md:gap-12 items-center my-16 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-green-50/40 to-transparent"></div>

            <div className="relative text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 ">
                What Makes Us Different
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-600 mx-auto rounded-full"></div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 w-full mt-8">
              {differences.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 
                         w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]
                         min-w-[280px] max-w-[380px]
                        p-4
                         border border-green-100/50 hover:border-green-200/70
                         transform hover:scale-105 hover:-translate-y-2 group
                         relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10 flex flex-col items-center h-full">
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-4 mb-4  group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                      <div className=" text-green-600">{item.icon}</div>
                    </div>

                    <h3 className="text-xl  font-bold text-gray-900 mb-4 md:mb-6 group-hover:text-green-700 transition-colors duration-300">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-base leading-relaxed flex-1 group-hover:text-gray-700 transition-colors duration-300">
                      {item.desc}
                    </p>

                    <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mt-6 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 md:mt-20 text-center relative z-10">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8  border border-green-100/50 max-w-4xl mx-auto transform hover:scale-105 transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 ">
                    Ready to Start Your Journey?
                  </h3>
                  <p className="text-gray-600 text-lg  leading-relaxed mb-8 max-w-2xl mx-auto">
                    Join thousands who have transformed their relationship with
                    food and achieved lasting results.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={() => router.push(Routes.register)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white 
               px-3 py-2 rounded-lg font-medium text-sm 
               shadow-md hover:shadow-lg hover:shadow-green-500/25"
                    >
                      Get Your Custom Plan
                    </button>
                    
                  </div>
                </div>
              </div>
            </div>

          </div> */}
        </div>

        <HomePageFooter />
      </div>
    </div>
  );
};

export default AboutPage;
