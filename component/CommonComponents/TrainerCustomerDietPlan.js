"use client";
import AddEditDietPlanModal from "@/component/Dashboard/ManagePlan/AddEditDietPlanModal";
import DeleteConfirmationModal from "@/component/DeleteConfirmationModal";
import { Routes } from "@/config/routes";
import { useGetMealPlans } from "@/helpers/hooks/mamAdmin/mealPlanList";
import { getLocalStorageItem } from "@/helpers/localStorage";
import Image from "next/image";
import { useState, useEffect } from "react";

import PDFDocument from "@/constants/PDFDocument";
import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import {
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Tooltip,
} from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import { BookHeart, Mail, Phone, Target, User } from "lucide-react";
import addIcon from "../../public/images/add-icon.png";
import backIcon from "../../public/images/back-arrow.png";
import generatePdfIcon from "../../public/images/generate-pdf-btn-with-bg.png";
import CustomTable from "./CommonTable";
import { useDeleteMealPlan } from "@/helpers/hooks/mamAdmin/mamAdmin";
import { useParams, useRouter } from "next/navigation";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CommonLoader from "../CommonLoader";
import TableEditActionIcon from "./TableEditActionIcon";
import TableDeleteActionButton from "./TableDeleteActionButton";
import pdfDownloadIcon from "../../public/images/pdfDownloadIcon.png";
import { useGetusercustomerbysuperadmin } from "@/helpers/hooks/customer/getusercustomerbysuperadmin";
import dayjs from "dayjs";
import avatarimage from "@/public/avatarimage.jpeg";
import CustomTextField from "./CustomTextField";
import { useGetMealCategories } from "@/helpers/hooks/mamAdmin/mealCategoriesList";

