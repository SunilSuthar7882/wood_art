"use client";

import { IOSSwitch } from "@/app/ThemeRegistry";
import CommonDatePicker from "@/component/CommonDatePicker";
import CommonSelect from "@/component/CommonSelect";
import {
  averageActivityLevelOptions,
  fitnessGoalOptions,
  mealPlanPreferencesOption,
  mealsEatenPerDayOptions,
  measurementStandardOption,
} from "@/constants/addUpdateCustomer";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { ErrorMessage } from "@hookform/error-message";
import { useRegisterCustomer } from "@/helpers/hooks/mamAdmin/mamAdmin";
import logo from "../../../public/images/logo.webp";

import {
  Grid,
  TextField,
  InputLabel,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useSendVerification } from "@/helpers/hooks/mamAdmin/mamAdmin";
import { useVerifyCode } from "@/helpers/hooks/mamAdmin/mamAdmin";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Routes } from "@/config/routes";
import PaymentProcessor from "@/app/trainer-subscription/PaymentProcessor";
import CustomAutoComplete from "@/component/CommonComponents/CustomAutoComplete";
import CustomTextField from "@/component/CommonComponents/CustomTextField";
import { useGetMealCategories } from "@/helpers/hooks/mamAdmin/mealCategoriesList";

export default function RegisterCustomer({ loading }) {
    const {
      data: categories = [],
      isLoading: isFetchingCategories,
      isError: isCategoryError,
      error: categoryError,
      refetch: refetchCategories,
    } = useGetMealCategories();
  const router = useRouter();
  const role = getLocalStorageItem("role");
  const [showVerifyField, setShowVerifyField] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const verifyCode = useVerifyCode();
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [lastVerifiedEmail, setLastVerifiedEmail] = useState("");
  const searchParams = useSearchParams();
  const referralFromUrl = searchParams.get("referral_code");
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      referral_code: referralFromUrl || "",
      average_activity_level: "",
      meals_eaten_per_day: "",
      fitness_goals: "",
      meal_plan_preferences: "",
      is_access_granted: false,
      track_my_progress: false,
      self_service_plan: false,
      // ...other defaults
    },
    mode: "onChange",
  });
  const email = watch("email");
  const watchedEmail = watch("email");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const sendVerification = useSendVerification();
  const measurementStandard = watch("measurement_standard");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentDetailsData, setPaymentDetails] = useState(null);
  const [isRegistering, setisRegistering] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const { mutate: registerCustomer, isPending } = useRegisterCustomer();

  const handleSwitchChange = (name, value) => {
    if (name === "is_access_granted" && value) {
      setValue("track_my_progress", false);
      setValue("self_service_plan", false);
      setValue("is_access_granted", true);
    } else if (name === "is_access_granted" && !value) {
      setValue("is_access_granted", false);
    } else if (
      (name === "track_my_progress" || name === "self_service_plan") &&
      value
    ) {
      setValue("is_access_granted", false);
      setValue(name, true);
    } else {
      setValue(name, false);
    }
  };
  useEffect(() => {
    const savedPlanId = localStorage.getItem("selectedPlanId");
    if (savedPlanId) {
      setValue("price_id", savedPlanId);
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
    if (referralFromUrl) {
      setValue("referral_code", referralFromUrl);
    }
  }, [referralFromUrl, setValue]);
  const onSubmit = (data) => {
    setisRegistering(true);
    const height =
      measurementStandard?.value === "US Standard"
        ? Number(data.feet) * 12 + Number(data.inch)
        : Number(data.height);
    const storedPlan = localStorage.getItem("selectedPlan");
    const parsedPlan = storedPlan ? JSON.parse(storedPlan) : null;
    const userData = {
      // referral_code: referralFromUrl || data.referral_code,
      address: {
        line1: "adfs",
        line2: "sdfsdf",
        city: "sdfsdf",
        state: "us",
        country: "us",
        postal_code: "390000",
      },
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password,
      height: height.toString(),
      weight: data.weight.toString(),
      birth_date: dayjs(data.birth_date).format("YYYY-MM-DD"),
      gender: data.gender,
      phone_number: data.phone_number,
      measurement_standard: data.measurement_standard.value,
      average_activity_level: data.average_activity_level,
      meals_eaten_per_day: data.meals_eaten_per_day,
      fitness_goals: data.fitness_goals,
      meal_plan_preferences: data.meal_plan_preferences,
      is_access_granted: data.is_access_granted,
      track_my_progress: data.track_my_progress,
      self_service_plan: data.self_service_plan,
      price_id: parsedPlan.price.id,
    };
    const finalReferralCode = referralFromUrl || data.referral_code;
    if (finalReferralCode) {
      userData.referral_code = finalReferralCode;
    }
    registerCustomer(userData, {
      onSuccess: (response) => {
        // reset({
        //   referral_code: "",
        //   full_name: "",
        //   email: "",
        //   password: "",
        //   confirm_password: "",
        //   height: "",
        //   weight: "",
        //   birth_date: null,
        //   gender: "",
        //   phone_number: "",
        //   measurement_standard: { value: "", label: "" },
        //   average_activity_level: "",
        //   meals_eaten_per_day: "",
        //   fitness_goals: [],
        //   meal_plan_preferences: [],
        //   is_access_granted: false,
        //   track_my_progress: false,
        //   self_service_plan: false,
        // });
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
        // setShowSuccessModal(true);
      },
      onError: (err) => {
        console.error("Registration failed", err);
      },
    });
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

  return (
    <>
      {!showPaymentForm ? (
        <>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 4,
              mb: 2,
            }}
          >
            <Image
              src={logo}
              alt="Marcos & Meals Logo"
              width={80}
              height={80}
              style={{ marginBottom: "0.5rem" }}
            />
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              Welcome to Marcos & Meals
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="green"
              textAlign="center"
            >
              Customer Registration
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // minHeight: "100vh",
            }}
          >
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: 2,
                p: 3,
                m: 3,
                maxWidth: "60rem",
              }}
            >
              {loading ? (
                <>Loading...</>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box pb={3}>
                    <Typography
                      variant="h5"
                      fontWeight="600"
                      color="green"
                      mb={1}
                    >
                      Personal Information
                    </Typography>

                    {/* Name, Email, Birthdate */}
                    <Grid container spacing={2} mb={3}>
                      <Grid item xs={12} md={4}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                        >
                          Full Name
                        </InputLabel>
                        <CustomTextField
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
                              paddingY: 0.5,
                              backgroundColor: "white !important",
                            },
                          }}
                          FormHelperTextProps={{
                            sx: { fontSize: "12px", mt: 0.5 },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                        >
                          Email
                        </InputLabel>

                        <Box display="flex" gap={1} alignItems="center">
                          <CustomTextField
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
                              const lowercaseEmail =
                                e.target.value.toLowerCase();
                              setValue("email", lowercaseEmail, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              if (
                                isVerified &&
                                lowercaseEmail !==
                                  lastVerifiedEmail?.toLowerCase()
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
                                backgroundColor: "white !important",
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
                        <Grid item xs={12} md={4}>
                          <InputLabel
                            sx={{
                              fontWeight: "bold",
                              fontSize: "14px",
                              mb: 0.5,
                            }}
                          >
                            Verify Email
                          </InputLabel>

                          <Box display="flex" gap={1} alignItems="center">
                            <CustomTextField
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
                                  backgroundColor: "white !important",
                                },
                                endAdornment: (
                                  <Button
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
                                      verifyCode.isPending ||
                                      !email ||
                                      !!errors.email
                                    }
                                  >
                                    {verifyCode.isPending
                                      ? "Verifying"
                                      : "Verify"}
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
                    <Grid container spacing={2} mb={3}>
                      {/* Password Field */}
                      <Grid item xs={12} md={4}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                        >
                          Password
                        </InputLabel>
                        <CustomTextField
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
                              paddingY: 0.5,
                              backgroundColor: "white !important",
                            },
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    setShowPassword((prev) => !prev)
                                  }
                                  edge="end"
                                  size="small"
                                >
                                  {showPassword ? (
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

                      {/* Confirm Password Field */}
                      <Grid item xs={12} md={4}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                        >
                          Confirm Password
                        </InputLabel>
                        <CustomTextField
                          fullWidth
                          size="small"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter your password"
                          {...register("confirm_password", {
                            required: "This field is required",
                            validate: (value) =>
                              value === watch("password") ||
                              "Passwords do not match",
                          })}
                          error={Boolean(errors.confirm_password)}
                          helperText={errors.confirm_password?.message}
                          InputProps={{
                            sx: {
                              fontSize: "14px",
                              height: "45px",
                              paddingY: 0.5,
                              backgroundColor: "white !important",
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
                      <Grid item xs={12} md={4}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                        >
                          Referral Code
                        </InputLabel>
                        <CustomTextField
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
                            sx: {
                              fontSize: "14px",
                              height: "45px",
                              paddingY: 0.5,
                              backgroundColor: "white !important",
                            },
                            readOnly: !!referralFromUrl,
                          }}
                          FormHelperTextProps={{
                            sx: { fontSize: "12px", mt: 0.5 },
                          }}
                        />
                        {/* <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter your referral code"
                      {...register("referral_code", {
                        required: "This field is required",
                      })}
                      error={Boolean(errors.referral_code)}
                      helperText={errors.referral_code?.message}
                      InputProps={{
                        sx: {
                          fontSize: "14px",
                          height: "45px",
                          paddingY: 0.5,
                          backgroundColor: "white",
                        },
                      }}
                      FormHelperTextProps={{
                        sx: { fontSize: "12px", mt: 0.5 },
                      }}
                    /> */}
                      </Grid>
                    </Grid>

                    {/* Gender & Phone */}
                    <Grid container spacing={2} mb={4}>
                      <Grid item xs={12} md={4}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                        >
                          Gender
                        </InputLabel>
                        <Controller
                          name="gender"
                          control={control}
                          defaultValue={null}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <RadioGroup {...field} row>
                              {["Male", "Female", "Other"].map((option) => (
                                <FormControlLabel
                                  key={option}
                                  value={option}
                                  control={<Radio size="small" />}
                                  label={option}
                                />
                              ))}
                            </RadioGroup>
                          )}
                        />
                        <ErrorMessage
                          errors={errors}
                          name="gender"
                          render={({ message }) => (
                            <p className="errorMessage">{message}</p>
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                        >
                          Phone Number
                        </InputLabel>
                        <CustomTextField
                          fullWidth
                          placeholder="Enter your phone number"
                          {...register("phone_number", {
                            required: "This field is required",
                            pattern: {
                              value: /^\d*\.?\d*$/,
                              message: "Please enter a valid number",
                            },
                            minLength: {
                              value: 5,
                              message: "Phone number must be at least 5 digits",
                            },
                          })}
                          error={Boolean(errors.phone_number)}
                          helperText={errors.phone_number?.message}
                          InputProps={{
                            sx: {
                              fontSize: "14px",
                              height: "45px",
                              paddingY: 0.5,
                              backgroundColor: "white !important",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 0.5 }}
                        >
                          Birth Date
                        </InputLabel>

                        <CommonDatePicker
                          name="birth_date"
                          control={control}
                          errors={errors}
                          format={"MM-DD-YYYY"}
                          // format={"YYYY-MM-DD"}
                          value={watch("birth_date")}
                          size="small"
                          color="white"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              sx: {
                                height: "42px",
                                backgroundColor: "white",
                                fontSize: "14px",
                                borderRadius: "8px",
                                boxSizing: "border-box",
                                "& .MuiOutlinedInput-root": {
                                  height: "100%",
                                  borderRadius: "6px",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#c8cacf",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#16a34a !important",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: "#16a34a !important",
                                  },
                              },
                            },
                          }}
                        />

                        <ErrorMessage
                          errors={errors}
                          name="birth_date"
                          render={({ message }) => (
                            <p
                              className="errorMessage"
                              style={{ fontSize: "12px", marginTop: "4px" }}
                            >
                              {message}
                            </p>
                          )}
                        />
                      </Grid>
                    </Grid>

                    {/* Measurement Standard, Height, Weight */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <label
                          className="input-label"
                          style={{
                            marginBottom: 8,
                            display: "block",
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                        >
                          Measurement Standard
                        </label>
                        <CommonSelect
                          name="measurement_standard"
                          control={control}
                          options={measurementStandardOption}
                          isRequired
                          placeholder="Select Standard"
                        />
                        <ErrorMessage
                          errors={errors}
                          name="measurement_standard"
                          render={({ message }) => (
                            <p className="errorMessage">{message}</p>
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
                        >
                          Height
                        </InputLabel>
                        {measurementStandard?.value === "US Standard" ? (
                          <Box display="flex" gap={2}>
                            <CustomTextField
                              fullWidth
                              placeholder="Feet"
                              {...register("feet", {
                                required: "This field is required",
                                min: { value: 1, message: "Min 1 ft" },
                                max: { value: 12, message: "Max 12 ft" },
                                pattern: {
                                  value: /^\d*\.?\d*$/,
                                  message: "Invalid number",
                                },
                              })}
                              error={Boolean(errors.feet)}
                              helperText={errors.feet?.message}
                              InputProps={{
                                sx: {
                                  fontSize: "14px",
                                  height: "45px",
                                  paddingY: 0.5,
                                  backgroundColor: "white !important",
                                },
                              }}
                            />
                            <CustomTextField
                              fullWidth
                              placeholder="Inches"
                              {...register("inch", {
                                required: "This field is required",
                                max: { value: 12, message: "Max 12 inch" },
                                pattern: {
                                  value: /^\d*\.?\d*$/,
                                  message: "Invalid number",
                                },
                              })}
                              error={Boolean(errors.inch)}
                              helperText={errors.inch?.message}
                              InputProps={{
                                sx: {
                                  fontSize: "14px",
                                  height: "45px",
                                  paddingY: 0.5,
                                  backgroundColor: "white !important",
                                },
                              }}
                            />
                          </Box>
                        ) : (
                          <CustomTextField
                            fullWidth
                            placeholder="Height in cm"
                            {...register("height", {
                              required: "This field is required",
                              min: { value: 1, message: "Minimum 1 cm" },
                              pattern: {
                                value: /^\d*\.?\d*$/,
                                message: "Invalid number",
                              },
                            })}
                            error={Boolean(errors.height)}
                            helperText={errors.height?.message}
                            InputProps={{
                              sx: {
                                fontSize: "14px",
                                height: "45px",
                                paddingY: 0.5,
                                backgroundColor: "white !important",
                              },
                            }}
                          />
                        )}
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
                        >
                          Weight
                        </InputLabel>
                        <CustomTextField
                          fullWidth
                          placeholder={`Weight in ${
                            measurementStandard?.value === "US Standard"
                              ? "lbs"
                              : "kg"
                          }`}
                          {...register("weight", {
                            required: "This field is required",
                            min: { value: 1, message: "Minimum 1 unit" },
                            pattern: {
                              value: /^\d*\.?\d*$/,
                              message: "Invalid number",
                            },
                          })}
                          error={Boolean(errors.weight)}
                          helperText={errors.weight?.message}
                          InputProps={{
                            sx: {
                              fontSize: "14px",
                              height: "45px",
                              paddingY: 0.5,
                              backgroundColor: "white !important",
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box>
                    <Grid container spacing={3}>
                      {/* Average Activity Level */}
                      <Grid item xs={12}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
                        >
                          Average Activity Level*
                        </InputLabel>
                        <Controller
                          name="average_activity_level"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <RadioGroup {...field} row>
                              {averageActivityLevelOptions?.map((option) => (
                                <FormControlLabel
                                  key={option.value}
                                  value={option.value}
                                  control={<Radio size="small" />}
                                  label={option.label}
                                  sx={{
                                    mr: 4,
                                    ".MuiTypography-root": { fontSize: "14px" },
                                    ".MuiButtonBase-root": {
                                      p: "2px 7px 3px 10px",
                                    },
                                  }}
                                />
                              ))}
                            </RadioGroup>
                          )}
                        />
                        <ErrorMessage
                          errors={errors}
                          name="average_activity_level"
                          render={({ message }) => (
                            <Typography color="error" fontSize="12px" mt={0.5}>
                              {message}
                            </Typography>
                          )}
                        />
                      </Grid>

                      {/* Meals Eaten Per Day */}
                      <Grid item xs={12}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
                        >
                          Meals Eaten Per Day*
                        </InputLabel>
                        <Controller
                          name="meals_eaten_per_day"
                          control={control}
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <RadioGroup {...field} row>
                              {mealsEatenPerDayOptions?.map((option) => (
                                <FormControlLabel
                                  key={option.value}
                                  value={option.value}
                                  control={<Radio size="small" />}
                                  label={option.label}
                                  sx={{
                                    mr: 4,
                                    ".MuiTypography-root": { fontSize: "14px" },
                                    ".MuiButtonBase-root": {
                                      p: "2px 7px 3px 10px",
                                    },
                                  }}
                                />
                              ))}
                            </RadioGroup>
                          )}
                        />
                        <ErrorMessage
                          errors={errors}
                          name="meals_eaten_per_day"
                          render={({ message }) => (
                            <Typography color="error" fontSize="12px" mt={0.5}>
                              {message}
                            </Typography>
                          )}
                        />
                      </Grid>

                      {/* Fitness Goals */}
                      <Grid item xs={12}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
                        >
                          Fitness Goals*
                        </InputLabel>
                      

                        <Controller
                          name="fitness_goals"
                          control={control}
                          defaultValue={[]} // now an array for multiple selections
                          rules={{ required: "This field is required" }}
                          render={({ field }) => (
                            <FormGroup row sx={{ marginLeft: "4px" }}>
                              {fitnessGoalOptions?.map((option) => (
                                <FormControlLabel
                                  key={option.value}
                                  control={
                                    <Checkbox
                                      size="small"
                                      checked={field.value?.includes(
                                        option.value
                                      )}
                                      onChange={(e) => {
                                        const updatedValue = e.target.checked
                                          ? [
                                              ...(field.value || []),
                                              option.value,
                                            ]
                                          : field.value?.filter(
                                              (value) => value !== option.value
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  }
                                  label={option.label}
                                  sx={{
                                    marginRight: "30px",
                                    ".MuiTypography-root": {
                                      fontSize: "15px",
                                    },
                                    ".MuiButtonBase-root": {
                                      padding: "2px 7px 3px 10px",
                                    },
                                  }}
                                />
                              ))}
                            </FormGroup>
                          )}
                        />
                     
                        <ErrorMessage
                          errors={errors}
                          name="fitness_goals"
                          render={({ message }) => (
                            <Typography color="error" fontSize="12px" mt={0.5}>
                              {message}
                            </Typography>
                          )}
                        />
                      </Grid>

                      {/* Meal Plan Preferences */}
                      <Grid item xs={12}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
                        >
                          Meal Plan Preferences*
                        </InputLabel>
                      
<Controller
  name="meal_plan_preferences"
  control={control}
  defaultValue={[]}
  rules={{ required: "This field is required" }}
  render={({ field }) => (
    <CustomAutoComplete
      multiple
      options={
        categories?.map((cat) => ({
          value: cat.id,
          label: cat.name,
        })) || []
      }
      getOptionLabel={(option) => option.label}
      value={
        Array.isArray(field.value)
          ? field.value
              .map((val) => {
                const id = typeof val === "object" ? val.value || val.id : val;
                const cat = categories?.find((c) => c.id === id);
                return cat ? { value: cat.id, label: cat.name } : null;
              })
              .filter(Boolean)
          : []
      }
      onChange={(_, selectedOptions) => {
        field.onChange(selectedOptions.map((opt) => opt.value));
      }}
      renderInputLabel="Select Preferences"
      isOptionEqualToValue={(option, value) => option.value === value.value}
       sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "white",
              border: "1px solid #d3d3d3",
              color: "#4a5568",
              fontSize: "0.875rem",
              boxShadow: "none",
              paddingRight: "40px !important",
              minHeight: 41, // reduces padding from default ~65px
              "& fieldset": {
                display: "none",
              },
              "&:hover": {
                borderColor: "#16a34a",
              },
              "&.Mui-focused": {
                outline: "none",
                boxShadow: "0 0 0 2px rgba(72, 187, 120, 0.4)",
                borderColor: "#16a34a",
              },
            },
          }}
    />
  )}
/>


                        {/* <Controller
                                          name="meal_plan_preferences"
                                          control={control}
                                          defaultValue={[]}
                                          rules={{ required: "This field is required" }}
                                          render={({ field }) => (
                                            <CustomAutoComplete
                                              multiple
                                              options={
                                                categories?.map((cat) => ({
                                                  value: cat.id,
                                                  label: cat.name,
                                                })) || []
                                              }
                                              getOptionLabel={(option) => option.label}
                                              value={
                                                field.value
                                                  ?.map((val) => {
                                                    const id =
                                                      typeof val === "object"
                                                        ? val.value || val.id
                                                        : val; // support both
                                                    const cat = categories?.find((c) => c.id === id);
                                                    return cat
                                                      ? { value: cat.id, label: cat.name }
                                                      : null;
                                                  })
                                                  .filter(Boolean) || []
                                              }
                                              onChange={(_, selectedOptions) => {
                                                field.onChange(selectedOptions.map((opt) => opt.value));
                                              }}
                                              renderInputLabel="Select Preferences"
                                              isOptionEqualToValue={(option, value) =>
                                                option.value === value.value
                                              }
                                            />
                                          )}
                                        /> */}
                        <ErrorMessage
                          errors={errors}
                          name="meal_plan_preferences"
                          render={({ message }) => (
                            <Typography color="error" fontSize="12px" mt={0.5}>
                              {message}
                            </Typography>
                          )}
                        />
                      </Grid>

                      {/* Access Switches */}
                      <Grid item xs={12} gap={1}>
                        <InputLabel
                          sx={{ fontWeight: "bold", fontSize: "14px", mb: 1 }}
                        >
                          Access Granted
                        </InputLabel>
                        <FormGroup row sx={{ gap: 3, paddingLeft:"10px" }}>
                          {[
                            {
                              name: "track_my_progress",
                              label: "Track My Progress",
                            },
                            {
                              name: "self_service_plan",
                              label: "Self Service Plan",
                            },
                            { name: "is_access_granted", label: "None" },
                          ].map(({ name, label }) => (
                            <Controller
                              key={name}
                              name={name}
                              control={control}
                              defaultValue={false}
                              render={({ field }) => (
                                <FormControlLabel
                                sx={{gap:0.5}}
                                  control={
                                    <IOSSwitch
                                      {...field}
                                      checked={field.value}
                                      onChange={(e) => {
                                        field.onChange(e.target.checked);
                                        handleSwitchChange(
                                          name,
                                          e.target.checked
                                        );
                                      }}
                                    />
                                  }
                                  label={label}
                                />
                              )}
                            />
                          ))}
                        </FormGroup>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box display="flex" justifyContent="center" mt={4}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ px: 5 }}
                        disabled={!isValid || isPending || !isVerified}
                      >
                        {/* {isPending ? "Registering..." : "Register"} */}
                        {isPending ? "Submitting" : "Pay & Sign Up"}
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        sx={{ px: 5 }}
                        onClick={() => {
                          reset();
                          router.push("/register");
                        }}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Box>
                </form>
              )}
            </Box>
          </Box>
        </>
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
      <Dialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        PaperProps={{
          sx: {
            p: 1.5,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, fontSize: "16px" }}>
          Registered Successfully!
        </DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          {/* <Typography fontSize="14px">{successMessage}</Typography> */}
          <Typography fontSize="14px">
            You have registered successfully. You can now log in using your credentials.
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
}
