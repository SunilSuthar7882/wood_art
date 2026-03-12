

import { useEffect, useState } from "react";
import { ArrowRight, Info, Loader2, RefreshCw } from "lucide-react";
import { Gender } from "@/utils/utils";
import UnitConverter from "@/component/CommonComponents/UnitConverter";
import { useForm } from "react-hook-form";
import CustomTextField from "@/component/CommonComponents/CustomTextField";

export default function BMRCalculator({
  defaultValues,
  sharedValues,
  setCalcResult,
  setCalcBmrResult,
  calcResult,
  onComplete,
  step,
  setStep,
}) {
 
  const initialFormData = {
    age: "",
    gender: "male",
    weightKg: "",
    heightCm: "",
    heightFeet: "",
    heightInches: "",
    weightLbs: "",
    activityLevel: "",
    bodyFat: "",
    formula: "mifflin",
  };
  const { register, handleSubmit, reset, validate } = useForm({
    defaultValues: initialFormData,
  });
  const [bmr, setBmr] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState(null);
  const [unitSystem, setUnitSystem] = useState("metric"); // "metric" or "us"

  // Activity level data for TDEE calculation
  const activityData = [
    { label: "Basal Metabolic Rate (BMR)", value: "1" },
    { label: "Sedentary: little or no exercise", value: "1.2" },
    { label: "Light: exercise 1-3 times/week", value: "1.375" },
    { label: "Moderate: exercise 4-5 times/week", value: "1.465" },
    {
      label: "Active: daily exercise or intense exercise 3-4 times/week",
      value: "1.55",
    },
    { label: "Very Active: intense exercise 6-7 times/week", value: "1.725" },
    {
      label: "Extra Active: very intense exercise daily, or physical job",
      value: "1.9",
    },
  ];

  // const [formData, setFormData] = useState({
  //   age: "",
  //   gender: "male",
  //   weightKg: "",
  //   heightCm: "",
  //   heightFeet: "",
  //   heightInches: "",
  //   weightLbs: "",
  //   activityLevel: "",
  //   bodyFat: "",
  //   formula: "mifflin",
  // });
  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (defaultValues) {
      setFormData((prev) => ({ ...prev, ...defaultValues }));
    }
  }, [defaultValues]);

  useEffect(() => {
    if (defaultValues?.formData) {
      setFormData(defaultValues.formData);
      setResults(calcResult);
      setUnitSystem(defaultValues.unitSystem);
    }
  }, [calcResult, defaultValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const validateForm = () => {
  //   const newErrors = {};

  //   // Age validation
  //   if (!formData.age) {
  //     newErrors.age = "Age is required";
  //   } else if (parseFloat(formData.age) < 1 || parseFloat(formData.age) > 120) {
  //     newErrors.age = "Age must be between 1 and 120";
  //   }

  //   // Height validation
  //   if (unitSystem === "metric") {
  //     if (!formData.heightCm) {
  //       newErrors.heightCm = "Height is required";
  //     } else if (
  //       parseFloat(formData.heightCm) < 1 ||
  //       parseFloat(formData.heightCm) > 300
  //     ) {
  //       newErrors.heightCm = "Height must be between 1cm and 300cm";
  //     }
  //   } else {
  //     if (!formData.heightFeet && !formData.heightInches) {
  //       newErrors.heightFeet = "Height is required";
  //     } else {
  //       const totalInches =
  //         parseFloat(formData.heightFeet || 0) * 12 +
  //         parseFloat(formData.heightInches || 0);
  //       if (totalInches < 20 || totalInches > 118) {
  //         newErrors.heightFeet = "Height must be between 20 and 118 inches";
  //       }
  //     }
  //   }

  //   // Weight validation
  //   if (unitSystem === "metric") {
  //     if (!formData.weightKg) {
  //       newErrors.weightKg = "Weight is required";
  //     } else if (
  //       parseFloat(formData.weightKg) < 1 ||
  //       parseFloat(formData.weightKg) > 400
  //     ) {
  //       newErrors.weightKg = "Weight must be between 1kg and 400kg";
  //     }
  //   } else {
  //     if (!formData.weightLbs) {
  //       newErrors.weightLbs = "Weight is required";
  //     } else if (
  //       parseFloat(formData.weightLbs) < 44 ||
  //       parseFloat(formData.weightLbs) > 661
  //     ) {
  //       newErrors.weightLbs = "Weight must be between 44lbs and 661lbs";
  //     }
  //   }

  //   // Body fat validation (only for Katch-McArdle)
  //   if (formData.formula === "katch") {
  //     if (!formData.bodyFat) {
  //       newErrors.bodyFat =
  //         "Body fat percentage is required for Katch-McArdle formula";
  //     } else if (
  //       parseFloat(formData.bodyFat) < 1 ||
  //       parseFloat(formData.bodyFat) > 60
  //     ) {
  //       newErrors.bodyFat = "Body fat must be between 1% and 60%";
  //     }
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };


  const validateForm = () => {
  const newErrors = {};

  // Age validation
  if (!formData.age) {
    newErrors.age = "Age is required";
  } else if (parseFloat(formData.age) < 0) {
    newErrors.age = "Age cannot be negative";
  }

  // Height validation
  if (unitSystem === "metric") {
    if (!formData.heightCm) {
      newErrors.heightCm = "Height is required";
    } else if (parseFloat(formData.heightCm) < 0) {
      newErrors.heightCm = "Height cannot be negative";
    }
  } else {
    if (!formData.heightFeet && !formData.heightInches) {
      newErrors.heightFeet = "Height is required";
    } else {
      const totalInches =
        parseFloat(formData.heightFeet || 0) * 12 +
        parseFloat(formData.heightInches || 0);
      if (totalInches < 0) {
        newErrors.heightFeet = "Height cannot be negative";
      }
    }
  }

  // Weight validation
  if (unitSystem === "metric") {
    if (!formData.weightKg) {
      newErrors.weightKg = "Weight is required";
    } else if (parseFloat(formData.weightKg) < 0) {
      newErrors.weightKg = "Weight cannot be negative";
    }
  } else {
    if (!formData.weightLbs) {
      newErrors.weightLbs = "Weight is required";
    } else if (parseFloat(formData.weightLbs) < 0) {
      newErrors.weightLbs = "Weight cannot be negative";
    }
  }

  // Body fat validation (only for Katch-McArdle)
  if (formData.formula === "katch") {
    if (!formData.bodyFat) {
      newErrors.bodyFat =
        "Body fat percentage is required for Katch-McArdle formula";
    } else if (parseFloat(formData.bodyFat) < 0) {
      newErrors.bodyFat = "Body fat cannot be negative";
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleUnitSystemChange = (system) => {
    if (system === unitSystem) return;

    if (system === "us") {
      // Clear metric fields when switching to US
      setFormData((prev) => ({
        ...prev,
        heightCm: "",
        weightKg: "",
        heightFeet: "",
        heightInches: "",
        weightLbs: "",
      }));
    } else if (system === "metric") {
      // Clear US fields when switching to Metric
      setFormData((prev) => ({
        ...prev,
        heightCm: "",
        weightKg: "",
        heightFeet: "",
        heightInches: "",
        weightLbs: "",
      }));
    }

    setUnitSystem(system);
  };

  // UPDATED CALCULATION FUNCTION
  const calculateResults = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsCalculating(true);

    setTimeout(() => {
      // Get height in cm with precise conversion
      let heightInCm = 0;

      if (unitSystem === "metric") {
        heightInCm = parseFloat(formData.heightCm || 0);
      } else {
        const feet = parseFloat(formData.heightFeet || 0);
        let inches = parseFloat(formData.heightInches || 0);

        // Add slight offset to inch value
        // inches += 1.9;

        const totalInches = feet * 12 + inches;
        heightInCm = totalInches * 2.54;
      }

      // Get weight in kg with precise conversion
      let weightInKg = 0;
      if (unitSystem === "metric") {
        weightInKg = parseFloat(formData.weightKg || 0);
      } else {
        // Use exact conversion: 1 lb = 0.453592 kg (more precise than dividing by 2.20462)
        weightInKg = parseFloat(formData.weightLbs || 0) * 0.453592;
      }

      const age = parseFloat(formData.age);
      let bmr = 0;

      // Calculate BMR based on selected formula
      switch (formData.formula) {
        case "mifflin":
          // Mifflin-St Jeor Equation
          if (formData.gender === "male") {
            bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
          } else {
            bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
          }
          break;

        case "harris":
          // Revised Harris-Benedict Equation
          if (formData.gender === "male") {
            bmr =
              13.397 * weightInKg + 4.799 * heightInCm - 5.677 * age + 88.362;
          } else {
            bmr =
              9.247 * weightInKg + 3.098 * heightInCm - 4.33 * age + 447.593;
          }
          break;

        case "katch":
          // Katch-McArdle Formula - needs body fat percentage
          const bodyFatPercentage = parseFloat(formData.bodyFat) || 20;
          const leanBodyMass = weightInKg * (1 - bodyFatPercentage / 100);
          bmr = 370 + 21.6 * leanBodyMass;
          break;
      }

      bmr = Math.round(bmr);

      // Calculate TDEE for each activity level
      const activityLevels = activityData.map((activity) => ({
        label: activity.label,
        multiplier: activity.value,
        calories: Math.round(bmr * parseFloat(activity.value)),
      }));

      const finalResults = { bmr, activityLevels };

      setResults(finalResults);
     
     

      setIsCalculating(false);
      // ✅ Pass both formData and results up to parent
      onComplete({ formData, unitSystem }, finalResults);
    }, 500);

  
  };
 
  // Handle unit conversion completion
  const handleConversionComplete = (conversionData) => {
    // You can use the conversion data as needed
  };

  // ✅ Function to send only shared values to parent
  const handleNext = () => {
    const shared = {
      age: formData.age,
      gender: formData.gender,
      weightKg: formData.weightKg,
      heightCm: formData.heightCm,
      heightFeet: formData.heightFeet,
      heightInches: formData.heightInches,
      weightLbs: formData.weightLbs,
      activityLevel: formData.activityLevel,
      unitSystem,
    };

    // Call onComplete with shared values and current results
    onComplete(shared, results); // results is already stored after calculation
    setStep((prev) => prev + 1); // move to next step
    setCalcBmrResult(results);
  };

  // Toggle unit converter visibility
  const [showUnitConverter, setShowUnitConverter] = useState(false);

  return (
    <div className="flex flex-row flex-start p-2 gap-4">
      <div className="flex flex-col w-1/2 border p-2 rounded-md">
        <p className="text-gray-600 text-center mb-6">
          {`The Basal Metabolic Rate (BMR) Calculator estimates your basal metabolic rate—the amount of energy expended while at rest in a neutrally temperate environment.`}
        </p>

        {/* Unit Converter Section */}
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
          onSubmit={calculateResults}
          className="flex flex-col w-full space-y-6 flex-1"
        >
          {/* <div className="flex flex-col w-full"> */}
          {/* Left Column: Basic Information */}
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
                  Metric (cm, kg)
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
                  US (ft/in, lbs)
                </button>
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Age
              </label>
              <CustomTextField
                type="number"
                {...register("age", {
                  validate: (value) => value >= 0 || "Age cannot be negative",
                })}
                name="age"
                className={`bg-white appearance-none border rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.age ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleInputChange}
              />

              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Gender.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.gender === option.value
                        ? "bg-green-50 border-green-500 text-green-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      className="sr-only"
                      value={option.value}
                      checked={formData.gender === option.value}
                      onChange={handleInputChange}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Height - Metric */}
            {unitSystem === "metric" && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Height (cm)
                </label>
                <CustomTextField
                  type="number"
                  {...register("heightCm", {
                    validate: (value) =>
                      value >= 0 || "Height cannot be negative",
                  })}
                  name="heightCm"
                  className={`bg-white appearance-none border rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.heightCm ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Height in cm"
                  step="0.1"
                  value={formData.heightCm}
                  onChange={handleInputChange}
                />

                {errors.heightCm && (
                  <p className="text-red-500 text-xs mt-1">{errors.heightCm}</p>
                )}
              </div>
            )}

            {/* Height - US */}
            {unitSystem === "us" && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Height (ft & in)
                </label>
               <div className="flex space-x-2">
  <div className="flex-1">
    <CustomTextField
      type="number"
      {...register("heightFeet", {
        validate: (value) => value >= 0 || "Feet cannot be negative",
      })}
      name="heightFeet"
      className={`bg-white appearance-none border rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 ${
        errors.heightFeet ? "border-red-500" : "border-gray-300"
      }`}
      placeholder="Feet"
      value={formData.heightFeet}
      onChange={handleInputChange}
    />
  </div>
  <div className="flex-1">
    <CustomTextField
      type="number"
      {...register("heightInches", {
        validate: (value) => value >= 0 || "Inches cannot be negative",
      })}
      name="heightInches"
      className={`bg-white appearance-none border rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 ${
        errors.heightInches ? "border-red-500" : "border-gray-300"
      }`}
      placeholder="Inches"
      value={formData.heightInches}
      onChange={handleInputChange}
    />
  </div>
</div>

                {errors.heightFeet && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.heightFeet}
                  </p>
                )}
              </div>
            )}

            {/* Weight - Metric */}
            {unitSystem === "metric" && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Weight (kg)
                </label>
               <CustomTextField
  type="number"
  {...register("weightKg", {
    validate: (value) => value >= 0 || "Weight cannot be negative",
  })}
  name="weightKg"
  className={`bg-white appearance-none border rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 ${
    errors.weightKg ? "border-red-500" : "border-gray-300"
  }`}
  placeholder="Weight in kg"
  step="0.1"
  value={formData.weightKg}
  onChange={handleInputChange}
/>

                {errors.weightKg && (
                  <p className="text-red-500 text-xs mt-1">{errors.weightKg}</p>
                )}
              </div>
            )}

            {/* Weight - US */}
            {unitSystem === "us" && (
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Weight (lbs)
                </label>
                <CustomTextField
                  type="number"
                   {...register("weightLbs", {
    validate: (value) => value >= 0 || "Weight cannot be negative",
  })}
                  name="weightLbs"
                  className={`bg-white appearance-none border rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.weightLbs ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Weight in pounds"
                  step="0.1"
                 
                  value={formData.weightLbs}
                  onChange={handleInputChange}
                />
                {errors.weightLbs && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.weightLbs}
                  </p>
                )}
              </div>
            )}

            {/* Body Fat % (only for Katch-McArdle) */}
            {formData.formula === "katch" && (
              <div>
                <label className=" text-gray-700 text-sm font-medium mb-2 flex items-center">
                  Body Fat Percentage
                  <span className="group relative ml-1">
                    <Info size={16} className="text-gray-400" />
                    <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg left-0 ml-6">
                      Required for the Katch-McArdle formula which accounts for
                      lean body mass.
                    </div>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="bodyFat"
                    className={`bg-white appearance-none border rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.bodyFat ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your body fat percentage"
                    min="1"
                    max="60"
                    value={formData.bodyFat}
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                {errors.bodyFat && (
                  <p className="text-red-500 text-xs mt-1">{errors.bodyFat}</p>
                )}
              </div>
            )}
          </div>

          <div className="pt-6 flex justify-center gap-4 flex-wrap">
            {/* Back Button */}
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Back
              </button>
            )}

            {/* Calculate button (only does calculation) */}
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
                  Calculate BMR
                  <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </button>

            {/* Next button (enabled only after result is ready) */}
            {results && (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg"
              >
                Next
              </button>
            )}

            {/* Clear Button */}
            <button
              type="button"
              // onClick={() => {
              //   reset();
              //   setResults(null);
              //   setStep(1); // reset to first step
              //   setFormData(null);
              // }}
              onClick={() => {
                reset(initialFormData);
                setFormData(initialFormData);
                setResults(null);
                setStep(1);
              }}
              className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Clear
            </button>
          </div>
          {/* </div> */}
        </form>
      </div>
      {/* Results Section */}
      {results && (
        <div className="flex flex-col mt-8 w-1/2">
          <div className="w-full flex flex-col">
            {/* BMR Result */}
            <div className="bg-green-50 rounded-lg p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">
                Basal Metabolic Rate (BMR)
              </h3>
              <div className="flex items-center justify-center mb-3">
                <div className="text-5xl font-bold text-green-600">
                  {results.bmr}
                </div>
                <div className="text-lg ml-2 text-green-600">calories/day</div>
              </div>
              <p className="text-gray-600 text-sm text-center">
                This is the number of calories your body needs to maintain vital
                functions at rest.
              </p>
            </div>

            {/* Activity Level Table */}
            <div className="mt-6 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Daily calorie needs based on activity level
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="bg-green-600 text-white px-4 py-2 text-left">
                        Activity Level
                      </th>
                      <th className="bg-green-600 text-white px-4 py-2 text-right">
                        Calories
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.activityLevels.map((level, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="border px-4 py-2">{level.label}</td>
                        <td className="border px-4 py-2 text-right font-medium">
                          {level.calories}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p className="mb-2">Exercise intensity descriptions:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Exercise: 15-30 minutes of elevated heart rate activity.
                  </li>
                  <li>
                    Intense exercise: 45-120 minutes of elevated heart rate
                    activity.
                  </li>
                  <li>
                    Very intense exercise: 2+ hours of elevated heart rate
                    activity.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Understanding Your Results
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium">BMR (Basal Metabolic Rate):</span>{" "}
                The number of calories your body needs to maintain basic
                physiological functions while at complete rest.
              </p>
              <p>
                <span className="font-medium">
                  TDEE (Total Daily Energy Expenditure):
                </span>{" "}
                Your total calorie burn including BMR, daily activities, and
                exercise.
              </p>
              <p>
                <span className="font-medium">For weight maintenance:</span>{" "}
                Consume approximately your TDEE in calories each day.
              </p>
              <p>
                <span className="font-medium">For weight loss:</span> Consume
                fewer calories than your TDEE (a deficit).
              </p>
              <p>
                <span className="font-medium">For weight gain:</span> Consume
                more calories than your TDEE (a surplus).
              </p>
              <p>
                Your BMR represents the minimum number of calories needed to
                keep your body functioning at rest. This includes breathing,
                circulation, temperature regulation, and cell production.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
