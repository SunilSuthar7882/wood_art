import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Inbox as InboxIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  SyncAlt,
  Loop,
  Sync,
  KeyboardArrowDown,
  KeyboardArrowRight,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import MealSlotModal from "./MealSlotModal";
import {
  useGetFoodData,
  useManageFavoriteFood,
  useManageFavoriteMeal,
  useUpdateFoodServingMutation,
  useUpdateTemplateFoodServingMutation,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import { formatNumber } from "@/utils/utils";
import AddServingSizeModal from "../AddServingSizeModal";
import CommonLoader from "../CommonLoader";
import AddServingInFood from "./AddServingInFood";
import AddServingInRecipe from "./AddServingInRecipe";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import recipeIcon from "../../public/images/recipeIcon.png";
import Image from "next/image";
import { CopyIcon, FolderSyncIcon } from "lucide-react";
import CopyMealSlotModal from "./CopyMealSlotModal";

const FoodItem = ({
  food,
  onDelete,
  onFavorite,
  onAddServingClick,
  onSwapFood,
  isTemplate,
  meal,
}) => {
  console.log("isTemplate", isTemplate);
  const name = food?.food?.name || food?.name || "Food Item";
  const calories = food?.food?.calories || food?.calories || 0;
  const carbs = food?.food?.carbs || food?.carbs || 0;
  const protein = food?.food?.protein || food?.protein || 0;
  const fat = food?.food?.fat || food?.fat || 0;
  const fluid = food?.food?.fluid || food?.fluid || 0;
  const type = food?.food?.type;

  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [expanded, setExpanded] = useState(false);

  // useGetFoodData only triggers when expanded = true and selectedFoodId is set
  const { data: foodData, isFetching } = useGetFoodData({
    food_id: selectedFoodId,
    enabled: !!selectedFoodId && expanded,
  });

  const handleClick = () => {
    if (expanded) {
      setExpanded(false);
    } else {
      setSelectedFoodId(food.food_id);
      setExpanded(true);
    }
  };
  const details = foodData?.data;
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          py: 0.75,
          px: 1,
          borderBottom: "1px solid #eee",
          "&:hover": { bgcolor: "#f5f5f5" },
          minHeight: "36px",
          width: "100%",
        }}
      >
        {/* Name on full row */}
        <Tooltip title={name} enterDelay={500}>
          <Typography
            onClick={type === "recipe" ? handleClick : undefined}
            variant="body2"
            sx={{
              width: "100%",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              fontSize: { xs: "0.75rem", sm: "0.8rem" },
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              cursor: type === "recipe" ? "pointer" : "text",
            }}
          >
            {type === "recipe" &&
              (expanded ? (
                <KeyboardArrowDown fontSize="small" />
              ) : (
                <KeyboardArrowRight fontSize="small" />
              ))}
            {type === "recipe" && (
              <Tooltip title="Recipe" arrow placement="left">
                <Image
                  src={recipeIcon}
                  alt="Recipe Icon"
                  width={16}
                  height={16}
                  style={{ flexShrink: 0 }}
                />
              </Tooltip>
            )}
            {name}
          </Typography>
        </Tooltip>
        {expanded && (
          <Box sx={{ mt: 1, pl: 2 }}>
            {isFetching ? (
              <CircularProgress size={20} />
            ) : details ? (
              <>
                {/* Basic Info */}
                {/* <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {details.name}
                </Typography> */}

                <Typography variant="body2">
                  <strong>Food Category:</strong>
                  {details.food_category_maps
                    ?.map((cat) => cat.food_category.name)
                    ?.sort((a, b) => a.localeCompare(b))
                    ?.join(", ") || "N/A"}{" "}
                </Typography>

                {/* <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {details.food_category_maps?.map((cat) => (
                    <Chip
                      key={cat.id}
                      label={cat.food_category.name}
                      size="small"
                      sx={{ bgcolor: "#f5f5f5" }}
                    />
                  ))}
                </Box> */}
                <Box display="flex" flexWrap="wrap" alignItems="center">
                  <Typography variant="body2">
                    <strong>Total Calories:</strong>{" "}
                    {details.total_calories?.toFixed(2)} kcal,
                  </Typography>
                  <Typography variant="body2">
                    <strong>Carbs:</strong> {details.total_carbs?.toFixed(2)} g,
                  </Typography>
                  <Typography variant="body2">
                    <strong>Protein:</strong>{" "}
                    {details.total_protein?.toFixed(2)} g,
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fat:</strong> {details.total_fat?.toFixed(2)} g,
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fluid:</strong> {details.total_fluid?.toFixed(2)} ml
                  </Typography>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Ingredients */}
                <Grid container spacing={2}>
                  {/* Left Side - Ingredients */}
                  <Grid item xs={12} md={6}>
                    {details.ingredients.length > 0 && (
                      <>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          Ingredients:
                        </Typography>

                        {details.ingredients?.length > 0 ? (
                          <Box>
                            {details.ingredients.map((ing) => (
                              <Box
                                key={ing.id}
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  borderBottom: "1px dashed #ddd",
                                  py: 0.5,
                                }}
                              >
                                <Typography variant="body2">
                                  {ing.ingredient.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {ing.integral} {ing.unit}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No ingredients found
                          </Typography>
                        )}
                      </>
                    )}
                  </Grid>

                  {/* Right Side - Instructions */}
                  <Grid item xs={12} md={6}>
                    {details.instruction && (
                      <>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          Instructions:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: "pre-line",
                            color: "text.secondary",
                          }}
                        >
                          {details.instruction}
                        </Typography>
                      </>
                    )}
                  </Grid>
                </Grid>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No data found
              </Typography>
            )}
          </Box>
        )}
        {/* Row with Serving + Nutrition + Actions */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(8, 1fr)",
              sm: "repeat(8, 1fr)",
              md: "repeat(8, 1fr)",
            },
            gap: 1,
            textAlign: "center",
            alignItems: "center",
            // bgcolor: "#F8F9FA",
            p: 0,
            // borderTop: "1px solid #e0e0e0",
          }}
        >
          {/* Serving section (25%) */}
          <Box
            sx={{
              gridColumn: {
                xs: "span 2",
                sm: "span 2",
                md: "span 2",
              },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: 1, // align content to left
            }}
          >
            {/* Serving Size label */}
            <Typography
              variant="caption"
              sx={{
                p: 0,
                fontSize: "12px",
                color: "text.secondary",
                lineHeight: 1,
              }}
            >
              Serving Size
            </Typography>

            {/* Quantity + Unit */}
            {food.integral ||
            food.nominator ||
            food.denominator ||
            food.unit ? (
              <Box
                onClick={() => onAddServingClick(food, true)}
                sx={{
                  cursor: "pointer",
                  fontSize: "13px",
                  lineHeight: 1,
                  color: "primary.main",
                  mt: 0.25,
                }}
              >
                {[
                  (food.integral > 0 && food.integral) || "",
                  food.nominator && food.denominator
                    ? `${food.nominator}/${food.denominator}`
                    : "",
                  type === "recipe" ? "person" : food.unit || "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              </Box>
            ) : (
              <Button
                variant="text"
                onClick={() => onAddServingClick(food, false)}
                size="small"
                sx={{
                  p: 0,
                  fontSize: "11px",
                  minHeight: "16px",
                  lineHeight: 1,
                  textTransform: "none",
                  mt: 0.25,
                }}
              >
                Add Serving
              </Button>
            )}
          </Box>

          {/* Compact nutrition values */}
          <Box
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
              flexWrap: "nowrap",
              width: { xs: "85%", sm: "auto" },
            }}
          >
            <NutritionTag label="Cal" value={calories} unit="kcal" />
          </Box>
          <Box
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
              flexWrap: "nowrap",
              width: { xs: "85%", sm: "auto" },
            }}
          >
            <NutritionTag label="Carb" value={carbs} unit="g" />
          </Box>
          <Box
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
              flexWrap: "nowrap",
              width: { xs: "85%", sm: "auto" },
            }}
          >
            <NutritionTag label="Prot" value={protein} unit="g" />
          </Box>
          <Box
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
              flexWrap: "nowrap",
              width: { xs: "85%", sm: "auto" },
            }}
          >
            <NutritionTag label="Fat" value={fat} unit="g" />
          </Box>
          <Box
            sx={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
              flexWrap: "nowrap",
              width: { xs: "85%", sm: "auto" },
            }}
          >
            <NutritionTag label="H₂O" value={fluid} unit="ml" />
          </Box>

          {/* Action buttons */}
          <Box
            sx={{
              display: "flex",
              ml: { xs: 0.5, sm: 1 },
              width: { xs: "15%", sm: "auto" },
              justifyContent: "flex-end",
            }}
          >
            {type === "food" && !isTemplate && (
              <Tooltip title="Swap Food">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => {
                    const slotId = food?.id;
                    const foodId = food?.food_id;
                    const foodName = name;
                    onSwapFood(slotId, foodId, foodName);
                  }}
                >
                  <Sync fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <IconButton
              size="small"
              color="primary"
              onClick={() => onFavorite?.(food)}
              sx={{ p: 0.25 }}
            >
              {food?.food?.is_favorite ? (
                <FavoriteIcon sx={{ fontSize: "1.25rem" }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: "1.25rem" }} />
              )}
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete?.(food)}
              sx={{ p: 0.25 }}
            >
              <DeleteIcon sx={{ fontSize: "1.25rem" }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </>
  );
};

