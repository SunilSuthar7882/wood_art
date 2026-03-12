// utils/constants.js
export const activityData = [
  {
    label: "Sedentary",
    value: "1.2",
    description: "Little or no exercise, desk job",
  },
  {
    label: "Lightly Active",
    value: "1.375",
    description: "Light exercise 1-3 days/week",
  },
  {
    label: "Moderately Active",
    value: "1.465",
    description: "Moderate exercise 3-5 days/week",
  },
  {
    label: "Very Active",
    value: "1.55",
    description: "Hard exercise 6-7 days/week",
  },
  {
    label: "Extremely Active",
    value: "1.725",
    description: "Very hard exercise, physical job or training twice a day",
  },
];

export const goalData = [
  {
    label: "Maintain Weight",
    value: "m",
    description: "Maintain your current weight",
  },
  {
    label: "Mild Weight Loss",
    value: "l",
    description: "Lose 0.25 kg per week (mild deficit)",
  },
  {
    label: "Weight Loss",
    value: "l1",
    description: "Lose 0.5 kg per week (moderate deficit)",
  },
  {
    label: "Aggressive Weight Loss",
    value: "l2",
    description: "Lose 1 kg per week (aggressive deficit)",
  },
  {
    label: "Mild Weight Gain",
    value: "g",
    description: "Gain 0.25 kg per week (mild surplus)",
  },
  {
    label: "Weight Gain",
    value: "g1",
    description: "Gain 0.5 kg per week (moderate surplus)",
  },
  {
    label: "Aggressive Weight Gain",
    value: "g2",
    description: "Gain 1 kg per week (aggressive surplus)",
  },
];

export const dietConfig = {
  balanced: {
    protein: 30,
    carbs: 40,
    fat: 30,
  },
  lowCarb: {
    protein: 40,
    carbs: 20,
    fat: 40,
  },
  highProtein: {
    protein: 40,
    carbs: 30,
    fat: 30,
  },
  keto: {
    protein: 25,
    carbs: 5,
    fat: 70,
  },
  mediterranean: {
    protein: 20,
    carbs: 50,
    fat: 30,
  },
};

// Validation schemas for form fields
export const validationRules = {
  age: {
    required: "Age is required",
    min: { value: 15, message: "Age must be at least 15" },
    max: { value: 100, message: "Age must be less than 100" },
    pattern: { value: /^[0-9]+$/, message: "Please enter a valid age" },
  },
  weight: {
    required: "Weight is required",
    min: { value: 40, message: "Weight must be at least 40kg" },
    max: { value: 200, message: "Weight must be less than 200kg" },
    pattern: {
      value: /^[0-9]+(\.[0-9]{1,2})?$/,
      message: "Please enter a valid weight",
    },
  },
  height: {
    required: "Height is required",
    min: { value: 140, message: "Height must be at least 140cm" },
    max: { value: 220, message: "Height must be less than 220cm" },
    pattern: { value: /^[0-9]+$/, message: "Please enter a valid height" },
  },
  waist: {
    required: "Waist measurement is required",
    min: { value: 50, message: "Waist must be at least 50cm" },
    max: { value: 150, message: "Waist must be less than 150cm" },
    pattern: {
      value: /^[0-9]+(\.[0-9]{1,2})?$/,
      message: "Please enter a valid measurement",
    },
  },
  hips: {
    required: "Hip measurement is required",
    min: { value: 70, message: "Hip measurement must be at least 70cm" },
    max: { value: 170, message: "Hip measurement must be less than 170cm" },
    pattern: {
      value: /^[0-9]+(\.[0-9]{1,2})?$/,
      message: "Please enter a valid measurement",
    },
  },
};

// Color schemes for different metrics
export const metricColors = {
  bmi: {
    underweight: "#5DADE2",
    normal: "#52BE80",
    overweight: "#F39C12",
    obese: "#E74C3C",
  },
  bodyFat: {
    low: "#5DADE2",
    healthy: "#52BE80",
    moderate: "#F39C12",
    high: "#E74C3C",
  },
};

// Minimum calorie thresholds for safety
export const minimumCalories = {
  male: 1500,
  female: 1200,
};
