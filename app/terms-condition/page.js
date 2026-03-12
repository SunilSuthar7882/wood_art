// "use client";

// import Footer from "@/component/Footer";
// import HomePageFooter from "@/component/HomePageFooter";
// import HomePageHeader from "@/component/HomePageHeader";

// function TermsAndConditions() {
//   const handleBack = () => {
//     window.history.back();
//   };

//   return (
//     <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 w-full">
//       <HomePageHeader />
//       <div className="flex flex-col overflow-auto flex-1 ">
//         {/* <div className="w-full p-8 bg-white rounded-lg shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-2xl"> */}
//         <div className="flex flex-col p-4 ">
//           <div className="p-4 max-w-4xl mx-auto bg-white rounded-lg shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-2xl">
//             {/* Back Button */}
//             <button
//               onClick={handleBack}
//               className="text-[#00927c] font-medium underline mb-6 flex items-center"
//             >
//               <svg
//                 className="mr-2 w-5 h-5"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a1 1 0 01-.707-.293l-7-7a1 1 0 010-1.414l7-7A1 1 0 0111.414 4.707L5.828 10l5.586 5.586A1 1 0 0110 18z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               Back
//             </button>

//             <h1 className="text-3xl font-semibold text-gray-800 mb-4">
//               Terms and Conditions
//             </h1>

//             <p className="text-gray-600 mb-6">
//               Welcome to Macros and Meals! By accessing or using our website,
//               you agree to comply with and be bound by the following terms and
//               conditions. Please read them carefully.
//             </p>

//             <div className="space-y-6 text-gray-600">
//               <div>
//                 <h2 className="text-xl font-medium text-gray-800">
//                   1. Introduction
//                 </h2>
//                 <p>
//                   These Terms and Conditions govern the use of the Macros and
//                   Meals website and services. If you do not agree to these
//                   terms, please do not use the site.
//                 </p>
//               </div>

//               <div>
//                 <h2 className="text-xl font-medium text-gray-800">
//                   2. User Responsibilities
//                 </h2>
//                 <p>
//                   Users agree to use the site in compliance with applicable laws
//                   and regulations. You may not misuse or interfere with the
//                   website normal operations.
//                 </p>
//               </div>

//               <div>
//                 <h2 className="text-xl font-medium text-gray-800">
//                   3. Intellectual Property
//                 </h2>
//                 <p>
//                   All content, including text, images, logos, and design, is
//                   owned by Macros and Meals and is protected by copyright law.
//                 </p>
//               </div>

//               <div>
//                 <h2 className="text-xl font-medium text-gray-800">
//                   4. Changes to Terms
//                 </h2>
//                 <p>
//                   We may update these terms at any time. Changes will be
//                   effective as soon as they are posted on this page.
//                 </p>
//               </div>

//               <div>
//                 <h2 className="text-xl font-medium text-gray-800">
//                   5. Limitation of Liability
//                 </h2>
//                 <p>
//                   Macros and Meals will not be liable for any damages resulting
//                   from the use or inability to use the website.
//                 </p>
//               </div>

//               <p className="mt-4 text-sm text-gray-500">
//                 Last Updated: April 2025
//               </p>
//             </div>
//           </div>
//         </div>
//         <HomePageFooter />
//       </div>
//       {/* <Footer /> */}
//     </div>
//   );
// }

// export default TermsAndConditions;





"use client";

import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import HomePageHeader from "@/component/HomePageHeader";
import HomePageFooter from "@/component/HomePageFooter";
import { useRouter } from "next/navigation";

function TermsAndConditions() {
  const router = useRouter();
 const handleBack = () => {
  router.push("/");
};

  const sections = [
    {
      title: "1. Introduction",
      content:
        "These Terms and Conditions govern the use of the Macros and Meals website and services. If you do not agree to these terms, please do not use the site.",
    },
    {
      title: "2. User Responsibilities",
      content:
        "Users agree to use the site in compliance with applicable laws and regulations. You may not misuse or interfere with the website's normal operations.",
    },
    {
      title: "3. Intellectual Property",
      content:
        "All content, including text, images, logos, and design, is owned by Macros and Meals and is protected by copyright law.",
    },
    {
      title: "4. Changes to Terms",
      content:
        "We may update these terms at any time. Changes will be effective as soon as they are posted on this page.",
    },
    {
      title: "5. Limitation of Liability",
      content:
        "Macros and Meals will not be liable for any damages resulting from the use or inability to use the website.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 w-full">
      <HomePageHeader />
      <div className="flex flex-col overflow-auto flex-1">
        <div className="flex flex-col p-4">
          <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-2xl">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="text-[#16a34a] font-medium underline mb-6 flex items-center hover:text-[#007f6a] transition-colors"
            >
              <ArrowBackIcon className="mr-2 w-5 h-5" />
              Back
            </button>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Terms and Conditions
            </h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Welcome to Macros and Meals! By accessing or using our website,
              you agree to comply with and be bound by the following terms and
              conditions. Please read them carefully.
            </p>

            {/* Interactive Sections */}
            <div className="space-y-4">
              {sections.map((section, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg overflow-hidden shadow-sm"
                >
                  <button
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
                    onClick={() => toggleSection(idx)}
                  >
                    <span className="font-medium text-gray-800 text-base">
                      {section.title}
                    </span>
                    <span className="text-gray-500">
                      {openIndex === idx ? "−" : "+"}
                    </span>
                  </button>
                  {openIndex === idx && (
                    <div className="px-4 py-3 text-gray-600 text-sm leading-relaxed bg-white">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Last Updated */}
            <p className="mt-6 text-xs text-gray-500 text-right">
              Last Updated: April 2025
            </p>
          </div>
        </div>
        <HomePageFooter />
      </div>
    </div>
  );
}

export default TermsAndConditions;

