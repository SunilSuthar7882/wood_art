import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  MenuItem,
  TextField,
  Grid,
  Select,
  InputLabel,
  FormControl,
  Tooltip,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  useAddFoodServingMutation,
  useCreateNewServingSizeUnit,
  useFetchServingUnits,
  useGetFoodServings,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import CommonLoader from "../CommonLoader";
import { toast } from "react-toastify";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { getLocalStorageItem } from "@/helpers/localStorage";
import CustomTextField from "./CustomTextField";
import CustomAutoComplete from "./CustomAutoComplete";
import { Router } from "next/router";

// Fractions
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

export default function AddServingSizeInRecipe({
  totalNutrition,
  loadingMealServing,
  loadingTempServing,
  recipe,
  meal,
  open,
  onClose,
  onSave,
  food,
  dayNutrition,
  initialHasEdited = false,
  refetch,
}) {
  console.log("food", food);
  const role = getLocalStorageItem("role");

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
  const [openServingModal, setOpenServingModal] = useState(false);
  const [openServingUnit, setOpenServingUnit] = useState(false);
  const [servings, setServings] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { data: units = [], isLoading: isUnitsLoading } =
    useFetchServingUnits();
  const { mutate: createServingSize, isPending: isCreatingServingSize } =
    useCreateNewServingSizeUnit({
      onSuccess: () => {
        handleCancel();
      },
    });

  const { mutate: addServing, isPending: isAddServingPending } =
    useAddFoodServingMutation();

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

  const handleAddServing = () => {
    if (integral === 0 && nominator === 0 && denominator === 0) {
      toast.error("Please enter a serving size");
      return;
    }

    const [nominator, denominator] = servingForm.fraction
      .split("/")
      .map(Number);

    const payload = {
      food_id: food?.ingredient?.id,
      unit: servingForm.unit,
      integral: parseInt(servingForm.integral) || 0,
      nominator: nominator || 0,
      denominator: denominator || 0,
      calories: parseFloat(servingForm.calories),
      carbs: parseFloat(servingForm.carbs),
      protein: parseFloat(servingForm.protein),
      fat: parseFloat(servingForm.fat),
      fluid: parseFloat(servingForm.fluid),
    };

    console.log(payload);

    addServing(payload, {
      onSuccess: () => {
        setServingForm(initialServing);
        setOpenServingModal(false);
        refetch?.();
      },
    });
  };

  const handleCancel = () => {
    Router.back();
  };

  const foodId = food?.ingredient?.id;
  const foodName = food?.ingredient?.name;

  const { showSnackbar } = useSnackbar();
  const [selectedUnit, setSelectedUnit] = useState("");
  const [integral, setIntegral] = useState(0);
  const [fraction, setFraction] = useState("0");
  const [hasEdited, setHasEdited] = useState(initialHasEdited);
  const [initialIntegral, setInitialIntegral] = useState(0);
  const [initialFraction, setInitialFraction] = useState("0");
  const [initialUnit, setInitialUnit] = useState(selectedUnit);

  const { data: foodData } = useGetFoodServings({ food_id: foodId });
  console.log("foodData", foodData);
  const servingData = foodData?.data?.servings ?? [];
  const unitOptions = [...new Set(servingData.map((s) => s.unit))];

  const baseServing = useMemo(() => {
    return servingData.find((s) => s.unit === selectedUnit);
  }, [selectedUnit, servingData]);

  // Fraction multiplier
  const fractionMultiplier = useMemo(() => {
    if (fraction === "0") return 0;
    const [num, den] = fraction.split("/").map(Number);
    return num / den;
  }, [fraction]);

  //correct
  const calculated = useMemo(() => {
    if (!baseServing) return null;

    const i = Number(integral) || 0;
    const f = fractionMultiplier || 0;
    const selectedQty = i + f;

    const baseIntegral = Number(baseServing.integral ?? 1);
    const baseFraction =
      baseServing.nominator && baseServing.denominator
        ? baseServing.nominator / baseServing.denominator
        : 0;

    const baseQty = baseIntegral + baseFraction;

    if (!baseQty || baseQty === 0) return null; // Avoid division by zero

    const scale = selectedQty / baseQty;

    const calc = (val) => Number(val ?? 0) * scale;

    return {
      calories: calc(baseServing.calories).toFixed(2),
      carbs: calc(baseServing.carbs).toFixed(2),
      protein: calc(baseServing.protein).toFixed(2),
      fat: calc(baseServing.fat).toFixed(2),
      fluid: calc(baseServing.fluid).toFixed(2),
    };
  }, [baseServing, integral, fractionMultiplier]);

  const updatedMealTotals = useMemo(() => {
    if (!baseServing || !meal) return null;

    const keys = ["calories", "carbs", "protein", "fat", "fluid"];

    const existingFood = meal.foods?.find((f) => f.food?.id === food?.id);
    console.log("mealFood", existingFood);
    const originalQty = existingFood
      ? Number(existingFood.integral ?? 0) +
        ((existingFood.denominator ?? 1) > 0
          ? Number(existingFood.nominator ?? 0) /
            Number(existingFood.denominator ?? 1)
          : 0)
      : 0;

    const newQty = Number(integral) + fractionMultiplier;

    const baseIntegral = Number(baseServing.integral ?? 1);
    const baseFraction =
      baseServing.nominator && baseServing.denominator
        ? baseServing.nominator / baseServing.denominator
        : 0;
    const baseQty = baseIntegral + baseFraction || 1; // avoid div by zero

    const updatedTotals = {};

    for (const key of keys) {
      const perUnit = baseServing?.[key] ?? 0;

      // ✅ properly scale values relative to baseQty
      const oldVal = (originalQty / baseQty) * perUnit;
      const newVal = (newQty / baseQty) * perUnit;

      const prevTotal = Number(meal?.[`total_${key}`] ?? 0);
      const updatedTotal = prevTotal - oldVal + newVal;

      updatedTotals[`total_${key}`] = updatedTotal.toFixed(2);
    }

    return updatedTotals;
  }, [meal, food, baseServing, integral, fractionMultiplier]);

  console.log("baseServing", baseServing);

  const updatedTotalNutrition = useMemo(() => {
    if (!baseServing || !dayNutrition) return null;

    const keys = ["calories", "carbs", "protein", "fat", "fluid"];

    const getIngredientId = (x) => {
      const candidates = [
        x?.ingredient?.id,
        x?.food?.ingredient?.id,
        x?.ingredient_id,
        x?.food_id,
        x && x.name && x.id ? x.id : undefined,
      ];
      return candidates.find((v) => v !== undefined && v !== null);
    };

    const mealFoods = meal?.foods ?? [];
    const foodIngredientId = getIngredientId(food);

    const existingFood = food;

    // old vs new qty
    const originalQty =
      Number(existingFood?.integral ?? 0) +
      Number(existingFood?.nominator ?? 0) /
        Number(existingFood?.denominator || 1);
    const newQty = Number(integral ?? 0) + Number(fractionMultiplier ?? 0);

    // normalize base
    const baseIntegral = Number(baseServing.integral ?? 0);
    const baseDen = Number(baseServing.denominator ?? 1);
    const baseFraction =
      Number(baseServing.nominator ?? 0) > 0 && baseDen > 0
        ? Number(baseServing.nominator) / baseDen
        : 0;
    const baseQty = baseIntegral + baseFraction || 1;

    const updatedTotals = {};

    // check if this food has never been added (all nutrition 0)
    const isFirstTimeAdd =
      existingFood && keys.every((k) => Number(existingFood[k] ?? 0) === 0);

    console.groupCollapsed("[Update Day Totals]");
    console.log("foodIngredientId:", foodIngredientId);
    console.log("existingFood:", existingFood);
    console.log(
      "originalQty:",
      originalQty,
      "newQty:",
      newQty,
      "baseQty:",
      baseQty
    );
    console.log(
      "mode:",
      !existingFood
        ? "ADD"
        : isFirstTimeAdd
        ? "ADD_FIRST"
        : newQty !== originalQty
        ? "EDIT"
        : "NO CHANGE"
    );

    for (const key of keys) {
      const perUnit = Number(baseServing?.[key] ?? 0) / baseQty;
      const prevTotal = Number(
        dayNutrition?.[`total_${key}`] ?? dayNutrition?.[key] ?? 0
      );

      let result;
      if (!existingFood || isFirstTimeAdd) {
        // First time add (new or zero nutrition existingFood)
        const addVal = newQty * perUnit;
        result = prevTotal + addVal;
        console.log(
          `➕ [${key}] ADD new:${newQty} addVal:${addVal} = ${result}`
        );
      } else if (newQty !== originalQty) {
        // EDIT only if qty changed
        const oldVal = originalQty * perUnit;
        const newVal = newQty * perUnit;
        result = prevTotal - oldVal + newVal;
        console.log(
          `✏️ [${key}] EDIT old:${originalQty} new:${newQty} = ${result}`
        );
      } else {
        // No change
        result = prevTotal;
        console.log(`⭕ [${key}] NO CHANGE qty:${newQty}`);
      }

      updatedTotals[key] = result.toFixed(2);
    }

    console.groupEnd();
    return updatedTotals;
  }, [baseServing, dayNutrition, meal, food, integral, fractionMultiplier]);

  console.log("hasEdited", hasEdited);
  console.log("totalNutrition", totalNutrition);
  console.log("updatedDayNutrition", updatedTotalNutrition);

  useEffect(() => {
    console.log({ baseServing, totalNutrition, integral, fractionMultiplier });
  }, [baseServing, totalNutrition, integral, fractionMultiplier]);

  const handleSaveServing = () => {
    if (!baseServing || !selectedUnit) return;

    if (fraction === "0" && integral === 0) {
      showSnackbar("Please add serving size/quantity before saving.", "error");
      return;
    }

    const payload = {
      food_serving_id: baseServing.id,
      unit: selectedUnit,
      integral,
      fraction,
      calories: parseFloat(calculated?.calories || 0),
      carbs: parseFloat(calculated?.carbs || 0),
      protein: parseFloat(calculated?.protein || 0),
      fat: parseFloat(calculated?.fat || 0),
      fluid: parseFloat(calculated?.fluid || 0),
      ingredient_id: baseServing.id,
    };

    onSave(payload);

    onClose();
  };

  useEffect(() => {
    if (unitOptions.length && !selectedUnit) {
      setSelectedUnit(unitOptions[0]);
    }
  }, [unitOptions]);

  useEffect(() => {
    if (!open) {
      setHasEdited(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && food) {
      // console.log("dfgjbhfukrfbtv",food);
      // console.log("meallllllllll",meal);
      const fullFood = food;
      console.log("fulllllfodddddd", fullFood);
      if (fullFood) {
        // ✅ CASE 2: Updating existing food
        const parsedIntegral = Number(fullFood.integral ?? 1);
        const fraction =
          fullFood.nominator && fullFood.denominator
            ? `${fullFood.nominator}/${fullFood.denominator}`
            : "0";
        const parsedUnit = fullFood.unit;
        setInitialIntegral(parsedIntegral);
        setInitialFraction(fraction);
        setInitialUnit(parsedUnit);

        setIntegral(parsedIntegral);
        setFraction(fraction);
        setSelectedUnit(fullFood.unit ?? "");
      } else {
        // ✅ CASE 1: Adding new food — default values
        setInitialIntegral(1);
        setInitialFraction("0");

        setIntegral(1);
        setFraction("0");
        setSelectedUnit(""); // will be set when servingData loads
      }

      // ✅ Reset editing flags
      setHasEdited(false);
      // setIntegralChanged(false);
      // setFractionChanged(false);
    }
  }, [open, food]);

  console.log("selectedUnitselectedUnit", selectedUnit);
  console.log("initialUnit", initialUnit);
  useEffect(() => {
    const integralChanged = integral !== initialIntegral;
    const fractionChanged = fraction !== initialFraction;
    const unitsChanged = selectedUnit !== initialUnit;

    if (integralChanged || fractionChanged || unitsChanged) {
      setHasEdited(true);
    } else {
      setHasEdited(false);
    }
  }, [integral, fraction, initialIntegral, initialFraction, initialUnit]);

  const finalNutrition = updatedTotalNutrition ?? {
    calories: totalNutrition?.calories ?? 0,
    carbs: totalNutrition?.carbs ?? 0,
    protein: totalNutrition?.protein ?? 0,
    fat: totalNutrition?.fat ?? 0,
    fluid: totalNutrition?.fluid ?? 0,
  };

  // console.log("finalNutrition",finalNutrition)
  if (loadingMealServing || loadingTempServing) return <CommonLoader />;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 750,
          p: 2,
          m: 1,
        },
      }}
    >
      <div className="flex justify-between items-center flex-wrap">
        {/* <DialogTitle sx={{ p: 1 }}>Add Serving Size for {foodName}</DialogTitle> */}
        <Tooltip title={foodName}>
          <DialogTitle
            sx={{
              p: 1,
              maxWidth: "500px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Add Serving Size for {foodName}
          </DialogTitle>
        </Tooltip>

        {role === "admin" && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpenServingModal(true)}
            sx={{ textTransform: "none" }}
          >
            Add Your Own Custom Size
          </Button>
        )}
      </div>
      <DialogContent dividers sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {/* Unit dropdown */}
          <Grid item xs={6} sm={4}>
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: "0.8rem",
                  py: 0.5,
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.80rem",
                },
              }}
            >
              <InputLabel id="fraction-label">Serving Units</InputLabel>
              <Select
                fullWidth
                size="small"
                value={selectedUnit}
                label="Unit"
                onChange={(e) => setSelectedUnit(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": {
                    fontSize: "0.8rem",
                    py: 0.5,
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "0.80rem",
                  },
                }}
              >
                {unitOptions.map((unit) => (
                  <MenuItem key={unit} value={unit} sx={{ fontSize: "0.8rem" }}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Integral */}
          <Grid item xs={3} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Quantity"
              type="number"
              inputProps={{ min: 0 }}
              value={integral}
              onChange={(e) => {
                setIntegral(Number(e.target.value));
                // setIntegralChanged(true);
              }}
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: "0.8rem",
                  py: 0.5,
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.80rem",
                },
              }}
            />
          </Grid>

          {/* Fraction dropdown */}
          <Grid item xs={3} sm={4}>
            <FormControl
              fullWidth
              size="small"
              sx={{
                "& .MuiInputBase-root": {
                  fontSize: "0.8rem",
                  py: 0.5,
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.80rem",
                },
              }}
            >
              <InputLabel id="fraction-label">Serving Fraction</InputLabel>
              <Select
                labelId="fraction-label"
                value={fraction}
                label="Fraction"
                onChange={(e) => {
                  setFraction(e.target.value);
                  // setFractionChanged(true);
                }}
              >
                {FRACTIONS.map((f) => (
                  <MenuItem
                    key={f.value}
                    value={f.value}
                    sx={{ fontSize: "0.8rem" }}
                  >
                    {f.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Nutrition values */}
        {calculated && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{
                __html: Object.entries(calculated)
                  .map(([key, value]) => {
                    const unitMap = {
                      calories: "kcal",
                      carbs: "g",
                      protein: "g",
                      fat: "g",
                      fluid: "fl oz",
                    };
                    const label = key.charAt(0).toUpperCase() + key.slice(1);
                    return `<strong>${label}:</strong> ${value} ${
                      unitMap[key] || ""
                    }`;
                  })
                  .join(" | "),
              }}
            />
          </Box>
        )}

        {(updatedMealTotals ?? meal) && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "#fff3e0",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              Current Nutrition:
            </Typography>

            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{
                __html: [
                  { label: "Calories", key: "total_calories", unit: "kcal" },
                  { label: "Carbs", key: "total_carbs", unit: "g" },
                  { label: "Protein", key: "total_protein", unit: "g" },
                  { label: "Fat", key: "total_fat", unit: "g" },
                  { label: "Fluid", key: "total_fluid", unit: "fl oz" },
                ]
                  .map(({ label, key, unit }) => {
                    const source = updatedMealTotals ?? meal;
                    const raw = source?.[key];
                    const value = Number(raw ?? 0)
                      .toFixed(2)
                      .replace(/\.00$/, "");
                    return `<strong>${label}:</strong> ${value} ${unit}`;
                  })
                  .join(" | "),
              }}
            />
          </Box>
        )}

        {finalNutrition && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "#e0f7fa",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="body2" fontWeight={600}>
              Recipe Total Nutrition:
            </Typography>

            <Typography
              variant="body2"
              dangerouslySetInnerHTML={{
                __html: [
                  { label: "Calories", key: "calories", unit: "kcal" },
                  { label: "Carbs", key: "carbs", unit: "g" },
                  { label: "Protein", key: "protein", unit: "g" },
                  { label: "Fat", key: "fat", unit: "g" },
                  { label: "Fluid", key: "fluid", unit: "fl oz" },
                ]
                  .map(({ label, key, unit }) => {
                    const raw = finalNutrition?.[key] ?? 0;
                    const value = parseFloat(raw)
                      .toFixed(2)
                      .replace(/\.00$/, "");
                    return `<strong>${label}:</strong> ${value} ${unit}`;
                  })
                  .join(" | "),
              }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSaveServing}
          variant="contained"
          disabled={!selectedUnit}
        >
          Save
        </Button>
      </DialogActions>

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
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Serving Details
            </Typography>

            {/* Integral & Fraction */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {/* <TextField
                select
                name="unit"
                value={servingForm.unit}
                onChange={(e) =>
                  setServingForm((prev) => ({ ...prev, unit: e.target.value }))
                }
                fullWidth
                size="small"
                required
                SelectProps={{
                  MenuProps: {
                    disablePortal: true,
                    PaperProps: {
                      sx: {
                        maxWidth: 500,
                        maxHeight: 400,
                        overflow: "auto",
                        zIndex: 1500, // higher than form content
                      },
                    },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                  },
                }}
                error={!servingForm.unit}
                helperText={!servingForm.unit ? "Unit is required" : ""}
              >
                <MenuItem value="">Select Unit</MenuItem>
                {units.map((unit) => {
                  // Remove numeric, fractional, decimal, negative signs, quotes, and leading spaces
                  const cleanedName = unit.name
                    .replace(/^[-\d\s\/.,¼½¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞"'`]+/, "")
                    .trim();

                  return (
                    <MenuItem key={unit.id} value={cleanedName}>
                      {cleanedName}
                    </MenuItem>
                  );
                })}

                {units.map((unit) => (
                  <MenuItem key={unit.id} value={unit.name}>
                    {unit.name}
                  </MenuItem>
                ))}
              </TextField> */}

              <CustomAutoComplete
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
            disabled={!inputValue}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
