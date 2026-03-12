import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Typography, TextField, Box } from "@mui/material";
import CustomTextField from "@/component/CommonComponents/CustomTextField";

export default function Step1() {
  const { control, watch } = useFormContext();
  const goals = watch("goals") || [];

  const goalsData = [
    "Lose weight",
    "Gain muscle",
    "Improve energy",
    "Manage a condition",
    "Eat healthy",
  ];

  return (
    <Box>
      <Box className="mb-4">
        <Typography className="!mb-2 font-medium">
          {`What's your main goal*?`}
        </Typography>
        <Controller
          name="goals"
          control={control}
          rules={{ required: "Please select at least one goal" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <Box className="flex flex-wrap gap-2">
                {goalsData.map((goal) => (
                  <Box
                    key={goal}
                    onClick={() => {
                      const isSelected = goals.includes(goal);
                      const newGoals = isSelected
                        ? goals.filter((g) => g !== goal)
                        : [...goals, goal];
                      field.onChange(newGoals);
                    }}
                    className={`
                      cursor-pointer px-4 py-2 rounded-full transition-all text-sm border border-green-600
                      ${
                        goals.includes(goal)
                          ? "bg-green-600 text-white"
                          : "text-green-600"
                      }
                    `}
                  >
                    {goal}
                  </Box>
                ))}
              </Box>
              {error && (
                <Typography color="error" variant="caption">
                  {error.message}
                </Typography>
              )}
            </>
          )}
        />
      </Box>


<Box className="mb-4">
  <Typography className="!mb-2 font-medium">Target weight?</Typography>
  <Controller
    name="target_weight"
    control={control}
    rules={{
      validate: (value) =>
        value === "" ||
        value === null ||
        Number(value) >= 1 ||
        "Weight must be positive",
    }}
    render={({ field, fieldState: { error } }) => (
      <CustomTextField
        {...field}
        type="number"
        placeholder="Weight in kg"
        value={field.value ?? ""}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "" || Number(value) >= 0) {
            field.onChange(value);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "-" || e.key === "e") {
            e.preventDefault();
          }
        }}
        InputProps={{
          endAdornment: <Typography variant="body2">kg</Typography>,
        }}
        error={!!error}
        helperText={error?.message}
      />
    )}
  />
</Box>

    </Box>
  );
}
