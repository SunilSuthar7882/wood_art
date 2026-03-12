"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import ManageFoods from "@/component/CommonComponents/ManageFood";
import TemplateMealPlan from "@/component/CommonComponents/TemplateMealPlan";
import Recipe from "@/component/CommonComponents/Recipe"; // Make sure this exists

export default function Page() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <TemplateMealPlan />
    </div>
  );
}
