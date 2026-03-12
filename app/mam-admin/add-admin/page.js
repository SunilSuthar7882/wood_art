"use client";;
import { use } from "react";

import AddEditAdmin from "@/component/Dashboard/MamAdmin/AddEditAdmin";

import Image from "next/image";
import { useRouter } from "next/navigation";
import backIcon from "../../../public/images/back-arrow.png";

export default function Page(props) {
  const params = use(props.params);

  const router = useRouter();

  return (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between mb-4 h-10">
        <h1 className="text-2xl font-bold mb-0">
          <button onClick={() => router.back()} className="flex items-center">
            <Image
              src={backIcon}
              height={22}
              width={22}
              className="me-4 ms-1"
              alt="back-icon"
            />
            Add Admin
          </button>
        </h1>
      </div>

      <div className="bg-white rounded-lg flex-1 p-4">
        <AddEditAdmin adminId={params.id} action={"add-admin-by-superadmin"} />
      </div>
    </div>
  );
}
