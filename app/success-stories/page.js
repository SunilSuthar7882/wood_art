// import React from "react";

// export default function Page() {
//   return <div>Page</div>;
// }

"use client";
import React from "react";
import { Button } from "@mui/material";
import { Card, CardContent } from "@mui/material";
import HomePageHeader from "@/component/HomePageHeader";
import HomePageFooter from "@/component/HomePageFooter";
import {
  Star,
  Quote,
  ArrowRight,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import successHero from "@/public/images/success-hero.webp";
import testimonial1 from "@/public/images/testimonial-1.webp";
import testimonial2 from "@/public/images/testimonial-2.webp";
import testimonial3 from "@/public/images/testimonial-3.webp";
import Image from "next/image";
import { Routes } from "@/config/routes";
import { useRouter } from "next/navigation";

const stats = [
  {
    icon: <Users className="w-8 h-8 text-green-600" />,
    number: "10,000+",
    label: "Lives Transformed",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-green-600" />,
    number: "95%",
    label: "Success Rate",
  },
  {
    icon: <Target className="w-8 h-8 text-green-600" />,
    number: "2.5M",
    label: "Pounds Lost",
  },
];

const successStories = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 32,
    image: testimonial1,
    transformation: "Lost 45 lbs in 6 months",
    quote:
      "The personalized meal plans made all the difference. I finally found a sustainable way to eat healthy without feeling deprived. The support from the nutrition team was incredible!",
    results: [
      "45 lbs weight loss",
      "Improved energy levels",
      "Better sleep quality",
      "Reduced stress eating",
    ],
    timeframe: "6 months",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    age: 41,
    image: testimonial2,
    transformation: "Built muscle & lost 30 lbs",
    quote:
      "After years of yo-yo dieting, I found a program that actually works. The macro tracking approach helped me understand nutrition on a deeper level. I'm in the best shape of my life!",
    results: [
      "30 lbs weight loss",
      "25% muscle gain",
      "Lowered cholesterol",
      "Increased confidence",
    ],
    timeframe: "8 months",
  },
  {
    id: 3,
    name: "Emily Chen",
    age: 28,
    image: testimonial3,
    transformation: "Overcame emotional eating",
    quote:
      "This program didn't just change how I eat, it changed my relationship with food. I learned to fuel my body properly and break free from emotional eating patterns.",
    results: [
      "25 lbs weight loss",
      "Improved mental health",
      "Consistent energy",
      "Healthy habits",
    ],
    timeframe: "4 months",
  },
];

