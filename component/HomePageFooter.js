// components/Footer.js
"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/images/logo.webp";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import instagramIcon from "../public/instalogo.png";
import facebookIcon from "../public/faceBooklogo.png";
import twitterIcon from "../public/twitterLogo.png";
import youtubeIcon from "../public/youtubeLogo.png";

const HomePageFooter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const handleClick = () => {
    if (pathname === "/") {
      // Already on homepage → scroll smoothly
      const topElement = document.getElementById("top");
      if (topElement) {
        topElement.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // Not on homepage → navigate to "/"
      router.push("/");
    }
  };
  const searchParams = useSearchParams();

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
  };
  return (
    <footer className="bg-white border-t border-gray-200 py-2 flex flex-col w-full">
      <div className="max-w-[1400px] mx-auto p-6 w-full">
        {/* Main Footer Content */}
        <div className="flex flex-row justify-between ">
          {/* Logo and Description */}
          <div className="flex flex-col mb-8 lg:mb-0 lg:mr-16">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mr-2">
                <Image
                  src={logo}
                  alt="Logo"
                  width={64}
                  height={64}
                  className="rounded-full object-fill"
                />
              </div>
              <span className="text-xl font-semibold text-green-700">
                Macros & Meals
              </span>
            </div>
            <p className="text-gray-600 max-w-sm mb-6">
              Professional nutrition coaching and meal planning to help you
              achieve your health goals.
            </p>

            {/* Social Media Icons */}
            <div className="flex">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-100 hover:bg-green-100 rounded-full flex items-center justify-center transition-colors"
              >
                <Image
                  src={facebookIcon}
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-100 hover:bg-green-100 rounded-full flex items-center justify-center transition-colors"
              >
                <Image
                  src={instagramIcon}
                  alt="Instagram"
                  width={24}
                  height={24}
                />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-100 hover:bg-green-100 rounded-full flex items-center justify-center transition-colors"
              >
                <Image src={twitterIcon} alt="Twitter" width={20} height={24} />
              </Link>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-100 hover:bg-green-100 rounded-full flex items-center justify-center transition-colors"
              >
                <Image src={youtubeIcon} alt="YouTube" width={24} height={16} />
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-row flex-1 justify-start mx-auto px-10 gap-10">
            {/* Company Column */}
            <div className="flex flex-col mb-8 sm:mb-0 sm:mr-16">
              <h3 className="text-gray-900 font-semibold mb-4">Company</h3>
              <div className="flex flex-col">
                <Link
                  href="/about-us"
                  className="text-gray-600 hover:text-green-600 py-2 transition-colors"
                >
                  About Us
                </Link>

                <Link
                  href="/success-stories"
                  className="text-gray-600 hover:text-green-600 py-2 transition-colors"
                >
                  Success Stories
                </Link>
                <Link
                  href="/blog"
                  className="text-gray-600 hover:text-green-600 py-2 transition-colors"
                >
                  Blog
                </Link>

                <button
                  onClick={() => scrollToSection("services")}
                  className="text-gray-700 hover:text-green-600 transition-colors text-left py-2"
                >
                  Services
                </button>
              </div>
            </div>

            {/* Support Column */}
            <div className="flex flex-col">
              <h3 className="text-gray-900 font-semibold mb-4">Support</h3>
              <div className="flex flex-col">
                <Link
                  href="/contact-us"
                  className="text-gray-600 hover:text-green-600 py-2 transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-green-600 py-2 transition-colors"
                >
                  FAQ
                </Link>
                <Link
                  href="/privacy-policy"
                  className="text-gray-600 hover:text-green-600 py-2 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-condition"
                  className="text-gray-600 hover:text-green-600 py-2 transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row sm:justify-center">
            <p className="text-gray-500 text-sm text-center">
              © 2024 Macros & Meals. All rights reserved. | Designed for optimal
              health and nutrition.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomePageFooter;
