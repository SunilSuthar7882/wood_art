import { useSnackbar } from "@/app/contexts/SnackbarContext";
import {
  useAddFood,
  useAddFoodInTemplate,
  useAddRecipeFood,
  useFetchFavFoodList,
  useFetchFoodList,
  useGetRecentMealList,
  useManageFavoriteFood,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import {
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  Button,
  DialogActions,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import CreateFood from "../../component/Dashboard/ManagePlan/CreateFood";
import { useDeleteFoodItem } from "@/helpers/hooks/mamAdmin/mamAdmin";
import DeleteIcon from "@mui/icons-material/Delete";
import { getLocalStorageItem } from "@/helpers/localStorage";
import CommonLoader from "@/component/CommonLoader";
import CreateFoodModalForm from "@/component/CommonComponents/CreateFoodModalForm";
import { useParams } from "next/navigation";
import Image from "next/image";
import recipeIcon from "../../public/images/recipeIcon.png";
import SearchIcon from "@mui/icons-material/Search";
import CustomTextField from "@/component/CommonComponents/CustomTextField";
import ClearIcon from "@mui/icons-material/Clear";

const AddFoodInRecipe = ({
  isRecipe,
  isOpen,
  setIsOpen,
  // mealPlanData,
  activeDay,
  mealSlotId,
  isTemplate,
  onComplete,
}) => {
  console.log("", isRecipe);
  const { showSnackbar } = useSnackbar();
  const { reset } = useForm({
    defaultValues: {
      plan_name: "",
      number_of_days: "",
      category_ids: [],
    },
  });
  const params = useParams();
  const recipeId = params?.id;
  console.log("recipeId", recipeId);
  console.log("isRecipe", isRecipe);
  // State for tab selection
  const [activeTab, setActiveTab] = useState(0);
  const [pageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [mergedFoodData, setMergedFoodData] = useState([]);
  const [showCreateFoodModal, setShowCreateFoodModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const { mutateAsync: deleteFood } = useDeleteFoodItem();
  const role = getLocalStorageItem("role");
  const [openCreateFood, setOpenCreateFood] = useState(false);
  // const {
  //   data: pastMealsData,
  //   fetchNextPage,
  //   hasNextPage,
  //   isFetchingNextPage,
  //   isLoading: isLoadingPastMeals,
  //   isError,
  // } = useGetRecentMealList({
  //   type: "food",
  //   enabled: activeTab === 2,
  //   limit: 10,
  // });
  const {
    data: pastMealsData,
    fetchNextPage: fetchNextPastMealsPage,
    hasNextPage: hasNextPastMealsPage,
    isFetchingNextPage: isFetchingNextPastMealsPage,
    isLoading: isLoadingPastMeals,
    isError: isErrorPastMeals,
  } = useGetRecentMealList({
    type: ["food"],
    enabled: activeTab === 2,
    limit: 10,
  });

  const [flattenedPastMeals, setFlattenedPastMeals] = useState([]);

  useEffect(() => {
    if (pastMealsData?.pages) {
      const allMeals = [];
      pastMealsData.pages.forEach((page) => {
        if (page?.meals && Array.isArray(page.meals)) {
          allMeals.push(...page.meals);
        }
      });
      setFlattenedPastMeals(allMeals);
    }
  }, [pastMealsData]);

  console.log("pastMealsData------------------->", pastMealsData);
  // Fetch all foods
  const fetchParams = {
    pageSize,
    searchValue,
    ...(isRecipe && { type: "food" }),
  };
  // const isthatRecipe = mergedFoodData?.some(item => item.type === "recipe");

  // now build params
  const fetchFavFoodParams = {
    ...(isRecipe && { type: "food" }),
  };
  const type = mergedFoodData?.type;
  console.log("type", type);
  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPending: isLoadingAllFoods,
    isError: isErrorAllFoods,
    error: errorAllFoods,
    refetch: refetchAllFoods,
  } = useFetchFoodList(fetchParams);
  // Fetch favorite foods
  const {
    data: favFoodsData,
    isPending: isLoadingFavFoods,
    isError: isErrorFavFoods,
    error: errorFavFoods,
    refetch: refetchFavFoods,
  } = useFetchFavFoodList(fetchFavFoodParams);

  useEffect(() => {
    if (isOpen) {
      refetchAllFoods();
      refetchFavFoods();
    }
  }, [isOpen]);

  const {
    mutate: manageFavFood,
    isPending: isManageFavFood,
    error: ManageFavFoodError,
  } = useManageFavoriteFood();

  const handleToggleFavorite = (item) => {
    const TabwiseIdPass = activeTab === 2 ? item?.food?.id : item.id;
    console.log(item);
    // manageFavFood(item.id, {
    manageFavFood(TabwiseIdPass, {
      onSuccess: () => {
        // Optimistically toggle in local list
        setMergedFoodData((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? { ...f, is_favorite: f.is_favorite === 1 ? 0 : 1 }
              : f
          )
        );
        refetchFavFoods?.();
      },
    });
  };

  // Update merged food data when data changes, maintaining original order
  useEffect(() => {
    if (data?.pages) {
      // Create an array to hold all food items with their original order
      const allFoods = [];
      const seenIds = new Set();

      // Process each page in order
      data.pages.forEach((page) => {
        if (page.foods && Array.isArray(page.foods)) {
          // Add only foods that haven't been seen before
          page.foods.forEach((food) => {
            if (food.id && !seenIds.has(food.id)) {
              seenIds.add(food.id);
              allFoods.push(food);
            }
          });
        }
      });

      // Update state with deduplicated data in original order
      setMergedFoodData(allFoods);
    }
  }, [data]);

  const { mutate: addFood, isPending: isAddFoodPending } = useAddFood();
  const { mutate: addRecipeFood, isPending: isAddRecipeFoodPending } =
    useAddRecipeFood();
  const { mutate: addTemplateFood, isPending: isTempAddFoodPending } =
    useAddFoodInTemplate();

  const handleAddFood = (item) => {
    let payload;

    if (isRecipe) {
      payload = {
        food_id: item.id,
        recipe_id: Number(recipeId),
      };
    } else {
      payload = {
        food_id: item.id,
        slot_id: mealSlotId,
      };
    }

    const mutation = isTemplate
      ? addTemplateFood
      : isRecipe
      ? addRecipeFood
      : addFood;

    // mutation(payload, {
    //   onSuccess: () => {
    //     if (onComplete) {
    //       onComplete();
    //     } else {
    //       setIsOpen(null);
    //       showSnackbar("Food added successfully!", "success");
    //     }
    //   },
    //   onError: (error) => {
    //     setIsOpen(null);
    //     const message =
    //       error?.response?.data?.message ||
    //       error?.message ||
    //       "An unexpected error occurred";
    //     showSnackbar(message, "error");
    //   },
    // });
   mutation(payload, {
    onSuccess: () => {
      setSearchValue(""); // ✅ move here
      showSnackbar("Food added successfully!", "success");

      if (onComplete) {
        onComplete();
      }else{
        setIsOpen(null); // ensure this doesn’t close modal

      }
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred";
      showSnackbar(message, "error");
    },
  });
  };

  const handleDelete = async () => {
    try {
      if (!selectedFoodId) return;
      await deleteFood(selectedFoodId);
      refetchFavFoods?.();
      refetchAllFoods?.();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete food:", error);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);

    if (
      newValue === 1 &&
      favFoodsData?.data?.length === 0 &&
      !isLoadingFavFoods
    ) {
      refetchFavFoods();
    }
  };

  // Handle close and reset form
  const handleClose = () => {
    setIsOpen(null);
    reset();
    setSearchValue("");
  };

  // console.log("mergedFoodData", mergedFoodData);
  if (
    isAddFoodPending ||
    isTempAddFoodPending ||
    isManageFavFood
    // isLoadingAllFoods ||
    // isLoadingFavFoods
  )
    return <CommonLoader />;
  return (
    <>
      <Dialog open={!!isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            // justifyContent: "space-between",
            gap: 2,
            padding: 0.5,
          }}
        >
          {/* Left side: Title */}
          <span style={{ fontSize: "1.125rem", fontWeight: 600 }}>
            Add Food to Recipe
          </span>

          {/* Close button */}
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            padding: 0,
            display: "flex",
            flexDirection: "column",
            height: "400px", // Set a fixed height for the dialog content
          }}
        >
          <div className="flex flex-col h-full">
            {/* Tabs for All Foods and Favorite Foods */}
            <div className="flex items-center justify-between  p-1 border-b border-gray-200">
              {/* <Tabs
                value={activeTab}
                onChange={handleTabChange}
                minHeight={"36px"}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    minHeight: "36px",
                    paddingBottom: "0.5rem",
                  },
                }}
              >
                <Tab label="All Foods" />

                <Tab
                  label="Favorite Foods"
                  icon={
                    <FavoriteIcon fontSize="small" sx={{ color: "#10b981" }} />
                  }
                  iconPosition="end"
                />
                <Tab label="Past Selections" />
              </Tabs> */}

              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  minHeight: "34px", // reduce Tabs container height
                  "& .MuiTabs-flexContainer": {
                    minHeight: "34px",
                  },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                    minHeight: "34px", // reduce Tab height
                    padding: "0 8px", // adjust padding
                    fontSize: "0.875rem",
                  },
                }}
              >
                <Tab label="All Foods" />

                <Tab
                  label="Favorite Foods"
                  icon={
                    <FavoriteIcon fontSize="small" sx={{ color: "#10b981" }} />
                  }
                  iconPosition="end"
                />

                <Tab label="Past Selections" />
              </Tabs>

              {role !== "customer" && (
                <Button
                  onClick={() => setOpenCreateFood(true)}
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#01933C",
                    fontSize: "0.75rem",
                    px: 1.5,
                    py: 0.5,
                    minHeight: "2rem",
                    whiteSpace: "nowrap", // 👉 prevent wrapping
                    lineHeight: 1.2,
                    "&:hover": {
                      backgroundColor: "#017d33",
                    },
                    ml: 2,
                  }}
                  className="h-8"
                >
                  + Create Food
                </Button>
              )}
            </div>

            {/* All Foods Tab Content */}
            {activeTab === 0 && (
              <div className="flex-1 overflow-hidden">
                {/* <CustomTextField
                  placeholder="Search Food"
                  sx={{ width: "100%", padding: 1 }}
                  value={searchValue}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                /> */}
                <CustomTextField
                  placeholder="Search Food"
                  sx={{ width: "100%", padding: 1 }}
                  value={searchValue}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: searchValue && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSearchValue(""); // clear input
                            handleSearch({ target: { value: "" } }); // reset search results
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {isErrorAllFoods ? (
                  <div className="p-4 text-center text-red-600">
                    <p>
                      Error loading foods:{" "}
                      {errorAllFoods?.message || "Please try again"}
                    </p>
                    <button
                      onClick={() => refetchAllFoods()}
                      className="mt-2 px-3 py-1 bg-gray-200 rounded-lg text-sm"
                    >
                      Retry
                    </button>
                  </div>
                ) : isLoadingAllFoods && mergedFoodData.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <CircularProgress size={24} />
                  </div>
                ) : mergedFoodData.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 h-full flex items-center justify-center">
                    No foods found
                  </div>
                ) : (
                  <div id="scrollableDiv" className="h-full overflow-y-auto">
                    <InfiniteScroll
                      dataLength={mergedFoodData.length}
                      next={fetchNextPage}
                      hasMore={!!hasNextPage}
                      loader={
                        <div className="flex justify-center py-2">
                          <CircularProgress size={20} />
                        </div>
                      }
                      endMessage={
                        <div className="text-center py-2">
                          <span className="text-xs text-gray-400">
                            No more items
                          </span>
                        </div>
                      }
                      scrollableTarget="scrollableDiv"
                    >
                      <ul className="divide-y">
                        {mergedFoodData.map((item, idx) => {
                          return (
                            <li
                              key={item.id ?? idx}
                              className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                              onClick={() => {
                                handleAddFood(item);
                                // setSearchValue("");
                              }}
                            >
                              <span className="flex items-center gap-1">
                                {item?.type === "recipe" && (
                                  <Tooltip title="Recipe" arrow>
                                    <Image
                                      src={recipeIcon}
                                      alt="Recipe Icon"
                                      width={16}
                                      height={16}
                                      style={{ flexShrink: 0 }}
                                    />
                                  </Tooltip>
                                )}
                                {item?.name}
                              </span>

                              <div className="flex items-center gap-1">
                                {item?.is_favorite === 1 ? (
                                  <FavoriteIcon
                                    sx={{ fontSize: "1.25rem" }}
                                    className="text-green-500 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleFavorite(item);
                                    }}
                                  />
                                ) : (
                                  <FavoriteBorderIcon
                                    sx={{ fontSize: "1.25rem" }}
                                    className="text-gray-400 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleFavorite(item);
                                    }}
                                  />
                                )}
                                {role === "admin" && (
                                  <DeleteIcon
                                    className="text-red-500 cursor-pointer"
                                    sx={{ fontSize: "1.25rem" }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedFoodId(item.id);
                                      setDeleteDialogOpen(true);
                                    }}
                                  />
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </InfiniteScroll>
                  </div>
                )}
              </div>
            )}

            {/* Favorite Foods Tab Content */}
            {activeTab === 1 && (
              <div className="flex-1 overflow-hidden">
                {isErrorFavFoods ? (
                  <div className="p-4 text-center text-red-600">
                    <p>
                      Error loading favorite foods:{" "}
                      {errorFavFoods?.message || "Please try again"}
                    </p>
                    <button
                      onClick={() => refetchFavFoods()}
                      className="mt-2 px-3 py-1 bg-gray-200 rounded-lg text-sm"
                    >
                      Retry
                    </button>
                  </div>
                ) : isLoadingFavFoods ? (
                  <div className="flex justify-center items-center h-full">
                    <CircularProgress size={24} />
                  </div>
                ) : favFoodsData?.data?.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 h-full flex items-center justify-center">
                    No favorite foods found
                  </div>
                ) : (
                  <div className="h-full overflow-y-auto">
                    <ul className="divide-y">
                      {favFoodsData?.data?.map((item, idx) => (
                        <li
                          key={item.id ?? idx}
                          className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                          onClick={() => handleAddFood(item)}
                        >
                          <span className="flex items-center gap-1">
                            {item?.type === "recipe" && (
                              <Tooltip title="Recipe" arrow>
                                <Image
                                  src={recipeIcon}
                                  alt="Recipe Icon"
                                  width={16}
                                  height={16}
                                  style={{ flexShrink: 0 }}
                                />
                              </Tooltip>
                            )}
                            {item?.name}
                          </span>

                          <div className="flex items-center gap-1">
                            <FavoriteIcon
                              sx={{ fontSize: "1.25rem" }}
                              className="text-green-500 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(item);
                              }}
                            />
                            {role === "admin" && (
                              <DeleteIcon
                                className="text-red-500 cursor-pointer"
                                sx={{ fontSize: "1.25rem" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedFoodId(item.id);
                                  setDeleteDialogOpen(true);
                                }}
                              />
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 2 && (
              <div className="flex-1 overflow-hidden">
                {isErrorPastMeals ? (
                  <div className="p-4 text-center text-red-600">
                    <p>Error loading past meals</p>
                  </div>
                ) : isLoadingPastMeals && flattenedPastMeals.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <CircularProgress size={24} />
                  </div>
                ) : flattenedPastMeals.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 h-full flex items-center justify-center">
                    No past meals found
                  </div>
                ) : (
                  <div
                    id="scrollableDivPast"
                    className="h-full overflow-y-auto"
                  >
                    <InfiniteScroll
                      dataLength={flattenedPastMeals.length}
                      next={fetchNextPastMealsPage}
                      hasMore={!!hasNextPastMealsPage}
                      loader={
                        <div className="flex justify-center py-2">
                          <CircularProgress size={20} />
                        </div>
                      }
                      endMessage={
                        <div className="text-center py-2">
                          <span className="text-xs text-gray-400">
                            No more items
                          </span>
                        </div>
                      }
                      scrollableTarget="scrollableDivPast"
                    >
                      <ul className="divide-y">
                        {flattenedPastMeals.map((item, idx) => (
                          <li
                            key={item.id ?? idx}
                            className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                            onClick={() => handleAddFood(item)}
                          >
                            <span className="flex items-center gap-1">
                              {item?.type === "recipe" && (
                                <Tooltip title="Recipe" arrow>
                                  <Image
                                    src={recipeIcon}
                                    alt="Recipe Icon"
                                    width={16}
                                    height={16}
                                    style={{ flexShrink: 0 }}
                                  />
                                </Tooltip>
                              )}
                              {item?.food?.name}
                            </span>

                            <div className="flex items-center gap-1">
                              {item?.food?.is_favorite === 1 ? (
                                <FavoriteIcon
                                  sx={{ fontSize: "1.25rem" }}
                                  className="text-green-500 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(item);
                                  }}
                                />
                              ) : (
                                <FavoriteBorderIcon
                                  sx={{ fontSize: "1.25rem" }}
                                  className="text-gray-400 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(item);
                                  }}
                                />
                              )}
                              {role === "admin" && (
                                <DeleteIcon
                                  className="text-red-500 cursor-pointer"
                                  sx={{ fontSize: "1.25rem" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedFoodId(item?.food?.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                />
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </InfiniteScroll>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
        {/* <CreateFood
          open={showCreateFoodModal}
          onClose={() => setShowCreateFoodModal(false)}
          onSubmit={data}
        /> */}
        {role !== "customer" && (
          <CreateFoodModalForm
            open={openCreateFood}
            onClose={() => setOpenCreateFood(false)}
            onSubmit={data}
          />
        )}
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Favorite Food</DialogTitle>
        <DialogContent>
          Are you sure you want to remove this food from your favorites?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddFoodInRecipe;
