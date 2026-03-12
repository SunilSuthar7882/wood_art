"use client"
import DeleteConfirmationModal from "@/component/DeleteConfirmationModal";
import { Routes } from "@/config/routes";
import { accountStatusBadgeFormatter } from "@/helpers/badgeFormatter";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useGetTrainers } from "@/helpers/hooks/mamAdmin/trainerList";
import { MenuItem, Paper, Select, Tooltip } from "@mui/material";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import addIcon from "../../../public/images/add-icon.png";
import backIcon from "../../../public/images/back-arrow.png";
// import editIcon from "../../../public/images/edit-btn-with-bg.png";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { useDeleteCustomerByTrainer } from "@/helpers/hooks/customer/customer";
import {
  Delete,
  Mail,
  Pencil,
  Phone,
  Trash2,
  User,
  UserMinus,
} from "lucide-react";
import CustomTable from "@/component/CommonComponents/CommonTable";
import { useDeleteTrainer } from "@/helpers/hooks/mamAdmin/deletetrainer";
import CommonProfilePic from "@/component/CommonComponents/CommonProfilePic";
import { useDeleteCustomerbySuperadmin } from "@/helpers/hooks/customer/deletecustoemrbysuperadmin";
import { useDeleteCustomerbyadmin } from "@/helpers/hooks/customer/deletecustoemrbyadmin";
import DisassociateCustomerModal from "@/component/DisassociateCustomerModal";
import { SystemRole } from "@/component/enums";
import { successNotification } from "@/helpers/notification";
import TableEditActionIcon from "@/component/CommonComponents/TableEditActionIcon";
import TableDeleteActionButton from "@/component/CommonComponents/TableDeleteActionButton";
import { getSystemRoleLabel } from "@/component/roles";
import { useGetusertrainerbysuperadmin } from "@/helpers/hooks/trainersectionapi/getusertrainerbysuperadmin";
import { useGetuseradminbysuperadmin } from "@/helpers/hooks/mamAdmin/getuseradminbysuperadmin";
import avatarimage from "@/public/avatarimage.jpeg";
export default function TrainerList({ adminId }) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const role = getLocalStorageItem("role");
  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);
  const { mutate: deleteTainer, isPending: isdeleteTrainerPending } =
    useDeleteTrainer();
  const [page, setPage] = useState(0);
  const { mutate: deleteCustomerbysuperadmin } =
    useDeleteCustomerbySuperadmin();
  const { mutate: deleteCustomerbyadmin } = useDeleteCustomerbyadmin();
  // const [pageSize, setPageSize] = useState(10);
  const [isDeallocateModalOpen, setIsDeallocateModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const params = useParams();

  const {
    data: useradmindata,
    isFetching: isFetchinguseradmindata,
    refetch: refetchuseradmindata,
  } = useGetuseradminbysuperadmin(adminId, { enabled: !!adminId });
  const adminData = useradmindata?.data;
  const { data, isFetching, refetch } = useGetTrainers(
    page,
    rowsPerPage,
    adminId,
    activeStatus,
    searchValue
  );
  const { mutate: deleteTrainerByAdmin } = useDeleteCustomerByTrainer();

  const pageInfo = data?.data?.page_information || {};
  const currentPage = (pageInfo.current_page ?? 1) - 1; // API 1-based → UI 0-based
  const totalRows = pageInfo.total_data ?? 0;

  useEffect(() => {
    if (adminId) {
      localStorage.setItem("adminId", adminId);
    }
  }, [adminId]);

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, activeStatus, searchValue]);

  const handleDelete = () => {
    deleteTainer(trainerToDelete.id, {
      onSuccess: (data) => {
        // showSnackbar(data?.message, "success");
        setIsModalOpen(false);
        setTrainerToDelete(null);
        refetch();
      },
      onError: (error) => {
        // showSnackbar(error?.response?.data?.message, "error");
        setIsModalOpen(false);
        setTrainerToDelete(null);
        refetch();
      },
    });
    // setIsModalOpen(false);
    // setTrainerToDelete(null);
    // refetch();
  };
  const handleCustomerDelete = () => {
    if (role === "super_admin") {
      deleteCustomerbysuperadmin(trainerToDelete.id, {
        onSuccess: (data) => {
          setIsModalOpen(false);
          setTrainerToDelete(null);
          refetch();
        },
        onError: (error) => {
          setIsModalOpen(false);
          setTrainerToDelete(null);
          refetch();
        },
      });
    } else if (role === "admin") {
      deleteCustomerbyadmin(trainerToDelete.id, {
        onSuccess: (data) => {
          setIsModalOpen(false);
          setTrainerToDelete(null);
          refetch();
        },
        onError: (error) => {
          setIsModalOpen(false);
          setTrainerToDelete(null);
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
      field: "total_customers",
      headerName: "Total Customers",
      width: 150,
    },
    {
      field: "role",
      headerName: "Role",
      width: 100,
      renderCell: (params) => getSystemRoleLabel(params.value),
    },
    {
      field: "phoneNumber",
      headerName: "Phone number",
      width: 180,
    },
    {
      field: "status",
      headerName: "Status",
      width: 170,
      renderCell: (params) => {
        return accountStatusBadgeFormatter(params.row.status);
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 170,
      // flex:1,
      align: "left",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center h-full gap-4">
          <TableEditActionIcon
            onClick={(e) => {
              e.stopPropagation();
              const url =
                params.row.role === "customer"
                  ? `${Routes.editCustomer}${params.row.id}`
                  : `${Routes.editTrainer}/${params.row.id}`;
              router.push(url); // ✅ use router from parent component
            }}
            className="text-gray-500 hover:text-green-600 transition-colors"
          />

          {["trainer", "customer"].includes(params.row.role) && (
            <TableDeleteActionButton
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
                setTrainerToDelete(params.row);
              }}
            />
          )}
          {(role === SystemRole.SUPER_ADMIN || role === SystemRole.ADMIN) &&
            ["customer"].includes(params.row.role) && (
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
    total_customers: row.total_customers,
    role: row.role,
    phoneNumber: row.phone_number,
    status: row.status,
    action: row.action,
  }));

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const searchParams = useSearchParams();
  // const router = useRouter();

  const adminName = searchParams.get("admin_name");
  // const trainerName = searchParams.get("trainer_name");

  // const handleRowClick = (params) => {
  //   // Build URL with current adminName and trainerName from URL search params
  //   if (params.row.role === "customer") {
  //     router.push(`${Routes.editCustomer}${params.row.id}`);
  //   } else if (params.row.role === "admin") {
  //     router.push(`${Routes.trainer}/${params.row.id}`);
  //   } else {
  //     router.push(
  //       `${Routes.customerList}/${
  //         params.row.id
  //       }?admin_name=${encodeURIComponent(
  //         adminName || ""
  //       )}&trainer_name=${encodeURIComponent(params.row.fullName)}`
  //     );
  //   }
  // };

  const handleRowClick = (params) => {
    if (params.row.role === "customer") {
      router.push(`${Routes.editCustomer}${params.row.id}`);
    } else if (params.row.role === "admin") {
      router.push(`${Routes.trainer}/${params.row.id}`);
    } else {
      // Construct query parameters
      const queryParams = new URLSearchParams();
      if (adminName) {
        queryParams.append("admin_name", adminName);
      }
      queryParams.append("trainer_name", params.row.fullName);

      router.push(
        `${Routes.customerList}/${params.row.id}?${queryParams.toString()}`
      );
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <>
      <div className="flex flex-col h-full w-full">
        {mounted && role !== "admin" && (
          <div className="flex items-center bg-[#f0fff4] px-4 py-3 rounded-lg shadow-md border gap-4 mb-3">
            {/* Profile */}
            <div className="relative w-[66px] h-[66px] shrink-0 items-center">
              {isFetchinguseradmindata ? (
                // Skeleton for profile
                <div className="w-full h-full rounded-full bg-gray-300 border-[1px] border-green-500 animate-pulse" />
              ) : adminData?.profile_image ? (
                <Image
                  src={adminData.profile_image}
                  alt="Admin"
                  fill
                  sizes="66px"
                  className="rounded-full object-cover border-[1px] border-green-500"
                />
              ) : (
                <div className="relative w-full h-full rounded-full bg-gray-200 border-[1px] border-green-500 flex items-center justify-center text-gray-500">
                  <Image
                    src={avatarimage}
                    alt="avatarimage"
                    fill
                    sizes="66px"
                    className="rounded-full object-cover border-[1px] border-green-500"
                  />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col md:flex-row text-sm leading-relaxed w-full overflow-hidden gap-6">
              {/* Left Section: Name, Email, Phone */}
              <div className="flex flex-col gap-1 w-full">
                {isFetchinguseradmindata ? (
                  // Skeleton for text
                  <>
                    <div className="h-[22px] w-32 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-[22px] w-48 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-[22px] w-40 bg-gray-300 rounded animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-2 text-gray-800 font-semibold">
                      <User size={14} className="text-green-600" />
                      {adminData?.full_name}
                    </span>

                    <span className="flex items-center gap-2 text-gray-600">
                      <Mail size={14} className="text-blue-600" />
                      {adminData?.email}
                    </span>

                    <span className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} className="text-purple-600" />
                      {adminData?.phone_number}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-4 h-10">
          <h1 className="text-2xl font-bold mb-0 flex items-center gap-2">
            {mounted && adminId && (
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <Image
                  src={backIcon}
                  height={22}
                  width={22}
                  className="me-4 ms-1"
                  alt="back-icon"
                />
                Trainers
              </button>
            )}
            {!mounted || !adminId ? "Trainers" : null}
          </h1>

          <div className="flex items-center gap-3">
            <Link
              href={Routes.addTrainer}
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
                  alt="Add"
                  fill
                  sizes="15px"
                  style={{ objectFit: "contain" }}
                />
              </span>{" "}
              Add Trainers
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg h-full flex-1 p-4 flex flex-col overflow-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="w-1/4 my-2">
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
              display: "flex",
            }}
          >
            <CustomTable
              rows={rows}
              columns={columns}
              loading={isFetching}
              onRowClick={handleRowClick}
              pagination={{
                page: currentPage,
                rowsPerPage,
                totalRows,
              }}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              containerSx={{ overflow: "auto" }}
            />
          </Paper>
        </div>
        <DeleteConfirmationModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          // onConfirm={handleDelete}
          // title="Delete Trainer"
          onConfirm={
            trainerToDelete?.role === "customer"
              ? handleCustomerDelete
              : handleDelete
          }
          title={
            trainerToDelete?.role === "customer"
              ? "Delete Customer"
              : "Delete Trainer"
          }
          content={`Are you sure you want to delete ${trainerToDelete?.fullName} ?`}
          confirmButtonText="Yes, Delete"
          cancelButtonText="No, Keep"
        />

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
    </>
  );
}
