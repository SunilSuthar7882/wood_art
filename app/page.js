

// // "use client";
// // import React from "react";
// // import HomePageHeader from "@/component/HomePageHeader";
// // import Link from "next/link";
// // import HomePageFooter from "@/component/HomePageFooter";
// // import {
// //   Calculator,
// //   Users,
// //   LineChart,
// //   Clock,
// //   Star,
// //   BookOpen,
// //   Flame,
// //   Activity,
// //   Utensils,
// //   PieChart,
// //   BarChart3,
// //   Gauge,
// //   Settings,
// // } from "lucide-react";
// // import Image from "next/image";
// // import hygenicmealimage from "../public/images/hygenicmealimage.webp";
// // import { Routes } from "@/config/routes";
// // import { useRouter } from "next/navigation";




// // const HomePage = () => {
// //   const router = useRouter();
// //   return (


// //     <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 w-full">
// //       <HomePageHeader />

// //       <div className="flex flex-col flex-1 overflow-auto">
// //         <div
// //           className="flex flex-col max-w-[1400px] mx-auto p-4 w-full"
// //           id="top"
// //         >


// //           <div className="flex flex-row flex-wrap justify-between items-center w-full py-12 md:py-16 lg:py-20 gap-8">
// //             {/* Left Side (Text) */}
// //             <div className="flex-1 basis-[320px] min-w-[280px] flex flex-col w-full max-w-2xl text-center md:text-left mb-24">
// //               <div className="mb-8">
// //                 <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
// //                   <span className="block">Smarter Nutrition.</span>
// //                   {/* <span className="block">With</span> */}
// //                   <span className="block text-green-600 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 bg-clip-text">
// //                     Stronger Results.
// //                   </span>
// //                 </h1>
// //               </div>

// //               <p className="text-base text-gray-600 leading-relaxed mb-8 md:mb-10 font-medium">
// //                 Know your numbers.
// //                 <span className="text-green-600 font-semibold">
// //                   {" "}
// //                   Master your macros.
// //                 </span>
// //                 . Plan your meals.
// //                 {/* <span className="text-green-600 font-semibold"> real results</span>. */}
// //               </p>

// //               <div className="flex justify-center md:justify-start">
// //                 <button
// //                   onClick={() => router.push(Routes.register)}
// //                   className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
// //                 >
// //                   Start the Grind
// //                 </button>
// //               </div>


// //             </div>

// //             {/* Right Side (Image) */}
// //             <div className="flex-1 basis-[320px] min-w-[280px] relative w-full max-w-md lg:max-w-lg xl:max-w-xl h-64 sm:h-80 lg:h-96 mx-auto ">
// //               <div className="absolute -top-6 -left-6 w-12 h-12 bg-green-200 rounded-full opacity-60 animate-bounce"></div>
// //               <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-blue-200 rounded-full opacity-50 animate-bounce"></div>

// //               <div className="relative rounded-3xl shadow-2xl shadow-green-500/20 transition-all duration-500 hover:scale-105 hover:rotate-2 hover:shadow-green-500/30 group">
// //                 <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-100 via-emerald-100 to-blue-100 p-2 group-hover:from-green-200 group-hover:via-emerald-200 group-hover:to-blue-200 transition-all duration-500" />
// //                 <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white shadow-lg">
// //                   <Image
// //                     src={hygenicmealimage}
// //                     alt="Meal Prep"
// //                     className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
// //                   />
// //                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>



// //           {/* <div className="bg-gradient-to-br from-green-50 to-emerald-50 ">
// //             <div className="max-w-[1400px] w-full mx-auto">
// //               <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
// //                 How It Works
// //               </h2>

// //               <div className="flex flex-wrap justify-center gap-6 md:gap-8">
// //                 {Calculators.map((calc, idx) => (
// //                   <div
// //                     key={idx}
// //                     className="flex flex-col bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 
// //                 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20
// //                 border border-green-100/50 hover:bg-white hover:border-green-200/70 group
// //                 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]
// //                 min-w-[280px] max-w-[350px]"
// //                   >
// //                     <div className="flex justify-center mb-6">
// //                       <div
// //                         className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-4
// //                     group-hover:from-green-200 group-hover:to-emerald-200 
// //                     transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
// //                       >
// //                         <div className="transform group-hover:scale-110 transition-transform duration-300">
// //                           {calc.icon}
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <div className="text-center mb-6 h-16 flex items-center justify-center">
// //                       <h3 className="font-semibold text-xl text-gray-900 group-hover:text-green-700 
// //                   transition-colors duration-300 leading-tight">
// //                         {calc.title}
// //                       </h3>
// //                     </div>

// //                     <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-50">
// //                       <ol className="text-sm text-left space-y-3 leading-relaxed list-decimal list-inside pr-2">
// //                         {calc.steps.map((step, i) => (
// //                           <li
// //                             key={i}
// //                             className="group-hover:translate-x-1 transition-transform duration-300 
// //                         text-gray-700 group-hover:text-gray-800"
// //                           >
// //                             {step}
// //                           </li>
// //                         ))}
// //                       </ol>
// //                     </div>


// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           <div className="flex flex-col py-16 md:py-20 relative" id="services">
// //             <div className="absolute top-10 left-1/4 w-32 h-32 bg-green-100 rounded-full opacity-30 animate-pulse"></div>
// //             <div className="absolute bottom-10 right-1/4 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>

