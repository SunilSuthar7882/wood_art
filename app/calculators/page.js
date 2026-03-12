"use client";

import React, { useState } from "react";
import { Card } from "@mui/material";
import BMRCalculator from "@/component/Calculators/BmrCalculator/BmrCalculator";
import TDEECalculator from "@/component/Calculators/TDEECalculator";
import MacroCalculator from "@/component/Calculators/MacroCalculator/MacroCalculator";
import { useDateField } from "@mui/x-date-pickers/DateField/useDateField";

export default function CalculatorFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [calcResult, setCalcResult] = useState(null);
  const [calcBmrResult, setCalcBmrResult] = useState(null);
  const [calcTDEEResult, setCalcTDEEResult] = useState(null);
  const [calcMacroResult, setCalcMacroResult] = useState(null);
  const [calcTDEE, setCalcTdee] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  // ✅ Store both results and input values
  const [formData, setFormData] = useState({
    shared: {
      age: "",
      gender: "",
      weightKg: "",
      heightCm: "",
      heightFeet: "",
      heightInches: "",
      weightLbs: "",
      activityLevel: "",
      unitSystem: "",
      bmi: "",
    },
    bmr: { inputs: null, result: null },
    tdee: { inputs: null, result: null },
    macros: { inputs: null, result: null },
  });

  const extractShared = (inputs) => ({
    age: inputs.age || "",
    gender: inputs.gender || "",
    weightKg: inputs.weightKg || "",
    heightCm: inputs.heightCm || "",
    heightFeet: inputs.heightFeet || "",
    heightInches: inputs.heightInches || "",
    weightLbs: inputs.weightLbs || "",
    activityLevel: inputs.activityLevel || "",
    unitSystem: inputs.unitSystem || "",
    bmi: inputs.bmi || "",
  });

  // ✅ Handlers for completion (save both inputs + result)
  const handleBmrComplete = (inputs, result) => {
    setFormData((prev) => ({
      ...prev,
      shared: extractShared(inputs),
      bmr: { inputs, result },
    }));
  };

  const handleTdeeComplete = (inputs, result) => {
    setFormData((prev) => ({
      ...prev,
      shared: extractShared(inputs),
      tdee: { inputs, result },
    }));
  };

  const handleMacroComplete = (inputs, result) => {
    setFormData((prev) => ({
      ...prev,
      shared: extractShared(inputs),
      macros: { inputs, result },
    }));
  };

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b from-emerald-50 to-white p-2 ">
      <div className="flex flex-col  w-full ">
        {/* Step Indicator */}
        <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
          <p className="text-sm font-medium text-gray-600">
            Step {currentStep} of 3
          </p>
          <div className="flex-1 h-2 ml-4 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex flex-col flex-1 w-full h-full">
          <Card className="flex flex-1 flex-col p-2 shadow-md border border-gray-100 bg-white/90 backdrop-blur-sm ">
            {currentStep === 1 && (
              <BMRCalculator
                defaultValues={formData.bmr.inputs}
                calcResult={formData.bmr.result}
                calcBmrResult={calcBmrResult}
                setCalcBmrResult={setCalcBmrResult}
                sharedValues={formData.shared}
                onComplete={handleBmrComplete}
                step={currentStep}
                setStep={setCurrentStep}
              />
            )}

            {currentStep === 2 && (
              <TDEECalculator
                defaultValues={formData.tdee.inputs}
                calcResult={formData.tdee.result}
                setCalcTDEEResult={setCalcTDEEResult}
                sharedValues={formData.shared}
                bmr={formData.bmr.result}
                onComplete={handleTdeeComplete}
                step={currentStep}
                setStep={setCurrentStep}
                setSelectedActivity={setSelectedActivity}
              />
            )}

            {currentStep === 3 && (
              <MacroCalculator
              selectedActivity={selectedActivity}
                defaultValues={formData.macros.inputs}
                calcResult={formData.macros.result}
                calcBmrResult={calcBmrResult}
                calcTDEEResult={calcTDEEResult}
                sharedValues={formData.shared}
                tdee={formData.tdee.result}
                onComplete={handleMacroComplete}
                step={currentStep}
                setStep={setCurrentStep}
                setSelectedActivity={setSelectedActivity}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
