import { Chip } from "@mui/material";

export const mealTypes = [
  { id: 1, name: "Breakfast" },
  { id: 2, name: "Snack" },
  { id: 3, name: "Lunch" },
  { id: 4, name: "Snack" },
  { id: 5, name: "Dinner" },
];

export const getCaloriesRange = (AverageActivityLevel, FitnessGoal) => {
  let base = 2300; // neutral starting point

  // Adjust base by activity level
  switch (AverageActivityLevel) {
    case "1-low":
      base -= 400;
      break;
    case "2-medium-low":
      base -= 200;
      break;
    case "3-medium":
      base += 0;
      break;
    case "4-medium-high":
      base += 200;
      break;
    case "5-high":
      base += 400;
      break;
    default:
      base += 0;
  }

  // Adjust for goal
  let adjustment = 0;
  switch (FitnessGoal) {
    case "Weight Loss":
      adjustment = -300;
      break;
    case "Decrease Body Fat":
      adjustment = -100;
      break;
    case "Increase Lean Muscle":
      adjustment = +500;
      break;
    case "Weight Gain":
      adjustment = +700;
      break;
    case "None":
    default:
      adjustment = 0;
  }

  const finalCalories = base + adjustment;
  const min = finalCalories - 250;
  const max = finalCalories + 250;

  return [
    {
      label: `${min} – ${max}`,
      value: `${min}-${max}`,
    },
  ];
};





export const formatNumber = (value, decimals = 2) => {
  return typeof value === "number" && value.toFixed
    ? +value.toFixed(decimals)
    : value;
};

export const dayTotalNutrition = (nutritionData, activeDay) => {
  const currentDayDetails = nutritionData?.find(
    (item) => item?.day_number === activeDay
  );

  if (!currentDayDetails) return null;

  const {
    id,
    day_number,
    total_calories,
    total_carbs,
    total_protein,
    total_fat,
    total_fluid,
  } = currentDayDetails;

  const formattedData = {
    id,
    day_number,
    total_calories: total_calories,
    total_carbs: formatNumber(total_carbs),
    total_protein: formatNumber(total_protein),
    total_fat: formatNumber(total_fat),
    total_fluid: total_fluid,
  };

  return formattedData;
};


export const calculateTotalNutrition = (ingredients = []) => {
  return ingredients.reduce(
    (totals, item) => {
      totals.total_calories += item?.calories || 0;
      totals.total_carbs += item?.carbs || 0;
      totals.total_protein += item?.protein || 0;
      totals.total_fat += item?.fat || 0;
      totals.total_fluid += item?.fluid || 0;
      return totals;
    },
    { total_calories: 0, total_carbs: 0, total_protein: 0, total_fat: 0, total_fluid: 0 }
  );
};


// export const calculateTotalNutrition = (ingredients = []) => {
//   const totals = ingredients.reduce(
//     (acc, item) => {
//       acc.calories += item?.calories || 0;
//       acc.carbs += item?.carbs || 0;
//       acc.protein += item?.protein || 0;
//       acc.fat += item?.fat || 0;
//       acc.fluid += item?.fluid || 0;
//       return acc;
//     },
//     { calories: 0, carbs: 0, protein: 0, fat: 0, fluid: 0 }
//   );

//   return {
//     total_calories: totals.calories,
//     total_carbs: formatNumber(totals.carbs),
//     total_protein: formatNumber(totals.protein),
//     total_fat: formatNumber(totals.fat),
//     total_fluid: totals.fluid,
//   };
// };






export const mealSlotNutritionDetails = (
  nutritionData,
  activeDay,
  slotNumber 
) => {
  if (!nutritionData || !Array.isArray(nutritionData)) return null;

  const currentDayDetails = nutritionData.find(
    (item) => item?.day_number === activeDay
  );

  if (!currentDayDetails || !Array.isArray(currentDayDetails.slots)) return null;

  const currentSlotDetails = currentDayDetails.slots.find(
  (item) => item?.meal_slot === slotNumber || item?.id === slotNumber
);

  if (!currentSlotDetails) return null;

  const {
    total_calories = 0,
    total_carbs = 0,
    total_protein = 0,
    total_fat = 0,
    total_fluid = 0,
    foods = [],
  } = currentSlotDetails;

  return {
    ...currentSlotDetails,
    total_calories,
    total_carbs: formatNumber(total_carbs),
    total_protein: formatNumber(total_protein),
    total_fat: formatNumber(total_fat),
    total_fluid,
    foods, // ✅ return normalized foods array
  };
};




