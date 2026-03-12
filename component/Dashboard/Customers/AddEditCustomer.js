"use client";

import { IOSSwitch } from "@/app/ThemeRegistry";
import CommonDatePicker, {
  BirthDatePicker,
} from "@/component/CommonDatePicker";
import CommonSelect from "@/component/CommonSelect";
import {
  averageActivityLevelOptions,
  fitnessGoalOptions,
  mealPlanPreferencesOption,
  mealsEatenPerDayOptions,
  measurementStandardOption,
} from "@/constants/addUpdateCustomer";
// import {
//   useAddCustomerDetailMutation,
//   useEditCustomerDetailMutation,
// } from "@/helpers/hooks/customer/addEditCustomer";
import { useGetMamAdmins } from "@/helpers/hooks/mamAdmin/mamAdmin";
import { useGetTrainers } from "@/helpers/hooks/mamAdmin/trainerList";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { errorNotification, successNotification } from "@/helpers/notification";
import { ErrorMessage } from "@hookform/error-message";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import deleteIcon from "../../../public/images/dlt-btn-with-bg.png";
import inviteIcon from "../../../public/images/invite-btn-with-bg.png";
import userUploadImage from "../../../public/images/upload-user-photo.png";
import { addCustomerBySuperadmin } from "@/helpers/hooks/customer/addcustomerbysuperadmin";
import { useRouter } from "next/navigation";
import { addCustomerByadmin } from "@/helpers/hooks/customer/addcustomerbyadmin";
import { addCustomerBytrainer } from "@/helpers/hooks/customer/addcustomerbytrainer";
import { updateCustomerBySuperadmin } from "@/helpers/hooks/customer/updatecustomerbysuperadmin";
import { Routes } from "@/config/routes";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { updateCustomerByadmin } from "@/helpers/hooks/customer/updatecustomerbyadmin";
import { updateCustomerBytrainer } from "@/helpers/hooks/customer/updatecustomerbytrainer";
import UserFormSkeleton from "@/component/CommonComponents/UserFromSkeleton";
import { useGetdropdownadmintrainerlist } from "@/helpers/hooks/mamAdmin/dropdownadmintrainerlist";
import CommonLoader from "@/component/CommonLoader";
import CustomAutoComplete from "@/component/CommonComponents/CustomAutoComplete";
import { useGetMealCategories } from "@/helpers/hooks/mamAdmin/mealCategoriesList";
import CustomTextField from "@/component/CommonComponents/CustomTextField";

