"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Typography,
  Box,
  Autocomplete,
} from "@mui/material";

export default function AddServingModal({
  loading,
  open,
  onClose,
  onAdd,
  units = [],
  servingForm,
  setServingForm,
}) {
  // console.log("Umits ==> ", units);
  const handleChange = (key, value) => {
    setServingForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isFormValid =
    servingForm.unit &&
    servingForm.integral &&
    !isNaN(servingForm.integral) &&
    parseFloat(servingForm.calories) >= 0 &&
    parseFloat(servingForm.carbs) >= 0 &&
    parseFloat(servingForm.protein) >= 0 &&
    parseFloat(servingForm.fat) >= 0 &&
    parseFloat(servingForm.fluid) >= 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { p: 1 } }}
    >
      <DialogTitle sx={{ p: 1 }}>Add Serving</DialogTitle>

      <DialogContent dividers sx={{ p: 1 }}>
        <Box className="bg-gray-50 rounded-md border" sx={{ p: 2 }}>
          <Autocomplete
            size="small"
            options={units}
            getOptionLabel={(option) => option?.name || ""}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            value={servingForm.unit || null}
            onChange={(event, newValue) => handleChange("unit", newValue)}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Unit"
                placeholder="Search unit..."
                fullWidth
              />
            )}
          />

          <div className="grid grid-cols-2 gap-2 mb-3 mt-5">
            <TextField
              size="small"
              label="Quantity"
              name="integral"
              type="number"
              value={servingForm.integral}
              onChange={(e) => handleChange("integral", e.target.value)}
              fullWidth
              inputProps={{ min: 0, inputMode: "numeric", pattern: "[0-9]*" }}
            />

            <TextField
              select
              label="Serving Fraction"
              name="fraction"
              value={servingForm.fraction}
              onChange={(e) => handleChange("fraction", e.target.value)}
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

            {/* <TextField
              fullWidth
              size="small"
              label="Calories"
              name="calories"
              type="number"
              value={servingForm.calories}
              onChange={(e) => handleChange("calories", e.target.value)}
              inputProps={{ min: 0 }}
            /> */}
          </div>

          <div className="grid grid-cols-5 gap-2">
            {["calories", "carbs", "protein", "fat", "fluid"].map((field) => (
              <TextField
                key={field}
                size="small"
                label={
                  field === "fluid"
                    ? "Fluid (ml)"
                    : field.charAt(0).toUpperCase() + field.slice(1)
                }
                name={field}
                type="number"
                value={servingForm[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                fullWidth
                inputProps={{ min: 0 }}
              />
            ))}
          </div>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 1 }}>
        <Button onClick={onClose} size="small">
          Cancel
        </Button>
        <Button
          onClick={onAdd}
          variant="contained"
          size="small"
          disabled={loading || !isFormValid}
        >
          {loading ? "Adding..." : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