// //             <div className="relative z-10">
// //               <h2 className="text-center text-4xl font-bold text-gray-900 mb-4">
// //                 Your Nutrition, Simplified
// //               </h2>
// //               <p className="text-center mt-4 text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
// //                 From personalized macro calculations to streamlined meal
// //                 planning, we give you everything you need to reach your
// //                 nutrition goals—backed by expert guidance.
// //               </p>

// //               <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-6 md:gap-8 items-stretch">
// //                 {services.map((service, idx) => (
// //                   <div
// //                     key={idx}
// //                     className="flex flex-col items-center text-center bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-4 
// //                  transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20
// //                  w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]
// //                  min-w-[300px] max-w-[350px] border border-green-100/50
// //                  hover:bg-white hover:border-green-200/70 group"
// //                   >
// //                     <div
// //                       className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-4 mb-4 
// //                       group-hover:from-green-200 group-hover:to-emerald-200 
// //                       transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
// //                     >
// //                       <div className="transform group-hover:scale-110 transition-transform duration-300">
// //                         {service.icon}
// //                       </div>
// //                     </div>

// //                     <h3 className="font-semibold text-lg md:text-xl text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">
// //                       {service.title}
// //                     </h3>

// //                     <p className="text-gray-600 text-sm mt-2 mb-6 leading-relaxed flex-1">
// //                       {service.description}
// //                     </p>

// //                     <ul className="text-sm text-left space-y-3 w-full flex-1">
// //                       {service.points.map((point, i) => (
// //                         <li
// //                           key={i}
// //                           className="flex items-start gap-3 group-hover:translate-x-1 transition-transform duration-300"
// //                         >
// //                           <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform duration-300"></span>
// //                           <span className="flex-1 text-gray-700">{point}</span>
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           <div className="flex flex-col text-center w-full relative">

// //             <div className="relative z-10">
// //               <h3 className="text-4xl font-bold text-gray-900 mb-4">
// //                 Transformations That Speak for Themselves
// //               </h3>
// //               <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
// //                 Join the community of thousands achieving their nutrition goals.
// //               </p>



// //               <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
// //                 {testimonials.map((t, idx) => (
// //                   <div
// //                     key={idx}
// //                     className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl 
// //                  p-6 md:p-8 text-left border border-gray-100 hover:border-green-200 
// //                  transition-all duration-500 flex flex-col hover:scale-105 hover:-translate-y-2 
// //                  group relative overflow-hidden"
// //                   >
// //                     <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

// //                     <div className="relative z-10">
// //                       <div className="flex text-yellow-400 mb-6 gap-1">
// //                         {Array(5)
// //                           .fill(0)
// //                           .map((_, i) => (
// //                             <Star
// //                               key={i}
// //                               className="w-5 md:w-6 h-5 md:h-6 fill-current transform group-hover:scale-110 transition-transform duration-300"
// //                             />
// //                           ))}
// //                       </div>

// //                       <p className="text-gray-700 italic leading-relaxed flex-1 text-base mb-8 group-hover:text-gray-800 transition-colors duration-300">
// //                         &quot;{t.text}&quot;
// //                       </p>

// //                       <div className="flex items-center gap-4 mt-auto">
// //                         {t.image ? (
// //                           <div className="relative">
// //                             <Image
// //                               src={t.image}
// //                               alt={t.name}
// //                               width={48}
// //                               height={48}
// //                               className="w-10 h-10 rounded-full object-cover border-2 border-green-100 group-hover:border-green-300 transition-all duration-300 group-hover:scale-110"
// //                             />
// //                             <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
// //                           </div>
// //                         ) : (
// //                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-green-600 font-bold border-2 border-green-100 text-sm group-hover:from-green-200 group-hover:to-emerald-200 group-hover:scale-110 group-hover:border-green-300 transition-all duration-300">
// //                             {t.initials}
// //                           </div>
// //                         )}
// //                         <div className="flex-1">
// //                           <h4 className="text-gray-900 font-bold text-base group-hover:text-green-700 transition-colors duration-300">
// //                             {t.name}
// //                           </h4>
// //                           <p className="text-gray-500 text-sm font-medium">
// //                             {t.role}
// //                           </p>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>


// //             </div>
// //           </div> */}
// //         </div>
// //         <HomePageFooter />
// //       </div>
// //     </div>
// //   );
// // };

// // export default HomePage;





















// //     window.addEventListener("scroll", handleScroll);
// //     return () => window.removeEventListener("scroll", handleScroll);
// //   }, []);

// //   return (
// //     // Added min-h-[200vh] so the page is scrollable, allowing you to see the effect!
// //     <div className="min-h-[200vh] flex flex-col bg-white w-full overflow-hidden text-[#1a1a1a]">
// //       <HomePageHeader />

// //       <main className="flex-1 flex flex-col relative w-full pt-32 pb-12">

// //         {/* =========================================
// //             FLEX LAYOUT (Prevents Overlap)
// //             ========================================= */}
// //         <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-24 gap-4 md:gap-8 z-10">

// //           {/* Left Text Block */}
// //           <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right w-full">
// //             <span className="text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-gray-500 mb-2 md:pr-2">
// //               Artisanal Craft
// //             </span>
// //             <h1 className="text-[18vw] md:text-[8vw] xl:text-[140px] font-black uppercase leading-none tracking-tighter text-[#1a1a1a]">
// //               WOOD
// //             </h1>
// //           </div>

