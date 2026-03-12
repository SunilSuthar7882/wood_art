// import { Autocomplete, TextField } from "@mui/material";

// const CustomAutoComplete = ({
//   renderInputLabel = "Select...",
//   sx = {},
//   ...props
// }) => {
//   return (
//     <Autocomplete
//       size="small"
//       sx={{mb:1}}
//       {...props}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           placeholder={renderInputLabel}
//           sx={{
//             // mb: 1,
//             "& .MuiAutoComplete-root":{
//                 minHeight: "42px",
//             },
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "6px",
//               backgroundColor: "#fff",
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
//               minHeight: "42px",
//               fontSize: "0.875rem",
//               display: "flex",
//               alignItems: "center",
//               padding: "0 10px",
//             },
//             "& input": {
//               padding: "6px",
//             },
//             "& .MuiChip-root": {
//               height: "28px",
//               fontSize: "0.75rem",
//             },
//             ...sx,
//           }}
//         />
//       )}
//     />
//   );
// };

// export default CustomAutoComplete;

// import { Autocomplete, TextField } from "@mui/material";

// const CustomAutoComplete = ({
//   renderInputLabel = "Select Category",
//   sx = {},
//   ...props
// }) => {
//   return (
//     <Autocomplete
//       size="small"
//       sx={{ mb: 1 }}
//       {...props}
//       renderInput={(params) => (
//         <TextField
//           {...params}

//           placeholder={renderInputLabel}
//           sx={{
//             "& .MuiAutocomplete-root": {
//               minHeight: "42px",
//             },
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "6px",
//               backgroundColor: "#fff",
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
//               minHeight: "42px",
//               fontSize: "0.875rem",
//               display: "flex",
//               alignItems: "center",
//               padding: "0 10px",
//             },
//             // ✅ This is the one that actually affects the input
//             "& .MuiInputBase-input": {
//               padding: "0 !important",
//             },
//             "& input": {
//               padding: "0 !important", // optional redundancy
//             },
//             "& .MuiChip-root": {
//               height: "28px",
//               fontSize: "0.75rem",
//             },
//             ...sx,
//           }}
//         />
//       )}
//     />
//   );
// };

// export default CustomAutoComplete;

// import { Autocomplete, TextField } from "@mui/material";

// const CustomAutoComplete = ({
//   renderInputLabel = "Select Category",
//   sx = {},
//   ...props
// }) => {
//   return (
//     <Autocomplete
//       size="small"
//       sx={{ mb: 1 }}
//       {...props}

//       renderInput={(params) => (
//         <TextField
//           {...params}
//           placeholder={renderInputLabel}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "8px", // rounded-lg
//               backgroundColor: "transparent", // bg-transparent
//               border: "1px solid #d3d3d3", // border
//               color: "#4a5568", // text-gray-700
//               padding: "0", // remove internal padding
//               "& fieldset": {
//                 border: "none", // remove default MUI border
//               },
//               "&:hover": {
//                 borderColor: "#16a34a", // hover:border-green-600
//               },
//               "&.Mui-focused": {
//                 outline: "none", // focus:outline-none
//                 boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)", // focus:shadow-outline
//                 borderColor: "#16a34a",
//               },
//             },
//             "& .MuiInputBase-root": {
//               minHeight: "42px",
//               fontSize: "0.875rem",
//               padding: "0 12px", // px-3
//               display: "flex",
//               alignItems: "center",
//             },
//             "& .MuiInputBase-input": {
//               paddingTop: "12px", // py-3
//               paddingBottom: "12px",
//               paddingLeft: 0,
//               paddingRight: 0,
//             },
//             "& .MuiChip-root": {
//               height: "28px",
//               fontSize: "0.75rem",
//             },
//             ...sx,
//           }}
//         />
//       )}
//     />
//   );
// };

// export default CustomAutoComplete;

// import { Autocomplete, TextField } from "@mui/material";

// const CustomAutoComplete = ({
//   renderInputLabel = "Select Category",
//   sx = {},
//   ...props
// }) => {
//   return (
//     <Autocomplete
//       size="small"
//       sx={{ width: "100%", mb: 1 }}
//       {...props}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           placeholder={renderInputLabel}
//           sx={{
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "8px",
//               backgroundColor: props.selectedTemplate ? "#f0fdf4" : "transparent",
//               border: "1px solid #d3d3d3",
//               color: "#4a5568",
//               fontSize: "0.875rem",
//               boxShadow: "none",
//               "& fieldset": {
//                 display: "none",
//               },
//               "&:hover": {
//                 borderColor: "#16a34a",
//               },
//               "&.Mui-focused": {
//                 outline: "none",
//                 boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
//                 borderColor: "#16a34a",
//               },
//             },
//             "& .MuiInputBase-root": {
//               py: 1.5,
//               px: 1.5,
//               display: "flex",
//               alignItems: "center",
//             },
//             "& .MuiInputBase-input": {
//               paddingTop: "12px",
//               paddingBottom: "12px",
//               paddingLeft: 0,
//               paddingRight: 0,
//             },
//             "& .MuiChip-root": {
//               height: "28px",
//               fontSize: "0.75rem",
//             },
//             ...sx,
//           }}
//         />
//       )}
//     />
//   );
// };

// export default CustomAutoComplete;

import { Autocomplete, TextField } from "@mui/material";

const CustomAutoComplete = ({
  renderInputLabel = "Select Category",
  selectedTemplate = null,
  sx = {},
  disablePortal = false,

  value,
  onChange,
  ...props
}) => {
  return (
    <Autocomplete
      {...props}
      value={value} // ✅ must be here
      onChange={onChange}
      size="small"
      disablePortal={disablePortal} // 👈 explicit
      sx={{ width: "100%", mb: 1, ...sx }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={renderInputLabel}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: selectedTemplate ? "#f0fdf4" : "transparent",
              border: "1px solid #d3d3d3",
              color: "#4a5568",
              fontSize: "0.875rem",
              boxShadow: "none",
              paddingRight: "40px !important",
              minHeight: 41, // reduces padding from default ~65px
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
            },
            "& .MuiInputBase-root": {
              py: 1.5,
              px: 1.5,
              display: "flex",
              alignItems: "center",
            },
            "& .MuiInputBase-input": {
              padding: 0,
              margin: 0,
              fontSize: "0.875rem",
              lineHeight: "1.5rem",
            },
            "& .MuiChip-root": {
              height: "28px",
              fontSize: "0.75rem",
            },
            ...sx,
          }}
        />
      )}
    />
  );
};

export default CustomAutoComplete;
