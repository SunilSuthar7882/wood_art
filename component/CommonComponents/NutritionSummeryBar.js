import { Box, Typography } from "@mui/material";
import React from "react";

const NutritionSummaryBar = ({ nutritionData }) => {
  const {
    total_calories = 0,
    total_carbs = 0,
    total_protein = 0,
    total_fat = 0,
    total_fluid = 0,
  } = nutritionData || {};

  const nutritionItems = [
    { label: "Calories", value: total_calories, unit: "kcal" },
    { label: "Carbs", value: total_carbs, unit: "g" },
    { label: "Protein", value: total_protein, unit: "g" },
    { label: "Fat", value: total_fat, unit: "g" },
    { label: "Fluid", value: total_fluid, unit: "ml" },
  ].filter((item) => Number(item.value) !== 0);
  const defaultNutritionItems = [
    { label: "Calories", unit: "kcal" },
    { label: "Protein", unit: "g" },
    { label: "Carbs", unit: "g" },
    { label: "Fat", unit: "g" },
    { label: "Fluid", unit: "ml" },
  ];
  const mergedNutritionItems = defaultNutritionItems.map((defaultItem) => {
    const found = nutritionItems.find((n) => n.label === defaultItem.label);
    return {
      ...defaultItem,
      value: found ? found.value : 0,
    };
  });
  return (
    <>
      <Box my={2} width="100%" px={0}>
        <Box
          sx={{
            width: "100%",
            height: "45px",
            backgroundColor: "#16a34a",
            borderRadius: "8px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: 2,
            overflowX: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              px: 2,
              whiteSpace: "nowrap",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontWeight: "bold",
                fontSize: "15px",
                mr: 0.5,
              }}
            >
              Day Total:
            </Typography>

            {mergedNutritionItems.map((item, index) => {
              const formattedValue = Number(item.value).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                }
              );

              return (
                <Box
                  key={index}
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    component="span"
                    sx={{ fontWeight: 500, fontSize: "16px" }}
                  >
                    {item.label}:
                  </Typography>{" "}
                  <Typography
                    component="span"
                    sx={{ fontWeight: "bold", ml: 0.5 }}
                  >
                    {formattedValue}
                    {item.unit}
                  </Typography>
                  {index !== mergedNutritionItems.length - 1 && (
                    <Typography component="span" sx={{ mx: "8px" }}>
                      |
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default NutritionSummaryBar;
