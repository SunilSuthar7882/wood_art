import CustomTextField from "@/component/CommonComponents/CustomTextField";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

export default function Step4() {
  const { control } = useFormContext();

  // Format time to HH:MM:SS using dayjs
  const formatTimeWithDayjs = (timeString) => {
    if (!timeString) return "";
    // Parse the time input (HH:MM) and format it to HH:MM:SS
    return dayjs(`2000-01-01T${timeString}`).format("HH:mm:ss");
  };

  // Extract HH:MM from HH:MM:SS for display
  const extractTimeForDisplay = (timeWithSeconds) => {
    if (!timeWithSeconds) return "";
    return timeWithSeconds.split(":").slice(0, 2).join(":");
  };

  return (
    <Box>
      <Box className="mb-4">
        <Typography className="!mb-2 font-medium">
          Typical wake-up time
        </Typography>
        <Controller
          name="wake_up_time"
          control={control}
          rules={{ required: "Wake-up time is required" }}
          render={({
            field: { onChange, value, ...rest },
            fieldState: { error },
          }) => (
            <>
              <CustomTextField
                {...rest}
                value={extractTimeForDisplay(value)}
                onChange={(e) => {
                  const formattedTime = formatTimeWithDayjs(e.target.value);
                  onChange(formattedTime);
                }}
                type="time"
                variant="outlined"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            </>
          )}
        />
      </Box>

      <Box className="mb-4">
        <Typography className="!mb-2 font-medium">
          Typical sleep time
        </Typography>
        <Controller
          name="sleep_time"
          control={control}
          rules={{ required: "Sleep time is required" }}
          render={({
            field: { onChange, value, ...rest },
            fieldState: { error },
          }) => (
            <>
              <CustomTextField
                {...rest}
                value={extractTimeForDisplay(value)}
                onChange={(e) => {
                  const formattedTime = formatTimeWithDayjs(e.target.value);
                  onChange(formattedTime);
                }}
                type="time"
                variant="outlined"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            </>
          )}
        />
      </Box>

      <Box className="mb-4">
        <Typography className="!mb-2 font-medium">
          Meal timing preferences
        </Typography>
        <Controller
          name="meal_timing_preferences"
          control={control}
          render={({ field }) => (
            <FormControl component="fieldset">
              <RadioGroup {...field} row>
                <FormControlLabel
                  value="Early"
                  control={<Radio />}
                  label="Early meals"
                />
                <FormControlLabel
                  value="Regular"
                  control={<Radio />}
                  label="Regular timing"
                />
                <FormControlLabel
                  value="Late"
                  control={<Radio />}
                  label="Later meals"
                />
                <FormControlLabel
                  value="Flexible"
                  control={<Radio />}
                  label="Flexible"
                />
              </RadioGroup>
            </FormControl>
          )}
        />
      </Box>

      <Box className="mb-6">
        <Typography className="!mb-2 font-medium">
          Number of meals/snacks preferred
        </Typography>
        <Controller
          name="number_of_meals_preferred"
          control={control}
          rules={{
            required: "Please enter a number of meals", // make it required
            min: { value: 2, message: "Must be at least 2 meals" }, // enforce ≥2
            max: { value: 8, message: "Cannot exceed 8 meals" }, // enforce ≤8
          }}
          render={({ field, fieldState: { error } }) => (
            <CustomTextField
              {...field}
              type="number"
              variant="outlined"
              fullWidth
              placeholder="Number of meals/snacks"
              value={field.value ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                // allow empty so 'required' can later fire
                if (val === "" || (Number(val) >= 2 && Number(val) <= 8)) {
                  field.onChange(val);
                }
              }}
              onKeyDown={(e) => {
                // block non-digits, minus and exponent
                if (e.key === "-" || e.key === "e") e.preventDefault();
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
