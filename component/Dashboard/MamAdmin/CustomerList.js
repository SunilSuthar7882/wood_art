import DeleteConfirmationModal from "@/component/DeleteConfirmationModal";
import { Routes } from "@/config/routes";
import { useGetCustomers } from "@/helpers/hooks/mamAdmin/customerList";
import { MenuItem, Select, Paper } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import addIcon from "../../../public/images/add-icon.png";
import backIcon from "../../../public/images/back-arrow.png";
import { useDeleteCustomerbySuperadmin } from "@/helpers/hooks/customer/deletecustoemrbysuperadmin";
import { errorNotification, successNotification } from "@/helpers/notification";
import { useDeleteCustomerbyadmin } from "@/helpers/hooks/customer/deletecustoemrbyadmin";
import { Mail, Pencil, Phone, Trash2, User, UserMinus } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
import DisassociateCustomerModal from "@/component/DisassociateCustomerModal";
import { SystemRole } from "@/component/enums";
import CustomTable from "@/component/CommonComponents/CommonTable";
import CommonProfilePic from "@/component/CommonComponents/CommonProfilePic";
import TableEditActionIcon from "@/component/CommonComponents/TableEditActionIcon";
import TableDeleteActionButton from "@/component/CommonComponents/TableDeleteActionButton";
import { useGetusertrainerbysuperadmin } from "@/helpers/hooks/trainersectionapi/getusertrainerbysuperadmin";
import avatarimage from "@/public/avatarimage.jpeg";

