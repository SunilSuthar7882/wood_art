"use client";
import AddEditDietPlanModal from "@/component/Dashboard/ManagePlan/AddEditDietPlanModal";
import DeleteConfirmationModal from "@/component/DeleteConfirmationModal";
import { Routes } from "@/config/routes";
import { useGetMealPlans } from "@/helpers/hooks/mamAdmin/mealPlanList";
import { getLocalStorageItem } from "@/helpers/localStorage";
import Image from "next/image";
import { useState, useEffect, use } from "react";

import PDFDocument from "@/constants/PDFDocument";
import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Tooltip,
} from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import { BookHeart, Target } from "lucide-react";
import addIcon from "../../public/images/add-icon.png";
import generatePdfIcon from "../../public/images/generate-pdf-btn-with-bg.png";
import pdfDownloadIcon from "../../public/images/pdfDownloadIcon.png";
import CustomTable from "./CommonTable";
import { useDeleteMealPlan } from "@/helpers/hooks/mamAdmin/mamAdmin";
import { useRouter } from "next/navigation";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CommonLoader from "../CommonLoader";
import { useGetProfile } from "@/helpers/hooks/profilesection/getprofile";
import TableEditActionIcon from "./TableEditActionIcon";
import TableDeleteActionButton from "./TableDeleteActionButton";
import CustomTextField from "./CustomTextField";
import { useGetMealCategories } from "@/helpers/hooks/mamAdmin/mealCategoriesList";
export default function DietPlans() {
  const role = getLocalStorageItem("role");
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [categoryID, setCategoryID] = useState(null);
  const [sortValue, setSortValue] = useState("name");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(null);
  const [modalState, setModalState] = useState({
    open: false,
    isTemplateCreation: false,
    templateData: null,
  });
  const {
    data: categories = [],
    isLoading: isFetchingCategories,
    isError: isCategoryError,
    error: categoryError,
    refetch: refetchCategories,
  } = useGetMealCategories();
  const {
    data: profileData,
    isFetching: isFetchingProfile,
    refetch: refetchingprofile,
  } = useGetProfile();
  const trainer_id = profileData?.data?.trainer_id;

  const {
    data,
    isFetching,
    refetch: refectDietPlans,
  } = useGetMealPlans(page, rowsPerPage, searchValue, categoryID, sortValue);

  const pageInfo = data?.data?.page_information || {};

  const currentPage = (pageInfo.current_page ?? 1) - 1; // API 1-based → UI 0-based
  const totalRows = pageInfo.total_data ?? 0;

  const { mutate: deleteMealPlan, isPending: isDeletePlanPending } =
    useDeleteMealPlan();

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

  const handleShoppingListClick = (id) => {
    router.push(`${Routes.shoppingList}/${id}`);
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
          {params?.row?.type === "self_service" && (
            <Tooltip title="Self Diet Plan" arrow>
              <BookHeart className="h-4 w-4 text-green-500 flex-shrink-0" />
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

      renderCell: (params) => (
        <div className="items-center gap-1 w-full overflow-hidden">
          <Tooltip
            title={params?.row?.is_draft ? "Draft Plan" : "Completed Plan"}
            arrow
          >
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1 border 
      ${
        params?.row?.is_draft
          ? "bg-[#F7F7F7] text-yellow-800 border-[#cfccbc]"
          : "bg-green-100 text-green-800 border-green-300"
      }`}
            >
              {params?.row?.is_draft ? "📝 Draft" : "✅ Complete"}
            </span>
          </Tooltip>
        </div>
      ),
    },
    ...(role === "customer"
      ? [
          {
            field: "created_by",
            headerName: "Created By",
            width: 150,
            align: "center",
            headerAlign: "center",
          },
        ]
      : []),
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
      align: "center",
      headerAlign: "center",
    },
    {
      field: "carbs",
      headerName: "Carbs (g)",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "protein",
      headerName: "Protein (g)",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fat",
      headerName: "Fat (g)",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "fluid",
      headerName: "Fluid (ml)",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      align: "left",
      headerAlign: "left",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center justify-start h-full gap-2">
          <>
            {role === "customer" ? (
              <>
                <Tooltip
                  title={
                    params.row.is_draft
                      ? "Plan is in draft. Please complete the plan to download PDF"
                      : "Download PDF"
                  }
                  arrow
                >
                  <span>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(e);
                        handlePDFDownload(params);
                      }}
                      disabled={
                        params.row.is_draft || isLoading === params.row.id
                      }
                      sx={{
                        minWidth: "auto",
                        padding: 0,
                        opacity: params.row.is_draft ? 0.5 : 1,
                        cursor: params.row.is_draft ? "not-allowed" : "pointer",
                      }}
                    >
                      {isLoading === params.row.id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Image
                          src={pdfDownloadIcon}
                          height={24}
                          width={24}
                          alt="Generate PDF"
                        />
                      )}
                    </Button>
                  </span>
                </Tooltip>

                {/* Show Edit/Delete only if type === "self_service" */}
                {params.row.type === "self_service" && (
                  <>
                    <TableEditActionIcon
                      title="Edit Diet Plan"
                      onClick={(e) => {
                        e.stopPropagation();
                        // set edit mode to false before navigating
                        // localStorage.setItem("isEditMode", "false");
                        router.push(`${Routes.editDietPlan}${params.row.id}`);
                      }}
                    />

                    <TableDeleteActionButton
                      title="Delete Diet Plan"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteModalOpen(true);
                        setPlanToDelete(params.row);
                      }}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <TableEditActionIcon
                  title="Edit Diet Plan"
                  onClick={(e) => {
                    e.stopPropagation();
                    // set edit mode to false before navigating
                    // localStorage.setItem("isEditMode", "false");
                    router.push(`${Routes.editDietPlan}${params.row.id}`);
                  }}
                />

                <TableDeleteActionButton
                  title="Delete Diet Plan"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteModalOpen(true);
                    setPlanToDelete(params.row);
                  }}
                />
              </>
            )}
          </>
          {role === "customer" && (
            <Tooltip
              title={
                params.row.is_draft
                  ? "Plan is in draft. Please complete the plan to view the shopping list."
                  : "View Shopping List"
              }
              arrow
            >
              <span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShoppingListClick(params.row.id);
                  }}
                  className="flex items-center justify-center"
                  disabled={params.row.is_draft}
                  style={{
                    cursor: params.row.is_draft ? "pointer" : "pointer",
                    opacity: params.row.is_draft ? 0.5 : 1,
                    border: "none",
                    background: "transparent",
                  }}
                >
                  <AddShoppingCartIcon
                    sx={{
                      color: "#6b7280",
                      "&:hover": {
                        color: "#15803d",
                      },
                    }}
                  />
                </button>
              </span>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  const formatWithFixed = (value) =>
    Number.isFinite(value) ? value.toFixed(2) : "-";

  const formatRaw = (value) => value ?? "-";

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
    is_draft: row.is_draft,
    created_by: row.plan_created_by?.full_name,
  });

  const rows = data?.data?.page_data?.map(mapRowData) || [];

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handlePersonalizedClick = () => {
    router.push(Routes.subscriptionPlanPersonalized);
  };

  const handleRowClick = (row) => {
    router.push(`${Routes.editDietPlan}${row.id}`);
  };
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (isDeletePlanPending) return <CommonLoader />;
  return (
    <>
      <div className="flex flex-col h-full w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Diet Plans</h1>

          <div className="flex items-center gap-3">
            {hasMounted && role === "customer" && (
              <button
                onClick={() => router.push(Routes.createDietPlan)}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Create Your Own Plan
              </button>
            )}

            {hasMounted && role === "admin" && (
              <button
                onClick={() => router.push(Routes.createDietPlan)}
                className="btn btn-primary flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all hover:opacity-90"
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
                </span>
                Create Diet Plan
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg flex-1 flex flex-col overflow-auto p-5  shadow-sm">
          <div className=" mb-4">
            <div className="flex flex-row w-full justify-between">
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
                      const value = e.target.value;
                      setSortValue(value);
                    }}
                    value={sortValue}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="calories">Calories</MenuItem>
                    <MenuItem value="carbs">Carbohydrates</MenuItem>
                    <MenuItem value="protein">Protein</MenuItem>
                    <MenuItem value="fat">Fat</MenuItem>
                    <MenuItem value="fluid">Fluid</MenuItem>
                    {/* <MenuItem value="Highest Nutrition Score">
                      Highest Nutrition Score
                    </MenuItem> */}
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
          </div>
          {/* <div className="flex flex-col overflow-auto"> */}
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
              rows={rows || []}
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
              getRowClassName={(params) =>
                params.row.type === "custom" ? "bg-gray-100" : ""
              }
              containerSx={{ overflow: "auto" }}
              noRowsOverlay={() => (
                <Box sx={{ p: 2, textAlign: "center", color: "red" }}>
                  🚫 No meal plans found!
                </Box>
              )}
              noDataMessage="No meal plans found for this category"
            />
          </Paper>
          {/* </div> */}
        </div>

        <DeleteConfirmationModal
          loading={isDeletePlanPending}
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
    </>
  );
}
