// components/CalculatorForm.jsx
import React, { useEffect, useState } from "react";
import FitnessIcon from "@mui/icons-material/FitnessCenter";
import HeightIcon from "@mui/icons-material/Height";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ScaleIcon from "@mui/icons-material/MonitorWeight";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Tooltip,
  Typography,
  TextField,
  FormLabel,
} from "@mui/material";
import { ArrowRight } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import CustomTextField from "@/component/CommonComponents/CustomTextField";
import CustomSelectController from "@/component/CommonComponents/CustomSelectController";
import { useGetMealCategories } from "@/helpers/hooks/mamAdmin/mealCategoriesList";
import CustomAutoComplete from "@/component/CommonComponents/CustomAutoComplete";
import { dietConfig } from "@/constants/macroCalculator";

const CalculatorForm = ({
  onComplete,
  calcResult,
  defaultValues,
  step,
  setStep,
  sharedValues,
  errors,
  activityData,
  selectedDiet,
  goalData,
  onSubmit,
  unitSystem,
  dietTypes,
  setSelectedDiet,
  setUnitSystem,
  watch,
  reset,
  control,
  selectedGoal,
  setSelectedGoal,
  setResults,
  setActiveStep,
  setBodyMetrics,
  selectedActivity,
  setSelectedActivity,
  bmi,
  setBMI,
}) => {
  const {
    data: categories = [],
    isLoading: isFetchingCategories,
    isError: isCategoryError,
    error: categoryError,
    refetch: refetchCategories,
  } = useGetMealCategories();
  const [result, setResult] = useState(null);
  const { setValue } = useForm({
    defaultValues: {
      age: "",
      gender: "male",
      weightKg: "",
      height: "",
      heightFeet: "",
      heightInches: "",
      weight: "",
      activityLevel: "",
      bodyFat: "",
      formula: "mifflin",
      selectedDiet: "balanced",
      selectedGoal: "m",
      BMI: "",
    },
  });

  useEffect(() => {
    // Merge sharedValues first, then defaultValues if they exist
    const prefill = {
      age: sharedValues?.age || defaultValues?.age || "",
      gender: sharedValues?.gender || defaultValues?.gender || "male",
      weightKg: sharedValues?.weightKg
        ? Number(sharedValues.weightKg)
        : defaultValues?.weightKg
        ? Number(defaultValues.weightKg)
        : 0,
      height: sharedValues?.heightCm
        ? Number(sharedValues.heightCm)
        : defaultValues?.heightCm
        ? Number(defaultValues.heightCm)
        : 0,
      heightFeet: sharedValues?.heightFeet
        ? Number(sharedValues.heightFeet)
        : defaultValues?.heightFeet
        ? Number(defaultValues.heightFeet)
        : 0,
      heightInches: sharedValues?.heightInches
        ? Number(sharedValues.heightInches)
        : defaultValues?.heightInches
        ? Number(defaultValues.heightInches)
        : 0,
      weight: sharedValues?.weightLbs
        ? Number(sharedValues.weightLbs)
        : defaultValues?.weightLbs
        ? Number(defaultValues.weightLbs)
        : 0,
      activityLevel:
        sharedValues?.activityLevel || defaultValues?.activityLevel,
      bodyFat: sharedValues?.bodyFat
        ? Number(sharedValues.bodyFat)
        : defaultValues?.bodyFat
        ? Number(defaultValues.bodyFat)
        : 20,
      formula: sharedValues?.formula || defaultValues?.formula || "mifflin",
      selectedDiet: selectedDiet || "balanced",
      selectedGoal: selectedGoal || "m",
      unitSystem: sharedValues?.unitSystem,
      bmi: bmi, // ✅ align name with useForm
    };

    // Update react-hook-form values
    reset(prefill);

    // Set previous calculation if exists
    setResult(calcResult || null);

    // Optional: set unit system if passed
    if (sharedValues?.unitSystem) setUnitSystem(sharedValues.unitSystem);
    if (sharedValues?.bmi) setBMI(sharedValues.bmi);
  }, [sharedValues, defaultValues, calcResult, reset]);

  const watchFormula = watch("formula");

  // Define unit-specific validation and display settings
  // const unitSettings = {
  //   height:
  //     unitSystem === "metric"
  //       ? {
  //           unit: "cm",
  //           placeholder: "e.g., 170",
  //           min: { value: 140, message: "Height must be at least 140cm" },
  //           max: { value: 275, message: "Height must be less than 275cm" },
  //           tooltip: "Stand straight and measure from floor to top of head",
  //         }
  //       : {
  //           unit: "ft/in",
  //           placeholderFeet: "ft",
  //           placeholderInches: "in",
  //           minFeet: { value: 4, message: "Height must be at least 4ft 7in" },
  //           maxFeet: { value: 9, message: "Height must be less than 9ft" },
  //           minInches: { value: 0, message: "Inches must be between 0-11" },
  //           maxInches: { value: 11, message: "Inches must be between 0-11" },
  //           tooltip: "Stand straight and measure from floor to top of head",
  //         },
  //   weight:
  //     unitSystem === "metric"
  //       ? {
  //           unit: "kg",
  //           placeholder: "e.g., 70.5",
  //           min: { value: 20, message: "Weight must be at least 20kg" },
  //           max: { value: 200, message: "Weight must be less than 200kg" },
  //           tooltip: "Measure in the morning before eating",
  //         }
  //       : {
  //           unit: "lbs",
  //           placeholder: "e.g., 155",
  //           min: { value: 44, message: "Weight must be at least 44lbs" },
  //           max: { value: 440, message: "Weight must be less than 440lbs" },
  //           tooltip: "Measure in the morning before eating",
  //         },
  // };

  const unitSettings = {
    height:
      unitSystem === "metric"
        ? {
            unit: "cm",
            placeholder: "e.g., 170",
            tooltip: "Stand straight and measure from floor to top of head",
          }
        : {
            unit: "ft/in",
            placeholderFeet: "ft",
            placeholderInches: "in",
            tooltip: "Stand straight and measure from floor to top of head",
          },
    weight:
      unitSystem === "metric"
        ? {
            unit: "kg",
            placeholder: "e.g., 70.5",
            tooltip: "Measure in the morning before eating",
          }
        : {
            unit: "lbs",
            placeholder: "e.g., 155",
            tooltip: "Measure in the morning before eating",
          },
  };

  const formulaOptions = [
    { value: "mifflin", label: "Mifflin-St Jeor Equation (recommended)" },
    { value: "katch", label: "Katch-McArdle Formula (uses body fat %)" },
  ];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Grid container spacing={0}>
        {/* Age and Gender Section */}
        <Grid item xs={6} sm={8} md={12}>
          <Paper
            elevation={0}
            sx={{ p: 1, bgcolor: "primary.50", borderRadius: 2 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 0 }}>
                  <FormLabel sx={{ mb: 1 }} className="text-sm mb-1">
                    Age *{" "}
                    <Tooltip
                      title="Your current age in years"
                      placement="top"
                      arrow
                    >
                      <InfoOutlinedIcon
                        fontSize="small"
                        sx={{ ml: 1, color: "action.secondary" }}
                      />
                    </Tooltip>
                  </FormLabel>

                  <Controller
                    name="age"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Age is required",
                      validate: (value) =>
                        value >= 0 || "Age cannot be negative",
                    }}
                    render={({ field }) => (
                      <CustomTextField
                        {...field}
                        type="number"
                        fullWidth
                        placeholder="Enter your age"
                        error={!!errors.age}
                        helperText={errors.age?.message}
                        variant="outlined"
                        sx={{
                          bgcolor: "white",
                          "& .MuiInputBase-root": {
                            height: 40, // Adjust this value to your desired height
                            fontSize: 14, // Optional: reduce text size
                          },
                          "& .MuiInputBase-input": {
                            padding: "10px 12px", // Adjust padding to center text vertically
                          },
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 0 }}>
                  <FormLabel sx={{ mb: 1 }} className="text-sm mb-1">
                    Gender *
                  </FormLabel>
                  {/* <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "600", mb: 1 }}
                  >
                    Gender *
                  </Typography> */}

                  <Controller
                    name="gender"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <FormControl
                        component="fieldset"
                        error={!!errors.gender}
                        fullWidth
                      >
                        <RadioGroup
                          {...field}
                          row
                          sx={{
                            "& .MuiFormControlLabel-root": {
                              flex: 1,
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                              m: 0,
                              p: "4px 8px", // reduced vertical and horizontal padding
                              mr: 1,
                              bgcolor: "white",
                              minHeight: 36, // reduced overall height
                              "&:last-child": { mr: 0 },
                            },
                            "& .MuiFormControlLabel-label": {
                              fontSize: "0.875rem", // smaller label text
                            },
                            "& .MuiRadio-root": {
                              p: 0.5, // reduce size of radio icon padding
                            },
                            "& .Mui-checked + .MuiFormControlLabel-label": {
                              color: "primary.main",
                              fontWeight: "bold",
                            },
                          }}
                        >
                          <FormControlLabel
                            value="male"
                            control={<Radio />}
                            label="Male"
                          />
                          <FormControlLabel
                            value="female"
                            control={<Radio />}
                            label="Female"
                          />
                        </RadioGroup>

                        {errors.gender && (
                          <FormHelperText>
                            {errors.gender.message}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Height and Weight Section */}
        <Grid item xs={6} sm={8} md={12}>
          <Paper
            elevation={0}
            sx={{ p: 1, bgcolor: "info.50", borderRadius: 2 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ mb: 0 }}>
                  <FormLabel sx={{ mb: 1 }} className="text-sm mb-1">
                    Height ({unitSettings.height.unit})*{" "}
                    <Tooltip
                      title={unitSettings.height.tooltip}
                      placement="top"
                      arrow
                    >
                      <InfoOutlinedIcon
                        fontSize="small"
                        sx={{ ml: 1, color: "action.secondary" }}
                      />
                    </Tooltip>
                  </FormLabel>

                  {unitSystem === "metric" ? (
                    <Controller
                      name="height"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Height is required",
                        validate: (value) =>
                          value >= 0 || "Height cannot be negative",
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          type="number"
                          inputProps={{ step: "0.1" }}
                          fullWidth
                          placeholder={unitSettings.height.placeholder}
                          error={!!errors.height}
                          helperText={errors.height?.message}
                          variant="outlined"
                          sx={{
                            bgcolor: "white",
                            "& .MuiInputBase-root": {
                              height: 40, // Adjust this value to your desired height
                              fontSize: 14, // Optional: reduce text size
                            },
                            "& .MuiInputBase-input": {
                              padding: "10px 12px", // Adjust padding to center text vertically
                            },
                          }}
                        />
                      )}
                    />
                  ) : (
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={12} md={6}>
                        <Controller
                          name="heightFeet"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: "Feet is required",
                            validate: (value) =>
                              value >= 0 || "Feet cannot be negative",
                          }}
                          render={({ field }) => (
                            <CustomTextField
                              {...field}
                              type="number"
                              fullWidth
                              placeholder={unitSettings.height.placeholderFeet}
                              error={!!errors.heightFeet}
                              helperText={errors.heightFeet?.message}
                              variant="outlined"
                              sx={{
                                bgcolor: "white",
                                "& .MuiInputBase-root": {
                                  height: 40, // Adjust this value to your desired height
                                  fontSize: 14, // Optional: reduce text size
                                },
                                "& .MuiInputBase-input": {
                                  padding: "10px 12px", // Adjust padding to center text vertically
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6} sm={8} md={6}>
                        <Controller
                          name="heightInches"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: "Inches is required",
                            validate: (value) =>
                              value >= 0 || "Inches cannot be negative",
                          }}
                          render={({ field }) => (
                            <CustomTextField
                              {...field}
                              type="number"
                              fullWidth
                              placeholder={
                                unitSettings.height.placeholderInches
                              }
                              error={!!errors.heightInches}
                              helperText={errors.heightInches?.message}
                              variant="outlined"
                              sx={{
                                bgcolor: "white",
                                "& .MuiInputBase-root": {
                                  height: 40, // Adjust this value to your desired height
                                  fontSize: 14, // Optional: reduce text size
                                },
                                "& .MuiInputBase-input": {
                                  padding: "10px 12px", // Adjust padding to center text vertically
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </Grid>

              <Grid item xs={6} sm={8} md={6}>
                <Box sx={{ mb: 0 }}>
                  <FormLabel sx={{ mb: 1 }} className="text-sm mb-1">
                    Weight ({unitSettings.weight.unit})*{" "}
                    <Tooltip
                      title={unitSettings.weight.tooltip}
                      placement="top"
                      arrow
                    >
                      <InfoOutlinedIcon
                        fontSize="small"
                        sx={{ ml: 1, color: "action.secondary" }}
                      />
                    </Tooltip>
                  </FormLabel>

                  {sharedValues?.unitSystem === "metric" ? (
                    <Controller
                      name="weightKg"
                      control={control}
                      // defaultValue=""
                      rules={{
                        required: "Weight is required",
                        validate: (value) =>
                          value >= 0 || "Weight cannot be negative",
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          type="number"
                          inputProps={{ step: "0.1" }}
                          fullWidth
                          placeholder={unitSettings.weight.placeholder}
                          error={!!errors.weightKg}
                          helperText={errors.weightKg?.message}
                          variant="outlined"
                          sx={{
                            bgcolor: "white",
                            "& .MuiInputBase-root": {
                              height: 40, // Adjust this value to your desired height
                              fontSize: 14, // Optional: reduce text size
                            },
                            "& .MuiInputBase-input": {
                              padding: "10px 12px", // Adjust padding to center text vertically
                            },
                          }}
                        />
                      )}
                    />
                  ) : (
                    <Controller
                      name="weight"
                      control={control}
                      // defaultValue=""
                      rules={{
                        required: "Weight is required",
                        validate: (value) =>
                          value >= 0 || "Weight cannot be negative",
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          type="number"
                          inputProps={{ step: "0.1" }}
                          fullWidth
                          placeholder={unitSettings.weight.placeholder}
                          error={!!errors.weight}
                          helperText={errors.weight?.message}
                          variant="outlined"
                          sx={{
                            bgcolor: "white",
                            "& .MuiInputBase-root": {
                              height: 40, // Adjust this value to your desired height
                              fontSize: 14, // Optional: reduce text size
                            },
                            "& .MuiInputBase-input": {
                              padding: "10px 12px", // Adjust padding to center text vertically
                            },
                          }}
                        />
                      )}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Activity Level Section */}
        <Grid item xs={6} sm={8} md={12}>
          <Paper
            elevation={0}
            sx={{ p: 1, bgcolor: "success.50", borderRadius: 2 }}
          >
            <Box sx={{ mb: 0 }}>
              <FormLabel sx={{ mb: 1 }} className="text-sm mb-1">
                Activity Level *{" "}
                <Tooltip
                  title="Select the option that best describes your typical weekly activity"
                  placement="top"
                  arrow
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "action.secondary" }}
                  />
                </Tooltip>
              </FormLabel>

              <CustomSelectController
                name="activityLevel"
                control={control}
                rules={{ required: "Activity level is required" }}
                options={activityData}
                renderValueLabel="Select your activity level"
                showDescriptions // ✅ because you want label + description
                error={errors.activityLevel}
                onChange={(value) => setSelectedActivity(value)} // keep external state if you need
                value={selectedActivity} // optional external binding if you track it in state
                sx={{
                  bgcolor: "white",
                  height: 40,
                  fontSize: 14,
                  "& .MuiSelect-select": {
                    py: 1,
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Goal Section */}
        <Grid item xs={6} sm={8} md={12}>
          <Paper
            elevation={0}
            sx={{ p: 1, bgcolor: "warning.50", borderRadius: 2 }}
          >
            <Box sx={{ mb: 0 }}>
              <FormLabel sx={{ mb: 1 }} className="text-sm mb-1">
                Goal *
                <Tooltip
                  title="Select your primary fitness goal"
                  placement="top"
                  arrow
                >
                  <InfoOutlinedIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "action.secondary" }}
                  />
                </Tooltip>
              </FormLabel>

              <CustomSelectController
                name="selectedGoal"
                control={control}
                rules={{ required: "Goal is required" }}
                options={goalData}
                renderValueLabel="Select your goal"
                error={errors.selectedGoal}
                onChange={(value) => {
                  const option = goalData.find((opt) => opt.value === value);

                  setSelectedGoal(value);
                }}
                sx={{
                  bgcolor: "white",
                  height: 40,
                  fontSize: 14,
                  "& .MuiSelect-select": {
                    py: 1,
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Diet Type seclection Section */}
        <Grid item xs={4} sm={6} md={12}>
          <Paper
            elevation={0}
            sx={{ p: 1, bgcolor: "warning.50", borderRadius: 2 }}
          >
            <Box sx={{ mb: 2 }}>
              <FormLabel sx={{ mb: 1 }} className="text-sm mb-1">
                Select Diet Type *
                <Tooltip title="Select your diet type" placement="top" arrow>
                  <InfoOutlinedIcon
                    fontSize="small"
                    sx={{ ml: 1, color: "action.secondary" }}
                  />
                </Tooltip>
              </FormLabel>

              {/* <CustomSelectController
                name="selectedDiet"
                control={control}
                rules={{ required: "Diet type is required" }}
                options={dietTypes
                  .filter((opt) => opt.value !== "custom") // 🚫 remove 'custom'
                  .map((opt) => {
                    const macros = dietConfig[opt.value];
                    const unavailable =
                      !macros || Object.values(macros).some((v) => v === null);

                    return {
                      ...opt,
                      disabled: unavailable,
                      description: unavailable
                        ? "Not available for calculations now"
                        : ``,
                    };
                  })}
                renderValueLabel="Select your diet type"
                showDescriptions
                error={errors.selectedDiet}
                onChange={(value) => setSelectedDiet(value)}
                value={selectedDiet}
              /> */}
              <CustomSelectController
                name="selectedDiet"
                control={control}
                rules={{ required: "Diet type is required" }}
                options={dietTypes
                  .filter((opt) => {
                    // Exclude "custom" and those with null macros
                    if (opt.value === "custom") return false;

                    const macros = dietConfig[opt.value];
                    if (!macros) return false;

                    // Exclude if any macro value is null
                    const hasNull = Object.values(macros).some(
                      (v) => v === null
                    );
                    return !hasNull;
                  })
                  .map((opt) => ({
                    ...opt,
                    description: "", // optional, you can remove or keep
                  }))}
                renderValueLabel="Select your diet type"
                showDescriptions
                error={errors.selectedDiet}
                onChange={(value) => setSelectedDiet(value)}
                value={selectedDiet}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Body Fat Percentage (only shown when Katch-McArdle formula is selected) */}
        {watchFormula === "katch" && (
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{ p: 1, bgcolor: "grey.50", borderRadius: 2 }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Body Fat Percentage *
                  <Tooltip
                    title="Your estimated body fat percentage. For accurate results, use a body fat caliper, DEXA scan, or bioelectrical impedance scale."
                    placement="top"
                    arrow
                  >
                    <InfoOutlinedIcon
                      fontSize="small"
                      sx={{ ml: 1, color: "action.secondary" }}
                    />
                  </Tooltip>
                </Typography>
                <Controller
                  name="bodyFat"
                  control={control}
                  defaultValue=""
                  rules={{
                    required:
                      "Body fat percentage is required for Katch-McArdle formula",
                    min: { value: 5, message: "Body fat must be at least 5%" },
                    max: {
                      value: 50,
                      message: "Body fat must be less than 50%",
                    },
                    pattern: {
                      value: /^[0-9]+(\.[0-9]{1,2})?$/,
                      message: "Please enter a valid percentage",
                    },
                    validate: {
                      isNumber: (value) =>
                        !isNaN(parseFloat(value)) ||
                        "Please enter a valid number",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      inputProps={{ step: "0.1" }}
                      fullWidth
                      placeholder="e.g., 20"
                      error={!!errors.bodyFat}
                      helperText={
                        errors.bodyFat?.message ||
                        "Typical ranges: 10-20% for men, 18-28% for women"
                      }
                      variant="outlined"
                      sx={{ bgcolor: "white" }}
                    />
                  )}
                />
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((prev) => prev - 1)}
            className="flex p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-normal rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            Back
          </button>
        )}

        <button
          type="submit"
          className="flex p-2 bg-green-600 border rounded-md text-white hover:bg-green-700 items-center"
        >
          Calculate Macros
          <ArrowRight size={18} />
        </button>

        <button
          onClick={() => {
            reset();
            setActiveStep(0);
            setStep(1);
            setResults(null);
            setBodyMetrics(null);
          }}
          className="flex p-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Start New Calculation
        </button>
      </Box>
    </form>
  );
};

export default CalculatorForm;