// //           {/* INVISIBLE PLACEHOLDER: 
// //               This holds the physical space between the words so the flexbox 
// //               doesn't collapse. The actual image floats perfectly over this. */}
// //           <div className="flex-none w-[80%] max-w-[280px] md:max-w-[340px] lg:max-w-[400px] aspect-[4/5] opacity-0 pointer-events-none"></div>

// //           {/* Right Text Block */}
// //           <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full mt-4 md:mt-0">
// //             <h1 className="text-[18vw] md:text-[8vw] xl:text-[140px] font-black uppercase leading-none tracking-tighter text-[#1a1a1a] md:translate-y-[30px]">
// //               ART
// //             </h1>
// //             <p className="mt-4 text-gray-500 text-base lg:text-lg leading-relaxed max-w-xs xl:max-w-sm">
// //               Sustainable, premium wood furniture designed to elevate your living spaces.
// //             </p>
// //           </div>
// //         </div>

// //         {/* Scroll Indicator (Tells user to scroll down) */}
// //         <div className={`absolute top-[85vh] left-1/2 -translate-x-1/2 flex flex-col items-center transition-opacity duration-500 ${isScrolled ? "opacity-0" : "opacity-100"}`}>
// //           <span className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">Scroll</span>
// //           <div className="w-1 h-8 bg-gray-200 rounded-full overflow-hidden">
// //             <div className="w-full h-1/2 bg-[#2a2a2a] rounded-full animate-bounce"></div>
// //           </div>
// //         </div>

// //         {/* =========================================
// //             THE ANIMATED IMAGE (Fixed to screen)
// //             ========================================= */}
// //         <div
// //           className={`fixed z-50 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] [transform-style:preserve-3d] ${
// //             isScrolled
// //               ? "top-[calc(100vh-2rem)] left-[calc(100vw-2rem)] -translate-x-full -translate-y-full w-[160px] md:w-[220px] aspect-[4/5] [transform:rotateY(180deg)]"
// //               : "top-32 md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 w-[80%] max-w-[280px] md:max-w-[340px] lg:max-w-[400px] aspect-[4/5] [transform:rotateY(0deg)]"
// //           }`}
// //         >
// //           {/* FRONT OF CARD (The Photo) */}
// //           <div className="absolute inset-0 w-full h-full rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl overflow-hidden bg-gray-100 [backface-visibility:hidden]">
// //             <Image
// //               src={heroFurnitureImage}
// //               alt="Handcrafted Wood Furniture"
// //               fill
// //               className="object-cover"
// //               priority
// //             />
// //             {/* Front Floating Circle Button (Only clickable when not scrolled) */}
// //             <button 
// //               onClick={() => router.push('/shop')}
// //               className={`absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 w-24 h-24 md:w-32 md:h-32 bg-[#2a2a2a] hover:bg-black transition-all duration-300 rounded-full flex items-center justify-center text-white shadow-2xl group ${isScrolled ? "pointer-events-none opacity-0" : "opacity-100"}`}
// //             >
// //               <span className="text-xl lg:text-2xl font-medium group-hover:-translate-y-1 transition-transform">Shop</span>
// //             </button>
// //           </div>

// //           {/* BACK OF CARD (Visible when flipped to the bottom right) */}
// //           <div className="absolute inset-0 w-full h-full rounded-[1.5rem] shadow-2xl overflow-hidden bg-[#1a1a1a] flex flex-col items-center justify-center text-center p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
// //             <h3 className="text-white font-black text-2xl uppercase tracking-widest mb-2">Wood <br/> Art</h3>
// //             <div className="w-12 h-1 bg-white/20 rounded-full mb-4"></div>
// //             <button 
// //               onClick={() => router.push('/shop')}
// //               className="px-6 py-2 bg-white text-black text-sm font-semibold rounded-full hover:scale-105 transition-transform"
// //             >
// //               Shop Now
// //             </button>
// //           </div>
// //         </div>

// //       </main>
// //     </div>
// //   );
// // };

// // export default HomePage;












// "use client";
// import React, { useState, useEffect } from "react";
// import HomePageHeader from "@/component/HomePageHeader"; // Adjust your import paths
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// // Replace with your actual image file
// import heroFurnitureImage from "../public/images/hygenicmealimage.webp";

// const HomePage = () => {
//   const router = useRouter();
// //   const [isScrolled, setIsScrolled] = useState(false);

// // useEffect(() => {
// //   const handleScroll = () => {
// //     setIsScrolled(window.scrollY > 150); // adjust trigger
// //   };

// //   window.addEventListener("scroll", handleScroll);
// //   return () => window.removeEventListener("scroll", handleScroll);
// // }, []);

// //   return (
// //     // Set a minimum height (e.g., 200vh) to ensure the page is scrollable!
// //     <div className="h-full flex flex-col bg-white w-full overflow-auto text-[#1a1a1a]">
// //       <HomePageHeader />

// //       <div className="relative flex flex-1 w-full ">

// //         {/* =========================================
// //             1. FLEX LAYOUT (Prevents text overlap)
// //             ========================================= */}
// //         <div className="flex flex-row items-center justify-center w-full ">

