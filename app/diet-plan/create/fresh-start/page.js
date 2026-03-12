"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import CommonLoader from "@/component/CommonLoader";
import { border } from "@mui/system";
import { Box } from "@mui/material";

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

  //   const isTemplateCreation = true;
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
    <div className="flex-1 flex flex-col h-full overflow-auto p-4">
      <div className="bg-white border rounded-md p-3 flex-1">
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
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 max-w-3xl mx-auto w-full border p-4 rounded-md border-gray-300"
        >
          <h1 className="text-2xl font-bold text-center text-[#16a34a]">
            Create Meal Plan
          </h1>
          {/* <hr className="border-gray-300" /> */}
          <div className="grid grid-cols-1 gap-1">
            {/* Plan Name */}
            <div className="col-span-2">
              <label className="input-label block mb-1">Name Your Plan*</label>
              <Controller
                name="plan_name"
                control={control}
                rules={{ required: "This field is required" }}
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

            {/* Category */}
            <div className="col-span-2">
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
                  setSelectedCategory(newValue);
                  setValue("category_ids", newValue, { shouldValidate: true });
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

            <div className="col-span-2">
              <div className="grid grid-cols-3 gap-4">
                {/* Number of Days */}
                <div className="mt-6">
                  <label className="input-label block mb-1">
                    Number of Days*
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

                {/* Meal Settings Group (Meals + Snacks) */}
                <div className="col-span-2">
                  <p className="ml-1 text-green-700 mb-1 text-sm">
                    Choose how many slots you&apos;d like to add per day?
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Meals Per Day */}
                    <div>
                      <label className="input-label block mb-1">
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
                        sx={{
                          // border:
                          //   mealsPerDay === 0
                          //     ? "1px solid #16A34A"
                          //     : "1px solid #16A34A",
                          border: "1px solid #16A34A",
                          boxShadow: "0 0 12px rgba(22, 163, 74, 0.4)",
                        }}
                      />
                    </div>

                    {/* Snacks Per Day */}
                    <div>
                      <label className="input-label block mb-1">
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
                </div>
              </div>
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
