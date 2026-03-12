import { height } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Controller } from "react-hook-form";

export default function CommonDatePicker({
  name,
  control,
  errors,
  value,
  format,
  disabled = false,
  slotProps = {},
  maxDate,
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: "Date is required",
      }}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            {...field}
            id="selectDateId"
            value={value || null}
            slotProps={{
              textField: {
                placeholder: "MM-DD-YYYY",
                error: !!errors.bookingDate,
                ...slotProps.textField,
              },
            }}
            format={format || "MM-DD-YYYY"}
            maxDate={maxDate}
            disabled={disabled}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
                height: "40px",
                // "& fieldset": {
                //   // borderColor: "#e4e4e4",
                //   borderColor: "#d3d3d3",
                //   borderWidth: "1px", // Default border
                // },
                // "&:hover fieldset": {
                //   borderColor: "#16a34a",
                //   borderWidth: "1px", // Tailwind green-600
                // },
                // "&.Mui-focused fieldset": {
                //   borderColor: "#16a34a",
                //   borderWidth: "1px", // Same as hover, no shadow
                // },
                // "&.Mui-disabled fieldset": {
                //   borderColor: "#e5e7eb", // override disabled to match normal
                // },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#c8cacf",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#16a34a !important",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#16a34a !important",
              },
              "& .Mui-disabled": { borderColor: "#e5e7eb" },
              "& .Mui-error": {
                fontSize: "1rem",
                marginLeft: "3px",
              },
            }}

            // sx={{
            //   width: "100%",
            //   "& .MuiOutlinedInput-root": {
            //     borderRadius: "8px",
            //     backgroundColor: "transparent",
            //     color: "#4a5568",
            //     "& .MuiOutlinedInput-notchedOutline": {
            //       borderColor: "#d3d3d3", // default border
            //     },
            //     "&:hover .MuiOutlinedInput-notchedOutline": {
            //       borderColor: "#16a34a !important", // ✅ green on hover
            //     },
            //     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            //       borderColor: "#16a34a !important", // ✅ green on focus
            //       boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)", // ✅ soft glow
            //     },
            //     "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            //       borderColor: "#e5e7eb !important", // ✅ gray when disabled
            //     },
            //   },
            //   "& .MuiInputBase-root": {
            //     minHeight: "40px",
            //     fontSize: "0.875rem",
            //   },
            //   "& .MuiInputBase-input": {
            //     padding: "8px 10px",
            //   },
            //   "& .Mui-error": {
            //     fontSize: "0.875rem",
            //     marginLeft: "3px",
            //   },
            // }}
          />
        </LocalizationProvider>
      )}
    />
  );
}

export function BirthDatePicker({
  name,
  control,
  errors,
  value,
  disabled = false,
}) {
  const today = dayjs();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: "Birth date is required",
      }}
      sx={{ height: "40px" }}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            {...field}
            id="birthDateId"
            value={value || null}
            // Setting maxDate to today to prevent future dates
            maxDate={today}
            slotProps={{
              textField: {
                placeholder: "MM/DD/YYYY",
                error: !!errors[name],
              },
            }}
            format="MM/DD/YYYY"
            disabled={disabled}
            sx={{
              height: "40px",
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                borderColor: "#e5e7eb",
                "& fieldset": {
                  borderColor: "#d3d3d3", // default border
                },
                "&:hover fieldset": {
                  borderColor: "#16a34a", // hover color
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#16a34a",
                  boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#e5e7eb",
              },
              "& .MuiInputBase-input": {
                padding: "12px",
                borderColor: "#e5e7eb",
              },
              "& .Mui-error": {
                fontSize: "1rem",
                marginLeft: "3px",
              },
            }}

            // sx={{
            //   width: "100%",
            //   "& .MuiOutlinedInput-root": {
            //     borderRadius: "8px",
            //     "& .MuiOutlinedInput-notchedOutline": {
            //       borderColor: "#d3d3d3", // default
            //     },
            //     "&:hover .MuiOutlinedInput-notchedOutline": {
            //       borderColor: "#16a34a !important", // ✅ green on hover
            //     },
            //     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            //       borderColor: "#16a34a !important", // ✅ green on focus
            //       boxShadow: "0 0 0 2px rgba(22, 163, 74, 0.25)", // soft glow
            //     },
            //     "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            //       borderColor: "#e5e7eb !important", // ✅ light gray when disabled
            //     },
            //   },
            //   "& .MuiInputBase-input": {
            //     padding: "12px",
            //   },
            //   "& .Mui-error": {
            //     fontSize: "0.875rem",
            //     marginLeft: "3px",
            //   },
            // }}
          />
        </LocalizationProvider>
      )}
    />
  );
}
