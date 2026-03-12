"use client"; // If using Next.js App Router

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import CustomAutoComplete from "../../../../component/CommonComponents/CustomAutoComplete";
import CustomSelectController from "../../../../component/CommonComponents/CustomSelectController";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import {
  useGetAllTemplatePlans,
  useGetMealCategories,
} from "@/helpers/hooks/mamAdmin/mealCategoriesList";
import CustomTextField from "@/component/CommonComponents/CustomTextField";
import { ErrorMessage } from "@hookform/error-message";
import { useCreateMealPlan } from "@/helpers/hooks/mamAdmin/mamAdmin";
import { Routes } from "@/config/routes";
import CommonLoader from "@/component/CommonLoader";
import { useGetusercustomerbysuperadmin } from "@/helpers/hooks/customer/getusercustomerbysuperadmin";
import { getCaloriesRange } from "@/utils/utils";
import { Button, IconButton, InputAdornment, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import { useGetSystemGeneratedRecommendation } from "@/helpers/hooks/template/getsystemgeneratedrecommendation";

export default function CreateMealPlanPage() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    formState: { isValid, errors },
  } = useForm({
    defaultValues: {
      plan_name: "",
      number_of_days: 7,
      meals_per_day: "", 
      category_id: "",
      calories_per_day: "",
      macro_profiles: "",
    },
    mode:"onChange",
  });

  const staticCalorieOptions = [
    { label: "1200 – 1499", value: "1200-1499" },
    { label: "1500 – 1799", value: "1500-1799" },
    { label: "1800 – 1999", value: "1800-1999" },
    { label: "2000 – 2299", value: "2000-2299" },
    { label: "2300 – 2499", value: "2300-2499" },
    { label: "2500 – 2999", value: "2500-2999" },
    { label: "3000 – 3500", value: "3000-3500" },
  ];

  const params = useParams();
  const customerID = params?.customerId;
  const customerId = customerID;
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templatePlanId, setTemplatePlanId] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(7);
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [snacksPerDay, setSnacksPerDay] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minCalories, setMinCalories] = useState(null);
  const [maxCalories, setMaxCalories] = useState(null);
  const [macroProfiles, setMacroProfiles] = useState("");
  const [caloriesPerDay, setCaloriesPerDay] = useState("");
  const [clonedTemplateData, setLittleTemplateData] = useState(null);
  const [calorieOptions, setCalorieOptions] = useState([]);
  const [isCustomizeEnabled, setIsCustomizeEnabled] = useState(false);
  const { mutate: createMealPlan, isPending: isPlanCreating } =
    useCreateMealPlan();

  const role = getLocalStorageItem("role");
  const {
    data: categories = [],
    isLoading: isFetchingCategories,
    isError: isCategoryError,
    error: categoryError,
    refetch: refetchCategories,
  } = useGetMealCategories();

  const {
    data: usercustomerdata,
    isFetching: isFetchingusercustomerdata,
    refetch: refetchusercustomerdata,
  } = useGetusercustomerbysuperadmin(customerId);


  const AverageActivityLevel = usercustomerdata?.data.average_activity_level;
  const FitnessGoal = usercustomerdata?.data.fitness_goals;

  const meals_eaten_perday = usercustomerdata?.data.meals_eaten_per_day;

  useEffect(() => {
    if (meals_eaten_perday) {
      setValue("meals_per_day", meals_eaten_perday);
      setMealsPerDay(meals_eaten_perday);
    }
  }, [meals_eaten_perday, setValue]);

  const { data: templatePlansAllData, refetch: refetchTemplates } =
    useGetAllTemplatePlans({
      searchText: search,
      numberOfDays,
      mealsPerDay,
      categoryId,
      minCalories,
      maxCalories,
      mealsPerDay,
      macroProfiles,
    });

  useEffect(() => {
    refetchTemplates();
  }, [
    search,
    numberOfDays,
    mealsPerDay,
    categoryId,
    minCalories,
    maxCalories,
    mealsPerDay,
    macroProfiles,
  ]);
  const tempPlansAllData = templatePlansAllData || [];

  const {
    data: systemgeneratedRecommendation,
    isFetching: isFetchingsystemgeneratedRecommendation,
    refetch: refetchsystemgeneratedRecommendation,
  } = useGetSystemGeneratedRecommendation({
    // user_id: customerId,
    // max_calories: 5000,
    // min_calories: 10,
    max_calories: maxCalories,
    min_calories: minCalories,
  });

  useEffect(() => {
    if (AverageActivityLevel && FitnessGoal != null) {
      const dynamic = getCaloriesRange(AverageActivityLevel, FitnessGoal);
      const merged = [...dynamic, ...staticCalorieOptions];
      setCalorieOptions(merged);

      // Auto-select the recommended one
      const recommendedValue = dynamic[0].value;
      setValue("calories_per_day", recommendedValue);

      // ✅ Manually call handleCaloriesChange to trigger refetch
      handleCaloriesChange(recommendedValue);
    } else {
      setCalorieOptions(staticCalorieOptions);
    }
  }, [AverageActivityLevel, FitnessGoal]);

  useEffect(() => {
    if (selectedTemplate) {
      // Set number of days
      setValue("number_of_days", selectedTemplate.number_of_days ?? "", {
        shouldValidate: true,
      });

      // Set categories from template_category_maps
      const extractedCategories =
        selectedTemplate.template_category_maps?.map(
          (map) => map.meal_plan_category.id
        ) || [];

      setValue("category_ids", extractedCategories, { shouldValidate: true });
      setSelectedCategories(extractedCategories);
    }
  }, [selectedTemplate, setValue]);

  // Watch selectedCategories after it updates
  useEffect(() => {
  }, [selectedCategories]);




  const onSubmit = (formData) => {
    createMealPlan({
      formData,
      // isTemplateCreation,
      // customerTrainerId,
      templatePlanId,
      clonedTemplateData,
      //   customerAdminId,
      customerId,
    });
  };
  const mutation = useCreateMealPlan();

  const handleCaloriesChange = (value) => {
    setCaloriesPerDay(value);

    if (value && value.includes("-")) {
      const [min, max] = value.split("-").map(Number);
      setMinCalories(min);
      setMaxCalories(max);
    } else {
      setMinCalories(null);
      setMaxCalories(null);
    }
  };

  
  const nutrition = {
    calories: systemgeneratedRecommendation?.data?.total_calories ?? 0,
    carbs: systemgeneratedRecommendation?.data?.total_carbs ?? 0,
    protein: systemgeneratedRecommendation?.data?.total_protein ?? 0,
    fat: systemgeneratedRecommendation?.data?.total_fat ?? 0,
    fluid: systemgeneratedRecommendation?.data?.total_fluid ?? "0 fl oz",
  };

  if (isPlanCreating) return <CommonLoader />;

  return (
    // <div className="p-3 flex flex-col overflow-auto mx-auto">
    <div className="flex flex-col w-full h-full p-4">
      <div className=" flex-1 overflow-auto flex flex-col gap-2 justify-center border p-3 rounded-md bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()} // or use a custom handler
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold">Create Meal Plan</h1>
          </div>
        </div>
        <div className="flex flex-col flex-1 max-w-4xl w-full mx-auto items-center justify-center border p-2 rounded-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 overflow-auto w-full"
          >
            <div className="flex flex-col items-center mb-2">
              <button
                type="button"
                // onClick={() => router.push(Routes.createDietPlanFromScratch)}
                onClick={() =>
                  router.push(
                    `${Routes.customerPlanByTrainer}${customerID}${Routes.planfromScratch}`
                  )
                }
                className="bg-[#16a34a] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Create From Scratch
              </button>

              <span className="text-sm text-gray-600 mt-2 text-center">
                Create a plan meal by meal
              </span>
              <span className="text-sm text-gray-600 text-center">or</span>
              <span className="text-sm text-gray-600 text-center">
                Select from Template and Modify
              </span>
            </div>

           

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label block mb-1">
                  Name Your Plan*
                </label>
                <Controller
                  name="plan_name"
                  control={control}
                  rules={{ required: "Plan Name is Required" }}
                  render={({ field }) => (
                    <CustomTextField {...field} placeholder="Enter Plan Name" />
                  )}
                />
                <ErrorMessage
                  errors={errors}
                  name="plan_name"
                  render={({ message }) => (
                    <p className="text-red-500 text-sm mb-2">{message}</p>
                  )}
                />
              </div>

              <div>
                <label className="input-label block ml-1 mb-1">
                  Number Of Day*
                </label>
                <CustomSelectController
                  name="number_of_days"
                  control={control}
                  rules={{ required: "This field is required" }}
                  disabled={!!selectedTemplate}
                  selectedTemplate={selectedTemplate}
                  onChange={setNumberOfDays}
                  renderValueLabel="Select Duration"
                  options={[
                    { label: "7 Days", value: 7 },
                    { label: "14 Days", value: 14 },
                    { label: "21 Days", value: 21 },
                    { label: "28 Days", value: 28 },
                  ]}
                />
              </div>
            </div>

            <div className="bg-gray-100 p-2">
              <label className="input-label block mb-3">
                Meal Plan Profile:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4">
                <div
                  className={`${
                    !isCustomizeEnabled ? "pointer-events-none opacity-80" : ""
                  }`}
                >
                  <label className="input-label block ml-1 mb-1">
                    Meals Per Day
                  </label>
                  <CustomSelectController
                    name="meals_per_day"
                    control={control}
                    onChange={setMealsPerDay}
                    renderValueLabel="Select Meals"
                    options={Array.from({ length: 10 }, (_, i) => ({
                      label: `${i + 1}`,
                      value: i + 1,
                    }))}
                    disabled={!isCustomizeEnabled}
                  />
                </div>

             



<div
  className={`${
    !isCustomizeEnabled ? "pointer-events-none opacity-80" : ""
  } col-span-2`} // 👈 makes Category field take 2 grid columns
>
  <label className="input-label block ml-1 mb-1">
    Category
  </label>
  <CustomAutoComplete
    multiple
    disableCloseOnSelect
    className="w-full" // 👈 ensures it stretches inside its container
    options={[
      { id: "all", name: "All" },
      ...(categories || []),
    ]}
    getOptionLabel={(option) => option?.name || ""}
    isOptionEqualToValue={(option, value) => option?.id === value?.id}
    loading={isFetchingCategories}
    value={
      selectedCategory ??
      (usercustomerdata?.data?.meal_plan_preferences?.length
        ? categories?.filter((cat) =>
            usercustomerdata.data.meal_plan_preferences.some(
              (pref) => pref.meal_plan_category.id === cat.id
            )
          )
        : [{ id: "all", name: "All" }])
    }
    onChange={(e, newValue) => {
      setSelectedCategory(newValue);

      if (newValue.some((item) => item.id === "all")) {
        setValue("category_id", "", { shouldValidate: true });
        setCategoryId("");
      } else {
        const selectedIds = newValue.map((item) => item.id);
        setValue("category_id", selectedIds, { shouldValidate: true });
        setCategoryId(selectedIds);
      }
    }}
    renderOption={(props, option) => {
      const { key, ...rest } = props;
      return (
        <li key={option.id || option.name} {...rest}>
          {option.name}
        </li>
      );
    }}
    disabled={!isCustomizeEnabled}
  />
</div>

                <div
                  className={`${
                    !isCustomizeEnabled ? "pointer-events-none opacity-80" : ""
                  }`}
                >
                  <label className="input-label block ml-1 mb-1">
                    Calories Per Day
                  </label>
                  <CustomSelectController
                    name="calories_per_day"
                    control={control}
                    onChange={handleCaloriesChange}
                    renderValueLabel="Select Calories"
                    options={staticCalorieOptions}
                    disabled={!isCustomizeEnabled}
                  />
                </div>

              

                <div className="flex items-center justify-left p-1 my-auto mt-6">
                  <Tooltip
                    title={isCustomizeEnabled ? "Save Changes" : "Customize"}
                  >
                    <IconButton
                      onClick={() => {
                        if (isCustomizeEnabled) {
                          setIsCustomizeEnabled(false);
                        } else {
                          setIsCustomizeEnabled(true);
                        }
                      }}
                      color="primary"
                      size="small"
                      
                    >
                      {isCustomizeEnabled ? <SaveIcon /> : <EditIcon />}
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="font-semibold mb-2">
                System Generated Nutrition Recommendations
              </h2>
              <div className="bg-gray-100 px-4 py-2 rounded">
                {nutrition.calories > 0 ||
                nutrition.carbs > 0 ||
                nutrition.protein > 0 ||
                nutrition.fat > 0 ||
                (nutrition.fluid && nutrition.fluid !== "0 fl oz") ? (
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-800">
                    {nutrition.calories > 0 && (
                      <span>
                        Calories:{" "}
                        <span className="font-bold ">
                          {nutrition.calories} kcal
                        </span>{" "}
                      </span>
                    )}
                    {nutrition.carbs > 0 && (
                      <span>
                        Carbs:{" "}
                        <span className="font-bold ">{nutrition.carbs} g</span>
                      </span>
                    )}
                    {nutrition.protein > 0 && (
                      <span>
                        Protein:{" "}
                        <span className="font-bold ">
                          {nutrition.protein} g
                        </span>
                      </span>
                    )}
                    {nutrition.fat > 0 && (
                      <span>
                        Fat:{" "}
                        <span className="font-bold ">{nutrition.fat} g</span>
                      </span>
                    )}
                    {nutrition.fluid && nutrition.fluid !== "0 fl oz" && (
                      <span>
                        Fluid:{" "}
                        <span className="font-bold ">{nutrition.fluid} ml</span>
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-red-500">
                    No matching nutrition recommendation plan was found based on
                    the provided data. Please review and adjust the filters
                    above to refine your results.
                  </p>
                )}
              </div>

            
            </div>

           

            <label className="input-label block mb-1">Search Meal Plan</label>
            <div className="relative">
              <CustomTextField
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Meal Plans"
                InputProps={{
                  endAdornment: selectedTemplate ? (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setSearch("");
                          setSelectedTemplate(null);
                          setValue("number_of_days", "");
                          setTemplatePlanId(null);
                        }}
                        size="small"
                        edge="end"
                        sx={{ color: "gray", "&:hover": { color: "#ef4444" } }} // hover:text-red-500
                      >
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
            </div>

            {/* Templates */}
            <ul className="border rounded-md max-h-64 overflow-y-auto divide-y">
              {(tempPlansAllData || [])
                .filter((plan) =>
                  `${plan.name}`.toLowerCase().includes(search.toLowerCase())
                )
                .map((plan) => (
                  <li
                    key={plan.id}
                    onClick={() => {
                      setSelectedTemplate(plan);
                      setValue("template_ids", plan.id);
                      setSearch(plan.name);
                      setTemplatePlanId(plan.id);
                    }}
                    className={`px-3 py-2 cursor-pointer border-l-2 text-sm ${
                      selectedTemplate?.id === plan.id
                        ? "bg-green-50 border-green-500"
                        : "bg-white border-transparent"
                    } hover:bg-green-100`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span>{plan.name}</span>
                        <span className="text-gray-400">|</span>
                        <span>{plan.number_of_days} Days</span>
                      </div>
                      {plan.user?.full_name && (
                        <div className="text-xs text-gray-500 italic">
                          Created by: {plan.user.full_name} ({plan.user.role})
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 flex flex-wrap gap-4 mt-1">
                      <span>
                        <strong>Calories:</strong>{" "}
                        {Number(plan.total_calories).toFixed(2)}
                      </span>
                      <span>
                        <strong>Carbs:</strong>{" "}
                        {Number(plan.total_carbs).toFixed(2)}g
                      </span>
                      <span>
                        <strong>Protein:</strong>{" "}
                        {Number(plan.total_protein).toFixed(2)}g
                      </span>
                      <span>
                        <strong>Fat:</strong>{" "}
                        {Number(plan.total_fat).toFixed(2)}g
                      </span>
                      {plan.total_fluid && (
                        <span>
                          <strong>Fluid:</strong>{" "}
                          {Number(plan.total_fluid).toFixed(2)}ml
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              {(tempPlansAllData || []).filter((plan) =>
                `${plan.name}`.toLowerCase().includes(search.toLowerCase())
              ).length === 0 && (
                <li className="p-2 text-center text-sm text-gray-500">
                  No matching templates found.
                </li>
              )}
            </ul>

            <div className="flex flex-col items-center">
              <button
                type="submit"
                className="p-3 rounded-lg text-white text-sm font-medium transition-colors duration-200 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!selectedTemplate || isPlanCreating} // 👈 add !isValid
              >
                {isPlanCreating ? (
                  <CircularProgress sx={{ color: "white" }} size={19} />
                ) : (
                  "Create Meal Plan Using Template"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
