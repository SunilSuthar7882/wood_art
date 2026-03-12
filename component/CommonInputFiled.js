import { TextField } from "@mui/material";
import React from "react";

const CommonInputFiled = ({
  name,
  placeholder,
  onChange,
  type,
  onClick,
  onBlur,
  borderRadius = "10px",
  sx = {},
  value,
  error,
  helperText,
  ...props
}) => {
  return (
    <>
      <TextField
        fullWidth
        type={type}
        name={name}
        sx={{
          height: "40px",

          input: {
            px: "10px",
            py: "10px",
            color: "#000000",
            fontSize: "13px",
            fontWeight: 400,
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "5px",
            padding: 0,

            "& .MuiInputBase-input": {
              padding: "10.66px", // Adjust padding as needed
            },
            "& .MuiInputBase-input::placeholder": {
              fontSize: "13px",
              fontWeight: 400,
              fontFamily: "'Roboto', sans-serif",
            },
          },
          ...sx,
        }}
        onClick={onClick}
        onChange={onChange}
        placeholder={placeholder}
        onBlur={onBlur}
        value={value}
        error={error}
        helperText={helperText}
        {...props}
      />
    </>
  );
};

export default CommonInputFiled;
