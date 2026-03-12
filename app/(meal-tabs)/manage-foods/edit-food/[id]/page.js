"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import backIcon from "@/public/images/back-arrow.png";
import {
  TextField,
  Autocomplete,
  MenuItem,
  Button,
  Skeleton,
} from "@mui/material";

import {
  useAddFoodServingMutation,
  useDeleteServingMutation,
  useEditFoodInfoMutation,
  useEditServingMutation,
  useFetchFoodCategories,
  useFetchServingUnits,
  useGetFoodData,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import ConfirmationModal from "@/component/CommonComponents/ConfirmationModal";
import AddServingModal from "@/component/AddServingModal";
import TableDeleteActionButton from "@/component/CommonComponents/TableDeleteActionButton";
import TableEditActionIcon from "@/component/CommonComponents/TableEditActionIcon";
import CustomAutoComplete from "@/component/CommonComponents/CustomAutoComplete";
import CustomSelectController from "@/component/CommonComponents/CustomSelectController";
import { useForm } from "react-hook-form";
import CustomTextField from "@/component/CommonComponents/CustomTextField";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useSnackbar } from "@/app/contexts/SnackbarContext";

export default function EditFood() {
  const role = getLocalStorageItem("role");
  const { showSnackbar } = useSnackbar();
  const { control } = useForm({
    defaultValues: {
      servings: [
        { unit: "" }, // make sure to match your data structure
      ],
    },
  });
  const router = useRouter();
  const params = useParams();
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingServings, setIsEditingServings] = useState(false);
  const [name, setName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [servings, setServings] = useState([]);
  console.log("servings", servings);
  const id = params?.id;
  const type= "food";
  const { data: categories = [], isLoading: isLoadingCategories } =
    useFetchFoodCategories(type);
  const { data: units = [], isLoading: isUnitsLoading } =
    useFetchServingUnits();
  // console.log(units);
  const {
    data: foodData,
    refetch,
    isPending: isFetchingFoodPending,
  } = useGetFoodData({ food_id: id });
  const { mutate: editServing } = useEditServingMutation();
  const { mutate: editFoodInfo } = useEditFoodInfoMutation();
  const { mutate: deleteServing, isPending: isDeleteServingLoading } =
    useDeleteServingMutation();
  const { mutate: addServing, isPending: isAddServingPending } =
    useAddFoodServingMutation();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [openServingModal, setOpenServingModal] = useState(false);
  const [servingToDelete, setServingToDelete] = useState(null);
  const initialServing = {
    unit: "",
    integral: "0",
    fraction: "0",
    calories: "0",
    carbs: "0",
    protein: "0",
    fat: "0",
    fluid: "0",
  };

  const [servingForm, setServingForm] = useState(initialServing);

  const handleAddServing = () => {
    const [nominator, denominator] = servingForm.fraction
      .split("/")
      .map((v) => Number(v) || 0);

    if (
      Number(servingForm.integral) === 0 &&
      (nominator === 0 || denominator === 0)
    ) {
      showSnackbar("Please enter a quantity or serving fraction", "error");
      return;
    }

    const payload = {
      food_id: id,
      unit: servingForm.unit?.name,
      integral: parseInt(servingForm.integral) || 0,
      nominator: nominator || 0,
      denominator: denominator || 0,
      calories: parseFloat(servingForm.calories),
      carbs: parseFloat(servingForm.carbs),
      protein: parseFloat(servingForm.protein),
      fat: parseFloat(servingForm.fat),
      fluid: parseFloat(servingForm.fluid),
    };

    // console.log(payload);

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
    }
  }, [foodsData]);

  const updateServing = (index, key, value) => {
    setServings((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const handleConfirmDelete = () => {
    if (!servingToDelete) return;

    deleteServing(servingToDelete.id, {
      onSuccess: () => {
        setDeleteConfirmOpen(false);
        setServingToDelete(null);
        refetch();
      },
      onError: (err) => {
        console.error("Failed to delete serving:", err);
      },
    });
  };

  return (
    <>
      <div className="flex flex-1 flex-col h-full overflow-auto">
        {/* Header */}
        <div className="flex flex-col m-2 h-10">
          <h1 className="text-2xl font-bold mb-0">
            <button onClick={() => router.back()} className="flex items-center">
              <Image
                src={backIcon}
                height={22}
                width={22}
                className="me-4 ms-1"
                alt="back-icon"
              />
              Edit Food
            </button>
          </h1>
        </div>
        <div className="flex flex-col flex-1 border p-4 rounded-md shadow-md mb-6 bg-white h-full overflow-auto">
          <div className="flex flex-col p-2 max-w-xl border-[2px] rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold ">Basic Info</h2>
              <div className="flex gap-4 items-center">
                {isEditingInfo ? (
                  <>
                    {/* Cancel Button */}
                    <button
                      className="text-md text-gray-600 underline"
                      onClick={() => {
                        setName(foodsData?.name || "");
                        setSelectedCategories(
                          foodsData?.food_category_maps?.map(
                            (map) => map.food_category
                          ) || []
                        );
                        setIsEditingInfo(false);
                      }}
                    >
                      Cancel
                    </button>

                    {/* Save Button */}
                    <button
                      className="text-md text-green-600 underline"
                      onClick={() => {
                        const categoryIds = selectedCategories.map(
                          (cat) => cat.id
                        );
                        editFoodInfo({
                          food_id: id,
                          name,
                          food_category_ids: categoryIds,
                        });
                        setIsEditingInfo(false);
                      }}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  (role === "admin" ||
                    (role === "trainer" &&
                      foodsData?.is_created_by_you === 1)) && (
                    <TableEditActionIcon
                      title="Edit"
                      icon={<i className="fa fa-pencil text-gray-600"></i>} // or any edit icon you prefer
                      onClick={() => setIsEditingInfo(true)}
                      className="text-gray-500 hover:text-green-600 transition-colors"
                    />
                  )
                )}
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col mb-4">
              <h3 className="font-semibold mb-1">Name:</h3>

              {isFetchingFoodPending ? (
                <Skeleton
                  variant="rounded"
                  height={36}
                  className="w-[150px] rounded"
                />
              ) : (
                <CustomTextField
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditingInfo}
                  className={`w-full border border-[#c5c6c7] px-2 py-1 rounded focus:outline-none focus:ring-[1.5px] focus:ring-green-700  ${
                    isEditingInfo
                      ? "bg-white"
                      : "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              )}
            </div>

            {/* Categories */}
            <div className="flex flex-col">
              <h3 className="font-semibold mb-1">Categories:</h3>

              {isFetchingFoodPending ? (
                <div className="space-y-2">
                  <Skeleton
                    variant="rounded"
                    height={30}
                    className="w-[150px] rounded"
                  />
                  <Skeleton
                    variant="rounded"
                    height={30}
                    className="w-[150px] rounded"
                  />
                </div>
              ) : isEditingInfo ? (
                <CustomAutoComplete
                  multiple
                  options={categories}
                  getOptionLabel={(option) => option.name}
                  value={selectedCategories}
                  onChange={(e, newValue) => setSelectedCategories(newValue)}
                  isOptionEqualToValue={(opt, val) => opt.id === val.id}
                  renderInputLabel="Select Category"
                  sx={{ mb: 2 }} // extra styles if needed
                />
              ) : (
                <ul className="list-disc pl-6">
                  {selectedCategories.map((cat) => (
                    <li key={cat.id}>{cat.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-3 flex flex-col justify-center mx-auto">
              {/* <div className="border rounded-md inline-block"> */}
              {(role === "admin" ||
                (role === "trainer" && foodsData?.is_created_by_you === 1)) && (
                <Button
                  onClick={() => setOpenServingModal(true)}
                  variant="contained"
                  size="small"
                  className="text-blue-600 underline normal-case"
                >
                  + Add Servings
                </Button>
              )}
              {/* <Button
                onClick={() => setOpenServingModal(true)}
                variant="contained"
                size="small"
                className="text-blue-600 underline normal-case"
              >
                + Add Servings
              </Button> */}
              {/* </div> */}
            </div>
          </div>

          <div className="flex flex-col my-2 w-full">
            {isFetchingFoodPending ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="border p-4 rounded shadow-sm bg-white space-y-2"
                  >
                    <Skeleton variant="text" width={120} height={24} />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Array.from({ length: 8 }).map((__, index) => (
                        <Skeleton
                          key={index}
                          variant="rectangular"
                          height={36}
                          className="rounded"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              servings.map((serving, index) => {
                const isEditing = isEditingServings[serving.id] ?? false;

                return (
                  <div
                    key={serving.id}
                    className="flex flex-col max-w-3xl border p-4 rounded shadow-sm bg-white space-y-2 overflow-auto"
                  >
                    <div className="flex justify-between items-start overflow-auto">
                      <span className="font-semibold">
                        Serving #{index + 1}
                      </span>

                      {/* Right side buttons */}
                      <div className="flex gap-3">
                        {(role === "admin" ||
                          (role === "trainer" &&
                            foodsData?.is_created_by_you === 1)) && (
                          <>
                            {isEditing ? (
                              <button
                                className="text-sm underline text-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsEditingServings((prev) => ({
                                    ...prev,
                                    [serving.id]: false,
                                  }));
                                }}
                              >
                                Cancel
                              </button>
                            ) : (
                              <TableDeleteActionButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setServingToDelete(serving);
                                  setDeleteConfirmOpen(true);
                                }}
                                className="text-gray-500 hover:text-red-600 transition-colors"
                              />
                            )}

                            {isEditing ? (
                              <button
                                className="text-sm text-green-600 underline"
                                onClick={() => {
                                  if (
                                    Number(serving.integral) === 0 &&
                                    (serving.nominator === 0 ||
                                      serving.denominator === 0)
                                  ) {
                                    showSnackbar(
                                      "Please enter a quantity or serving fraction",
                                      "error"
                                    );
                                    return;
                                  }

                                  editServing({
                                    food_serving_id: serving.id,
                                    unit: serving.unit,
                                    integral: Number(serving.integral),
                                    nominator: Number(serving.nominator),
                                    denominator: Number(serving.denominator),
                                    calories: Number(serving.calories),
                                    carbs: Number(serving.carbs),
                                    protein: Number(serving.protein),
                                    fat: Number(serving.fat),
                                    fluid: Number(serving.fluid),
                                  });

                                  // Exit editing mode
                                  setIsEditingServings((prev) => ({
                                    ...prev,
                                    [serving.id]: false,
                                  }));
                                }}
                              >
                                Save
                              </button>
                            ) : (
                              <TableEditActionIcon
                                title="Edit"
                                onClick={() => {
                                  setIsEditingServings((prev) => ({
                                    ...prev,
                                    [serving.id]: true,
                                  }));
                                }}
                                className="text-gray-500 hover:text-green-600 transition-colors"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="flex flex-col gap-2 text-sm overflow-auto">
                        <div className="grid grid-cols-3 gap-2 text-sm overflow-auto pt-1.5">
                          {/* <CustomSelectController
                          name={`servings.${index}.unit`}
                          control={control} // ✅ from useForm()
                          value={serving.unit}
                          onChange={(val) => updateServing(index, "unit", val)}
                          renderValueLabel="Unit"
                          options={units.map((u, idx) => ({
                            value: u.name,
                            label: u.name,
                            key: `${u.name}-${idx}`, // ✅ unique key
                          }))}
                        /> */}

                          <CustomAutoComplete
                            options={units || []}
                            getOptionLabel={(option) => option.name || ""}
                            value={
                              units.find((u) => u.name === serving.unit) || null
                            } // ✅ match by label
                            onChange={(e, newValue) => {
                              updateServing(
                                index,
                                "unit",
                                newValue ? newValue.name : ""
                              );
                            }}
                            isOptionEqualToValue={(option, value) =>
                              option.name === value.name
                            }
                            renderOption={(props, option, { index }) => (
                              <li
                                {...props}
                                key={option.id || `${option.name}-${index}`}
                              >
                                {option.name}
                              </li>
                            )}
                            renderInputLabel="Select Unit"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Unit"
                                placeholder="Search or select unit"
                                size="small"
                                fullWidth
                                error={!serving.unit}
                                helperText={
                                  !serving.unit ? "Unit is required" : ""
                                }
                              />
                            )}
                            PaperProps={{
                              sx: {
                                maxHeight: 400,
                                overflow: "auto",
                                zIndex: 1500,
                              },
                            }}
                          />

                          <CustomTextField
                            label="Quantity"
                            type="number"
                            value={serving.integral}
                            inputProps={{ min: 0 }}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || Number(value) >= 0) {
                                updateServing(index, "integral", value);
                              }
                            }}
                            size="small"
                          />
                          <CustomTextField
                            select
                            label="Serving Fraction"
                            value={
                              serving.nominator === 0 ||
                              serving.denominator === 0
                                ? "0"
                                : `${serving.nominator}/${serving.denominator}`
                            }
                            onChange={(e) => {
                              const [nominator, denominator] = e.target.value
                                .split("/")
                                .map((v) => parseInt(v) || 0);
                              updateServing(index, "nominator", nominator);
                              updateServing(index, "denominator", denominator);
                            }}
                            fullWidth
                            size="small"
                          >
                            {[
                              "0",
                              "1/8",
                              "1/5",
                              "1/4",
                              "1/3",
                              "3/8",
                              "1/2",
                              "2/5",
                              "3/5",
                              "5/8",
                              "2/3",
                              "3/4",
                              "4/5",
                              "7/8",
                            ].map((frac) => (
                              <MenuItem key={frac} value={frac}>
                                {frac}
                              </MenuItem>
                            ))}
                          </CustomTextField>
                        </div>

                        <div className="grid grid-cols-5 gap-2 text-sm overflow-auto pt-1.5">
                          <CustomTextField
                            label="Calories"
                            type="number"
                            inputProps={{ min: 0 }}
                            value={serving.calories}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || Number(value) >= 0) {
                                updateServing(index, "calories", value);
                              }
                            }}
                            size="small"
                          />

                          <CustomTextField
                            label="Carbs"
                            type="number"
                            value={serving.carbs}
                            inputProps={{ min: 0 }}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || Number(value) >= 0) {
                                updateServing(index, "carbs", value);
                              }
                            }}
                            size="small"
                          />

                          <CustomTextField
                            label="Protein"
                            type="number"
                            value={serving.protein}
                            inputProps={{ min: 0 }}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || Number(value) >= 0) {
                                updateServing(index, "protein", value);
                              }
                            }}
                            size="small"
                          />

                          <CustomTextField
                            label="Fat"
                            type="number"
                            value={serving.fat}
                            inputProps={{ min: 0 }}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || Number(value) >= 0) {
                                updateServing(index, "fat", value);
                              }
                            }}
                            size="small"
                          />

                          <CustomTextField
                            label="Fluid"
                            type="number"
                            value={serving.fluid}
                            inputProps={{ min: 0 }}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || Number(value) >= 0) {
                                updateServing(index, "fluid", value);
                              }
                            }}
                            size="small"
                          />
                        </div>
                        {/* Add other nutrient fields similarly */}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-x-4 text-sm">
                        <span className="font-semibold">
                          {serving.integral > 0 ? serving.integral : ""}{" "}
                          {serving.nominator && serving.denominator
                            ? `${serving.nominator}/${serving.denominator}`
                            : ""}{" "}
                          {serving.unit}
                        </span>

                        <span>
                          | <strong>Calories:</strong>{" "}
                          {Number(serving.calories || 0).toFixed(2)} g
                        </span>
                        <span>
                          | <strong>Carbs:</strong>{" "}
                          {Number(serving.carbs || 0).toFixed(2)} g
                        </span>
                        <span>
                          | <strong>Protein:</strong>{" "}
                          {Number(serving.protein || 0).toFixed(2)} g
                        </span>
                        <span>
                          | <strong>Fat:</strong>{" "}
                          {Number(serving.fat || 0).toFixed(2)} g
                        </span>
                        <span>
                          | <strong>Fluid:</strong>{" "}
                          {Number(serving.fluid || 0).toFixed(2)} ml
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        loading={isDeleteServingLoading}
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setServingToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Serving?"
        message={`Are you sure you want to delete serving?`}
        confirmButtonText="Delete"
        type="error"
      />

      <AddServingModal
        loading={isAddServingPending}
        open={openServingModal}
        onClose={() => setOpenServingModal(false)}
        onAdd={handleAddServing}
        units={units}
        servingForm={servingForm}
        setServingForm={setServingForm}
      />
    </>
  );
}
