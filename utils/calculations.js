// utils/calculations.js
// BMR Calculation using Mifflin-St Jeor Formula
export const calculateBMR = (age, weight, height, gender) => {
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5.0 * age + 5;
  } else if (gender === "female") {
    bmr = 10 * weight + 6.25 * height - 5.0 * age - 161;
  }
  return bmr;
};

// BMI Calculation
export const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

// Waist-to-Hip Ratio
export const calculateWHR = (waist, hips) => {
  return waist / hips;
};

// Waist-to-Height Ratio
export const calculateWHTR = (waist, height) => {
  return waist / height;
};

// Body Fat Percentage Estimation (Navy Method with improvements)
export const estimateBodyFat = (gender, waist, hips, weight, height) => {
  const waistInCm = waist;
  const hipsInCm = hips;
  const heightInCm = height;

  let bodyFatPercentage;

  if (gender === "male") {
    // Navy Formula for men
    const factor1 = 0.19077 * Math.log10(waistInCm - 0.15456 * hipsInCm);
    const factor2 = 0.15456 * Math.log10(heightInCm);
    bodyFatPercentage = 495 / (1.0324 - factor1 + factor2) - 450;
  } else {
    // Navy Formula for women
    const factor1 = 0.35004 * Math.log10(waistInCm + hipsInCm);
    const factor2 = 0.221 * Math.log10(heightInCm);
    bodyFatPercentage = 495 / (1.29579 - factor1 + factor2) - 450;
  }

  // Ensure reasonable ranges (5% to 50%)
  bodyFatPercentage = Math.max(5, Math.min(bodyFatPercentage, 50));

  return bodyFatPercentage;
};

// Calculate all body metrics
export const calculateBodyMetrics = ({
  weight,
  height,
  waist,
  hips,
  gender,
}) => {
  const bmi = calculateBMI(weight, height);
  const whr = calculateWHR(waist, hips);
  const whtr = calculateWHTR(waist, height);
  const bodyFat = estimateBodyFat(gender, waist, hips, weight, height);

  return {
    bmi,
    whr,
    whtr,
    bodyFat,
  };
};

// BMI interpretation
export const interpretBMI = (bmi) => {
  if (bmi < 18.5) {
    return {
      category: "Underweight",
      color: "info",
      advice:
        "Consider gaining some weight through a balanced diet with a caloric surplus and strength training.",
    };
  } else if (bmi < 25) {
    return {
      category: "Normal weight",
      color: "success",
      advice:
        "Maintain your healthy weight with balanced nutrition and regular exercise.",
    };
  } else if (bmi < 30) {
    return {
      category: "Overweight",
      color: "warning",
      advice:
        "Consider a mild caloric deficit and increased activity to reach a healthier weight.",
    };
  } else {
    return {
      category: "Obese",
      color: "error",
      advice:
        "Work with a healthcare provider on a plan to reach a healthier weight through nutrition and exercise.",
    };
  }
};

// Get healthy ranges for body metrics
export const getHealthyRanges = (gender) => {
  return {
    bodyFat: {
      male: { min: 10, max: 20 },
      female: { min: 18, max: 28 },
    },
    whr: {
      male: { max: 0.9 },
      female: { max: 0.85 },
    },
    whtr: { max: 0.5 },
  };
};

// Generate comprehensive health advice
export const getBodyMetricsAdvice = (metrics, gender) => {
  const advice = [];
  const healthyRanges = getHealthyRanges(gender);

  // BMI advice
  const bmiInterpretation = interpretBMI(metrics.bmi);
  advice.push(bmiInterpretation.advice);

  // Body fat advice
  const healthyBodyFatRange = healthyRanges.bodyFat[gender];
  if (metrics.bodyFat < healthyBodyFatRange.min) {
    advice.push(
      `Your body fat percentage (${metrics.bodyFat.toFixed(
        1
      )}%) is below the healthy range. Consider adding more calories and focusing on strength training to build lean mass.`
    );
  } else if (metrics.bodyFat > healthyBodyFatRange.max) {
    advice.push(
      `Your body fat percentage (${metrics.bodyFat.toFixed(
        1
      )}%) is above the healthy range. Focus on a slight caloric deficit and regular exercise to reduce body fat while maintaining muscle.`
    );
  } else {
    advice.push(
      `Your body fat percentage (${metrics.bodyFat.toFixed(
        1
      )}%) is within a healthy range. Continue with your balanced diet and exercise routine.`
    );
  }

  // WHR advice
  const healthyWHR = healthyRanges.whr[gender].max;
  if (metrics.whr > healthyWHR) {
    advice.push(
      `Your waist-to-hip ratio (${metrics.whr.toFixed(
        2
      )}) is above the recommended value, which may indicate higher abdominal fat. Focus on core exercises and overall fat loss.`
    );
  } else {
    advice.push(
      `Your waist-to-hip ratio (${metrics.whr.toFixed(
        2
      )}) is within the healthy range.`
    );
  }

  // WHTR advice
  if (metrics.whtr > healthyRanges.whtr.max) {
    advice.push(
      `Your waist-to-height ratio (${metrics.whtr.toFixed(
        2
      )}) suggests you may be carrying excess abdominal fat. This can be addressed through cardio, strength training, and a balanced diet.`
    );
  } else {
    advice.push(
      `Your waist-to-height ratio (${metrics.whtr.toFixed(
        2
      )}) is within the healthy range.`
    );
  }

  return advice;
};

// Interpret all metrics at once
export const interpretMetrics = (metrics, gender) => {
  const bmiInterpretation = interpretBMI(metrics.bmi);
  const advice = getBodyMetricsAdvice(metrics, gender);

  return {
    bmiCategory: bmiInterpretation.category,
    bmiColor: bmiInterpretation.color,
    bmiAdvice: bmiInterpretation.advice,
    advice,
  };
};
