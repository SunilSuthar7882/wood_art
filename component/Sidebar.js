// import { useState, useEffect } from "react";
// import { Routes } from "@/config/routes";
// import { getLocalStorageItem } from "@/helpers/localStorage";
// import { Grid, Typography } from "@mui/material";
// import classNames from "classnames";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// import styles from "../styles/component/sidebar.module.scss";

// import mamAdminIcon from "../public/images/mam_admin.png";
// import mamAdminIconActive from "../public/images/mam_admin_active.png";
// import trainerIcon from "../public/images/trainer.png";
// import trainerIconActive from "../public/images/trainer-active.png";
// import managePlansIcon from "../public/images/manage-plans.png";
// import managePlansIconActive from "../public/images/manage-plans-active.png";
// import manageCouponsIcon from "../public/images/manage_coupons.png";
// import manageCouponsIconActive from "../public/images/manage_coupons_active.png";
// import reportsIcon from "../public/images/reports.png";
// import reportsIconActive from "../public/images/reports_active.png";
// import customerIcon from "../public/images/customer.png";
// import customerIconActive from "../public/images/customer-active.png";
// import calculatorIcon from "../public/images/calculator.png";
// import calculatorIconActive from "../public/images/calculator-active.png";
// import transferAdminIcon from "../public/images/transfer-data.png";
// import transferAdminIconActive from "../public/images/transfer-data-active.png";
// import chatIcon from "../public/images/chat.png";
// import chatIconActive from "../public/images/chat-active.png";
// import requestIcon from "../public/images/request.png";
// import requestIconActive from "../public/images/request-active.png";
// import layouticon from "../public/images/layouticon.png"
// import layouticonactive from "../public/images/layouticonactive.png"
// import referIcon from "../public/images/referIcon.png";
// import referIconActive from "../public/images/referIconActive.png";

// export default function Sidebar({ toggleSidebar, isMediumScreen }) {
//   const path = usePathname();
//   const [role, setRole] = useState(null);
//   const pathname = "/" + path.split("/")[1];

//   useEffect(() => {
//     setRole(getLocalStorageItem("role"));
//   }, [role]);

//   const menuItems = {
//     super_admin: [
//       {
//         href: Routes.mamAdmin,
//         icon: mamAdminIcon,
//         iconActive: mamAdminIconActive,
//         label: "MAM Admin",
//       },

//       {
//         href: Routes.reports,
//         icon: reportsIcon,
//         iconActive: reportsIconActive,
//         label: "Reports",
//       },
//       // {
//       //   href: Routes.manageStripePlans,
//       //   icon: managePlansIcon,
//       //   iconActive: managePlansIconActive,
//       //   label: "Manage Stripe Plan",
//       // },

//       {
//         href: Routes.request,
//         icon: requestIcon,
//         iconActive: requestIconActive,
//         label: "Sign Up Request",
//       },
//        {
//         href: Routes.alltransactionlist,
//         icon: reportsIcon,
//         iconActive: reportsIconActive,
//         label: "All Transaction",
//       },
//       {
//         href: Routes.manageCoupons,
//         icon: manageCouponsIcon,
//         iconActive: manageCouponsIconActive,
//         label: "Manage Coupons",
//       },
//       {
//         href: Routes.transferAdmin,
//         icon: transferAdminIcon,
//         iconActive: transferAdminIconActive,
//         label: "Transfer Admin",
//       },
//       {
//         href: Routes.referral,
//         icon: referIcon,
//         iconActive: referIconActive,
//         label: "Referrals",
//       },