export default function TrainerCustomerDietPlan() {
  const role = getLocalStorageItem("role");
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const [categoryID, setCategoryID] = useState(null);
  const [sortValue, setSortValue] = useState("name");

  const [activeStatus, setActiveStatus] = useState(null);
  const [page, setPage] = useState(0);
  // const [pageSize, setPageSize] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(null);

  const {
    data: categories = [],
    isLoading: isFetchingCategories,
    isError: isCategoryError,
    error: categoryError,
    refetch: refetchCategories,
  } = useGetMealCategories();
  const params = useParams();
  const customerID = params?.customerId;
  const {
    data: usercustomerdata,
    isFetching: isFetchingUserCustomerData,
    refetch: refetchusercustomerdata,
  } = useGetusercustomerbysuperadmin(customerID);
  const usersData = usercustomerdata?.data;
  console.log("usersData", usersData);
  const { data, isFetching, refetch } = useGetMealPlans(
    page,
    rowsPerPage,
    searchValue,
    categoryID,
    sortValue,
    customerID,
  );

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 500);

    return () => clearTimeout(timer);
    // }, [page, pageSize, activeStatus, searchValue, refetch]);
  }, [searchValue]);

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
      field: "srNo",
      headerName: "Sr No",
      width: 80,
      sortable: false,
      valueGetter: (_value, row, _column, apiRef) => {
        const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(
          row.id
        );
        return page * rowsPerPage + rowIndex + 1;
      },
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
      width: 250,
      align: "center",
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center justify-center h-full gap-2">
          <>
            {/* Customer-specific buttons */}
            {role === "customer" ? (
              <>
                {/* Always show PDF button for customer */}
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
                      href={`${Routes.editDietPlan}${params.row.id}`}
                      className="flex items-center justify-center"
                    />
                    <TableDeleteActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteModalOpen(true);
                        setPlanToDelete(params.row);
                      }}
                      className="flex items-center justify-center"
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <TableEditActionIcon
                  title="Edit Diet Plan"
                  onClick={() => {
                    // e.stopPropagation();
                    router.push(
                      `${Routes.customerPlanByTrainer}${customerID}${Routes.plan}${params.row.id}`
                    );
                  }}
                />

                <TableDeleteActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteModalOpen(true);
                    setPlanToDelete(params.row);
                  }}
                  className="flex items-center justify-center"
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
                  <AddShoppingCartIcon sx={{ color: "#6b7280" }} />
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
  });

  const rows = data?.data?.page_data?.map(mapRowData) || [];

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setPage(0); // Reset to first page when searching
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
    router.push(
      `${Routes.customerPlanByTrainer}${customerID}${Routes.plan}${row.id}`
    );
  };

  const age = usersData?.birth_date
    ? dayjs().diff(dayjs(usersData?.birth_date), "year")
    : "N/A";

  if (isDeletePlanPending) return <CommonLoader />;
  return (
    <div className="flex flex-col h-full w-full">
      {/* <div className="flex items-center bg-[#f0fff4] px-4 py-3 rounded-lg shadow-md border gap-4 mb-2">
        <div className="relative w-20 h-20 shrink-0">
          <span className="absolute top-0 left-0 bg-green-600 text-white text-[11px] px-2 py-0.5 rounded-tr-md rounded-bl-md shadow">
            Active
          </span>
          <Image
            src="/customer.jpg"
            alt="Customer"
            fill
            className="rounded-full object-cover border-2 border-green-500"
          />
        </div>

        <div className="flex flex-col justify-center text-sm leading-relaxed w-full overflow-hidden">
          <span className="flex items-center gap-2 text-gray-800 font-semibold">
            <User size={14} className="text-green-600" />
            John Doe
          </span>
          <span className="flex items-center gap-2 text-gray-600">
            <Mail size={14} className="text-blue-600" />
            john@example.com
          </span>
          <span className="flex items-center gap-2 text-gray-600">
            <Phone size={14} className="text-purple-600" />
            +91 9876543210
          </span>
        </div>
      </div> */}

      {/* <div className="flex items-start bg-[#f0fff4] px-4 py-3 rounded-lg shadow-md border gap-4 mb-3">
        <div className="relative w-[66px] h-[66px] shrink-0">
          {usersData?.profile_image ? (
            <Image
              src={usersData.profile_image}
              alt="Customer"
              fill
              className="rounded-full object-cover border-2 border-green-500"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 border-2 border-green-500 flex items-center justify-center text-gray-500">
              No Img
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row text-sm leading-relaxed w-full overflow-hidden gap-6">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-2 text-gray-800 font-semibold">
              <User size={14} className="text-green-600" />
              {usersData?.full_name}
            </span>

            <span className="flex items-center gap-2 text-gray-600">
              <Mail size={14} className="text-blue-600" />
              {usersData?.email}
            </span>

            <span className="flex items-center gap-2 text-gray-600">
              <Phone size={14} className="text-purple-600" />
              {usersData?.phone_number}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-gray-700 flex-1">
            <span>
              <strong>Gender:</strong> {usersData?.gender}
            </span>
            <span>
              <strong>Age:</strong> {age}
            </span>
            <span>
              <strong>Height:</strong> {usersData?.height}{" "}
              {usersData?.height_unit}
            </span>
            <span>
              <strong>Weight:</strong> {usersData?.weight}{" "}
              {usersData?.weight_unit}
            </span>
            <span>
              <strong>Activity:</strong> {usersData?.average_activity_level}
            </span>
            <span>
              <strong>Meals/Day:</strong> {usersData?.meals_eaten_per_day}
            </span>
            <span>
              <strong>Goal:</strong> {usersData?.fitness_goals}
            </span>
            <span className="col-span-2 md:col-span-4">
              <strong>Preferences:</strong>{" "}
              {usersData?.meal_plan_preferences
                ?.map((p) => p.preferences)
                .join(", ")}
            </span>
          </div>
        </div>
      </div> */}

      <div className="flex items-start bg-[#f0fff4] px-4 py-3 rounded-lg shadow-md border gap-4 mb-3">
        {/* Profile */}
        <div className="relative w-[66px] h-[66px] shrink-0">
          {isFetchingUserCustomerData ? (
            <div className="w-full h-full rounded-full bg-gray-300 border-2 border-green-500 animate-pulse" />
          ) : usersData?.profile_image ? (
            <Image
              src={usersData.profile_image}
              alt="Customer"
              fill
              sizes="66px"
              className="rounded-full object-cover border-2 border-green-500"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 border-2 border-green-500 flex items-center justify-center text-gray-500">
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
            {isFetchingUserCustomerData ? (
              <>
                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-40 bg-gray-300 rounded animate-pulse"></div>
              </>
            ) : (
              <>
                <span className="flex items-center gap-2 text-gray-800 font-semibold">
                  <User size={14} className="text-green-600" />
                  {usersData?.full_name}
                </span>

                <span className="flex items-center gap-2 text-gray-600">
                  <Mail size={14} className="text-blue-600" />
                  {usersData?.email}
                </span>

                <span className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} className="text-purple-600" />
                  {usersData?.phone_number}
                </span>
              </>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-gray-700 flex-1">
              {isFetchingUserCustomerData ? (
                <>
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-28 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-full col-span-2 md:col-span-4 bg-gray-300 rounded animate-pulse"></div>
                </>
              ) : (
                <>
                  <span>
                    <strong>Gender:</strong> {usersData?.gender}
                  </span>
                  <span>
                    <strong>Age:</strong> {age}
                  </span>
                  <span>
                    <strong>Height:</strong> {usersData?.height}{" "}
                    {usersData?.height_unit}
                  </span>
                  <span>
                    <strong>Weight:</strong> {usersData?.weight}{" "}
                    {usersData?.weight_unit}
                  </span>
                  <span>
                    <strong>Activity:</strong>{" "}
                    {usersData?.average_activity_level}
                  </span>
                  <span>
                    <strong>Meals/Day:</strong> {usersData?.meals_eaten_per_day}
                  </span>
                  <span>
                    <strong>Goal:</strong>{" "}
                    {Array.isArray(usersData?.fitness_goals)
                      ? usersData.fitness_goals
                          .map((g) => g.fitness_goals)
                          .join(", ")
                      : usersData?.fitness_goals?.fitness_goals}
                  </span>
                  <span className="">
                    <strong>Preferences:</strong>{" "}
                    {usersData?.meal_plan_preferences
                      ?.map((p) => p.meal_plan_category.name)
                      .join(", ")}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 h-10">
        <div className="flex items-center justify-between gap-48">
          <h1 className="text-2xl font-bold">
            <button onClick={() => router.back()} className="flex items-center">
              <Image
                src={backIcon}
                height={22}
                width={22}
                className="me-4 ms-1"
                alt="back-icon"
              />
              Diet Plans
            </button>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Show for all users */}
          {/* {role === "customer" && (
            <>
              <button
                onClick={handlePersonalizedClick}
                className="px-4 py-2 rounded-lg border border-green-600 text-green-600 hover:bg-green-50 transition"
              >
                Get Personalized Plan
              </button>

              <button
                onClick={() =>
                  setModalState({ open: true, isTemplateCreation: false })
                }
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Create Your Own Plan
              </button>
            </>
          )} */}

          {/* Only show Add button for admin */}
          {/* <button
            onClick={() =>
              setModalState({ open: true, isTemplateCreation: false })
            }
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <Image src={addIcon} alt="Add" width={15} height={15} />
            Add Diet Plan
          </button> */}
          <button
            onClick={() =>
              router.push(
                `${Routes.customerPlanByTrainer}${customerID}${Routes.create}`
              )
            }
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
            Add Diet Plan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg flex-1 flex flex-col overflow-auto p-5  shadow-sm">
        <div className="mb-4">
          {/* <div className="w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by plan name..."
                className="bg-gray-50 w-full appearance-none border rounded-lg py-3 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition-all"
                value={searchValue}
                autoComplete="off"
                onChange={handleSearchChange}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div> */}

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
              {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                          </div> */}
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
                  value={sortValue} // "name" will be default
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
              page: currentPage,
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
          />
        </Paper>
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

      {/* <AddEditDietPlanModal
        isOpen={modalState.open}
        setIsOpen={(val) => setModalState((prev) => ({ ...prev, open: val }))}
        onSuccess={refetch}
        isTemplateCreation={modalState.isTemplateCreation}
        clonedTemplateData={modalState.templateData}
        customerId={customerID}
      /> */}
    </div>
  );
}
