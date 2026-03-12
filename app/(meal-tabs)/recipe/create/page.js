"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
// import CustomAutoComplete from "../../../component/CommonComponents/CustomAutoComplete";
// import CustomSelectController from "../../../component/CommonComponents/CustomSelectController";
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
import {
  useCreateRecipe,
  useCreateRecipeFromTemplate,
  useFetchFoodCategories,
  useGetFoodAllList,
  useGetFoodAllRecipe,
  useGetRecipeList,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import { IconButton, InputAdornment } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomAutoComplete from "@/component/CommonComponents/CustomAutoComplete";

export default function CreateRecipePage() {
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

      food_category_ids: [],
    },
  });

  const router = useRouter();
  const [page, setPage] = useState(0);
  const [type, setType] = useState("recipe");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeStatus, setActiveStatus] = useState(null);

  const [isTemplateRecipe, setIsTemplateRecipe] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [search, setSearch] = useState("");
  const filtercategoryID = selectedCategory?.id;
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateRecipeId, setTemplateRecipeId] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(7);
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [snacksPerDay, setSnacksPerDay] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minCalories, setMinCalories] = useState(null);
  const [maxCalories, setMaxCalories] = useState(null);
  const [macroProfiles, setMacroProfiles] = useState("");
  const [caloriesPerDay, setCaloriesPerDay] = useState("");
  const [clonedTemplateData, setLittleTemplateData] = useState(null);
  const { mutate: createRecipeFromTemp, isPending: isRecipeCreating } =
    useCreateRecipeFromTemplate();

  const role = getLocalStorageItem("role");
  const {
    data: categories = [],
    isLoading: isFetchingCategories,
    refetch: refetchCategories,
  } = useFetchFoodCategories(type);

  const {
    data: templateRecipesAllData,
    isFetching,
    refetch: refetchRecipeList,
  } = useGetRecipeList(search, filtercategoryID);

  useEffect(() => {
    refetchRecipeList();
  }, [search, filtercategoryID]);

  const tempRecipeData = templateRecipesAllData?.data || [];

  useEffect(() => {
    if (selectedTemplate) {
      setValue("name", selectedTemplate.name);
      // Set categories from template_category_maps
      const extractedCategories =
        selectedTemplate.food_category_maps?.map(
          (map) => map.food_category?.id
        ) || [];
      setValue("food_category_ids", extractedCategories, {
        shouldValidate: true,
      });
      setSelectedCategories(extractedCategories);
    }
  }, [selectedTemplate]);

  const onSubmit = (formData) => {
    const food_category_ids = selectedCategories;

    const payload = {
      name: formData.name,
      food_category_ids,
    };
    createRecipeFromTemp({ payload, isTemplateRecipe, templateRecipeId });
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

  const handleTemplateClick = (recipe) => {
    setSelectedTemplate(recipe);
    setValue("recipe_ids", recipe.id);
    setSearch(recipe.name);
    setTemplateRecipeId(recipe.id);
    setIsTemplateRecipe(true);
    localStorage.setItem("selected_recipe_id", recipe.id);
    router.push(Routes.recipeview); // assuming Routes.vewirecipe = "/recipe/edit-recipe"
  };

  if (isRecipeCreating) return <CommonLoader />;
  return (
    // <div className="p-3 flex flex-col overflow-auto mx-auto">
    <div className="flex-1 h-full overflow-auto p-4">
      <div className="flex flex-col gap-2 overflow-auto justify-center border p-3 rounded-md bg-white">
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
        <div className="flex flex-col flex-1 max-w-4xl w-full mx-auto items-center justify-center border p-2 rounded-md">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 overflow-auto w-full"
          >
            <div className="flex flex-col items-center mb-6">
              <button
                type="button"
                onClick={() => router.push(Routes.createRecipeFromScratch)}
                className="bg-[#16a34a] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Create From Scratch
              </button>

              <span className="text-sm text-gray-600 mt-2 text-center">
                Create a recipe step by step
              </span>
              <span className="text-sm text-gray-600 text-center">or</span>
              <span className="text-sm text-gray-600 text-center">
                Select & Customize Recipe
              </span>
            </div>

            {/* Search */}
            <label className="input-label block mb-1">Select Recipe</label>
            <div className="flex gap-4 items-end">
              {/* Search using CustomTextField */}

              <div className="relative w-1/2">
                <CustomTextField
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Recipe"
                  InputProps={{
                    endAdornment: search ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setSearch("");
                            setSelectedTemplate(null);
                            setValue("number_of_days", "");
                            setTemplateRecipeId(null);
                            setSelectedCategory(null);
                          }}
                          size="small"
                          edge="end"
                          sx={{
                            color: "gray",
                            "&:hover": { color: "#ef4444" },
                            padding: "4px",
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : null,
                  }}
                />
              </div>

              {/* Category Autocomplete */}
              <div className="w-1/2">
                <CustomAutoComplete
                  options={categories || []}
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option?.name || ""
                  }
                  isOptionEqualToValue={(option, value) =>
                    option?.id === value?.id
                  }
                  loading={isFetchingCategories}
                  value={selectedCategory ?? null}
                  onChange={(e, newValue) => {
                    setSelectedCategory(newValue ?? null);
                    setValue("category_id", newValue?.id ?? "", {
                      shouldValidate: true,
                    });
                    setCategoryId(newValue?.id ?? "");
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.name}
                    </li>
                  )}
                  // disableClearable={false}
                />
              </div>
            </div>

            {/* Templates */}
            <ul className="border rounded-md max-h-64 overflow-y-auto divide-y">
              {(tempRecipeData || [])
                .filter((recipe) =>
                  `${recipe.name}`.toLowerCase().includes(search.toLowerCase())
                )
                .map((recipe) => (
                  <li
                    key={recipe.id}
                    onClick={() => handleTemplateClick(recipe)}
                    className={`px-3 py-2 cursor-pointer border-l-2 text-sm ${
                      selectedTemplate?.id === recipe.id
                        ? "bg-green-50 border-green-500"
                        : "bg-white border-transparent"
                    } hover:bg-green-100`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span>{recipe.name}</span>
                      </div>
                      {recipe.user?.full_name && (
                        <div className="text-xs text-gray-500 italic">
                          Created by: {recipe.user.full_name} (
                          {recipe.user.role})
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 flex flex-wrap gap-4 mt-1">
                      <span>
                        <strong>Calories:</strong>{" "}
                        {Number(recipe.total_calories).toFixed(2)}
                      </span>
                      <span>
                        <strong>Carbs:</strong>{" "}
                        {Number(recipe.total_carbs).toFixed(2)}g
                      </span>
                      <span>
                        <strong>Protein:</strong>{" "}
                        {Number(recipe.total_protein).toFixed(2)}g
                      </span>
                      <span>
                        <strong>Fat:</strong>{" "}
                        {Number(recipe.total_fat).toFixed(2)}g
                      </span>
                      <span>
                        <strong>Fluid:</strong>{" "}
                        {Number(recipe.total_fluid).toFixed(2)}ml
                      </span>
                    </div>
                  </li>
                ))}
              {(tempRecipeData || []).filter((recipe) =>
                `${recipe.name}`.toLowerCase().includes(search.toLowerCase())
              ).length === 0 && (
                <li className="p-2 text-center text-sm text-gray-500">
                  No matching templates found.
                </li>
              )}
            </ul>
          </form>
        </div>
      </div>
    </div>
  );
}
