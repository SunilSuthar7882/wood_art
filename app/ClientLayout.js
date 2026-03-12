
"use client";
import Footer from "@/component/Footer";
import Header from "@/component/Header";
import Sidebar from "@/component/Sidebar";
import { noFooterPath, PUBLIC_ROUTES, Routes } from "@/config/routes";
import { Box, Drawer, Grid, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import sidebarLogo from "../public/images/logo-with-name.png";
import ThemeRegistry from "./ThemeRegistry";
import { Suspense } from "react";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import styles from "../styles/global.module.scss";
import Link from "next/link";

export default function ClientLayout({ children }) {
  const theme = useTheme();
  const pathname = usePathname();
  const isSidebar = PUBLIC_ROUTES;
  const showSidebar = isSidebar.includes(pathname);
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    setSidebarOpen(false);
  }, [isMediumScreen]);

  return (
   
    <ThemeRegistry>
      <div className="flex flex-row h-[100vh] w-full">
        {!showSidebar && !isMediumScreen && (
          <Sidebar
            toggleSidebar={toggleSidebar}
            isMediumScreen={isMediumScreen}
          />
        )}
        {/* Drawer for medium screens */}
        {!showSidebar && isMediumScreen && (
          <Drawer open={isSidebarOpen} onClose={toggleSidebar} anchor="left">
          

            {/* <Link href={Routes.dashboard}> */}
            <Image
              src={sidebarLogo}
              // height={80}
              // width={229}
              alt="brand-logo"
              className="h-[75px] w-full px-6 object-cover border-b"
              // className={style.sidebarLogo}
              // style={{ height: "auto", width: "auto" }}
              priority
            />
            {/* </Link> */}
            <Sidebar
              toggleSidebar={toggleSidebar}
              isMediumScreen={isMediumScreen}
            />
          </Drawer>
        )}
        <div className="flex flex-1 flex-col overflow-auto">
          {!showSidebar && (
            <Suspense fallback={<div style={{ height: 64 }}></div>}>
              <Header
                isMediumScreen={isMediumScreen}
                toggleSidebar={toggleSidebar}
              />
            </Suspense>
          )}
          <div className="flex flex-1 flex-col overflow-auto w-full">
            {children}
          </div>
        </div>
        {showSidebar && !noFooterPath.includes(pathname) && <Footer />}
      </div>
      <ToastContainer autoClose={2000} theme="colored" />
    </ThemeRegistry>
  );
}
