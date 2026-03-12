"use client";

import TrainerList from "@/component/Dashboard/MamAdmin/TrainerList";

export default function Page() {
  return (
    <div className="h-full flex-1 flex overflow-auto p-4">
      <TrainerList />
    </div>
  );
}
