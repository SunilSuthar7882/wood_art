"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Checkbox,
  Button,
  Typography,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import {
  useCreateNewFood,
  useFetchFoodCategories,
  useFetchServingUnits,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import CommonLoader from "@/component/CommonLoader";
import CustomAutoComplete from "./CustomAutoComplete";
import CustomTextField from "./CustomTextField";
import { useSnackbar } from "@/app/contexts/SnackbarContext";

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

const FRACTIONS = [
  { label: "0", value: "0" },
  { label: "1/8", value: "1/8" },
  { label: "1/4", value: "1/4" },
  { label: "1/3", value: "1/3" },
  { label: "1/2", value: "1/2" },
  { label: "2/3", value: "2/3" },
  { label: "3/4", value: "3/4" },
  { label: "1/5", value: "1/5" },
  { label: "2/5", value: "2/5" },
  { label: "3/5", value: "3/5" },
  { label: "4/5", value: "4/5" },
  { label: "5/8", value: "5/8" },
  { label: "7/8", value: "7/8" },
];

export default function CreateFoodModalForm({ open, onClose, onSuccess }) {
  const type = "food";
  const { data: categories = [], isLoading: isLoadingCategories } =
    useFetchFoodCategories(type);
  const { data: units = [], isLoading: isUnitsLoading } =
    useFetchServingUnits();

  const { mutate: createFood, isPending: isCreatingFood } = useCreateNewFood({
    onSuccess: () => {
      handleClose(); // resets the form
      onSuccess?.(); // triggers parent callback (e.g. refetch list)
    },
  });
  const [servingForm, setServingForm] = useState(initialServing);
  const [servings, setServings] = useState([]);
  const { showSnackbar } = useSnackbar();
const [editIndex, setEditIndex] = useState(null);
const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    food_category_ids: [],
  });

  const handleAddServing = () => {
  const [nominator, denominator] = servingForm.fraction.split("/").map(Number);

  if (servingForm.integral === 0 && servingForm.fraction === "0") {
    showSnackbar("Please enter a quantity or serving fraction ", "error");
    return;
  }

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
    fluid: parseFloat(servingForm.fluid) || 0,
  };

  if (isEditing && editIndex !== null) {
    // 👇 Update existing serving
    const updatedServings = [...servings];
    updatedServings[editIndex] = newServing;
    setServings(updatedServings);
    setIsEditing(false);
    setEditIndex(null);
  } else {
    // 👇 Add new serving
    setServings((prev) => [...prev, newServing]);
  }

  setServingForm(initialServing);
};

  // const handleAddServing = () => {
  //   const [nominator, denominator] = servingForm.fraction
  //     .split("/")
  //     .map(Number);

  //   if (servingForm.integral === 0 && servingForm.fraction === "0") {
  //     showSnackbar("Please enter a quantity or serving fraction ", "error");
  //     return;
  //   }

  //   const newServing = {
  //     unit: servingForm.unit,
  //     integral: parseInt(servingForm.integral) || 0,
  //     fraction: servingForm.fraction,
  //     nominator: nominator || 0,
  //     denominator: denominator || 0,
  //     calories: parseFloat(servingForm.calories),
  //     carbs: parseFloat(servingForm.carbs),
  //     protein: parseFloat(servingForm.protein),
  //     fat: parseFloat(servingForm.fat),
  //     fluid: parseFloat(servingForm.fluid)|| 0,
  //   };

  //   setServings((prev) => [...prev, newServing]);
  //   setServingForm(initialServing);
  // };
