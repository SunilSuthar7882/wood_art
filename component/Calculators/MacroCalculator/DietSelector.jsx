import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Slider,
  Alert,
  Chip,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
// import RestaurantIcon from "@mui/icons-material/Restaurant";
// import LocalDiningIcon from "@mui/icons-material/LocalDining";
// import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import NatureIcon from "@mui/icons-material/Nature"; // Replaces Eco
import FavoriteIcon from "@mui/icons-material/Favorite";
import EmojiNatureIcon from "@mui/icons-material/EmojiNature";
import SpaIcon from "@mui/icons-material/Spa";
import GrainIcon from "@mui/icons-material/Grain";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import EggIcon from "@mui/icons-material/Egg";
import GrassIcon from "@mui/icons-material/Grass";

import { Egg, Info } from "lucide-react";
import { Doughnut } from "react-chartjs-2";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { dietTypes } from "@/constants/macroCalculator";
// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const DietSelector = ({
  selectedDiet,
  calculateDiet,
  dietConfig,
  TDEE,
  results,
  bodyMetrics,
  unitSystem,
}) => {
  const [customMacros, setCustomMacros] = useState({
    p: 30,
    c: 40,
    f: 30,
  });

  const [totalPercentage, setTotalPercentage] = useState(100);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const dietDetails = {
    custom: {
      name: "Create Your Own",
      icon: <RestaurantIcon />,
      description:
        "Customize your macronutrient ratios to fit your specific needs.",
      benefits: [
        "Personalized approach",
        "Tailored to preferences",
        "Adaptable to specific goals",
        "Full control",
      ],
      suitable: "Advanced users and trainers",
      color: "warning",
    },
    balanced: {
      name: "Balanced Diet",
      icon: <RestaurantIcon />,
      description:
        "A well-rounded approach with moderate amounts of all macronutrients",
      benefits: [
        "Sustainable long-term",
        "Flexible food choices",
        "Supports overall health",
        "Good for athletes",
      ],
      suitable: "Most people, especially beginners",
      color: "primary",
    },
    lowFat: {
      name: "Low Fat Diet",
      icon: <LocalDiningIcon />,
      description: "Reduced fat intake with higher carbohydrates",
      benefits: [
        "Heart health",
        "Cholesterol management",
        "Higher food volume",
        "Traditional approach",
      ],
      suitable: "Heart disease prevention, endurance athletes",
      color: "secondary",
    },
    lowCarb: {
      name: "Low Carb Diet",
      icon: <Egg />,
      description: "Reduced carbohydrate intake with increased protein and fat",
      benefits: [
        "Improved blood sugar control",
        "Reduced appetite",
        "Fast initial weight loss",
        "Better mental clarity",
      ],
      suitable: "Weight loss, diabetes management",
      color: "success",
    },
    highProtein: {
      name: "High Protein Diet",
      icon: <FiberManualRecordIcon />,
      description:
        "Increased protein intake for muscle building and preservation",
      benefits: [
        "Preserves muscle mass",
        "Increased satiety",
        "Better recovery",
        "Boosts metabolism",
      ],
      suitable: "Athletes, bodybuilders, weight loss",
      color: "info",
    },
    lowProtein: {
      name: "Low Protein Diet",
      icon: <FiberManualRecordIcon />,
      description: "Reduced protein intake with a focus on carbs and/or fats",
      benefits: [
        "Kidney-friendly",
        "Helps manage certain medical conditions",
        "Can support high-carb or high-fat preferences",
        "Reduced metabolic load",
      ],
      suitable: "People with kidney issues or special medical needs",
      color: "error",
    },
    keto: {
      name: "Keto Diet",
      icon: <RestaurantIcon />,
      description: "High fat, moderate protein, and very low carbs",
      benefits: [
        "Rapid fat loss",
        "Improved insulin sensitivity",
        "Enhanced mental focus",
        "Reduced hunger",
      ],
      suitable: "Weight loss, type 2 diabetes, epilepsy",
      color: "dark",
    },
    carnivore: {
      name: "Carnivore Diet",
      icon: <FitnessCenterIcon />,
      description: "Animal-based only, extremely low or zero carbohydrates",
      benefits: [
        "Eliminates most allergens",
        "Anti-inflammatory for some",
        "Simple meal planning",
        "High satiety",
      ],
      suitable: "Autoimmune conditions, elimination diets",
      color: "warning",
    },

    antiInflammatory: {
      name: "Anti-Inflammatory Diet",
      icon: <SpaIcon />,
      description: "Focuses on foods that reduce inflammation in the body.",
      benefits: [
        "Supports joint health",
        "Boosts immunity",
        "Improves digestion",
        "Promotes longevity",
      ],
      suitable: "People with chronic inflammation or autoimmune conditions",
      color: "success",
    },

    ayurvedic: {
      name: "Ayurvedic Diet",
      icon: <EmojiNatureIcon />,
      description:
        "Based on Ayurveda principles balancing body doshas through natural foods.",
      benefits: [
        "Balances energy and digestion",
        "Promotes inner harmony",
        "Uses natural herbs and spices",
        "Holistic wellness approach",
      ],
      suitable: "People seeking traditional holistic balance",
      color: "warning",
    },

    mediterranean: {
      name: "Mediterranean Diet",
      icon: <NatureIcon />,
      description:
        "Rich in olive oil, fish, whole grains, and plant-based foods.",
      benefits: [
        "Heart health",
        "Longevity support",
        "Improved brain function",
        "Balanced nutrition",
      ],
      suitable: "Those seeking a sustainable, heart-healthy diet",
      color: "success",
    },

    paleo: {
      name: "Paleo Diet",
      icon: <GrassIcon />,
      description:
        "Inspired by ancestral eating—lean meats, veggies, fruits, nuts.",
      benefits: [
        "No processed foods",
        "Improved energy",
        "Supports gut health",
        "Stable blood sugar",
      ],
      suitable: "People avoiding processed foods and grains",
      color: "secondary",
    },

    vegan: {
      name: "Vegan Diet",
      icon: <NatureIcon />,
      description: "Excludes all animal products; plant-based only.",
      benefits: [
        "Supports environment",
        "Cholesterol-free",
        "Promotes heart health",
        "Ethical choice",
      ],
      suitable: "Ethical eaters, those avoiding animal products",
      color: "success",
    },

    vegetarian: {
      name: "Vegetarian Diet",
      icon: <EnergySavingsLeafIcon />,
      description:
        "Includes plant foods, dairy, and eggs; excludes meat and fish.",
      benefits: [
        "Heart healthy",
        "Rich in fiber",
        "Supports longevity",
        "Lower calorie intake",
      ],
      suitable: "General wellness and ethical eaters",
      color: "primary",
    },

    pcosFriendly: {
      name: "PCOS Friendly Diet",
      icon: <FavoriteIcon />,
      description: "Supports hormone balance and insulin regulation for PCOS.",
      benefits: [
        "Hormone regulation",
        "Improved insulin sensitivity",
        "Supports weight management",
        "Reduces inflammation",
      ],
      suitable: "Women managing PCOS or hormonal imbalance",
      color: "secondary",
    },

    intermittentFasting: {
      name: "Intermittent Fasting",
      icon: <RestaurantIcon />,
      description:
        "Eating pattern cycling between periods of fasting and eating.",
      benefits: [
        "Improved fat metabolism",
        "Better energy control",
        "Cellular repair",
        "Supports longevity",
      ],
      suitable: "People managing weight and blood sugar",
      color: "info",
    },

    glutenFree: {
      name: "Gluten-Free Diet",
      icon: <GrainIcon />,
      description: "Eliminates gluten-containing grains to improve gut health.",
      benefits: [
        "Reduces bloating",
        "Improves digestion",
        "Helps celiac disease",
        "Promotes clarity",
      ],
      suitable: "Celiac or gluten-sensitive individuals",
      color: "warning",
    },

    dairyFree: {
      name: "Dairy-Free Diet",
      icon: <LocalDiningIcon />,
      description: "Avoids all dairy and lactose-containing products.",
      benefits: [
        "Better digestion",
        "Clearer skin",
        "Less bloating",
        "Reduced mucus production",
      ],
      suitable: "Lactose intolerance or dairy-sensitive individuals",
      color: "error",
    },

    diabeticFriendly: {
      name: "Diabetic Friendly Diet",
      icon: <WaterDropIcon />,
      description:
        "Controls blood sugar with balanced carbohydrates and fiber.",
      benefits: [
        "Manages blood glucose",
        "Supports weight management",
        "Prevents energy crashes",
        "Heart-healthy choices",
      ],
      suitable: "People with diabetes or insulin resistance",
      color: "info",
    },

    weightLoss: {
      name: "Weight Loss Diet",
      icon: <FitnessCenterIcon />,
      description: "Calorie-conscious eating plan to promote gradual fat loss.",
      benefits: [
        "Reduces fat mass",
        "Improves mobility",
        "Boosts metabolism",
        "Supports longevity",
      ],
      suitable: "Individuals seeking fat reduction and improved fitness",
      color: "secondary",
    },

    weightGain: {
      name: "Weight Gain Diet",
      icon: <FitnessCenterIcon />,
      description: "High-calorie plan emphasizing nutrient-dense foods.",
      benefits: [
        "Promotes muscle gain",
        "Restores energy levels",
        "Improves strength",
        "Healthy mass building",
      ],
      suitable: "Underweight individuals or athletes gaining muscle",
      color: "success",
    },
    avoHealth: {
      name: "AvoHealth Diet",
      icon: <NatureIcon />,
      description: "Focuses on avocado-based nutrition and healthy fats.",
      benefits: [
        "Rich in healthy fats",
        "Supports heart health",
        "Anti-inflammatory properties",
        "Good source of fiber",
      ],
      suitable: "People seeking healthy fat intake and heart health",
      color: "success",
    },
    brainBoosting: {
      name: "Brain Boosting Diet",
      icon: <FavoriteIcon />,
      description: "Diet designed to improve cognitive function and focus.",
      benefits: [
        "Enhances memory",
        "Supports mental clarity",
        "Rich in antioxidants",
        "Boosts concentration",
      ],
      suitable: "Students, professionals, and older adults",
      color: "primary",
    },
    cornFree: {
      name: "Corn-Free Diet",
      icon: <LocalDiningIcon />,
      description: "Excludes corn and corn-based products from meals.",
      benefits: [
        "Reduces allergens",
        "Supports digestive health",
        "Avoids GMO corn products",
        "Simple elimination diet",
      ],
      suitable: "People with corn allergies or sensitivities",
      color: "warning",
    },
    dashDiet: {
      name: "DASH Diet",
      icon: <GrainIcon />,
      description:
        "Dietary Approaches to Stop Hypertension (DASH) for heart health.",
      benefits: [
        "Lowers blood pressure",
        "Supports heart health",
        "Rich in fruits and vegetables",
        "Balanced nutrient intake",
      ],
      suitable: "Individuals with hypertension or cardiovascular risk",
      color: "success",
    },
    detoxFriendly: {
      name: "Detox-Friendly Diet",
      icon: <SpaIcon />,
      description: "Diet focusing on detoxification through clean foods.",
      benefits: [
        "Supports liver function",
        "Reduces toxins",
        "Boosts energy",
        "Improves digestion",
      ],
      suitable: "People looking to reset eating habits",
      color: "info",
    },
    diabetesManagement: {
      name: "Diabetes Management Diet",
      icon: <WaterDropIcon />,
      description: "Balanced diet to maintain healthy blood sugar levels.",
      benefits: [
        "Controls glucose levels",
        "Supports weight management",
        "Prevents energy spikes",
        "Includes low-GI foods",
      ],
      suitable: "People with type 2 diabetes or pre-diabetes",
      color: "warning",
    },
    eggFree: {
      name: "Egg-Free Diet",
      icon: <EggIcon />,
      description: "Eliminates all eggs and egg-based products.",
      benefits: [
        "Reduces allergy risk",
        "Supports vegan/vegetarian choices",
        "Simplifies meal planning",
        "Improves digestion for sensitive individuals",
      ],
      suitable: "People with egg allergies or intolerances",
      color: "error",
    },
    energyBoosting: {
      name: "Energy Boosting Diet",
      icon: <EnergySavingsLeafIcon />,
      description: "Focus on foods that improve energy and vitality.",
      benefits: [
        "Increases stamina",
        "Improves focus",
        "Supports metabolic health",
        "Rich in complex carbs and proteins",
      ],
      suitable: "Active individuals and athletes",
      color: "info",
    },
    fishFree: {
      name: "Fish-Free Diet",
      icon: <EmojiNatureIcon />,
      description: "Excludes fish and seafood from meals.",
      benefits: [
        "Avoids seafood allergens",
        "Suitable for vegetarians",
        "Supports ethical eating",
        "Promotes heart-healthy plant foods",
      ],
      suitable: "People allergic to fish or avoiding seafood",
      color: "warning",
    },
    fodmapFriendly: {
      name: "FODMAP-Friendly Diet",
      icon: <RestaurantIcon />,
      description: "Reduces fermentable carbs that cause digestive discomfort.",
      benefits: [
        "Reduces bloating",
        "Supports gut health",
        "Improves IBS symptoms",
        "Easy-to-digest meals",
      ],
      suitable: "People with IBS or digestive issues",
      color: "success",
    },
    gutHealth: {
      name: "Gut Health Diet",
      icon: <GrassIcon />,
      description:
        "Supports digestive system with fiber-rich and probiotic foods.",
      benefits: [
        "Improves digestion",
        "Supports microbiome",
        "Reduces bloating",
        "Boosts immunity",
      ],
      suitable: "Everyone seeking digestive wellness",
      color: "success",
    },
    heartHealthy: {
      name: "Heart Healthy Diet",
      icon: <FavoriteIcon />,
      description: "Focuses on foods that protect cardiovascular health.",
      benefits: [
        "Lowers cholesterol",
        "Reduces blood pressure",
        "Rich in healthy fats",
        "Supports heart function",
      ],
      suitable: "People with cardiovascular risk or heart conditions",
      color: "primary",
    },
    highFiber: {
      name: "High Fiber Diet",
      icon: <GrainIcon />,
      description:
        "Increases fiber intake for digestive and metabolic benefits.",
      benefits: [
        "Improves digestion",
        "Supports weight management",
        "Stabilizes blood sugar",
        "Reduces cholesterol",
      ],
      suitable: "People seeking better digestive health",
      color: "success",
    },
    histamineFree: {
      name: "Histamine-Free Diet",
      icon: <SpaIcon />,
      description: "Avoids foods high in histamine to reduce reactions.",
      benefits: [
        "Reduces allergic reactions",
        "Supports gut health",
        "Prevents headaches and skin reactions",
        "Improves energy levels",
      ],
      suitable: "People sensitive to histamine",
      color: "warning",
    },
    holistic: {
      name: "Holistic Diet",
      icon: <EmojiNatureIcon />,
      description: "Whole-body approach integrating nutrition and wellness.",
      benefits: [
        "Promotes balance",
        "Supports mental and physical health",
        "Uses natural and organic foods",
        "Encourages lifestyle wellness",
      ],
      suitable: "People seeking complete wellness",
      color: "info",
    },
    hormonalBalance: {
      name: "Hormonal Balance Diet",
      icon: <FavoriteIcon />,
      description: "Supports hormone regulation with targeted nutrition.",
      benefits: [
        "Improves hormone levels",
        "Supports metabolism",
        "Reduces PMS symptoms",
        "Enhances energy",
      ],
      suitable: "People with hormonal imbalances",
      color: "primary",
    },
    immuneBoosting: {
      name: "Immune Boosting Diet",
      icon: <EnergySavingsLeafIcon />,
      description: "Supports immune system with nutrient-rich foods.",
      benefits: [
        "Strengthens immunity",
        "Rich in antioxidants",
        "Supports recovery",
        "Boosts energy",
      ],
      suitable: "Everyone seeking better immune health",
      color: "success",
    },
    lactoseFree: {
      name: "Lactose-Free Diet",
      icon: <LocalDiningIcon />,
      description: "Excludes all lactose-containing dairy products.",
      benefits: [
        "Reduces bloating",
        "Improves digestion",
        "Prevents allergic reactions",
        "Supports sensitive individuals",
      ],
      suitable: "People with lactose intolerance",
      color: "warning",
    },
    lowGlycemic: {
      name: "Low Glycemic Diet",
      icon: <GrainIcon />,
      description:
        "Focuses on foods with low glycemic index to stabilize blood sugar.",
      benefits: [
        "Controls blood sugar",
        "Sustains energy",
        "Supports weight management",
        "Reduces cravings",
      ],
      suitable: "Diabetics or those seeking steady energy",
      color: "info",
    },
    macrobiotic: {
      name: "Macrobiotic Diet",
      icon: <NatureIcon />,
      description: "Whole grains, vegetables, and natural foods for balance.",
      benefits: [
        "Promotes longevity",
        "Balances digestion",
        "Supports detoxification",
        "Encourages mindful eating",
      ],
      suitable: "People seeking holistic lifestyle",
      color: "success",
    },
    mentalClarity: {
      name: "Mental Clarity Diet",
      icon: <FavoriteIcon />,
      description: "Focuses on foods that improve cognition and focus.",
      benefits: [
        "Boosts concentration",
        "Improves memory",
        "Supports brain function",
        "Reduces brain fog",
      ],
      suitable: "Students, professionals, and older adults",
      color: "primary",
    },
    muscleBuilding: {
      name: "Muscle Building Diet",
      icon: <FitnessCenterIcon />,
      description:
        "Supports muscle growth and recovery with protein-rich foods.",
      benefits: [
        "Increases muscle mass",
        "Supports recovery",
        "Boosts metabolism",
        "Enhances strength",
      ],
      suitable: "Athletes and bodybuilders",
      color: "secondary",
    },
    nightshadeFree: {
      name: "Nightshade-Free Diet",
      icon: <GrassIcon />,
      description: "Excludes nightshade vegetables to reduce inflammation.",
      benefits: [
        "Reduces joint pain",
        "Supports digestion",
        "Reduces allergies",
        "Anti-inflammatory",
      ],
      suitable: "People sensitive to nightshades",
      color: "warning",
    },
    nonGMO: {
      name: "Non-GMO Diet",
      icon: <NatureIcon />,
      description: "Focuses on foods not genetically modified.",
      benefits: [
        "Avoids GMOs",
        "Supports health-conscious choices",
        "Promotes organic eating",
        "Reduces exposure to additives",
      ],
      suitable: "Health-conscious individuals",
      color: "info",
    },
    nutFree: {
      name: "Nut-Free Diet",
      icon: <EnergySavingsLeafIcon />,
      description: "Excludes all tree nuts and peanuts.",
      benefits: [
        "Reduces allergen risk",
        "Safe for children",
        "Prevents allergic reactions",
        "Supports school and workplace safety",
      ],
      suitable: "People with nut allergies",
      color: "error",
    },
    peanutFree: {
      name: "Peanut-Free Diet",
      icon: <FavoriteIcon />,
      description: "Excludes peanuts from the diet.",
      benefits: [
        "Prevents allergic reactions",
        "Safe for sensitive individuals",
        "Supports school safety",
        "Reduces risk of severe allergy",
      ],
      suitable: "People with peanut allergies",
      color: "warning",
    },
    pescatarian: {
      name: "Pescatarian Diet",
      icon: <WaterDropIcon />,
      description: "Includes fish and seafood but excludes other meats.",
      benefits: [
        "Supports heart health",
        "High in omega-3s",
        "Balanced protein intake",
        "Promotes sustainable eating",
      ],
      suitable: "People avoiding meat but eating fish",
      color: "success",
    },
    postpartum: {
      name: "Postpartum Diet",
      icon: <SpaIcon />,
      description: "Supports recovery and nutrition after childbirth.",
      benefits: [
        "Improves energy",
        "Supports lactation",
        "Promotes healing",
        "Restores nutrient balance",
      ],
      suitable: "New mothers recovering from childbirth",
      color: "primary",
    },
    pregnancy: {
      name: "Pregnancy Diet",
      icon: <FavoriteIcon />,
      description: "Nutrient-rich diet to support maternal and fetal health.",
      benefits: [
        "Supports fetal development",
        "Improves maternal health",
        "Provides essential nutrients",
        "Reduces risk of deficiencies",
      ],
      suitable: "Pregnant women",
      color: "secondary",
    },
    rawFood: {
      name: "Raw Food Diet",
      icon: <GrassIcon />,
      description: "Focus on uncooked, unprocessed foods.",
      benefits: [
        "Preserves nutrients",
        "Supports digestion",
        "Improves energy",
        "Reduces processed food intake",
      ],
      suitable: "Health-conscious individuals seeking natural foods",
      color: "success",
    },
    sesameFree: {
      name: "Sesame-Free Diet",
      icon: <EnergySavingsLeafIcon />,
      description: "Excludes sesame seeds and sesame-based products.",
      benefits: [
        "Prevents allergies",
        "Safe for sensitive individuals",
        "Supports school and workplace safety",
        "Reduces allergen exposure",
      ],
      suitable: "People with sesame allergies",
      color: "warning",
    },
    shellfishFree: {
      name: "Shellfish-Free Diet",
      icon: <WaterDropIcon />,
      description: "Excludes all shellfish and seafood allergens.",
      benefits: [
        "Prevents allergic reactions",
        "Safe for sensitive individuals",
        "Supports school/work safety",
        "Reduces risk of severe allergy",
      ],
      suitable: "People allergic to shellfish",
      color: "error",
    },
    soyFree: {
      name: "Soy-Free Diet",
      icon: <EggIcon />,
      description: "Excludes all soy products.",
      benefits: [
        "Reduces allergen risk",
        "Supports digestive health",
        "Prevents hormonal interference",
        "Suitable for soy-sensitive individuals",
      ],
      suitable: "People with soy allergies",
      color: "warning",
    },
    sugarFree: {
      name: "Sugar-Free Diet",
      icon: <EnergySavingsLeafIcon />,
      description: "Eliminates added sugar for better health.",
      benefits: [
        "Supports weight loss",
        "Reduces risk of diabetes",
        "Prevents energy crashes",
        "Improves oral health",
      ],
      suitable: "People reducing sugar intake",
      color: "success",
    },
    thyroidSupport: {
      name: "Thyroid Support Diet",
      icon: <GrassIcon />,
      description: "Supports thyroid function with nutrient-dense foods.",
      benefits: [
        "Regulates metabolism",
        "Supports hormone production",
        "Provides essential nutrients",
        "Improves energy levels",
      ],
      suitable: "People with thyroid issues",
      color: "info",
    },
    whole30: {
      name: "Whole30 Diet",
      icon: <RestaurantIcon />,
      description: "30-day elimination diet focusing on whole foods.",
      benefits: [
        "Eliminates processed foods",
        "Resets eating habits",
        "Improves digestion",
        "Supports weight management",
      ],
      suitable: "People seeking a 30-day dietary reset",
      color: "warning",
    },
  };
  const macroLabels = { p: "Protein", c: "Carbs", f: "Fats" };
  // Calculate macros in grams based on percentages and TDEE
  const calculateMacrosInGrams = (percentages) => {
    // Default to empty object if percentages is undefined
    const { p = 0, c = 0, f = 0 } = percentages || {};

    // Ensure TDEE is a valid number
    const validTDEE =
      typeof TDEE === "number" && !isNaN(TDEE) && TDEE > 0 ? TDEE : 2000;

    const proteinCalories = (p / 100) * validTDEE;
    const carbsCalories = (c / 100) * validTDEE;
    const fatCalories = (f / 100) * validTDEE;

    return {
      p: Math.round(proteinCalories / 4) || 0, // 4 calories per gram of protein
      c: Math.round(carbsCalories / 4) || 0, // 4 calories per gram of carbs
      f: Math.round(fatCalories / 9) || 0, // 9 calories per gram of fat
    };
  };

  // Calculate estimated sugar and saturated fat
  const calculateEstimates = (macros) => {
    // Default to empty object if macros is undefined
    const { c = 0, f = 0 } = macros || {};

    return {
      sugar: Math.round(c * 0.2) || 0, // Estimate sugar as 20% of carbs
      saturatedFat: Math.round(f * 0.4) || 0, // Estimate saturated fat as 40% of total fat
    };
  };

  // Handle slider changes
  const handleSliderChange = (macro, newValue) => {
    // Create a new macros object with the updated value
    const updatedMacros = { ...customMacros, [macro]: newValue };

    // Calculate the total percentage
    const newTotal = updatedMacros.p + updatedMacros.c + updatedMacros.f;

    // Update the state
    setCustomMacros(updatedMacros);
    setTotalPercentage(newTotal);

    // Validate the total
    if (newTotal !== 100) {
      setError(`Total must equal 100%. Current total: ${newTotal}%`);
    } else {
      setError(null);
      // If valid, calculate diet with custom macros
      calculateDiet("custom", TDEE, updatedMacros);
    }
  };

  // Auto-adjust other macros to maintain 100% total
  const handleSliderChangeCommitted = (macro, newValue) => {
    const updatedMacros = { ...customMacros };
    updatedMacros[macro] = newValue;

    // Calculate how much we need to adjust other macros
    const currentTotal =
      updatedMacros.p + updatedMacros.c + updatedMacros.f;
    const adjustment = 100 - currentTotal;

    if (adjustment !== 0) {
      // Determine which other macros to adjust
      const otherMacros = Object.keys(updatedMacros).filter((m) => m !== macro);

      // If both other macros are at minimum (5%), we can't adjust
      if (
        updatedMacros[otherMacros[0]] <= 5 &&
        updatedMacros[otherMacros[1]] <= 5
      ) {
        // Reset the changed macro to maintain 100%
        updatedMacros[macro] =
          100 - (updatedMacros[otherMacros[0]] + updatedMacros[otherMacros[1]]);
      } else {
        // Distribute the adjustment proportionally between the other macros
        const otherMacrosTotal =
          updatedMacros[otherMacros[0]] + updatedMacros[otherMacros[1]];

        if (otherMacrosTotal > 0) {
          const ratio0 = updatedMacros[otherMacros[0]] / otherMacrosTotal;
          const ratio1 = updatedMacros[otherMacros[1]] / otherMacrosTotal;

          let adjust0 = Math.round(adjustment * ratio0);
          let adjust1 = adjustment - adjust0;

          // Ensure no macro goes below 5%
          if (updatedMacros[otherMacros[0]] + adjust0 < 5) {
            adjust0 = 5 - updatedMacros[otherMacros[0]];
            adjust1 = adjustment - adjust0;
          }

          if (updatedMacros[otherMacros[1]] + adjust1 < 5) {
            adjust1 = 5 - updatedMacros[otherMacros[1]];
            adjust0 = adjustment - adjust1;
          }

          updatedMacros[otherMacros[0]] += adjust0;
          updatedMacros[otherMacros[1]] += adjust1;
        }
      }

      // Update state with adjusted values
      setCustomMacros(updatedMacros);
      setTotalPercentage(100);
      setError(null);

      // Calculate diet with adjusted macros
      calculateDiet("custom", TDEE, updatedMacros);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    // Call the parent component's calculateDiet function with the new diet type
    if (newValue === "custom") {
      calculateDiet(newValue, TDEE, customMacros);
    } else {
      calculateDiet(newValue, TDEE);
    }
  };

  // Initialize custom macros when component mounts or when selectedDiet changes
  useEffect(() => {
    if (selectedDiet === "custom" && typeof TDEE === "number" && TDEE > 0) {
      calculateDiet("custom", TDEE, customMacros);
    }
  }, [selectedDiet, TDEE]);

  // Get the current macros based on selected diet
  const getCurrentMacros = () => {
    if (selectedDiet === "custom") {
      return customMacros;
    }

    return dietConfig[selectedDiet] || dietConfig.balanced;
  };

  const currentMacros = getCurrentMacros();
  const macrosInGrams = calculateMacrosInGrams(currentMacros);
  const estimates = calculateEstimates(macrosInGrams);

  const chartData = {
    labels: ["Protein", "Carbs", "Fat"],
    datasets: [
      {
        data: [
          results.protein, // already included in total
          results.carbs, // already includes sugar, don't separate
          results.fats, // already includes saturated fat, don't separate
        ],
        backgroundColor: ["#01933c", "#0288d1", "#ed6c02"],
        borderColor: ["#01933c", "#0288d1", "#ed6c02"],
        borderWidth: 1,
      },
    ],
  };

  const macroPercentage = {
    Protein: results.macroPercentages.p,
    Carbs: results.macroPercentages.c,
    Fat: results.macroPercentages.f,
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 12,
          },
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;

            return chart.data.labels.map((label, i) => {
              const value = datasets[0].data[i];
              const percentage = macroPercentage[label];

              return {
                text: `${label}: ${value}g (${percentage}%)`,
                fillStyle: datasets[0].backgroundColor[i],
                strokeStyle: datasets[0].borderColor[i],
                lineWidth: 1,
                hidden: false,
                index: i,
              };
            });
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;

            const percentage = macroPercentage[label];
            return `${label}: ${value}g (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Box sx={{ mt: 0, p: 1 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Select Diet Type
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Choose a diet approach that aligns with your preferences and goals
      </Typography>

      <Tabs
        value={selectedDiet}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 2,
          // height:30,
          ".MuiTab-root": {
            minWidth: 120,

            py: 0,
            px: 1.5,
            fontWeight: 600,
            borderRight: "1px solid #ddd",
            borderLeft: "1px solid #ddd",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#f5f5f5", // light gray background on hover
              color: "#16a34a", // green text on hover
            },
          },
          "& .MuiTabs-root": {
            height: 30,
          },
          // "& .MuiButtonBase-root":{
          //   bgcolor:"#16a34a",
          // },
        }}
      >
        {dietTypes
          .filter((diet) => {
            const macros = dietConfig[diet.value];
            // Only keep diets with macros defined and none of them null
            return macros && !Object.values(macros).some((v) => v === null);
          })
          .map((diet) => (
            <Tab key={diet.value} label={diet.label} value={diet.value} />
          ))}
      </Tabs>

      {/* Top Panel */}
      <Grid mb={2}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: `${dietDetails[selectedDiet]?.color}.50`,
            boxShadow: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: `${dietDetails[selectedDiet]?.color}.main`,
                color: "white",
                boxShadow: 1,
              }}
            >
              {dietDetails[selectedDiet]?.icon}
            </Box>
            <Typography variant="h6" fontWeight="bold">
              {dietDetails[selectedDiet]?.name}
            </Typography>
          </Stack>

          <Typography variant="body1" mb={2}>
            {dietDetails[selectedDiet]?.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" fontWeight="bold">
            Benefits:
          </Typography>
          <ul style={{ paddingLeft: "1.5rem", marginTop: 8 }}>
            {dietDetails[selectedDiet]?.benefits.map((benefit, index) => (
              <li key={index}>
                <Typography variant="body2">{benefit}</Typography>
              </li>
            ))}
          </ul>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" fontWeight="bold">
            Best for:
          </Typography>
          <Typography variant="body2">
            {dietDetails[selectedDiet]?.suitable}
          </Typography>
        </Paper>
      </Grid>
      {/* Bottom Panel */}
      <Grid mb={5}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 7,
              height: 200,
            }}
          >
            <Doughnut data={chartData} options={chartOptions} />
          </Box>
          {selectedDiet === "custom" ? (
            <>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Customize Your Plan
              </Typography>

              {error && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Stack
                direction="row"
                spacing={4}
                sx={{
                  width: "100%",
                }}
              >
                {["p", "c", "f"].map((macro) => (
                  <Box key={macro} sx={{ flex: 1 }}>
                    {/* Label and grams */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography fontWeight={500}>
                        {macroLabels[macro]}: {customMacros[macro]}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {macrosInGrams[macro]}g
                      </Typography>
                    </Box>

                    {/* Slider */}
                    <Slider
                      value={customMacros[macro]}
                      onChange={(e, value) => handleSliderChange(macro, value)}
                      onChangeCommitted={(e, value) =>
                        handleSliderChangeCommitted(macro, value)
                      }
                      aria-labelledby={`${macro}-slider-label`}
                      valueLabelDisplay="auto"
                      step={1}
                      min={5}
                      max={70}
                      sx={{
                        color:
                          macro === "p"
                            ? "primary.main"
                            : macro === "c"
                            ? "info.main"
                            : "warning.main",
                      }}
                    />
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ my: 4 }} />

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Calculated Nutrition Values
              </Typography>

              <Grid container spacing={2}>
                {["p", "c", "f"].map((macro) => (
                  <Grid item xs={12} sm={6} key={macro}>
                    <Typography variant="body2" color="text.secondary">
                     {macroLabels[macro]}: {customMacros[macro]}%
                    </Typography>
                    {macro !== "f" ? (
                      <Typography variant="caption" color="text.secondary">
                        Includes {macro === "c" ? "Sugar" : ""}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        Includes Saturated Fat
                      </Typography>
                    )}
                    <Typography variant="body1" fontWeight="medium">
                      {macrosInGrams[macro]} grams/day
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Range: {Math.round(macrosInGrams[macro] * 0.8)} –{" "}
                      {Math.round(macrosInGrams[macro] * 1.2)}
                    </Typography>
                  </Grid>
                ))}

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Sugar
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    &lt;{estimates.sugar} grams/day
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Saturated Fat
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    &lt;{estimates.saturatedFat} grams/day
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Food Energy
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {Number(TDEE).toFixed(2)} Calories/day
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    or {Math.round(TDEE * 0.8)} – {Math.round(TDEE * 1.2)}{" "}
                    Calories/day
                  </Typography>
                </Grid>
              </Grid>
            </>
          ) : (
            <Box sx={{ mb: 2, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Chip
                label={`${dietConfig[selectedDiet]?.p}% Protein`}
                sx={{
                  fontSize: 14,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: "#01933c",
                  color: "info.contrastText",
                }}
              />

              <Chip
                label={`${dietConfig[selectedDiet]?.c}% Carbs`}
                sx={{
                  fontSize: 14,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: "#0288d1",
                  color: "warning.contrastText",
                }}
              />
              <Chip
                label={`${dietConfig[selectedDiet]?.f}% Fat`}
                sx={{
                  fontSize: 14,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  bgcolor: "#ed6c02",
                  color: "error.contrastText",
                }}
              />
            </Box>
          )}
        </Paper>
      </Grid>
    </Box>
  );
};

export default DietSelector;
