"use client";
import {
  CircularProgress,
  Box,
  Button,
  Typography,
  TextField,
  Autocomplete,
  Checkbox,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  useCreateNewFood,
  useCreateNewServingSizeUnit,
  useFetchFoodCategories,
  useFetchServingUnits,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import { Routes } from "@/config/routes";
import Image from "next/image";
import backIcon from "@/public/images/back-arrow.png";
import CommonLoader from "@/component/CommonLoader";
import CustomAutoComplete from "@/component/CommonComponents/CustomAutoComplete";
import CustomTextField from "@/component/CommonComponents/CustomTextField";
import { capitalize } from "../../../../helpers/commonHelper";
import { useSnackbar } from "@/app/contexts/SnackbarContext";

export default function CreateFoodPage() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const type = "food";
  const { data: categories = [], isLoading: isLoadingCategories } =
    useFetchFoodCategories(type);
  const { mutate: createFood, isPending: isCreatingFood } = useCreateNewFood({
    onSuccess: () => {
      handleCancel();
    },
  });
  const { mutate: createServingSize, isPending: isCreatingServingSize } =
    useCreateNewServingSizeUnit({
      onSuccess: () => {
        handleCancel();
      },
    });
  const { data: units = [], isLoading: isUnitsLoading } =
    useFetchServingUnits();
  const [openServingUnit, setOpenServingUnit] = useState(false);
  const [activeTab, setActiveTab] = useState("template");
  const [servings, setServings] = useState([]);
  const [openServingModal, setOpenServingModal] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const initialServing = {
    unit: "",
    integral: 0,
    fraction: "0",
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    fluid: 0,
  };

  const [servingForm, setServingForm] = useState(initialServing);

  // const handleAddServing = () => {
  //   const [nominator, denominator] = servingForm.fraction
  //     .split("/")
  //     .map(Number);

  //   const newServing = {
  //     unit: servingForm.unit,
  //     integral: parseInt(servingForm.integral) || 1,
  //     fraction: servingForm.fraction,
  //     nominator: nominator || 0,
  //     denominator: denominator || 0,
  //     calories: parseFloat(servingForm.calories),
  //     carbs: parseFloat(servingForm.carbs),
  //     protein: parseFloat(servingForm.protein),
  //     fat: parseFloat(servingForm.fat),
  //     fluid: parseFloat(servingForm.fluid),
  //   };

  //   setServings((prev) => [...prev, newServing]);
  //   setServingForm(initialServing);
  //   setOpenServingModal(false);
  // };

  const handleAddServing = () => {
    const [nominator, denominator] = servingForm.fraction
      .split("/")
      .map(Number);

    if (servingForm.integral === 0 && servingForm.fraction === "0") {
      showSnackbar("Please enter a quantity or serving fraction ", "error");
      return;
    }

    console.log(servingForm);

    const newServing = {
      unit: servingForm.unit,
      integral: parseInt(servingForm.integral) || 0,
      fraction: servingForm.fraction,
      nominator: nominator || 0,
      denominator: denominator || 0,
      calories: parseFloat(servingForm.calories),
      carbs: parseFloat(servingForm.carbs),
      protein: parseFloat(servingForm.protein),
      fat: parseFloat(servingForm.fat),
      fluid: parseFloat(servingForm.fluid),
    };

    // 🟢 If editing (index exists), replace the existing item
    if (servingForm.index !== undefined && servingForm.index !== null) {
      setServings((prev) =>
        prev.map((s, i) => (i === servingForm.index ? newServing : s))
      );
    } else {
      // 🟢 If adding new, push it to the array
      setServings((prev) => [...prev, newServing]);
    }

    // Reset and close modal
    setServingForm(initialServing);
    setOpenServingModal(false);
  };

  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    carbs: "",
    protein: "",
    fat: "",
    fluid: "",
    unit: "",
    fraction: "",
    integral: "",
    food_category_ids: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = () => {
    const payload = {
      name: formData.name,
      // type: "recipe",
      food_category_ids: formData.food_category_ids,
      food_servings: servings.map(({ fraction, ...rest }) => rest),
    };

    createFood(payload, {
      onSuccess: () => {
        router.push(Routes.managefoods);
      },
      onError: (err) => {
        console.error("Error creating food:", err);
      },
    });
  };

  const handleServingCreation = () => {
    const payload = {
      name: inputValue,
    };
    createServingSize(payload, {
      onSuccess: () => {
        setOpenServingUnit(false);
        setInputValue(""); // reset
      },
    });
  };

  const handleEditServing = (item, idx) => {
    setServingForm({ ...item, index: idx }); // store index for update
    setOpenServingModal(true); // open modal
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.food_category_ids.length > 0 &&
    servings.length > 0;

  if (isCreatingFood) return <CommonLoader />;
  return (
    <div className="h-full flex flex-col flex-1 overflow-auto ">
      {/* Tabs */}
      <div className="flex items-center justify-between h-10 ">
        <h1 className="text-xl font-bold mb-0">
          <button onClick={() => router.back()} className="flex items-center">
            <Image
              src={backIcon}
              height={20}
              width={20}
              className="me-4 ms-1"
              alt="back-icon"
            />
            Add Food
          </button>
        </h1>
      </div>

      {/* Form Title */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className=" flex flex-col overflow-auto space-y-5 p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto  "
      >
        {/* Form Title */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            textTransform: "capitalize",
          }}
        >
          Create new Food or Supliment form scratch
        </Typography>

        {/* Item Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Food Name <span className="text-red-400 font-bold text-md ">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            placeholder="Enter food name"
          />
        </div>

        {/* Categories Autocomplete */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Food Categories{" "}
            <span className="text-red-400 font-bold text-md ">*</span>
          </label>
          <div>
            <CustomAutoComplete
              multiple
              renderInputLabel="Search Categories..."
              disableCloseOnSelect
              options={categories}
              getOptionLabel={(option) => option.name}
              value={categories.filter((cat) =>
                formData.food_category_ids.includes(cat.id)
              )}
              onChange={(e, selectedOptions) => {
                setFormData((prev) => ({
                  ...prev,
                  food_category_ids: selectedOptions.map((opt) => opt.id),
                }));
              }}
              renderOption={(props, option, { selected }) => {
                const { key, ...rest } = props;
                return (
                  <li key={option.id || key} {...rest}>
                    <Checkbox checked={selected} style={{ marginRight: 8 }} />
                    {option.name}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="small"
                  label="Item Category"
                  placeholder="Search Categories..."
                  margin="dense"
                />
              )}
              fullWidth
              required
            />
          </div>
        </div>

        <ul className="flex flex-col space-y-2 mt-4 overflow-auto">
          {servings.map((item, idx) => (
            <li
              key={idx}
              className="text-sm bg-gray-100 p-3 rounded border border-gray-200 flex justify-between items-start"
            >
              {/* Left side: Serving info */}
              <div
                className="space-y-0.5 flex-1 cursor-pointer"
                onClick={() => handleEditServing(item, idx)}
              >
                <div className="font-medium">
                  {item.integral > 0
                    ? item.fraction !== "0"
                      ? `${item.integral} + ${item.fraction}`
                      : item.integral
                    : item.fraction !== "0"
                    ? item.fraction
                    : "0"}{" "}
                  {item.unit}
                </div>

                <div className="text-xs text-gray-600">
                  <div>
                    Calories: {Number(item.calories || 0).toFixed(2)} cal
                  </div>
                  <div>Carbs: {Number(item.carbs || 0).toFixed(2)} g</div>
                  <div>Protein: {Number(item.protein || 0).toFixed(2)} g</div>
                  <div>Fat: {Number(item.fat || 0).toFixed(2)} g</div>
                  <div>Fluid: {Number(item.fluid || 0).toFixed(2)} ml</div>
                </div>
              </div>

              {/* Right side: Action buttons */}
              <div className="flex flex-col gap-2 ml-4">
                <Button
                  onClick={() => handleEditServing(item, idx)}
                  size="small"
                  variant="outlined"
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() =>
                    setServings(servings.filter((_, i) => i !== idx))
                  }
                  size="small"
                  color="error"
                  variant="outlined"
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center">
          <Button
            variant="outlined"
            onClick={() => {
              setServingForm({ ...initialServing, index: undefined });
              setOpenServingModal(true);
            }}
            size="small"
            // className="w-auto mx-auto mt-4"
          >
            Add Servings
          </Button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            size="small"
            onClick={handleCancel}
            disabled={isCreatingFood}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="small"
            variant="contained"
            disabled={!isFormValid || isCreatingFood}
          >
            {isCreatingFood ? <CircularProgress size={16} /> : "Create Food"}
          </Button>
        </div>
      </form>

      <Dialog
        open={openServingModal}
        onClose={() => setOpenServingModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Add Serving
          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpenServingUnit(true)}
            sx={{ textTransform: "none" }}
          >
            Add Your Own Serving Size
          </Button>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 1,
          }}
        >
          <Box className="bg-gray-50 rounded-md border" sx={{ p: 2 }}>
            {/* Integral & Fraction */}
            <p className="text-sm font-medium text-gray-700 mb-1">
              Serving Unit{" "}
              <span className="text-red-400 font-bold text-md ">*</span>
            </p>
            <CustomAutoComplete
              renderInputLabel="Search serving unit..."
              options={units || []}
              getOptionLabel={(option) => option.name || ""}
              value={units.find((u) => u.name === servingForm.unit) || null}
              onChange={(e, newValue) => {
                setServingForm((prev) => ({
                  ...prev,
                  unit: newValue ? newValue.name : "",
                }));
              }}
              renderOption={(props, option, { index }) => (
                <li {...props} key={option.id || `${option.name}-${index}`}>
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Unit"
                  placeholder="Search or select unit"
                  size="small"
                  fullWidth
                  required
                  error={!servingForm.unit}
                  helperText={!servingForm.unit ? "Unit is required" : ""}
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

            <div className="grid grid-cols-2 gap-2 mb-3 mt-4">
              <TextField
                size="small"
                label="Quantity"
                name="integral"
                type="number"
                value={servingForm.integral}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? "" : Number(e.target.value);
                  setServingForm((prev) => ({
                    ...prev,
                    integral: value,
                  }));
                }}
                fullWidth
                inputProps={{ min: 0, inputMode: "numeric", pattern: "[0-9]*" }}
              />

              <TextField
                select
                label="Serving Fraction"
                name="fraction"
                value={servingForm.fraction}
                onChange={(e) => {
                  setServingForm((prev) => ({
                    ...prev,
                    fraction: e.target.value,
                  }));
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
              </TextField>
            </div>

            {/* Carbs / Protein / Fat / Fluid */}
            <div className="grid grid-cols-5 gap-2">
              <TextField
                fullWidth
                size="small"
                label="Calories"
                name="calories"
                type="number"
                value={servingForm.calories ?? 0}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : Number(e.target.value);
                  setServingForm((prev) => ({
                    ...prev,
                    calories: value,
                  }));
                }}
                inputProps={{ min: 0, inputMode: "numeric", pattern: "[0-9]*" }}
              />
              <TextField
                size="small"
                label="Carbs"
                name="carbs"
                type="number"
                value={servingForm.carbs ?? 0}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : Number(e.target.value);
                  setServingForm((prev) => ({ ...prev, carbs: value }));
                }}
                fullWidth
                inputProps={{ min: 0 }}
              />
              <TextField
                size="small"
                label="Protein"
                name="protein"
                type="number"
                value={servingForm.protein ?? 0}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : Number(e.target.value);
                  setServingForm((prev) => ({
                    ...prev,
                    protein: value,
                  }));
                }}
                fullWidth
                inputProps={{ min: 0 }}
              />
              <TextField
                size="small"
                label="Fat"
                name="fat"
                type="number"
                value={servingForm.fat ?? 0}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : Number(e.target.value);
                  setServingForm((prev) => ({ ...prev, fat: value }));
                }}
                fullWidth
                inputProps={{ min: 0 }}
              />
              <TextField
                fullWidth
                size="small"
                label="Fluid (ml)"
                name="fluid"
                type="number"
                value={servingForm.fluid ?? 0}
                onChange={(e) => {
                  const value =
                    e.target.value === "" ? 0 : Number(e.target.value);
                  setServingForm((prev) => ({ ...prev, fluid: value }));
                }}
                inputProps={{ min: 0 }}
              />
            </div>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 1 }}>
          <Button onClick={() => setOpenServingModal(false)} size="small">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleAddServing();
            }}
            size="small"
            disabled={!servingForm.unit}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openServingUnit}
        onClose={() => setOpenServingUnit(false)}
        PaperProps={{
          sx: {
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ p: 1 }}>Add New Serving Size.</DialogTitle>
        <DialogContent dividers sx={{ p: 1 }}>
          <CustomTextField
            fullWidth
            label="Enter Size"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button onClick={() => setOpenServingUnit(false)}>Cancel</Button>
          <Button
            type="button"
            variant="contained"
            onClick={() => {
              handleServingCreation();
              setOpenServingUnit(false);
            }}
            disabled={!servingForm.unit} // stricter check
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
