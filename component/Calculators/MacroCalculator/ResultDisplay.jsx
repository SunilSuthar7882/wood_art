import { Routes } from "@/config/routes";
import MacroCalculations from "@/constants/MacroCalculations";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { Box, Divider, Grid, Paper, Typography, useTheme } from "@mui/material";
import { Document, Page, pdf } from "@react-pdf/renderer";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Download, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);
const ResultsDisplay = ({
  results,
  bodyMetrics,
  unitSystem,
  selectedDiet,
  TDEE,
  bmi,
  calcBmrResult,
  calcTDEEResult,
  selectedGoal,
  selectedActivity,
}) => {
  console.log("MacroResult", results);
  // console.log("calcBmrResult", calcBmrResult);
  // console.log("calcTDEEResult", calcTDEEResult);
  // console.log("selectedActivity", selectedActivity);
  const role = getLocalStorageItem("role");

  const theme = useTheme();
  const router = useRouter();
  if (!results || !bodyMetrics) {
    return null;
  }

  const formatWeight = (weight) => {
    if (unitSystem === "metric") {
      return `${weight.toFixed(1)} kg`;
    } else {
      return `${(weight * 2.20462).toFixed(1)} lbs`;
    }
  };

  const formatHeight = (height) => {
    if (unitSystem === "metric") {
      return `${height.toFixed(1)} cm`;
    } else {
      const inches = height * 0.393701;
      const feet = Math.floor(inches / 12);
      const remainingInches = Math.round(inches % 12);
      return `${feet}'${remainingInches}"`;
    }
  };

  const getFormulaName = (formula) => {
    switch (formula) {
      case "mifflin":
        return "Mifflin-St Jeor";
      case "harris":
        return "Harris-Benedict";
      case "katch":
        return "Katch-McArdle";
      default:
        return "Mifflin-St Jeor";
    }
  };

  const getGoalName = (goalCode) => {
    const isMetric = unitSystem === "metric";

    const goalMap = {
      m: "Maintain weight",
      l: `Mild weight loss (${isMetric ? "0.25 kg/week" : "0.55 lbs/week"})`,
      l1: `Weight loss (${isMetric ? "0.5 kg/week" : "1.1 lbs/week"})`,
      l2: `Aggressive weight loss (${isMetric ? "1 kg/week" : "2.2 lbs/week"})`,
      g: `Mild weight gain (${isMetric ? "0.25 kg/week" : "0.55 lbs/week"})`,
      g1: `Weight gain (${isMetric ? "0.5 kg/week" : "1.1 lbs/week"})`,
      g2: `Aggressive weight gain (${isMetric ? "1 kg/week" : "2.2 lbs/week"})`,
    };

    return goalMap[goalCode] || "Maintain weight";
  };

  // Enhanced chart data with all six nutritional values
  const chartData = {
    labels: ["Protein", "Carbs", "Fat"],
    datasets: [
      {
        data: [
          results.protein, // already included in total
          results.carbs, // already includes sugar, don't separate
          results.fats, // already includes saturated fat, don't separate
        ],
        backgroundColor: [
          theme.palette.primary.main, // Protein - blue
          theme.palette.success.main, // Carbs - green
          theme.palette.warning.main, // Fat - yellow/orange
        ],
        borderColor: [
          theme.palette.primary.dark,
          theme.palette.success.dark,
          theme.palette.warning.dark,
        ],
        borderWidth: 1,
      },
    ],
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
              const total = datasets[0].data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);

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
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value}g (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
    responsive: true,
    maintainAspectRatio: false,
  };

  const handlePDFDownload = async () => {
    if (results && bodyMetrics && unitSystem && selectedDiet && TDEE) {
      // ✅ log the data you are passing
      console.log("PDF export data:", {
        results,
        calcBmrResult,
        calcTDEEResult,
        bodyMetrics,
        unitSystem,
        selectedDiet,
        TDEE,
        bmi,
        selectedGoal,
        selectedActivity
      });

      const blob = await pdf(
        <Document>
          <Page size="A4">
            <MacroCalculations
              calcBmrResult={calcBmrResult}
              calcTDEEResult={calcTDEEResult}
              results={results}
              bodyMetrics={bodyMetrics}
              unitSystem={unitSystem}
              selectedDiet={selectedDiet}
              TDEE={TDEE}
              bmi={bmi}
              selectedGoal={selectedGoal}
              selectedActivity={selectedActivity}
            />
          </Page>
        </Document>
      ).toBlob();

      const blobUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = "Your_requested_custom_meal_plan.pdf";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      window.open(blobUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 100);
    } else {
      console.warn("❌ Missing data for PDF generation:", {
        results,
        bodyMetrics,
        unitSystem,
        TDEE,
        selectedDiet,
        bmi,
      });
    }
  };

  return (
    <Box>
      <div className="flex flex-row gap-2 justify-between">
        <Typography variant="h5" fontWeight="bold" gutterBottom mt={2}>
          Your Personalized Macro Results
        </Typography>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
          {role === "customer" && (
            <button
              onClick={() => {
                if (results?.calories) {
                  router.push(
                    `${Routes.createDietPlan}?calories=${results.calories}&dietType=${selectedDiet}`
                  );
                } else {
                  router.push(Routes.createDietPlan);
                }
              }}
              className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap h-10"
            >
              Create Diet Plan
            </button>
          )}

          <button
            onClick={handlePDFDownload}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors whitespace-nowrap h-10"
          >
            <Download className="w-4 h-4" />
            <FileText className="w-4 h-4" />
          </button>

          {/* )} */}
        </Box>
      </div>
      <Paper
        elevation={0}
        sx={{ p: 1, borderRadius: 2, bgcolor: "background.paper" }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Your Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Gender
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {bodyMetrics.gender === "male" ? "Male" : "Female"}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Age
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {bodyMetrics.age} years
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Height
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatHeight(bodyMetrics.height)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Weight
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatWeight(bodyMetrics.weight)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Formula
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {getFormulaName(bodyMetrics.formula)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Goal
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {getGoalName(bodyMetrics.goal)}
            </Typography>
          </Grid>
          {bodyMetrics.formula === "katch" && (
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Body Fat
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {bodyMetrics.bodyFat}%
              </Typography>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Calorie Calculations
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Basal Metabolic Rate (BMR)
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {bodyMetrics.bmr} calories/day
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Daily Calorie Goal
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              {results.calories} calories/day
            </Typography>
          </Grid>
        </Grid>
        <Paper elevation={0} sx={{ mt: 1 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {results.dietType.charAt(0).toUpperCase() +
              results.dietType.slice(1)}{" "}
            Diet Macros
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "primary.50",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Protein
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {results.protein || 0}g
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {results.macroPercentages?.p || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round((results.protein || 0) * 4)} cal
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "success.50",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Carbs
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="success.main">
                  {results.carbs || 0}g
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {results.macroPercentages?.c || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round((results.carbs || 0) * 4)} cal
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "warning.50",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Fat
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="warning.main">
                  {results.fats || 0}g
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {results.macroPercentages?.f || 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round((results.fats || 0) * 9)} cal
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Additional nutritional information */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "info.50",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Sugar (est.)
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="info.main">
                  {Math.round((results.carbs || 0) * 0.2)}g
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(
                    (((results.carbs || 0) * 0.2 * 4) /
                      (results.calories || 1)) *
                      100
                  )}
                  %
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round((results.carbs || 0) * 0.2 * 4)} cal
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "error.50",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Sat. Fat (est.)
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="error.main">
                  {Math.round((results.fats || 0) * 0.4)}g
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(
                    (((results.fats || 0) * 0.4 * 9) /
                      (results.calories || 1)) *
                      100
                  )}
                  %
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round((results.fats || 0) * 0.4 * 9)} cal
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  textAlign: "center",
                  // bgcolor: "grey.100",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Food Energy
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  {results.calories || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  calories/day
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round((results.calories || 0) * 4.184)} kJ/day
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Paper>
    </Box>
  );
};

export default ResultsDisplay;
