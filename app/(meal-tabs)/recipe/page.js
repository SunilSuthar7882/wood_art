"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ManageFoods from "@/component/CommonComponents/ManageFood";
import TemplateMealPlan from "@/component/CommonComponents/TemplateMealPlan";
import Recipe from "@/component/CommonComponents/Recipe"; // Make sure this exists

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();

  // const [activeTab, setActiveTab] = useState("template");

  // useEffect(() => {
  //   if (pathname.includes("manage-food")) {
  //     setActiveTab("manage");
  //   } else if (pathname.includes("recipe")) {
  //     setActiveTab("recipe");
  //   } else {
  //     setActiveTab("template");
  //   }
  // }, [pathname]);

  // const handleTabClick = (tab) => {
  //   setActiveTab(tab);

  //   const newPath =
  //     tab === "template"
  //       ? "/template-plan"
  //       : tab === "manage"
  //       ? "/manage-foods"
  //       : "/recipe"; // added for recipie
  //   router.replace(newPath);
  // };

  return (
    // <div className="h-full flex flex-1 flex-col p-4">
     
      <div className="flex-1 flex flex-col overflow-auto">
        {/* {activeTab === "template" && <TemplateMealPlan />} */}
        {/* {activeTab === "manage" && <ManageFoods />} */}
        <Recipe />
      </div>
    // </div>
  );
}