//     ],
//     admin: [
//       {
//         href: Routes.trainer,
//         icon: trainerIcon,
//         iconActive: trainerIconActive,
//         label: "Trainer",
//       },
//       {
//         href: Routes.dietPlan,
//         icon: managePlansIcon,
//         iconActive: managePlansIconActive,
//         label: "Diet Plan",
//       },
//       {
//         href: Routes.message,
//         icon: chatIcon,
//         iconActive: chatIconActive,
//         label: "Message",
//       },
//       {
//         href: Routes.customerplanrequesttoadmin,
//         icon: reportsIcon,
//         iconActive: reportsIconActive,
//         label: "Diet Plan Requests",
//       },
//       {
//         href: Routes.customerRemoveRequest,
//         icon: reportsIcon,
//         iconActive: reportsIconActive,
//         label: "Customer Delete Requests",
//       },
//       {
//         href: Routes.mealplantemplate,
//         icon: layouticon,
//         iconActive: layouticonactive,
//         label: "Manage Templates & Foods",
//       },
//     ],
//     trainer: [
//       {
//         href: Routes.customer,
//         icon: customerIcon,
//         iconActive: customerIconActive,
//         label: "Customers",
//       },
//       {
//         href: Routes.calculators,
//         icon: calculatorIcon,
//         iconActive: calculatorIconActive,
//         label: "Calculators",
//       },
//       {
//         href: Routes.message,
//         icon: chatIcon,
//         iconActive: chatIconActive,
//         label: "Message",
//       },
//       // {
//       //   href: Routes.customerplanrequesttotrainer,
//       //   icon: reportsIcon,
//       //   iconActive: reportsIconActive,
//       //   label: "Diet Plan Requests",
//       // },
//       {
//         href: Routes.trainersubscriptionplan,
//         icon: managePlansIcon,
//         iconActive: managePlansIconActive,
//         label: "Subscription",
//       },
//       {
//         href: Routes.mealplantemplate,
//         icon: layouticon,
//         iconActive: layouticonactive,
//         label: "Manage Templates & Foods",
//       },
//     ],
//     customer: [
//       {
//         href: Routes.dietPlan,
//         icon: managePlansIcon,
//         iconActive: managePlansIconActive,
//         label: "Diet Plan",
//       },
//       {
//         href: Routes.calculators,
//         icon: calculatorIcon,
//         iconActive: calculatorIconActive,
//         label: "Calculators",
//       },
//       {
//         href: Routes.message,
//         icon: chatIcon,
//         iconActive: chatIconActive,
//         label: "Message",
//       },

//       // {
//       //   href: Routes.subscriptionPlanPersonalized,
//       //   icon: subscriptionIcon,
//       //   iconActive: subscriptionIcon,
//       //   label: "Personalized Diet Plan",
//       // },

//     ],
//   };

//   const renderMenuItem = (item) => {
//     const isActive = pathname === item.href;

//     return (
//       <Link
//         key={item.href}
//         href={item.href}
//         onClick={() => isMediumScreen && toggleSidebar()}
//         className={classNames(
//           styles.menuItem,
//           isActive && styles.menuItemActive,
//           "flex items-center space-x-2 " // force black color here
//         )}
//         style={{ padding: "10px 10px" }}
//       >
//         <Image
//           src={pathname === item.href ? item.iconActive : item.icon}
//           height={20}
//           width={20}
//           alt={`${item.label}-icon`}
//           style={{
//             filter:
//               pathname === item.href
//                 ? "none"
//                 : "brightness(0) saturate(100%) invert(50%) sepia(8%) saturate(3%) hue-rotate(174deg) brightness(97%) contrast(91%)",
//           }}
//         />

//         <Typography sx={{ fontWeight: 400, color: `${isActive ? '#2f855a' : 'black'} !important` , }}>
//           {item.label}
//         </Typography>
//       </Link>
//     );
//   };

//   return (
//     <Grid item xl={2} lg={3}>
//       <div className={styles.sidebarSection}>
//         <div className="flex justify-between flex-col flex-1 overflow-auto">
//           <div className="mb-6 p-2">
//             {role && menuItems[role]?.map(renderMenuItem)}
//           </div>
//         </div>
//       </div>
//     </Grid>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { Routes } from "@/config/routes";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { CircularProgress, Grid, Skeleton, Typography } from "@mui/material";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "../styles/component/sidebar.module.scss";

import logo from "../public/images/logo.webp";
import { getSystemRoleLabel } from "./roles";

import { useGetParentDetails } from "@/helpers/hooks/parentdetails/getparentdetails";
// import styles from "../styles/component/header.module.scss";

import sidebarLogo from "../public/images/logo-with-name.png";
import {
  ArrowRightLeft,
  Calculator,
  CalendarDays,
  ChartColumn,
  CircleUserRound,
  ClipboardPen,
  LayoutDashboard,
  MessageSquareText,
  ReceiptText,
  SquareUser,
  TicketPercent,
  UserLock,
  UserMinus,
  Users,
  Users2,
  Utensils,
} from "lucide-react";
import {
  GroupAdd,
  GroupAddOutlined,
  SyncAltOutlined,
  TransferWithinAStation,
} from "@mui/icons-material";

