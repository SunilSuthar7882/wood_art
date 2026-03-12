export const activityData = [
  {
    label: "Active: daily exercise or intense exercise 3-4 times/week",
    value: "1.55",
  },
  { label: "Basal Metabolic Rate (BMR)", value: "1" },
  {
    label: "Extra Active: very intense exercise daily, or physical job",
    value: "1.9",
  },
  { label: "Light: exercise 1-3 times/week", value: "1.375" },
  { label: "Moderate: exercise 4-5 times/week", value: "1.465" },
  { label: "Sedentary: little or no exercise", value: "1.2" },
  { label: "Very Active: intense exercise 6-7 times/week", value: "1.725" },
];


export const goalData = [
  { label: "Extreme weight gain of 2 lb (1 kg) per week", value: "g2" },
  { label: "Extreme weight loss of 2 lb (1 kg) per week", value: "l2" },
  { label: "Maintain weight", value: "m" },
  { label: "Mild weight gain of 0.5 lb (0.25 kg) per week", value: "g" },
  { label: "Mild weight loss of 0.5 lb (0.25 kg) per week", value: "l" },
  { label: "Weight gain of 1 lb (0.5 kg) per week", value: "g1" },
  { label: "Weight loss of 1 lb (0.5 kg) per week", value: "l1" },
];


// export const dietTypes = [
//   { label: "Balanced", value: "balanced" },
//   { label: "Carnivore", value: "carnivore" },
//   { label: "High Protein", value: "highProtein" },
//   { label: "Keto", value: "keto" },
//   { label: "Low Carb", value: "lowCarb" },
//   { label: "Low Fat", value: "lowFat" },
//   { label: "Low Protein", value: "lowProtein" },
//   { label: "Create Your Own", value: "custom" },
// ];