export const tempSlotNutritionDetails = (
  nutritionData,
  activeDay,
  slotNumber
) => {
  // Guard against undefined or non-array nutritionData
  if (!nutritionData || !Array.isArray(nutritionData)) {
    return null;
  }

  const currentDayDetails = nutritionData.find(
    (item) => item?.day_number === activeDay
  );

  if (!currentDayDetails || !currentDayDetails.template_slots) {
    return null;
  }

  const currentSlotDetails = currentDayDetails.template_slots.find(
    (item) => item?.id === slotNumber
  );

  if (!currentSlotDetails) return null;

  const { total_calories, total_carbs, total_protein, total_fat, total_fluid } =
    currentSlotDetails;

  const formattedData = {
    ...currentSlotDetails,
    total_calories: total_calories || 0,
    total_carbs: formatNumber(total_carbs || 0),
    total_protein: formatNumber(total_protein || 0),
    total_fat: formatNumber(total_fat || 0),
    total_fluid: total_fluid || 0,
  };

  return formattedData;
};

export const dietTypes = [
  "Vegetarian",
  "Vegan",
  "Non-veg",
  "Keto",
  "Jain",
  "Pescatarian",
  "Mediterranean",
  "Paleo",
  "Gluten-free",
  "Dairy-free",
];

export const commonAllergies = [
  "Peanuts",
  "Tree nuts",
  "Milk",
  "Eggs",
  "Fish",
  "Shellfish",
  "Soy",
  "Wheat",
  "Gluten",
  "Sesame",
  "Mustard",
  "Celery",
  "Lupin",
  "Sulfites",
  "Molluscs",
];

export const popularFoods = [
  "Chicken",
  "Rice",
  "Pasta",
  "Bread",
  "Eggs",
  "Fish",
  "Tofu",
  "Beans",
  "Lentils",
  "Yogurt",
  "Cheese",
  "Nuts",
  "Quinoa",
  "Avocado",
  "Sweet potato",
  "Broccoli",
  "Spinach",
];

// Plan features for each plan tier
export const PLAN_FEATURES = {
  "Free Plan": [
    "Up to 2 customers",
    "Basic dashboard",
    "Email support",
    "Limited access",
  ],
  "Basic Plan": [
    "Up to 10 customers",
    "Full dashboard access",
    "Email & chat support",
    "Monthly reports",
    "Custom branding",
  ],
  "Standard Plan": [
    "Up to 50 customers",
    "Priority support",
    "Advanced analytics",
    "API access",
    "Customizable templates",
    "Unlimited storage",
  ],
  "Premium Plan": [
    "Up to 100 customers",
    "24/7 dedicated support",
    "White-label solution",
    "Advanced integrations",
    "Custom development",
    "Team collaboration tools",
    "Priority feature requests",
  ],
};

// Helper function to format price from cents to dollars
export const formatStripePrice = (amount) => {
  return (amount / 100).toFixed(2);
};

// Status chip component for consistent styling
export const StatusChip = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return { color: "#109A4E", bg: "#e6f7ed" };
      case "draft":
        return { color: "#f5a623", bg: "#fff4e5" };
      case "open":
        return { color: "#2196f3", bg: "#e3f2fd" };
      default:
        return { color: "#757575", bg: "#f5f5f5" };
    }
  };

  const { color, bg } = getStatusConfig(status);

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: bg,
        color: color,
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    />
  );
};

// Helper function to get currency symbol
export const getCurrencySymbol = (currencyCode) => {
  try {
    return (
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
        .formatToParts(1)
        .find((part) => part.type === "currency")?.value || currencyCode
    );
  } catch {
    return currencyCode;
  }
};

