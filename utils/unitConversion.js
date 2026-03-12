// utils/unitConversion.js

// Unit options for length and weight
export const unitOptions = {
  length: [
    { label: 'Meters', value: 'm' },
    { label: 'Centimeters', value: 'cm' },
    { label: 'Kilometers', value: 'km' },
    { label: 'Feet', value: 'ft' },
    { label: 'Miles', value: 'mi' },
  ],
  weight: [
    { label: 'Grams', value: 'g' },
    { label: 'Kilograms', value: 'kg' },
    { label: 'Pounds', value: 'lb' },
    { label: 'Ounces', value: 'oz' },
  ],
};

// Conversion rates between different units
export const conversionRates = {
  weight: {
    g: { kg: 0.001, lb: 0.00220462, oz: 0.035274 },
    kg: { g: 1000, lb: 2.20462, oz: 35.274 },
    lb: { g: 453.592, kg: 0.453592, oz: 16 },
    oz: { g: 28.3495, kg: 0.0283495, lb: 0.0625 },
  },
  length: {
    cm: { m: 0.01, km: 0.00001, ft: 0.0328084, mi: 0.0000062137 },
    m: { cm: 100, km: 0.001, ft: 3.28084, mi: 0.000621371 },
    km: { cm: 100000, m: 1000, ft: 3280.84, mi: 0.621371 },
    ft: { cm: 30.48, m: 0.3048, km: 0.0003048, mi: 0.000189394 },
    mi: { cm: 160934, m: 1609.34, km: 1.60934, ft: 5280 },
  },
};

/**
 * Convert a value from one unit to another
 * @param {number} value - The value to convert
 * @param {string} fromUnit - The unit to convert from
 * @param {string} toUnit - The unit to convert to
 * @param {string} type - The type of conversion ('length' or 'weight')
 * @returns {number} - The converted value
 */
export const convertUnit = (value, fromUnit, toUnit, type) => {
  // If units are the same, return the original value
  if (fromUnit === toUnit) {
    return value;
  }

  // Check if the conversion is valid
  if (!conversionRates[type] || !conversionRates[type][fromUnit] || !conversionRates[type][fromUnit][toUnit]) {
    // Try to find an intermediate conversion
    if (conversionRates[type] && conversionRates[type][fromUnit]) {
      // Find a common unit to convert through
      const intermediateUnits = Object.keys(conversionRates[type][fromUnit]);
      for (const intermediateUnit of intermediateUnits) {
        if (conversionRates[type][intermediateUnit] && conversionRates[type][intermediateUnit][toUnit]) {
          // Convert from source to intermediate, then from intermediate to target
          const intermediateValue = value * conversionRates[type][fromUnit][intermediateUnit];
          return intermediateValue * conversionRates[type][intermediateUnit][toUnit];
        }
      }
    }
    
    // If no conversion path is found, return the original value and log an error
    console.error(`No conversion found from ${fromUnit} to ${toUnit} for ${type}`);
    return value;
  }

  // Perform the direct conversion
  return value * conversionRates[type][fromUnit][toUnit];
};

/**
 * Format a number to a specified number of decimal places
 * @param {number} value - The value to format
 * @param {number} decimals - The number of decimal places
 * @returns {string} - The formatted value as a string to preserve leading zeros
 */
export const formatValue = (value, decimals = 2) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return value;
  }
  
  // For very small values (close to zero but not zero)
  if (Math.abs(value) > 0 && Math.abs(value) < 0.001) {
    // For extremely small values, use scientific notation
    if (Math.abs(value) < 0.000001) {
      return value.toExponential(decimals);
    }
    // For moderately small values, show more decimal places
    return value.toFixed(6);
  }
  
  // For small values between 0.001 and 0.1, show 4 decimal places
  if (Math.abs(value) >= 0.001 && Math.abs(value) < 0.1) {
    return value.toFixed(4);
  }
  
  // For normal values, use fixed decimal places
  // Return as string to preserve trailing zeros
  return value.toFixed(decimals);
};