export default function Sidebar({ toggleSidebar, isMediumScreen }) {
  const path = usePathname();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState(null);
  const pathname = "/" + path.split("/")[1];
  const { data, isFetching } = useGetParentDetails();
  const parentDetails = data?.data;
  useEffect(() => {
    setRole(getLocalStorageItem("role"));
  }, [role]);
  useEffect(() => {
    setMounted(true); // render only after hydration
  }, []);
  const menuItems = {
    super_admin: [
      {
        href: Routes.mamAdmin,
        icon: <UserLock />,
        iconActive: <UserLock />,
        label: "MAM Admin",
      },

      {
        href: Routes.reports,
        icon: <ChartColumn />,
        iconActive: <ChartColumn />,
        label: "Reports",
      },
      // {
      //   href: Routes.manageStripePlans,
      //   icon: managePlansIcon,
      //   iconActive: managePlansIconActive,
      //   label: "Manage Stripe Plan",
      // },

      {
        href: Routes.request,
        icon: <Users />,
        iconActive: <Users />,
        label: "Sign Up Request",
      },
      {
        href: Routes.alltransactionlist,
        icon: <ReceiptText />,
        iconActive: <ReceiptText />,
        label: "All Transaction",
      },
      {
        href: Routes.manageCoupons,
        icon: <TicketPercent />,
        iconActive: <TicketPercent />,
        label: "Manage Coupons",
      },
      {
        href: Routes.transferAdmin,
        icon: <ArrowRightLeft />,
        iconActive: <ArrowRightLeft />,
        label: "Transfer Admin",
      },
      {
        href: Routes.referral,
        icon: <GroupAddOutlined />,
        iconActive: <GroupAddOutlined />,
        label: "Referrals",
      },
    ],
    admin: [
      {
        href: Routes.trainer,
        icon: <SquareUser />,
        iconActive: <SquareUser />,
        label: "Trainer",
      },
      {
        href: Routes.dietPlan,
        icon: <Utensils />,
        iconActive: <Utensils />,
        label: "Diet Plan",
      },
      {
        href: Routes.message,
        icon: <MessageSquareText />,
        iconActive: <MessageSquareText />,
        label: "Message",
      },
      // {
      //   href: Routes.customerplanrequesttoadmin,
      //   icon: <ClipboardPen/>,
      //   iconActive: <ClipboardPen/>,
      //   label: "Diet Plan Requests",
      // },
      {
        href: Routes.customerRemoveRequest,
        icon: <UserMinus />,
        iconActive: <UserMinus />,
        label: "Customer Delete Requests",
      },
      {
        href: Routes.mealplantemplate,
        icon: <LayoutDashboard />,
        iconActive: <LayoutDashboard />,
        label: "Manage Templates & Foods",
      },
    ],
    trainer: [
      {
        href: Routes.customer,
        icon: <Users2 />,
        iconActive: <Users2 />,
        label: "Customers",
      },
      {
        href: Routes.calculators,
        icon: <Calculator />,
        iconActive: <Calculator />,
        label: "Calculators",
      },
      {
        href: Routes.message,
        icon: <MessageSquareText />,
        iconActive: <MessageSquareText />,
        label: "Message",
      },
      // {
      //   href: Routes.customerplanrequesttotrainer,
      //   icon: reportsIcon,
      //   iconActive: reportsIconActive,
      //   label: "Diet Plan Requests",
      // },
      {
        href: Routes.trainersubscriptionplan,
        icon: <CalendarDays />,
        iconActive: <CalendarDays />,
        label: "Subscription",
      },
      {
        href: Routes.mealplantemplate,
        icon: <LayoutDashboard />,
        iconActive: <LayoutDashboard />,
        label: "Manage Templates & Foods",
      },
    ],
    customer: [
      {
        href: Routes.dietPlan,
        icon: <Utensils />,
        iconActive: <Utensils />,
        label: "Diet Plan",
      },
      {
        href: Routes.calculators,
        icon: <Calculator />,
        iconActive: <Calculator />,
        label: "Calculators",
      },
      {
        href: Routes.message,
        icon: <MessageSquareText />,
        iconActive: <MessageSquareText />,
        label: "Message",
      },
      {
        href: Routes.customersubscriptionplan,
        icon: <CalendarDays />,
        iconActive: <CalendarDays />,
        label: "Subscription",
      },
      {
        href: Routes.profile,
        icon: <CircleUserRound />,
        iconActive: <CircleUserRound />,
        label: "Profile",
      },
      // {
      //   href: Routes.subscriptionPlanPersonalized,
      //   icon: subscriptionIcon,
      //   iconActive: subscriptionIcon,
      //   label: "Personalized Diet Plan",
      // },
    ],
  };

  const renderMenuItem = (item) => {
    const isActive = pathname === item.href;

    if (!mounted) return null;

    // Decide which icon to use
    const IconComponent = pathname === item.href ? item.iconActive : item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => isMediumScreen && toggleSidebar()}
        className={classNames(
          styles.menuItem,
          isActive && styles.menuItemActive,
          "flex items-center space-x-2 group"
        )}
        style={{ padding: "8px 8px" }}
      >
        {typeof IconComponent === "string" || IconComponent?.src ? (
          <Image
            src={IconComponent}
            height={20}
            width={20}
            alt={`${item.label}-icon`}
            style={{
              filter: isActive
                ? "none"
                : "brightness(0) saturate(100%) invert(50%) sepia(8%) saturate(3%) hue-rotate(174deg) brightness(97%) contrast(91%)",
            }}
          />
        ) : (
          <span
            className="flex flex-col h-full justify-center"
            style={{ width: 20, height: 20, justifyContent: "center" }}
          >
            {React.cloneElement(IconComponent, {
              size: 20,
              className: classNames(
                isActive
                  ? "text-white group-hover:text-black"
                  : "text-[#8b8b8b] group-hover:text-gray-700"
              ),
            })}
          </span>
        )}

        <Typography
          sx={{
            fontWeight: 300,
            color: `${isActive ? "white" : "black"} !important`,
            "&:hover": {
              color: `${isActive ? "white" : "black"} !important`,
            },
            "&:hover, a:hover &": {
              color: "black !important",
            },
          }}
        >
          {item.label}
        </Typography>
      </Link>
    );
  };

  return (
    <Grid item xl={2} lg={3}>
      <div className={styles.sidebarSection}>
        <Grid
          item
          xl={2}
          lg={3}
          sx={{
            display: {
              xl: "flex",
              lg: "flex",
              md: "none",
              sm: "none",
              xs: "none",
            },
            justifyContent: "space-between",
          }}
          borderBottom={1}
          borderColor={"#dddddd"}
        >
          {/* <Link > */}
          {/* <Link href={Routes.dashboard}> */}
          <Image
            src={sidebarLogo}
            // height={80}
            // width={229}
            alt="brand-logo"
            className="h-[75px] w-full px-6 object-fit"
            // className={style.sidebarLogo}
            // style={{ height: "auto", width: "auto" }}
            priority
          />
          {/* </Link> */}
        </Grid>

        <div className="flex flex-1 flex-col items-center h-full min-w-[265px]">
          {/* Sidebar Menu */}
          <div className="w-full mb-3 p-2">
            {role && menuItems[role]?.map(renderMenuItem)}
          </div>

          {/* <h1 className="w-full border-t border-gray-200"></h1> */}
          {/* Divider with text */}

          {/* {role === "super_admin" || "admin" && (
            
          )} */}
          {role !== "admin" && role !== "super_admin" && (
            <>
              <div className="w-full flex items-center justify-center relative my-2">
                {" "}
                <span className="absolute inset-x-0 top-1/2 border-t border-gray-200"></span>{" "}
                <Typography
                  variant="caption"
                  sx={{
                    color: "#A0AEC0",
                    fontStyle: "italic",
                    backgroundColor: "white",
                    px: 1,
                    zIndex: 1,
                  }}
                >
                  {" "}
                  Your point of contact{" "}
                </Typography>{" "}
              </div>{" "}
              {/* Profile Section */}{" "}
              {mounted &&
                (isFetching ? (
                  <div className="flex flex-col items-center text-center bg-gradient-to-t from-gray-50 to-white p-4 rounded-xl shadow-sm">
                    {/* Avatar Skeleton */}
                    <Skeleton
                      variant="circular"
                      width={70}
                      height={70}
                      className="mb-3"
                    />

                    {/* Name Skeleton */}
                    <Skeleton
                      variant="rectangular"
                      width={120}
                      height={24}
                      className="mb-2 rounded-md"
                    />

                    {/* Role Skeleton */}
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={18}
                      className="rounded-md"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center bg-gradient-to-t from-gray-50 to-white p-4 rounded-xl shadow-sm">
                    <div className="relative w-[70px] h-[70px] rounded-full overflow-hidden mb-3 border-2 border-green-400 shadow-md hover:scale-105 transition-transform duration-300">
                      <Image
                        src={parentDetails?.profile_image || logo}
                        alt="User Avatar"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-md shadow-md">
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600 }}
                        title={parentDetails?.full_name || ""}
                      >
                        {(parentDetails?.full_name?.length > 20
                          ? parentDetails.full_name.substring(0, 20) + "..."
                          : parentDetails?.full_name) || ""}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.8rem", opacity: 0.9 }}
                      >
                        {getSystemRoleLabel(parentDetails?.role) || "Member"}
                      </Typography>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </Grid>
  );
}
