"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Tooltip,
  Paper,
  MenuItem,
  Select,
  CircularProgress,
} from "@mui/material";
import { Target, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";

import addIcon from "@/public/images/add-icon.png";
import DeleteConfirmationModal from "@/component/DeleteConfirmationModal";
import CommonLoader from "../CommonLoader";
import TableEditActionIcon from "./TableEditActionIcon";
import TableDeleteActionButton from "./TableDeleteActionButton";
import { Routes } from "@/config/routes";
import { getLocalStorageItem } from "@/helpers/localStorage";
import {
  useFetchFoodCategories,
  useGetFoodAllList,
  useGetRecipeAndFoodAllList,
  useManageFavoriteFood,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import { useDeleteFoodItem } from "@/helpers/hooks/mamAdmin/mamAdmin";
import CustomTextField from "./CustomTextField";
import { getSystemRoleLabel } from "../roles";
import { useGettrainerFood } from "@/helpers/hooks/trainerFood/getFood";

export default function ManageFoods() {
  const role = getLocalStorageItem("role");
  const router = useRouter();
  const [categoryID, setCategoryID] = useState(null);
  // console.log("categoryID", categoryID);
  const [sortValue, setSortValue] = useState("name");
  // console.log("sortValue", sortValue);

  const [foods, setFoods] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);
  const [type, setType] = useState("food");

  const { data: categories = [], isLoading: isLoadingCategories } =
    useFetchFoodCategories(type);

  const isTrainer = role === "trainer";

  const adminQuery = useGetRecipeAndFoodAllList(
    page,
    rowsPerPage,
    searchValue,
    type,
    categoryID,
    sortValue
  );
  const { data, isFetching, refetch } = isTrainer ? adminQuery : adminQuery;
  // const { data, isFetching, refetch } = isTrainer ? trainerQuery : adminQuery;
  const { mutate: manageFavFood, isPending: isManageFavFood } =
    useManageFavoriteFood();
  const { mutate: deleteFoodItem, isPending: isDeleteFoodPending } =
    useDeleteFoodItem();

  // Fetch first page when search changes
  useEffect(() => {
    setPage(0);
    setFoods([]);
    setHasMore(true);
    refetch();
  }, [searchValue, activeStatus, categoryID, refetch]);

  // Append data when API responds
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

  const mapFoodRowData = (row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    is_favorite: row.is_favorite,
    is_draft: row.is_draft,
    is_created_by_you: row.is_created_by_you,
    created_by_name: row.user?.full_name || null,
    created_by_role: row.user?.role || null,
    user_id: row.user?.id || null,
    user_image: row.user?.profile_image,
    categories:
      row.food_category_maps?.map((catMap) => catMap.food_category?.name) || [],
    servings:
      row.food_servings?.map((serving) => ({
        id: serving.id,
        unit: serving.unit,
        integral: serving.integral,
        nominator: serving.nominator,
        denominator: serving.denominator,
        calories: serving.calories,
        carbs: serving.carbs,
        protein: serving.protein,
        fat: serving.fat,
        fluid: serving.fluid,
      })) || [],
  });

  const fetchNextPage = () => {
    setPage((prev) => prev + 1);
  };

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

  const handleDelete = () => {
    deleteFoodItem(foodToDelete.id, {
      onSuccess: () => {
        setFoods((prev) => prev.filter((f) => f.id !== foodToDelete.id));
        setIsDeleteModalOpen(false);
        setFoodToDelete(null);
      },
    });
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setPage(0); // Reset to first page when searching
  };

  // if (isFetching && page === 0) return <CommonLoader />;

  return (
    <div className="flex-1 flex flex-col w-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Foods</h1>
        <>
          {role && (role === "admin" || role === "trainer") && (
            <button
              onClick={() => router.push(Routes.createfood)}
              className="btn btn-primary flex items-center gap-2 px-4 py-2 rounded-lg"
            >
              <div style={{ position: "relative", width: 15, height: 15 }}>
                <Image
                  src={addIcon}
                  alt="Add"
                  fill
                  sizes="15px" // should be string, not number
                  style={{ objectFit: "contain" }}
                />
              </div>
              Add Food
            </button>
          )}
        </>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-5 flex-1 flex flex-col overflow-auto shadow-sm">
        <div className="flex flex-row w-full justify-between">
          <div className="relative">
            <CustomTextField
              type="text"
              placeholder="Search by food name..."
              className="bg-gray-50 w-full appearance-none border rounded-lg py-3 px-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition-all"
              value={searchValue}
              autoComplete="off"
              onChange={handleSearchChange}
            />

            {/* Search loader */}
            {isFetching && searchValue && page === 0 && (
              <div className="mt-2 flex items-center gap-2 text-gray-500 text-sm">
                {/* <CommonLoader size="small" /> */}
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
          </div>
        </div>
        {/* Card List with Infinite Scroll */}
        <div
          className="flex flex-1 flex-col overflow-auto w-full"
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
              <p className="text-center text-gray-500 py-4">No more foods</p>
            }
            scrollableTarget="scrollableDiv"
          >
            <div className="grid grid-cols-1 gap-4 w-full">
              {foods.map((food) => (
                <Paper
                  key={food.id}
                  onClick={() => router.push(`${Routes.editfood}${food.id}`)}
                  className="p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    {/* ✅ Left side: Food Info */}
                    <div className="flex flex-col flex-1">
                      {/* Food title + draft */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-base text-gray-800 truncate">
                          {food.name}
                        </span>
                        {food.is_draft && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                            Draft
                          </span>
                        )}
                      </div>

                      {/* Categories */}
                      {food.categories.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {food.categories.map((cat, i) => (
                            <span
                              key={i}
                              className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic mb-2">
                          No categories
                        </span>
                      )}

                      {/* Servings */}
                      <div className="flex flex-col gap-1">
                        {food.servings.map((serving) => (
                          <div
                            key={serving.id}
                            className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 flex flex-wrap gap-x-3 gap-y-1"
                          >
                            <div className="font-semibold text-green-700">
                              {serving.itemsName}{" "}
                              {serving.integral > 0 && serving.integral}
                              {serving.nominator
                                ? ` ${serving.nominator}/${serving.denominator}`
                                : ""}{" "}
                              {serving.unit}
                            </div>
                            <div className="text-gray-600">
                              | Cal: {serving.calories}g | Carb: {serving.carbs}
                              g | Prot: {serving.protein}g | Fat: {serving.fat}g
                              | Fluid: {serving.fluid}ml
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ✅ Right side: Creator + Actions */}
                    <div className="flex flex-col justify-between items-end gap-3 min-w-[160px]">
                      {(role === "trainer" || role === "admin") && (
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="font-medium">By:</span>
                          {food.is_created_by_you === 1 ? (
                            <span className="font-semibold text-green-600">
                              You
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              {food.user_image ? (
                                <Image
                                  src={food.user_image}
                                  alt={food.created_by_name}
                                  width={24}
                                  height={24}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] text-white">
                                  ?
                                </div>
                              )}
                              <span
                                className="truncate"
                                title={food.created_by_name}
                              >
                                {food.created_by_name?.length > 10
                                  ? `${food.created_by_name.substring(
                                      0,
                                      10
                                    )}...`
                                  : food.created_by_name}
                                <span className="text-xs text-gray-400">
                                  {" "}
                                  ({getSystemRoleLabel(food.created_by_role)})
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(food);
                          }}
                          className="text-green-500 hover:scale-110 transition-transform"
                        >
                          {food.is_favorite === 1 ? (
                            <Heart className="w-5 h-5 fill-green-500" />
                          ) : (
                            <Heart className="w-5 h-5" />
                          )}
                        </button>

                        {(role === "admin" ||
                          (role === "trainer" &&
                            food.is_created_by_you === 1)) && (
                          <>
                            <TableEditActionIcon
                              title="Edit Food"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`${Routes.editfood}${food.id}`);
                              }}
                            />
                            <TableDeleteActionButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsDeleteModalOpen(true);
                                setFoodToDelete(food);
                              }}
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Paper>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>
      {/* Delete Confirmation */}
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
  );
}