export const dietTypes = [
  { label: "Create Your Own", value: "custom" },
  { label: 'Anti-Inflammatory', value: 'antiInflammatory' },
  { label: 'AvoHealth', value: 'avoHealth' },
  { label: 'Ayurvedic', value: 'ayurvedic' },
  { label: 'Balanced', value: 'balanced' },
  { label: 'Brain Boosting', value: 'brainBoosting' },
  { label: 'Carnivore', value: 'carnivore' },
  { label: 'Corn-Free', value: 'cornFree' },
  { label: 'Dairy-Free', value: 'dairyFree' },
  { label: 'DASH Diet', value: 'dashDiet' },
  { label: 'Detox-Friendly', value: 'detoxFriendly' },
  { label: 'Diabetes Management', value: 'diabetesManagement' },
  { label: 'Diabetic Friendly', value: 'diabeticFriendly' },
  { label: 'Egg-Free', value: 'eggFree' },
  { label: 'Energy Boosting', value: 'energyBoosting' },
  { label: 'Fish Free', value: 'fishFree' },
  { label: 'FODMAP-Friendly', value: 'fodmapFriendly' },
  { label: 'Gluten-Free', value: 'glutenFree' },
  { label: 'Gut Health', value: 'gutHealth' },
  { label: 'Heart Healthy', value: 'heartHealthy' },
  { label: 'High Fiber', value: 'highFiber' },
  { label: 'High Protein', value: 'highProtein' },
  { label: 'Histamine-Free', value: 'histamineFree' },
  { label: 'Holistic', value: 'holistic' },
  { label: 'Hormonal Balance', value: 'hormonalBalance' },
  { label: 'Immune Boosting', value: 'immuneBoosting' },
  { label: 'Intermittent Fasting', value: 'intermittentFasting' },
  { label: 'Keto (Ketogenic)', value: 'keto' },
  { label: 'Lactose-Free', value: 'lactoseFree' },
  { label: 'Low Carb', value: 'lowCarb' },
  { label: 'Low Fat', value: 'lowFat' },
  { label: 'Low Glycemic', value: 'lowGlycemic' },
  { label: 'Macrobiotic', value: 'macrobiotic' },
  { label: 'Mediterranean', value: 'mediterranean' },
  { label: 'Mental Clarity', value: 'mentalClarity' },
  { label: 'Muscle Building', value: 'muscleBuilding' },
  { label: 'Nightshade-Free', value: 'nightshadeFree' },
  { label: 'Non-GMO', value: 'nonGMO' },
  { label: 'Nut-Free', value: 'nutFree' },
  { label: 'Paleo', value: 'paleo' },
  { label: 'PCOS Friendly', value: 'pcosFriendly' },
  { label: 'Peanut-Free', value: 'peanutFree' },
  { label: 'Pescatarian', value: 'pescatarian' },
  { label: 'Postpartum', value: 'postpartum' },
  { label: 'Pregnancy', value: 'pregnancy' },
  { label: 'Raw Food', value: 'rawFood' },
  { label: 'Sesame-Free', value: 'sesameFree' },
  { label: 'Shellfish-Free', value: 'shellfishFree' },
  { label: 'Soy-Free', value: 'soyFree' },
  { label: 'Sugar-Free', value: 'sugarFree' },
  { label: 'Thyroid Support', value: 'thyroidSupport' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Weight Gain', value: 'weightGain' },
  { label: 'Weight Loss', value: 'weightLoss' },
  { label: 'Whole30', value: 'whole30' },
  
];



export const dietConfig = {
  custom:{p:0, c:0, f:0},
  antiInflammatory: { p: 25, c: 45, f: 30 },
  avoHealth: { p: null, c: null, f: null },
  ayurvedic: { p: null, c: null, f: null },
  balanced: { p: 30, c: 50, f: 20 },
  brainBoosting: { p: 20, c: 50, f: 30 },
  carnivore: { p: 35, c: 0, f: 65 },
  cornFree: { p: null, c: null, f: null },
  dairyFree: { p: null, c: null, f: null },
  dashDiet: { p: 18, c: 55, f: 27 },
  detoxFriendly: { p: 30, c: 50, f: 20 },
  diabetesManagement: { p: 20, c: 50, f: 30 },
  diabeticFriendly: { p: 30, c: 45, f: 25 },
  eggFree: { p: 20, c: 50, f: 30 },
  energyBoosting: { p: 10, c: 65, f: 25 },
  fishFree: { p: 20, c: 55, f: 25 },
  fodmapFriendly: { p: null, c: null, f: null },
  glutenFree: { p: 15, c: 55, f: 30 },
  gutHealth: { p: 15, c: 55, f: 30 },
  heartHealthy: { p: 15, c: 55, f: 30 },
  highFiber: { p: 15, c: 55, f: 30 },
  highProtein: { p: 45, c: 25, f: 30 },
  histamineFree: { p: null, c: null, f: null },
  holistic: { p: null, c: null, f: null },
  hormonalBalance: { p: 25, c: 50, f: 25 },
  immuneBoosting: { p: null, c: null, f: null },
  intermittentFasting: { p: 15, c: 55, f: 30 },
  keto: { p: 20, c: 10, f: 70 },
  lactoseFree: { p: 15, c: 55, f: 30 },
  lowCarb: { p: 25, c: 15, f: 60 },
  lowFat: { p: 25, c: 55, f: 20 },
  lowGlycemic: { p: 30, c: 40, f: 30 },
  macrobiotic: { p: null, c: null, f: null },
  mediterranean: { p: 20, c: 50, f: 30 },
  mentalClarity: { p: null, c: null, f: null },
  muscleBuilding: { p: 30, c: 50, f: 20 },
  nightshadeFree: { p: 30, c: 40, f: 30 },
  nonGMO: { p: null, c: null, f: null },
  nutFree: { p: 25, c: 55, f: 20 },
  paleo: { p: 35, c: 40, f: 25 },
  pcosFriendly: { p: 35, c: 40, f: 25 },
  peanutFree: { p: 15, c: 55, f: 30 },
  pescatarian: { p: 20, c: 55, f: 25 },
  postpartum: { p: 30, c: 40, f: 30 },
  pregnancy: { p: 15, c: 55, f: 30 },
  rawFood: { p: null, c: null, f: null },
  sesameFree: { p: null, c: null, f: null },
  shellfishFree: { p: null, c: null, f: null },
  soyFree: { p: 15, c: 55, f: 30 },
  sugarFree: { p: 20, c: 5, f: 75 },
  thyroidSupport: { p: 55, c: 30, f: 15 },
  vegan: { p: 25, c: 50, f: 25 },
  vegetarian: { p: 15, c: 55, f: 30 },
  weightGain: { p: 30, c: 50, f: 20 },
  weightLoss: { p: 30, c: 40, f: 30 },
  whole30: { p: null, c: null, f: null },
  
};




// export const dietConfig = {
//   custom: { protein: 0, carbs: 0, fats: 0 },
//   antiInflammatory: { protein: 25, carbs: 45, fats: 30 },
//   avoHealth: { protein: null, carbs: null, fats: null },
//   ayurvedic: { protein: null, carbs: null, fats: null },
//   balanced: { protein: 30, carbs: 50, fats: 20 },
//   brainBoosting: { protein: 20, carbs: 50, fats: 30 },
//   carnivore: { protein: 35, carbs: 0, fats: 65 },
//   cornFree: { protein: null, carbs: null, fats: null },
//   dairyFree: { protein: null, carbs: null, fats: null },
//   dashDiet: { protein: 18, carbs: 55, fats: 27 },
//   detoxFriendly: { protein: 30, carbs: 50, fats: 20 },
//   diabetesManagement: { protein: 20, carbs: 50, fats: 30 },
//   diabeticFriendly: { protein: 30, carbs: 45, fats: 25 },
//   eggFree: { protein: 20, carbs: 50, fats: 30 },
//   energyBoosting: { protein: 10, carbs: 65, fats: 25 },
//   fishFree: { protein: 20, carbs: 55, fats: 25 },
//   fodmapFriendly: { protein: null, carbs: null, fats: null },
//   glutenFree: { protein: 15, carbs: 55, fats: 30 },
//   gutHealth: { protein: 15, carbs: 55, fats: 30 },
//   heartHealthy: { protein: 15, carbs: 55, fats: 30 },
//   highFiber: { protein: 15, carbs: 55, fats: 30 },
//   highProtein: { protein: 45, carbs: 25, fats: 30 },
//   histamineFree: { protein: null, carbs: null, fats: null },
//   holistic: { protein: null, carbs: null, fats: null },
//   hormonalBalance: { protein: 25, carbs: 50, fats: 25 },
//   immuneBoosting: { protein: null, carbs: null, fats: null },
//   intermittentFasting: { protein: 15, carbs: 55, fats: 30 },
//   keto: { protein: 20, carbs: 10, fats: 70 },
//   lactoseFree: { protein: 15, carbs: 55, fats: 30 },
//   lowCarb: { protein: 25, carbs: 15, fats: 60 },
//   lowFat: { protein: 25, carbs: 55, fats: 20 },
//   lowGlycemic: { protein: 30, carbs: 40, fats: 30 },
//   macrobiotic: { protein: null, carbs: null, fats: null },
//   mediterranean: { protein: 20, carbs: 50, fats: 30 },
//   mentalClarity: { protein: null, carbs: null, fats: null },
//   muscleBuilding: { protein: 30, carbs: 50, fats: 20 },
//   nightshadeFree: { protein: 30, carbs: 40, fats: 30 },
//   nonGMO: { protein: null, carbs: null, fats: null },
//   nutFree: { protein: 25, carbs: 55, fats: 20 },
//   paleo: { protein: 35, carbs: 40, fats: 25 },
//   pcosFriendly: { protein: 35, carbs: 40, fats: 25 },
//   peanutFree: { protein: 15, carbs: 55, fats: 30 },
//   pescatarian: { protein: 20, carbs: 55, fats: 25 },
//   postpartum: { protein: 30, carbs: 40, fats: 30 },
//   pregnancy: { protein: 15, carbs: 55, fats: 30 },
//   rawFood: { protein: null, carbs: null, fats: null },
//   sesameFree: { protein: null, carbs: null, fats: null },
//   shellfishFree: { protein: null, carbs: null, fats: null },
//   soyFree: { protein: 15, carbs: 55, fats: 30 },
//   sugarFree: { protein: 20, carbs: 5, fats: 75 },
//   thyroidSupport: { protein: 55, carbs: 30, fats: 15 },
//   vegan: { protein: 25, carbs: 50, fats: 25 },
//   vegetarian: { protein: 15, carbs: 55, fats: 30 },
//   weightGain: { protein: 30, carbs: 50, fats: 20 },
//   weightLoss: { protein: 30, carbs: 40, fats: 30 },
//   whole30: { protein: null, carbs: null, fats: null },
// };



// export const dietConfig = {
//   balanced: {
//     protein: 10.0,
//     carbs: 60.0,
//     fat: 30.0,
//   },
//   lowFat: {
//     protein: 35.0,
//     carbs: 50.0,
//     fat: 15.0,
//   },
//   lowCarb: {
//     protein: 30.0,
//     carbs: 10.0,
//     fat: 60.0,
//   },
//   highProtein: {
//     protein: 40.0,
//     carbs: 35.0,
//     fat: 25.0,
//   },
//   keto: {
//     protein: 20.0,
//     carbs: 10.0,
//     fat: 70.0,
//   },
//   carnivore: {
//     protein: 25.0,
//     carbs: 0,
//     fat: 75.0,
//   },
//   lowProtein: {
//     protein: 6.0,
//     carbs: 59.0,
//     fat: 35.0,
//   },
// };

// the low fat / high carb diet should be protein 30-40%, carbs 40-50%, fat 10-20%
// low carb diet should be protein 30%, carbs 10%, fat 60%
// high protein diet should be protein 35%, carbs 30-40%, fats 20-30%
// keto diet. can we adjust it to this: protein 20%, carbs 10% fat 70%
// low protein needs to be adjusted to this: protein 5-10%, carbs 45-65%, fat 20-35%

export const formula = [
  {
    label: "Athletes Formula (best for lean people)",
    value: "Athletes Formula (best for lean people)",
  },
  {
    label: "Lean Mass Formula (best if overweight)",
    value: "Lean Mass Formula (best if overweight)",
  },
];

export const dailyActivity = [
  {
    label:
      "Sedentary: Spend most of the day sitting (e.g. bank taller, desk job)",
    value: "Sedentary",
  },
  {
    label:
      "Lightly Activity: Spend a good part of the day on your feet (e.g. teacher, salesman)",
    value: "Lightly Activity",
  },
  {
    label:
      "Active: Spend a good part of the day doing some physical activity (e.g. waitress, mailman)",
    value: "Active",
  },
  {
    label:
      "Very Active: Spend most of the day doing heavy physical activity (e.g. bike messanger, carpenter)",
    value: "Very Active",
  },
];

export const exerciseIntense = [
  {
    label:
      "Light: I can hold a conversation while working out and do not break a sweet.",
    value: "Light",
  },
  {
    label: "Moderate: I am breathing hard and challenge myself.",
    value: "Moderate",
  },
  {
    label:
      "Difficult: I always break a sweat and have an elevated heart rate. I cannot hold a conversation",
    value: "Difficult",
  },
  {
    label:
      "Intense: Don't talk to to me, don't look at me. I am here for a purpose and i might die today.",
    value: "Intense",
  },
];
