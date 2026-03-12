import DeleteConfirmationModal from "@/component/DeleteConfirmationModal";
import { Routes } from "@/config/routes";
import { accountStatusBadgeFormatter } from "@/helpers/badgeFormatter";
import { useGetMamAdmins } from "@/helpers/hooks/mamAdmin/mamAdmin";
import { MenuItem, Select } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddDietPlanModal from "@/component/Dashboard/ManagePlan/AddEditDietPlanModal";

import addIcon from "../../../public/images/add-icon.png";
import deleteIcon from "../../../public/images/dlt-btn-with-bg.png";
import editIcon from "../../../public/images/edit-btn-with-bg.png";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function ManagePlan() {
  const [searchValue, setSearchValue] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const page = 1;
  const limit = 10;

  const router = useRouter();

  const { data, isFetching, refetch } = useGetMamAdmins(
    page,
    limit,
    activeStatus,
    searchValue
  );

  useEffect(() => {
    refetch();
  }, [page, activeStatus, searchValue]);

  const handleDelete = () => {
    
    setIsModalOpen(false);
    setAdminToDelete(null);
    refetch();
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      width: 90,
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    {
      field: "fullName",
      headerName: "Name",
      sortable: true,
      width: 320,
      renderCell: (params) => (
        <Link href={`${Routes.trainerList}/${params.row.id}`}>
          {params.row.fullName}
        </Link>
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
      renderCell: (params) => (
        <div className="flex items-center justify-center h-full gap-2">
          <Link href={`${Routes.editAdmin}/${params.row.id}`}>
            <Image src={editIcon} height={34} width={34} alt="edit-icon" />
          </Link>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setAdminToDelete(params.row);
            }}
          >
            <Image src={deleteIcon} height={34} width={34} alt="delete-icon" />
          </button>
        </div>
      ),
    },
  ];
  const rows = data?.data?.page_data?.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phoneNumber: row.phone_number,
    status: row.status,
    action: row.action,
  }));

  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
     
    setIsOpen(false); // close modal after submit
  };

  const handleRowClick = (params) => {
    router.push(`${Routes.trainerList}/${params.row.id}`);
  };

  return (
    <div className=" flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-4 h-10">
        <h1 className="text-2xl font-bold mb-0">My Meal Plan</h1>

        <div className="flex items-center gap-3">
          <button
            className="btn btn-primary flex items-center justify-center gap-2"
            onClick={() => setIsPlanModalOpen(true)}
          >
            <span style={{ position: "relative", width: 15, height: 15, display: "inline-block" }}>
                <Image
                  src={addIcon}
                  alt="Add"
                  fill
                  sizes="15px"
                  style={{ objectFit: "contain" }}
                />
              </span> Add Meal Plan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg h-full flex-1 flex flex-col gap-1 p-4">
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
          <div>
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
          </div>
        </div>
        <div className=" flex-1 overflow-auto">
          <DataGrid
            rows={rows}
            columns={columns}
            loading={isFetching}
            onRowClick={handleRowClick}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            slotProps={{
              loadingOverlay: {
                variant: "skeleton",
                noRowsVariant: "skeleton",
              },
            }}
            pageSizeOptions={[10, 100]}
            disableRowSelectionOnClick
            sx={{
              // Apply pointer cursor on row hover
              "& .MuiDataGrid-row:hover": {
                cursor: "pointer",
              },
            }}
          />
        </div>
      </div>

      <DeleteConfirmationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Admin"
        content={`Are you sure you want to delete ${adminToDelete?.fullName} ?`}
        confirmButtonText="Yes, Delete"
        cancelButtonText="No, Keep"
      />

      {/* <AddDietPlanModal
        isOpen={isPlanModalOpen}
        setIsOpen={setIsPlanModalOpen}
      /> */}
    </div>
  );
}
