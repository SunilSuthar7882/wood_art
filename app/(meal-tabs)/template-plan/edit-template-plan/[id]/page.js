"use client";

import DayNavigation from "@/component/CommonComponents/DayNavigation";
import DayProgressBar from "@/component/CommonComponents/DayProgressBar";
import MealCardGrid from "@/component/CommonComponents/MealCardGrid";
import NutritionSummaryBar from "@/component/CommonComponents/NutritionSummeryBar";
import AddFood from "@/component/Dashboard/ManagePlan/AddFood";
import {
  useAddNewTemplateMealSlot,
  useGetTemplatePlan,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import {
  dayTotalNutrition,
  mealSlotNutritionDetails,
  mealTypes,
  validateTempPlanData,
} from "@/utils/utils";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  useAddFavMealInPlan,
  useAddFavMealInTemplatePlan,
  useDeletetempSlot,
  useEditTempSlot,
  useTempPlanComplete,
} from "@/helpers/hooks/trainersectionapi/trainerCustomPlanRequest";
import backIcon from "@/public/images/back-arrow.png";
import {
  useRemoveFood,
  useSaveTemplate,
} from "@/helpers/hooks/mamAdmin/mamAdmin";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { Routes } from "@/config/routes";
import CommonLoader from "@/component/CommonLoader";
import { Button, CircularProgress, Tooltip } from "@mui/material";
import { getLocalStorageItem } from "@/helpers/localStorage";
import SelectMealToAdd from "@/component/CommonComponents/SelectMealToAdd";