const SuccessStories = () => {
  const router = useRouter();
  return (
    //     <div className="h-full flex flex-col bg-gray-50 w-full">
    //       <HomePageHeader />
    //       <div className="flex-1 flex flex-col overflow-auto w-full">
    //         <div className="flex flex-col bg-gray-50">
    //           <div className="max-w-7xl mx-auto p-4">
    //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    //               <div>
    //                 <h1 className="text-4xl lg:text-6xl font-bold text-green-600 mb-6">
    //                   Real People,{" "}
    //                   <span className="text-green-600">Real Results</span>
    //                 </h1>
    //                 <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
    //                   Discover inspiring transformation stories from our community.
    //                   See how personalized nutrition plans and expert guidance have
    //                   helped thousands achieve their health goals.
    //                 </p>
    //                 <div className="flex flex-col sm:flex-row gap-4">
    //                   <Button variant="contained" size="lg" onClick={() => router.push(Routes.login)}>
    //                     Start Your Journey
    //                     <ArrowRight className="w-5 h-5" />
    //                   </Button>

    //                 </div>
    //               </div>

    //               <div className="relative w-full">
    //                 <Image
    //                 width={"100%"}
    //                   src={successHero}
    //                   alt="Success stories from our community"
    //                   className="rounded-2xl shadow-2xl w-full h-auto"
    //                 />
    //                 <div className="absolute -bottom-6 -left-6 bg-gray-300 p-6 rounded-xl shadow-2xl max-w-xs">
    //                   <div className="flex items-center space-x-2 mb-2">
    //                     {[...Array(5)].map((_, i) => (
    //                       <Star key={i} className="w-4 h-4 fill-green-400 text-black" />
    //                     ))}
    //                   </div>
    //                   <p className="text-sm text-muted-foreground">
    //                     &quot;Life-changing results that last!&quot;
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>

    //             <div className="p-10 bg-surface-card">
    //           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //             <div className="text-center mb-12">
    //               <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
    //                 Our Impact by the Numbers
    //               </h2>
    //               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
    //                 Join thousands of people who have transformed their lives with our proven nutrition programs.
    //               </p>
    //             </div>

    //             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    //               {stats.map((stat, idx) => (
    //                 <Card key={idx} className="text-center hover:shadow-xl transition-all duration-300">
    //                   <CardContent className="p-8">
    //                     <div className="flex justify-center mb-4">
    //                       {stat.icon}
    //                     </div>
    //                     <h3 className="text-4xl font-bold text-foreground mb-2">
    //                       {stat.number}
    //                     </h3>
    //                     <p className="text-muted-foreground font-medium">
    //                       {stat.label}
    //                     </p>
    //                   </CardContent>
    //                 </Card>
    //               ))}
    //             </div>
    //           </div>
    //         </div>

    //            <div className="p-10 bg-surface-light">
    //           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //             <div className="text-center mb-4">
    //               <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
    //                 Transformation Stories
    //               </h2>
    //               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
    //                 Read about the incredible journeys of our community members and get inspired to start your own transformation.
    //               </p>
    //             </div>

    // {/* <div className="space-y-8">
    //   {successStories.map((story, idx) => (
    //     <Card
    //       key={story.id}
    //       className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
    //     >
    //       <CardContent className="p-0">
    //         <div
    //           className={`flex flex-col lg:flex-row items-stretch ${
    //             idx % 2 === 1 ? "lg:flex-row-reverse" : ""
    //           }`}
    //         >
    //           <div className="relative w-full lg:w-1/2 min-h-56">
    //             <Image
    //               fill
    //               src={story.image}
    //               alt={`${story.name} transformation`}
    //               className="object-contain"
    //             />
    //             <div className="absolute top-3 left-12 bg-green-600 text-white px-2.5 py-1 rounded-full text-[11px] font-medium">
    //               {story.timeframe}
    //             </div>
    //           </div>

    //           <div className="p-5 lg:p-6 flex flex-col justify-center w-full lg:w-1/2">
    //             <div className="mb-3">
    //               <Quote className="w-5 h-5 text-green-600 mb-2" />
    //               <blockquote className="text-sm text-muted-foreground italic leading-relaxed mb-3">
    //                 &quot;{story.quote}&quot;
    //               </blockquote>
    //             </div>

    //             <div className="mb-3">
    //               <h3 className="text-lg font-bold text-foreground mb-1">
    //                 {story.name}, {story.age}
    //               </h3>
    //               <p className="text-green-600 font-semibold text-sm">
    //                 {story.transformation}
    //               </p>
    //             </div>

    //             <div className="mb-4">
    //               <h4 className="font-semibold text-foreground mb-1.5 text-sm">
    //                 Key Results:
    //               </h4>
    //               <ul className="space-y-1">
    //                 {story.results.map((result, i) => (
    //                   <li
    //                     key={i}
    //                     className="flex items-center text-muted-foreground text-xs"
    //                   >
    //                     <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
    //                     {result}
    //                   </li>
    //                 ))}
    //               </ul>
    //             </div>
    //           </div>
    //         </div>
    //       </CardContent>
    //     </Card>
    //   ))}
    // </div> */}

    // <div className="flex flex-col justify-center items-center">
    // <div className="space-y-6 flex flex-col max-w-4xl">
    //   {successStories.map((story, idx) => (
    //     <Card
    //       key={story.id}
    //       className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
    //     >
    //       <CardContent className="p-0">
    //         {/* Flex wrapper */}
    //         <div
    //           className={`flex flex-col lg:flex-row items-stretch ${
    //             idx % 2 === 1 ? "lg:flex-row-reverse" : ""
    //           }`}
    //         >
    //           {/* Image */}
    //           <div className="relative w-full lg:w-1/2 min-h-52">
    //             <Image
    //               fill
    //               src={story.image}
    //               alt={`${story.name} transformation`}
    //               className="object-fill" // fills flex height
    //             />
    //             <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-0.5 rounded-full text-[11px] font-medium">
    //               {story.timeframe}
    //             </div>
    //           </div>

    //           {/* Content */}
    //           <div className="p-4 lg:p-6 flex flex-col justify-center w-full lg:w-1/2">
    //             <div className="mb-2">
    //               <Quote className="w-5 h-5 text-green-600 mb-1" />
    //               <blockquote className="text-sm text-muted-foreground italic leading-relaxed mb-2">
    //                 &quot;{story.quote}&quot;
    //               </blockquote>
    //             </div>

    //             <div className="mb-2">
    //               <h3 className="text-base lg:text-lg font-bold text-foreground mb-1">
    //                 {story.name}, {story.age}
    //               </h3>
    //               <p className="text-green-600 font-semibold text-xs lg:text-sm">
    //                 {story.transformation}
    //               </p>
    //             </div>

    //             <div>
    //               <h4 className="font-semibold text-foreground mb-1 text-xs lg:text-sm">
    //                 Key Results:
    //               </h4>
    //               <ul className="space-y-1">
    //                 {story.results.map((result, i) => (
    //                   <li
    //                     key={i}
    //                     className="flex items-center text-muted-foreground text-xs lg:text-sm"
    //                   >
    //                     <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
    //                     {result}
    //                   </li>
    //                 ))}
    //               </ul>
    //             </div>
    //           </div>
    //         </div>
    //       </CardContent>
    //     </Card>
    //   ))}
    // </div>
    // </div>

    //           </div>
    //         </div>

    //         <div className="py-20 bg-gradient-to-r from-green-200 to-green-50">
    //           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    //             <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">
    //               Ready to Write Your Success Story?
    //             </h2>
    //             <p className="text-xl text-black/90 mb-8 leading-relaxed">
    //               Join thousands of people who have transformed their lives with personalized nutrition plans.
    //               Your journey to better health starts with a single step.
    //             </p>

    //           </div>
    //         </div>
    //         </div>
    //         <HomePageFooter />
    //       </div>

    //     </div>

    // <div className="h-full flex flex-col bg-gray-50 w-full">
    //   <HomePageHeader />

    //   <div className="flex-1 flex flex-col overflow-auto w-full">
    //     <div className="flex flex-col bg-gray-50">
    //       <div className="flex flex-col max-w-[1400px] mx-auto py-24 px-8">
    //         <div className="flex flex-col lg:flex-row gap-12 items-center">
    //           {/* Text Section */}
    //           <div className="flex flex-col flex-1">
    //             <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-green-600 mb-6">
    //               Real People,{" "}
    //               <span className="text-green-600">Real Results</span>
    //             </h1>
    //             <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
    //               Discover inspiring transformation stories from our community.
    //               See how personalized nutrition plans and expert guidance have
    //               helped thousands achieve their health goals.
    //             </p>

    //             <div className="flex flex-col sm:flex-row gap-4">
    //               <Button
    //                 variant="contained"
    //                 size="lg"
    //                 className="w-full sm:w-auto"
    //                 onClick={() => router.push(Routes.login)}
    //               >
    //                 Start Your Journey
    //                 <ArrowRight className="w-5 h-5 ml-2" />
    //               </Button>
    //             </div>
    //           </div>

    //           <div className="relative flex-1 w-full">
    //             <Image
    //               src={successHero}
    //               alt="Success stories from our community"
    //               className="rounded-2xl shadow-2xl w-full h-auto object-cover"
    //               layout="responsive"
    //               width={700}
    //               height={500}
    //             />
    //             <div className="absolute -bottom-6 -left-6 bg-gray-300 p-4 sm:p-6 rounded-xl shadow-2xl max-w-[90%] sm:max-w-xs">
    //               <div className="flex items-center space-x-1 mb-2">
    //                 {[...Array(5)].map((_, i) => (
    //                   <Star
    //                     key={i}
    //                     className="w-4 h-4 fill-green-400 text-black"
    //                   />
    //                 ))}
    //               </div>
    //               <p className="text-sm text-muted-foreground">
    //                 &quot;Life-changing results that last!&quot;
    //               </p>
    //             </div>
    //           </div>

    //         </div>
    //       </div>

    //       <div className="flex-flex-col p-10 bg-surface-card">
    //         <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //           <div className="text-center mb-12">
    //             <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
    //               Our Impact by the Numbers
    //             </h2>
    //             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
    //               Join thousands of people who have transformed their lives with
    //               our proven nutrition programs.
    //             </p>
    //           </div>

    //           <div className="flex flex-col md:flex-row gap-8 justify-center">
    //             {stats.map((stat, idx) => (
    //               <Card
    //                 key={idx}
    //                 className="flex-1 text-center hover:shadow-xl transition-all duration-300"
    //               >
    //                 <CardContent className="p-8">
    //                   <div className="flex justify-center mb-4">
    //                     {stat.icon}
    //                   </div>
    //                   <h3 className="text-4xl font-bold text-foreground mb-2">
    //                     {stat.number}
    //                   </h3>
    //                   <p className="text-muted-foreground font-medium">
    //                     {stat.label}
    //                   </p>
    //                 </CardContent>
    //               </Card>
    //             ))}
    //           </div>
    //         </div>
    //       </div>

    //       <div className="flex flex-col p-10 bg-surface-light">
    //         <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //           <div className="text-center mb-4">
    //             <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
    //               Transformation Stories
    //             </h2>
    //             <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
    //               Read about the incredible journeys of our community members
    //               and get inspired to start your own transformation.
    //             </p>
    //           </div>

    //           <div className="flex flex-col justify-center items-center">
    //             <div className="space-y-6 flex flex-col max-w-4xl w-full">
    //              {successStories.map((story, idx) => (
    //   <Card
    //     key={story.id}
    //     className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
    //   >
    //     <CardContent className="p-0">
    //       <div
    //         className={`flex flex-col lg:flex-row items-stretch ${
    //           idx % 2 === 1 ? "lg:flex-row-reverse" : ""
    //         }`}
    //       >
    //         {/* Image */}
    //         <div className="relative w-full lg:w-1/2 aspect-video">
    //           <Image
    //             fill
    //             src={story.image}
    //             alt={`${story.name} transformation`}
    //             className="object-cover rounded-lg"
    //           />
    //           <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-0.5 rounded-full text-[11px] font-medium">
    //             {story.timeframe}
    //           </div>
    //         </div>

    //         <div className="p-4 lg:p-6 flex flex-col justify-center w-full lg:w-1/2">
    //           <div className="mb-2">
    //             <Quote className="w-5 h-5 text-green-600 mb-1" />
    //             <blockquote className="text-sm text-muted-foreground italic leading-relaxed mb-2">
    //               &quot;{story.quote}&quot;
    //             </blockquote>
    //           </div>

    //           <div className="mb-2">
    //             <h3 className="text-base lg:text-lg font-bold text-foreground mb-1">
    //               {story.name}, {story.age}
    //             </h3>
    //             <p className="text-green-600 font-semibold text-xs lg:text-sm">
    //               {story.transformation}
    //             </p>
    //           </div>

    //           <div>
    //             <h4 className="font-semibold text-foreground mb-1 text-xs lg:text-sm">
    //               Key Results:
    //             </h4>
    //             <ul className="space-y-1">
    //               {story.results.map((result, i) => (
    //                 <li
    //                   key={i}
    //                   className="flex items-center text-muted-foreground text-xs lg:text-sm"
    //                 >
    //                   <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
    //                   {result}
    //                 </li>
    //               ))}
    //             </ul>
    //           </div>
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>
    // ))}

    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="py-20 bg-gradient-to-r from-green-200 to-green-50">
    //         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    //           <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6">
    //             Ready to Write Your Success Story?
    //           </h2>
    //           <p className="text-xl text-black/90 mb-8 leading-relaxed">
    //             Join thousands of people who have transformed their lives with
    //             personalized nutrition plans. Your journey to better health
    //             starts with a single step.
    //           </p>
    //         </div>
    //       </div>
    //     </div>

    //     <HomePageFooter />
    //   </div>
    // </div>

    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 w-full">
      <HomePageHeader />

      <div className="flex flex-col flex-1 overflow-auto">
        <div className="mx-auto max-w-[1400px] p-4 w-full">
          {/* Hero Section */}
          {/* <div className="flex flex-col xl:flex-row items-center xl:items-start w-full py-12 md:py-16 lg:py-20 gap-8 xl:gap-16">
            <div className="flex-1 relative text-center lg:text-left">
              <div className="absolute -top-8 -left-8 w-20 h-20 bg-green-100 rounded-full opacity-40 animate-pulse hidden lg:block"></div>
              <div className="absolute -bottom-6 -right-6 w-14 h-14 bg-blue-100 rounded-full opacity-30 animate-pulse hidden lg:block"></div>

              <h1 className="text-5xl  font-bold text-green-600 mb-6">
                Real People,{" "}
                <span className="text-green-700">Real Results</span>
              </h1>
              <p className="text-base  text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Discover inspiring transformation stories from our community.
                See how personalized nutrition plans and expert guidance have
                helped thousands achieve their health goals.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="text-white border"
                  onClick={() => router.push(Routes.login)}
                  variant="contained"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            <div className="flex-1 relative flex justify-center lg:justify-end border">
              <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-green-500/20 border">
                <Image
                  src={successHero}
                  alt="Success stories from our community"
                  width={700}
                  height={500}
                  className="rounded-3xl object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white/80 backdrop-blur-md border border-green-100/60 p-4 sm:p-6 rounded-2xl shadow-xl max-w-[90%] sm:max-w-xs">
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-green-400 text-green-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic">
                  &quot;Life-changing results that last!&quot;
                </p>
              </div>
            </div>
          </div> */}



<div className="flex flex-col md:flex-row items-center md:items-start w-full py-12 md:py-16 lg:py-20 gap-10 md:gap-16">
  {/* Text Section */}
  <div className="flex-1 relative text-center md:text-left">
    {/* Decorative elements (hidden on small) */}
    <div className="absolute -top-8 -left-8 w-16 h-16 bg-green-100 rounded-full opacity-40 animate-pulse hidden lg:block"></div>
    <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-blue-100 rounded-full opacity-30 animate-pulse hidden lg:block"></div>

    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-6 leading-tight">
      Real People,{" "}
      <span className="text-green-700">Real Results</span>
    </h1>

    <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
      Discover inspiring transformation stories from our community. See how
      personalized nutrition plans and expert guidance have helped thousands
      achieve their health goals.
    </p>

   <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
  <Button
    size="lg"
    className="w-auto self-center sm:self-start text-white border"
    onClick={() => router.push(Routes.login)}
    variant="contained"
  >
    Start the Grind
    <ArrowRight className="w-5 h-5 ml-2" />
  </Button>
</div>

  </div>

  {/* Hero Image Section */}
  <div className="flex-1 relative flex justify-center md:justify-end w-full">
    <div className="relative group rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-green-500/20 w-full max-w-md sm:max-w-lg lg:max-w-xl">
      <Image
        src={successHero}
        alt="Success stories from our community"
        width={700}
        height={500}
        className="rounded-2xl sm:rounded-3xl object-cover w-full h-auto transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>

    {/* Floating Review Card */}
    <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white/80 backdrop-blur-md border border-green-100/60 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-xl max-w-[90%] sm:max-w-xs">
      <div className="flex items-center space-x-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-green-400 text-green-400"
          />
        ))}
      </div>
      <p className="text-xs sm:text-sm text-gray-700 italic">
        &quot;Life-changing results that last!&quot;
      </p>
    </div>
  </div>
