"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import {
  useCustomMealPlanRequest,
  useFetchCustomerMealPlanDetails,
} from "@/helpers/hooks/stripeflowapi/customer/customerPlans";
import MealPlanDetails from "@/component/CommonComponents/MealPlanDetails";
import Step1 from "../steps/Step1";
import Step2 from "../steps/Step2";
import Step3 from "../steps/Step3";
import Step4 from "../steps/Step4";
import Step5 from "../steps/Step5";
import Step6 from "../steps/Step6";
import CommonLoader from "@/component/CommonLoader";
import { useGetProfile } from "@/helpers/hooks/profilesection/getprofile";

const steps = [
  "Your Goals",
  "Personal Info",
  "Food Preferences",
  "Lifestyle & Schedule",
  "Additional Notes",
  "Subscription",
];

const SubscriptionFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({});
  const {
    data: profileData,
    isFetching: isProfileFetching,
    refetch: refetchProfile,
  } = useGetProfile();
  const [skipPayment, setSkipPayment] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      goals: [],
      target_weight: "",
      age: "",
      height: "",
      weight: "",
      activity_level: "Moderate",
      preferred_cuisine: "",
      any_allergies: false,
      allergies: [],
      diet_type: "",
      liked_foods: [],
      avoided_foods: [],
      wake_up_time: "",
      sleep_time: "",
      meal_timing_preferences: "",
      number_of_meals_preferred: "",
      notes: "",
      price_id: "",
      paymentComplete: false,
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
    trigger,
  } = methods;

  const {
    mutate: submitNutritionPlan,
    isPending: isSubmitting,
    error: submitError,
  } = useCustomMealPlanRequest();

  const { data: mealPlanDetails, isFetching: isMealPlanDetailsFetching } =
    useFetchCustomerMealPlanDetails();

  const onSubmit = (payload) => {
    const { paymentComplete, ...rest } = payload;
    submitNutritionPlan(rest, {
      onSuccess: (data) => {
        setClientSecret(data?.client_secret);
        setSubmitSuccess(true);
      },
      onError: (error) => {
        console.error("Form submission error:", error);
      },
    });
  };

  const handleNext = async () => {
    const isStepValid = await trigger();

    if (!isStepValid) return;

    if (activeStep === 4) {
      const profile = await refetchProfile();
      const trainerId = profile?.data?.data?.trainer_id;

      if (trainerId) {
        setSkipPayment(true);
        const payload = methods.getValues();
        const { paymentComplete, ...rest } = payload;

        submitNutritionPlan(rest, {
          onSuccess: (data) => {
            setSubmitSuccess(true);
          },
          onError: (error) => {
            console.error("Form submission error:", error);
          },
        });
      } else {
        setSkipPayment(false);
        setActiveStep((prev) => prev + 1);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const getStepContent = (step) => {
    if (skipPayment && step === 5) return null;

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

  return (
    <Box className="flex flex-col overflow-auto w-full h-full" p={2}>
      {isMealPlanDetailsFetching ? (
        <CommonLoader />
      ) : Object.entries(mealPlanDetails?.data || {}).length ? (
        <Box
          flex={1}
          overflow={"auto"}
          bgcolor={"white"}
          borderRadius={"13px"}
          p={2}
        >
          <MealPlanDetails data={mealPlanDetails.data} />
        </Box>
      ) : (
        <Box className="max-w-7xl mx-auto">
          <Paper elevation={3} className="p-3">
            <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
              {steps.map((label, index) => {
                if (skipPayment && index === 5) return null;
                return (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {getStepContent(activeStep)}

                <Box className="mt-8 flex justify-between">
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                  >
                    Back
                  </Button>
                  <Box>
                    {activeStep === steps.length - 1 && !skipPayment ? (
                      !clientSecret && (
                        <Button
                          type="submit"
                          variant="contained"
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
                        onClick={handleNext}
                        variant="contained"
                        color="primary"
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

export default SubscriptionFlow;