const handleEditServing = (index) => {
  const selected = servings[index];
  setServingForm(selected);
  setIsEditing(true);
  setEditIndex(index);
};
  const handleCancelEdit = () => {
  setIsEditing(false);
  setEditIndex(null);
  setServingForm(initialServing);
};

  const handleCancel = () => {
    setFormData({ name: "", food_category_ids: [] });
    setServings([]);
    setServingForm(initialServing);
  };

  const handleClose = () => {
    handleCancel();
    onClose();
  };

  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        food_category_ids: [],
      });
      setServings([]);
    }
  }, [open]);

  const handleSubmit = () => {
    const payload = {
      name: formData.name,
      // type: "recipe",
      food_category_ids: formData.food_category_ids,
      food_servings: servings.map(({ fraction, ...rest }) => rest),
    };

    // createFood(payload, {
    //   onError: (err) => console.error("Error creating food:", err),
    // });

    console.log("payload", payload);

    createFood(payload, {
      onSuccess: () => {
        setFormData({
          name: "",
          food_category_ids: [],
        });

        setServings([]);

        onClose();
      },
      onError: (err) => console.error("Error creating food:", err),
    });
  };

  useEffect(() => {
    if (open) {
      setFormData({ name: "", food_category_ids: [] });
      setServings([]);
      setServingForm(initialServing);
    }
  }, [open]);

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.food_category_ids.length > 0 &&
    servings.length > 0;

  if (isCreatingFood || isLoadingCategories || isUnitsLoading)
    return <CommonLoader />;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      key={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          p: 1,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ p: 1 }}>Create Food</DialogTitle>
      <DialogContent dividers sx={{ p: 1 }}>
        <Box className="space-y-4">
          <CustomTextField
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "transparent",
                color: "#4a5568",
                "& fieldset": {
                  borderColor: "#d3d3d3", // default border
                },
                "&:hover fieldset": {
                  borderColor: "#16a34a", // hover green
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#16a34a",
                  boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
                },
              },
            }}
            label="Food Name"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((p) => ({ ...p, name: e.target.value }))
            }
            required
          />

          <CustomAutoComplete
            renderInputLabel="Select Category"
            //   label="Item Categories"
            multiple
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
                label="Item Categories"
                variant="outlined"
              />
            )}
            fullWidth
            sx={{ mt: -1 }}
          />

          {/* Add servings list */}
          <ul className="space-y-2">
  {servings.map((item, idx) => (
    <li
      key={idx}
      className="text-sm bg-gray-100 p-2 rounded flex justify-between items-center"
    >
      <div className="flex flex-wrap gap-1">
        {item.integral > 0 ? `${item.integral} +` : ""}
        {item.fraction !== "0" ? ` ${item.fraction}` : ""} {item.unit}{" "}
        &nbsp;|&nbsp;
        {Number(item.calories) || 0} Cal &nbsp;|&nbsp;
        {Number(item.carbs) || 0}g Carbs &nbsp;|&nbsp;
        {Number(item.protein) || 0}g Protein &nbsp;|&nbsp;
        {Number(item.fat) || 0}g Fat &nbsp;|&nbsp;
        {Number(item.fluid) || 0}ml Fluid
      </div>

      <Box className="flex gap-2">
        <Button
          onClick={() => handleEditServing(idx)}
          size="small"
          variant="outlined"
        >
          Edit
        </Button>
        <Button
          onClick={() =>
            setServings(servings.filter((_, i) => i !== idx))
          }
          size="small"
          color="error"
        >
          Remove
        </Button>
      </Box>
    </li>
  ))}