</div>



          {/* Stats Section */}
          <div className="py-20 bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl shadow-inner my-12 border">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Impact by the Numbers
              </h2>
              <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                Join thousands of people who have transformed their lives with
                our proven nutrition programs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                  <Card
                    key={idx}
                    className="bg-white/80 backdrop-blur-sm border border-green-100/50 p-6 rounded-2xl shadow-md hover:shadow-lg hover:border-green-200/70 transition-all duration-300"
                  >
                    <div className="flex justify-center mb-4 text-green-600">
                      {stat.icon}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.number}
                    </h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Transformation Stories */}
        <div className="my-12 sm:my-16">
  {/* Heading */}
  <div className="text-center mb-8 sm:mb-12 px-4">
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
      Transformation Stories
    </h2>
    <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-xl sm:max-w-2xl mx-auto">
      Read about the incredible journeys of our community members and get
      inspired to start your own transformation.
    </p>
  </div>

  {/* Stories */}
  <div className="flex flex-col gap-6 sm:gap-8 max-w-4xl lg:max-w-5xl mx-auto px-4">
    {successStories.map((story, idx) => (
      <Card
        key={story.id}
        className="overflow-hidden rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl border border-green-100/50 bg-white/90 backdrop-blur-sm transition-all duration-500"
      >
        <div
          className={`flex flex-col lg:flex-row items-stretch ${
            idx % 2 === 1 ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Story Image */}
          {/* Story Image */}
<div className="relative w-full lg:w-1/2">
  <div className="relative w-full h-full min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]">
    <Image
      src={story.image}
      alt={`${story.name} transformation`}
      fill
      className="object-fill w-full h-full "
      sizes="(max-width: 1024px) 100vw, 50vw"
      priority={idx === 0}
    />
    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-green-600 text-white px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
      {story.timeframe}
    </div>
  </div>
</div>


          {/* Story Content */}
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center w-full lg:w-1/2">
            <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2 sm:mb-3" />
            <blockquote className="italic text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg">
              &quot;{story.quote}&quot;
            </blockquote>

            <h3 className="font-bold text-gray-900 text-base sm:text-lg lg:text-xl mb-1">
              {story.name}, {story.age}
            </h3>
            <p className="text-green-600 font-semibold text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
              {story.transformation}
            </p>

            <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
              Key Results:
            </h4>
            <ul className="space-y-1 text-xs sm:text-sm lg:text-base text-gray-600">
              {story.results.map((result, i) => (
                <li key={i} className="flex items-center">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full mr-2"></div>
                  {result}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    ))}
  </div>
</div>


          {/* Call to Action */}
          <div className="py-20 bg-gradient-to-r from-green-200 to-green-50 rounded-3xl shadow-lg text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Write Your Success Story?
            </h2>
            <p className="text-base text-gray-700 mb-8 max-w-2xl mx-auto">
              Join thousands of people who have transformed their lives with
              personalized nutrition plans. Your journey to better health starts
              today.
            </p>

            <Button
              size="lg"
              className="text-white border"
              onClick={() => router.push(Routes.register)}
              variant="contained"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        <HomePageFooter />
      </div>
    </div>
  );
};

export default SuccessStories;
