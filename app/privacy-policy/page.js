// "use client";

// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import Footer from "@/component/Footer";

// function PrivacyPolicy() {
//   const handleBack = () => {
//     window.history.back();
//   };

//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         minHeight: "100vh",
//         backgroundColor: "#f4f6f8",
//         fontFamily: "Inter, sans-serif",
//       }}
//     >
//       {/* Main Content */}
//       <div
//         style={{
//           flexGrow: 1,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           padding: "2rem",
//         }}
//       >
//         <div
//           style={{
//             padding: "2rem",
//             maxWidth: "900px",
//             width: "100%",
//             backgroundColor: "white",
//             borderRadius: "8px",
//             boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//             transition: "all 0.3s ease-in-out",
//           }}
//           onMouseEnter={(e) =>
//             (e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)")
//           }
//           onMouseLeave={(e) =>
//             (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)")
//           }
//         >
//           <button
//             onClick={handleBack}
//             style={{
//               color: "#16a34a",
//               fontWeight: 500,
//               textDecoration: "underline",
//               marginBottom: "1.5rem",
//               background: "none",
//               border: "none",
//               display: "flex",
//               alignItems: "center",
//               cursor: "pointer",
//               fontSize: "16px",
//             }}
//           >
//             <ArrowBackIcon style={{ marginRight: "0.5rem" }} />
//             Back
//           </button>

//           <h1
//             style={{
//               fontWeight: 600,
//               color: "#333",
//               marginBottom: "1rem",
//               fontSize: "30px",
//             }}
//           >
//             Privacy Policy
//           </h1>

//           <p style={{ color: "#555", marginBottom: "1rem" }}>
//             At Macros and Meals, we take your privacy seriously. This privacy
//             policy explains how we collect, use, and protect your personal data
//             when you visit our website.
//           </p>

//           <h2
//             style={{
//               fontWeight: 500,
//               color: "#333",
//               marginTop: "2rem",
//               fontSize: "20px",
//             }}
//           >
//             1. Information We Collect
//           </h2>
//           <p style={{ color: "#555", marginBottom: "1rem" }}>
//             We may collect personal information such as your name, email
//             address, and other details when you sign up or interact with our
//             website.
//           </p>

//           <h2
//             style={{
//               fontWeight: 500,
//               color: "#333",
//               marginTop: "2rem",
//               fontSize: "20px",
//             }}
//           >
//             2. How We Use Your Information
//           </h2>
//           <p style={{ color: "#555", marginBottom: "1rem" }}>
//             The information we collect is used to improve the functionality of
//             our services, send newsletters, or respond to inquiries.
//           </p>

//           <h2
//             style={{
//               fontWeight: 500,
//               color: "#333",
//               marginTop: "2rem",
//               fontSize: "20px",
//             }}
//           >
//             3. Data Security
//           </h2>
//           <p style={{ color: "#555", marginBottom: "1rem" }}>
//             We employ security measures to protect your personal data from
//             unauthorized access, alteration, or destruction.
//           </p>

//           <h2
//             style={{
//               fontWeight: 500,
//               color: "#333",
//               marginTop: "2rem",
//               fontSize: "20px",
//             }}
//           >
//             4. Third-Party Links
//           </h2>
//           <p style={{ color: "#555", marginBottom: "1rem" }}>
//             Our website may contain links to third-party sites. We are not
//             responsible for the privacy practices of those sites.
//           </p>

//           <h2
//             style={{
//               fontWeight: 500,
//               color: "#333",
//               marginTop: "2rem",
//               fontSize: "20px",
//             }}
//           >
//             5. Changes to This Privacy Policy
//           </h2>
//           <p style={{ color: "#555", marginBottom: "1rem" }}>
//             We may update this privacy policy at any time. We encourage you to
//             review this page periodically for any changes.
//           </p>

//           <p style={{ color: "#555", marginTop: "2rem" }}>
//             Last Updated: April 2025
//           </p>
//         </div>
//       </div>

//       {/* Sticky Footer */}
//       <Footer />
//     </div>
//   );
// }

// export default PrivacyPolicy;









// "use client";

// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import Footer from "@/component/Footer";
// import HomePageFooter from "@/component/HomePageFooter";
// import HomePageHeader from "@/component/HomePageHeader";

// function PrivacyPolicy() {
//   const handleBack = () => {
//     window.history.back();
//   };

