"use client";
import Customers from "@/component/Dashboard/Customers/Customers";
export default function Page() {
  return (
    <div className="h-full flex flex-col flex-1 overflow-auto p-4">
      <Customers />
    </div>
  );
}