export default function CustomerList({ trainerId }) {
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const { mutate: deleteCustomerbysuperadmin } =
    useDeleteCustomerbySuperadmin();
  const { mutate: deleteCustomerbyadmin } = useDeleteCustomerbyadmin();
  const [role, setrole] = useState(null);
  const [isDeallocateModalOpen, setIsDeallocateModalOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const page = 1;
  const params = useParams();
  const trainerID = Number(params.id);
  const {
    data: usertrtainerdata,
    isFetching: isFetchingusertrtainerdata,
    refetch: refetchusertrtainerdata,
  } = useGetusertrainerbysuperadmin(trainerID);
  const trainerData = usertrtainerdata?.data;
  const { data, isFetching, refetch } = useGetCustomers(
    page + 1,
    rowsPerPage,
    activeStatus,
    searchValue,
    trainerId
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const pageInfo = data?.data?.page_information || {};
  const currentPage = (pageInfo.current_page ?? 1) - 1; // API 1-based → UI 0-based
  const totalRows = pageInfo.total_data ?? 0;

  useEffect(() => {
    if (trainerId) {
      localStorage.setItem("trainerId", trainerId);
    }
  }, [trainerId]);

  useEffect(() => {
    setrole(localStorage.getItem("role"));
  }, []);

  const handleDelete = () => {
    if (role === "super_admin") {
      deleteCustomerbysuperadmin(customerToDelete.id, {
        onSuccess: (data) => {
          refetch();
          successNotification(data?.message);
          setIsModalOpen(false);
          setCustomerToDelete(null);
          refetch();
        },
        onError: (error) => {
          errorNotification(error?.response?.data?.message);
          setIsModalOpen(false);
          setCustomerToDelete(null);
          refetch();
        },
      });
    } else if (role === "admin") {
      deleteCustomerbyadmin(customerToDelete.id, {
        onSuccess: (data) => {
          refetch();
          successNotification(data?.message);
          setIsModalOpen(false);
          setCustomerToDelete(null);
          refetch();
        },
        onError: (error) => {
          errorNotification(error?.response?.data?.message);
          setIsModalOpen(false);
          setCustomerToDelete(null);
          refetch();
        },
      });
    }
  };
  const handleDeallocate = () => {
    successNotification(
      `${customerToDelete.fullName} has been deallocated successfully.`
    );
    setIsDeallocateModalOpen(false);
    setCustomerToDelete(null);
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, activeStatus, searchValue]);

  const columns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      width: 65,
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    {
      field: "fullName",
      headerName: "Name",
      sortable: true,
      width: 250,
      renderCell: (params) => (
        <CommonProfilePic
          fullName={params.row.fullName}
          profileImage={params.row.profileImage}
        />
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 260,
    },
    {
      field: "phoneNumber",
      headerName: "Phone number",
      width: 180,
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 170,
    //   renderCell: (params) => {
    //     return accountStatusBadgeFormatter(params.row.status);
    //   },
    // },
    {
      field: "action",
      headerName: "Action",
      width: 170,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center justify-center h-full gap-4">
          <TableEditActionIcon
            // href={`${Routes.editCustomer}/${params.row.id}`}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`${Routes.editCustomer}/${params.row.id}`);
            }}
            className="text-gray-500 hover:text-green-600 transition-colors"
          />
          <TableDeleteActionButton
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
              setCustomerToDelete(params.row);
            }}
            className="text-gray-500 hover:text-red-600 transition-colors"
          />
          {(role === SystemRole.SUPER_ADMIN || role === SystemRole.ADMIN) && (
            <Tooltip title="Disassociate Customer" arrow>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeallocateModalOpen(true);
                  setCustomerToDelete(params.row);
                }}
                className="text-gray-500 hover:text-yellow-600 transition-colors"
              >
                <UserMinus className="w-5 h-5" />
              </button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
  const rows = data?.data?.page_data?.map((row, i) => ({
    id: row.id,
    profileImage: row.profile_image,
    fullName: row.full_name,
    email: row.email,
    phoneNumber: row.phone_number,
    status: row.status,
    action: row.action,
    createdAt: row.created_at,
  }));

  return (
    <div className=" flex flex-col h-full w-full">
      <div className="flex items-center bg-[#f0fff4] px-4 py-3 rounded-lg shadow-md border gap-4 mb-3">
        {/* Profile */}
        <div className="relative w-[66px] h-[66px] shrink-0 items-center">
          {isFetchingusertrtainerdata ? (
            <div className="w-full h-full rounded-full bg-gray-300 border-[1px] border-green-500 animate-pulse" />
          ) : trainerData?.profile_image ? (
            <Image
              src={trainerData.profile_image}
              alt="Trainer"
              sizes="66px"
              fill
              className="rounded-full object-cover border-[1px] border-green-500"
            />
          ) : (
            <div className="relative w-full h-full rounded-full bg-gray-200 border-[1px] border-green-500 flex items-center justify-center text-gray-500">
              <Image
                src={avatarimage}
                alt="avatarimage"
                sizes="66px"
                fill
                className="rounded-full object-cover border-[1px] border-green-500"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col md:flex-row text-sm leading-relaxed w-full overflow-hidden gap-6">
          <div className="flex flex-col gap-1 w-full">
            {isFetchingusertrtainerdata ? (
              <>
                <div className="h-[22px] w-32 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-[22px] w-48 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-[22px] w-40 bg-gray-300 rounded animate-pulse"></div>
              </>
            ) : (
              <>
                <span className="flex items-center gap-2 text-gray-800 font-semibold">
                  <User size={14} className="text-green-600" />
                  {trainerData?.full_name}
                </span>

                <span className="flex items-center gap-2 text-gray-600">
                  <Mail size={14} className="text-blue-600" />
                  {trainerData?.email}
                </span>

                <span className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} className="text-purple-600" />
                  {trainerData?.phone_number}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 h-10">
        <div className="flex items-center justify-between gap-48">
          <button onClick={() => router.back()} className="flex items-center">
            <Image
              src={backIcon}
              height={22}
              width={22}
              className="me-4 ms-1"
              alt="back-icon"
            />
            <h1 className="text-2xl font-bold mb-0">Customers</h1>
          </button>
        </div>

        <Link
          href={Routes.addCustomer}
          className="btn btn-primary flex items-center justify-center gap-2"
        >
          <span
            style={{
              position: "relative",
              width: 15,
              height: 15,
              display: "inline-block",
            }}
          >
            <Image
              src={addIcon}
              alt="add-icon"
              fill
              sizes="15px"
              style={{ objectFit: "contain" }}
            />
          </span>{" "}
          Add Customer
        </Link>
      </div>

      <div className="bg-white rounded-lg h-full flex-1 p-4 flex flex-col overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="w-1/4 relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent w-full appearance-none border rounded-lg py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={searchValue}
              autoComplete="off"
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
          </div>

          {/* <div>
            <Select
              sx={{
                height: "46px",
                width: "auto",
                backgroundColor: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "8px",
                },
              }}
              onChange={(e) => {
                setActiveStatus(e.target.value);
              }}
              value={activeStatus || "all"}
            >
              <MenuItem value="all">all</MenuItem>
              <MenuItem value="active">active</MenuItem>
              <MenuItem value="inactive">inactive</MenuItem>
            </Select>
          </div> */}
        </div>
        <Paper
          sx={{
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
            flex: 1,
            overflow: "auto",
            // minHeight:"400px",
          }}
        >
          <CustomTable
            rows={rows}
            columns={columns}
            loading={isFetching}
            pagination={{
              page: currentPage, // 👈 synced with API
              rowsPerPage,
              totalRows,
            }}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            hideFooter={false}
            containerSx={{ overflow: "auto" }}
          />
        </Paper>
      </div>
      <DeleteConfirmationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Customer"
        content={`Are you sure you want to delete ${customerToDelete?.fullName} ?`}
        confirmButtonText="Yes, Delete"
        cancelButtonText="No, Keep"
      />

      {/* {role === SystemRole.ADMIN && ( */}
      {(role === SystemRole.SUPER_ADMIN || role === SystemRole.ADMIN) && (
        <DisassociateCustomerModal
          open={isDeallocateModalOpen}
          onClose={() => {
            setIsDeallocateModalOpen(false);
            setCustomerToDelete(null);
          }}
          onConfirm={handleDeallocate}
          customerData={{
            id: customerToDelete?.id,
            name: customerToDelete?.fullName,
            email: customerToDelete?.email,
            phone: customerToDelete?.phoneNumber,
            joinDate: customerToDelete?.createdAt || null,
          }}
        />
      )}
    </div>
  );
}
