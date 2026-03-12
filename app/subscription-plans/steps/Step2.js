import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Typography,
  TextField,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import CustomTextField from "@/component/CommonComponents/CustomTextField";

export default function Step2() {
  const { control } = useFormContext();
  const activityLevels = ["Sedentary", "Light", "Moderate", "Active"];

  return (
    // <Box>
    //   <Box className="mb-4">
    //     <Typography className="!mb-2 font-medium">Age*</Typography>
    //     <Controller
    //       name="age"
    //       control={control}
    //       rules={{
    //         required: "Age is required",
    //         min: { value: 1, message: "Age must be positive" },
    //       }}
    //       render={({ field, fieldState: { error } }) => (
    //         <>
    //           <CustomTextField
    //             {...field}
    //             type="number"
    //             variant="outlined"
    //             fullWidth
    //             value={field.value ?? ""}
    //             onChange={(e) => {
    //               const value = e.target.value;
    //               if (value === "" || Number(value) >= 0) {
    //                 field.onChange(value);
    //               }
    //             }}
    //             onKeyDown={(e) => {
    //               if (e.key === "-" || e.key === "e") {
    //                 e.preventDefault();
    //               }
    //             }}
    //             error={!!error}
    //             helperText={error?.message}
    //           />
    //         </>
    //       )}
    //     />
    //   </Box>

    //   <Box className="mb-4">
    //     <Typography className="!mb-2 font-medium">Height* (cm)</Typography>
    //     <Controller
    //       name="height"
    //       control={control}
    //       rules={{
    //         required: "Height is required",
    //         min: { value: 1, message: "Height must be positive" },
    //       }}
    //       render={({ field, fieldState: { error } }) => (
    //         <>
    //           <CustomTextField
    //             {...field}
    //             type="number"
    //             variant="outlined"
    //             fullWidth
    //             value={field.value ?? ""}
    //             onChange={(e) => {
    //               const value = e.target.value;
    //               if (value === "" || Number(value) >= 0) {
    //                 field.onChange(value);
    //               }
    //             }}
    //             onKeyDown={(e) => {
    //               if (e.key === "-" || e.key === "e") {
    //                 e.preventDefault();
    //               }
    //             }}
    //             error={!!error}
    //             helperText={error?.message}
    //             InputProps={{
    //               endAdornment: <Typography variant="body2">cm</Typography>,
    //             }}
    //           />
    //         </>
    //       )}
    //     />
    //   </Box>

    //   <Box className="mb-4">
    //     <Typography className="!mb-2 font-medium">Weight* (kg)</Typography>
    //     <Controller
    //       name="weight"
    //       control={control}
    //       rules={{
    //         required: "Weight is required",
    //         min: { value: 1, message: "Weight must be positive" },
    //       }}
    //       render={({ field, fieldState: { error } }) => (
    //         <>
    //           <CustomTextField
    //             {...field}
    //             type="number"
    //             variant="outlined"
    //             fullWidth
    //             value={field.value ?? ""}
    //             onChange={(e) => {
    //               const value = e.target.value;
    //               // Allow only non-negative values
    //               if (value === "" || Number(value) >= 0) {
    //                 field.onChange(value);
    //               }
    //             }}
    //             onKeyDown={(e) => {
    //               if (e.key === "-" || e.key === "e") {
    //                 e.preventDefault(); // Prevent typing "-" or exponential notation
    //               }
    //             }}
    //             error={!!error}
    //             helperText={error?.message}
    //             InputProps={{
    //               endAdornment: <Typography variant="body2">kg</Typography>,
    //             }}
    //           />
    //         </>
    //       )}
    //     />
    //   </Box>

    //   <Box className="mb-4">
    //     <FormControl component="fieldset">
    //       <FormLabel component="legend" className="!mb-2 font-medium">
    //         Activity Level*
    //       </FormLabel>
    //       <Controller
    //         name="activity_level"
    //         control={control}
    //         rules={{ required: "Please select an activity level" }}
    //         render={({ field }) => (
    //           <RadioGroup {...field} row>
    //             {activityLevels.map((level) => (
    //               <FormControlLabel
    //                 key={level}
    //                 value={level}
    //                 control={<Radio />}
    //                 label={level}
    //                 className="mr-4"
    //               />
    //             ))}
    //           </RadioGroup>
    //         )}
    //       />
    //     </FormControl>
    //   </Box>
    // </Box>




    <Box>
  {/* Row 1: Age and Height */}
  <Box className="flex flex-col md:flex-row gap-4 mb-4">
    {/* Age */}
    <Box className="flex-1">
      <Typography className="!mb-2 font-medium">Age*</Typography>
      <Controller
        name="age"
        control={control}
        rules={{
          required: "Age is required",
          min: { value: 1, message: "Age must be positive" },
        }}
        render={({ field, fieldState: { error } }) => (
          <CustomTextField
            {...field}
            type="number"
            variant="outlined"
            fullWidth
            value={field.value ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) >= 0) {
                field.onChange(value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            }}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
    </Box>

    {/* Height */}
    <Box className="flex-1">
      <Typography className="!mb-2 font-medium">Height* (cm)</Typography>
      <Controller
        name="height"
        control={control}
        rules={{
          required: "Height is required",
          min: { value: 1, message: "Height must be positive" },
        }}
        render={({ field, fieldState: { error } }) => (
          <CustomTextField
            {...field}
            type="number"
            variant="outlined"
            fullWidth
            value={field.value ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) >= 0) {
                field.onChange(value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            }}
            error={!!error}
            helperText={error?.message}
            InputProps={{
              endAdornment: <Typography variant="body2">cm</Typography>,
            }}
          />
        )}
      />
    </Box>
  </Box>

  {/* Row 2: Weight and Activity Level */}
  <Box className="flex flex-col md:flex-row gap-4 mb-4">
    {/* Weight */}
    <Box className="flex-1">
      <Typography className="!mb-2 font-medium">Weight* (kg)</Typography>
      <Controller
        name="weight"
        control={control}
        rules={{
          required: "Weight is required",
          min: { value: 1, message: "Weight must be positive" },
        }}
        render={({ field, fieldState: { error } }) => (
          <CustomTextField
            {...field}
            type="number"
            variant="outlined"
            fullWidth
            value={field.value ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "" || Number(value) >= 0) {
                field.onChange(value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") e.preventDefault();
            }}
            error={!!error}
            helperText={error?.message}
            InputProps={{
              endAdornment: <Typography variant="body2">kg</Typography>,
            }}
          />
        )}
      />
    </Box>

    {/* Activity Level */}
    <Box className="flex-1">
      <FormControl component="fieldset" className="w-full">
        <FormLabel component="legend" className="!mb-2 font-medium">
          Activity Level*
        </FormLabel>
        <Controller
          name="activity_level"
          control={control}
          rules={{ required: "Please select an activity level" }}
          render={({ field }) => (
            <RadioGroup {...field} row>
              {activityLevels.map((level) => (
                <FormControlLabel
                  key={level}
                  value={level}
                  control={<Radio />}
                  label={level}
                  className="mr-4"
                />
              ))}
            </RadioGroup>
          )}
        />
      </FormControl>
    </Box>
  </Box>
</Box>

  );
}
