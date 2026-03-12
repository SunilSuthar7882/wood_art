import DeleteConfirmationModal from "@/component/DeleteConfirmationModal";
import { Routes } from "@/config/routes";
import { accountStatusBadgeFormatter } from "@/helpers/badgeFormatter";
import { useGetMamAdmins } from "@/helpers/hooks/mamAdmin/mamAdmin";
import ClearIcon from "@mui/icons-material/Clear";
import {
  MenuItem,
  Select,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
  Paper,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import addIcon from "../../../public/images/add-icon.png";
// import editIcon from "../../../public/images/edit-btn-with-bg.png";
// import deleteIcon from "../../../public/images/dlt-btn-with-bg.png";
import { useRouter } from "next/navigation";

import { useSnackbar } from "@/app/contexts/SnackbarContext";

import { useDeleteAdminBySuperAdmin } from "@/helpers/hooks/mamAdmin/mamAdmin";
import { Pencil, Trash2 } from "lucide-react";

// import { DataGrid } from "@mui/x-data-grid";
import CustomTable from "@/component/CommonComponents/CommonTable";
import CommonProfilePic from "@/component/CommonComponents/CommonProfilePic";
// import TableActionIcon from "@/component/CommonComponents/TableEditActionIcon";
import TableEditActionIcon from "@/component/CommonComponents/TableEditActionIcon";
import TableDeleteActionButton from "@/component/CommonComponents/TableDeleteActionButton";

// import CommonTable from "@/component/CommonComponents/CommonTable";
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default function MamAdmin() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [activeStatus, setActiveStatus] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchTerm = useDebounce(searchValue, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const { showSnackbar } = useSnackbar();

  const router = useRouter();

  const { data, isFetching, refetch } = useGetMamAdmins(
    page,
    rowsPerPage,
    activeStatus,
    // searchValue,
    debouncedSearchTerm
  );
    const pageInfo = data?.data?.page_information || {};
  const currentPage = (pageInfo.current_page ?? 1) - 1; // API 1-based → UI 0-based
  const totalRows = pageInfo.total_data ?? 0;

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, activeStatus, debouncedSearchTerm]);

  // const handleDelete = () => {
 
  //   setIsModalOpen(false);
  //   setAdminToDelete(null);
  //   refetch();
  // };

  const { mutate: deleteAdminBySuperAdmin, isPending: isDeleting } =
    useDeleteAdminBySuperAdmin();

  const handleDelete = () => {
    if (!adminToDelete) return;

    deleteAdminBySuperAdmin(adminToDelete.id, {
      onSuccess: (data) => {
        showSnackbar(data?.message, "success");
        setIsModalOpen(false);
        setAdminToDelete(null);
      },
      onError: (error) => {
        console.error("Error deleting admin:", error);
        showSnackbar(error?.response?.data?.message, "error");
        setIsModalOpen(false);
        setAdminToDelete(null);
      },
    });
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
      // renderCell: (params) => (
      //   <Link href={`${Routes.trainerList}/${params.row.id}`}>
      //     {params.row.fullName}
      //   </Link>
      // ),
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
      width: 200,
    },
    {
      field: "total_trainer",
      headerName: "Trainers",
      width: 150,
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
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      // renderCell: (params) => (
      //   <div className="flex items-center justify-center h-full gap-2">
      //     <Link
      //       href={`${Routes.editAdmin}/${params.row.id}`}
      //       onClick={(e) => e.stopPropagation()}

      //     >
      //       <Image src={editIcon} height={34} width={34} alt="edit-icon" />
      //     </Link>
      //     <button
      //       onClick={(e) => {
      //         e.stopPropagation();
      //         setIsModalOpen(true);
      //         setAdminToDelete(params.row);
      //       }}
      //     >
      //       <Image src={deleteIcon} height={34} width={34} alt="delete-icon" />
      //     </button>
      //   </div>
      // ),
      renderCell: (params) => (
        <div className="flex items-center justify-center h-full gap-4 group">
          {/* <Tooltip title="Edit" arrow>
            <Link
              href={`${Routes.editAdmin}/${params.row.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-gray-500 hover:text-green-600 transition-colors"
            >
              <Pencil className="w-5 h-5" />
            </Link>
          </Tooltip> */}
          <TableEditActionIcon
            title="Edit"
            href={`${Routes.editAdmin}/${params.row.id}`}
            className="text-gray-500 hover:text-green-600 transition-colors"
          />

          <TableDeleteActionButton
            onClick={(e) => {
              setIsModalOpen(true);
              setAdminToDelete(params.row);
            }}
            className="text-gray-500 hover:text-red-600 transition-colors"
          />
        </div>
      ),
    },
  ];
  const rows = data?.data?.page_data?.map((row) => ({
    id: row.id,
    profileImage: row.profile_image,
    fullName: row.full_name,
    email: row.email,
    phoneNumber: row.phone_number,
    total_trainer: row.total_trainer,
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

  const handleRowClick = (params) => {
    router.push(
      `${Routes.trainerList}/${params.row.id}?admin_name=${encodeURIComponent(
        params.row.fullName
      )}`
    );
  };

  return (
    <div className=" flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-4 h-10">
        <h1 className="text-2xl font-bold mb-0">MAM Admin</h1>

        <div className="flex items-center gap-3">
          <Link
            href={Routes.addAdmin}
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
              </span> Add Admin
          </Link>
          {/* <Link
            href={Routes.addCustomer}
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <Image src={addIcon} alt="add-icon" /> Add Customer
          </Link> */}
        </div>
      </div>

      {/* <div className="bg-white rounded-lg h-full flex-1 flex flex-col gap-1 p-4"> */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-lg transition-all duration-300 h-full flex-1 flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="w-1/4 my-2 relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent w-full appearance-none border rounded-lg py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-600"
              value={searchValue}
              autoComplete="off"
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
            />
            {searchValue && (
              <IconButton
                size="small"
                onClick={() => setSearchValue("")}
                className="!absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
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
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </div> */}
        </div>
        <Paper
          sx={{
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
            flex: 1,
            overflow: "hidden",
            // minHeight:"400px",
          }}
        >
          {/* <DataGrid
            rows={rows}
            columns={columns}
            loading={isFetching}
            onRowClick={handleRowClick}
            paginationMode="server"
            rowCount={pageInfo.total_data || 0}
            pageSizeOptions={[10, 100]}
            paginationModel={{
              page,
              pageSize,
            }}
            onPaginationModelChange={(newModel) => {
              const { page, pageSize } = newModel;
              setPage(page);
              setPageSize(pageSize);
            }}
            slotProps={{
              loadingOverlay: {
                variant: "skeleton",
                noRowsVariant: "skeleton",
              },
            }}
            disableRowSelectionOnClick
            sx={{
              // "& .MuiDataGrid-cell:focus": {
              //   outline: "none",
              // },
              // "& .MuiDataGrid-cell:focus-within": {
              //   outline: "none",
              // },
              // "& .MuiDataGrid-columnHeader:focus": {
              //   outline: "none",
              // },
              // "& .MuiDataGrid-columnHeader:focus-within": {
              //   outline: "none",
              // },
              // Apply pointer cursor on row hover
              "& .MuiDataGrid-row:hover": {
                cursor: "pointer",
              },
            }}
          /> */}
          <CustomTable
            rows={rows}
            columns={columns}
            loading={isFetching}
            onRowClick={handleRowClick}
           pagination={{
                page: currentPage, // 👈 synced with API
                rowsPerPage,
                totalRows,
              }}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Paper>
      </div>

      <DeleteConfirmationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Admin"
        content={`Are you sure you want to delete ${adminToDelete?.fullName} ?`}
        confirmButtonText={
          isDeleting ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              Deleting
              <CircularProgress size={12} sx={{ color: "white" }} />
            </Box>
          ) : (
            "Yes, Delete"
          )
        }
        cancelButtonText="No, Keep"
        confirmButtonDisabled={isDeleting}
      />
    </div>
  );
}