// Format currency amount with symbol
export const formatCurrency = (amount, currency = "USD") => {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${parseFloat(amount).toFixed(2)}`;
};

export const validateMealPlanData = (data) => {
  const numberOfDays = data?.number_of_days;
  const mealPlanDays = data?.meal_plan_days || [];

  const errors = [];

  if (!numberOfDays || !Array.isArray(mealPlanDays)) {
    errors.push("Invalid data structure");
    return { isValid: false, errors };
  }

  // 1. Ensure all day numbers from 1 to N are present
  const dayNumbers = mealPlanDays.map((day) => day?.day_number);
  for (let i = 1; i <= numberOfDays; i++) {
    if (!dayNumbers.includes(i)) {
      errors.push(`Day ${i} is missing from meal_plan_days`);
    }
  }

  // 2. Validate each day's slots and serving data
  mealPlanDays.forEach((day) => {
    const slots = day?.meal_plan_slots || [];

    if (slots.length === 0) {
      errors.push(`Day ${day?.day_number} has no meal slots`);
    } else {
      const allSlotsEmpty = slots.every(
        (slot) =>
          !slot?.meal_plan_foods || slot.meal_plan_foods.length === 0
      );
      if (allSlotsEmpty) {
        errors.push(`Day ${day?.day_number} has slots but all are empty`);
      }

      // 3. Validate each food inside each slot
      slots.forEach((slot) => {
        slot.meal_plan_foods?.forEach((food, index) => {
          const hasValidServing =
            // food?.food_serving_id &&
            food?.integral !== null &&
            // food?.unit &&
            (food?.calories > 0 ||
              food?.carbs > 0 ||
              food?.protein > 0 ||
              food?.fat > 0 ||
              food?.fluid > 0);

          if (!hasValidServing) {
            errors.push(
              `Day ${day.day_number}, Slot ${slot.title || slot.meal_slot || "?"}, Food #${index + 1
              } (${food?.food?.name || "Unnamed"}) has no valid serving info`
            );
          }
        });
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateTempPlanData = (data) => {
  const numberOfDays = data?.number_of_days;
  const mealPlanDays = data?.template_days || [];

  const errors = [];

  if (!numberOfDays || !Array.isArray(mealPlanDays)) {
    errors.push("Invalid data structure");
    return { isValid: false, errors };
  }

  // 1. Ensure all day numbers are present
  const dayNumbers = mealPlanDays.map((day) => day?.day_number);
  for (let i = 1; i <= numberOfDays; i++) {
    if (!dayNumbers.includes(i)) {
      errors.push(`Day ${i} is missing from meal_plan_days`);
    }
  }

  // 2. Validate slots and servings
  mealPlanDays.forEach((day) => {
    const slots = day?.template_slots || [];

    if (slots.length === 0) {
      errors.push(`Day ${day?.day_number} has no meal slots`);
    } else {
      const allSlotsEmpty = slots.every(
        (slot) => !slot.template_foods || slot.template_foods.length === 0
      );
      if (allSlotsEmpty) {
        errors.push(`Day ${day?.day_number} has slots but all are empty`);
      }

      // 🔍 Check for missing servings in foods
      slots.forEach((slot) => {
        slot.template_foods?.forEach((food, foodIndex) => {
          const hasValidServing =
            // food?.food_serving_id &&
            food?.integral !== null &&
            // food?.unit &&
            (food?.calories > 0 ||
              food?.carbs > 0 ||
              food?.protein > 0 ||
              food?.fat > 0 ||
              food?.fluid > 0);

          if (!hasValidServing) {
            errors.push(
              `Day ${day.day_number}, Slot ${slot.index || "?"}, Food #${foodIndex + 1
              } (${food?.food?.name || "Unnamed"}) has no valid serving info`
            );
          }
        });
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const Formula = [
  { value: "mifflin", label: "Mifflin-St Jeor (Recommended)" },
  { value: "harris", label: "Revised Harris-Benedict" },
  { value: "katch", label: "Katch-McArdle (Body Fat Required)" },
];

export const Gender = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const HeightUnit = [
  { value: "cm", label: "cm" },
  { value: "inch", label: "in" },
];

export const WeightUnit = [
  { value: "kg", label: "kg" },
  { value: "lbs", label: "lbs" },
];

export const ActivityLevel = [
  { value: "sedentary", label: "Sedentary (little or no exercise)" },
  { value: "light", label: "Lightly Active (light exercise 1-3 days/week)" },
  { value: "moderate", label: "Moderately Active (exercise 3-5 days/week)" },
  {
    value: "active",
    label: "Very Active (daily exercise or intense 3-4 days/week)",
  },
  {
    value: "veryActive",
    label: "Extremely Active (intense daily exercise or physical job)",
  },
];

export const ExerciseIntensity = [
  { value: "light", label: "Light (increased heart rate, easy breathing)" },
  {
    value: "moderate",
    label: "Moderate (elevated heart rate, slightly hard breathing)",
  },
  {
    value: "challenging",
    label: "Challenging (high heart rate, difficult breathing)",
  },
  { value: "intense", label: "Intense (maximum effort, very hard breathing)" },
];
