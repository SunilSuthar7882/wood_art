// component/CommonComponents/UnitConverter.jsx
import { convertUnit, formatValue, unitOptions } from "@/utils/unitConversion";
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function UnitConverter({ 
  type = "length", 
  initialValue = "", 
  initialFromUnit = "", 
  initialToUnit = "", 
  onConversionComplete = () => {},
  className = "",
  useMuiComponents = false
}) {
  const [value, setValue] = useState(initialValue);
  const [fromUnit, setFromUnit] = useState(initialFromUnit || (type === "length" ? "cm" : "kg"));
  const [toUnit, setToUnit] = useState(initialToUnit || (type === "length" ? "ft" : "lb"));
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  // Available units for the selected type
  const availableUnits = unitOptions[type] || [];

  // Perform conversion when inputs change
  useEffect(() => {
    if (value) {
      try {
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) {
          setError("Please enter a valid number");
          setResult("");
          return;
        }

        if (fromUnit && toUnit) {
          const convertedValue = convertUnit(numericValue, fromUnit, toUnit, type);
          
          // Use more decimal places for very small values
          const decimalPlaces = Math.abs(convertedValue) < 0.01 ? 6 : 2;
          setResult(formatValue(convertedValue, decimalPlaces));
          setError("");
          
          // Notify parent component of the conversion
          onConversionComplete({
            originalValue: numericValue,
            originalUnit: fromUnit,
            convertedValue,
            convertedUnit: toUnit
          });
        } else {
          // If units aren't selected yet, still clear any errors
          setError("");
        }
      } catch (err) {
        setError("Conversion error: " + err.message);
        setResult("");
      }
    } else {
      setResult("");
      setError("");
    }
  }, [value, fromUnit, toUnit, type, onConversionComplete]);

  // Handle input change
  const handleValueChange = (e) => {
    const inputValue = e.target.value;
    // Only accept positive values
    if (inputValue === '' || parseFloat(inputValue) >= 0) {
      setValue(inputValue);
    }
  };

  // Handle from unit change
  const handleFromUnitChange = (e) => {
    setFromUnit(e.target.value);
  };

  // Handle to unit change
  const handleToUnitChange = (e) => {
    setToUnit(e.target.value);
  };

  // Render with Material UI components
  if (useMuiComponents) {
    return (
      <Box className={className} sx={{ width: '100%' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
          {/* Value input */}
          <TextField
            label="Value"
            type="number"
            value={value}
            onChange={handleValueChange}
            placeholder="Enter value"
            fullWidth
            variant="outlined"
            size="small"
            inputProps={{ min: "0" }}
          />

          {/* From unit select */}
          <FormControl fullWidth size="small">
            <InputLabel>From</InputLabel>
            <Select
              value={fromUnit}
              onChange={handleFromUnitChange}
              label="From"
            >
              {availableUnits.map((unit) => (
                <MenuItem key={unit.value} value={unit.value}>
                  {unit.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* To unit select */}
          <FormControl fullWidth size="small">
            <InputLabel>To</InputLabel>
            <Select
              value={toUnit}
              onChange={handleToUnitChange}
              label="To"
            >
              {availableUnits.map((unit) => (
                <MenuItem key={unit.value} value={unit.value}>
                  {unit.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Result display - always show when value is entered, even if result is 0 */}
        {value && (
          <Paper 
            elevation={0} 
            sx={{ 
              mt: 2, 
              p: 1.5, 
              bgcolor: 'success.light', 
              color: 'success.dark',
              borderRadius: 1
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              {value} {fromUnit} = {result || '0.00'} {toUnit}
            </Typography>
          </Paper>
        )}

        {/* Error display */}
        {error && (
          <Paper 
            elevation={0} 
            sx={{ 
              mt: 2, 
              p: 1.5, 
              bgcolor: 'error.light', 
              color: 'error.main',
              borderRadius: 1
            }}
          >
            <Typography variant="body2">
              {error}
            </Typography>
          </Paper>
        )}
      </Box>
    );
  }

  // Render with Tailwind CSS
  return (
    <div className={`unit-converter ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Value input */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Value
          </label>
          <input
            type="number"
            value={value}
            onChange={handleValueChange}
            className="bg-white appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter value"
            min="0"
          />
        </div>

        {/* From unit select */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            From
          </label>
          <select
            value={fromUnit}
            onChange={handleFromUnitChange}
            className="bg-white appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {availableUnits.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>

        {/* To unit select */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            To
          </label>
          <select
            value={toUnit}
            onChange={handleToUnitChange}
            className="bg-white appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {availableUnits.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result display - always show when value is entered, even if result is 0 */}
      {value && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            {value} {fromUnit} = {result || '0.00'} {toUnit}
          </p>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}