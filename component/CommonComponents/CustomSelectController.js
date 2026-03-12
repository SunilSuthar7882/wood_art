// "use client"
// import { Controller } from "react-hook-form";
// import { MenuItem, Select } from "@mui/material";

// const CustomSelectController = ({
//   name,
//   control,
//   disabled = false,
//   value,
//   onChange,
//   renderValueLabel = "Select...",
//   options = [],
//   size = "small",
//   selectedTemplate = null,
//   sx = {},
//   rules = {},
// }) => {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={rules}
//       render={({ field }) => (
//         <Select
//           {...field}
//           displayEmpty
//           disabled={disabled}
//           size={size}
//           value={
//             selectedTemplate ? selectedTemplate.number_of_days : field.value
//           }
//           onChange={(e) => {
//             field.onChange(e);
//             onChange?.(e.target.value);
//           }}
//           renderValue={(selected) =>
//             !selected ? (
//               <span className="text-gray-400">{renderValueLabel}</span>
//             ) : name === "number_of_days" ? (
//               `${selected} Days` // 👈 only for number_of_days field
//             ) : name === "meals_per_day" ? (
//               `${selected} Meals`
//             ) : name === "snacks_per_day" ? (
//               `${selected} Snacks`
//             ) : (
//               `${selected}`
//             )
//           }
//           sx={{
//             width: "100%",
//             mb: 1,
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "6px",
//               backgroundColor: selectedTemplate ? "#f0fdf4" : "#fff",
//               "& fieldset": {
//                 borderColor: "#d3d3d3",
//               },
//               "&:hover fieldset": {
//                 borderColor: "#d3d3d3",
//               },
//               "&.Mui-focused fieldset": {
//                 borderColor: "#d3d3d3",
//               },
//             },
//             "& .MuiInputBase-root": {
//               padding: "0 10px",
//               fontSize: "0.875rem",
//             },
//             "& .MuiSelect-select": {
//               minHeight: "28px",
//               padding: "8px 10px",
//               display: "flex",
//               alignItems: "center",
//             },
//             ...sx,
//           }}
//         >
//           <MenuItem value="">{renderValueLabel}</MenuItem>
//           {options.map((option) => (
//             <MenuItem key={option.value} value={option.value}>
//               {option.label}
//             </MenuItem>
//           ))}
//         </Select>
//       )}
//     />
//   );
// };

// export default CustomSelectController;

// "use client";
// import { Controller } from "react-hook-form";
// import { MenuItem, Select } from "@mui/material";

// const CustomSelectController = ({
//   name,
//   control,
//   disabled = false,
//   value,
//   onChange,
//   renderValueLabel = "Select...",
//   options = [],
//   size = "small",
//   selectedTemplate = null,
//   sx = {},
//   rules = {},
// }) => {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={rules}
//       render={({ field }) => (
//         <Select
//           {...field}
//           displayEmpty
//           disabled={disabled}
//           size={size}
//           value={
//             selectedTemplate ? selectedTemplate.number_of_days : field.value
//           }
//           onChange={(e) => {
//             field.onChange(e);
//             onChange?.(e.target.value);
//           }}
//           renderValue={(selected) =>
//             !selected ? (
//               <span className="text-gray-400">{renderValueLabel}</span>
//             ) : name === "number_of_days" ? (
//               `${selected} Days`
//             ) : name === "meals_per_day" ? (
//               `${selected} Meals`
//             ) : name === "snacks_per_day" ? (
//               `${selected} Snacks`
//             ) : (
//               `${selected}`
//             )
//           }
//           sx={{
//             width: "100%",
//             mb: 1,
//             borderRadius: "8px", // rounded-lg
//             backgroundColor: selectedTemplate ? "#f0fdf4" : "transparent", // dynamic or transparent
//             border: "1px solid #d3d3d3", // border
//             color: "#4a5568", // text-gray-700
//             fontSize: "0.875rem",
//             boxShadow: "none",
//             "& fieldset": {
//               display: "none", // remove MUI fieldset border
//             },
//             "&:hover": {
//               borderColor: "#16a34a", // hover:border-green-600
//             },
//             "&.Mui-focused": {
//               outline: "none", // focus:outline-none
//               boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)", // focus:shadow-outline
//               borderColor: "#16a34a",
//             },
//             "& .MuiSelect-select": {
//               py: 1.5, // py-3 (12px)
//               px: 1.5, // px-3 (12px)
//               display: "flex",
//               alignItems: "center",
//             },
//             ...sx,
//           }}
//         >
//           <MenuItem value="">{renderValueLabel}</MenuItem>
//           {options.map((option) => (
//             <MenuItem key={option.value} value={option.value}>
//               {option.label}
//             </MenuItem>
//           ))}
//         </Select>
//       )}
//     />
//   );
// };

// export default CustomSelectController;

// "use client";
// import { Controller } from "react-hook-form";
// import { MenuItem, Select } from "@mui/material";

