"use client";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  Divider,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { IconButton, InputAdornment } from "@mui/material";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  usePurchaseStripePlanByTrainerRegister,
  useRegisterTrainer,
  useSendVerification,
} from "@/helpers/hooks/mamAdmin/mamAdmin";
import { useVerifyCode } from "@/helpers/hooks/mamAdmin/mamAdmin";
import logo from "../../../public/images/logo.webp";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PaymentProcessor from "@/app/trainer-subscription/PaymentProcessor";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { Routes } from "@/config/routes";
import { useVerifyCouponCode } from "@/helpers/hooks/stripeflowapi/customer/customerPlans";

const TrainerSignupPage = () => {
  const sendVerification = useSendVerification();
  const verifyCode = useVerifyCode();
  const purchaseStripePlan = usePurchaseStripePlanByTrainerRegister();
  const { mutate: registerTrainer, isPending } = useRegisterTrainer();
  const { showSnackbar } = useSnackbar();
  const [isRegistering, setisRegistering] = useState(true);
  const router = useRouter();
  const [showVerifyField, setShowVerifyField] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isCouponValid, setIsCouponValid] = useState(false);
  const validateCoupon = useVerifyCouponCode();
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentDetailsData, setPaymentDetails] = useState(null);
  const [lastVerifiedEmail, setLastVerifiedEmail] = useState("");
  const [isFreePlan, setIsFreePlan] = useState(false);
  const [planChecked, setPlanChecked] = useState(false);
  const searchParams = useSearchParams();
  const referralFromUrl = searchParams.get("referral_code");
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
    setError,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      referral_code: referralFromUrl || "",
    },
  });
  const email = watch("email");
  const watchedEmail = watch("email");

  useEffect(() => {
    const savedPlanId = localStorage.getItem("selectedPlanId");
    if (savedPlanId) {
      setValue("price_id", savedPlanId); // set it into the form
    }
  }, []);

  useEffect(() => {
    if (
      isVerified &&
      watchedEmail &&
      watchedEmail.toLowerCase() !== lastVerifiedEmail?.toLowerCase()
    ) {
      setIsVerified(false);
      setShowVerifyField(false);
      setIsOTPSent(false);
      setValue("otp", ""); // Clear OTP
    }
  }, [watchedEmail, lastVerifiedEmail, isVerified]);

  useEffect(() => {
    setIsCouponValid(false);
  }, [watch("coupon_code")]);

  useEffect(() => {
    const storedPlan = localStorage.getItem("selectedPlan");
    const parsedPlan = storedPlan ? JSON.parse(storedPlan) : null;
    const isFree = parsedPlan?.price?.unit_amount === 0;
    setIsFreePlan(isFree);
    setPlanChecked(true);
  }, []);
  useEffect(() => {
    if (referralFromUrl) {
      setValue("referral_code", referralFromUrl);
    }
  }, [referralFromUrl, setValue]);
  const onSubmit = async (data) => {
    setisRegistering(true);

    if (!isVerified) {
      setError("email", {
        type: "manual",
        message: "Please verify your email",
      });
      return; // prevent submission
    }

    try {
      const storedPlan = localStorage.getItem("selectedPlan");
      const parsedPlan = storedPlan ? JSON.parse(storedPlan) : null;

      if (!parsedPlan) throw new Error("Subscription plan not selected.");

      const isFree = parsedPlan?.price?.unit_amount === 0;
      // setIsFreePlan(isFree);

      // Build the payload first
      const payload = {
        // referral_code: referralFromUrl || data.referral_code,
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
        phone_number: data.phone_number,
        address: {
          line1: data.address.line1,
          line2: data.address.line2,
          city: data.address.city,
          state: data.address.state,
          country: data.address.country,
          postal_code: data.address.postal_code,
        },
        ...(isFree ? {} : { price_id: parsedPlan.price.id }),
        ...(isCouponValid && data.coupon_code
          ? { coupon_code: data.coupon_code }
          : {}),
      };
      const finalReferralCode = referralFromUrl || data.referral_code;
      if (finalReferralCode) {
        payload.referral_code = finalReferralCode;
      }
      console.log("payload:", payload);
      registerTrainer(payload, {
        onSuccess: (response) => {
          const clientSecret = response?.client_secret;
          const paymentDetails = response?.payment_details;

          if (clientSecret) {
            setClientSecret(clientSecret);
            setPaymentDetails(paymentDetails);
            setShowPaymentForm(true);
          } else {
            setShowSuccessModal(true);
          }
          localStorage.removeItem("selectedPlanId");
          reset();
          setIsVerified(false);
          setIsOTPSent(false);
          setShowVerifyField(false);
          verifyCode.reset();
        },
        onError: (err) => {
          console.error("Signup failed", err);
        },
      });
    } catch (err) {
      console.error("Signup failed", err);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // After payment success, just show success modal and reset the form
      setShowPaymentForm(false);
      setShowSuccessModal(true);
      reset();
      setisRegistering(false);
    } catch (error) {
      console.error("Final registration after payment failed:", error);
      // Do nothing else — no snackbar or UI shown
    }
  };

  const handleVerifyClick = () => {
    if (email && !errors.email) {
      sendVerification.mutate(
        { email },
        {
          onSuccess: () => {
            setShowVerifyField(true);
            setIsOTPSent(true);
          },
        }
      );
    }
  };

  useEffect(() => {}, [watchedEmail, lastVerifiedEmail, isVerified]);

  return (
    <>
      {!showPaymentForm ? (
        <Box className="bg-green-50 min-h-screen flex flex-row items-center justify-center p-2">
          <Paper
            elevation={4}
            className="w-full max-w-6xl border-2 border-green-400 rounded-2xl"
            sx={{ padding: { xs: 2, md: 4 }, backgroundColor: "white" }}
          >
            {/* Header */}
            <Box textAlign="center" mb={4}>
              {/* Logo */}
              <Box mb={2} display="flex" justifyContent="center">
                <Image
                  src={logo}
                  alt="Mam Logo"
                  width={100}
                  height={100}
                  style={{ objectFit: "contain" }}
                  // priority
                />
              </Box>

              {/* Headings */}
              <Typography variant="h4" fontWeight={700} color="green">
                Welcome Trainer!
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" mt={1}>
                Fill in the details to get started with Mam.
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} mb={2}>
                <Grid container spacing={0}>
                  <Grid item xs={12} sx={{ pl: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Personal Details
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={6} md={4}>
                  <InputLabel
                    sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                  >
                    Full Name
                  </InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter your full name"
                    {...register("full_name", {
                      required: "This field is required",
                    })}
                    error={Boolean(errors.full_name)}
                    helperText={errors.full_name?.message}
                    InputProps={{
                      sx: {
                        fontSize: "14px",
                        height: "45px",
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc", // default border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#90EE90", // light green on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2e7d32", // dark green when focused
                        },
                      },
                    }}
                    FormHelperTextProps={{
                      sx: { fontSize: "12px", mt: 0.5 },
                    }}
                  />
                </Grid>

                <Grid item xs={6} md={4}>
                  <InputLabel
                    sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                  >
                    Phone Number
                  </InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Enter your phone number"
                    {...register("phone_number", {
                      required: "This field is required",
                      pattern: {
                        value: /^\d*\.?\d*$/,
                        message: "Please enter a valid number",
                      },
                      minLength: {
                        value: 10,
                        message: "Phone number must be at least 10 digits",
                      },
                    })}
                    error={Boolean(errors.phone_number)}
                    helperText={errors.phone_number?.message}
                    InputProps={{
                      sx: {
                        fontSize: "14px",
                        height: "45px",
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc", // default border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#90EE90", // light green on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2e7d32", // dark green when focused
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Password Field */}
                <Grid item xs={6} md={4}>
                  <InputLabel
                    sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                  >
                    Password
                  </InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "This field is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    InputProps={{
                      sx: {
                        fontSize: "14px",
                        height: "45px",
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc", // default border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#90EE90", // light green on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2e7d32", // dark green when focused
                        },
                        "& input:-webkit-autofill": {
                          WebkitBoxShadow: "0 0 0 1000px white inset",
                          WebkitTextFillColor: "#000", // Optional: text color
                        },
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    FormHelperTextProps={{
                      sx: { fontSize: "12px", mt: 0.5 },
                    }}
                  />
                </Grid>

                {/* Confirm Password Field */}
                <Grid item xs={6} md={4}>
                  <InputLabel
                    sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                  >
                    Confirm Password
                  </InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    {...register("confirm_password", {
                      required: "This field is required",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                    error={Boolean(errors.confirm_password)}
                    helperText={errors.confirm_password?.message}
                    InputProps={{
                      sx: {
                        fontSize: "14px",
                        height: "45px",
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc", // default border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#90EE90", // light green on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2e7d32", // dark green when focused
                        },
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                            edge="end"
                            size="small"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    FormHelperTextProps={{
                      sx: { fontSize: "12px", mt: 0.5 },
                    }}
                  />
                </Grid>

                <Grid item xs={6} md={4}>
                  <InputLabel
                    sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                  >
                    Email
                  </InputLabel>

                  <Box display="flex" gap={1} alignItems="center">
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter your email"
                      disabled={sendVerification.isLoading}
                      {...register("email", {
                        required: "This field is required",
                        pattern: {
                          value: /^[^@]+@[^@]+\.[^@]+$/,
                          message: "Enter a valid email",
                        },
                      })}
                      onChange={(e) => {
                        const lowercaseEmail = e.target.value.toLowerCase();
                        setValue("email", lowercaseEmail, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        if (
                          isVerified &&
                          lowercaseEmail !== lastVerifiedEmail?.toLowerCase()
                        ) {
                          setIsVerified(false);
                          setShowVerifyField(false);
                          setIsOTPSent(false);
                          setValue("otp", ""); // Clear OTP field too
                        }
                      }}
                      error={Boolean(errors.email)}
                      InputProps={{
                        sx: {
                          fontSize: "14px",
                          height: "45px",
                          backgroundColor: "white",
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

                        endAdornment: (
                          <InputAdornment position="end">
                            {isVerified &&
                            watchedEmail.toLowerCase() ===
                              lastVerifiedEmail?.toLowerCase() ? (
                              <Box
                                component="span"
                                sx={{
                                  color: "green",
                                  fontSize: "1.2rem",
                                  fontWeight: "bold",
                                  pr: 1,
                                }}
                              >
                                ✓
                              </Box>
                            ) : (
                              !isOTPSent && (
                                <Button
                                  onClick={handleVerifyClick}
                                  disabled={
                                    sendVerification.isPending ||
                                    !watchedEmail ||
                                    !!errors.email
                                  }
                                  size="small"
                                  color="primary"
                                  sx={{
                                    fontSize: "12px",
                                    minWidth: "40px",
                                    height: "22px",
                                    p: 0,
                                    lineHeight: 1,
                                    textTransform: "none",
                                  }}
                                >
                                  {sendVerification.isPending
                                    ? "Sending"
                                    : "Verify"}
                                </Button>
                              )
                            )}
                          </InputAdornment>
                        ),
                      }}
                      FormHelperTextProps={{
                        sx: { fontSize: "12px", mt: 0.5 },
                      }}
                    />
                  </Box>

                  {errors.email && (
                    <Typography
                      sx={{ fontSize: "12px", color: "red", mt: 0.5 }}
                    >
                      {errors.email.message}
                    </Typography>
                  )}
                </Grid>

                {showVerifyField && !isVerified && (
                  <Grid item xs={6} md={4}>
                    <InputLabel
                      sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                    >
                      Verify Email
                    </InputLabel>

                    <Box display="flex" gap={1} alignItems="center">
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter your verification code"
                        {...register("otp", {
                          required: "This field is required",
                          pattern: {
                            value: /^[0-9]{4,6}$/,
                            message: "Enter a valid code",
                          },
                        })}
                        error={Boolean(errors.otp)}
                        helperText={errors.otp?.message}
                        InputProps={{
                          sx: {
                            fontSize: "14px",
                            height: "45px",
                            backgroundColor: "white",
                          },
                          endAdornment: (
                            <Button
                              // variant="contained"
                              color="primary"
                              size="small"
                              sx={{
                                fontSize: "11px",
                                height: "30px",
                                ml: 1,
                                px: 1.5,
                                minWidth: "auto",
                                textTransform: "none",
                              }}
                              onClick={() => {
                                const otp = watch("otp");
                                if (/^[0-9]{4,6}$/.test(otp)) {
                                  verifyCode.mutate(
                                    { email, otp },
                                    {
                                      onSuccess: () => {
                                        setIsVerified(true);
                                        setShowVerifyField(false);
                                        setLastVerifiedEmail(
                                          email.toLowerCase()
                                        );
                                      },
                                      onError: (err) => {
                                        console.error(
                                          "OTP verification failed",
                                          err
                                        );
                                      },
                                    }
                                  );
                                }
                              }}
                              disabled={
                                verifyCode.isPending || !email || !!errors.email
                              }
                            >
                              {verifyCode.isPending ? "Verifying" : "Verify"}
                            </Button>
                          ),
                        }}
                        FormHelperTextProps={{
                          sx: { fontSize: "12px", mt: 0.5 },
                        }}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} md={4}>
                  <InputLabel
                    sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                  >
                    Referral Code
                  </InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter your referral code"
                    // {...register("referral_code", {
                    //   required: "This field is required",
                    // })}
                    {...register("referral_code", {
                      validate: (value) =>
                        !value ||
                        value.length >= 6 ||
                        "Referral code must be at least 6 characters",
                    })}
                    error={Boolean(errors.referral_code)}
                    helperText={errors.referral_code?.message}
                    InputProps={{
                      // sx: {
                      //   fontSize: "14px",
                      //   height: "45px",
                      //   paddingY: 0.5,
                      //   backgroundColor: "white",
                      // },
                      sx: {
                        fontSize: "14px",
                        height: "45px",
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc", // default border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#90EE90", // light green on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2e7d32", // dark green when focused
                        },
                        "& input:-webkit-autofill": {
                          WebkitBoxShadow: "0 0 0 1000px white inset",
                          WebkitTextFillColor: "#000", // Optional: text color
                        },
                      },  
                      readOnly: !!referralFromUrl,
                    }}
                    FormHelperTextProps={{
                      sx: { fontSize: "12px", mt: 0.5 },
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12}>
                  <Divider mb={1} />
                </Grid>

                <Grid container spacing={0}>
                  <Grid item xs={12} sx={{ pl: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Billing Details
                    </Typography>
                  </Grid>
                </Grid>

                <Grid item xs={6} md={4}>
                  <InputLabel
                    sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                  >
                    Address Line 1
                  </InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter your address line 1"
                    {...register("address.line1", {
                      required: "This field is required",
                    })}
                    error={Boolean(errors.address?.line1)}
                    helperText={errors.address?.line1?.message}
                    InputProps={{
                      sx: {
                        fontSize: "14px",
                        height: "45px",
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc", // default border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#90EE90", // light green on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2e7d32", // dark green when focused
                        },
                      },
                    }}
                    FormHelperTextProps={{
                      sx: { fontSize: "12px", mt: 0.5 },
                    }}
                  />
                </Grid>

                <Grid item xs={6} md={4}>
                  <InputLabel
                    sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                  >
                    Address Line 2
                  </InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter your address line 2"
                    {...register("address.line2", {
                      // required: "This field is required",
                    })}
                    error={Boolean(errors.address?.line2)}
                    helperText={errors.address?.line2?.message}
                    InputProps={{
                      sx: {
                        fontSize: "14px",
                        height: "45px",
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc", // default border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#90EE90", // light green on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2e7d32", // dark green when focused
                        },
                      },
                    }}
                    FormHelperTextProps={{
                      sx: { fontSize: "12px", mt: 0.5 },
                    }}
                  />
                </Grid>

                <Grid item xs={6} md={4}>
                  <InputLabel
                    sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                  >
                    City
                  </InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="City Name"
                    {...register("address.city", {
                      required: "This field is required",
                    })}
                    error={Boolean(errors.address?.city)}
                    helperText={errors.address?.city?.message}
                    InputProps={{
                      sx: {
                        fontSize: "14px",
                        height: "45px",
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc", // default border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#90EE90", // light green on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2e7d32", // dark green when focused
                        },
                      },
                    }}
                    FormHelperTextProps={{
                      sx: { fontSize: "12px", mt: 0.5 },
                    }}
                  />
                </Grid>

                <Grid item xs={6} md={4}>
                  <InputLabel
                    sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                  >
                    State
                  </InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter your state name"
                    {...register("address.state", {
                      required: "This field is required",
                    })}
                    error={Boolean(errors.address?.state)}
                    helperText={errors.address?.state?.message}
                    InputProps={{
                      sx: {
                        fontSize: "14px",
                        height: "45px",
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc", // default border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#90EE90", // light green on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2e7d32", // dark green when focused
                        },
                      },
                    }}
                    FormHelperTextProps={{
                      sx: { fontSize: "12px", mt: 0.5 },
                    }}
                  />
                </Grid>

                <Grid item xs={6} md={4}>
                  <InputLabel
                    sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                  >
                    Country
                  </InputLabel>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter your country name"
                    {...register("address.country", {
                      required: "This field is required",
                    })}
                    error={Boolean(errors.address?.country)}
                    helperText={errors.address?.country?.message}
                    InputProps={{
                      sx: {
                        fontSize: "14px",
                        height: "45px",
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc", // default border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#90EE90", // light green on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2e7d32", // dark green when focused
                        },
                      },
                    }}
                    FormHelperTextProps={{
                      sx: { fontSize: "12px", mt: 0.5 },
                    }}
                  />
                </Grid>

                <Grid item xs={6} md={4}>
                  <InputLabel
                    sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                  >
                    Postal Code
                  </InputLabel>
                  <TextField
                    fullWidth
                    placeholder="Postal Code"
                    {...register("address.postal_code", {
                      required: "This field is required",
                      pattern: {
                        value: /^\d{5,}$/, // Only digits, at least 5 digits
                        message: "Postal code must be at least 5 digits",
                      },
                    })}
                    error={Boolean(errors.address?.postal_code)}
                    helperText={errors.address?.postal_code?.message}
                    InputProps={{
                      sx: {
                        fontSize: "14px",
                        height: "45px",
                        backgroundColor: "white",
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
                  />
                </Grid>

                {planChecked && !isFreePlan && (
                  <Grid item xs={6} md={4}>
                    <InputLabel
                      sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                    >
                      Coupon Code
                    </InputLabel>

                    <Box display="flex" gap={1} alignItems="center">
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Enter your coupon code"
                        {...register("coupon_code", {
                          pattern: {
                            value: /^[A-Za-z0-9_-]{3,20}$/,
                            message: "Enter a valid coupon code",
                          },
                          onChange: () => {
                            setIsCouponValid(false);
                          },
                        })}
                        error={Boolean(errors.coupon_code)}
                        helperText={errors.coupon_code?.message}
                        InputProps={{
                          // sx: {
                          //   fontSize: "14px",
                          //   height: "45px",
                          //   backgroundColor: "white",
                          // },
                          sx: {
                        fontSize: "14px",
                        height: "45px",
                        backgroundColor: "white",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#ccc", // default border
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#90EE90", // light green on hover
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#2e7d32", // dark green when focused
                        },
                        "& input:-webkit-autofill": {
                          WebkitBoxShadow: "0 0 0 1000px white inset",
                          WebkitTextFillColor: "#000", // Optional: text color
                        },
                      },
                          endAdornment: (
                            <InputAdornment position="end">
                              {isCouponValid ? (
                                <>
                                  <CheckCircleIcon
                                    sx={{ color: "green", mr: 1 }}
                                  />
                                  <CloseIcon
                                    sx={{
                                      color: "gray",
                                      cursor: "pointer",
                                      fontSize: 20,
                                    }}
                                    onClick={() => {
                                      setIsCouponValid(false);
                                      setValue("coupon_code", "");
                                    }}
                                  />
                                </>
                              ) : (
                                <Button
                                  color="primary"
                                  size="small"
                                  sx={{
                                    fontSize: "11px",
                                    height: "30px",
                                    px: 1.5,
                                    minWidth: "auto",
                                    textTransform: "none",
                                  }}
                                  onClick={() => {
                                    const code = watch("coupon_code");

                                    if (/^[A-Za-z0-9_-]{3,20}$/.test(code)) {
                                      validateCoupon.mutate(
                                        {
                                          coupon_code: code,
                                          user_type: "trainer", // explicitly pass the user type here
                                        },
                                        {
                                          onSuccess: () =>
                                            setIsCouponValid(true),
                                          onError: () =>
                                            setIsCouponValid(false),
                                        }
                                      );
                                    }
                                  }}
                                  disabled={
                                    validateCoupon.isPending ||
                                    !watch("coupon_code")?.length
                                  }
                                >
                                  {validateCoupon.isPending
                                    ? "Applying..."
                                    : "Apply"}
                                </Button>
                              )}
                            </InputAdornment>
                          ),
                        }}
                        FormHelperTextProps={{
                          sx: { fontSize: "12px", mt: 0.5 },
                        }}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Buttons */}
              <Box display="flex" justifyContent="center" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  size="large"
                  disabled={isPending}
                  sx={{
                    ml: 1,
                    px: 1.5,
                    minWidth: "80px",
                    textTransform: "none",
                  }}
                >
                  {isPending ? "Submitting" : "Pay & Sign Up"}
                </Button>
                <Button
                  variant="outlined"
                  color="success"
                  size="large"
                  onClick={() => router.back()}
                  sx={{
                    ml: 1,
                    px: 1.5,
                    minWidth: "80px",
                    textTransform: "none",
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      ) : clientSecret ? (
        <PaymentProcessor
          isRegistering={isRegistering}
          clientSecret={clientSecret}
          paymentDetails={paymentDetailsData}
          onCancel={() => setShowPaymentForm(false)}
          onSuccess={handlePaymentSuccess}
        />
      ) : (
        <Box textAlign="center" mt={10}>
          <CircularProgress color="success" />
          <Typography variant="subtitle1" mt={2}>
            Preparing payment session...
          </Typography>
        </Box>
      )}

      {/* Success Modal */}
      <Dialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        PaperProps={{
          sx: { p: 1.5 },
        }}
      >
        <DialogTitle sx={{ pb: 1, fontSize: "16px" }}>
          Registered Successfully!
        </DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          <Typography fontSize="14px">
            Trainer registered successfully. The rest of the details will be
            sent to your email. Please check your inbox for further updates!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 1 }}>
          <Button
            variant="contained"
            onClick={() => {
              setShowSuccessModal(false);
              router.push(Routes.login);
            }}
            autoFocus
            size="small"
          >
            Go Back To Login!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TrainerSignupPage;
