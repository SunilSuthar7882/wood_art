"use client";
import {
  useFetchCustomerStripePlan,
  useVerifyCouponCode,
} from "@/helpers/hooks/stripeflowapi/customer/customerPlans";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import CouponSection from "./CouponSection";
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputLabel,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import CustomTextField from "@/component/CommonComponents/CustomTextField";

function SubscriptionPlans({ selectedPlan, setSelectedPlan, submitError }) {
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const {
    data: stripePlanData,
    isFetching,
    isLoading,
  } = useFetchCustomerStripePlan();
  const {
    mutate: verifyCouponCode,
    isPending: isVerifyCouponCodePending,
    error: verifyCouponCodeError,
  } = useVerifyCouponCode();

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const handleApplyCoupon = useCallback(() => {
    if (!couponCode.trim()) return;

    verifyCouponCode(
      {
        coupon_code: couponCode,
        user_type: "customer", // explicitly added here
      },
      {
        onSuccess: (data) => {
          setCouponApplied(true);
          setValue("coupon_code", couponCode, {
            shouldValidate: true,
          });
        },
      }
    );
  }, [couponCode, verifyCouponCode, setValue]);

  const handleCouponChange = useCallback(
    (e) => {
      setCouponCode(e.target.value);
      if (couponApplied) {
        setCouponApplied(false);
        // setCouponData(null);
      }
    },
    [couponApplied]
  );

  const handleRemoveCoupon = useCallback(() => {
    setCouponApplied(false);
    // setCouponData(null);
    setCouponCode("");
    setValue("coupon_code", "", { shouldValidate: true });
  }, [setValue]);

  const handlePlanSelection = useCallback(
    (plan) => {
      setSelectedPlan(plan);
      // Store the price_id in the form data
      setValue("price_id", plan.prices[0].id, { shouldValidate: true });
    },
    [setValue, setSelectedPlan]
  );

  return (
    <Box sx={{ backgroundColor: "#f0fdf4", p: 3, borderRadius: 2 }}>
      {isFetching ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Header Section */}
          <Box mb={4}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Get Your Customized Diet Plan
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Unlock a plan designed <em>just for you</em> — based on your body
              type, lifestyle, goals, and food preferences. No more guesswork,
              fad diets, or confusing nutrition advice. Our expert-backed meal
              plans are built to help you stay consistent, feel energized, and
              reach your health goals faster.
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Whether you’re looking to lose weight, gain muscle, manage a
              health condition, or simply eat better — we’ve got you covered.
              Each plan includes carefully crafted meals, balanced macros, and
              easy-to-follow recipes. Plus, you’ll receive a complete grocery
              list to make shopping hassle-free.
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              You’ll also gain access to weekly updates and the ability to
              request changes based on your progress or preferences. Let your
              food work <em>for</em> you — not against you.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Take the first step towards a healthier, more confident you —
              starting today.
            </Typography>
          </Box>

          {/* Subscription Section */}
          <Box className="space-y-6">
            <Box mb={2}>
              <Typography className="font-bold text-lg">
                Subscription Plan
              </Typography>
            </Box>

            <Box className="space-y-4">
              {stripePlanData?.data?.map((plan) => (
                <Box
                  key={plan?.product?.id}
                  className={`border-2 rounded-xl p-4 flex justify-between items-center cursor-pointer bg-white ${
                    selectedPlan?.product?.id === plan?.product?.id
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => handlePlanSelection(plan)}
                >
                  <Box>
                    <Typography fontWeight="bold" fontSize="1.125rem">
                      {plan?.product?.name}
                    </Typography>
                    <Typography fontSize="0.875rem" color="text.secondary">
                      {plan?.product?.description}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography
                      fontWeight="bold"
                      fontSize="1.25rem"
                      textTransform="uppercase"
                    >
                      ${(plan?.prices?.[0]?.unit_amount || 0) / 100}{" "}
                      {plan?.prices?.[0]?.currency}
                    </Typography>
                    <Typography
                      fontSize="0.875rem"
                      color="text.secondary"
                      textTransform="capitalize"
                    >
                      Per {plan?.prices?.[0]?.recurring?.interval || "month"}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Error Alert */}
            {submitError && (
              <Box mt={2}>
                <Alert severity="error">
                  {submitError?.response?.data?.message ||
                    (submitError instanceof Error && submitError.message) ||
                    "An error occurred during submission"}
                </Alert>
              </Box>
            )}

            <Box mt={1}>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom pl={1}>
                Billing Details
              </Typography>

              <Grid container spacing={2}>
                {[
                  { label: "Address Line 1", field: "line1", required: true },
                  { label: "Address Line 2", field: "line2", required: false },
                  { label: "City", field: "city", required: true },
                  { label: "State", field: "state", required: true },
                  { label: "Country", field: "country", required: true },
                  {
                    label: "Postal Code",
                    field: "postal_code",
                    required: true,
                  },
                ].map(({ label, field, required }) => (
                  <Grid item xs={12} sm={6} md={4} key={field}>
                    <InputLabel
                      sx={{ fontWeight: "bold", fontSize: 14, mb: 0.5 }}
                    >
                      {label}
                    </InputLabel>
                    <CustomTextField
                      fullWidth
                      size="small"
                      placeholder={`Enter your ${label.toLowerCase()}`}
                      {...register(`address.${field}`, {
                        required: required ? "This field is required" : false,
                        ...(field === "postal_code" && {
                          pattern: {
                            value: /^\d{5,}$/,
                            message: "Postal code must be at least 5 digits",
                          },
                        }),
                      })}
                      error={Boolean(errors.address?.[field])}
                      helperText={errors.address?.[field]?.message}
                     InputProps={{
  sx: {
    fontSize: 14,
    height: 36, // controls the outer height
    backgroundColor: "white",
    paddingY: 0, // optional: removes extra vertical padding
    "& .MuiInputBase-input": {
      padding: "6px 8px", // controls inner padding
      height: "auto",     // allow it to shrink
      boxSizing: "border-box",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ccc",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#90EE90",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#2e7d32",
    },
  },
}}

                      FormHelperTextProps={{
                        sx: { fontSize: 12, mt: 0.5 },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
            {/* Coupon Section */}
            {selectedPlan?.product?.id && (
              <CouponSection
                couponCode={couponCode}
                couponApplied={couponApplied}
                isVerifyCouponCodePending={isVerifyCouponCodePending}
                verifyCouponCodeError={verifyCouponCodeError}
                discountAmount={discountAmount}
                handleCouponChange={handleCouponChange}
                handleApplyCoupon={handleApplyCoupon}
                handleRemoveCoupon={handleRemoveCoupon}
              />
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default memo(SubscriptionPlans, (prevProps, nextProps) => {
  // Only re-render when selectedPlan changes or when there's a new submitError
  return (
    prevProps.selectedPlan?.product?.id ===
      nextProps.selectedPlan?.product?.id &&
    prevProps.submitError === nextProps.submitError
  );
});
