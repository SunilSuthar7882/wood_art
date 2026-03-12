// import { TextField } from "@mui/material";

// const CustomTextField = ({ sx = {}, ...props }) => {
//   return (
//     <TextField
//       fullWidth
//       size="small"
//       {...props}
//       sx={{
//         mb: 1,
//         "& .MuiOutlinedInput-root": {
//           borderRadius: "6px",
//           backgroundColor: "#fff",
//           "& fieldset": {
//             borderColor: "#d3d3d3",
//           },
//           "&:hover fieldset": {
//             borderColor: "#d3d3d3",
//           },
//           "&.Mui-focused fieldset": {
//             borderColor: "#d3d3d3",
//           },
//         },
//         "& .MuiInputBase-root": {
//           minHeight: "42px",
//         //   padding: "0 10px",
//           fontSize: "0.875rem",
//         },
//         "& input": {
//           padding: "6px",
//         },
//         ...sx, // allow overrides if needed
//       }}
//     />
//   );
// };

// export default CustomTextField;




// import { TextField , InputAdornment, IconButton} from "@mui/material";

// const CustomTextField = ({ sx = {}, InputProps = {}, ...props }) => {
//   return (
//     <TextField
//       fullWidth
//       size="small"
//       {...props}
//       InputProps={{
//         ...InputProps,
//       }}
//       sx={{
//         mb: 1,
//         "& .MuiOutlinedInput-root": {
//           borderRadius: "8px", // rounded-lg
//           backgroundColor: "transparent", // bg-transparent
//           border: "1px solid #d3d3d3", // border
//           color: "#4a5568", // text-gray-700
//           padding: "0", // remove default padding
//           "& fieldset": {
//             border: "none", // remove MUI fieldset border
//           },
//           "&:hover": {
//             borderColor: "#16a34a", // hover:border-green-600
//           },
//           "&.Mui-focused": {
//             outline: "none", // focus:outline-none
//             boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)", // focus:shadow-outline
//             borderColor: "#16a34a",
//           },
//         },
//         "& .MuiInputBase-root": {
//           minHeight: "42px",
//           fontSize: "0.875rem",
//           padding: "0 12px", // px-3
//         },
//         "& input": {
//           paddingTop: "12px", // py-3
//           paddingBottom: "12px",
//           paddingLeft: 0,
//           paddingRight: 0,
//         },
//         ...sx, // allow overrides if needed
//       }}
//     />
//   );
// };

// export default CustomTextField;



import { TextField, InputAdornment, IconButton } from "@mui/material";

const CustomTextField = ({ sx = {}, InputProps = {}, ...props }) => {
  return (
    <TextField
      fullWidth
      size="small"
      {...props}
      InputProps={{
        ...InputProps,
      }}
      sx={{
        mb: 1,
        height:"40px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px", // rounded corners
          backgroundColor: "transparent",
          color: "#4a5568",
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
        "& .MuiInputBase-root": {
          minHeight: "42px",
          fontSize: "0.875rem",
        },
        "& input": {
          padding: "8px 10px",
        },
        ...sx,
      }}
    />
  );
};

export default CustomTextField;
