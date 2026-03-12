// // components/Header.js
// "use client";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import React from "react";
// // import logo from "../public/images/logo.webp";
// import homelogo from "../public/images/homelogo.png";
// import logo from "../public/images/sidelogo.png";
// import biglogo from "../public/images/biglogo.png";
// import Image from "next/image";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// const HomePageHeader = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [scrollToServices, setScrollToServices] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();
//   const handleClick = () => {
//     if (pathname === "/") {
//       // Already on homepage → scroll smoothly
//       const topElement = document.getElementById("top");
//       if (topElement) {
//         topElement.scrollIntoView({ behavior: "smooth" });
//       } else {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//       }
//     } else {
//       // Not on homepage → navigate to "/"
//       router.push("/");
//     }
//   };
 

//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const sectionId = searchParams.get("scroll");
//     if (sectionId) {
//       const section = document.getElementById(sectionId);
//       if (section) {
//         section.scrollIntoView({ behavior: "smooth" });
//       }
//     }
//   }, [searchParams]);

//   const scrollToSection = async (id) => {

//     if (window.location.pathname !== "/") {
//       await router.push("/");
//     }

//     const target = document.getElementById(id);
//     if (target) {
//       target.scrollIntoView({ behavior: "smooth" });
//     } else {
//       console.warn("Element not found with id:", id);
//     }
//   };
//   return (
//     <header className="bg-white shadow-sm overflow-auto flex w-full z-50">
//       <div className="max-w-[1400px] mx-auto  w-full">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <button
//               onClick={handleClick}
//               className="flex items-center focus:outline-none"
//             >
//               <div className="w-16 h-16 rounded-full flex items-center justify-center mr-2">
//                 <Image
//                   src={logo}
//                   alt="Logo"
//                   width={50}
//                   height={50}
//                   className="rounded-full object-fill"
//                 />
//               </div>
//                {/* <div className="w-16 h-16 rounded-full flex items-center justify-center mr-2"> */}
//                 <Image
//                   src={biglogo}
//                   alt="Logo"
//                   width={90}
//                   height={60}
//                   className="rounded-full object-fit"
//                 />
//               {/* </div> */}
//              {/*  <span className="text-xl font-semibold text-green-700">
//                 Macros & Meals
//               </span> */}
//             </button>
//           </div>

//           {/* Desktop Navigation */}
//           <nav className="hidden [@media(min-width:870px)]:flex">
//             <div className="flex">
//               <button
                
//                 onClick={() => scrollToSection("services")}
//                 className="text-gray-700 hover:text-green-600 transition-colors px-4 py-2"
//               >
//                 Services
//               </button>

//               <Link
//                 href="/about-us"
//                 className="text-gray-700 hover:text-green-600 transition-colors px-4 py-2"
//               >
//                 About
//               </Link>
//               <Link
//                 href="/success-stories"
//                 className="text-gray-700 hover:text-green-600 transition-colors px-4 py-2"
//               >
//                 Success Stories
//               </Link>
//               <Link
//                 href="/contact-us"
//                 className="text-gray-700 hover:text-green-600 transition-colors px-4 py-2"
//               >
//                 Contact
//               </Link>
//             </div>
//           </nav>

//           {/* Desktop Auth Buttons */}
//           <div className="hidden [@media(min-width:870px)]:flex items-center pr-5">
//             <Link
//               href="/login"
//               className="text-gray-700 hover:text-green-600 transition-colors px-4 py-2"
//             >
//               Login
//             </Link>
//             <Link
//               href="/register"
//               className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors ml-2"
//             >
//               Get Started
//             </Link>
//           </div>

//           {/* Mobile menu button */}
//           <div className="[@media(min-width:870px)]:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="text-gray-700 hover:text-green-600 focus:outline-none p-2"
//             >
//               <div className="w-6 h-6 flex flex-col justify-center">
//                 {isMenuOpen ? (
//                   <div className="relative">
//                     <div className="w-6 h-0.5 bg-current transform rotate-45 absolute"></div>
//                     <div className="w-6 h-0.5 bg-current transform -rotate-45 absolute"></div>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col">
//                     <div className="w-6 h-0.5 bg-current mb-1"></div>
//                     <div className="w-6 h-0.5 bg-current mb-1"></div>
//                     <div className="w-6 h-0.5 bg-current"></div>
//                   </div>
//                 )}
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="[@media(min-width:870px)]:hidden border-t">
//             <div className="flex flex-col py-2">
//               <button
              