//   const sections = [
//     {
//       title: "1. Information We Collect",
//       content:
//         "We may collect personal information such as your name, email address, and other details when you sign up or interact with our website.",
//     },
//     {
//       title: "2. How We Use Your Information",
//       content:
//         "The information we collect is used to improve the functionality of our services, send newsletters, or respond to inquiries.",
//     },
//     {
//       title: "3. Data Security",
//       content:
//         "We employ security measures to protect your personal data from unauthorized access, alteration, or destruction.",
//     },
//     {
//       title: "4. Third-Party Links",
//       content:
//         "Our website may contain links to third-party sites. We are not responsible for the privacy practices of those sites.",
//     },
//     {
//       title: "5. Changes to This Privacy Policy",
//       content:
//         "We may update this privacy policy at any time. We encourage you to review this page periodically for any changes.",
//     },
//   ];

//   return (<>
 
//    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 w-full">
//       <HomePageHeader />
//    <div className="flex flex-col overflow-auto flex-1 ">
//       {/* Main Content */}
//       <div
//         style={{
//           flexGrow: 1,
//           display: "flex",
//           justifyContent: "center",
//           padding: "2rem",
//         }}
//       >
//         <div
//           style={{
//             width: "100%",
//             maxWidth: "800px",
//             backgroundColor: "white",
//             borderRadius: "12px",
//             boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
//             padding: "2rem",
//             transition: "all 0.3s ease-in-out",
//           }}
//           onMouseEnter={(e) =>
//             (e.currentTarget.style.boxShadow = "0 12px 28px rgba(0, 0, 0, 0.12)")
//           }
//           onMouseLeave={(e) =>
//             (e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.08)")
//           }
//         >
//           {/* Back Button */}
//           <button
//             onClick={handleBack}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               fontSize: "14px",
//               color: "#16a34a",
//               fontWeight: 500,
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               marginBottom: "1.5rem",
//             }}
//           >
//             <ArrowBackIcon style={{ marginRight: "0.5rem", fontSize: "18px" }} />
//             Back
//           </button>

//           {/* Header */}
//           <h1
//             style={{
//               fontSize: "26px",
//               fontWeight: 600,
//               color: "#111827",
//               marginBottom: "1rem",
//             }}
//           >
//             Privacy Policy
//           </h1>
//           <p style={{ lineHeight: 1.7, color: "#4b5563" }}>
//             At Macros and Meals, your privacy is our top priority. This policy explains how we collect, use, and protect your personal information when you use our website.
//           </p>

//           {/* Sections */}
//           {sections.map((section, idx) => (
//             <div key={idx} style={{ marginTop: "2rem" }}>
//               <h2
//                 style={{
//                   fontSize: "17px",
//                   fontWeight: 500,
//                   color: "#111827",
//                   marginBottom: "0.5rem",
//                 }}
//               >
//                 {section.title}
//               </h2>
//               <p style={{ lineHeight: 1.7, color: "#4b5563" }}>{section.content}</p>
//             </div>
//           ))}

//           {/* Last updated */}
//           <p
//             style={{
//               marginTop: "2rem",
//               fontSize: "13px",
//               color: "#9ca3af",
//               textAlign: "right",
//             }}
//           >
//             Last Updated: April 2025
//           </p>
//         </div>
//       </div>

//       {/* Footer */}
//       {/* <Footer /> */}
//       <HomePageFooter/>
//     </div>
//     </div>
//      </>
//   );
// }

// export default PrivacyPolicy;










"use client";

import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomePageFooter from "@/component/HomePageFooter";
import HomePageHeader from "@/component/HomePageHeader";
import { useRouter } from "next/navigation";

function PrivacyPolicy() {
   const router = useRouter();
   const handleBack = () => {
    router.push("/");
  };

  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "We may collect personal information such as your name, email address, and other details when you sign up or interact with our website.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "The information we collect is used to improve the functionality of our services, send newsletters, or respond to inquiries.",
    },
    {
      title: "3. Data Security",
      content:
        "We employ security measures to protect your personal data from unauthorized access, alteration, or destruction.",
    },
    {
      title: "4. Third-Party Links",
      content:
        "Our website may contain links to third-party sites. We are not responsible for the privacy practices of those sites.",
    },
    {
      title: "5. Changes to This Privacy Policy",
      content:
        "We may update this privacy policy at any time. We encourage you to review this page periodically for any changes.",
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
              Privacy Policy
            </h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              At Macros and Meals, your privacy is our top priority. This policy
              explains how we collect, use, and protect your personal
              information when you use our website.
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

export default PrivacyPolicy;