// Ultra-compact nutrition tag component
const NutritionTag = ({ label, value, unit }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 0,
    }}
  >
    <Typography
      variant="caption"
      sx={{
        fontSize: "12px",
        lineHeight: 1,
        color: "text.secondary",
        mb: "1px",
        fontWeight: 500,
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="caption"
      sx={{
        fontSize: "13px",
        lineHeight: 1,
        whiteSpace: "nowrap",
        fontWeight: 400,
      }}
    >
      {value}
      {unit}
    </Typography>
  </Box>
);

// MealCard component unchanged
const MealCard = ({
  dayNutrition,
  onSwapFood,
  meal,
  onDeleteFood,
  onAddFoodClick,
  onEditSlot,
  onDeleteSlot,
  isTemplate,
  loadingDelete,
  onCopyMealSlot,
  onAddMealToFavorite,
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);
  const [openServingModal, setOpenServingModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const { mutate: updateServing, isPending: isUpdatingServing } =
    useUpdateFoodServingMutation();
  const {
    mutate: updateTemplateServing,
    isPending: isUpdatingTemplateServing,
  } = useUpdateTemplateFoodServingMutation();
  const foodtype = selectedFood?.food?.type;
  const handleOpenServingModal = (food, hasEditedValue = false) => {
    setSelectedFood({
      ...food,
      hasEdited: hasEditedValue,
      calories: food.calories,
      carbs: food.carbs,
      protein: food.protein,
      fat: food.fat,
      fluid: food.fluid,
    });
    setOpenServingModal(true);
  };
  const handleCloseServingModal = () => {
    setOpenServingModal(false);
    setSelectedFood(null);
  };

  const handleSaveServing = (servingData) => {
    const foodSlotId = selectedFood?.id;
    const foodServingId =
      selectedFood?.serving_id ||
      selectedFood?.food_serving_id ||
      servingData?.food_serving_id;

    if (!foodSlotId || !foodServingId) {
      console.error("Missing foodSlotId or foodServingId");
      return;
    }

    const [nominator, denominator] =
      servingData.fraction !== "0"
        ? servingData.fraction.split("/").map(Number)
        : [0, 0];

    const payload = {
      food_type: servingData.food_type,
      food_slot_id: foodSlotId,
      food_serving_id: foodServingId,
      unit: servingData.unit,
      integral: servingData.integral,
      nominator,
      denominator,
      calories: parseFloat(servingData.calories),
      carbs: parseFloat(servingData.carbs),
      protein: parseFloat(servingData.protein),
      fat: parseFloat(servingData.fat),
      fluid: parseFloat(servingData.fluid),
    };

    const mutation = isTemplate ? updateTemplateServing : updateServing;
    mutation(payload, {
      onSuccess: () => {
        handleCloseServingModal();
      },
    });
  };

  const {
    mutate: manageFavFood,
    isPending: isManageFavFood,
    error: ManageFavFoodError,
  } = useManageFavoriteFood();
  const {
    mutate: manageFavMeal,
    isPending: isManageFavMeal,
    error: ManageFavMealError,
  } = useManageFavoriteMeal();
  const foodList = meal?.foods || [];
  const nutritionItems = [
    { label: "Calories", value: meal?.total_calories, unit: "kcal" },
    { label: "Carbs", value: formatNumber(meal?.total_carbs), unit: "g" },
    { label: "Protein", value: formatNumber(meal?.total_protein), unit: "g" },
    { label: "Fat", value: formatNumber(meal?.total_fat), unit: "g" },
    { label: "Fluid", value: meal?.total_fluid, unit: "ml" },
  ];

  const handleDeleteClick = (food) => {
    setFoodToDelete(food);
    setDeleteConfirmOpen(true);
  };

  const handleFavoriteFoodClick = (food) => {
    manageFavFood(food?.food?.id);
  };

  const handleFavoriteMealClick = (meal) => {
    manageFavMeal({ id: meal.id, title: meal.title });
  };

  const handleConfirmDelete = async () => {
    try {
      await onDeleteFood(foodToDelete);
      setDeleteConfirmOpen(false);
      setFoodToDelete(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (isManageFavFood || isManageFavMeal) return <CommonLoader />;

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: "#f8f9fa",
            p: 1,
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="600" color="primary">
            {meal?.title}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Action buttons */}
            <Tooltip title="Add Food">
              <IconButton
                size="small"
                color="success"
                onClick={() => {
                  const valueToSend = isTemplate ? meal?.meal_slot : meal?.id;
                  onAddFoodClick(valueToSend);
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Favorite">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleFavoriteMealClick(meal)}
                sx={{ p: 0.25 }}
              >
                {meal?.is_favorite ? (
                  <FavoriteIcon sx={{ fontSize: "1.25rem" }} />
                ) : (
                  <FavoriteBorderIcon sx={{ fontSize: "1.25rem" }} />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Meal Slot">
              <IconButton
                size="small"
                color="primary"
                onClick={() => onEditSlot(meal)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {!isTemplate && (
              <Tooltip title="Copy Meal Slot">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => onCopyMealSlot(meal)}
                >
                  <CopyIcon fontSize="small" size={20} />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Delete Meal Slot">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDeleteSlot(meal)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Food List */}
        {foodList.length > 0 ? (
          <Box sx={{ p: 1, flex: 1 }}>
            {foodList.map((item, idx) => (
              <FoodItem
                key={idx}
                food={item}
                meal={meal}
                isTemplate={isTemplate}
                onSwapFood={onSwapFood}
                onDelete={() => handleDeleteClick(item)}
                onFavorite={() => handleFavoriteFoodClick(item)}
                onAddServingClick={(hasEdited) =>
                  handleOpenServingModal(item, hasEdited)
                }
                foodDataNew={meal}
              />
            ))}
          </Box>
        ) : (
          <Box
            sx={{ p: 4, textAlign: "center", color: "text.secondary", flex: 1 }}
          >
            <InboxIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
            <Typography variant="body2">
              {`No foods added yet. Click the "+" icon to add foods.`}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(3, 1fr)",
              sm: "repeat(7, 1fr)",
              md: "repeat(6, 1fr)",
            },
            gap: 1,
            textAlign: "center",
            alignItems: "center",
            bgcolor: "#F8F9FA",
            p: 1,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          {/* Meal Totals Label */}
          <Box
            sx={{
              gridColumn: {
                xs: "span 3",
                sm: "span 2",
                md: "span 1",
              },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="600"
              noWrap
              sx={{ whiteSpace: "nowrap" }}
            >
              Meal Totals
            </Typography>
          </Box>

          {/* Nutrients */}
          {nutritionItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                textAlign: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="body2" fontWeight="500">
                {item.value !== undefined && item.value !== null
                  ? Number(item.value).toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })
                  : "0"}
                {item.unit}
              </Typography>
            </Box>
          ))}
        </Box>
        {/* </Box> */}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          loading={loadingDelete}
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Food Item?"
          message={`Are you sure you want to remove "${foodToDelete?.food?.name}" from this meal?`}
          confirmButtonText="Delete"
          type="error"
        />
      </Paper>

      {foodtype === "food" ? (
        <AddServingInFood
          loadingMealServing={isUpdatingServing}
          loadingTempServing={isUpdatingTemplateServing}
          meal={meal}
          open={openServingModal}
          onClose={handleCloseServingModal}
          onSave={handleSaveServing}
          food={selectedFood?.food || selectedFood}
          dayNutrition={dayNutrition}
          initialHasEdited={selectedFood?.hasEdited || false}
        />
      ) : (
        <AddServingInRecipe
          loadingMealServing={isUpdatingServing}
          loadingTempServing={isUpdatingTemplateServing}
          meal={meal}
          open={openServingModal}
          onClose={handleCloseServingModal}
          onSave={handleSaveServing}
          food={selectedFood?.food || selectedFood}
          dayNutrition={dayNutrition}
          initialHasEdited={selectedFood?.hasEdited || false}
        />
      )}
    </>
  );
};

// Main Grid component
const MealCardGrid = ({
  dayNutrition,
  loadingDelete,
  loadingGrid,
  loadingSlot,
  mealPlanSlots,
  onAddFoodClick,
  onSwapFood,
  onDeleteFood,
  onAddMealSlot,
  onEditMealSlot,
  onDeleteMealSlot,
  onAddTemplateFoodClick,
  isTemplate,
  onAddMeal,
  meals,
  planDays,
  activeStep,
  totalDays,
}) => {
  console.log("planDays", planDays);
  const [mealSlotModalOpen, setMealSlotModalOpen] = useState(false);
  const [mealSlotModalMode, setMealSlotModalMode] = useState("add");
  const [selectedMealSlot, setSelectedMealSlot] = useState(null);
  const [deleteSlotConfirmOpen, setDeleteSlotConfirmOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);
  const [showAddMealView, setShowAddMealView] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const handleAddMeal = () => {
    setShowAddMealView(true);
  };

  const handleAddMealSlot = () => {
    setMealSlotModalMode("add");
    setSelectedMealSlot(null);
    setMealSlotModalOpen(true);
  };

  const handleEditMealSlot = (meal) => {
    setMealSlotModalMode("edit");
    setSelectedMealSlot(meal);
    setMealSlotModalOpen(true);
  };

  const handleDeleteMealSlot = (meal) => {
    setSlotToDelete(meal);
    setDeleteSlotConfirmOpen(true);
  };

  const handleSaveMealSlot = (data) => {
    if (mealSlotModalMode === "add") {
      onAddMealSlot(data.title, () => setMealSlotModalOpen(false));
    } else {
      onEditMealSlot(data, () => setMealSlotModalOpen(false));
    }
  };

  const handleConfirmDelete = () => {
    onDeleteMealSlot(slotToDelete.id, () => setDeleteSlotConfirmOpen(false));
    setSlotToDelete(null);
  };

  const handleAddMealToFavorite = () => {
    manageFavMeal(meal?.id);
  };
  const handleCopyMealSlot = (meal) => {
    // You can open your existing CopyDaysModal here, or do a custom modal
    setSelectedMeal(meal); // store the current meal
    setCopyModalOpen(true); // open a modal to choose target day(s)
  };
  const handleCopyConfirm = (meal, selectedDays) => {
    console.log("Copy meal:", meal.title, "to days:", selectedDays);
    setCopyModalOpen(false);
  };
  if (loadingGrid) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
          padding: 1,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width="100%"
            height={200}
            animation="wave"
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1, overflow: "auto" }}>
      {/* Add Meal Slot Button */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 3,
          flex: 1,
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddMealSlot}
          sx={{ textTransform: "none" }}
        >
          Add a Meal slot
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddMeal}
          sx={{ textTransform: "none" }}
        >
          Add Meal
        </Button>
      </Box>
      {mealPlanSlots.length === 0 && (
        <Box
          sx={{
            // flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            m: 2,
          }}
        >
          <Typography color="gray" fontWeight={500}>
            Please add at least one meal slot
          </Typography>
        </Box>
      )}
      {/* Meal Cards Grid */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          // gridTemplateColumns: { xs: "1fr", md: "repeat(1, 1fr)" }, // 2 columns on md screens
          gap: 3,
          maxWidth: 600, // limit total width of the grid
          margin: "0 auto", // center it horizontally
          overflow: "auto",
        }}
      >
        {mealPlanSlots?.map((meal) => (
          <MealCard
            key={isTemplate ? meal.id : meal.meal_slot}
            meal={meal}
            onDeleteFood={onDeleteFood}
            onAddFoodClick={onAddFoodClick}
            onSwapFood={onSwapFood}
            onAddTemplateFoodClick={onAddTemplateFoodClick}
            onEditSlot={handleEditMealSlot}
            onDeleteSlot={handleDeleteMealSlot}
            onAddMealToFavorite={handleAddMealToFavorite}
            onCopyMealSlot={handleCopyMealSlot}
            isTemplate={isTemplate}
            loading={loadingDelete}
            dayNutrition={dayNutrition}
          />
        ))}
      </Box>

      {/* Enhanced Meal Slot Modal (Add/Edit) */}
      <MealSlotModal
        open={mealSlotModalOpen}
        onClose={() => setMealSlotModalOpen(false)}
        onSave={handleSaveMealSlot}
        initialData={selectedMealSlot}
        mode={mealSlotModalMode}
        loading={loadingSlot}
      />

      {/* Delete Meal Slot Confirmation Modal */}
      <ConfirmationModal
        loading={loadingDelete}
        open={deleteSlotConfirmOpen}
        onClose={() => setDeleteSlotConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Meal Slot?"
        message={`Are you sure you want to delete the "${slotToDelete?.title}" meal slot? This action cannot be undone.`}
        confirmButtonText="Delete"
        type="error"
      />

      {copyModalOpen && (
        <CopyMealSlotModal
          open={copyModalOpen}
          onClose={() => setCopyModalOpen(false)}
          selectedMeal={selectedMeal}
          planDays={planDays}
          activeStep={activeStep}
          totalDays={totalDays}
          onConfirm={(selectedDays) =>
            handleCopyConfirm(selectedMeal, selectedDays)
          }
        />
      )}
    </Box>
  );
};

export default MealCardGrid;
