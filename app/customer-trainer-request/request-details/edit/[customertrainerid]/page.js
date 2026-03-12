"use client";
import CommonLoader from "@/component/CommonLoader";
import { Routes } from "@/config/routes";
import { useDeleteFoodByTrainer } from "@/helpers/hooks/customer/customer";
import { useSaveTemplateinRequest } from "@/helpers/hooks/mamAdmin/mamAdmin";
import {
  useGetMealPlan,
  useGetTemplatePlan,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import {
  useAddNewMealSlot,
  useDeleteMealSlot,
  useEditMealSlot,
  useMealPlanComplete,
  useSwapFood,
} from "@/helpers/hooks/trainersectionapi/trainerCustomPlanRequest";
import {
  dayTotalNutrition,
  mealSlotNutritionDetails,
  mealTypes,
  validateMealPlanData,
} from "@/utils/utils";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import DayNavigation from "@/component/CommonComponents/DayNavigation";
import DayProgressBar from "@/component/CommonComponents/DayProgressBar";
import NutritionSummaryBar from "@/component/CommonComponents/NutritionSummeryBar";
import MealCardGrid from "@/component/CommonComponents/MealCardGrid";
import AddFood from "@/component/Dashboard/ManagePlan/AddFood";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { useGetcustomergetplanerequesttrainerbyid } from "@/helpers/hooks/trainersectionapi/customergetplanerequesttraineriddetails";
import { useForm } from "react-hook-form";
import CustomSelectController from "@/component/CommonComponents/CustomSelectController";
import SwapFood from "@/component/Dashboard/ManagePlan/SwapFood";

const Page = () => {
  const { control } = useForm({
      defaultValues: {
        apply_to: "meal",
      },
    });
     const [selectedFood, setSelectedFood] = useState(null);
      const [swapFoodName, setSwapFoodName] = useState(null);
      const [oldFoodName, setOldFoodName] = useState(null);
      const { mutate: swapFood, isLoading: isSwapping } = useSwapFood();
      const [swapDialogOpen, setSwapDialogOpen] = useState(false);
      const [mealSlotsId, setMealSlotsId] = useState(null);
      const [foodIdToReplace, setFoodIdToReplace] = useState(null);
      const [appliedTo, setAppliedTo] = useState("meal");
      const [isSwapFoodOpen, setIsSwapFoodOpen] = useState(false); // default
  const { customertrainerid } = useParams();

  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [mealSlotId, setMealSlotId] = useState("");
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [visibleMealSlots, setVisibleMealSlots] = useState([]);
  const [recentlyAddedSlot, setRecentlyAddedSlot] = useState(null);
  const [localPlanData, setLocalPlanData] = useState(null);
  const [localMealSlots, setLocalMealSlots] = useState({});

  const [isEditMode, setIsEditMode] = useState(false);
  const [isMealGridLoading, setIsMealGridLoading] = useState(false);
  const searchParams = useSearchParams();
  const templateIdFromQuery = searchParams.get("template_id");
  const [isTemplate, setIsTemplate] = useState(false);

  const { data: planData } = useGetTemplatePlan({
    templateId: templateIdFromQuery,
  });

  const {
    data: trainerCustomerDetailsData,
    refetch: refetchtrainercustomerDetailsid,
    isFetching: isTrainerCustomerDetailsFetching,
    isError: isTrainerCustomerDetailsError,
    error: trainerCustomerDetailsError,
    isLoading: trainerCustomerDetailsLoading,
  } = useGetcustomergetplanerequesttrainerbyid(customertrainerid);
  const mealPlanId =
    trainerCustomerDetailsData?.data?.customer?.custom_plan?.id;

  useEffect(() => {
    refetchtrainercustomerDetailsid();
  }, [refetchtrainercustomerDetailsid]);

  const {
    mutate: deleteFood,
    isLoading: isDeleteFood,
    error: deleteFoodError,
  } = useDeleteFoodByTrainer();
  const { mutate: addNewMealSlot, isPending: isMealSlotAddPending } =
    useAddNewMealSlot();
  const { mutate: editMealSlot, isPending: isMealSlotEditPending } =
    useEditMealSlot();
  const { mutate: deleteMealSlot, isPending: isSlotLoadingDelete } =
    useDeleteMealSlot();
  const { mutate: mealPlanComplete, isPending: isMealPlanCompleteLoading } =
    useMealPlanComplete();

  const { mutate: tempPlan, isPending: isTempPlanSavePending } =
    useSaveTemplateinRequest();

  const {
    data: mealPlanData,
    isPending: isGetMealPlanPending,
    refetch,
  } = useGetMealPlan({
    mealPlanId,
  });

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
        : data.meal_plan_category_maps
      )?.map((c) => ({
        id: c.id,
        category_id: isTemplate
          ? c.template_category?.id
          : c.meal_plan_category?.id,
        name: isTemplate
          ? c.template_category?.name
          : c.meal_plan_category?.name,
      })),
      days: (isTemplate ? data.template_days : data.meal_plan_days)?.map(
        (day) => ({
          day_number: day.day_number,
          total_calories: day.total_calories,
          total_carbs: day.total_carbs,
          total_protein: day.total_protein,
          total_fat: day.total_fat,
          total_fluid: day.total_fluid,
          slots: (isTemplate ? day.template_slots : day.meal_plan_slots)?.map(
            (slot) => ({
              id: slot.id,
              meal_slot: isTemplate ? slot.id : slot.meal_slot,
              title: slot.title,
              total_calories: slot.total_calories,
              total_carbs: slot.total_carbs,
              total_protein: slot.total_protein,
              total_fat: slot.total_fat,
              total_fluid: slot.total_fluid,
              foods:
                (isTemplate ? slot.template_foods : slot.meal_plan_foods)?.map(
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
    if (templateIdFromQuery) {
      setIsTemplate(true);
    }
  }, [templateIdFromQuery]);

  useEffect(() => {
    if (isTemplate && planData?.data && mealPlanData?.data) {
      const normalizedTemplate = normalizePlanData(planData.data, "template");
      const normalizedCustom = normalizePlanData(mealPlanData.data, "custom");

      setLocalPlanData({
        ...normalizedTemplate,
        name: normalizedCustom.name,
      });
    } else if (mealPlanData?.data) {
      setLocalPlanData(normalizePlanData(mealPlanData.data, "custom"));
    }
  }, [planData, mealPlanData, isTemplate]);

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

  const { isValid, errors } = validateMealPlanData(mealPlanData?.data);

  const handleAddMealSlot = (title, onSuccessCb) => {
    addNewMealSlot(
      { plan_id: mealPlanId, day_number: activeStep, title },
      {
        onSuccess: () => {
          onSuccessCb?.();
        },
      }
    );
  };

  const handleNext = () => {
    const days = localPlanData?.days || [];
    const currentDay = days.find((d) => d.day_number === activeStep);

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

  const handleDeleteFood = async (item) => {
    try {
      deleteFood(item?.id);
      refetch();
    } catch (err) {
      console.error("Error deleting food:", err);
    }
  };

  const dietPlan = {
    title: "6 Smoothie Meal Plan",
    description: "Keto-Protein Focused",
    duration: 7,
  };



  const handleAddFoodClick = (mealId) => {
    setIsAddFoodOpen(true);
    setMealSlotId(mealId);
  };

  const handleOpenSwapDialog = (slotId, foodId, foodName) => {
    setIsSwapFoodOpen(true);
    setMealSlotsId(slotId);
    setOldFoodName(foodName);
  };

  const handleSwapFoodClick = (item) => {
    setSwapFoodName(item.name);
    setSwapDialogOpen(true);
    setFoodIdToReplace(item.id);
  };

  const dayNutrition = dayTotalNutrition(localPlanData?.days, activeStep);

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

  const handleMealPlanComplete = () => {
    mealPlanComplete(
      { params: { plan_id: mealPlanId } },
      {
        onSuccess: () => {
          router.push(Routes.customerplanrequesttotrainer);
        },
      }
    );
  };

  const handleTempPlanSave = (isDraft = false) => {
    tempPlan({
      plan_id: mealPlanId,
      template_id: templateIdFromQuery,
      is_draft: isDraft,
    });
  };

  const handleTempPlanSelectAndEdit = (isDraft = false) => {
    return new Promise((resolve) => {
      tempPlan(
        {
          plan_id: mealPlanId,
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
    if (!day || !Array.isArray(day.slots)) {
      return { valid: false, reason: "invalid_structure" };
    }

    if (day.slots.length === 0) {
      return { valid: false, reason: "no_slots" };
    }

    for (const slot of day.slots) {
      if (!Array.isArray(slot.foods) || slot.foods.length === 0) {
        return { valid: false, reason: "empty_slot_foods" };
      }

      const hasInvalidFood = slot.foods.some(
        (food) =>
          !food?.food_serving_id ||
          !food?.unit ||
          food?.integral === null ||
          food?.integral === undefined
      );

      if (hasInvalidFood) {
        return { valid: false, reason: "incomplete_servings" };
      }
    }

    return { valid: true };
  };

  const goBack = () => {
    router.back();
  };
  if (isTrainerCustomerDetailsError) {
    showSnackbar(trainerCustomerDetailsError?.message, "error");
    goBack();
  }
  if (isTempPlanSavePending || isMealPlanCompleteLoading)
    return <CommonLoader />;

  return (
    <>
      <div className="flex flex-col h-full">
        <Stack direction={"row"} spacing={0.5}>
          <IconButton onClick={goBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography fontSize={"24px"} fontWeight={700}>
            Customer: {trainerCustomerDetailsData?.data?.customer?.full_name}
          </Typography>
        </Stack>
        <div className="m-4 h-full bg-white rounded-2xl shadow-md p-4 flex-1 overflow-auto">
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
                  {localPlanData?.number_of_days} Days
                </div>
              </div>

              <div>
                {localPlanData?.is_draft && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                    Draft
                  </span>
                )}

                {localPlanData?.is_draft === true && (
                  <Tooltip
                    title={
                      !isValid
                        ? "Please complete the plan before submitting"
                        : ""
                    }
                    disableHoverListener={isValid}
                    arrow
                  >
                    {/* Tooltip doesn't work directly on disabled buttons, so wrap in span */}
                    <span>
                      <Button
                        variant="contained"
                        size="medium"
                        onClick={handleMealPlanComplete}
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

          <div
            className={`grid gap-4 ${
              isTemplate && !isEditMode ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <MealCardGrid
              loadingGrid={isMealGridLoading}
              loadingSlot={isMealSlotAddPending || isMealSlotEditPending}
              loadingDelete={isSlotLoadingDelete}
              meals={visibleMealSlots}
              mealPlanSlots={
                localPlanData?.days?.find(
                  (day) => day.day_number === activeStep
                )?.slots || []
              }
             onSwapFood={handleOpenSwapDialog}
              onAddFoodClick={handleAddFoodClick}
              onDeleteFood={handleDeleteFood}
              onAddMealSlot={handleAddMealSlot}
              onEditMealSlot={handleEditMealSlot}
              onDeleteMealSlot={handleDeleteMealSlot}
              isEditMode={isEditMode}
              isTemplate={isTemplate}
              dayNutrition={dayNutrition}
            />
          </div>
          {isTemplate && (
            <div className="w-full flex justify-center gap-4 bg-white sticky bottom-0 z-10">
              <button
                onClick={async () => {
                  setIsTemplate(false);
                  await handleTempPlanSave(false);
                }}
                className="px-6 py-2 rounded-md bg-green-300 text-gray-800 hover:bg-gray-200 transition"
              >
                Save As it Is
              </button>
              <button
                onClick={async () => {
                  setIsMealGridLoading(true);
                  setIsTemplate(false);
                  setIsEditMode(true);
                  await handleTempPlanSelectAndEdit(true);
                  setIsMealGridLoading(false);
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
          isTemplate={isTemplate}
        />
      </div>

       <SwapFood
        onSwapFoodClick={handleSwapFoodClick}
        openSwapDialog={handleOpenSwapDialog}
        onSwapFood={handleSwapFood}
        isSwapOpen={isSwapFoodOpen}
        setIsSwapOpen={setIsSwapFoodOpen}
        mealPlanData={mealPlanData?.data}
        activeDay={activeStep}
        mealSlotId={mealSlotId}
        foodIdToReplace={foodIdToReplace}
        setFoodIdToReplace={setFoodIdToReplace}
        // onComplete={handleSwapFoodComplete}
        isTemplate={isTemplate}
      />

      <Dialog
        open={swapDialogOpen}
        onClose={() => setSwapDialogOpen(false)}
        PaperProps={{
          sx: {
            maxWidth: 360,
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            p: 0,
          },
        }}
      >
        {/* Header */}
        <DialogTitle
          sx={{
            px: 2,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          Swap Food
        </DialogTitle>

        {/* Content */}
        <DialogContent sx={{ p: 2 }}>
          <p className="text-sm text-gray-700">
            Do you want to swap <b>{oldFoodName}</b> with <b>{swapFoodName}</b>?
          </p>

          <div className="mt-3">
            <label className="block text-xs text-gray-500 mb-1">
              Apply To:
            </label>
            <CustomSelectController
              control={control}
              name="apply_to"
              value={appliedTo}
              onChange={(val) => setAppliedTo(val)}
              options={[
                { value: "meal", label: "This Meal Only" },
                { value: "entire_plan", label: "Entire Plan" },
              ]}
              renderValueLabel="Select..."
              size="small"
              sx={{
                fontSize: "0.8rem",
                borderRadius: "8px",
                "& .MuiSelect-select": {
                  py: 0.75,
                  px: 1.25,
                },
              }}
            />
          </div>
        </DialogContent>

        {/* Actions */}
        <DialogActions
          sx={{
            px: 2,
            py: 1.5,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button
            onClick={() => setSwapDialogOpen(false)}
            size="small"
            variant="outlined"
            color="inherit"
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSwapFood}
            size="small"
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Page;
