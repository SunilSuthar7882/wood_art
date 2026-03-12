// MacroCalculator.jsx
import {
  Box,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Collapse,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import CalculatorForm from "./CalculatorForm";
import DietSelector from "./DietSelector";
import ResultsDisplay from "./ResultDisplay";
import { calculateBMR } from "@/utils/calculations";
import UnitConverter from "@/component/CommonComponents/UnitConverter";
import { RefreshCw } from "lucide-react";
import {
  activityData,
  dietConfig,
  goalData,
  dietTypes,
} from "@/constants/macroCalculator";
import MacroCalculations from "@/constants/MacroCalculations";
import { Document, Page, pdf } from "@react-pdf/renderer";

const steps = ["Enter Body Metrics", "View Results & Select Diet"];

export default function MacroCalculator({
  defaultValues,
  sharedValues,
  calcResult,
  step,
  setStep,
  onComplete,
  tdee,
  calcBmrResult,
  calcTDEEResult,
  selectedActivity,
  setSelectedActivity,
}) {
  console.log("step", step);
  
  // Fixed Calculator Logic with Proper US Unit Handling
  const [macro, setMacro] = useState(null);
  const [results, setResults] = useState(null);
  const [TDEE, setTDEE] = useState(0);
  const [bmi, setBMI] = useState(0);
  const [selectedDiet, setSelectedDiet] = useState("balanced");
  const [selectedGoal, setSelectedGoal] = useState("m");
  // const [selectedActivity, setSelectedActivity] = useState("");
  const [bodyMetrics, setBodyMetrics] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [unitSystem, setUnitSystem] = useState("metric"); // 'metric' or 'us'
  const [showUnitConverter, setShowUnitConverter] = useState(false);
  const [formula, setFormula] = useState("mifflin");
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    trigger,
    getValues,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      age: "",
      gender: "",
      height: "",
      heightFeet: "",
      heightInches: "",
      weightKg: "",
      weight: "",
      activityLevel: "",
      goal: "",
      bodyFat: "20",
      formula: "mifflin",
      selectedDiet: "balanced",
      selectedGoal: "m",
    },
    mode: "onChange",
  });
  // Helper function to convert feet and inches to total inches
  const convertFeetInchesToInches = (feet, inches) => {
    const feetNum = parseFloat(feet) || 0;
    const inchesNum = parseFloat(inches) || 0;
    return feetNum * 12 + inchesNum;
  };

  // Helper function to convert inches to feet and inches
  const convertInchesToFeetInches = (totalInches) => {
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round((totalInches % 12) * 10) / 10;
    return { feet, inches };
  };

  const handleUnitChange = (event, newUnit) => {
    if (newUnit === unitSystem) return;

    reset({
      ...watch(),
      height: "",
      weight: "",
      heightFeet: "",
      heightInches: "",
    });

    setUnitSystem(newUnit);
  };

  const handleFormulaChange = (newFormula) => {
    setFormula(newFormula);
    setValue("formula", newFormula);
  };

  const calculateMacronutrientsFromTDEE = (
    tdee,
    proteinPercentage,
    carbsPercentage,
    fatPercentage
  ) => {
    const validTdee =
      typeof tdee === "number" && !isNaN(tdee) && tdee > 0 ? tdee : 2000;
    const validProtein =
      typeof proteinPercentage === "number" && !isNaN(proteinPercentage)
        ? proteinPercentage
        : 30;
    const validCarbs =
      typeof carbsPercentage === "number" && !isNaN(carbsPercentage)
        ? carbsPercentage
        : 40;
    const validFat =
      typeof fatPercentage === "number" && !isNaN(fatPercentage)
        ? fatPercentage
        : 30;

    const proteinCalories = (validProtein / 100) * validTdee;
    const carbsCalories = (validCarbs / 100) * validTdee;
    const fatCalories = (validFat / 100) * validTdee;

    const proteinGrams = proteinCalories / 4;
    const carbsGrams = carbsCalories / 4;
    const fatGrams = fatCalories / 9;

    return {
      proteinGrams: proteinGrams || 0,
      carbsGrams: carbsGrams || 0,
      fatGrams: fatGrams || 0,
      totalCalories: validTdee,
    };
  };

  // Enhanced useEffect to handle formula changes
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "formula" && value.formula !== formula) {
        setFormula(value.formula);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, formula]);
  // Fixed onSubmit function with proper US unit handling
  const onSubmit = (data) => {
    const ageNum = parseFloat(data.age);
    let heightNum = 0;
    // let weightNum = parseFloat(data.weight);
    let weightNum = 0;

    if (unitSystem === "metric") {
      weightNum = parseFloat(data.weightKg); // use weightKg in metric
    } else {
      weightNum = parseFloat(data.weight); // lbs → kg
    }
    const bodyFatNum = parseFloat(data.bodyFat) || 20;

    // Handle height conversion based on unit system
    if (unitSystem === "metric") {
      heightNum = parseFloat(data.height);
    } else {
      // US system - combine feet and inches

      const feet = parseFloat(data.heightFeet || 0);
      let inches = parseFloat(data.heightInches || 0);

      // Add slight offset to inch value
      // inches += 1.9;

      const totalInches = feet * 12 + inches;
      heightNum = totalInches * 2.54;
    }

    // Convert weight to kg if using US system
    if (unitSystem === "us") {
      weightNum = parseFloat(weightNum || 0) * 0.453592;
    }

    // // Height validation
    // if (heightNum === null || heightNum <= 0) {
    //   console.error("Invalid height value:", heightNum);
    //   alert("Please enter a valid height");
    //   return;
    // }

    // // Weight validation
    // if (weightNum === null || weightNum <= 0) {
    //   console.error("Invalid weight value:", weightNum);
    //   alert("Please enter a valid weight");
    //   return;
    // }

    // Calculate BMR based on selected formula
    let bmr = 0;
    let leanBodyMass = 0;

    switch (formula) {
      case "mifflin":
        if (data.gender === "male") {
          bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
        } else {
          bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
        }

        break;

      case "harris":
        if (data.gender === "male") {
          bmr =
            13.397 * weightNum + 4.799 * heightNum - 5.677 * ageNum + 88.362;
        } else {
          bmr = 9.247 * weightNum + 3.098 * heightNum - 4.33 * ageNum + 447.593;
        }

        break;

      case "katch":
        leanBodyMass = weightNum * (1 - bodyFatNum / 100);
        bmr = 370 + 21.6 * leanBodyMass;

        break;

      default:
        console.error("Unknown formula:", formula);
        // Default to Mifflin-St Jeor
        if (data.gender === "male") {
          bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
        } else {
          bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
        }
    }

    // Calculate TDEE
    const activityFactor = data.activityLevel
      ? parseFloat(data.activityLevel)
      : null;
    if (!activityFactor || activityFactor <= 0) {
      console.error("Invalid activity factor:", activityFactor);
      alert("Please select an activity level");
      return;
    }

    let dailyCalories = bmr * activityFactor;

    // Apply goal adjustment
    const calorieAdjustments = {
      l: -250, // mild weight loss
      l1: -500, // moderate weight loss
      l2: -1000, // aggressive weight loss
      g: 250, // mild weight gain
      g1: 500, // moderate weight gain
      g2: 1000, // aggressive weight gain
      m: 0, // maintain weight
    };

    const goalAdjustment = calorieAdjustments[data.goal] || 0;

    dailyCalories += goalAdjustment;

    // Ensure minimum calorie intake
    const minCalories = data.gender === "male" ? 1500 : 1200;
    dailyCalories = Math.max(dailyCalories, minCalories);
    // Debug complete calculation
    // debugCalculation(formula, data, bmr, dailyCalories);

    setTDEE(dailyCalories);

    // Store body metrics with proper unit handling
    setBodyMetrics({
      weight: weightNum, // Always stored in kg
      height: heightNum, // Always stored in cm
      gender: data.gender,
      age: ageNum,
      bodyFat: bodyFatNum,
      bmr: Math.round(bmr),
      goal: data.selectedGoal,
      formula: formula,
      unitSystem: data.unitSystem,
      originalValues: {
        height:
          unitSystem === "metric"
            ? `${data.height}cms`
            : `${data.heightFeet}ft ${data.heightInches}in`,
        weight:
          unitSystem === "metric" ? `${data.weightKg}Kgs` : `${data.weight}lbs`,
      },
      leanBodyMass:
        formula === "katch" ? Math.round(leanBodyMass * 10) / 10 : null,
    });
    // Calculate macros based on the selected diet
    calculateDiet(selectedDiet, dailyCalories);

    // Move to results step
    setActiveStep(1);

   
  };

 

  const calculateDiet = (type, tdeeValue = TDEE, customMacroValues = null) => {
    if (typeof tdeeValue !== "number" || isNaN(tdeeValue) || tdeeValue <= 0) {
      console.warn("Invalid TDEE value:", tdeeValue);
      return;
    }

    setSelectedDiet(type);

    let macros;
    if (type === "custom" && customMacroValues) {
      macros = customMacroValues;
    } else if (dietConfig.hasOwnProperty(type)) {
      macros = dietConfig[type];
    } else {
      macros = dietConfig.balanced;
      setSelectedDiet("balanced");
    }

    const { p, c, f } = macros;

    const result = calculateMacronutrientsFromTDEE(
      tdeeValue,
      p,
      c,
      f
    );

    setResults({
      calories: Math.round(result.totalCalories),
      protein: Math.round(result.proteinGrams),
      carbs: Math.round(result.carbsGrams),
      fats: Math.round(result.fatGrams),
      dietType: type,
      macroPercentages: {
        p,
        c,
        f,
      },
    });
  };

  const handleNextStep = async () => {
    // Validate required fields based on current unit system
    const fieldsToValidate = [
      "age",
      "gender",
      "weight",
      "activityLevel",
      "goal",
    ];

    if (unitSystem === "metric") {
      fieldsToValidate.push("height");
    } else {
      fieldsToValidate.push("heightFeet", "heightInches");
    }

    if (formula === "katch") {
      fieldsToValidate.push("bodyFat");
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      handleSubmit(onSubmit)();
    } else {
    }
  };

  const handleBack = () => {
    setActiveStep(0);
  };

  const getGoalDescription = (goalCode) => {
    const goal = goalData.find((g) => g.value === goalCode);
    return goal ? goal.description : "";
  };

  const handleConversionComplete = () => {
    // Optional callback when unit conversion is complete
  };

  // const handlePDFDownload = async () => {
  //   if (results && bodyMetrics && unitSystem && selectedDiet && TDEE) {
  //     // ✅ log the data you are passing
  //     console.log("PDF export data:", {
  //       results,
  //       bodyMetrics,
  //       unitSystem,
  //       selectedDiet,
  //       TDEE
  //     });

  //     const blob = await pdf(
  //       <Document>
  //         <Page size="A4">
  //           <MacroCalculations
  //             results={results}
  //             bodyMetrics={bodyMetrics}
  //             unitSystem={unitSystem}
  //             selectedDiet={selectedDiet}
  //             TDEE={TDEE}
  //           />
  //         </Page>
  //       </Document>
  //     ).toBlob();

  //     const blobUrl = URL.createObjectURL(blob);
  //     const downloadLink = document.createElement("a");
  //     downloadLink.href = blobUrl;
  //     downloadLink.download = "Your_requested_custom_meal_plan.pdf";
  //     document.body.appendChild(downloadLink);
  //     downloadLink.click();
  //     document.body.removeChild(downloadLink);

  //     window.open(blobUrl, "_blank");

  //     setTimeout(() => {
  //       URL.revokeObjectURL(blobUrl);
  //     }, 100);
  //   } else {
  //     console.warn("❌ Missing data for PDF generation:", {
  //       results,
  //       bodyMetrics,
  //       unitSystem,
  //     });
  //   }
  // };

  return (
    <>
      <div className="flex flex-row gap-4">
        <div className="flex flex-col w-1/2">
          <Box
            sx={{
              maxWidth: 1200,
              mx: "auto",
              p: 2,
              border: 1,
              borderRadius: 2,
              borderColor: "#e5e7eb",
            }}
          >
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ mb: 1 }}
            >
              Calculate your personalized macronutrient recommendations based on
              your body metrics and fitness goals
            </Typography>

            {/* Unit Converter Section */}
            <Box sx={{ mb: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<RefreshCw size={18} />}
                onClick={() => setShowUnitConverter(!showUnitConverter)}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                {showUnitConverter
                  ? "Hide Unit Converter"
                  : "Show Unit Converter"}
              </Button>

              <Collapse in={showUnitConverter}>
                <Box
                  sx={{
                    mt: 2,
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Unit Converter
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    {/* Length Converter */}
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                        Length Converter
                      </Typography>
                      <UnitConverter
                        type="length"
                        initialValue=""
                        initialFromUnit="cm"
                        initialToUnit="ft"
                        onConversionComplete={handleConversionComplete}
                        useMuiComponents={true}
                      />
                    </Box>

                    {/* Weight Converter */}
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                        Weight Converter
                      </Typography>
                      <UnitConverter
                        type="weight"
                        initialValue=""
                        initialFromUnit="kg"
                        initialToUnit="lb"
                        onConversionComplete={handleConversionComplete}
                        useMuiComponents={true}
                      />
                    </Box>
                  </Box>
                </Box>
              </Collapse>
            </Box>

            {activeStep === 0 && (
  <Box sx={{ display: "flex", justifyContent: "center", mb: 2, gap: 2 }}>
    <Button
      variant="outlined"
      onClick={() => setUnitSystem("metric")}
      sx={{
        px: 3,
        py: 1,
        borderRadius: 2,
        borderColor: unitSystem === "metric" ? "primary.main" : "grey.400",
        color: unitSystem === "metric" ? "primary.main" : "text.primary",
      }}
    >
      Metric (cm/kg)
    </Button>
    <Button
      variant="outlined"
      onClick={() => setUnitSystem("us")}
      sx={{
        px: 3,
        py: 1,
        borderRadius: 2,
        borderColor: unitSystem === "us" ? "primary.main" : "grey.400",
        color: unitSystem === "us" ? "primary.main" : "text.primary",
      }}
    >
      US (in/lbs)
    </Button>
  </Box>
)}


            {/* <Stepper
          activeStep={activeStep}
          sx={{ mb: 2, p: 2 }}
          className="container mx-auto"
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper> */}

            {/* {activeStep === 0 && ( */}
            <CalculatorForm
              setUnitSystem={setUnitSystem}
              step={step}
              setStep={setStep}
              sharedValues={sharedValues}
              register={register}
              control={control}
              errors={errors}
              watch={watch}
              reset={reset}
              activityData={activityData}
              goalData={goalData}
              onSubmit={handleNextStep}
              unitSystem={unitSystem}
              onFormulaChange={handleFormulaChange}
              dietTypes={dietTypes}
              setSelectedDiet={setSelectedDiet}
              selectedDiet={selectedDiet}
              selectedGoal={selectedGoal}
              setSelectedGoal={setSelectedGoal}
              setActiveStep={setActiveStep}
              setResults={setResults}
              setBodyMetrics={setBodyMetrics}
              selectedActivity={selectedActivity}
              bmi={bmi}
              setBMI={setBMI}
              setSelectedActivity={setSelectedActivity}
            />
            {/* )} */}
          </Box>
        </div>

        {results && bodyMetrics && (
          <div className="flex flex-col w-1/2 border p-2 rounded-md">
            <>
              <ResultsDisplay
                results={results}
                bodyMetrics={bodyMetrics}
                unitSystem={unitSystem}
                TDEE={TDEE}
                bmi={bmi}
                setBMI={setBMI}
                selectedDiet={selectedDiet}
                selectedGoal={selectedGoal}
                calcBmrResult={calcBmrResult}
                calcTDEEResult={calcTDEEResult}
                selectedActivity={selectedActivity}
              />

              <DietSelector
                selectedDiet={selectedDiet}
                calculateDiet={calculateDiet}
                dietConfig={dietConfig}
                results={results}
                bodyMetrics={bodyMetrics}
                unitSystem={unitSystem}
                TDEE={TDEE}
                bmi={bmi}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  mt: 4,
                }}
              >
                {/* <button
                  onClick={() => {
                    reset();
                    setActiveStep(0);
                    setStep(1);
                    setResults(null);
                    setBodyMetrics(null);
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Start New Calculation
                </button> */}
                {/* <button
                  onClick={() => {
                    handlePDFDownload();
                    // reset();
                    // setActiveStep(0);
                    // setStep(1);
                    // setResults(null);
                    // setBodyMetrics(null);
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Download PDF
                </button> */}
              </Box>
            </>
          </div>
        )}
      </div>
    </>
  );
}
