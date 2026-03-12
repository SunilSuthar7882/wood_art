"use client";
import DeleteConfirmationModal from "@/component/DeleteConfirmationModal";
import { Routes } from "@/config/routes";
import { useGetTemplatePlans } from "@/helpers/hooks/mamAdmin/mealPlanList";
import { getLocalStorageItem } from "@/helpers/localStorage";
import Image from "next/image";
import { useState, useEffect } from "react";

import PDFDocument from "@/constants/PDFDocument";
import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { Button, CircularProgress, MenuItem, Paper, Select, Tooltip } from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import { Target } from "lucide-react";
import addIcon from "../../public/images/add-icon.png";
import generatePdfIcon from "../../public/images/generate-pdf-btn-with-bg.png";
import CustomTable from "./CommonTable";
import { useRouter } from "next/navigation";
import { useDeleteTempPlan } from "../../helpers/hooks/mamAdmin/mamAdmin";
import AddEditTempPlanModal from "../Dashboard/ManagePlan/AddEditTempPlanModal";
import TableEditActionIcon from "./TableEditActionIcon";
import TableDeleteActionButton from "./TableDeleteActionButton";
import CustomTextField from "./CustomTextField";
import { useGetMealCategories } from "@/helpers/hooks/mamAdmin/mealCategoriesList";

