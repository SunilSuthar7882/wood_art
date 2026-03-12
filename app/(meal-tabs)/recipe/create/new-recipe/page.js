"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
// import CustomAutoComplete from "../../../../component/CommonComponents/CustomAutoComplete";
// import CustomSelectController from "../../../../component/CommonComponents/CustomSelectController";
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
import {
  useCreateRecipe,
  useFetchFoodCategories,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import CustomAutoComplete from "@/component/CommonComponents/CustomAutoComplete";

export default function RecipeFromScratch() {
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
      name: "",
      category_ids_1: "",
      category_ids_2: "",
      category_ids_3: "",
      food_category_ids: [],
    },
    mode: "onChange",
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
  const [selectedCategory1, setSelectedCategory1] = useState([]);
  const [selectedCategory2, setSelectedCategory2] = useState(null);
  const [selectedCategory3, setSelectedCategory3] = useState(null);
  const { mutate: createRecipe, isPending: isRecipeCreating } =
    useCreateRecipe();

  //   const isTemplateCreation = true;
  const role = getLocalStorageItem("role");
const type = "recipe";
  const {
    data: categories = [],
    isLoading: isFetchingCategories,
    refetch: refetchCategories,
  } = useFetchFoodCategories(type);

  const onSubmit = (data) => {
    // const food_category_ids = [
    //   selectedCategory1,
    //   selectedCategory2,
    //   selectedCategory3,
    // ]
    //   .filter((item) => !!item?.id)
    //   .map((item) => item.id)
    //   .filter((id, index, self) => self.indexOf(id) === index);
   const food_category_ids = selectedCategory1.map((cat) => cat.id);

    const payload = {
      name: data.name,
      food_category_ids,
      // servings,
      // other fields you may need
    };

    createRecipe(payload);
  };
console.log("selectedCategory1",selectedCategory1);
  // const mutation = useCreateMealPlan();

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

  // console.log(categories);

  // useEffect(() => {
  //   // Run only when categories are loaded
  //   if (categories.length > 0) {
  //     const defaultCategory = categories.find((cat) => cat.id === 1); // use your actual default ID here
  //     console.log("defaultCategory", defaultCategory);
  //     // Set default only if no category is selected yet
  //     if (defaultCategory && !selectedCategory1 && !selectedCategory2 && !selectedCategory3) {
  //       setSelectedCategory1(defaultCategory);
  //       setSelectedCategory2(defaultCategory);
  //       setSelectedCategory3(defaultCategory);
  //       setValue("category_ids_1", defaultCategory, { shouldValidate: true });
  //       setValue("category_ids_2", defaultCategory, { shouldValidate: true });
  //       setValue("category_ids_3", defaultCategory, { shouldValidate: true });
  //     }
  //   }
  // }, [categories]); // ✅ remove selectedCategory1 from deps
  // console.log("selectedCategory1", selectedCategory1);
  // console.log("selectedCategory2", selectedCategory2);

  const categoryIds = watch("category_ids") || [];

  // const isFormValid =
  //   !!watch("name") ;

  // 👇 Watch all required fields
  const name = watch("name");
  const category1 = watch("category_ids_1");
  const category2 = watch("category_ids_2");
  const category3 = watch("category_ids_3");

  // 👇 Check if form is valid
  const isFormValid = name?.trim() && !isRecipeCreating;

  if (isRecipeCreating) return <CommonLoader />;

  return (
    <div className="flex flex-col flex-1 h-full overflow-auto">
      <div className="bg-white border rounded-md p-3 flex flex-1 flex-col">
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
            <h1 className="text-2xl font-bold">Create Recipe</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div className="flex flex-col gap-4 max-w-xl w-full mx-auto">
            {/* Name Field */}
            <div>
              <label className="input-label block mb-1">
                Name Your Recipe*
              </label>
              <Controller
                name="name"
                control={control}
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <CustomTextField {...field} placeholder="Enter Recipe Name" />
                )}
              />
              <ErrorMessage
                errors={errors}
                name="name"
                render={({ message }) => (
                  <p className="text-red-500 text-sm mb-2">{message}</p>
                )}
              />
            </div>

            {/* Category 1 */}
            {/* <div>
              <label className="input-label block mb-1">Select Category*</label>
              <Controller
                name="category_ids_1"
                control={control}
                rules={{ required: "Category 1 is required" }}
                render={({ field }) => (
                  <CustomAutoComplete
                    {...field}
                    options={(categories || []).filter(
                      (cat) =>
                        cat?.id !== selectedCategory2?.id &&
                        cat?.id !== selectedCategory3?.id
                    )}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option?.name || ""
                    }
                    isOptionEqualToValue={(option, value) =>
                      option?.id === value?.id
                    }
                    loading={isFetchingCategories}
                    // value={selectedCategory1 ?? null}
                    value={field.value ?? null} // ✅ use field.value from RHF
                    onChange={(e, newValue) => {
                      setSelectedCategory1(newValue); // optional, for local state
                      field.onChange(newValue); // ✅ update form value
                    }}
                    // onChange={(e, newValue) => {
                    //   setSelectedCategory1(newValue);
                    //   setValue("category_ids_1", newValue, {
                    //     shouldValidate: true,
                    //   });
                    // }}
                    renderOption={(props, option) => {
                      const { key, ...rest } = props;
                      return (
                        <li key={key} {...rest}>
                          {option.name}
                        </li>
                      );
                    }}
                    // renderInputLabel="Category 1"
                  />
                )}
              />
               <ErrorMessage
                errors={errors}
                name="category_ids_1"
                render={({ message }) => (
                  <p className="text-red-500 text-sm mb-2">{message}</p>
                )}
              />
            </div> */}

            <div>
              <label className="input-label block mb-1">Select Category (You can select multiple categories) *</label>
              <Controller
                name="category_ids_1"
                control={control}
                rules={{ required: "Category  is required" }}
                render={({ field }) => (
                  // <CustomAutoComplete
                  //   {...field}
                  //   multiple
                  //   options={categories}
                  //   getOptionLabel={(option) =>
                  //     typeof option === "string" ? option : option?.name || ""
                  //   }
                  //   isOptionEqualToValue={(option, value) =>
                  //     option?.id === value?.id
                  //   }
                  //   loading={isFetchingCategories}
                  //   value={field.value ?? []} // ✅ default to empty array
                  //   onChange={(e, newValue) => {
                  //     setSelectedCategory1(newValue); // optional
                  //     field.onChange(newValue);
                  //   }}
                  //   renderOption={(props, option) => (
                  //     <li key={option.id} {...props}>
                  //       {option.name}
                  //     </li>
                  //   )}
                  //   renderInput={(params) => (
                  //     <CustomTextField
                  //       {...params}
                  //       placeholder="Select categories"
                  //       size="small"
                  //       fullWidth
                  //       error={!!errors.category_ids_1}
                  //       helperText={errors.category_ids_1?.message}
                  //     />
                  //   )}
                  // />

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
                value={selectedCategory1 ?? []}
                onChange={(e, newValue) => {
                  setSelectedCategory1(newValue);
                  setValue("category_ids_1", newValue, { shouldValidate: true });
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

                )}
              />

              <ErrorMessage
                errors={errors}
                name="category_ids_1"
                render={({ message }) => (
                  <p className="text-red-500 text-sm mb-2">{message}</p>
                )}
              />
            </div>

            {/* Category 2 */}
            {/* <div>
              <label className="input-label block mb-1">Select Category</label>
              <Controller
                name="category_ids_2"
                control={control}
                // rules={{ required: "Category 2 is required" }}
                render={({ field }) => (
                  <CustomAutoComplete
                    {...field}
                    options={(categories || []).filter(
                      (cat) =>
                        cat?.id !== selectedCategory1?.id &&
                        cat?.id !== selectedCategory3?.id
                    )}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option?.name || ""
                    }
                    isOptionEqualToValue={(option, value) =>
                      option?.id === value?.id
                    }
                    loading={isFetchingCategories}
                    value={selectedCategory2 ?? null}
                    onChange={(e, newValue) => {
                      setSelectedCategory2(newValue);
                      setValue("category_ids_2", newValue, {
                        shouldValidate: true,
                      });
                    }}
                    renderOption={(props, option) => {
                      const { key, ...rest } = props;
                      return (
                        <li key={key} {...rest}>
                          {option.name}
                        </li>
                      );
                    }}
                    // renderInputLabel="Category 2"
                  />
                )}
              />
            </div> */}

            {/* Category 3 */}
            {/* <div>
              <label className="input-label block mb-1">Select Category</label>
              <Controller
                name="category_ids_3"
                control={control}
                // rules={{ required: "Category 3 is required" }}
                render={({ field }) => (
                  <CustomAutoComplete
                    {...field}
                    options={(categories || []).filter(
                      (cat) =>
                        cat?.id !== selectedCategory1?.id &&
                        cat?.id !== selectedCategory2?.id
                    )}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option?.name || ""
                    }
                    isOptionEqualToValue={(option, value) =>
                      option?.id === value?.id
                    }
                    loading={isFetchingCategories}
                    value={selectedCategory3 ?? null}
                    onChange={(e, newValue) => {
                      setSelectedCategory3(newValue);
                      setValue("category_ids_3", newValue, {
                        shouldValidate: true,
                      });
                    }}
                    renderOption={(props, option) => {
                      const { key, ...rest } = props;
                      return (
                        <li key={key} {...rest}>
                          {option.name}
                        </li>
                      );
                    }}
                    // renderInputLabel="Category 3"
                  />
                )}
              />
            </div> */}
          </div>

          <div className="flex flex-col justify-center items-center">
            <button
              type="submit"
              className={`p-2 rounded-lg text-white text-sm font-medium transition-colors duration-200 ${
                isFormValid
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isFormValid}
            >
              {isRecipeCreating ? (
                <CircularProgress sx={{ color: "white" }} size={19} />
              ) : (
                "Create Recipe"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