// //           {/* Left Side: WOOD */}
// //           <div className="flex-1 flex  pl-2 md:pl-2">
// //             <div className="flex flex-col items-end pl-20">
// //               <span className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-gray-500 mb-2">
// //                 Artisanal Craft
// //               </span>
// //               <h1 className="text-[14vw] lg:text-[80px] xl:text-[110px] font-black uppercase leading-none tracking-tighter text-[#1a1a1a]">
// //                 WOOD
// //               </h1>
// //             </div>
// //           </div>


// //       {/* CENTER IMAGE */}
// // <div
// //   className={`absolute z-50 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]
// //   [transform-style:preserve-3d] shadow-2xl

// //   ${
// //     isScrolled
// //       // AFTER SCROLL → move to next section right side + flip
// //       ? "top-[120vh] right-[8%] w-[160px] md:w-[220px] rotate-y-180"

// //       // INITIAL → perfectly centered between WOOD & ART
// //       : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] lg:w-[420px]"
// //   }

// //   aspect-[4/5] rounded-[2rem]
// //   `}
// // >
// //   <div className="absolute inset-0 w-full h-full rounded-inherit overflow-hidden bg-gray-100 [backface-visibility:hidden]">
// //     <Image
// //       src={heroFurnitureImage}
// //       alt="Handcrafted Wood Furniture"
// //       fill
// //       className="object-cover"
// //       priority
// //     />
// //   </div>
// // </div>
// //           {/* Right Side: ART */}
// //           <div className="flex-1 flex justify-start pl-2 md:pl-12">
// //             <div className="flex flex-col items-start mt-12 md:mt-24">
// //               <h1 className="text-[14vw] lg:text-[80px] xl:text-[110px] font-black uppercase leading-none tracking-tighter text-[#1a1a1a]">
// //                 ART
// //               </h1>
// //               <p className="mt-4 text-gray-500 text-xs md:text-base lg:text-lg leading-relaxed max-w-[200px] md:max-w-[250px]">
// //                 Sustainable, premium wood furniture designed to elevate your living spaces.
// //               </p>
// //             </div>
// //           </div>
// //         </div>




// //       </div>

// //       {/* Extra content block just to make the page scrollable 
// //         so you can test the animation. You can delete this later. 
// //       */}
// //       <section className="mt-[40vh] max-w-[1400px] mx-auto px-8 w-full">
// //         <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">Trending Pieces</h2>
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //           <div className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
// //           <div className="h-64 bg-gray-100 rounded-2xl animate-pulse delay-75"></div>
// //           <div className="h-64 bg-gray-100 rounded-2xl animate-pulse delay-150"></div>
// //         </div>
// //       </section>

// //     </div>

// const [isScrolled, setIsScrolled] = useState(false);

// useEffect(() => {
// const handleScroll = () => {
// setIsScrolled(window.scrollY > 200);
// };

// window.addEventListener("scroll", handleScroll);
// return () => window.removeEventListener("scroll", handleScroll);

// }, []);


//   return (

//   );
// };

// export default HomePage;











// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import heroFurnitureImage from "../public/images/hygenicmealimage.webp";
// import HomePageHeader from "@/component/HomePageHeader";

// const HomePage = () => {
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     // Triggers the animation when scrolled past 50px
//     const handleScroll = () => setIsScrolled(window.scrollY > 50);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div className="min-h-[200vh] flex flex-col bg-white w-full overflow-x-hidden text-[#1a1a1a]"> 
//       <HomePageHeader />

//       {/* HERO SECTION */}
//       <section className="relative flex items-center justify-center min-h-screen w-full pt-20 md:pt-0">

//         <div className="flex flex-col md:flex-row w-full items-center justify-center max-w-[1400px] mx-auto">

//           {/* LEFT — WOOD */}
//           <div className="w-full md:flex-1 flex justify-center md:justify-end px-4 md:px-12 mb-4 md:mb-0 z-10">
//             <div className="text-center md:text-right">
//               <span className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-gray-500 block mb-2">
//                 Artisanal Craft
//               </span>
//               <h1 className="text-[20vw] sm:text-[16vw] md:text-[80px] xl:text-[110px] font-black uppercase leading-none">
//                 WOOD
//               </h1>
//             </div>
//           </div>

//           {/* CENTER — INVISIBLE PLACEHOLDER */}
//           {/* Keeps the gap between WOOD and ART from collapsing */}
//           <div className="flex-shrink-0 px-2 md:px-4 w-[60vw] sm:w-[200px] md:w-[240px] lg:w-[280px] aspect-[4/5] my-6 md:my-0 opacity-0 pointer-events-none hidden md:block"></div>

//           {/* RIGHT — ART */}
//           <div className="w-full md:flex-1 flex justify-center md:justify-start px-4 md:px-12 mt-4 md:mt-0 z-10">
//             <div className="text-center md:text-left">
//               <h1 className="text-[20vw] sm:text-[16vw] md:text-[80px] xl:text-[110px] font-black uppercase leading-none md:mt-12">
//                 ART
//               </h1>
//               <p className="mt-4 mx-auto md:mx-0 text-gray-500 text-xs sm:text-sm md:text-base max-w-[220px] md:max-w-[260px]">
//                 Sustainable, premium wood furniture designed to elevate your living spaces.
//               </p>
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* =========================================
//           THE FRAMER-STYLE 3D ANIMATED CARD
//           ========================================= */}

