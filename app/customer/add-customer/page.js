"use client";;
import { use } from "react";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";

import backIcon from "../../../public/images/back-arrow.png";

const AddEditCustomer = dynamic(
  () => import("@/component/Dashboard/Customers/AddEditCustomer"),
  { ssr: false }
);

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
            Add Customer
          </button>
        </h1>
      </div>

      <div className="bg-white rounded-lg h-[94%] flex-1 p-4 overflow-y-scroll">
        {/* <AddEditCustomer customerId={params.id} /> */}
        <AddEditCustomer customerId={params.id} action={"add-customer-by-admin"} />
      </div>
    </div>
  );
}
