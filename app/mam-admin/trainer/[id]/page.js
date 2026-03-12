"use client";
import { use } from "react";
import CustomerList from "@/component/Dashboard/MamAdmin/CustomerList";

export default function Page(props) {
  const params = use(props.params);

  return (
    <div className="h-full flex-1 flex flex-col overflow-auto p-4">
      <CustomerList trainerId={params.id} />
    </div>
  );
}