//       {/* 1. OUTER WRAPPER: Handles Position, Size, and Perspective (1200) */}
//       <div
//         className={`
//           fixed z-40 aspect-[4/5]
//           transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]
//           [perspective:1200px] /* Match your Framer setting here! */

//           ${
//             isScrolled
//               ? `
//                 /* SCROLLED: Move to bottom right */
//                 top-[calc(100vh-24px)] left-[calc(100vw-24px)]
//                 -translate-x-full -translate-y-full
//                 w-[120px] sm:w-[160px] md:w-[200px]
//               `
//               : `
//                 /* INITIAL: Centered */
//                 top-[50%] left-[50%]
//                 -translate-x-1/2 -translate-y-1/2
//                 w-[60vw] sm:w-[200px] md:w-[240px] lg:w-[280px]
//               `
//           }
//         `}
//       >
//         {/* 2. INNER CARD: Handles the 3D Flip (Rotate Y 180) */}
//        <div
//   className={`
//     relative w-full h-full rounded-2xl shadow-2xl
//     transition-transform duration-1000 ease-in-out
//     [transform-style:preserve-3d]
//     will-change-transform
//     ${isScrolled ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"}
//   `}
// >
//           {/* FRONT FACE (The Image) */}
//           {/* [backface-visibility:hidden] ensures this hides when flipped */}
//           <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden [backface-visibility:hidden]">
//             <Image
//               src={heroFurnitureImage}
//               alt="Handcrafted Wood Furniture"
//               fill
//               className="object-cover"
//               priority
//             />
//           </div>

//           {/* BACK FACE (The Dark Widget) */}
//           {/* Pre-rotated 180deg so it reveals correctly when the parent card flips */}

//         </div>
//       </div>

//     </div>
//   );
// };

// export default HomePage;





// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import heroFurnitureImage from "../public/images/hygenicmealimage.webp";
// import HomePageHeader from "@/component/HomePageHeader";

// const HomePage = () => {
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       // Trigger when the user starts scrolling away from the hero
//       setIsScrolled(window.scrollY > 80);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div className="min-h-[200vh] flex flex-col bg-white w-full overflow-x-hidden text-[#1a1a1a]">
//       <HomePageHeader />

//       {/* HERO SECTION */}
//       <section className="relative flex items-center justify-center min-h-screen w-full pt-20 md:pt-0">
//         <div className="flex flex-col md:flex-row w-full items-center justify-center max-w-[1400px] mx-auto">
//           {/* LEFT — WOOD */}
//           <div className="w-full md:flex-1 flex justify-center md:justify-end px-4 md:px-12 mb-4 md:mb-0 z-10">
//             <div className="text-center md:text-right">
//               <span className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-gray-500 block mb-2">
//                 Artisanal Craft
//               </span>
//               <h1 className="text-[20vw] sm:text-[16vw] md:text-[80px] xl:text-[110px] font-black uppercase leading-none">
//                 WOOD
//               </h1>
//             </div>
//           </div>

//           {/* CENTER — INVISIBLE PLACEHOLDER */}
//           <div className="flex-shrink-0 px-2 md:px-4 w-[60vw] sm:w-[200px] md:w-[240px] lg:w-[280px] aspect-[4/5] my-6 md:my-0 opacity-0 pointer-events-none hidden md:block"></div>

//           {/* RIGHT — ART */}
//           <div className="w-full md:flex-1 flex justify-center md:justify-start px-4 md:px-12 mt-4 md:mt-0 z-10">
//             <div className="text-center md:text-left">
//               <h1 className="text-[20vw] sm:text-[16vw] md:text-[80px] xl:text-[110px] font-black uppercase leading-none md:mt-12">
//                 ART
//               </h1>
//               <p className="mt-4 mx-auto md:mx-0 text-gray-500 text-xs sm:text-sm md:text-base max-w-[220px] md:max-w-[260px]">
//                 Sustainable, premium wood furniture designed to elevate your living spaces.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* NEXT SECTION (Target for the image) */}
//       <section className="relative min-h-screen w-full bg-gray-50 py-32 px-10">
//         <div className="max-w-[1400px] mx-auto">
//           <h2 className="text-4xl font-bold uppercase tracking-tighter">Our Collection</h2>
//           {/* The image will land roughly here on the right */}
//         </div>
//       </section>

//       {/* =========================================
//           THE 3D FLIPPING & MOVING CARD
//           ========================================= */}

//       <div
//         className={`
//           fixed z-40 aspect-[4/5]
//           transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]
//           [perspective:1500px]
//            [transform-style:preserve-3d] 
//           pointer-events-none

//           ${
//             isScrolled
//               ? `
//                 /* MOVING TO RIGHT SIDE OF NEXT SECTION */
//                 top-[60%] left-[80%]
//                 -translate-x-1/2 -translate-y-1/2
//                 w-[150px] sm:w-[200px] md:w-[300px]
//               `
//               : `
//                 /* INITIAL: Centered in Hero */
//                 top-[50%] left-[50%]
//                 -translate-x-1/2 -translate-y-1/2
//                 w-[60vw] sm:w-[200px] md:w-[240px] lg:w-[280px]
//               `
//           }
//         `}
//       >
//         <div
//           className={`
//             relative w-full h-full rounded-2xl shadow-2xl
//             transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]
//             [transform-style:preserve-3d]
//             will-change-transform
//             ${isScrolled ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"}
//           `}
//         >
//           {/* FRONT FACE (Furniture Image) */}
//           <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden [backface-visibility:hidden]">
//             <Image
//               src={heroFurnitureImage}
//               alt="Handcrafted Wood Furniture"
//               fill
//               className="object-cover"
//               priority
//             />
//           </div>

