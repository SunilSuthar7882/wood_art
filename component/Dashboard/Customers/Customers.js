"use client";

import { Routes } from "@/config/routes";
import { badgeFormatter } from "@/helpers/badgeFormatter";
import {
  useDeleteCustomerByTrainer,
  useGetCustomerByTrainer,
} from "@/helpers/hooks/customer/customer";
import {
  Chip,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Box,
  Avatar,
} from "@mui/material";
import { Target } from "lucide-react";
// import { DataGrid } from "@mui/x-data-grid";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import DeleteConfirmationModal from "@/component/DeleteConfirmationModal";
import addIcon from "../../../public/images/add-icon.png";
import deleteIcon from "../../../public/images/dlt-btn-with-bg.png";
import editIcon from "../../../public/images/edit-btn-with-bg.png";
import inviteIcon from "../../../public/images/invite-btn-with-bg.png";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import CustomTable from "@/component/CommonComponents/CommonTable";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { CirclePlus } from "lucide-react";
import TableEditActionIcon from "@/component/CommonComponents/TableEditActionIcon";
import TableDeleteActionButton from "@/component/CommonComponents/TableDeleteActionButton";
import CommonProfilePic from "@/component/CommonComponents/CommonProfilePic";

const Customers = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [page, setPage] = useState(0);
  // const [pageSize, setPageSize] = useState(10);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  // const [pageSize, setPageSize] = useState(10);
  // const page = 1;

  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const role = getLocalStorageItem("role");
  const { data, isFetching, refetch, isLoading } = useGetCustomerByTrainer(
    page,
    rowsPerPage,
    // activeStatus,
    searchValue,
    role
  );

    const pageInfo = data?.data?.page_information || {};
  const currentPage = (pageInfo.current_page ?? 1) - 1; // API 1-based → UI 0-based
  const totalRows = pageInfo.total_data ?? 0;

  const { mutate: deleteCustomerByTrainer, isPending } =
    useDeleteCustomerByTrainer();

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, searchValue]);

  const handleDelete = () => {
    deleteCustomerByTrainer(customerToDelete?.id, {
      onSuccess: () => {
        showSnackbar(
          "Customer delete request sent successfully to the admin. Once the admin approves the request, the customer will be deleted permanently.",
          "success",
          {
            autoHideDuration: null,
          }
        );
        setIsModalOpen(false);
        setCustomerToDelete(null);
        refetch();
      },
      onError: (error) => {
        showSnackbar(error?.response?.data?.message, "error");
        setIsModalOpen(false);
        setCustomerToDelete(null);
        refetch();
      },
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    {
      field: "fullName",
      headerName: "Name",
      sortable: true,
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center gap-2 w-full overflow-hidden">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            {/* <Avatar
              alt={params?.row?.fullName || "profile"}
              src={params?.row?.profile_image || "/default-profile.png"}
              sx={{ width: 32, height: 32 }}
            /> */}
            <CommonProfilePic
          fullName={params.row.fullName}
          profileImage={params.row.profileImage}
        />
          </Box>

          {params?.row?.plan?.type === "custom" && (
            <Tooltip title="Custom Diet Plan" arrow>
              <div
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    `${Routes.customerplanrequesttotrainer}/${params?.row?.plan?.request_id}`
                  );
                }}
              >
                <Target fontSize="small" className="text-green-500 h-5 w-5" />
              </div>
            </Tooltip>
          )}

          <div className="truncate">{params?.row?.fullName}</div>
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 300,
    },
    {
      field: "created_at",
      headerName: "Created At ",
      width: 180,
    },

    {
      field: "action",
      headerName: "Action",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const deleteStatus = params.row.delete_user?.[0]?.status;
        const isDisabled = deleteStatus && deleteStatus !== "rejected";
        const isRejected = deleteStatus === "rejected";

        return (
          <div className="flex items-center justify-center gap-2 h-full relative">
            <span>
              {" "}
              <TableEditActionIcon
                // title={
                //   isDisabled
                //     ? "User Delete Request Sent to Admin. Once the admin approves the request then the user will get deleted permanently."
                //     : "Edit"
                // }
                // href={{
                //   pathname: `${Routes.editCustomer}/${params.row.id}`,
                // }}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    e.stopPropagation();
                  } else {
                    e.stopPropagation();
                    router.push(`${Routes.editCustomer}/${params.row.id}`);
                  }
                }}
                disabled={isDisabled}
                className={`flex items-center justify-center ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                    : ""
                }`}
              />
            </span>

            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* <Tooltip
                // title={
                //   isDisabled
                //     ? "User Delete Request Sent to Admin. Once the admin approves the request then the user will get deleted permanently."
                //     : "Delete"
                // }
              > */}
              <span>
                {" "}
                {/* Wrap in span to prevent React tooltip warning when button is disabled */}
                {/* <button */}
                <TableDeleteActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isDisabled) return;

                    setIsModalOpen(true);
                    setCustomerToDelete(params.row);
                  }}
                  disabled={isDisabled}
                  className={`flex items-center justify-center ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : ""
                  }`}
                />
              </span>
              {/* </Tooltip> */}

              {/* Rejected dot with its own tooltip */}
              {isRejected && (
                <Tooltip
                  title="Delete request rejected by admin"
                  placement="top"
                  arrow
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "warning.main",
                      position: "absolute",
                      top: -11,
                      right: 6,
                      cursor: "default",
                      pointerEvents: "auto",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Tooltip>
              )}
            </Box>
          </div>
        );
      },
    },
    {
      field: "createplan",
      headerName: "Create Plan",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const deleteStatus = params.row.delete_user?.[0]?.status;
        const isDisabled = deleteStatus && deleteStatus !== "rejected";
        const isRejected = deleteStatus === "rejected";

        return (
          <div className="flex items-center justify-center gap-2 h-full relative">
            {/* Edit Button */}

            {/* <Tooltip
              title={
                isDisabled
                  ? "You cannot create diet plan when you have sent delete request."
                  : "Add Diet Plan"
              }
              arrow
            > */}
            <span>
              {" "}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    `${Routes.customerPlanByTrainer}${params.row.id}`
                  );
                  // setModalState({ open: true, isTemplateCreation: false });
                }}
                className="bg-[#01933c] border h-8 items-center flex text-white p-2 rounded-md"
                disabled={isDisabled}
              >
                Create Diet Plan
                {/* <CirclePlus className="w-[34px] h-[34px] text-[#a8a8a8] border border-[#e5e7eb] rounded-md p-1.5 hover:text-primary hover:border-primary transition" /> */}
              </button>
            </span>
            {/* </Tooltip> */}
          </div>
        );
      },
    },
  ];

  const rows = data?.data?.page_data?.map((row) => ({
    id: row.id,
    profileImage: row?.profile_image,
    fullName: row.full_name,
    email: row.email,
    created_at: dayjs(row.created_at).format("DD MMM YYYY, hh:mm A"),
    plan: row.custom_plan,
    delete_user: row.delete_user,
    accessGranted: row.accessGranted,
    accountStatus: row.accountStatus,
    details: row.details,
    createNewPlan: row.createNewPlan,
    action: row.action,
  }));

  const handleRowClick = (params) => {
    router.push(`${Routes.editCustomer}${params.row.id}`);
  };

  return (
    <div className=" flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-4 h-10">
        <h1 className="text-2xl font-bold mb-0">Customers</h1>
        <Link
          href={Routes.addCustomer}
          className="btn btn-primary flex items-center justify-center gap-2"
        >
          <span style={{ position: "relative", width: 15, height: 15, display: "inline-block" }}>
              <Image
                src={addIcon}
                alt="Add"
                fill
                sizes="15px"
                style={{ objectFit: "contain" }}
              />
            </span> Add Customer
        </Link>
      </div>

      <div className="bg-white rounded-lg h-full flex-1 p-4 flex flex-col">
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
        </div>
        <div className="flex flex-1 overflow-auto">
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
              loading={isLoading}
             pagination={{
                page: currentPage, // 👈 synced with API
                rowsPerPage,
                totalRows,
              }}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onRowClick={(params, event) => {
                const deleteStatus = params.row.delete_user?.[0]?.status;
                if (deleteStatus && deleteStatus !== "rejected") {
                  event.stopPropagation();
                  return;
                }
                handleRowClick(params);
              }}
              sx={{
                "& .MuiDataGrid-row:hover": {
                  cursor: "pointer",
                },
              }}
              getRowClassName={(params) => {
                const deleteStatus = params.row.delete_user?.[0]?.status;
                return deleteStatus && deleteStatus !== "rejected"
                  ? "bg-red-100 opacity-60 select-none"
                  : "";
              }}
              getRowTooltip={(row) => {
                const status = row.delete_user?.[0]?.status;
                return status && status !== "rejected"
                  ? "You have requested this customer’s deletion. The process is underway"
                  : "";
              }}
              containerSx={{ overflow: "auto" }}
            />
          </Paper>
        </div>
      </div>
      <div className="custom-delete-modal">
        <DeleteConfirmationModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Customer"
          content={
            <>
              Your delete request will be sent to the admin. Once the admin
              approves the request,{" "}
              <strong>{customerToDelete?.fullName}</strong> will get deleted.
            </>
          }
          confirmButtonText="Yes, Delete"
          cancelButtonText="No, Keep"
          confirmButtonLoading={isPending}
        />
      </div>
    </div>
  );
};

export default Customers;
