"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
// import backIcon from "../../../public/images/back-arrow.png";
import backIcon from "../../../../public/images/back-arrow.png";
import { UploadIcon, ImageIcon, XCircleIcon, TrashIcon } from "lucide-react";
import {
  TextField,
  Autocomplete,
  MenuItem,
  Button,
  Skeleton,
  IconButton,
  Tooltip,
  Checkbox,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Inbox as InboxIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import {
  useAddFoodServingMutation,
  useCreateRecipe,
  useDeleteServingMutation,
  useEditFoodInfoMutation,
  useEditServingMutation,
  useFetchFoodCategories,
  useFetchServingUnits,
  useGetFoodData,
  useManageFavoriteFood,
  useSaveAndFinishRecipe,
  useSaveAsDraftRecipe,
  useUpdateFoodServingMutation,
  useUpdateRecipeServingMutation,
  useUpdateTemplateFoodServingMutation,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import ConfirmationModal from "@/component/CommonComponents/ConfirmationModal";
import AddServingModal from "@/component/AddServingModal";
import TableDeleteActionButton from "@/component/CommonComponents/TableDeleteActionButton";
import TableEditActionIcon from "@/component/CommonComponents/TableEditActionIcon";
import AddFood from "@/component/Dashboard/ManagePlan/AddFood";
import CustomSelectController from "@/component/CommonComponents/CustomSelectController";
import { Controller, useForm } from "react-hook-form";
import CustomTextField from "@/component/CommonComponents/CustomTextField";
import { ErrorMessage } from "@hookform/error-message";
import AddServingSizeModal from "@/component/AddServingSizeModal";
import CustomAutoComplete from "@/component/CommonComponents/CustomAutoComplete";
import RecipeCard from "@/component/CommonComponents/RecipeCard";
import ManualRecipeForm from "@/component/CommonComponents/ManualRecipeForm";
import { useTabContext } from "@mui/lab";
import AddServingSizeInRecipe from "@/component/CommonComponents/AddServingSizeInRecipe";
import {
  useDeleteFoodByTrainer,
  useDeleteFoodInRecipe,
} from "@/helpers/hooks/customer/customer";
import { calculateTotalNutrition } from "@/utils/utils";
import { Routes } from "@/config/routes";

export default function ReviewRecipe() {
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
      no_of_servings: "",
      ingredients: [],
      instruction: "",
      image: "",
    },
  });
  const {
    mutate: manageFavFood,
    isPending: isManageFavFood,
    error: ManageFavFoodError,
  } = useManageFavoriteFood();
  const [previewImage, setPreviewImage] = useState("");
  const isTemplate = false;
  const [name, setName] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const { mutate: updateRecipeServingSize, isPending: isUpdatingServing } =
    useUpdateRecipeServingMutation();
  const {
    mutate: updateTemplateServing,
    isPending: isUpdatingTemplateServing,
  } = useUpdateTemplateFoodServingMutation();
  const { mutate: deleteFood } = useDeleteFoodInRecipe();
  const [isRecipe, setIsRecipe] = useState(false);
  const router = useRouter();
  const params = useParams();
  const [isRecipeSelected, setIsRecipeSelected] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingServings, setIsEditingServings] = useState({});

  const [recipeId, setRecipeId] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [servings, setServings] = useState([]);
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template_id");
  const id = params?.id;

  useEffect(() => {
    const storedId = localStorage.getItem("selected_recipe_id");
    if (storedId) {
      setRecipeId(storedId);
      setIsRecipeSelected(true);
    }
  }, []);

  const enabled = Boolean(recipeId);

  const {
    data: foodData,
    refetch,
    isPending: isFetchingFoodPending,
  } = useGetFoodData({ food_id: recipeId }, { enabled });

  const {
    data: recipeFoodData,
    refetch: refetchingRecipe,
    isPending: isFetchingRecipeFoodPending,
  } = useGetFoodData(
    { food_id: recipeId },
    {
      enabled: isRecipeSelected,
    }
  );

  const total_foods = foodData?.data?.food_servings;
  const ingredients = foodData?.data?.ingredients;

  const foodServings = foodData?.data?.food_servings;
  const recipe = foodData?.data?.ingredients;
  const { mutate: saveDraftRecipe, isLoading } = useSaveAsDraftRecipe();
  const { mutate: saveAndFinish, isPending: isSaveRecipePending } =
    useSaveAndFinishRecipe();
  const { mutate: editServing } = useEditServingMutation();
  const { mutate: editFoodInfo } = useEditFoodInfoMutation();
  const { mutate: deleteServing, isPending: isDeleteServingLoading } =
    useDeleteServingMutation(refetch);
  const { mutate: addServing, isPending: isAddServingPending } =
    useAddFoodServingMutation();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [openServingModal, setOpenServingModal] = useState(false);
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(null);
  const [servingToDelete, setServingToDelete] = useState(null);
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [numberOfServings, setNumberOfServings] = useState("");
  const [instructions, setInstructions] = useState("");
  const [renderedImage, setRenderedImage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);

  const initialServing = {
    unit: "",
    integral: "",
    fraction: "0",
    calories: "",
    carbs: "",
    protein: "",
    fat: "",
    fluid: "",
  };

  const [servingForm, setServingForm] = useState(initialServing);

  const handleAddServing = () => {
    const [nominator, denominator] = servingForm.fraction
      .split("/")
      .map(Number);

    const payload = {
      food_id: id,
      unit: servingForm.unit,
      integral: parseInt(servingForm.integral) || 0,
      nominator: nominator || 0,
      denominator: denominator || 0,
      calories: parseFloat(servingForm?.calories || 0),
      carbs: parseFloat(servingForm?.carbs || 0),
      protein: parseFloat(servingForm?.protein || 0),
      fat: parseFloat(servingForm?.fat || 0),
      fluid: parseFloat(servingForm?.fluid || 0),
    };

    addServing(payload, {
      onSuccess: () => {
        setServingForm(initialServing);
        setOpenServingModal(false);
        refetch?.();
      },
    });
  };

  const foodsData = foodData?.data;

  useEffect(() => {
    if (foodsData) {
      setName(foodsData.name || "");
      setSelectedCategories(
        foodsData.food_category_maps.map((map) => map.food_category)
      );
      setServings(foodsData.food_servings);
      setValue("instruction", foodsData.instruction || "");
      setValue("no_of_servings", foodsData.no_of_servings ?? "");
      setValue("image", foodsData.image ?? "");
      setPreviewImage(foodsData.image);
    }
  }, [foodsData]);

  const updateServing = (index, key, value) => {
    setServings((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  useEffect(() => {
    const defaultEditState = {};
    servings.forEach((s) => {
      defaultEditState[s.id] = false;
    });
    setIsEditingServings(defaultEditState);
  }, []);

  const onSubmit = (data) => {
    const payload = new FormData();

    payload.append("recipe_id", id); // use actual ID variable
    payload.append("name", name);
    payload.append("instruction", data.instruction);
    payload.append("no_of_servings", data.no_of_servings);
    selectedCategories.forEach((cat) => {
      payload.append("food_category_ids[]", cat.id);
    });
    // payload.append("ingredients", JSON.stringify(data.ingredients)); // or however you format it

    if (data.image instanceof File) {
      payload.append("image", data.image); // correct file upload
    }

    // Submit via fetch or Axios
    saveDraftRecipe(payload); // Make sure it can handle FormData
  };

  const handleSaveRecipe = (id) => {
    saveAndFinish({ recipe_id: id });
  };
  const handleSaveServing = (servingData) => {
    const foodSlotId = selectedIngredient?.id;
    const foodServingId =
      selectedIngredient?.id ||
      selectedIngredient?.food_serving_id ||
      selectedIngredient?.food_serving_id;

    if (!foodSlotId || !foodServingId) {
      console.error("Missing foodSlotId or foodServingId");
      return;
    }

    const [nominator, denominator] =
      servingData.fraction !== "0"
        ? servingData.fraction.split("/").map(Number)
        : [0, 0];

    const payload = {
      ingredient_id: foodSlotId,
      // food_serving_id: foodServingId,
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

    const mutation = isTemplate
      ? updateTemplateServing
      : updateRecipeServingSize;
    mutation(payload, {
      onSuccess: () => {
        handleCloseServingModal();
      },
    });
  };

  const handleCloseServingModal = () => {
    setOpenServingModal(false);
    setSelectedIngredient(null);
  };

  useEffect(() => {
    if (templateId) {
      setIsRecipeSelected(true);
    }
  }, [templateId]);

  const allIngredientData =
    ingredients?.map((item) => ({
      id: item.id,
      integral: item.integral,
      unit: item.unit,
      calories: item.calories,
      carbs: item.carbs,
      protein: item.protein,
      fat: item.fat,
      fluid: item.fluid,
      ingredient: item.ingredient,
      nominator: item.nominator,
      denominator: item.denominator,
    })) || [];

  const totalNutrition = calculateTotalNutrition(ingredients);

  return (
    <>
      <div className="flex flex-col h-full p-3 overflow-auto">
        <div className="flex flex-col h-full p-3 bg-white overflow-auto">
          {/* Header */}
          <div className="m-2 flex items-center justify-between h-10">
            <h1 className="text-2xl font-bold mb-0">
              <button
                onClick={() => router.back()}
                className="flex items-center"
              >
                <Image
                  src={backIcon}
                  height={22}
                  width={22}
                  className="me-4 ms-1"
                  alt="back-icon"
                />
                View Recipe
              </button>
            </h1>
          </div>

          {isRecipeSelected && (
            <div className="w-full bg-gray-100 flex flex-1 flex-col overflow-auto">
              <div className="flex flex-col items-center bg-white">
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
              <RecipeCard
                recipeData={foodData}
                recipeFoodData={recipeFoodData}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
