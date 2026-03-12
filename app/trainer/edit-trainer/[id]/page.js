"use client";

import AddEditTrainer from "@/component/Dashboard/Trainer/AddEditTrainer";

import Image from "next/image";
import { useRouter } from "next/navigation";
import backIcon from "../../../../public/images/back-arrow.png";
import { useGetusertrainerbysuperadmin } from "@/helpers/hooks/trainersectionapi/getusertrainerbysuperadmin";
import { use } from "react";

export default function Page(props) {
  const params = use(props.params);
  const router = useRouter();
  const {
    data: usertrtainerdata,
    isFetching: isFetchingusertrtainerdata,
    refetch: refetchusertrtainerdata,
  } = useGetusertrainerbysuperadmin(params.id);

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
            Edit Trainer
          </button>
        </h1>
      </div>

      <div className="bg-white rounded-lg flex-1 p-4">
        <AddEditTrainer
          adminId={params.id}
          action={"edite-trainer-by-superadmin"}
          storeediteData={usertrtainerdata?.data}
          loading={isFetchingusertrtainerdata}
        />
      </div>
    </div>
  );
}