export default function TemplateMealPlan() {
  const role = getLocalStorageItem("role");
  const router = useRouter();
  const [categoryID, setCategoryID] = useState(null);
  const [sortValue, setSortValue] = useState("name");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(null);
  const [modalState, setModalState] = useState({
    open: false,
    isTemplateCreation: false,
    templateData: null,
  });
  // const role = getLocalStorageItem("role");

  const {
    data: categories = [],
    isLoading: isFetchingCategories,
    isError: isCategoryError,
    error: categoryError,
    refetch: refetchCategories,
  } = useGetMealCategories();



  const { data, isFetching, refetch } = useGetTemplatePlans(
    page,
    rowsPerPage,
    searchValue,
    categoryID,
    sortValue
  );
  const templatePlans = data?.data?.page_data || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 500);

    return () => clearTimeout(timer);
  }, [page, rowsPerPage, searchValue, refetch]);

    const pageInfo = data?.data?.page_information || {};
  const currentPage = (pageInfo.current_page ?? 1) - 1; // API 1-based → UI 0-based
  const totalRows = pageInfo.total_data ?? 0;

  const { mutate: deleteMealPlan, isPending: isDeleteTemplatePending } =
    useDeleteTempPlan();

  const handleDelete = () => {
    deleteMealPlan(planToDelete.id, {
      onSuccess: () => {
        refetch();
        setIsDeleteModalOpen(false);
        setPlanToDelete(null);
      },
      onError: () => {
        setIsDeleteModalOpen(false);
        setPlanToDelete(null);
      },
    });
  };

  const handlePDFDownload = async (params) => {
    const mealPlanId = params.row.id;
    setIsLoading(mealPlanId);

    try {
      const paramsQuery = new URLSearchParams({
        plan_id: String(mealPlanId),
      });

      const response = await HttpClient.get(
        `${API_ENDPOINTS.GET_MEAL_BY_CUSTOMER}?${paramsQuery.toString()}`
      );

      if (response?.data) {
        const blob = await pdf(<PDFDocument data={response.data} />).toBlob();
        const blobUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = blobUrl;
        downloadLink.download = "Your_requested_custom_meal_plan.pdf";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        window.open(blobUrl, "_blank");

        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 100);
      }
    } catch (err) {
      console.error("Error generating PDF", err);
    } finally {
      setIsLoading(null);
    }
  };

  const columns = [
   
    {
      field: "name",
      headerName: "Diet Plans",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex items-center gap-1 w-full overflow-hidden">
          {params?.row?.type === "custom" && (
            <Tooltip title="Custom Diet Plan" arrow>
              <Target className="h-4 w-4 text-green-500 flex-shrink-0" />
            </Tooltip>
          )}
          <Tooltip title={params.row.name} followCursor>
            <div className="truncate">{params.row.name}</div>
          </Tooltip>
        </div>
      ),
      sortable: true,
    },
   {
  field: "status",
  headerName: "Status",
  width: 120,
  renderCell: (params) => {

    const isDraft =
      params?.row?.is_draft === true || params?.row?.is_draft === "true";

    return (
      <div className="items-center gap-1 w-full overflow-hidden">
        <Tooltip
          title={isDraft ? "Draft Plan" : "Completed Plan"}
          arrow
        >
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1 border 
              ${
                isDraft
                  ? "bg-[#F7F7F7] text-yellow-800 border-[#cfccbc]"
                  : "bg-green-100 text-green-800 border-green-300"
              }`}
          >
            {isDraft ? "📝 Draft" : "✅ Complete"}
          </span>
        </Tooltip>
      </div>
    );
  },
},

    
    {
      field: "days",
      headerName: "Days",
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "calories",
      headerName: "Calories",
      width: 120,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "carbs",
      headerName: "Carbs (g)",
      width: 120,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "protein",
      headerName: "Protein (g)",
      width: 120,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "fat",
      headerName: "Fat (g)",
      width: 120,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "fluid",
      headerName: "Fluid (ml)",
      width: 120,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center justify-center h-full gap-2">
          {role === "customer" ? (
            <>
              <Button
                onClick={() => handlePDFDownload(params)}
                disabled={isLoading === params.row.id}
                sx={{ minWidth: "auto", padding: 0 }}
              >
                {isLoading === params.row.id ? (
                  <CircularProgress size={24} />
                ) : (
                  <Image
                    src={generatePdfIcon}
                    height={34}
                    width={34}
                    alt="Generate PDF"
                  />
                )}
              </Button>
            </>
          ) : (
            <>
              <TableEditActionIcon
                title="Edit Template Plan"
                onClick={(e) => {
                  e.stopPropagation(e);
                  router.push(`${Routes.editmealplantemplate}${params.row.id}`);
                }}
              />
              <TableDeleteActionButton
                title="Delete Template Plan"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteModalOpen(true);
                  setPlanToDelete(params.row);
                }}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  const formatWithFixed = (value) =>
    Number.isFinite(value) ? value.toFixed(2) : "-";

  const mapRowData = (row) => ({
    id: row.id,
    name: row.name,
    days: row.number_of_days,
    calories: formatWithFixed(row.total_calories),
    carbs: formatWithFixed(row.total_carbs),
    protein: formatWithFixed(row.total_protein),
    fat: formatWithFixed(row.total_fat),
    fluid: formatWithFixed(row.total_fluid),
    type: row.type,
    is_draft:row.is_draft,
  });

  const rows = data?.data?.page_data?.map(mapRowData) || [];

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setPage(0);
  };

  const handlePersonalizedClick = () => {
    router.push(Routes.subscriptionPlanPersonalized);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleRowClick = (row) => {
    router.push(`${Routes.editmealplantemplate}${row.id}`);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className="flex-1 flex flex-col w-full overflow-auto ">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Template Meal Plans</h1>

        <div className="flex items-center gap-3">
          {/* Show for all users */}
         
          {hasMounted && (role === "admin" || role === "trainer") && (
            <button
              onClick={() => router.push(Routes.createTemplatePlan)}
              className="btn btn-primary flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-90"
            >
              <span style={{ position: "relative", width: 15, height: 15, display: "inline-block" }}>
                  <Image
                    src={addIcon}
                    alt="Add"
                    fill
                    sizes="15px"
                    style={{ objectFit: "contain" }}
                  />
                </span>
              Create Diet Plan
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg h-full flex-1 flex flex-col overflow-auto p-5 shadow-sm">
         <div className="flex flex-row w-full justify-between mb-4">
              <div className="relative">
                <CustomTextField
                  type="text"
                  placeholder="Search by plan name..."
                  className="bg-gray-50 w-full appearance-none border rounded-lg py-3 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition-all"
                  value={searchValue}
                  autoComplete="off"
                  onChange={handleSearchChange}
                />
                
              </div>
              <div className="flex justify-end gap-3">
               <div className="font-semibold">
                  Sort:
                  <Select
                    sx={{
                      height: "35px",
                      width: "auto",
                      backgroundColor: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "8px",
                      },
                    }}
                    onChange={(e) => {
                      setSortValue(e.target.value);
                    }}
                    value={sortValue} 
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="calories">Calories</MenuItem>
                    <MenuItem value="carbs">Carbohydrates</MenuItem>
                    <MenuItem value="protein">Protein</MenuItem>
                    <MenuItem value="fat">Fat</MenuItem>
                    <MenuItem value="fluid">Fluid</MenuItem>
                   
                  </Select>
                </div>
                <div className="font-semibold">
                  Categories:
                  <Select
                    sx={{
                      height: "35px",
                      width: "auto",
                      backgroundColor: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "8px",
                      },
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setCategoryID(value === "all" ? null : value);
                    }}
                    value={categoryID || "all"}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
        <Paper
          sx={{
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
            flex: 1,
            overflow: "auto",
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
            onRowClick={(params) => handleRowClick(params.row)}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            containerSx={{ overflow: "auto" }}
          />
        </Paper>
      </div>

      <DeleteConfirmationModal
        loading={isDeleteTemplatePending}
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Diet Plan"
        content={
          <>
            Are you sure you want to delete <b>{planToDelete?.name}</b>? This
            action cannot be undone.
          </>
        }
        confirmButtonText="Yes, Delete"
        cancelButtonText="No, Keep"
      />

     
    </div>
  );
}