</ul>

          {/* <ul className="space-y-2">
            {servings.map((item, idx) => (
              <li
                key={idx}
                className="text-sm bg-gray-100 p-2 rounded flex justify-between items-center"
              >
                <div className="flex flex-wrap gap-1">
                  {item.integral > 0 ? `${item.integral} +` : ""}
                  {item.fraction !== "0" ? ` ${item.fraction}` : ""} {item.unit}{" "}
                  &nbsp;|&nbsp;
                  {Number(item.calories) || 0} Cal &nbsp;|&nbsp;
                  {Number(item.carbs) || 0}g Carbs &nbsp;|&nbsp;
                  {Number(item.protein) || 0}g Protein &nbsp;|&nbsp;
                  {Number(item.fat) || 0}g Fat &nbsp;|&nbsp;
                  {Number(item.fluid) || 0}ml Fluid
                </div>

                <Button
                  onClick={() =>
                    setServings(servings.filter((_, i) => i !== idx))
                  }
                  size="small"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul> */}

          {/* Add single serving input */}
          {/* <div className="grid grid-cols-1 gap-2">
            <CustomTextField
              select
              required
              label="Unit"
              value={servingForm.unit}
              onChange={(e) =>
                setServingForm((p) => ({ ...p, unit: e.target.value }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  color: "#4a5568",
                  "& fieldset": {
                    borderColor: "#d3d3d3", // default border
                  },
                  "&:hover fieldset": {
                    borderColor: "#16a34a", // hover green
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#16a34a",
                    boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
                  },
                },
              }}
            >
              <MenuItem value="" disabled>
                Select Unit
              </MenuItem>
              {units.map((u) => (
                <MenuItem key={u.id} value={u.name}>
                  {u.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </div> */}
          <div className="grid grid-cols-4 gap-2">
            <CustomTextField
              select
              required
              label="Unit"
              value={servingForm.unit}
              onChange={(e) =>
                setServingForm((p) => ({ ...p, unit: e.target.value }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  color: "#4a5568",
                  "& fieldset": {
                    borderColor: "#d3d3d3", // default border
                  },
                  "&:hover fieldset": {
                    borderColor: "#16a34a", // hover green
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#16a34a",
                    boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
                  },
                },
              }}
            >
              <MenuItem value="" disabled>
                Select Unit
              </MenuItem>
              {units.map((u) => (
                <MenuItem key={u.id} value={u.name}>
                  {u.name}
                </MenuItem>
              ))}
            </CustomTextField>

            <CustomTextField
              label="Quantity"
              type="number"
              inputProps={{ min: 0 }}
              value={servingForm.integral ?? ""}
              onChange={(e) => {
                const value = e.target.value;

                setServingForm((p) => ({
                  ...p,
                  integral:
                    value === ""
                      ? ""
                      : isNaN(Number(value))
                      ? 0
                      : Math.max(0, Number(value)),
                }));
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  color: "#4a5568",
                  "& fieldset": {
                    borderColor: "#d3d3d3", // default border
                  },
                  "&:hover fieldset": {
                    borderColor: "#16a34a", // hover green
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#16a34a",
                    boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
                  },
                },
              }}
            />

            <CustomTextField
              select
              label="Serving Fraction"
              value={servingForm.fraction}
              onChange={(e) =>
                setServingForm((p) => ({ ...p, fraction: e.target.value }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  color: "#4a5568",
                  "& fieldset": {
                    borderColor: "#d3d3d3", // default border
                  },
                  "&:hover fieldset": {
                    borderColor: "#16a34a", // hover green
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#16a34a",
                    boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
                  },
                },
              }}
            >
              {FRACTIONS.map((f) => (
                <MenuItem key={f.value} value={f.value}>
                  {f.label}
                </MenuItem>
              ))}
            </CustomTextField>

            <CustomTextField
              label="Calories"
              type="number"
              inputProps={{ min: 0 }}
              value={servingForm.calories}
              onChange={(e) =>
                setServingForm((p) => ({
                  ...p,
                  calories: Math.max(0, parseFloat(e.target.value) || 0),
                }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  color: "#4a5568",
                  "& fieldset": {
                    borderColor: "#d3d3d3", // default border
                  },
                  "&:hover fieldset": {
                    borderColor: "#16a34a", // hover green
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#16a34a",
                    boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
                  },
                },
              }}
            />

            <CustomTextField
              label="Carbs (g)"
              type="number"
              inputProps={{ min: 0 }}
              value={servingForm.carbs}
              onChange={(e) =>
                setServingForm((p) => ({
                  ...p,
                  carbs: Math.max(0, parseFloat(e.target.value) || 0),
                }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  color: "#4a5568",
                  "& fieldset": {
                    borderColor: "#d3d3d3", // default border
                  },
                  "&:hover fieldset": {
                    borderColor: "#16a34a", // hover green
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#16a34a",
                    boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
                  },
                },
              }}
            />

            <CustomTextField
              label="Protein (g)"
              type="number"
              inputProps={{ min: 0 }}
              value={servingForm.protein}
              onChange={(e) =>
                setServingForm((p) => ({
                  ...p,
                  protein: Math.max(0, parseFloat(e.target.value) || 0),
                }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  color: "#4a5568",
                  "& fieldset": {
                    borderColor: "#d3d3d3", // default border
                  },
                  "&:hover fieldset": {
                    borderColor: "#16a34a", // hover green
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#16a34a",
                    boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
                  },
                },
              }}
            />

            <CustomTextField
              label="Fat (g)"
              type="number"
              inputProps={{ min: 0 }}
              value={servingForm.fat}
              onChange={(e) =>
                setServingForm((p) => ({
                  ...p,
                  fat: Math.max(0, parseFloat(e.target.value) || 0),
                }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  color: "#4a5568",
                  "& fieldset": {
                    borderColor: "#d3d3d3", // default border
                  },
                  "&:hover fieldset": {
                    borderColor: "#16a34a", // hover green
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#16a34a",
                    boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
                  },
                },
              }}
            />

            <CustomTextField
              label="Fluid (ml)"
              type="number"
              inputProps={{ min: 0 }}
              value={servingForm.fluid}
              onChange={(e) =>
                setServingForm((p) => ({
                  ...p,
                  fluid: Math.max(0, parseFloat(e.target.value) || 0),
                }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "transparent",
                  color: "#4a5568",
                  "& fieldset": {
                    borderColor: "#d3d3d3", // default border
                  },
                  "&:hover fieldset": {
                    borderColor: "#16a34a", // hover green
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#16a34a",
                    boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
                  },
                },
              }}
            />

            {/* <Button variant="outlined" onClick={handleAddServing} size="small">
              Add Serving
            </Button> */}
            <Box className="flex gap-2 col-span-4">
  <Button
    variant="outlined"
    onClick={handleAddServing}
    size="small"
    color={isEditing ? "success" : "primary"}
  >
    {isEditing ? "Update Serving" : "Add Serving"}
  </Button>

  {isEditing && (
    <Button
      variant="outlined"
      color="error"
      size="small"
      onClick={handleCancelEdit}
    >
      Cancel
    </Button>
  )}
</Box>

          </div>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isFormValid || isCreatingFood}
        >
          {isCreatingFood ? <CircularProgress size={16} /> : "Create Food"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