export default function EditDietPlanPage() {
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [mealSlotId, setMealSlotId] = useState("");
  const [visibleMealSlots, setVisibleMealSlots] = useState([]);
  const [recentlyAddedSlot, setRecentlyAddedSlot] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [localMealSlots, setLocalMealSlots] = useState({});
  const [localPlanData, setLocalPlanData] = useState(null);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isEditTempPlanMode, setIsEditTempPlanMode] = useState(false);
  const id = params?.id;
  const templateIdFromQuery = searchParams.get("template_id");
  const isTemplateSelected = !!templateIdFromQuery;
  const role = getLocalStorageItem("role");
  const [showAddMealView, setShowAddMealView] = useState(false);

  // const { data: planData, refetch:refetchPlanData } = useGetTemplatePlan({ templateId: id });

  const { data: planData, isPending: isFetchingPending } = useGetTemplatePlan({
    templateId: templateIdFromQuery,
  });
  const {
    data: mealPlanData,
    refetch,
    isPending: isFetchingTempPlanPending,
  } = useGetTemplatePlan({
    templateId: id,
  });

  const { mutate: deleteFood, isPending: isRemoveFoodPending } =
    useRemoveFood();
  const { mutate: addNewMealSlot, isPending: isMealSlotAddPending } =
    useAddNewTemplateMealSlot();
  const { mutate: addFavMealInPlan, isPending: isAddFavMealPending } =
    useAddFavMealInTemplatePlan();
  const { mutate: editMealSlot, isPending: isMealSlotEditPending } =
    useEditTempSlot();
  const { mutate: deleteMealSlot, isPending: isSlotLoadingDelete } =
    useDeletetempSlot();
  const { mutate: tempPlanComplete, isPending: isMealPlanCompleteLoading } =
    useTempPlanComplete();
  const { mutate: tempPlan, isPending: isTempPlanPending } = useSaveTemplate();
  const { isValid } = validateTempPlanData(mealPlanData?.data);

  const normalizePlanData = (data, source = "custom") => {
    const isTemplate = source === "template";
    return {
      id: data.id,
      name: data.name,
      number_of_days: data.number_of_days,
      is_draft: data.is_draft,
      type: isTemplate ? "template" : data.type,
      category_maps: (isTemplate
        ? data.template_category_maps
        : data.template_category_maps
      )?.map((c) => ({
        id: c.id,
        category_id: isTemplate
          ? c.meal_plan_category?.id
          : c.meal_plan_category?.id,
        name: isTemplate
          ? c.meal_plan_category?.name
          : c.meal_plan_category?.name,
      })),
      days: (isTemplate ? data.template_days : data.template_days)?.map(
        (day) => ({
          id: day.id,
          day_number: day.day_number,
          total_calories: day.total_calories,
          total_carbs: day.total_carbs,
          total_protein: day.total_protein,
          total_fat: day.total_fat,
          total_fluid: day.total_fluid,
          slots: (isTemplate ? day.template_slots : day.template_slots)?.map(
            (slot) => ({
              id: slot.id,
              is_favorite: slot?.is_favorite,
              meal_slot: isTemplate ? slot.id : slot.id,
              title: slot.title,
              total_calories: slot.total_calories,
              total_carbs: slot.total_carbs,
              total_protein: slot.total_protein,
              total_fat: slot.total_fat,
              total_fluid: slot.total_fluid,
              foods:
                (isTemplate ? slot.template_foods : slot.template_foods)?.map(
                  (f) => ({
                    id: f.id,
                    food_id: f.food_id,
                    food: f.food,
                    integral: f.integral,
                    nominator: f.nominator,
                    denominator: f.denominator,
                    unit: f.unit,
                    calories: f.calories,
                    protein: f.protein,
                    fat: f.fat,
                    carbs: f.carbs,
                    fluid: f.fluid,
                    food_serving_id: f.food_serving_id,
                  })
                ) || [],
            })
          ),
        })
      ),
    };
  };

  useEffect(() => {
    if (isTemplateSelected && planData?.data && mealPlanData?.data) {
      const normalizedTemplate = normalizePlanData(planData.data, "template");
      const normalizedCustom = normalizePlanData(mealPlanData.data, "custom");

      setLocalPlanData({
        ...normalizedTemplate,
        name: normalizedCustom.name,
      });
    } else if (mealPlanData?.data) {
      setLocalPlanData(normalizePlanData(mealPlanData.data, "custom"));
    }
  }, [planData, mealPlanData, isTemplateSelected]);

  useEffect(() => {
    if (localPlanData?.days) {
      const slotsWithFood = [];
      mealTypes.forEach((meal) => {
        const nutrition = getMealSlotNutrition(
          localPlanData.days,
          activeStep,
          meal.id
        );
        const localSlotData = localMealSlots[`${activeStep}_${meal.id}`];
        if (
          nutrition?.foods?.length > 0 ||
          recentlyAddedSlot === meal.id ||
          localSlotData
        ) {
          slotsWithFood.push(meal);
        }
      });
      setVisibleMealSlots(slotsWithFood);
    }
  }, [localPlanData, activeStep, recentlyAddedSlot, localMealSlots]);

  const getMealSlotNutrition = (days, day, slotId) => {
    const localKey = `${day}_${slotId}`;
    if (localMealSlots[localKey]) return localMealSlots[localKey];
    return mealSlotNutritionDetails(days, day, slotId);
  };

  const handleAddMealSlot = (title, onSuccessCb) => {
    addNewMealSlot(
      { template_id: id, day_number: activeStep, title },
      {
        onSuccess: () => {
          onSuccessCb?.();
        },
      }
    );
  };

  const handleEditMealSlot = (data, onSuccessCb) => {
    editMealSlot(data, {
      onSuccess: () => {
        onSuccessCb?.();
      },
    });
  };

  const handleDeleteMealSlot = (slotId, onSuccessCb) => {
    deleteMealSlot(slotId, {
      onSuccess: () => {
        onSuccessCb?.();
      },
    });
  };

  const handleAddFoodClick = (mealId) => {
    setIsAddFoodOpen(true);
    setMealSlotId(mealId);
  };

  // const handleSwapFood = (mealId) => {
  //   setIsAddFoodOpen(true);
  //   setMealSlotId(mealId);
  // };

  const handleAddFoodComplete = () => {
    if (recentlyAddedSlot) {
      const slotKey = `${activeStep}_${recentlyAddedSlot}`;
      setLocalMealSlots((prev) => {
        const copy = { ...prev };
        delete copy[slotKey];
        return copy;
      });
    }
    refetch();
    setIsAddFoodOpen(null);
    setRecentlyAddedSlot(null);
  };

  const handleDeleteFood = async (item) => {
    try {
      await deleteFood(item?.id);
      await refetch();
    } catch (err) {
      console.error("Error deleting food:", err);
      throw err;
    }
  };

  const handleTempPlanComplete = () => {
    tempPlanComplete(
      { params: { template_id: id } },
      {
        onSuccess: () => {
          router.push(Routes.mealplantemplate);
        },
      }
    );
  };

  const handleTempPlanSave = (isDraft = false) => {
    tempPlan({
      plan_id: id,
      template_id: templateIdFromQuery,
      is_draft: isDraft,
    });
  };

  const handleTempPlanSelectAndEdit = (isDraft = false) => {
    return new Promise((resolve) => {
      tempPlan(
        {
          plan_id: id,
          template_id: templateIdFromQuery,
          is_draft: isDraft,
        },
        {
          onSuccess: () => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("template_id");
            const newQuery = params.toString();
            router.replace(`?${newQuery}`, { scroll: false });
            resolve();
          },
        }
      );
    });
  };

  const isCurrentDayValid = (day) => {
    if (!day) {
      return { valid: false, reason: "invalid_structure" };
    }

    // Handle case when slots is not an array
    if (!Array.isArray(day.slots)) {
      return { valid: false, reason: "invalid_structure" };
    }

    // Handle empty slots
    if (day.slots.length === 0) {
      return { valid: false, reason: "no_slots" };
    }

    for (const slot of day.slots) {
      if (!Array.isArray(slot.foods) || slot.foods.length === 0) {
        return { valid: false, reason: "empty_slot_foods" };
      }

      const hasInvalidFood = slot.foods.some(
        (food) =>
          // !food?.food_serving_id ||
          // !food?.unit ||
          food?.integral === null || food?.integral === undefined
      );

      if (hasInvalidFood) {
        return { valid: false, reason: "incomplete_servings" };
      }
    }

    return { valid: true };
  };

  const handleNext = () => {
    const days = localPlanData?.days || [];
    const currentDay = days.find(
      (d) => Number(d.day_number) === Number(activeStep)
    );

    const { valid, reason } = isCurrentDayValid(currentDay);

    if (!valid) {
      switch (reason) {
        case "no_slots":
          showSnackbar(
            "⚠️ Please add at least one meal slot before proceeding.",
            "error"
          );
          break;
        case "empty_slot_foods":
          showSnackbar("⚠️ Every slot must have at least one food.", "error");
          break;
        case "incomplete_servings":
          showSnackbar(
            "⚠️ Please complete servings for all foods before proceeding.",
            "error"
          );
          break;
        default:
          showSnackbar("⚠️ Add atleast one slot.", "error");
      }
      return;
    }

    if (activeStep < localPlanData?.number_of_days) {
      setActiveStep((prev) => prev + 1);
      setRecentlyAddedSlot(null);
    }
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
      setRecentlyAddedSlot(null);
    }
  };

  const dayNutrition = dayTotalNutrition(localPlanData?.days, activeStep);

  const type = localPlanData?.type;
  const handleAddMeal = () => {
    setShowAddMealView(true);
  };
  const handleAddFavMealInPlan = (favoriteId, activeStep) => {
    const day_id = localPlanData?.days?.[activeStep - 1]?.id;

    addFavMealInPlan(
      {
        favoriteMealId: favoriteId,
        mealPlanDayId: day_id,
      },
      {
        onSuccess: () => {
          setShowAddMealView(false);
        },
      }
    );
  };

  if (
    isRemoveFoodPending ||
    isSlotLoadingDelete ||
    isTempPlanPending ||
    isFetchingTempPlanPending ||
    isMealPlanCompleteLoading
  )
    return <CommonLoader />;
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-10">
        <h1 className="text-2xl font-bold mb-0">
          <button onClick={() => router.back()} className="flex items-center">
            <Image
              src={backIcon}
              height={22}
              width={22}
              className="me-4 ms-1"
              alt="back-icon"
            />
            Edit Template Plan
          </button>
        </h1>
      </div>

      <div className="h-full bg-white rounded-2xl shadow-md p-4 flex flex-col flex-1 overflow-auto">
        <div className="w-full bg-white text-black text-sm px-4 py-2 min-h-[100px] border border-gray-300 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xl font-sans font-semibold">
                {localPlanData?.name}
              </div>
              {localPlanData?.category_maps?.length > 0 && (
                <span className="block text-gray-500 text-base font-normal break-words whitespace-normal">
                  {localPlanData?.category_maps
                    .map((c) => c.name)
                    .sort((a, b) => a.localeCompare(b))
                    .join(", ")}
                </span>
              )}

              <div className="text-base font-semibold mb-2">
                {localPlanData?.number_of_days ?? 1} Days
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {localPlanData?.hasOwnProperty("is_draft") &&
                localPlanData?.is_draft && (
                  <div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                      Draft
                    </span>
                  </div>
                )}

              {localPlanData?.is_draft === true && (
                <Tooltip
                  title={
                    !isValid ? "Please complete the plan before submitting" : ""
                  }
                  disableHoverListener={isValid}
                  arrow
                >
                  {/* Tooltip doesn't work directly on disabled buttons, so wrap in span */}
                  <span>
                    <Button
                      variant="contained"
                      size="medium"
                      onClick={handleTempPlanComplete}
                      disabled={!isValid || isMealPlanCompleteLoading}
                      sx={{
                        borderRadius: 2,
                        position: "relative",
                        minWidth: 140,
                        textTransform: "none",
                        pointerEvents: !isValid ? "auto" : "initial",
                      }}
                    >
                      {isMealPlanCompleteLoading ? (
                        <>
                          <CircularProgress
                            size={18}
                            color="inherit"
                            sx={{ mr: 1 }}
                          />
                          Submitting...
                        </>
                      ) : (
                        "Save & Submit"
                      )}
                    </Button>
                  </span>
                </Tooltip>
              )}

              {role === "customer" &&
                type === "self_service" &&
                !isEditTempPlanMode && (
                  <button
                    onClick={() => setIsEditTempPlanMode(true)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Edit
                  </button>
                )}
            </div>
          </div>
        </div>

        <DayNavigation
          activeDay={activeStep}
          totalDays={localPlanData?.number_of_days}
          onPrevDay={handleBack}
          onNextDay={handleNext}
        />

        <DayProgressBar
          currentValue={activeStep}
          maxValue={localPlanData?.number_of_days}
        />

        <NutritionSummaryBar nutritionData={dayNutrition} />
        {showAddMealView ? (
          <SelectMealToAdd
            setShowAddMealView={setShowAddMealView}
            onAddMealInPlan={handleAddFavMealInPlan}
            activeStep={activeStep}
            loading={isAddFavMealPending}
          />
        ) : (
          <div className="flex flex-1 flex-col overflow-auto ">
            <div
              className={`flex flex-1 flex-col  ${
                (isTemplateSelected && !isEditMode) ||
                (role === "customer" &&
                  type === "self_service" &&
                  !isEditTempPlanMode) ||
                (role === "customer" && type !== "self_service")
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              <MealCardGrid
                loadingSlot={isMealSlotAddPending || isMealSlotEditPending}
                loadingDelete={isSlotLoadingDelete}
                meals={visibleMealSlots}
                mealPlanSlots={
                  localPlanData?.days?.find(
                    (day) => day.day_number === activeStep
                  )?.slots || []
                }
                // onSwapFood={handleSwapFood}
                isEditMode={isEditMode}
                onAddFoodClick={handleAddFoodClick}
                onDeleteFood={handleDeleteFood}
                onAddMealSlot={handleAddMealSlot}
                onAddMeal={handleAddMeal}
                onEditMealSlot={handleEditMealSlot}
                onDeleteMealSlot={handleDeleteMealSlot}
                isTemplate
                dayNutrition={dayNutrition}
              />
            </div>
          </div>
        )}
        {isTemplateSelected && (
          <div className="w-full flex justify-center gap-4 bg-white sticky bottom-0 z-10">
            <button
              onClick={() => handleTempPlanSave(false)}
              className="px-6 py-2 rounded-md bg-green-300 text-gray-800 hover:bg-gray-200 transition"
            >
              Save As it Is
            </button>
            <button
              onClick={() => {
                setIsEditMode(true);
                handleTempPlanSelectAndEdit(true);
              }}
              className="px-6 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
            >
              Select and Edit
            </button>
          </div>
        )}
      </div>

      <AddFood
        isOpen={isAddFoodOpen}
        setIsOpen={setIsAddFoodOpen}
        mealPlanData={mealPlanData?.data}
        activeDay={activeStep}
        mealSlotId={mealSlotId}
        onComplete={handleAddFoodComplete}
        isTemplate
      />
    </div>
  );
}
