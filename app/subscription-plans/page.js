"use client";
import {
  useCustomMealPlanRequest,
  useFetchCustomerMealPlanDetails,
} from "@/helpers/hooks/stripeflowapi/customer/customerPlans";
import { Box, Button, Paper, Step, StepLabel, Stepper } from "@mui/material";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import MealPlanDetails from "@/component/CommonComponents/MealPlanDetails";

const steps = [
  "Your Goals",
  "Personal Info",
  "Food Preferences",
  "Lifestyle & Schedule",
  "Additional Notes",
  "Subscription",
];

const Subscription = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      goals: [], // required
      target_weight: "",
      age: "", // required
      height: "", // required
      weight: "", // required
      activity_level: "Moderate", // required
      preferred_cuisine: "",
      any_allergies: false, // required
      allergies: [],
      diet_type: "", // required
      liked_foods: [],
      avoided_foods: [],
      wake_up_time: "",
      sleep_time: "",
      meal_timing_preferences: "",
      number_of_meals_preferred: "",
      notes: "",
      price_id: "", // required
      paymentComplete: false,
    },
  });

  const {
    handleSubmit,
    formState: { isValid, errors },
    watch,
  } = methods;

  // Use React Query for form submission
  const {
    mutate: submitNutritionPlan,
    isPending: isSubmitting,
    error: submitError,
  } = useCustomMealPlanRequest();

  const { data: mealPlanDetails, isFetching: isMealPlanDetailsFetching } =
    useFetchCustomerMealPlanDetails();

  const onSubmit = (payload) => {
    const { paymentComplete, ...rest } = payload;

    // Submit form data using React Query
    submitNutritionPlan(rest, {
      onSuccess: (data) => {
        setClientSecret(data?.client_secret);
        setSubmitSuccess(true);
        // setActiveStep(steps.length);
      },
      onError: (error) => {
        console.error("Form submission error:", error);
      },
    });
  };

  const handleNext = async () => {
    // For the final step, we'll check if payment is complete before proceeding
    if (activeStep === steps.length - 1) {
      return;
    }

    // For other steps, validate and proceed normally
    const isStepValid = await methods.trigger();
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <Step1 />;
      case 1:
        return <Step2 />;
      case 2:
        return <Step3 />;
      case 3:
        return <Step4 />;
      case 4:
        return <Step5 />;
      case 5:
        return (
          <Step6
            clientSecret={clientSecret}
            submitError={submitError}
            selectedPlan={selectedPlan}
            setSelectedPlan={setSelectedPlan}
          />
        );
      default:
        return "Unknown step";
    }
  };

  const handleChangeTab = (_, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box className="flex w-full h-full" p={2}>
      {isMealPlanDetailsFetching ? (
        <Box>Loading...</Box>
      ) : Object.entries(mealPlanDetails?.data || {}).length ? (
        <Box
          flex={1}
          overflow={"auto"}
          bgcolor={"white"}
          borderRadius={"13px"}
          p={2}
        >
          <MealPlanDetails data={mealPlanDetails?.data} />
        </Box>
      ) : (
        <Box className="max-w-7xl mx-auto my-2 p-4">
          <Paper elevation={3} className="p-6">
            <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {getStepContent(activeStep)}

                <Box className="mt-8 flex justify-between">
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                    className="mr-2"
                  >
                    Back
                  </Button>
                  <Box>
                    {activeStep === steps.length - 1 ? (
                      !clientSecret && (
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={
                            !isValid ||
                            !selectedPlan?.product?.id ||
                            isSubmitting
                          }
                        >
                          {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                      )
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </Box>
              </form>
            </FormProvider>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Subscription;
