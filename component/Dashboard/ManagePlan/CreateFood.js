import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useCreateFood } from "@/helpers/hooks/mamAdmin/mealPlanList";
import CloseIcon from '@mui/icons-material/Close';

const CreateFood = ({ open, onClose, onReset, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    // type: "",
    calories: "",
    carbs: "",
    protein: "",
    fat: "",
    fluid: "",
    food_category_ids: [1],
  });

  const { mutate:createFood, isPending } = useCreateFood();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

   const handleSubmit = () => {
    createFood(formData, {
      onSuccess: () => {
        resetForm();
        onClose();
      },
    });
  };


  const handleClose = () => {
    resetForm();
    onClose();
  };
  useEffect(() => {
  if (!open) {
    resetForm();
  }
}, [open]);
  const resetForm = () => {
    setFormData({
      name: "",
      // type: "recipe",
      calories: "",
      carbs: "",
      protein: "",
      fat: "",
      fluid: "",
      food_category_ids: [],
    });
    if (onReset) onReset();
  };

  return (
   <Modal open={open} onClose={handleClose}>
  <Box
    className="bg-white p-4 rounded-lg shadow-md w-full max-w-sm mx-auto"
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      outline: 'none',
    }}
  >
    {/* Close button top right */}
    <IconButton
      onClick={handleClose}
      size="small"
      sx={{ position: 'absolute', top: 8, right: 8 }}
      aria-label="close"
    >
      <CloseIcon sx={{ fontSize: 20 }} />
    </IconButton>

    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
      Create New Food Item
    </Typography>

    <TextField
      fullWidth
      size="small"
      label="Name"
      name="name"
      value={formData.name}
      onChange={handleChange}
      margin="dense"
    />

    <TextField
      fullWidth
      size="small"
      label="Calories"
      name="calories"
      type="number"
      value={formData.calories}
      onChange={handleChange}
      margin="dense"
    />

    <div className="grid grid-cols-3 gap-2">
      <TextField
        size="small"
        label="Carbs"
        name="carbs"
        type="number"
        value={formData.carbs}
        onChange={handleChange}
        margin="dense"
      />
      <TextField
        size="small"
        label="Protein"
        name="protein"
        type="number"
        value={formData.protein}
        onChange={handleChange}
        margin="dense"
      />
      <TextField
        size="small"
        label="Fat"
        name="fat"
        type="number"
        value={formData.fat}
        onChange={handleChange}
        margin="dense"
      />
    </div>

    <TextField
      fullWidth
      size="small"
      label="Fluid (ml)"
      name="fluid"
      type="number"
      value={formData.fluid}
      onChange={handleChange}
      margin="dense"
    />

    <div className="flex justify-end gap-2 pt-4">
      <Button size="small" onClick={handleClose} disabled={isPending}>
        Cancel
      </Button>
      <Button
        size="small"
        variant="contained"
        onClick={handleSubmit}
        disabled={isPending}
      >
        {isPending ? <CircularProgress size={16} /> : "Add"}
      </Button>
    </div>
  </Box>
</Modal>
  );
};

export default CreateFood;