export default function AddEditCustomer({
  userData,
  customerId,
  action,
  storeediteData,
  loading,
}) {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const {
    data: categories = [],
    isLoading: isFetchingCategories,
    isError: isCategoryError,
    error: categoryError,
    refetch: refetchCategories,
  } = useGetMealCategories();
  console.log("categories", categories);
  // const [saving, setSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New State
  const { mutate: addcustomerbysuperadmin } = addCustomerBySuperadmin();
  const { mutate: addcustomerbyadmin } = addCustomerByadmin();
  const { mutate: addcustomerbytrainer } = addCustomerBytrainer();
  const { mutate: updatecustomerbysuperadmin } = updateCustomerBySuperadmin();
  const { mutate: updateCustomerbyadmin } = updateCustomerByadmin();
  const { mutate: updateCustomerbytrainer } = updateCustomerBytrainer();
  const [editestoreId, seteditestoreId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState(userData?.avatar_path);
  const fileInputRef = useRef(null);
  const role = getLocalStorageItem("role");
  const page = 1;
  const [loginIdvalue, setloginIdvalue] = useState(null);
  const [adminIdvalue, setadminIdvalue] = useState(null);
  const [trainerIdvalue, setTrainerIdvalue] = useState(null);
  const [changeTrainer, setChangeTrainer] = useState(false);
  const today = dayjs();
  // const addCustomer = useAddCustomerDetailMutation();
  // const updateCustomer = useEditCustomerDetailMutation();

  useEffect(() => {
    setloginIdvalue(localStorage.getItem("loginId"));
    setadminIdvalue(localStorage.getItem("adminId"));
    setTrainerIdvalue(localStorage.getItem("trainerId"));
  }, []);
  // useEffect(() => {
  //  if(storeediteData){
  //   seteditestoreId(storeediteData.id)
  //   setValue("full_name",storeediteData?.full_name)
  //   setValue("email",storeediteData?.email)
  //   setValue("phone_number",storeediteData?.phone_number.toString())
  //  }
  // }, [storeediteData])
  useEffect(() => {
    if (storeediteData) {
      seteditestoreId(storeediteData.id);
      setValue("full_name", storeediteData.full_name || "");
      setValue("email", storeediteData.email || "");
      setValue("phone_number", storeediteData.phone_number?.toString() || "");
      // setValue("birth_date", dayjs(storeediteData.birth_date).format("YYYY-MM-DD"));
      // setValue("birth_date", storeediteData.birth_date ? dayjs(storeediteData.birth_date).toDate() : null);
      setValue(
        "birth_date",
        storeediteData?.birth_date ? dayjs(storeediteData?.birth_date) : null
      );
      setValue("gender", storeediteData.gender || "");
      setValue(
        "measurement_standard",
        measurementStandardOption.find(
          (opt) => opt.value === storeediteData.measurement_standard
        ) || null
      );

      if (storeediteData.measurement_standard === "Metric") {
        setValue("height", storeediteData.height?.toString() || "");
      } else if (storeediteData.measurement_standard === "US Standard") {
        const feet = Math.floor(storeediteData.height / 12);
        const inch = storeediteData.height % 12;
        setValue("feet", feet.toString());
        setValue("inch", inch.toString());
      }

      setValue("weight", storeediteData.weight?.toString() || "");
      setValue(
        "average_activity_level",
        storeediteData.average_activity_level || ""
      );
      setValue(
        "meals_eaten_per_day",
        storeediteData.meals_eaten_per_day?.toString() || ""
      );
      // setValue("fitness_goals", storeediteData.fitness_goals || "");
      setValue(
        "fitness_goals",
        storeediteData.fitness_goals?.map((item) => item.fitness_goals) || []
      );
      setValue(
        "meal_plan_preferences",
        storeediteData.meal_plan_preferences?.map(
          (item) => item.meal_plan_category.id
        ) || []
      );

      setValue("is_access_granted", storeediteData.is_access_granted || false);
      setValue("track_my_progress", storeediteData.track_my_progress || false);
      setValue("self_service_plan", storeediteData.self_service_plan || false);
      //    const trainerOption = trainerListOptions.find(
      //   (trainer) => trainer.value === storeediteData.trainer_id
      // );
      // if (trainerOption) {
      //   setValue("trainer_id", trainerOption);
      // }
    }
  }, [storeediteData]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    resetField,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    // mode: "onSubmit",
  });

  const measurementStandard = watch("measurement_standard");
  const adminId = watch("admin_id");
  const assignToSelf = watch("assign_to_self");
  const selectedTrainer = watch("trainer_id");
  // const adminIdaccordingRole =
  //   role === "super_admin" ? adminIdvalue : loginIdvalue;
  // const {
  //   data: gettrainersList,
  //   isFetching: gettrainerfetching,
  //   refetch: gettrainerrefetch,
  // } = useGetdropdownadmintrainerlist(adminIdaccordingRole);
  // const {
  //   data: gettrainersList,
  //   isFetching: gettrainerfetching,
  //   refetch: gettrainerrefetch,
  // } = useGetdropdownadmintrainerlist(adminIdvalue);

  // const trainerListOptions = useMemo(() => {
  //   if (!gettrainersList?.data) return [];
  //   return gettrainersList?.data.map((trainer) => ({
  //     label: trainer?.full_name,
  //     value: trainer?.id,
  //   }));
  // }, [gettrainersList]);
  // useEffect(() => {
  //   if (storeediteData && trainerListOptions.length > 0) {
  //     const trainerOption = trainerListOptions.find(
  //       (trainer) => trainer.value === storeediteData.trainer_id
  //     );
  //     if (trainerOption) {
  //       setValue("trainer_id", trainerOption);
  //     }
  //   }
  // }, [storeediteData, trainerListOptions, setValue]);

  // const filteredTrainerList = useMemo(() => {
  //   if (changeTrainer) return trainerListOptions;

  //   return trainerListOptions.filter(
  //     (trainer) => trainer.value === storeediteData?.trainer_id
  //   );
  // }, [changeTrainer, trainerListOptions, storeediteData?.trainer_id]);

  useEffect(() => {
    resetField("trainer_id");
  }, [adminId, resetField]);

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
    if (userData) {
      if (userData?.avatar_path) {
        setValue("avatar", userData?.avatar_path);
      }
      setValue("full_name", userData?.first_name || "");
      setValue("gender", userData?.gender);
    }
  }, [userData, setValue]);
  const passTrainerIdPayload = selectedTrainer
    ? selectedTrainer?.value || null
    : trainerIdvalue;
  const passTrainerId = !selectedTrainer ? "" : passTrainerIdPayload;
  const onSubmit = (data) => {
    setIsSubmitting(true);
    const height =
      measurementStandard?.value === "US Standard"
        ? Number(data.feet) * 12 + Number(data.inch)
        : data.height;

    const userData = {
      // admin_id: data.admin_id.value,
      // trainer_id: assignToSelf ? null : data.trainer_id.value,
      admin_id: adminIdvalue,
      trainer_id: trainerIdvalue || selectedTrainer?.value,
      //  trainer_id: selectedTrainer?.value || null,
      //  trainer_id: selectedTrainer?.value || trainerIdvalue || null,
      // customer_id: customerId,
      full_name: data.full_name,
      email: data.email.toLowerCase(),
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
    };

    if (action === "add-customer-by-admin") {
      if (role === "super_admin") {
        addcustomerbysuperadmin(userData, {
          onSuccess: (data) => {
            successNotification(data?.message);
            reset();
            router.back();
            setIsSubmitting(false);
            setValue("trainer_id", null);
          },
          onError: (error) => {
            errorNotification(error?.response?.data?.message);
            setIsSubmitting(false);
          },
        });
      } else if (role === "admin") {
        delete userData.admin_id;
        addcustomerbyadmin(userData, {
          onSuccess: (data) => {
            successNotification(data?.message);
            reset();
            router.back();
            setValue("trainer_id", null);
            setIsSubmitting(false);
          },
          onError: (error) => {
            errorNotification(error?.response?.data?.message);
            setIsSubmitting(false);
          },
        });
      } else if (role === "trainer") {
        delete userData.admin_id;
        delete userData.trainer_id;
        addcustomerbytrainer(userData, {
          onSuccess: (data) => {
            successNotification(data?.message);
            reset();
            router.back();
            setValue("trainer_id", null);
            setIsSubmitting(false);
          },
          onError: (error) => {
            errorNotification(error?.response?.data?.message);
            setIsSubmitting(false);
          },
        });
      }
    } else if (action === "edite-customer-by-superadmin") {
      if (role === "super_admin") {
        userData.customer_id = editestoreId;
        updatecustomerbysuperadmin(userData, {
          onSuccess: (data) => {
            showSnackbar(data?.message, "success");
            router.back();
            reset();
            setValue("trainer_id", null);
            setIsSubmitting(false);
          },
          onError: (error) => {
            showSnackbar(error?.response?.data?.message, "error");
            setIsSubmitting(false);
          },
        });
      } else if (role === "admin") {
        userData.customer_id = editestoreId;
        updateCustomerbyadmin(userData, {
          onSuccess: (data) => {
            showSnackbar(data?.message, "success");
            router.back();
            reset();
            setValue("trainer_id", null);
            setIsSubmitting(false);
          },
          onError: (error) => {
            showSnackbar(error?.response?.data?.message, "error");
            setIsSubmitting(false);
          },
        });
      } else if (role === "trainer") {
        userData.customer_id = editestoreId;
        updateCustomerbytrainer(userData, {
          onSuccess: (data) => {
            showSnackbar(data?.message, "success");
            router.back();
            reset();
            setValue("trainer_id", null);
            setIsSubmitting(false);
          },
          onError: (error) => {
            showSnackbar(error?.response?.data?.message, "error");
            setIsSubmitting(false);
          },
        });
      }
    }

    // if(action === "add-customer-by-admin"){

    //  }

    const formdata = new FormData();
    formdata.append("admin_id", adminIdvalue);
    formdata.append("trainer_id", trainerIdvalue);
    // formdata.append("customer_id", customerId);
    formdata.append("full_name", data.full_name);
    formdata.append("email", data.email.toLowerCase());
    formdata.append("height", height);
    formdata.append("weight", data.weight);
    formdata.append("birth_date", dayjs(data.birth_date).format("YYYY-MM-DD"));
    formdata.append("gender", data.gender);
    formdata.append("phone_number", data.phone_number);
    formdata.append("measurement_standard", data.measurement_standard.value);
    formdata.append("average_activity_level", data.average_activity_level);
    formdata.append("meals_eaten_per_day", data.meals_eaten_per_day);
    formdata.append("fitness_goals", data.fitness_goals);
    formdata.append("meal_plan_preferences", data.meal_plan_preferences);
    formdata.append("is_access_granted", data.is_access_granted);
    formdata.append("track_my_progress", data.track_my_progress);
    formdata.append("self_service_plan", data.self_service_plan);

    if (selectedFile) {
      formdata.append("profile_image", selectedFile);
    }

    // addCustomer.mutate(userData, {
    //   onSuccess: (data) => {
    //     successNotification(data?.message);
    //   },
    //   onError: (data) => {
    //     errorNotification(data?.response?.data?.message);
    //   },
    // });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageURL(URL.createObjectURL(file));
    }
  };

  const handleEditImage = () => {
    fileInputRef.current.click();
  };

  const handleDelete = () => {
    setValue("avatar", null, { shouldValidate: true, shouldDirty: true });
    setImageURL(null);
    trigger("avatar");
  };
  // if(isSubmitting){
  //   return <CommonLoader/>
  // }
  return (
    <div className="p-4 border rounded-lg flex flex-1 flex-col overflow-auto">
      {loading ? (
        // <UserFormSkeleton />
        <CommonLoader />
      ) : (
        <form
          className="flex flex-1 flex-col overflow-auto"
          onSubmit={handleSubmit(onSubmit)}
        >
          {role === "customer" && (
            <div className="border-b mb-8">
              <div className="flex justify-between items-center mb-8">
                <div className="flex justify-start gap-3">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    {imageURL ? (
                      <div
                        onClick={handleEditImage}
                        className="h-[114px] w-[114px] "
                      >
                        <Image
                          width={114}
                          height={114}
                          src={imageURL}
                          alt="Customer-profile"
                          className="h-full w-full object-cover"
                        />
                        {/* <button type="button" onClick={handleEdit}>
                      <Image src={editIcon} alt="edit-icon" />
                    </button> */}
                        {/* <button type="button" onClick={handleDelete}>
                      <Image src={removeIcon} alt="remove-icon" />
                    </button> */}
                      </div>
                    ) : (
                      <div
                        className=" flex justify-center items-center h-[90px] w-[110px]"
                        onClick={() => fileInputRef.current.click()}
                      >
                        <Image
                          src={userUploadImage}
                          alt="Customer-image"
                          className=""
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xl">Amelia Jantzen</p>
                    <p className="text-slate-400 text-sm">
                      Female // Age: 50 (06/01/1974) // Height: 5&apos; 4&quot;
                      // Weight: 177 lbs{" "}
                    </p>
                    <p className="text-slate-400 text-sm">
                      Average Activity Level: Medium // Meals Eaten Per Day: 6
                    </p>
                    <p className="text-slate-400 text-sm">
                      Fitness Goal: NA // Meal Plan Preferences: NA
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      handleInvite(params.row.id);
                    }}
                  >
                    <Image
                      src={inviteIcon}
                      height={34}
                      width={34}
                      alt="invite-icon"
                    />
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(params.row.id);
                    }}
                  >
                    <Image
                      src={deleteIcon}
                      height={34}
                      width={34}
                      alt="delete-icon"
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
              <div>
                <label className="input-label">Full Name</label>
                <CustomTextField
                  type="text"
                  id="userFullName"
                  placeholder="Enter your full name"
                  className="input-text focus:outline-none focus:shadow-outline"
                  {...register("full_name", {
                    required: "This field is required",
                    // pattern: {
                    //   value: /^[a-zA-Z\s'-]+$/,
                    //   message: "Enter valid full name",
                    // },
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
                <label className="input-label">Email</label>
                <CustomTextField
                  type="text"
                  id="userEmail"
                  placeholder="Enter your email address"
                  className="input-text focus:outline-none focus:shadow-outline"
                  {...register("email", {
                    required: "This field is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Enter valid email name",
                    },
                  })}
                  onChange={(e) => {
                    e.target.value = e.target.value.toLowerCase();
                    // Manually trigger the change for react-hook-form
                    const nativeInputValueSetter =
                      Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype,
                        "value"
                      )?.set;
                    nativeInputValueSetter?.call(e.target, e.target.value);
                    e.target.dispatchEvent(
                      new Event("input", { bubbles: true })
                    );
                  }}
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
                {/* <BirthDatePicker
                name={"birth_date"}
                control={control}
                errors={errors}
                //   if alreadyExists date then pass date in value
                //   value={value}
              /> */}
                <CommonDatePicker
                  name="birth_date"
                  control={control}
                  errors={errors}
                  // format={"YYYY-MM-DD"}
                  format={"MM-DD-YYYY"}
                  value={watch("birth_date")}
                  maxDate={today}
                  // disabled={!editMode}
                  //   if alreadyExists date then pass date in value
                  // value={"birth_date"}
                />
                <ErrorMessage
                  errors={errors}
                  name="birth_date"
                  render={({ message }) => (
                    <p className="errorMessage">{message}</p>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
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
                        control={<Radio size="small" />}
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
                        control={<Radio size="small" />}
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
                      <FormControlLabel
                        value="Other"
                        control={<Radio size="small" />}
                        label="Other"
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
              <div>
                <label className="input-label">Phone number</label>
                <CustomTextField
                  type="text"
                  placeholder="Enter your phone number"
                  className="input-text focus:outline-none focus:shadow-outline"
                  {...register("phone_number", {
                    required: "This field is required",
                    pattern: {
                      value: /^\d*\.?\d*$/,
                      message: "Please enter a valid number",
                    },
                    minLength: {
                      value: 10,
                      message: "Phone number length must be at least 10",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="phone_number"
                  render={({ message }) => (
                    <p className="errorMessage">{message}</p>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
              <div>
                <CommonSelect
                  name="measurement_standard"
                  label="Measurement Standard"
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
              </div>
              <div className="relative">
                <label className="input-label">Height</label>
                {measurementStandard?.value === "US Standard" ? (
                  <div className="flex items-between gap-3">
                    <div className="relative w-[49%]">
                      <CustomTextField
                        type="text"
                        // defaultValue={0}
                        className="input-text focus:outline-none focus:shadow-outline"
                        {...register("feet", {
                          // valueAsNumber: true,
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
                        // defaultValue={0}
                        className="input-text focus:outline-none focus:shadow-outline"
                        {...register("inch", {
                          // valueAsNumber: true,
                          required: "This field is required",
                          // min: {
                          //   value: 1,
                          //   message: "value must be at least 1",
                          // },
                          max: {
                            value: 12,
                            message: "maximum value must be less than 12",
                          },
                          pattern: {
                            value: /^\d*\.?\d*$/,
                            message: "Please enter a valid number",
                          },
                        })}
                      />
                      <div className="absolute top-[11px] right-[14px] text-slate-400">
                        {measurementStandard?.value === "US Standard" && "inch"}
                      </div>
                      <ErrorMessage
                        errors={errors}
                        name="inch"
                        render={({ message }) => (
                          <p className="errorMessage">{message}</p>
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <CustomTextField
                      type="text"
                      // defaultValue={0}
                      className="input-text focus:outline-none focus:shadow-outline"
                      {...register("height", {
                        // valueAsNumber: true,
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
                  // defaultValue={0}
                  className="input-text focus:outline-none focus:shadow-outline"
                  {...register("weight", {
                    // valueAsNumber: true,
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
          <div className="border-b mb-2">
            <div className="grid grid-cols-1 mt-2">
              <div className="mb-3">
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
                          control={<Radio size="small" />}
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

              <div className="mb-3">
                <label className="input-label">Meals Eaten Per Day</label>
                <Controller
                  name="meals_eaten_per_day"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "This field is required" }}
                  render={({ field }) => (
                    <RadioGroup {...field} row sx={{ marginLeft: "4px" }}>
                      {mealsEatenPerDayOptions?.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value || null}
                          control={<Radio size="small" />}
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

              <div className="mb-3">
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
                {/* <Controller
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
                /> */}
                <ErrorMessage
                  errors={errors}
                  name="fitness_goals"
                  render={({ message }) => (
                    <p className="errorMessage">{message}</p>
                  )}
                />
              </div>

              {/* <div className="mb-3">
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

              <div className="mb-3">
                <label className="input-label">Meal Plan Preferences</label>
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
                />

                <ErrorMessage
                  errors={errors}
                  name="meal_plan_preferences"
                  render={({ message }) => (
                    <p className="errorMessage">{message}</p>
                  )}
                />
              </div>

              <div className="">
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
                  />
                </div>
              </div>
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8"> */}
            {/* <div>
              <CommonSelect
                name="admin_id"
                label="Select admin"
                control={control}
                options={adminListOptions}
                isRequired={true}
                placeholder="Select admin"
              />
              <ErrorMessage
                errors={errors}
                name="admin_id"
                render={({ message }) => (
                  <p className="errorMessage">{message}</p>
                )}
              />
            </div>
            {adminId && (
              <div className="mb-6">
                <label className="input-label">Assign to self</label>
                <Controller
                  name="assign_to_self"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormGroup
                      row
                      sx={{ marginLeft: "4px", marginTop: "15px" }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.checked);
                            }}
                          />
                        }
                        label={"Assign to self"}
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
                    </FormGroup>
                  )}
                />
              </div>
            )} */}

            {/* Trainer Dropdown in admin and super admin side */}

            {/* {action !== "add-customer-by-admin" && 
              (role === "super_admin" || role === "admin") && (
                <div className="flex flex-col-reverse md:flex-row md:items-end md:gap-4 gap-2 w-full mb-3">
                  <div className="w-full md:w-[30%]">
                    <CommonSelect
                      name="trainer_id"
                      label="Select Trainer"
                      control={control}
                      options={filteredTrainerList}
                      // isRequired
                      isRequired={changeTrainer && action === "edite-customer-by-superadmin"}
                      placeholder="Select Trainer"
                      disabled={!changeTrainer}
                    />

                    <ErrorMessage
                      errors={errors}
                      name="trainer_id"
                      render={({ message }) => (
                        <p className="errorMessage">{message}</p>
                      )}
                    />
                  </div>
                  <div className="md:pt-2">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={changeTrainer}
                          onChange={(e) => setChangeTrainer(e.target.checked)}
                        />
                      }
                      label="Change Trainer"
                    />
                  </div>
                
                </div>
              )} */}
          </div>
          {/* </div> */}

          <div className="flex items-center my-4">
            {/* <button
            type="submit"
            className="btn btn-primary me-3 px-5"
            // disabled={addCustomer.isPending}
          >
            Save
           
          </button> */}

            {/* <button 
              type="submit"
              disabled={saving}
              className={`btn me-3 flex items-center justify-center gap-2 transition-colors duration-200 
    btn-primary px-5 py-2 ${saving ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {saving ? "Saving..." : "Save"}
              {saving && (
                <CircularProgress
                  size={16}
                  thickness={4}
                  sx={{ color: "white" }}
                  aria-label="saving"
                />
              )}
            </button> */}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn btn-primary me-3 px-5 py-2 flex items-center justify-center gap-2 transition-colors duration-200 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {(() => {
                const isAddCustomerAction = action === "add-customer-by-admin";
                const isEditCustomerAction =
                  action === "edite-customer-by-superadmin";

                let baseLabel = "Submit";
                if (isAddCustomerAction) {
                  baseLabel = "Add";
                } else if (isEditCustomerAction) {
                  baseLabel = "Save";
                }

                const loadingLabel = isSubmitting
                  ? baseLabel === "Save"
                    ? "Saving..."
                    : `${baseLabel}ing...`
                  : baseLabel;

                return (
                  <>
                    {loadingLabel}
                    {isSubmitting && (
                      <CircularProgress
                        size={16}
                        thickness={4}
                        sx={{ color: "white" }}
                      />
                    )}
                  </>
                );
              })()}
            </button>

            <button
              type="button"
              className="btn btn-primary-outline px-5"
              onClick={() => {
                if (action === "add-customer-by-admin") {
                  reset(); // clear the form
                  router.back(); // go back
                } else if (action === "edite-customer-by-superadmin") {
                  router.back(); // just go back
                }
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
