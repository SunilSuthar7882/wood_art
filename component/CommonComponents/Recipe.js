"use client";
import DeleteConfirmationModal from "@/component/DeleteConfirmationModal";
import { Routes } from "@/config/routes";
import {
  useFetchFoodCategories,
  useGetFoodAllList,
  useGetRecipeAndFoodAllList,
  useManageFavoriteFood,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import { getLocalStorageItem } from "@/helpers/localStorage";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Image from "next/image";
import { useState, useEffect } from "react";

import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Slider,
  Tooltip,
  Typography,
} from "@mui/material";
import { pdf } from "@react-pdf/renderer";
import addIcon from "@/public/images/add-icon.png";
import { useDeleteFoodItem } from "@/helpers/hooks/mamAdmin/mamAdmin";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import CommonLoader from "../CommonLoader";
import TableEditActionIcon from "./TableEditActionIcon";
import TableDeleteActionButton from "./TableDeleteActionButton";
import RecipePDF from "@/constants/RecipePDF";
import pdfDownloadIcon from "../../public/images/pdfDownloadIcon.png";
import InfiniteScroll from "react-infinite-scroll-component";
import CustomTextField from "./CustomTextField";
import { getSystemRoleLabel } from "../roles";
import { useGettrainerFood } from "@/helpers/hooks/trainerFood/getFood";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

