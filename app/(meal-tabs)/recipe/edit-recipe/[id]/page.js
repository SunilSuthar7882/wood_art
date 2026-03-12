"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import backIcon from "@/public/images/back-arrow.png";
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
import { calculateTotalNutrition, formatNumber } from "@/utils/utils";
import { Routes } from "@/config/routes";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { getLocalStorageItem } from "@/helpers/localStorage";
import AddFoodInRecipe from "@/component/CommonComponents/AddFoodInRecipe";
import Cookies from "js-cookie";

export default function EditRecipe() {
  const role = getLocalStorageItem("role");
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    getValues,
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
  const [type, setType] = useState("recipe");

  const router = useRouter();
  const params = useParams();
  const [isRecipeSelected, setIsRecipeSelected] = useState(false);

  const [isEditingServings, setIsEditingServings] = useState({});

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [servings, setServings] = useState([]);
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template_id");
  const id = params?.id;
  const { data: categories = [], isLoading: isLoadingCategories } =
    useFetchFoodCategories(type);

  const {
    data: foodData,
    refetch,
    isPending: isFetchingFoodPending,
  } = useGetFoodData({ food_id: id });

  // console.log("foodData", foodData);

  const {
    data: recipeFoodData,
    refetch: refetchingRecipe,
    isPending: isFetchingRecipeFoodPending,
  } = useGetFoodData(
    { food_id: templateId },
    {
      enabled: isRecipeSelected,
    }
  );

  const instructionsValue = watch("instruction");
  const servingsValue = watch("no_of_servings");
  const noofservings = servingsValue || foodData?.data?.no_of_servings;
  const instructionsss = instructionsValue || foodData?.data?.instruction;

  const ingredients = foodData?.data?.ingredients;
  const is_draft = foodData?.data?.is_draft;

  const recipe = foodData?.data?.ingredients;
  const { mutate: saveDraftRecipe, isPending: isSaveAsDraftPending } =
    useSaveAsDraftRecipe();
  const { mutate: saveAndFinish, isPending: isSaveRecipePending } =
    useSaveAndFinishRecipe();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [openServingModal, setOpenServingModal] = useState(false);
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(null);

  const [numberOfServings, setNumberOfServings] = useState("");
  const [instructions, setInstructions] = useState("");

  const [foodToDelete, setFoodToDelete] = useState(null);

  const { showSnackbar } = useSnackbar();

  const foodsData = foodData?.data;
  const canshowiscreatedbyyou =
    role === "admin" ||
    (role === "trainer" && foodsData?.is_created_by_you === 1);
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

  useEffect(() => {
    const defaultEditState = {};
    servings.forEach((s) => {
      defaultEditState[s.id] = false;
    });
    setIsEditingServings(defaultEditState);
  }, []);

  const onSubmit = (data) => {
    console.log("recipedata", data);
    const payload = new FormData();

    payload.append("recipe_id", id);
    payload.append("name", name);
    payload.append("instruction", data.instruction);
    payload.append("no_of_servings", data.no_of_servings);

    selectedCategories.forEach((cat) => {
      payload.append("food_category_ids[]", cat.id);
    });

    if (data.image instanceof File) {
      // New file selected
      payload.append("image", data.image);
    } else {
      payload.append("image", null);
    }
    console.log("FormData being sent:");
    for (let [key, value] of payload.entries()) {
      console.log(key, value);
    }
    saveDraftRecipe(payload, {
      onSuccess: () => {
        router.push(Routes.recipe);
        Cookies.remove("edit-recipe-id");
      },
    });
  };

  const handleSaveRecipe = (id, data) => {
    const formValues = getValues();
    console.log("recipedata", formValues);
    const payload = new FormData();

    payload.append("recipe_id", id);
    payload.append("name", name);
    payload.append("instruction", formValues.instruction);
    payload.append("no_of_servings", formValues.no_of_servings);

    selectedCategories.forEach((cat) => {
      payload.append("food_category_ids[]", cat.id);
    });

    if (formValues.image instanceof File) {
      // New file selected
      payload.append("image", formValues.image);
    } else {
      payload.append("image", null);
    }

    saveAndFinish(payload, {
      onSuccess: () => {
        router.push(Routes.recipe);
        Cookies.remove("edit-recipe-id");
      },
    });
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
      // food_serving_id: selectedIngredient?.id,
      food_serving_id: parseFloat(servingData.food_serving_id),
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

  const handleDeleteClick = (item) => {
    setFoodToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async (item) => {
    try {
      deleteFood(foodToDelete?.id);
      refetch();
      setDeleteConfirmOpen(false);
      setFoodToDelete(null);
    } catch (err) {
      console.error("Error deleting food:", err);
    }
  };

  useEffect(() => {
    if (templateId) {
      setIsRecipeSelected(true);
    }
  }, [templateId]);

  const totalNutrition = calculateTotalNutrition(ingredients);

  const isIngredientsInvalid =
    !ingredients ||
    ingredients.length === 0 ||
    ingredients.every(
      (ing) =>
        (!ing.unit || ing.unit.trim() === "") &&
        Number(ing.calories) === 0 &&
        Number(ing.carbs) === 0 &&
        Number(ing.protein) === 0 &&
        Number(ing.fat) === 0 &&
        Number(ing.fluid) === 0
    );

  const isInstructionsInvalid = !instructionsss || instructionsss.trim() === "";
  const isServingsInvalid = !noofservings || Number(noofservings) === 0;

  const handleButtonClick = (action) => {
    if (isIngredientsInvalid) {
      showSnackbar(
        "Please add at least one ingredient with serving before saving.",
        "error"
      );
      return;
    }

    if (isInstructionsInvalid) {
      showSnackbar("Please add instructions before saving.", "error");
      return;
    }

    if (isServingsInvalid) {
      showSnackbar("Please add number of servings before saving.", "error");
      return;
    }

    // If all validations pass
    if (action === "saveDraft") {
      document.querySelector("form")?.requestSubmit();
    } else if (action === "saveFinish") {
      handleSaveRecipe(id);
    } else if (action === "saveRecipe") {
      document.querySelector("form")?.requestSubmit();
    }
  };

  return (
    <>
      <div className="flex flex-col h-full p-3 bg-white overflow-auto rounded-md">
        <div className="m-2 flex items-center justify-between h-10">
          <h1 className="text-2xl font-bold mb-0">
            <button
              onClick={() => {
                Cookies.remove("edit-recipe-id");
                router.replace("/recipe");
              }}
              className="flex items-center"
            >
              <Image
                src={backIcon}
                height={22}
                width={22}
                className="me-4 ms-1"
                alt="back-icon"
              />
              Edit Recipe
            </button>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-auto w-full border border-gray-200 p-2 rounded-md bg-white mb-4"
        >
          {!isRecipeSelected && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-2 items-start">
                {/* LEFT SIDE - Recipe Name & Categories */}
                <div className="md:col-span-2 space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Recipe Name:
                  </label>
                  <CustomTextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Categories:
                  </label>
                  <CustomAutoComplete
                    multiple
                    options={categories || []}
                    value={selectedCategories}
                    onChange={(e, value) => setSelectedCategories(value)}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option?.name || ""
                    }
                    isOptionEqualToValue={(option, value) =>
                      option?.id === value?.id
                    }
                    renderOption={(props, option, { selected }) => {
                      const { key, ...rest } = props;
                      return (
                        <li key={option.id || key} {...rest}>
                          <Checkbox
                            checked={selected}
                            style={{ marginRight: 8 }}
                          />
                          {option.name}
                        </li>
                      );
                    }}
                  />
                </div>

                {/* RIGHT SIDE - Image Upload */}
                <div className="">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Recipe Image:
                  </label>

                  <input
                    name="image"
                    id="recipe-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setValue("image", file);
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                  />

                  <div className="flex items-center gap-4 p-2">
                    {previewImage && (
                      <div className="mt-2 w-[120px] h-[120px] rounded-full overflow-hidden border shadow-md transition duration-300 hover:scale-105">
                        <Image
                          src={previewImage}
                          alt="Selected"
                          width={120}
                          height={120}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    {canshowiscreatedbyyou && (
                      <div className="flex flex-col items-start gap-2 mt-2">
                        <label
                          htmlFor="recipe-image-upload"
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#16a34a] rounded-lg shadow hover:bg-green-700 transition cursor-pointer"
                        >
                          <UploadIcon className="w-4 h-4" />
                          {previewImage ? "Change Image" : "Upload Image"}
                        </label>

                        {previewImage && (
                          <button
                            type="button"
                            onClick={() => {
                              setValue("image", null);
                              setPreviewImage(null);
                            }}
                            className="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition"
                          >
                            <XCircleIcon className="w-4 h-4" />
                            Remove
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className=" p-2 flex justify-end">
                {canshowiscreatedbyyou && (
                  <Button
                    onClick={() => {
                      setIsAddFoodOpen(true);
                    }}
                    variant="contained"
                    size="small"
                    className="text-blue-600 normal-case"
                  >
                    + Add Food
                  </Button>
                )}
              </div>

              <div className="flex flex-1 flex-col overflow-auto border border-gray-300 p-2 rounded-md">
                {ingredients?.map((item, index) => {
                  const {
                    id,
                    integral,
                    unit,
                    calories,
                    carbs,
                    protein,
                    fat,
                    fluid,
                    ingredient,
                    nominator,
                    denominator,
                  } = item;
                  return (
                    <div
                      key={id}
                      className="flex flex-col max-w-2xl w-full mx-auto border p-3 rounded shadow-sm bg-white mb-2"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {ingredient?.name}
                          </span>

                          {canshowiscreatedbyyou && (
                            <>
                              {!calories &&
                              !carbs &&
                              !protein &&
                              !fat &&
                              !fluid ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenServingModal(true);

                                    setSelectedIngredient(item);
                                  }}
                                  className="text-green-600 text-xs hover:text-green-700 flex items-center space-x-1 whitespace-nowrap"
                                >
                                  + Add Serving
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenServingModal(true);

                                    setSelectedIngredient(item);
                                    // setInitialHasEdited(true);
                                  }}
                                  className="text-green-600 text-xs hover:text-green-700 flex items-center space-x-1"
                                >
                                  {(integral > 0 ||
                                    (nominator > 0 && denominator > 0)) && (
                                    <>
                                      {integral > 0 && <span>{integral} </span>}
                                      {nominator > 0 && denominator > 0 && (
                                        <span>{`${nominator}/${denominator} `}</span>
                                      )}
                                      {unit && <span>{unit}</span>}
                                    </>
                                  )}
                                </button>
                              )}
                            </>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 sm:grid-cols-5 lg:grid-cols-5 gap-y-2 text-sm text-gray-700 gap-1 w-full">
                          <div className="flex flex-col text-center">
                            <span className="font-medium text-gray-500">
                              Calories
                            </span>
                            <span>{calories} Cal</span>
                          </div>
                          <div className="flex flex-col text-center">
                            <span className="font-medium text-gray-500">
                              Carbs
                            </span>
                            <span>{carbs} g</span>
                          </div>
                          <div className="flex flex-col text-center">
                            <span className="font-medium text-gray-500">
                              Protein
                            </span>
                            <span>{protein} g</span>
                          </div>
                          <div className="flex flex-col text-center">
                            <span className="font-medium text-gray-500">
                              Fat
                            </span>
                            <span>{fat} g</span>
                          </div>
                          <div className="flex flex-col text-center">
                            <span className="font-medium text-gray-500">
                              Fluid
                            </span>
                            <span>{fluid} ml</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 h-full">
                          {canshowiscreatedbyyou && (
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(item)}
                              className="text-gray-500 hover:text-red-600 text-sm"
                              title="Delete"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {ingredients?.length > 0 && (
                  <div className=" border border-gray-300 bg-[#f8f9fa] p-2 rounded-md max-w-lg w-full mx-auto my-1">
                    <h3 className="text-base font-semibold text-gray-700 mb-2">
                      Total Recipe Nutrition
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-5 gap-y-2 text-sm text-gray-700 gap-4">
                      <div className="flex flex-col text-center">
                        <span className="font-medium text-gray-500">
                          Calories
                        </span>
                        <span>
                          {formatNumber(totalNutrition.total_calories)} Cal
                        </span>
                      </div>
                      <div className="flex flex-col text-center">
                        <span className="font-medium text-gray-500">Carbs</span>
                        <span>
                          {formatNumber(totalNutrition.total_carbs)} g
                        </span>
                      </div>
                      <div className="flex flex-col text-center">
                        <span className="font-medium text-gray-500">
                          Protein
                        </span>
                        <span>
                          {formatNumber(totalNutrition.total_protein)} g
                        </span>
                      </div>
                      <div className="flex flex-col text-center">
                        <span className="font-medium text-gray-500">Fat</span>
                        <span>{formatNumber(totalNutrition.total_fat)} g</span>
                      </div>
                      <div className="flex flex-col text-center">
                        <span className="font-medium text-gray-500">Fluid</span>
                        <span>
                          {formatNumber(totalNutrition.total_fluid)} ml
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {/* Instructions and Servings */}
                <div className="flex flex-row mx-auto w-full max-w-3xl gap-2 my-2">
                  {/* Instructions Field */}
                  <div className="w-1/2">
                    <label className="input-label block mb-1">
                      Recipe Instructions*
                    </label>
                    <Controller
                      name="instruction"
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          value={instructions}
                          {...field}
                          placeholder="Type the instructions"
                          multiline
                          minRows={6}
                          sx={{
                            "& .MuiInputBase-root": {
                              p: 1.2,
                              fontSize: "0.875rem",
                            },
                            "& .MuiInputBase-inputMultiline": {
                              pt: 0,
                            },
                          }}
                        />
                      )}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="instruction"
                      render={({ message }) => (
                        <p className="text-red-500 text-sm mb-2">{message}</p>
                      )}
                    />
                  </div>

                  {/* Number of Servings */}
                  <div className="w-1/2">
                    <label className="input-label block mb-1">
                      Number of Servings
                    </label>
                    <CustomSelectController
                      name="no_of_servings"
                      control={control}
                      onChange={setNumberOfServings}
                      renderValueLabel="Select Meals"
                      options={Array.from({ length: 50 }, (_, i) => ({
                        label: `${i + 1}`,
                        value: i + 1,
                      }))}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {templateId && (
            <div className="w-full bg-gray-100 flex flex-1 flex-col overflow-auto">
              <div className="flex flex-col items-center justify-center p-2 bg-white">
                <button
                  type="button"
                  onClick={() => router.push(Routes.createRecipeFromScratch)}
                  className="bg-[#16a34a] text-white px-6 py-2 rounded-lg hover:bg-green-700 transition "
                >
                  Create From Scratch
                </button>
              </div>
              <RecipeCard
                recipeData={foodData}
                recipeFoodData={recipeFoodData}
              />
            </div>
          )}

          {!isRecipeSelected && (
            <div className="flex justify-center gap-4 w-full mx-auto border-gray-300 pt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => {
                  Cookies.remove("edit-recipe-id");
                  router.replace("/recipe");
                }}
              >
                Cancel
              </button>
              {canshowiscreatedbyyou && (
                <>
                  {is_draft === true ? (
                    <>
                      <button
                        type="button"
                        className="px-4 py-2 bg-[#01933c] text-white rounded hover:bg-green-600"
                        onClick={() => handleButtonClick("saveDraft")}
                      >
                        Save As Draft
                      </button>

                      <button
                        type="button"
                        className="px-4 py-2 bg-[#01933c] text-white rounded hover:bg-green-600"
                        onClick={() => handleButtonClick("saveFinish")}
                      >
                        Save and Finish
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#01933c] text-white rounded hover:bg-green-600"
                      onClick={() => handleButtonClick("saveRecipe")}
                    >
                      Save Recipe
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </form>
        {/* </div> */}
      </div>
      {/* </div> */}

      <ConfirmationModal
        // loading={loadingDelete}
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Food Item?"
        message={`Are you sure you want to remove "${foodToDelete?.ingredient?.name}" from this meal?`}
        confirmButtonText="Delete"
        type="error"
      />

      <AddFoodInRecipe
        isRecipe
        isOpen={isAddFoodOpen}
        setIsOpen={setIsAddFoodOpen}
      />

      <AddServingSizeInRecipe
        dayNutrition={totalNutrition}
        meal={selectedIngredient}
        totalNutrition={totalNutrition}
        recipe={recipe}
        refetch={refetch}
        open={openServingModal}
        onClose={() => {
          setOpenServingModal(false);

          refetch();
        }}
        onSave={handleSaveServing}
        food={selectedIngredient}
        initialHasEdited
        isEditing
      />
    </>
  );
}
