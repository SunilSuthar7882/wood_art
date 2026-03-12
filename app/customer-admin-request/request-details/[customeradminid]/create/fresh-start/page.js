"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import CustomAutoComplete from "../../../../../../component/CommonComponents/CustomAutoComplete";
import CustomSelectController from "../../../../../../component/CommonComponents/CustomSelectController";
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
import CommonLoader from "@/component/CommonLoader";

export default function DietPlanFromScratch() {
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
      category_ids: [],
      meals_per_day: "",
      snacks_per_day: "",
      // category_id: "",
      //   calories_per_day: "",
      //   macro_profiles: "",
    },
  });
  const { customeradminid } = useParams();
  const customerAdminId = customeradminid;
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
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

  const onSubmit = (formData) => {
    createMealPlan({
      formData,

      customerAdminId,
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

  const categoryIds = watch("category_ids") || [];

  const isFormValid =
    !!watch("plan_name") &&
    !!watch("number_of_days") &&
    Array.isArray(categoryIds) &&
    categoryIds.length > 0;
  if (isPlanCreating) return <CommonLoader />;
  return (
    <div className="flex-1 flex w-full flex-col h-full overflow-auto p-4">
      <div className="bg-white border rounded-md p-3 flex flex-1 flex-col ">
        <div className="flex items-center justify-between mb-6">
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          {/* <hr className="border-gray-300" /> */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label block mb-1">Name Your Plan*</label>
              <Controller
                name="plan_name"
                control={control}
                rules={{ required: "Plan Name is required *" }}
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
            <div>
              <label className="input-label block ml-1 mb-1">Category</label>
              <CustomAutoComplete
                multiple
                disableCloseOnSelect
                options={categories || []}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option?.name || ""
                }
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                loading={isFetchingCategories}
                value={selectedCategory ?? []}
                onChange={(e, newValue) => {
                  setSelectedCategory(newValue); // Full objects [{id, name}]
                  setValue("category_ids", newValue, { shouldValidate: true }); // Save full object list
                }}
                renderOption={(props, option) => {
                  const { key, ...rest } = props;
                  return (
                    <li key={key} {...rest}>
                      {option.name}
                    </li>
                  );
                }}
              />
            </div>
            <div>
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
              />
            </div>
            <div>
              <label className="input-label block ml-1 mb-1">
                Snacks Per Day
              </label>
              <CustomSelectController
                name="snacks_per_day"
                control={control}
                onChange={setSnacksPerDay}
                renderValueLabel="Select Snacks"
                options={Array.from({ length: 6 }, (_, i) => ({
                  label: `${i + 1}`,
                  value: i + 1,
                }))}
              />
            </div>
          </div>

          <div className="flex flex-col justify-center items-center">
            <button
              type="submit"
              className={`p-2 rounded-lg text-white text-sm font-medium transition-colors duration-200 ${
                isFormValid && !isPlanCreating
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isFormValid || isPlanCreating}
            >
              {isPlanCreating ? (
                <CircularProgress sx={{ color: "white" }} size={19} />
              ) : (
                "Create Diet Plan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