//                 onClick={() => scrollToSection("services")}
//                 className="text-gray-700 hover:text-green-600 transition-colors px-4 py-3 text-left"
//               >
//                 Services
//               </button>
//               <Link
//                 href="/about-us"
//                 className="text-gray-700 hover:text-green-600 px-4 py-3"
//               >
//                 About
//               </Link>
//               <Link
//                 href="/success-stories"
//                 className="text-gray-700 hover:text-green-600 px-4 py-3"
//               >
//                 Success Stories
//               </Link>
//               <Link
//                 href="/contact-us"
//                 className="text-gray-700 hover:text-green-600 px-4 py-3"
//               >
//                 Contact
//               </Link>
//               <Link
//                 href="/login"
//                 className="text-gray-700 hover:text-green-600 px-4 py-3"
//               >
//                 Login
//               </Link>
//               <Link
//                 href="/get-started"
//                 className="bg-green-600 text-white rounded-md hover:bg-green-600 mx-4 py-3 text-center mt-2"
//               >
//                 Get Started
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default HomePageHeader;



"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Use your actual path for the profile image
import profilePic from "../public/images/sidelogo.png"; 

const HomePageHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    if (pathname === "/") {
      const topElement = document.getElementById("top");
      if (topElement) {
        topElement.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    const sectionId = searchParams.get("scroll");
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchParams]);

  const scrollToSection = async (id) => {
    if (window.location.pathname !== "/") {
      await router.push("/");
    }
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn("Element not found with id:", id);
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    // Fixed wrapper to float the header
    <header className="fixed top-6 w-full z-[60] flex justify-center px-4 pointer-events-none">
      
      {/* Main Pill Container */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-between p-1 w-full max-w-3xl pointer-events-auto transition-all duration-300">
        
        {/* Left: Avatar/Logo */}
        <button
          onClick={handleClick}
          className="flex-shrink-0 focus:outline-none"
        >
          <Image
            src={profilePic}
            alt="Profile"
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        </button>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-[15px] font-medium">
          <button 
            onClick={handleClick}
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            Home
          </button>
          <Link
            href="/about"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            About
          </Link>
          <Link
            href="/projects"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/blogs"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            Blogs
          </Link>
        </nav>

        {/* Right: Contact Button (Desktop) */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="bg-[#2a2a2a] text-white px-6 py-3 rounded-full hover:bg-black transition-colors text-[15px] font-medium inline-block"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center pr-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-black focus:outline-none"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              {isMenuOpen ? (
                <div className="relative mt-2">
                  <div className="w-6 h-0.5 bg-current transform rotate-45 absolute transition-transform"></div>
                  <div className="w-6 h-0.5 bg-current transform -rotate-45 absolute transition-transform"></div>
                </div>
              ) : (
                <>
                  <div className="w-6 h-0.5 bg-current transition-all"></div>
                  <div className="w-6 h-0.5 bg-current transition-all"></div>
                  <div className="w-6 h-0.5 bg-current transition-all"></div>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-20 bg-white border border-gray-200 shadow-lg rounded-3xl w-[90%] max-w-[400px] flex flex-col overflow-hidden md:hidden pointer-events-auto p-2">
          <button
            onClick={handleClick}
            className="text-gray-600 hover:bg-gray-50 transition-colors px-6 py-4 text-left rounded-xl"
          >
            Home
          </button>
          <Link
            href="/about"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-600 hover:bg-gray-50 transition-colors px-6 py-4 rounded-xl"
          >
            About
          </Link>
          <Link
            href="/projects"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-600 hover:bg-gray-50 transition-colors px-6 py-4 rounded-xl"
          >
            Projects
          </Link>
          <Link
            href="/blogs"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-600 hover:bg-gray-50 transition-colors px-6 py-4 rounded-xl"
          >
            Blogs
          </Link>
          <div className="p-2 mt-2">
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="bg-[#2a2a2a] text-white rounded-full hover:bg-black py-4 text-center block w-full transition-colors font-medium"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default HomePageHeader;