//           {/* BACK FACE (Flipped State) */}
//           <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-[#1a1a1a] flex flex-col items-center justify-center border border-gray-800 [backface-visibility:hidden] [transform:rotateY(180deg)] p-6">
//              <span className="text-white font-bold text-lg md:text-2xl uppercase tracking-widest text-center">
//                 Refined <br/> Elegance
//              </span>
//              <div className="mt-4 w-12 h-1 bg-white/20 rounded-full" />
//              <p className="text-gray-400 text-[10px] mt-4 text-center">EXPLORE THE ART OF WOOD</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;







// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import heroFurnitureImage from "../public/images/hygenicmealimage.webp";
// import HomePageHeader from "@/component/HomePageHeader";

// const HomePage = () => {
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 80);
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div className="min-h-[200vh] flex flex-col bg-white w-full overflow-x-hidden text-[#1a1a1a]">
//       <HomePageHeader />

//       {/* ── HERO ── */}
//       <section className="relative flex items-center justify-center min-h-screen w-full pt-20 md:pt-0">
//         <div className="flex flex-col md:flex-row w-full items-center justify-center max-w-[1400px] mx-auto">

//           {/* LEFT — WOOD */}
//           <div className="w-full md:flex-1 flex justify-center md:justify-end px-4 md:px-12 mb-4 md:mb-0 z-10">
//             <div className="text-center md:text-right">
//               <span className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-gray-500 block mb-2">
//                 Artisanal Craft
//               </span>
//               <h1 className="text-[20vw] sm:text-[16vw] md:text-[80px] xl:text-[110px] font-black uppercase leading-none">
//                 WOOD
//               </h1>
//             </div>
//           </div>

//           {/* CENTER — invisible placeholder keeps layout stable */}
//           <div className="flex-shrink-0 px-2 md:px-4 w-[60vw] sm:w-[200px] md:w-[240px] lg:w-[280px] aspect-[4/5] my-6 md:my-0 opacity-0 pointer-events-none hidden md:block" />

//           {/* RIGHT — ART */}
//           <div className="w-full md:flex-1 flex justify-center md:justify-start px-4 md:px-12 mt-4 md:mt-0 z-10">
//             <div className="text-center md:text-left">
//               <h1 className="text-[20vw] sm:text-[16vw] md:text-[80px] xl:text-[110px] font-black uppercase leading-none md:mt-12">
//                 ART
//               </h1>
//               <p className="mt-4 mx-auto md:mx-0 text-gray-500 text-xs sm:text-sm md:text-base max-w-[220px] md:max-w-[260px]">
//                 Sustainable, premium wood furniture designed to elevate your living spaces.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ── NEXT SECTION ── */}
//       <section className="relative min-h-screen w-full bg-gray-50 py-32 px-10">
//         <div className="max-w-[1400px] mx-auto">
//           <h2 className="text-4xl font-bold uppercase tracking-tighter">Our Collection</h2>
//         </div>
//       </section>

//       {/* ══════════════════════════════════════════
//           THE FLIP CARD

//           FIX 1 — [perspective:1500px] stays on the OUTER fixed wrapper.
//           FIX 2 — [transform-style:preserve-3d] is on the OUTER wrapper too,
//                    so the inner card's rotateY renders in real 3D space.
//           FIX 3 — NO overflow-hidden on any ancestor of the 3D card.
//                    overflow-hidden is only allowed on the individual face divs.
//           ══════════════════════════════════════════ */}

//       {/* OUTER — handles position + perspective + preserve-3d */}
//       <div
//         className={`
//           fixed z-40 aspect-[4/5]
//           pointer-events-none
//           [perspective:1500px]
//           [transform-style:preserve-3d]
//           transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]
//           ${
//             isScrolled
//               ? "top-[60%] left-[80%] -translate-x-1/2 -translate-y-1/2 w-[150px] sm:w-[200px] md:w-[300px]"
//               : "top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60vw] sm:w-[200px] md:w-[240px] lg:w-[280px]"
//           }
//         `}
//       >
//         {/* INNER — the element that actually rotates; must have preserve-3d */}
//         <div
//           className={`
//             relative w-full h-full rounded-2xl shadow-2xl
//             [transform-style:preserve-3d]
//             transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]
//             will-change-transform
//             ${isScrolled ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"}
//           `}
//         >
//           {/* FRONT FACE — overflow-hidden is safe here (it's on a face, not a 3D ancestor) */}
//           <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
//             <Image
//               src={heroFurnitureImage}
//               alt="Handcrafted Wood Furniture"
//               fill
//               className="object-cover"
//               priority
//             />
//           </div>

