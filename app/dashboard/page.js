"use client";

import Customer from "@/component/Dashboard/Customers/Customers";
import MamAdmin from "@/component/Dashboard/MamAdmin/MamAdmin";
import Trainer from "@/component/Dashboard/Trainer/Trainer";
import { getLocalStorageItem } from "@/helpers/localStorage";
import DietPlans from "@/component/CommonComponents/DietPlans";

const Dashboard = () => {
  const role = getLocalStorageItem("role");

  // Mapping of roles to components
  const roleComponentMap = {
    super_admin: <MamAdmin />,
    admin: <Trainer />,
    trainer: <Customer />,
    customer: <DietPlans />,
  };

  return (
    <div className="h-full flex-1 overflow-auto p-4">
      {roleComponentMap[role] || null}
    </div>
  );
};

export default Dashboard;
