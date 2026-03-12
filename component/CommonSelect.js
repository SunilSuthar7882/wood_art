"use client";
import React from "react";
import { useController } from "react-hook-form";
import Select from "react-select";

export default function CommonSelect({
  name,
  label,
  control,
  options,
  placeholder = "Select...",
  isRequired,
  onChange: externalOnChange,
  defaultValue,
  disabled = false,
}) {
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: isRequired && "This field is required" },
    defaultValue: defaultValue || null, // keep null for controlled Select
  });

  const handleChange = (selectedOption) => {
    onChange(selectedOption);
    if (externalOnChange) externalOnChange(selectedOption);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "white", // always white
      borderColor: state.isFocused ? "#16a34a" : "d3d3d3",
      boxShadow: state.isFocused ? "0 0 0 1px #16a34a" : "none",
      height: "41px !important",
      "&:hover": {
        borderColor: "#16a34a",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: "white", // keep white on hover
      color: "black",
      cursor: "pointer",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "white", // menu background white
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "black",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
  };

  return (
    <div>
      {label && <label className="input-label">{label}</label>}

      <Select
        instanceId={name}
        classNamePrefix="select"
        options={options}
        value={options?.find((option) => option.value === value?.value) || null}
        onChange={handleChange}
        placeholder={placeholder}
        ref={ref}
        isDisabled={disabled}
        styles={customStyles}
      />
      {error && <p className="errorMessage">{error.message}</p>}
    </div>
  );
}

