"use client";
import React from "react";
import CommonDatePicker from "@/component/CommonDatePicker";
import CommonSelect from "@/component/CommonSelect";
import {
  averageActivityLevelOptions,
  fitnessGoalOptions,
  mealPlanPreferencesOption,
  mealsEatenPerDayOptions,
  measurementStandardOption,
} from "@/constants/addUpdateCustomer";
import { ErrorMessage } from "@hookform/error-message";
import {
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Switch,
  Button,
  CircularProgress,
  Checkbox,
  Card,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getLocalStorageItem } from "@/helpers/localStorage";

import userUploadImage from "../../public/images/upload-user-photo.png";
import { useGetProfile } from "@/helpers/hooks/profilesection/getprofile";
import { editCustomerProfile } from "@/helpers/hooks/profilesection/editcustomerprofile";
import { errorNotification, successNotification } from "@/helpers/notification";
import EditIcon from "@mui/icons-material/Edit";
import { userGetReferralLink } from "@/helpers/hooks/referrallink/usergetreferrallink";
import { Routes } from "@/config/routes";
import { User } from "lucide-react";
import CustomAutoComplete from "@/component/CommonComponents/CustomAutoComplete";
import { useGetMealCategories } from "@/helpers/hooks/mamAdmin/mealCategoriesList";
import avatarImage from "../../public/avatarimage.jpeg";
import CustomTextField from "@/component/CommonComponents/CustomTextField";
import CommonDialogBox from "@/component/CommonDialogBox";
import AffiliateProgramPage from "./AffiliateProgramPage";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 36,
  height: 20,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#65C466",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#2ECA45",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 16,
    height: 16,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));
