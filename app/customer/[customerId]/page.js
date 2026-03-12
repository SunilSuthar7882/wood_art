"use client"
import DietPlans from "@/component/CommonComponents/DietPlans";
import TrainerCustomerDietPlan from "@/component/CommonComponents/TrainerCustomerDietPlan";
import dynamic from "next/dynamic";


export default function Page() {
  return (
    <div className="flex-1 h-full overflow-auto p-4">
      <TrainerCustomerDietPlan />
    </div>
  );
}