//           {/* BACK FACE — rotated 180deg so it's hidden by default */}
//           <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-[#1a1a1a] flex flex-col items-center justify-center border border-gray-800 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] p-6">
//             <span className="text-white font-bold text-lg md:text-2xl uppercase tracking-widest text-center">
//               Refined <br /> Elegance
//             </span>
//             <div className="mt-4 w-12 h-1 bg-white/20 rounded-full" />
//             <p className="text-gray-400 text-[10px] mt-4 text-center tracking-widest uppercase">
//               Explore the art of wood
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;






// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import heroFurnitureImage from "../public/images/hygenicmealimage.webp";
// import HomePageHeader from "@/component/HomePageHeader";

// // ── All 3D-critical properties as inline JS style objects ──
// // Tailwind arbitrary values like [transform-style:preserve-3d] can be
// // silently purged or ignored by certain browsers. Inline styles are
// // guaranteed to apply — this is the only reliable approach for 3D CSS.
// const s = {
//   // ONLY perspective here (no preserve-3d)
//   wrapper: {
//     perspective: "1500px",
//   },

//   // card must preserve 3D
//   card: {
//     transformStyle: "preserve-3d",
//     WebkitTransformStyle: "preserve-3d",
//     willChange: "transform",
//     transition: "transform 1s ease-in-out",
//   },

//   front: {
//     backfaceVisibility: "hidden",
//     WebkitBackfaceVisibility: "hidden",
//   },

//   back: {
//     backfaceVisibility: "hidden",
//     WebkitBackfaceVisibility: "hidden",
//     transform: "rotateY(180deg)",
//   },
// };

// const HomePage = () => {
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 80);
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div className="min-h-[200vh] flex flex-col bg-white w-full overflow-auto text-[#1a1a1a]">
//       <HomePageHeader />

// {/* ── HERO ── */}
// <section className="relative flex items-center justify-center min-h-screen w-full pt-20 md:pt-0">
//   <div className="flex flex-col md:flex-row w-full items-center justify-center max-w-[1400px] mx-auto">

//     {/* LEFT — WOOD */}
//     <div className="w-full md:flex-1 flex justify-center md:justify-end px-4 md:px-12 mb-4 md:mb-0 z-10">
//       <div className="text-center md:text-right">
//         <span className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-gray-500 block mb-2">
//           Artisanal Craft
//         </span>
//         <h1 className="text-[20vw] sm:text-[16vw] md:text-[80px] xl:text-[110px] font-black uppercase leading-none">
//           WOOD
//         </h1>
//       </div>
//     </div>

//     {/* CENTER — invisible spacer keeps hero layout stable */}
//     <div className="flex-shrink-0 px-2 md:px-4 w-[60vw] sm:w-[200px] md:w-[240px] lg:w-[280px] aspect-[4/5] my-6 md:my-0 opacity-0 pointer-events-none hidden md:block" />

//     {/* RIGHT — ART */}
//     <div className="w-full md:flex-1 flex justify-center md:justify-start px-4 md:px-12 mt-4 md:mt-0 z-10">
//       <div className="text-center md:text-left">
//         <h1 className="text-[20vw] sm:text-[16vw] md:text-[80px] xl:text-[110px] font-black uppercase leading-none md:mt-12">
//           ART
//         </h1>
//         <p className="mt-4 mx-auto md:mx-0 text-gray-500 text-xs sm:text-sm md:text-base max-w-[220px] md:max-w-[260px]">
//           Sustainable, premium wood furniture designed to elevate your living spaces.
//         </p>
//       </div>
//     </div>
//   </div>
// </section>

//       {/* ── COLLECTION SECTION ── */}
//       <section className="relative min-h-screen w-full bg-gray-50 py-32 px-10">
//         <div className="max-w-[1400px] mx-auto">
//           <h2 className="text-4xl font-bold uppercase tracking-tighter">Our Collection</h2>
//         </div>
//       </section>


//      <div
//   style={s.wrapper}
//   className={[
//     "fixed z-40 aspect-[4/5]",
//     "transition-all duration-1000 ease-in-out",
//     isScrolled
//       ? "top-[60%] left-[80%] -translate-x-1/2 -translate-y-1/2 w-[150px] sm:w-[200px] md:w-[300px]"
//       : "top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60vw] sm:w-[200px] md:w-[240px] lg:w-[280px]",
//   ].join(" ")}
// >
//   <div
//     style={{
//       ...s.card,
//       transform: isScrolled
//         ? "rotateY(180deg) translateZ(0)"
//         : "rotateY(0deg) translateZ(0)",
//     }}
//     className="relative w-full h-full rounded-2xl shadow-2xl"
//   >
//     {/* FRONT */}
//     <div style={s.front} className="absolute inset-0 rounded-2xl overflow-hidden">
//       <Image
//         src={heroFurnitureImage}
//         alt="Handcrafted Wood Furniture"
//         fill
//         className="object-cover"
//         priority
//       />
//     </div>

//     {/* BACK */}
//     <div
//       style={s.back}
//       className="absolute inset-0 rounded-2xl overflow-hidden bg-[#1a1a1a] flex flex-col items-center justify-center border border-gray-800 p-6"
//     >
//       <span className="text-white font-bold text-lg md:text-2xl uppercase tracking-widest text-center">
//         Refined <br /> Elegance
//       </span>
//       <div className="mt-4 w-12 h-1 bg-white/20 rounded-full" />
//       <p className="text-gray-400 text-[10px] mt-4 text-center tracking-widest uppercase">
//         Explore the art of wood
//       </p>
//     </div>
//   </div>
// </div>
//     </div>
//   );
// };

