import {
  Calculator,
  ArrowRight,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UnitConverter from "@/component/CommonComponents/UnitConverter";
import CustomTextField from "../CommonComponents/CustomTextField";

// Updated activity levels to match calculator.net exactly
const activityLevels = [
  {
    value: "1.55",
    label: "Active: daily exercise or intense exercise 3-4 times/week",
  },
  { value: "1", label: "Basal Metabolic Rate (BMR)" },
  {
    value: "1.9",
    label: "Extra Active: very intense exercise daily, or physical job",
  },
  { value: "1.375", label: "Light: exercise 1-3 times/week" },
  { value: "1.465", label: "Moderate: exercise 4-5 times/week" },
  { value: "1.2", label: "Sedentary: little or no exercise" },
  { value: "1.725", label: "Very Active: intense exercise 6-7 times/week" },
];

// BMR Formulas
const bmrFormulas = [
  { value: "mifflin", label: "Mifflin-St Jeor" },
  { value: "katch", label: "Katch-McArdle" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function TDEECalculator({
  defaultValues,
  sharedValues,
  calcResult,
  setCalcTDEEResult,
  calcTDEE,
  calcBMR,
  step,
  setStep,
  onComplete,
  bmr,
  setSelectedActivity,
}) {
  console.log("step", step);
  const [tdee, setTdee] = useState(null);
  const [bmi, setBMI] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState(null);
  const [unitSystem, setUnitSystem] = useState("metric");
  const [activity, setActivity] = useState("1.55");
  const [showUnitConverter, setShowUnitConverter] = useState(false);

  const initialFormData = {
    age: "",
    gender: "male",
    heightCm: "",
    weightKg: "",
    heightFeet: "",
    heightInches: "",
    weightLbs: "",
    activityLevel: "1.55",
    bmrFormula: "mifflin",
    bodyFat: "",
    bmi: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: initialFormData,
  });
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    // Merge sharedValues first, then defaultValues if they exist
    const prefill = {
      age: sharedValues?.age || defaultValues?.age || "",
      gender: sharedValues?.gender || defaultValues?.gender || "male",
      weightKg: sharedValues?.weightKg || defaultValues?.weightKg || "",
      heightCm: sharedValues?.heightCm || defaultValues?.heightCm || "",
      heightFeet: sharedValues?.heightFeet || defaultValues?.heightFeet || "",
      heightInches:
        sharedValues?.heightInches || defaultValues?.heightInches || "",
      weightLbs: sharedValues?.weightLbs || defaultValues?.weightLbs || "",
      activityLevel:
        sharedValues?.activityLevel || defaultValues?.activityLevel || "1.55",
      bodyFat: sharedValues?.bodyFat || defaultValues?.bodyFat || "",
      bmrFormula: defaultValues?.bmrFormula || "mifflin",
    };

    setFormData(prefill);

    // Pre-populate react-hook-form values too
    reset(prefill);

    // Set previous calculation if exists
    setResult(calcResult || null);

    // Optional: set unit system if passed
    if (sharedValues?.unitSystem) setUnitSystem(sharedValues.unitSystem);
    if (defaultValues?.bmi) setBMI(defaultValues.bmi);
  }, [sharedValues, defaultValues, calcResult, reset]);

  const handleUnitSystemChange = (system) => {
    if (system === unitSystem) return;

    if (system === "us") {
      reset({
        ...watch(),
        heightCm: "",
        weightKg: "",
        heightFeet: "",
        heightInches: "",
        weightLbs: "",
      });
    } else {
      reset({
        ...watch(),
        heightCm: "",
        weightKg: "",
        heightFeet: "",
        heightInches: "",
        weightLbs: "",
      });
    }

    setUnitSystem(system);
  };

  const convertHeight = (heightFeet, heightInches) => {
    return (Number(heightFeet) * 12 + Number(heightInches)) * 2.54;
  };

  // BMR calculation functions
  const calculateMifflinStJeor = (age, weight, height, gender) => {
    const base = 10 * weight + 6.25 * height - 5.0 * age;
    return gender === "male" ? base + 5 : base - 161;
  };

  const calculateHarrisBenedict = (age, weight, height, gender) => {
    if (gender === "male") {
      return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
      return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    }
  };

  const calculateKatchMcArdle = (weight, bodyFat) => {
    const leanBodyMass = weight * (1 - bodyFat / 100);
    return 370 + 21.6 * leanBodyMass;
  };

  const calculateBMR = (age, weight, height, gender, formula, bodyFat) => {
    switch (formula) {
      case "harris":
        return calculateHarrisBenedict(age, weight, height, gender);
      case "katch":
        if (bodyFat && bodyFat > 0) {
          return calculateKatchMcArdle(weight, bodyFat);
        }
        // Fall back to Mifflin if no body fat provided
        return calculateMifflinStJeor(age, weight, height, gender);
      default:
        return calculateMifflinStJeor(age, weight, height, gender);
    }
  };

  const calculateResults = (data) => {
    setIsCalculating(true);

    setTimeout(() => {
      let heightInCm, weightInKg;

      if (unitSystem === "metric") {
        heightInCm = Number(data.heightCm);
        weightInKg = Number(data.weightKg);
      } else {
        const feet = parseFloat(data.heightFeet || 0);
        let inches = parseFloat(data.heightInches || 0);

        // ❌ removed wrong offset
        // inches += 1.9;

        const totalInches = feet * 12 + inches;
        heightInCm = totalInches * 2.54;

        weightInKg = parseFloat(data.weightLbs || 0) * 0.453592;
      }

      const { age, gender, activityLevel, bmrFormula, bodyFat } = data;

      // Calculate BMR using selected formula
      const bmr = calculateBMR(
        Number(age),
        weightInKg,
        heightInCm,
        gender,
        bmrFormula,
        Number(bodyFat)
      );

      // Calculate TDEE or use BMR if BMR is selected
      const isBMRSelected = activityLevel === "1";
      const tdee = isBMRSelected ? bmr : bmr * Number(activityLevel);

      // Calculate BMI
      let bmi = 0;

      if (unitSystem === "metric") {
        const heightInM = heightInCm / 100;
        bmi = weightInKg / (heightInM * heightInM);
      } else {
        // ✅ ensure correct height in inches
        const feet = parseFloat(data.heightFeet || 0);
        const inches = parseFloat(data.heightInches || 0);
        const heightInInches = feet * 12 + inches;

        const weightInLbs = Number(data.weightLbs);
        bmi = (weightInLbs / (heightInInches * heightInInches)) * 703;
      }

      // Determine BMI category
      let bmiCategory = "";
      if (bmi < 18.5) bmiCategory = "Underweight";
      else if (bmi < 25) bmiCategory = "Normal";
      else if (bmi < 30) bmiCategory = "Overweight";
      else bmiCategory = "Obese";

      // Weight change calculations (only if not BMR)
      let weightLossOptions = [];
      let weightGainOptions = [];

      if (!isBMRSelected) {
        weightLossOptions = [
          {
            rate: 0.25,
            label: "Mild weight loss",
            calories: tdee - 250,
            percentage: Math.round(((tdee - 250) / tdee) * 100),
          },
          {
            rate: 0.5,
            label: "Weight loss",
            calories: tdee - 500,
            percentage: Math.round(((tdee - 500) / tdee) * 100),
          },
          {
            rate: 1,
            label: "Extreme weight loss",
            calories: tdee - 1000,
            percentage: Math.round(((tdee - 1000) / tdee) * 100),
          },
        ];

        weightGainOptions = [
          {
            rate: 0.25,
            label: "Mild weight gain",
            calories: tdee + 250,
            percentage: Math.round(((tdee + 250) / tdee) * 100),
          },
          {
            rate: 0.5,
            label: "Weight gain",
            calories: tdee + 500,
            percentage: Math.round(((tdee + 500) / tdee) * 100),
          },
          {
            rate: 1,
            label: "Fast weight gain",
            calories: tdee + 1000,
            percentage: Math.round(((tdee + 1000) / tdee) * 100),
          },
        ];
      }

      setResult({
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        bmi: Number(bmi.toFixed(1)),
        bmiCategory,
        weightLossOptions,
        weightGainOptions,
        formula: bmrFormula,
        isBMRSelected,
        metrics: {
          weight:
            unitSystem === "metric"
              ? `${weightInKg.toFixed(1)} kg`
              : `${data.weightLbs} lbs`,
          height:
            unitSystem === "metric"
              ? `${heightInCm} cm`
              : `${data.heightFeet}'${data.heightInches}"`,
          age: age,
          gender: gender,
          activity: activityLevels.find((a) => a.value === activityLevel)
            ?.label,
          activityValue: activityLevel,
        },
      });
      setBMI(bmi);
      setIsCalculating(false);
    }, 500);
  };

  const handleNext = () => {
    const values = watch();

    const shared = {
      age: formData.age,
      gender: formData.gender,
      weightKg: formData.weightKg,
      heightCm: formData.heightCm,
      heightFeet: formData.heightFeet,
      heightInches: formData.heightInches,
      weightLbs: formData.weightLbs,
      activityLevel: result.metrics.activityValue,
      unitSystem,
      bmi: result.bmi,
    };

    // Call onComplete with shared values and current results
    onComplete(shared, result);
    setStep((prev) => prev + 1);
    setCalcTDEEResult(result);
    setSelectedActivity(activity);
  };
  const BMIColor = (bmi) => {
    if (bmi < 18.5) return "text-blue-600";
    if (bmi < 25) return "text-green-600";
    if (bmi < 30) return "text-yellow-600";
    return "text-red-600";
  };

  const handleConversionComplete = (conversionData) => {
    // You can use the conversion data as needed
  };


  return (
    <div className="flex flex-row flex-start p-2 gap-4 w-full">
      <div className="flex flex-col border p-2 rounded-md w-1/2">
        <p className="text-gray-600 text-center mb-4">
          This calculator can be used to estimate your Total Daily Energy
          Expenditure (TDEE).
        </p>

        {/* Simple Unit Converter Toggle */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowUnitConverter(!showUnitConverter)}
            className="flex items-center justify-center gap-2 w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
          >
            <RefreshCw size={18} />
            <span>
              {showUnitConverter
                ? "Hide Unit Converter"
                : "Show Unit Converter"}
            </span>
          </button>

          {showUnitConverter && (
            <div className="mt-4 p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Unit Converter
              </h3>

              <div className="space-y-6">
                {/* Length Converter */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3">
                    Length Converter
                  </h4>
                  <UnitConverter
                    type="length"
                    initialValue=""
                    initialFromUnit="cm"
                    initialToUnit="ft"
                    onConversionComplete={handleConversionComplete}
                  />
                </div>

                {/* Weight Converter */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3">
                    Weight Converter
                  </h4>
                  <UnitConverter
                    type="weight"
                    initialValue=""
                    initialFromUnit="kg"
                    initialToUnit="lb"
                    onConversionComplete={handleConversionComplete}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit(calculateResults)}
          className="flex flex-col w-full space-y-6 flex-1"
        >
          {/* <div className=""> */}
          <div className="space-y-5 bg-gray-50 p-5 rounded-lg">
            {/* Unit System Toggle */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Unit System
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                    unitSystem === "metric"
                      ? "bg-green-50 border-green-500 text-green-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handleUnitSystemChange("metric")}
                >
                  Metric Units
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                    unitSystem === "us"
                      ? "bg-green-50 border-green-500 text-green-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handleUnitSystemChange("us")}
                >
                  US Units
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Age
                </label>
                <CustomTextField
                  type="number"
                  className={`bg-white appearance-none border ${
                    errors.age ? "border-red-500" : "border-gray-300"
                  } rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Enter your age"
                  {...register("age", {
                    required: "Age is required",
                    validate: (value) => value >= 0 || "Age cannot be negative",
                  })}
                />

                {errors.age && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.age.message}
                  </p>
                )}
              </div>

              {/* Gender Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {genderOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                        watch("gender") === option.value
                          ? "bg-green-50 border-green-500 text-green-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        value={option.value}
                        {...register("gender", {
                          required: "Gender is required",
                        })}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              {/* Height Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Height {unitSystem === "metric" ? "(cm)" : ""}
                </label>
                {unitSystem === "metric" ? (
                  <CustomTextField
                    type="number"
                    step="0.1"
                    className={`bg-white appearance-none border ${
                      errors.heightCm ? "border-red-500" : "border-gray-300"
                    } rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="cm"
                    {...register("heightCm", {
                      required: "Height is required",
                      validate: (value) =>
                        value >= 0 || "Height cannot be negative",
                    })}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <CustomTextField
                      type="number"
                      className={`bg-white appearance-none border ${
                        errors.heightFeet ? "border-red-500" : "border-gray-300"
                      } rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="ft"
                      {...register("heightFeet", {
                        required: "Feet is required",
                        validate: (value) =>
                          value >= 0 || "Feet cannot be negative",
                      })}
                    />
                    <CustomTextField
                      type="number"
                      className={`bg-white appearance-none border ${
                        errors.heightInches
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="in"
                      {...register("heightInches", {
                        required: "Inches is required",
                        validate: (value) =>
                          value >= 0 || "Inches cannot be negative",
                      })}
                    />
                  </div>
                )}
                {(errors.heightCm ||
                  errors.heightFeet ||
                  errors.heightInches) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.heightCm?.message ||
                      errors.heightFeet?.message ||
                      errors.heightInches?.message}
                  </p>
                )}
              </div>

              {/* Weight Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Weight {unitSystem === "metric" ? "(kg)" : "(lbs)"}
                </label>
                {unitSystem === "metric" ? (
                  <CustomTextField
                    type="number"
                    step="0.1"
                    className={`bg-white appearance-none border ${
                      errors.weightKg ? "border-red-500" : "border-gray-300"
                    } rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="kg"
                    {...register("weightKg", {
                      required: "Weight is required",
                      validate: (value) =>
                        value >= 0 || "Weight cannot be negative",
                    })}
                  />
                ) : (
                  <CustomTextField
                    type="number"
                    step="0.1"
                    className={`bg-white appearance-none border ${
                      errors.weightLbs ? "border-red-500" : "border-gray-300"
                    } rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="lbs"
                    {...register("weightLbs", {
                      required: "Weight is required",
                      validate: (value) =>
                        value >= 0 || "Weight cannot be negative",
                    })}
                  />
                )}
                {(errors.weightKg || errors.weightLbs) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.weightKg?.message || errors.weightLbs?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Activity Level Field */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Activity Level
              </label>
              <div className="relative">
                <select
                  {...register("activityLevel", {
                    required: "Activity level is required",
                    onChange: (e) => setActivity(e.target.value), // ✅ update state
                  })}
                  className="bg-white appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {activityLevels.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                />
              </div>
              {errors.activityLevel && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.activityLevel.message}
                </p>
              )}
            </div>

            {/* Body Fat Percentage (for Katch-McArdle) */}
            {watch("bmrFormula") === "katch" && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Body Fat Percentage (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="bg-white appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Body fat %"
                  {...register("bodyFat", {
                    min: { value: 5, message: "Must be at least 5%" },
                    max: { value: 50, message: "Must be 50% or less" },
                  })}
                />
                {errors.bodyFat && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.bodyFat.message}
                  </p>
                )}
              </div>
            )}

            <div className="pt-6 flex justify-center gap-4 flex-wrap">
              {/* Back Button */}
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setStep((prev) => prev - 1);
                  }}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                >
                  Back
                </button>
              )}

              {/* Calculate Button */}
              <button
                type="submit"
                disabled={isCalculating}
                className="px-8 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {isCalculating ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    Calculate
                    <ArrowRight size={20} className="ml-2" />
                  </>
                )}
              </button>

              {/* Next Button (only if result is available & not last step) */}
              {result && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Next
                </button>
              )}

              {/* Clear Button */}
              <button
                type="button"
                onClick={() => {
                  reset(initialFormData);
                  setResult(null);
                  setStep(2); // reset to first step
                  setFormData(initialFormData);
                }}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Clear
              </button>
            </div>
          </div>
          {/* </div> */}
        </form>
      </div>

      {/* Results Section */}
      {result && (
        <div className="flex flex-col w-1/2 border p-2 rounded-md">
          {/* Main Result */}
          <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200 mb-6 flex flex-col">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white rounded-full p-3 mr-4">
                <Calculator size={24} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-800">Result</h2>
            </div>
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-2">
                The Estimated TDEE rate is
              </p>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {result.tdee.toLocaleString()}
                <span className="text-lg font-normal text-gray-600 ml-2">
                  Calories per day
                </span>
              </div>
              <p className="text-sm text-gray-600">
                BMI : {result.bmi} {unitSystem === "metric" ? "kg/m²" : ""} (
                {result.bmiCategory})
              </p>
            </div>
          </div>

          {/* Weight Change Options - Only show if not BMR */}
          {!result.isBMRSelected && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Weight Loss */}
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <h3 className="text-xl font-semibold text-red-800 mb-4">
                  Energy intake to lose weight:
                </h3>
                <div className="space-y-3">
                  {result.weightLossOptions.map((option, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-red-100"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-red-700">
                            {option.label}
                          </div>
                          <div className="text-sm text-gray-600">
                            {option.rate}{" "}
                            {unitSystem === "metric" ? "Kg" : "lb"}/week
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">
                            {Math.round(option.calories).toLocaleString()}
                            <span className="text-sm font-normal">
                              {" "}
                              {option.percentage}%
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Calories/day
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 italic">
                  Please consult with a doctor when losing 0.5 kg or more per
                  week since it requires that you consume less than the minimum
                  recommendation of 1,500 calories a day.
                </p>
              </div>

              {/* Weight Gain */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  Energy intake to gain weight:
                </h3>
                <div className="space-y-3">
                  {result.weightGainOptions.map((option, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-3 border border-blue-100"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-blue-700">
                            {option.label}
                          </div>
                          <div className="text-sm text-gray-600">
                            {option.rate}{" "}
                            {unitSystem === "metric" ? "Kg" : "lb"}/week
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {Math.round(option.calories).toLocaleString()}
                            <span className="text-sm font-normal">
                              {" "}
                              {option.percentage}%
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Calories/day
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-6 border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Calculation Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <span className="font-medium">Age:</span> {result.metrics.age}{" "}
                  years
                </p>
                <p>
                  <span className="font-medium">Gender:</span>{" "}
                  {result.metrics.gender}
                </p>
                <p>
                  <span className="font-medium">Height:</span>{" "}
                  {result.metrics.height}
                </p>
                <p>
                  <span className="font-medium">Weight:</span>{" "}
                  {result.metrics.weight}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Activity:</span>{" "}
                  {result.metrics.activity}
                </p>
                <p>
                  <span className="font-medium">BMR Formula:</span>{" "}
                  {bmrFormulas.find((f) => f.value === result.formula)?.label}
                </p>
                <p>
                  <span className="font-medium">BMR:</span> {result.bmr}{" "}
                  calories/day
                </p>
                <p>
                  <span className="font-medium">BMI:</span>{" "}
                  <span className={BMIColor(result.bmi)}>
                    {result.bmi} {unitSystem === "metric" ? "kg/m²" : ""} (
                    {result.bmiCategory})
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">
                Understanding Your Results:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>
                  • <strong>BMR:</strong> Basal Metabolic Rate - calories burned
                  at complete rest
                </li>
                <li>
                  • <strong>BMI:</strong> Body Mass Index - measure of body fat
                  based on height and weight
                </li>
                <li>
                  • <strong>Activity Factor:</strong> Multiply BMR by activity
                  level to get TDEE
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
