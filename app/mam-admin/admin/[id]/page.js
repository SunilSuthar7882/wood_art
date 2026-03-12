"use client";;
import { use } from "react";
import TrainerList from "@/component/Dashboard/MamAdmin/TrainerList";

export default function Page(props) {
  const params = use(props.params);

  return (
    <div className="h-full flex-1 flex flex-col overflow-auto p-4">
      <TrainerList adminId={params.id} />
    </div>
  );
}
