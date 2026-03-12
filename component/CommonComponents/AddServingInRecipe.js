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
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useGetFoodServings } from "@/helpers/hooks/mamAdmin/mealPlanList";
import CommonLoader from "../CommonLoader";
import { useSnackbar } from "@/app/contexts/SnackbarContext";

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

export default function AddServingInRecipe({
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
}) {
  const foodId = food?.id;
  const foodtype = food?.type;
  const foodServings = recipe?.map((item) => ({
    id: item.id,
    name: item.ingredient?.name,
    food_id: item.ingredient?.id,
    quantity: `${item.integral} ${item.unit ?? ""}`.trim(),
    calories: item.calories,
    carbs: item.carbs,
    protein: item.protein,
    fat: item.fat,
    fluid: item.fluid,
    nominator: item.nominator,
    denominator: item.denominator,
    unit: item.unit,
  }));

  const { showSnackbar } = useSnackbar();
  const [selectedUnit, setSelectedUnit] = useState("");
  const [integral, setIntegral] = useState(1);
  const [fraction, setFraction] = useState("0");
  const [hasEdited, setHasEdited] = useState(initialHasEdited);
  const [integralChanged, setIntegralChanged] = useState(false);
  const [fractionChanged, setFractionChanged] = useState(false);
  const [initialIntegral, setInitialIntegral] = useState(1);
  const [initialFraction, setInitialFraction] = useState("0");

  const { data: foodData } = useGetFoodServings({ food_id: foodId });
  const rawServings = foodData?.data?.servings;
  const foodType = foodData?.data?.food_type;
  // Normalize to array
  const servingData = Array.isArray(rawServings)
    ? rawServings
    : rawServings
    ? [rawServings]
    : [];

  // Extract units (only if the serving has a `unit` key)
  // const unitOptions = [
  //   ...new Set(servingData.map((s) => s.unit).filter(Boolean)),
  // ];

  //   const baseServing = useMemo(() => {
  //   return foodData?.data?.servings || null;
  // }, [foodData?.data?.servings]);

  const baseServing = useMemo(() => {
    const serving = foodData?.data?.servings;

    if (!serving || !meal || !meal.foods) return serving || null;

    const matchedFood = meal.foods.find((f) => f.food?.id === serving.id);

    if (!matchedFood) return serving;

    // Merge matched food from meal with serving from API
    return {
      ...matchedFood,
      ...serving,
    };
  }, [foodData?.data?.servings, meal]);

  const number_of_servings = baseServing?.no_of_servings;

  // Fraction multiplier
  //   const fractionMultiplier = useMemo(() => {
  //   if (foodType === "recipe") {
  //     const nom = baseServing?.nominator;
  //     const den = baseServing?.denominator;

  //     if (!nom || !den || isNaN(nom) || isNaN(den)) return 0;

  //     return nom / den;
  //   }

  //   if (!fraction || fraction === "0") return 0;

  //   const [num, den] = fraction.split("/").map(Number);
  //   if (!den || isNaN(num) || isNaN(den)) return 0;

  //   return num / den;
  // }, [fraction, foodType, baseServing]);

  const fractionMultiplier = useMemo(() => {
    if (fraction === "0") return 0;
    const [num, den] = fraction.split("/").map(Number);
    return num / den;
  }, [fraction]);

  const calculated = useMemo(() => {
    if (!baseServing) return null;

    const selectedQty = Number(integral) + (fractionMultiplier || 0);

    const calc = (val) => Number(val ?? 0) * selectedQty;

    return {
      calories: calc(baseServing.total_calories).toFixed(2),
      carbs: calc(baseServing.total_carbs).toFixed(2),
      protein: calc(baseServing.total_protein).toFixed(2),
      fat: calc(baseServing.total_fat).toFixed(2),
      fluid: calc(baseServing.total_fluid).toFixed(2),
    };
  }, [baseServing, integral, fractionMultiplier]);

  const updatedMealTotals = useMemo(() => {
    if (!baseServing || !meal) return null;

    const keys = ["calories", "carbs", "protein", "fat", "fluid"];

    const existingFood = meal.foods?.find((f) => f.food?.id === food?.id);

    const originalQty = existingFood
      ? Number(existingFood.integral ?? 0) +
        ((existingFood.denominator ?? 1) > 0
          ? Number(existingFood.nominator ?? 0) /
            Number(existingFood.denominator ?? 1)
          : 0)
      : 0;

    const newQty = Number(integral) + fractionMultiplier;

    const updatedTotals = {};

    for (const key of keys) {
      const perUnit = baseServing?.[`total_${key}`] ?? 0;

      const oldVal = originalQty * perUnit;
      const newVal = newQty * perUnit;

      const prevTotal = Number(meal?.[`total_${key}`] ?? 0);
      const updatedTotal = prevTotal - oldVal + newVal;

      updatedTotals[`total_${key}`] = updatedTotal.toFixed(2);
    }

    return updatedTotals;
  }, [meal, food, baseServing, integral, fractionMultiplier]);

  const updatedDayNutrition = useMemo(() => {
    if (!baseServing || !dayNutrition) return null;

    const existingFood = meal?.foods?.find((f) => f.food?.id === food?.id);
    const keys = ["calories", "carbs", "protein", "fat", "fluid"];

    // Get original quantity if updating
    const originalQty = existingFood
      ? Number(existingFood.integral ?? 0) +
        ((existingFood.denominator ?? 1) > 0
          ? Number(existingFood.nominator ?? 0) /
            Number(existingFood.denominator ?? 1)
          : 0)
      : 0;

    const newQty = Number(integral) + fractionMultiplier;
    const updatedTotals = {};

    for (const key of keys) {
      const perUnit = baseServing?.[`total_${key}`] ?? 0;
      const oldVal = originalQty * perUnit;
      const newVal = newQty * perUnit;

      const prevTotal = Number(dayNutrition?.[`total_${key}`] ?? 0);
      const updatedTotal = prevTotal - oldVal + newVal;

      updatedTotals[key] = updatedTotal.toFixed(2);
    }

    return updatedTotals;
  }, [baseServing, integral, fractionMultiplier, meal, food, dayNutrition]);

  const handleSaveServing = () => {
    if (!baseServing) return;

    if (fraction === "0" && integral === 0) {
      showSnackbar("Please add serving size/quantity before saving.", "error");
      return;
    }

    const payload = {
      food_type: "recipe",
      // unit: selectedUnit,
      integral,
      fraction,
      calories: parseFloat(calculated?.calories || 0),
      carbs: parseFloat(calculated?.carbs || 0),
      protein: parseFloat(calculated?.protein || 0),
      fat: parseFloat(calculated?.fat || 0),
      fluid: parseFloat(calculated?.fluid || 0),
      food_serving_id: baseServing.id,
    };

    onSave(payload);

    onClose();
  };

  useEffect(() => {
    if (!open) {
      setHasEdited(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && food && meal) {
      const fullFood = meal.foods?.find((f) => f.food?.id === food.id);

      if (fullFood) {
        const parsedIntegral = Number(fullFood.integral ?? 1);
        const fraction =
          fullFood.nominator && fullFood.denominator
            ? `${fullFood.nominator}/${fullFood.denominator}`
            : "0";

        setInitialIntegral(parsedIntegral);
        setInitialFraction(fraction);

        setIntegral(parsedIntegral);
        setFraction(fraction);
      } else {
        setInitialIntegral(1);
        setInitialFraction("0");

        setIntegral(1);
        setFraction("0");
      }

      setHasEdited(false);
      setIntegralChanged(false);
      setFractionChanged(false);
    }
  }, [open, food, meal]);

  useEffect(() => {
    const integralChanged = integral !== initialIntegral;
    const fractionChanged = fraction !== initialFraction;

    if (integralChanged || fractionChanged) {
      setHasEdited(true);
    } else {
      setHasEdited(false);
    }
  }, [integral, fraction, initialIntegral, initialFraction]);

  const finalNutrition = updatedDayNutrition ?? {
    calories: dayNutrition?.total_calories ?? 0,
    carbs: dayNutrition?.total_carbs ?? 0,
    protein: dayNutrition?.total_protein ?? 0,
    fat: dayNutrition?.total_fat ?? 0,
    fluid: dayNutrition?.total_fluid ?? 0,
  };

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
      <DialogTitle sx={{ p: 1 }}>Add Serving Size for {food?.name}</DialogTitle>
      <DialogContent dividers sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {/* Unit dropdown */}

          {/* Integral */}

          <Grid item xs={6}>
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
              <InputLabel id="servings-label">No. of Servings</InputLabel>
              <Select
                labelId="servings-label"
                value={integral}
                label="No. of Servings"
                onChange={(e) => {
                  setIntegral(Number(e.target.value));
                  setIntegralChanged(true);
                }}
              >
                {/* {Array.from(
                  { length: number_of_servings },
                  (_, i) => i + 1
                ).map((num) => (
                  <MenuItem key={num} value={num} sx={{ fontSize: "0.8rem" }}>
                    {num}
                  </MenuItem>
                ))} */}
                {Array.from({ length: 11 }, (_, i) => i).map((num) => (
                  <MenuItem key={num} value={num} sx={{ fontSize: "0.8rem" }}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Serving Fraction */}
          <Grid item xs={6}>
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
                  setFractionChanged(true);
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
              {meal.title || `Meal Slot ${meal.meal_slot}`} Nutrition:
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
              Day Total Nutrition:
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
          // disabled={!selectedUnit}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