// const CustomSelectController = ({
//   name,
//   control,
//   disabled = false,
//   value,
//   onChange,
//   renderValueLabel = "Select...",
//   options = [],
//   size = "small",
//   selectedTemplate = null,
//   sx = {},
//   rules = {},
// }) => {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       rules={rules}
//       render={({ field }) => (
//         <Select
//           {...field}
//           displayEmpty
//           disabled={disabled}
//           size={size}
//           value={
//             selectedTemplate ? selectedTemplate.number_of_days : field.value
//           }
//           onChange={(e) => {
//             field.onChange(e);
//             onChange?.(e.target.value);
//           }}
//           renderValue={(selected) =>
//             !selected ? (
//               <span className="text-gray-400">{renderValueLabel}</span>
//             ) : name === "number_of_days" ? (
//               `${selected} Days`
//             ) : name === "meals_per_day" ? (
//               `${selected} Meals`
//             ) : name === "snacks_per_day" ? (
//               `${selected} Snacks`
//             ) : (
//               `${selected}`
//             )
//           }
//           sx={{
//             width: "100%",
//             mb: 1,
//             borderRadius: "8px",
//             backgroundColor: selectedTemplate ? "#f0fdf4" : "transparent",
//             border: "1px solid #d3d3d3",
//             color: "#4a5568",
//             fontSize: "0.875rem",
//             boxShadow: "none",
//             "& fieldset": {
//               display: "none",
//             },
//             "&:hover": {
//               borderColor: "#16a34a",
//             },
//             "&.Mui-focused": {
//               outline: "none",
//               boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
//               borderColor: "#16a34a",
//             },
//             "& .MuiSelect-select": {
//               py: 1.5,
//               px: 1.5,
//               display: "flex",
//               alignItems: "center",
//             },
//             ...sx,
//           }}
//         >
//           <MenuItem value="">{renderValueLabel}</MenuItem>
//           {options.map((option, idx) => (
//             <MenuItem key={`${option.value}-${idx}`} value={option.value}>
//               {option.label}
//             </MenuItem>
//           ))}
//         </Select>
//       )}
//     />
//   );
// };

// export default CustomSelectController;

"use client";
import { Controller } from "react-hook-form";
import {
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  Typography,
  Box,
} from "@mui/material";

const CustomSelectController = ({
  name,
  control,
  disabled = false,
  value,
  onChange,
  renderValueLabel = "Select...",
  options = [],
  size = "small",
  selectedTemplate = null,
  sx = {},
  rules = {},
  error, // pass error object if needed
  showDescriptions = false, // toggle between simple or advanced option rendering
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <FormControl fullWidth error={!!error}>
          <Select
            {...field}
            displayEmpty
            disabled={disabled}
            size={size}
            value={
              selectedTemplate ? selectedTemplate.number_of_days : field.value
            }
            onChange={(e) => {
              field.onChange(e);
              onChange?.(e.target.value);
            }}
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <span className="text-gray-400">{renderValueLabel}</span>
                );
              }

              if (name === "number_of_days") {
                return `${selected} Days`;
              }
              if (name === "meals_per_day") {
                return `${selected} Meals`;
              }
              if (name === "snacks_per_day") {
                return `${selected} Snacks`;
              }

              // default → show label instead of raw value
              const option = options.find((opt) => opt.value === selected);
              return option ? option.label : selected;
            }}
            sx={{
              width: "100%",
              mb: 1,
              height:"42px",
              borderRadius: "8px",
              backgroundColor: selectedTemplate ? "#f0fdf4" : "transparent",
              border: "1px solid #d3d3d3",
              color: "#4a5568",
              fontSize: "0.875rem",
              boxShadow: "none",
              "& fieldset": {
                display: "none",
              },
              "&:hover": {
                borderColor: "#16a34a",
              },
              "&.Mui-focused": {
                outline: "none",
                boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
                borderColor: "#16a34a",
              },
              "& .MuiSelect-select": {
                py: 1.5,
                px: 1.5,
                display: "flex",
                alignItems: "center",
              },
              ...sx,
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  "& .MuiMenuItem-root": {
                    minHeight: "auto",
                    py: 1,
                  },
                  "& .MuiTypography-body1": {
                    fontSize: 14,
                  },
                  "& .MuiTypography-caption": {
                    fontSize: 12,
                  },
                },
              },
            }}
          >
            <MenuItem value="">{renderValueLabel}</MenuItem>
            {options.map((option, idx) => (
              <MenuItem key={`${option.value}-${idx}`} value={option.value} disabled={option.disabled}>
                {showDescriptions ? (
                  <Box>
                    <Typography variant="body1">{option.label}</Typography>
                    {option.description && (
                      <Typography variant="caption" color="text.secondary">
                        {option.description}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  option.label
                )}
              </MenuItem>
            ))}
          </Select>

          {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default CustomSelectController;