// export default HomePage;






"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import heroFurnitureImage from "../public/images/hygenicmealimage.webp";
import HomePageHeader from "@/component/HomePageHeader";

const s = {
  wrapper: {
    perspective: "1500px",
    zIndex: 100, // Ensure it's above everything
    transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  card: {
    transformStyle: "preserve-3d",
    WebkitTransformStyle: "preserve-3d",
    transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  front: {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transform: "translateZ(1px)", // Push forward slightly
    position: "absolute",
    inset: 0,
  },
  back: {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    // Rotate AND push "forward" from its own perspective
    transform: "rotateY(180deg) translateZ(1px)",
    position: "absolute",
    inset: 0,
  }
};

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Define the scroll handler
    const handleScroll = (e) => {
      // Logic: check the window OR the container's internal scroll
      const scrollTop = window.scrollY || e.target.scrollTop || document.documentElement.scrollTop;

      console.log("Detected Scroll:", scrollTop); // This should now change
      setIsScrolled(scrollTop > 50);
    };

    // 2. Attach to BOTH window and the specific container
    window.addEventListener("scroll", handleScroll, { passive: true });

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (container) container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-auto overflow-x-hidden bg-white text-[#1a1a1a] flex flex-col"
    >
      <HomePageHeader />

      {/* ── HERO ── */}
      <section className="relative flex items-center justify-center min-h-screen w-full pt-20 md:pt-0">
        <div className="flex flex-col md:flex-row w-full items-center justify-center max-w-[1400px] mx-auto">

          {/* LEFT — WOOD */}
          <div className="w-full md:flex-1 flex justify-center md:justify-end px-4 md:px-12 mb-4 md:mb-0 z-10">
            <div className="text-center md:text-right">
              <span className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-gray-500 block mb-2">
                Artisanal Craft
              </span>
              <h1 className="text-[20vw] sm:text-[16vw] md:text-[80px] xl:text-[110px] font-black uppercase leading-none">
                WOOD
              </h1>
            </div>
          </div>

          {/* CENTER — invisible spacer keeps hero layout stable */}
          <div className="flex-shrink-0 px-2 md:px-4 w-[60vw] sm:w-[200px] md:w-[240px] lg:w-[280px] aspect-[4/5] my-6 md:my-0 opacity-0 pointer-events-none hidden md:block" />

          {/* RIGHT — ART */}
          <div className="w-full md:flex-1 flex justify-center md:justify-start px-4 md:px-12 mt-4 md:mt-0 z-10">
            <div className="text-center md:text-left">
              <h1 className="text-[20vw] sm:text-[16vw] md:text-[80px] xl:text-[110px] font-black uppercase leading-none md:mt-12">
                ART
              </h1>
              <p className="mt-4 mx-auto md:mx-0 text-gray-500 text-xs sm:text-sm md:text-base max-w-[220px] md:max-w-[260px]">
                Sustainable, premium wood furniture designed to elevate your living spaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION SECTION */}
      <section className="relative min-h-screen w-full bg-gray-50 py-32 px-10">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl font-bold uppercase">Our Collection</h2>
        </div>
      </section>



  {/* MOVING & FLIPPING CARD */}
<div
  style={{
    position: "fixed",
    zIndex: 50,
    width: "320px", // Standardized width
    height: "400px", // Standardized height (4:5 ratio)
    top: "0",
    left: "0",
    perspective: "2000px",
    /* State 1 (Hero): Centered
       State 2 (Collection): Moved down into the next section, slightly right of center
    */
    transform: isScrolled 
      ? "translate3d(calc(80vw - 50%), calc(55vh - 40%), 0)" 
      : "translate3d(calc(50vw - 50%), calc(50vh - 50%), 0)",
    transition: "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
    willChange: "transform",
    pointerEvents: "none",
  }}
>
  <div
    style={{
      width: "100%",
      height: "100%",
      position: "relative",
      transformStyle: "preserve-3d",
      transition: "transform 3.0s cubic-bezier(0.16, 1, 0.3, 1)",
      /* 180deg flip + the tilt you requested */
      transform: isScrolled 
        ? "rotateY(180deg) rotateZ(-10deg) rotateX(4deg)" 
        : "rotateY(0deg) rotateZ(0deg) rotateX(0deg)",
    }}
    className="shadow-[0_25px_60px_rgba(0,0,0,0.15)] rounded-2xl"
  >
    {/* FRONT SIDE (Visible at top) */}
    <div 
      style={{
        position: "absolute",
        inset: 0,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      className="rounded-2xl overflow-hidden"
    >
      <Image
        src={heroFurnitureImage}
        alt="Front"
        fill
        className="object-cover"
        priority
      />
    </div>

    {/* BACK SIDE (Visible after scrolling/flipping) */}
    <div 
      style={{
        position: "absolute",
        inset: 0,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
      }}
      className="rounded-2xl overflow-hidden"
    >
      <Image
        src={heroFurnitureImage} 
        alt="Back"
        fill
        className="object-cover"
      />
      {/* Optional: subtle light sweep to show it's a physical flip */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
    </div>
  </div>
</div>





    </div>
  );
};

export default HomePage;