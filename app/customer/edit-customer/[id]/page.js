"use client";;
import { use } from "react";

import AddEditCustomer from "@/component/Dashboard/Customers/AddEditCustomer";
import Image from "next/image";
import { useRouter, useSearchParams,useParams } from "next/navigation";

import backIcon from "../../../../public/images/back-arrow.png";
import { useGetusercustomerbysuperadmin } from "@/helpers/hooks/customer/getusercustomerbysuperadmin";

const  EditUser =  props => {
  const params = use(props.params);

  const router = useRouter()
  const {
       data: usercustomerdata,
       isFetching: isFetchingusercustomerdata,
       refetch: refetchusercustomerdata,
     } = useGetusercustomerbysuperadmin(
       params.id
     );
     
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
            Edit Customer
          </button>
        </h1>
      </div>

      <div className="bg-white rounded-lg h-[94%] flex flex-col flex-1 p-4 overflow-auto">
        <AddEditCustomer customerId={params.id} action={"edite-customer-by-superadmin"} storeediteData={usercustomerdata?.data} loading={isFetchingusercustomerdata} />
      </div>
    </div>
  );
}

export default EditUser