export default function Recipe() {
  const role = getLocalStorageItem("role");
  const router = useRouter();
  const [foods, setFoods] = useState([]);

  // console.log("foods", foods);
  const [hasMore, setHasMore] = useState(true);
  const [categoryID, setCategoryID] = useState(null);
  const [categoryIDs, setCategoryIDs] = useState([]);
  const [sortValue, setSortValue] = useState("name");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [page, setPage] = useState(0);
  const [type, setType] = useState("recipe");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(null);
  const isTrainer = role === "trainer";
  const isAdmin = role === "admin";
  const {
    mutate: manageFavFood,
    isPending: isManageFavFood,
    error: ManageFavFoodError,
  } = useManageFavoriteFood();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useFetchFoodCategories(type);

  const [modalState, setModalState] = useState({
    open: false,
    isTemplateCreation: false,
    templateData: null,
  });

  const get_own = "true";
  const trainerQuery = useGettrainerFood(
    page,
    rowsPerPage,
    searchValue,
    type,
    get_own,
    categoryID,
    // categoryIDs,
    sortValue
  );
  const adminQuery = useGetRecipeAndFoodAllList(
    page,
    rowsPerPage,
    searchValue,
    type,
    categoryID,
    // categoryIDs,
    sortValue
  );

  const { data, isFetching, refetch } = isTrainer ? adminQuery : adminQuery;

  const [rangeFilter, setRangeFilter] = useState(false);
  const sliderConfigs = {
    carbs: { min: 0, max: 5000, step: 100 },
    protein: { min: 0, max: 5000, step: 100 },
    fats: { min: 0, max: 5000, step: 100 },
    fluid: { min: 0, max: 5000, step: 100 },
    calories: { min: 0, max: 5000, step: 100 },
  };

  // Each nutrient starts with a [min, max] range
  const [values, setValues] = useState({
    carbs: [500, 2500],
    protein: [300, 1200],
    fats: [200, 1000],
    fluid: [800, 4000],
    calories: [1000, 3000],
  });

  const handleChange = (key) => (_, newValue) => {
    setValues((prev) => ({ ...prev, [key]: newValue }));
  };

  // const { data, isFetching, refetch } = isTrainer ? trainerQuery : adminQuery;
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setPage(0);
    setFoods([]);
    setHasMore(true);
    refetch();
  }, [searchValue, activeStatus, categoryID, refetch]);

  useEffect(() => {
    if (data?.data?.page_data) {
      if (page === 0) {
        setFoods(data.data.page_data.map(mapFoodRowData));
      } else {
        setFoods((prev) => [
          ...prev,
          ...data.data.page_data.map(mapFoodRowData),
        ]);
      }

      const totalData = data.data.page_information?.total_data || 0;
      const loadedData = (page + 1) * rowsPerPage;
      setHasMore(loadedData < totalData);
    }
  }, [data, page, rowsPerPage]);

  const templatePlans = data?.data?.page_data || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 500);

    return () => clearTimeout(timer);
  }, [page, rowsPerPage, activeStatus, searchValue, type, refetch]);

  const pageInfo = data?.data?.page_information || {};

  const { mutate: deleteFoodItem, isPending: isDeleteFoodPending } =
    useDeleteFoodItem();

  const handleDelete = () => {
    deleteFoodItem(foodToDelete.id, {
      onSuccess: () => {
        refetch();
        setIsDeleteModalOpen(false);
        setFoodToDelete(null);
      },
      onError: () => {
        setIsDeleteModalOpen(false);
        setFoodToDelete(null);
      },
    });
  };

  const handlePDFDownload = async (item) => {
    const recipeId = item.id;
    setIsLoading(true);

    try {
      const paramsQuery = new URLSearchParams({
        food_id: String(recipeId),
      });

      const response = await HttpClient.get(
        `${API_ENDPOINTS.GET_FOOD_DATA}?${paramsQuery.toString()}`
      );

      if (response?.data) {
        console.log(response?.data);
        const blob = await pdf(<RecipePDF data={response.data} />).toBlob();
        const blobUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = blobUrl;
        downloadLink.download = "Your_recipe_data.pdf";
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
      setIsLoading(false);
    }
  };

  const mapFoodRowData = (row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    is_draft: row.is_draft,
    is_favorite: row.is_favorite,
    created_at: row.created_at,
    image: row.image,
    is_created_by_you: row.is_created_by_you,
    no_of_servings: row.no_of_servings,
    categories:
      row.food_category_maps?.map((catMap) => catMap.food_category?.name) || [],
    created_by_name: row.user?.full_name || null,
    created_by_role: row.user?.role || null,
    user_image: row.user?.profile_image,
    servings:
      row.ingredients?.map((serving) => ({
        id: serving.id,
        itemsName: serving.ingredient.name,
        unit: serving.unit,
        integral: serving.integral,
        nominator: serving.nominator,
        denominator: serving.denominator,
        calories: serving.calories,
        carbs: serving.carbs,
        protein: serving.protein,
        fat: serving.fat,
        fluid: serving.fluid,
        createdAt: serving.createdAt,
        updatedAt: serving.updatedAt,
      })) || [],
  });

  const handleToggleFavorite = (item) => {
    manageFavFood(item.id, {
      onSuccess: () => {
        setFoods((prev) =>
          prev.map((food) =>
            food.id === item.id
              ? { ...food, is_favorite: food.is_favorite === 1 ? 0 : 1 }
              : food
          )
        );
      },
    });
  };

  useEffect(() => {
    if (data?.data?.page_data) {
      setFoods((prev) => {
        const merged = [...prev, ...data.data.page_data.map(mapFoodRowData)];
        const unique = merged.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        );
        return unique;
      });
    }
  }, [data, page, rowsPerPage]);

  const fetchNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const getTotalNutrition = (servings = []) => {
    return servings.reduce(
      (totals, s) => ({
        calories: totals.calories + (s.calories || 0),
        carbs: totals.carbs + (s.carbs || 0),
        protein: totals.protein + (s.protein || 0),
        fat: totals.fat + (s.fat || 0),
        fluid: totals.fluid + (s.fluid || 0),
      }),
      { calories: 0, carbs: 0, protein: 0, fat: 0, fluid: 0 }
    );
  };

  // if (isManageFavFood) return <CommonLoader />;
  return (
    <>
      <div className="flex-1 flex flex-col  w-full overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Recipe</h1>
          <div>
            {isClient && role ? (
              (role === "admin" || role === "trainer") && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    {role && (role === "admin" || role === "trainer") && (
                      <button
                        type="button"
                        onClick={() => router.push(Routes.createRecipe)}
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
                        Add Recipe
                      </button>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div style={{ height: 40 }} />
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 flex-1 flex flex-col overflow-auto shadow-sm">
          <div className="flex flex-row w-full justify-between">
            <div className="relative">
              <CustomTextField
                type="text"
                placeholder="Search by recipe name..."
                className="bg-gray-50 w-full border rounded-lg py-3 px-4 pr-10"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />

              {isFetching && searchValue && page === 0 && (
                <div className="mt-2 flex items-center gap-2 text-gray-500 text-sm">
                  Searching...
                </div>
              )}
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

              {/* <div className="font-semibold">
                Categories:
                <Select
                  multiple
                  displayEmpty
                  sx={{
                    minWidth: 200,
                    maxWidth: 200,
                    height: "35px",
                    backgroundColor: "white",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "8px",
                    },
                  }}
                  value={categoryIDs} // should be an array state
                  onChange={(e) => {
                    const { value } = e.target;
                    setCategoryIDs(
                      typeof value === "string" ? value.split(",") : value
                    );
                  }}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return "All";
                    }
                    const selectedNames = categories
                      .filter((cat) => selected.includes(cat.id))
                      .map((cat) => cat.name);
                    return selectedNames.join(", ");
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      <Checkbox checked={categoryIDs.indexOf(cat.id) > -1} />
                      <ListItemText primary={cat.name} />
                    </MenuItem>
                  ))}
                </Select>
              </div> */}

              <Button
                variant="contained"
                className="bg-gray-50  border rounded-lg h-9 px-5 mb-5 "
                onClick={() => setRangeFilter(!rangeFilter)}
              >
                {rangeFilter ? <FilterAltOffIcon /> : <FilterAltIcon />}
              </Button>
            </div>
          </div>
          <AnimatePresence initial={false}>
            {rangeFilter && (
              <motion.div
                key="rangeFilter"
                layout
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ originY: 0 }}
                className="border rounded-md p-4 overflow-hidden"
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 3,
                    flexWrap: "wrap",
                  }}
                >
                  {Object.entries(values).map(([key, range]) => {
                    const { min, max, step } = sliderConfigs[key];
                    return (
                      <Box
                        key={key}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "18%",
                          minWidth: 120,
                        }}
                      >
                        {/* Title + Current Range */}
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1,
                            textTransform: "capitalize",
                            fontWeight: 500,
                          }}
                        >
                          {key}: {range[0]} – {range[1]}
                        </Typography>

                        {/* Min/Max labels */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {min}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {max}
                          </Typography>
                        </Box>

                        {/* Range Slider */}
                        <Slider
                          value={range}
                          onChange={handleChange(key)}
                          min={min}
                          max={max}
                          step={step}
                          valueLabelDisplay="auto"
                        />
                      </Box>
                    );
                  })}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            layout
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-1 flex-col overflow-auto w-full mt-2"
            id="scrollableDiv"
          >
            <InfiniteScroll
              dataLength={foods.length}
              next={fetchNextPage}
              hasMore={hasMore}
              loader={
                page > 0 && isFetching ? (
                  <p className="text-center text-gray-500 py-4">Loading...</p>
                ) : null
              }
              endMessage={
                <p className="text-center text-gray-400 py-4 italic">
                  🎉 You’ve reached the end — no more recipes!
                </p>
              }
              scrollableTarget="scrollableDiv"
            >
              <div className="grid grid-cols-1 gap-4 w-full">
                {foods.map((food) => {
                  const totals = getTotalNutrition(food.servings);

                  return (
                    <div
                      key={food.id}
                      onClick={() => {
                        if (food.is_created_by_you === 1) {
                          Cookies.set("edit-recipe-id", food.id);
                        }

                        router.push(`${Routes.editRecipe}${food.id}`);
                      }}
                      className="flex flex-col lg:flex-row gap-4 bg-white border border-gray-200 hover:shadow-md rounded-xl p-4 cursor-pointer"
                    >
                      {/* 🖼️ Food Image */}
                      <div className="flex-shrink-0">
                        {food.image ? (
                          <img
                            src={food.image}
                            alt={food.name}
                            className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-lg bg-gray-100 border flex items-center justify-center text-[12px] text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* 🧾 Food Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-gray-800 truncate">
                              {food.name}
                            </h3>
                            {food.is_draft && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 border border-yellow-300 px-2 py-0.5 rounded-full">
                                Draft
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2 text-xs bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-gray-800 font-medium">
                            <span>
                              🔥 Total Calories: {totals.calories.toFixed(2)}{" "}
                              kcal
                            </span>
                            <span>🍞 Carbs: {totals.carbs.toFixed(2)} g</span>
                            <span>
                              🥩 Protein: {totals.protein.toFixed(2)} g
                            </span>
                            <span>🧈 Fat: {totals.fat.toFixed(2)} g</span>
                            <span>💧 Fluid: {totals.fluid.toFixed(2)} ml</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            Servings:{" "}
                            <span className="font-medium">
                              {food.no_of_servings || "0"}
                            </span>
                          </p>

                          {/* 🏷️ Categories */}
                          {food.categories.length > 0 ? (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {food.categories
                                .slice()
                                .sort((a, b) => a.localeCompare(b))
                                .map((cat) => (
                                  <span
                                    key={cat}
                                    className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full"
                                  >
                                    {cat}
                                  </span>
                                ))}
                              {/* {food.categories.map((cat) => (
                                <span
                                  key={cat}
                                  className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full"
                                >
                                  {cat}
                                </span>
                              ))} */}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 italic mb-2">
                              No categories
                            </p>
                          )}

                          {/* 📊 Total Nutrition Summary */}
                          {/* <div className="flex flex-wrap gap-2 text-xs bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-gray-800 font-medium">
                            <span>
                              🔥 Total Calories: {totals.calories.toFixed(2)}{" "}
                              kcal
                            </span>
                            <span>🍞 Carbs: {totals.carbs.toFixed(2)} g</span>
                            <span>
                              🥩 Protein: {totals.protein.toFixed(2)} g
                            </span>
                            <span>🧈 Fat: {totals.fat.toFixed(2)} g</span>
                            <span>💧 Fluid: {totals.fluid.toFixed(2)} ml</span>
                          </div> */}

                          {/* 🍽️ Serving List */}
                          {/* {food.servings.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {food.servings.map((serving) => (
                                <div
                                  key={serving.id}
                                  className="border border-gray-200 bg-gray-50 rounded-lg px-2 py-1 text-xs text-gray-700"
                                >
                                  <span className="font-semibold text-green-700">
                                    {serving.itemsName}
                                  </span>{" "}
                                  {serving.integral > 0 && serving.integral}
                                  {serving.nominator
                                    ? ` ${serving.nominator}/${serving.denominator}`
                                    : ""}{" "}
                                  {serving.unit}
                                  <div className="text-gray-500 mt-0.5">
                                    <span>🔥 {serving.calories} kcal</span>
                                    {" | "}
                                    <span>🍞 {serving.carbs} g</span>
                                    {" | "}
                                    <span>🥩 {serving.protein} g</span>
                                    {" | "}
                                    <span>🧈 {serving.fat} g</span>
                                    {" | "}
                                    <span>💧 {serving.fluid} ml</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )} */}
                        </div>

                        {/* 👤 Footer (Created By + Actions) */}
                        <div className="flex justify-between items-center">
                          {(role === "trainer" || role === "admin") && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span className="font-medium">Created by:</span>
                              {food.is_created_by_you === 1 ? (
                                <span className="text-green-600 font-semibold">
                                  You
                                </span>
                              ) : (
                                <>
                                  {food.user_image ? (
                                    <img
                                      src={food.user_image}
                                      alt={food.created_by_name}
                                      className="w-5 h-5 rounded-full object-cover border"
                                    />
                                  ) : (
                                    <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-[10px] text-white">
                                      ?
                                    </div>
                                  )}
                                  <span title={food.created_by_name}>
                                    {food.created_by_name.length > 10
                                      ? `${food.created_by_name.substring(
                                          0,
                                          10
                                        )}...`
                                      : food.created_by_name}{" "}
                                    <span className="text-gray-400">
                                      (
                                      {getSystemRoleLabel(food.created_by_role)}
                                      )
                                    </span>
                                  </span>
                                </>
                              )}
                            </div>
                          )}

                          {/* 🎛️ Action Buttons */}
                          <div className="flex items-center gap-2">
                            {/* PDF Download */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePDFDownload(food);
                              }}
                              disabled={food.is_draft || isLoading === food.id}
                              className={`p-1 rounded hover:bg-gray-100 transition ${
                                food.is_draft
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              {isLoading === food.id ? (
                                <span className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <PictureAsPdfIcon className="w-5 h-5 text-gray-500" />
                              )}
                            </button>

                            {/* Favorite Toggle */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleToggleFavorite(food);
                              }}
                              className="p-1 hover:bg-gray-100 rounded transition"
                            >
                              {food.is_favorite === 1 ? (
                                <Heart className="w-5 h-5 fill-green-500 stroke-green-600" />
                              ) : (
                                <Heart className="w-5 h-5 text-gray-500" />
                              )}
                            </button>

                            {/* Edit/Delete */}
                            {(role === "admin" ||
                              (role === "trainer" &&
                                food.is_created_by_you === 1)) && (
                              <>
                                <TableEditActionIcon
                                  title="Edit Recipe"
                                  onClick={() => {
                                    Cookies.set("edit-recipe-id", food.id);
                                    router.push(
                                      `${Routes.editRecipe}${food.id}`
                                    );
                                  }}
                                />
                                <TableDeleteActionButton
                                  onClick={() => {
                                    setIsDeleteModalOpen(true);
                                    setFoodToDelete(food);
                                  }}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </InfiniteScroll>
          </motion.div>
        </div>

        <DeleteConfirmationModal
          loading={isDeleteFoodPending}
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Food"
          content={
            <>
              Are you sure you want to delete <b>{foodToDelete?.name}</b>? This
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