const CustomerProfile = () => {
  const { data, isFetching, refetch } = useGetProfile();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const fileInputRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const role = getLocalStorageItem("role");
  const { mutate: editcustomerprofile } = editCustomerProfile();
  const [initialData, setInitialData] = useState({});
  const [isCustomer, setIsCustomer] = useState(true);
  const [isTrainer, setIsTrainer] = useState(false);
  const {
    data: userreferralLink,
    isFetching: isFetchinguserreferralLink,
    refetch: refetchuserreferralLink,
  } = userGetReferralLink();
  const [copied, setCopied] = useState(false);
  const [referralLink, setreferralLink] = useState(null);
  const [configuration, setconfiguration] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialogBox = () => {
    setOpenDialog(true);
  };
  const handleCloseDialogBox = () => {
    setOpenDialog(false);
  };
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fitness_goals: initialData.fitness_goals || [],
      full_name: initialData.full_name,
    },
    mode: "onSubmit",
  });

  const {
    data: categories = [],
    isLoading: isFetchingCategories,
    isError: isCategoryError,
    error: categoryError,
    refetch: refetchCategories,
  } = useGetMealCategories();

  const measurementStandard = watch("measurement_standard");
  useEffect(() => {
    if (userreferralLink) {
      setreferralLink(userreferralLink?.data?.referralLink);
      setconfiguration(userreferralLink?.data?.configuration);
    }
  }, [userreferralLink]);

  useEffect(() => {
    if (data?.data) {
      const raw = data.data;
      setImageURL(data?.data?.profile_image);
      const userData = {
        full_name: raw.full_name || "",
        phone_number: raw.phone_number || "",
        email: raw.email || "",
        gender: raw.gender === 1 ? "Male" : "Female",
        weight: raw.weight || "",
        birth_date: raw.birth_date ? dayjs(raw.birth_date) : null,
        measurement_standard: {
          value: raw.measurement_standard || "",
          label: raw.measurement_standard || "",
        },
        average_activity_level: raw.average_activity_level || "",
        meals_eaten_per_day: raw.meals_eaten_per_day || "",
        meal_plan_preferences:
          raw.meal_plan_preferences?.map(
            (item) => item.meal_plan_category.id
          ) || [],

        fitness_goals:
          raw.fitness_goals?.map((item) => item.fitness_goals) || [],

        is_access_granted: raw.is_access_granted || false,
        track_my_progress: raw.track_my_progress || false,
        self_service_plan: raw.self_service_plan || false,
      };

      // Height conversion
      if (raw.measurement_standard === "Metric") {
        userData.height = raw.height?.toString() || "";
      } else if (raw.measurement_standard === "US Standard") {
        const feet = Math.floor(raw.height / 12);
        const inch = raw.height % 12;
        userData.feet = feet.toString();
        userData.inch = inch.toString();
      }

      // Set image URL if available
      if (raw.avatar_path) {
        setImageURL(raw.avatar_path);
      }

      reset(userData); // set values in form
      setInitialData(userData); // store original for cancel
    }
  }, [data, reset]);

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

  let displayReferralLink = referralLink || "";
  if (referralLink && isCustomer) {
    const [base, query] = referralLink.split("?");
    const cleanedBase = base.replace(
      Routes.register,
      Routes.customersubscriptions
    );

    displayReferralLink = `${cleanedBase}?${query}`;
  } else if (referralLink && isTrainer) {
    const [base, query] = referralLink.split("?");
    const cleanedBase = base.replace(Routes.register, Routes.subscriptions);

    displayReferralLink = `${cleanedBase}?${query}`;
  }
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayReferralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  const onSubmit = (data) => {
    const height =
      measurementStandard?.value === "US Standard"
        ? Number(data.feet) * 12 + Number(data.inch)
        : data.height;

    const formdata = new FormData();
    formdata.append("full_name", data.full_name);
    formdata.append("phone_number", data.phone_number);
    formdata.append("email", data.email);
    formdata.append("height", height);
    formdata.append("weight", data.weight);
    formdata.append("birth_date", dayjs(data.birth_date).format("YYYY-MM-DD"));
    formdata.append("gender", data.gender);
    formdata.append("measurement_standard", data.measurement_standard.value);
    formdata.append("average_activity_level", data.average_activity_level);
    formdata.append("meals_eaten_per_day", data.meals_eaten_per_day);
    data.meal_plan_preferences.forEach((id) => {
      formdata.append("meal_plan_preferences[]", id);
    });

    data.fitness_goals.forEach((goal) => {
      formdata.append("fitness_goals[]", goal);
    });

    formdata.append("is_access_granted", data.is_access_granted);
    formdata.append("track_my_progress", data.track_my_progress);
    formdata.append("self_service_plan", data.self_service_plan);
    if (selectedFile) {
      formdata.append("profile_image", selectedFile);
    }
    editcustomerprofile(formdata, {
      onSuccess: (data) => {
        successNotification(data?.message);
        setEditMode(false);
      },
      onError: (error) => {
        errorNotification(error?.response?.data?.message);
      },
    });
  };

  const toggleEditMode = () => {
    if (editMode) {
      reset(initialData);
    }
    setEditMode(!editMode);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const handleEdit = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (data?.data) {
      const raw = data.data;

      // Meal Plan Preferences
      if (raw.meal_plan_preferences) {
        const preferences = raw.meal_plan_preferences.map(
          (item) => item.meal_plan_category.id
        );
        setValue("meal_plan_preferences", preferences);
      }

      // Fitness Goals
      if (raw.fitness_goals) {
        const goals =
          raw.fitness_goals?.map((item) =>
            typeof item === "string" ? item : item.fitness_goals
          ) || [];
        setValue("fitness_goals", goals);
      }
    }
  }, [data, setValue]);

  return (
    <div className="p-2 h-full w-full flex flex-1 overflow-auto">
      <div className="flex flex-col flex-1 border rounded-lg bg-white p-2 h-full overflow-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-b my-2">
            <div className="flex justify-between items-center mb-4 gap-3">
              <div className="flex justify-between items-center gap-3 w-full max-w-[1050px]">
                {/* Profile Image */}
                {role === "customer" && (
                  <div className="relative inline-block">
                    <input
                      type="file"
                      disabled={!editMode}
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef} // ✅ ref only here
                      className="hidden"
                    />

                    {/* Image Container */}
                    <div
                      className={`border rounded-full overflow-hidden cursor-pointer ${
                        imageURL ? "h-[114px] w-[114px]" : "h-[140px] w-[140px]"
                      } relative`} // relative for absolute positioning
                      onClick={() => fileInputRef.current.click()}
                    >
                      <Image
                        src={imageURL || avatarImage}
                        alt="user-profile"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>

                    {/* Edit Icon floating outside top-right */}
                    <div
                      className="absolute top-1 right-2 bg-[#16a34a] border rounded-full w-7 h-7 shadow-md flex items-center justify-center cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current.click();
                      }}
                    >
                      <EditIcon className="text-white text-[18px]" />
                    </div>
                  </div>
                )}

                {/* Edit Button */}
                <div className="flex flex-col items-center h-full justify-center">
                  <Button
                    type="button"
                    variant="contained"
                    size="small"
                    sx={{ height: "30px", textTransform: "none", gap: 1 }}
                    onClick={toggleEditMode}
                  >
                    {editMode ? (
                      "Cancel Edit"
                    ) : (
                      <>
                        <EditIcon className="text-white text-[20px]" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                {isFetching ? (
                  <div className="flex flex-col justify-end">
                    {/* <div className="rounded-2xl shadow-none bg-white border border-gray-200 p-2 flex flex-col max-w-md w-full md:w-auto animate-pulse">
                      <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
                        <div className="h-10 w-20 bg-gray-300 rounded-lg"></div>
                      </div>
                    </div> */}
                  </div>
                ) : (
                  <div className="flex flex-col justify-end">
                    <Card className="rounded-2xl shadow-none bg-white border border-gray-200 p-2 flex flex-col max-w-md w-full md:w-auto">
                      <div className=" flex justify-between align-middle">
                        <h2 className="text-xl font-semibold text-gray-800">
                          Invite & Earn
                        </h2>
                        <button
                          type="button"
                          onClick={() => {
                            handleOpenDialogBox();
                          }}
                          className=" border  px-2 py-1 rounded-lg text-sm hover:bg-emerald-600 hover:text-white "
                        >
                          Learn How
                        </button>
                      </div>

                      {/* <p className="text-sm text-gray-600 mt-1">
                        Invite your friends and they’ll get{" "}
                        <span className="text-green-600 font-bold">$5</span>{" "}
                        when they sign up.
                      </p> */}
                      {/* <p className="text-sm text-gray-600 mt-1">
                        Invite your friends and you’ll get{" "}
                        <span className="text-green-600 font-bold">
                          $
                          {isCustomer
                            ? configuration?.referral_customer_reward ?? 0
                            : isTrainer
                            ? configuration?.referral_trainer_reward ?? 0
                            : 0}
                        </span>{" "}
                        {isCustomer
                          ? "as a customer"
                          : isTrainer
                          ? "as a trainer"
                          : ""}{" "}
                        when they sign up.
                      </p> */}

                      <p className="text-sm text-gray-600 mt-1">
                        Invite your friends{" "}
                        {isCustomer
                          ? "as a customer "
                          : isTrainer
                          ? "as a trainer "
                          : ""}
                        and you will get{" "}
                        <span className="text-green-600 font-bold">
                          $
                          {isCustomer
                            ? configuration?.referral_customer_reward ?? 0
                            : isTrainer
                            ? configuration?.referral_trainer_reward ?? 0
                            : 0}
                        </span>{" "}
                        when they sign up.
                      </p>

                      <div className="mt-3 flex space-x-6">
                        <label className="flex items-center space-x-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={isCustomer}
                            onChange={() => {
                              setIsCustomer(!isCustomer);
                              if (!isCustomer) setIsTrainer(false);
                            }}
                            className="accent-green-600 text-white"
                          />
                          <span>Customer</span>
                        </label>

                        <label className="flex items-center space-x-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={isTrainer}
                            onChange={() => {
                              setIsTrainer(!isTrainer);
                              if (!isTrainer) setIsCustomer(false);
                            }}
                            className="accent-green-600 text-white"
                          />
                          <span>Trainer</span>
                        </label>
                      </div>
                      <div className="mt-4 flex items-center space-x-2">
                        <input
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm"
                          // value={referralLink}
                          value={displayReferralLink}
                          readOnly
                        />
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm"
                        >
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className=" flex-1 overflow-auto flex gap-1 flex-col">
            <div className="border-b p-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                <div>
                  <label className="input-label">Full Name</label>
                  <CustomTextField
                    type="text"
                    disabled={!editMode}
                    id="userFullName"
                    className="input-text bg-transparent appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-green-600"
                    placeholder="Enter your full name"
                    {...register("full_name", {
                      required: "This field is required",
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="full_name"
                    render={({ message }) => (
                      <p className="errorMessage">{message}</p>
                    )}
                  />
                </div>
                <div>
                  <label className="input-label">Phone Number</label>
                  <CustomTextField
                    type="text"
                    disabled={!editMode}
                    className="input-text bg-transparent appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-green-600"
                    placeholder="Enter your phone number"
                    {...register("phone_number", {
                      required: "This field is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter a valid 10-digit phone number",
                      },
                    })}
                    onInput={(event) => {
                      event.target.value = event.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                    }}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="phone_number"
                    render={({ message }) => (
                      <p className="errorMessage">{message}</p>
                    )}
                  />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <CustomTextField
                    type="text"
                    disabled
                    id="userEmail"
                    className="input-text appearance-none border rounded-lg w-full py-3 px-3 text-gray-400 bg-gray-100 cursor-not-allowed focus:outline-none"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "This field is required",
                      pattern: {
                        value: /^[^@]+@[^@]+\.[^@]+$/,
                        message: "Enter valid email name",
                      },
                    })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="email"
                    render={({ message }) => (
                      <p className="errorMessage">{message}</p>
                    )}
                  />
                </div>

                <div>
                  <label className="input-label">Birth Date</label>
                  <CommonDatePicker
                    name="birth_date"
                    control={control}
                    errors={errors}
                    // format={"YYYY-MM-DD"}
                    format={"MM-DD-YYYY"}
                    value={watch("birth_date")}
                    disabled={!editMode}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="birth_date"
                    render={({ message }) => (
                      <p className="errorMessage">{message}</p>
                    )}
                  />
                </div>
                <div>
                  <label className="input-label">Gender</label>
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue={null}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <RadioGroup {...field} row sx={{ marginLeft: "4px" }}>
                        <FormControlLabel
                          value="Male"
                          control={<Radio size="small" disabled={!editMode} />}
                          label="Male"
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
                        <FormControlLabel
                          value="Female"
                          control={<Radio size="small" disabled={!editMode} />}
                          label="Female"
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
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-2">
                <div>
                  <CommonSelect
                    name="measurement_standard"
                    label="Measurement Standard"
                    control={control}
                    options={measurementStandardOption}
                    isRequired
                    placeholder="Select Standard"
                    disabled={!editMode}
                  />

                  <ErrorMessage
                    errors={errors}
                    name="measurement_standard"
                    render={({ message }) => (
                      <p className="errorMessage">{message}</p>
                    )}
                  />
                </div>
                <div className="relative">
                  <label className="input-label">Height</label>
                  {measurementStandard?.value === "US Standard" ? (
                    <div className="flex items-between gap-3">
                      <div className="relative w-[49%]">
                        <CustomTextField
                          type="text"
                          disabled={!editMode}
                          className="input-text focus:outline-none focus:shadow-outline  hover:border-green-600"
                          {...register("feet", {
                            required: "This field is required",
                            min: {
                              value: 1,
                              message: "value must be at least 1",
                            },
                            max: {
                              value: 12,
                              message: "maximum value must be less than 12",
                            },
                            pattern: {
                              value: /^\d*\.?\d*$/,
                              message: "Please enter a valid number",
                            },
                          })}
                          onInput={(event) => {
                            event.target.value = event.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                        />
                        <div className="absolute top-[11px] right-[14px] text-slate-400">
                          {measurementStandard?.value === "US Standard" && "ft"}
                        </div>
                        <ErrorMessage
                          errors={errors}
                          name="feet"
                          render={({ message }) => (
                            <p className="errorMessage">{message}</p>
                          )}
                        />
                      </div>
                      <div className="relative w-[49%]">
                        <CustomTextField
                          type="text"
                          disabled={!editMode}
                          className="input-text focus:outline-none focus:shadow-outline  hover:border-green-600"
                          {...register("inch", {
                            required: "This field is required",

                            max: {
                              value: 12,
                              message: "maximum value must be less than 12",
                            },
                            pattern: {
                              value: /^\d*\.?\d*$/,
                              message: "Please enter a valid number",
                            },
                          })}
                          onInput={(event) => {
                            event.target.value = event.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                        />

                        <div className="absolute top-[11px] right-[14px] text-slate-400  ">
                          {measurementStandard?.value === "US Standard" &&
                            "inch"}
                        </div>
                        <ErrorMessage
                          errors={errors}
                          name="inch"
                          render={({ message }) => (
                            <p className="errorMessage">{message}</p>
                          )}
                          onInput={(event) => {
                            event.target.value = event.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <CustomTextField
                        type="text"
                        disabled={!editMode}
                        className="input-text bg-transparent appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-green-600"
                        placeholder="Enter your height"
                        {...register("height", {
                          required: "This field is required",
                          min: {
                            value: 1,
                            message: "value must be at least 1",
                          },
                          pattern: {
                            value: /^\d*\.?\d*$/,
                            message: "Please enter a valid number",
                          },
                        })}
                        onInput={(event) => {
                          event.target.value = event.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                        }}
                      />
                      <div className="absolute top-[38px] right-[14px] text-slate-400">
                        {measurementStandard?.value === "Metric" && "cm"}
                      </div>
                      <ErrorMessage
                        errors={errors}
                        name="height"
                        render={({ message }) => (
                          <p className="errorMessage">{message}</p>
                        )}
                      />
                    </>
                  )}
                </div>
                <div className="relative">
                  <label className="input-label">Weight</label>
                  <CustomTextField
                    type="text"
                    disabled={!editMode}
                    className="input-text bg-transparent appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline hover:border-green-600"
                    placeholder="Enter your weight"
                    {...register("weight", {
                      required: "This field is required",
                      min: {
                        value: 1,
                        message: "value must be at least 1",
                      },
                      pattern: {
                        value: /^\d*\.?\d*$/,
                        message: "Please enter a valid number",
                      },
                    })}
                    onInput={(event) => {
                      event.target.value = event.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                    }}
                  />
                  <div className="absolute top-[38px] right-[14px] text-slate-400">
                    {measurementStandard?.value === "Metric" && "kg"}
                    {measurementStandard?.value === "US Standard" && "lbs"}
                  </div>
                  <ErrorMessage
                    errors={errors}
                    name="weight"
                    render={({ message }) => (
                      <p className="errorMessage">{message}</p>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="border-b my-1">
              <div className="p-1 grid grid-cols-1">
                <div className="mb-4">
                  <label className="input-label">Average Activity Level*</label>
                  <Controller
                    name="average_activity_level"
                    control={control}
                    defaultValue={null}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <RadioGroup {...field} row sx={{ marginLeft: "4px" }}>
                        {averageActivityLevelOptions?.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value || null}
                            control={
                              <Radio size="small" disabled={!editMode} />
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
                      </RadioGroup>
                    )}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="average_activity_level"
                    render={({ message }) => (
                      <p className="errorMessage">{message}</p>
                    )}
                  />
                </div>

                <div className="mb-4">
                  <label className="input-label">Meals Eaten Per Day</label>
                  <Controller
                    name="meals_eaten_per_day"
                    control={control}
                    defaultValue={null}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        row
                        sx={{ marginLeft: "4px" }}
                        disabled={!editMode}
                      >
                        {mealsEatenPerDayOptions?.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value || null}
                            control={
                              <Radio size="small" disabled={!editMode} />
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
                      </RadioGroup>
                    )}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="meals_eaten_per_day"
                    render={({ message }) => (
                      <p className="errorMessage">{message}</p>
                    )}
                  />
                </div>

                {/* <div className="mb-4">
                  <label className="input-label">Meal Plan Preferences</label>
                  <Controller
                    name="meal_plan_preferences"
                    control={control}
                    defaultValue={[]}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <FormGroup row sx={{ marginLeft: "4px" }}>
                        {mealPlanPreferencesOption?.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            control={
                              <Checkbox
                                size="small"
                                checked={field.value?.includes(option.value)}
                                onChange={(e) => {
                                  const updatedValue = e.target.checked
                                    ? [...(field.value || []), option.value]
                                    : field.value?.filter(
                                        (value) => value !== option.value
                                      );
                                  field.onChange(updatedValue);
                                }}
                                disabled={!editMode}
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
                    name="meal_plan_preferences"
                    render={({ message }) => (
                      <p className="errorMessage">{message}</p>
                    )}
                  />
                </div> */}

                <div className="mb-4">
                  <label className="input-label">Fitness Goals</label>
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
                                checked={field.value?.includes(option.value)}
                                onChange={(e) => {
                                  const updatedValue = e.target.checked
                                    ? [...(field.value || []), option.value]
                                    : field.value?.filter(
                                        (value) => value !== option.value
                                      );
                                  field.onChange(updatedValue);
                                }}
                                disabled={!editMode}
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
                      <p className="errorMessage">{message}</p>
                    )}
                  />
                </div>

                {/* <div className="mb-4">
                  <label className="input-label">Fitness Goals</label>
                  <Controller
                    name="fitness_goals"
                    control={control}
                    defaultValue={null}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <RadioGroup {...field} row sx={{ marginLeft: "4px" }}>
                        {fitnessGoalOptions?.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value || null}
                            control={
                              <Radio size="small" disabled={!editMode} />
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
                      </RadioGroup>
                    )}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="fitness_goals"
                    render={({ message }) => (
                      <p className="errorMessage">{message}</p>
                    )}
                  />
                </div> */}

                {/* <div className="mb-4">
                  <label className="input-label">Access Granted</label>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3 flex-wrap">
                      <Controller
                        name="track_my_progress"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                          <FormGroup row sx={{ marginLeft: "4px" }}>
                            <FormControlLabel
                              control={
                                <IOSSwitch
                                  sx={{ m: 1 }}
                                  {...field}
                                  checked={field.value}
                                  onChange={(e) =>
                                    handleSwitchChange(
                                      "track_my_progress",
                                      e.target.checked
                                    )
                                  }
                                  disabled={!editMode}
                                />
                              }
                              label="Track My Progress"
                            />
                          </FormGroup>
                        )}
                      />

                      <Controller
                        name="self_service_plan"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                          <FormGroup row sx={{ marginLeft: "4px" }}>
                            <FormControlLabel
                              control={
                                <IOSSwitch
                                  sx={{ m: 1 }}
                                  {...field}
                                  checked={field.value}
                                  onChange={(e) =>
                                    handleSwitchChange(
                                      "self_service_plan",
                                      e.target.checked
                                    )
                                  }
                                  disabled={!editMode}
                                />
                              }
                              label="Self Service Plan"
                            />
                          </FormGroup>
                        )}
                      />

                      <Controller
                        name="is_access_granted"
                        control={control}
                        defaultValue={true}
                        render={({ field }) => (
                          <FormGroup row sx={{ marginLeft: "4px" }}>
                            <FormControlLabel
                              control={
                                <IOSSwitch
                                  sx={{ m: 1 }}
                                  {...field}
                                  checked={field.value}
                                  onChange={(e) =>
                                    handleSwitchChange(
                                      "is_access_granted",
                                      e.target.checked
                                    )
                                  }
                                  disabled={!editMode}
                                />
                              }
                              label="None"
                            />
                          </FormGroup>
                        )}
                      />
                    </div>

                    {editMode && (
                      <button
                        type="submit"
                        className="btn btn-primary px-5 ml-auto flex items-center"
                      >
                        Save
                        {editcustomerprofile.isPending && (
                          <CircularProgress
                            size={18}
                            sx={{ color: "white", marginLeft: "10px" }}
                          />
                        )}
                      </button>
                    )}
                  </div>
                </div> */}

                {/* <div className="mb-3 flex items-start gap-6"> */}
                {/* Meal Plan Preferences */}
                <div className="mb-3">
                  <label className="input-label">Meal Plan Preferences</label>
                  {/* <Controller
                    name="meal_plan_preferences"
                    control={control}
                    defaultValue={[]}
                    rules={{ required: "This field is required" }}
                    render={({ field }) => (
                      <CustomAutoComplete
                        multiple
                        options={mealPlanPreferencesOption || []}
                        getOptionLabel={(option) => option.label}
                        value={
                          mealPlanPreferencesOption?.filter((opt) =>
                            field.value?.includes(opt.value)
                          ) || []
                        }
                        onChange={(_, selectedOptions) => {
                          // map back to just the values for storing in form
                          field.onChange(
                            selectedOptions.map((opt) => opt.value)
                          );
                        }}
                        renderInputLabel="Select Preferences"
                        disablePortal
                      
                        sx={{
                          "& .MuiAutocomplete-root": {
                            minWidth: 250, // 👈 apply min-width to Autocomplete root
                          },
                        }}
                      />
                    )}
                  /> */}

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
                                .map((id) => {
                                  const cat = categories?.find(
                                    (c) => c.id === id
                                  );
                                  return cat
                                    ? { value: cat.id, label: cat.name }
                                    : null;
                                })
                                .filter(Boolean)
                            : []
                        }
                        onChange={(_, selectedOptions) => {
                          field.onChange(
                            selectedOptions.map((opt) => opt.value)
                          );
                        }}
                        renderInputLabel="Select Preferences"
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        disabled={!editMode}
                      />
                    )}
                  />

                  <ErrorMessage
                    errors={errors}
                    name="meal_plan_preferences"
                    render={({ message }) => (
                      <p className="errorMessage">{message}</p>
                    )}
                  />
                </div>

                {/* Access Granted */}
                <div className="flex-1">
                  <label className="input-label">Access Granted</label>
                  <div className="flex items-center gap-3">
                    <Controller
                      name="track_my_progress"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <FormGroup row sx={{ marginLeft: "4px" }}>
                          <FormControlLabel
                            control={
                              <IOSSwitch
                                sx={{ m: 1 }}
                                {...field}
                                checked={field.value}
                                onChange={(e) =>
                                  handleSwitchChange(
                                    "track_my_progress",
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label="Track My Progress"
                          />
                        </FormGroup>
                      )}
                      disabled={!editMode}
                    />
                    <Controller
                      name="self_service_plan"
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <FormGroup row sx={{ marginLeft: "4px" }}>
                          <FormControlLabel
                            control={
                              <IOSSwitch
                                sx={{ m: 1 }}
                                {...field}
                                checked={field.value}
                                onChange={(e) =>
                                  handleSwitchChange(
                                    "self_service_plan",
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label="Self Service Plan"
                          />
                        </FormGroup>
                      )}
                      disabled={!editMode}
                    />
                    <Controller
                      name="is_access_granted"
                      control={control}
                      defaultValue={true}
                      render={({ field }) => (
                        <FormGroup row sx={{ marginLeft: "4px" }}>
                          <FormControlLabel
                            control={
                              <IOSSwitch
                                sx={{ m: 1 }}
                                {...field}
                                checked={field.value}
                                onChange={(e) =>
                                  handleSwitchChange(
                                    "is_access_granted",
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label="None"
                          />
                        </FormGroup>
                      )}
                      disabled={!editMode}
                    />
                  </div>
                </div>
                {editMode && (
                  <button
                    type="submit"
                    className="btn btn-primary px-5 ml-auto flex items-center"
                  >
                    Save
                    {editcustomerprofile.isPending && (
                      <CircularProgress
                        size={18}
                        sx={{ color: "white", marginLeft: "10px" }}
                      />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* </div> */}
        </form>
      </div>

      <CommonDialogBox
        open={openDialog}
        handleClose={handleCloseDialogBox}
        title="Learn How"
        width={"900px"}
        content={
          <AffiliateProgramPage handleCloseDialogBox={handleCloseDialogBox} />
        }
        // width="sm"
      />
    </div>
  );
};

export default CustomerProfile;
