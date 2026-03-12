"use client";
import React, { useEffect, useRef, useState } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { Box, Button, Card, CircularProgress, Grid } from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { getLocalStorageItem } from "@/helpers/localStorage";
import userUploadImage from "../../public/images/upload-user-photo.png";
import { useGetProfile } from "@/helpers/hooks/profilesection/getprofile";
import { errorNotification, successNotification } from "@/helpers/notification";
import EditIcon from "@mui/icons-material/Edit";
import { useEditTrainerProfile } from "@/helpers/hooks/mamAdmin/mamAdmin";
import { userGetReferralLink } from "@/helpers/hooks/referrallink/usergetreferrallink";
import { Routes } from "@/config/routes";
import { User } from "lucide-react";
import avatarImage from "../../public/avatarimage.jpeg";

const TrainerProfile = () => {
  const { data, isFetching, refetch } = useGetProfile();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const fileInputRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const role = getLocalStorageItem("role");
  const { mutate: edittrainerprofile, isPending } = useEditTrainerProfile();
  const [initialData, setInitialData] = useState({});
  //  const [selectedRole, setSelectedRole] = useState("");
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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  useEffect(() => {
    if (data?.data) {
      setImageURL(data?.data?.profile_image);
      const userData = {
        full_name: data.data.full_name || "",
        phone_number: data.data.phone_number || "",
        email: data.data.email || "",
      };
      reset(userData);
      setInitialData(userData);
    }
  }, [data]);

  const onSubmit = (formData) => {
    const formdata = new FormData();
    formdata.append("full_name", formData.full_name);
    formdata.append("phone_number", formData.phone_number);
    formdata.append("email", formData.email);
    if (selectedFile) formdata.append("profile_image", selectedFile);

    edittrainerprofile(formdata, {
      onSuccess: (res) => {
        successNotification(res?.message);
        setEditMode(false);
      },
      onError: (err) => {
        errorNotification(err?.response?.data?.message);
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
  useEffect(() => {
    if (userreferralLink) {
      setreferralLink(userreferralLink?.data?.referralLink);
      setconfiguration(userreferralLink?.data?.configuration);
    }
  }, [userreferralLink]);
  // const displayReferralLink = referralLink
  //   ? `${referralLink}${isCustomer ? "/customer" : isTrainer ? "/trainer" : ""}`
  //   : "";
  let displayReferralLink = referralLink || "";
  if (referralLink && isCustomer) {
    const [base, query] = referralLink.split("?");
    // displayReferralLink = `${base}${Routes.customer}?${query}`;
    const cleanedBase = base.replace(
      Routes.register,
      Routes.customersubscriptions
    );
    displayReferralLink = `${cleanedBase}?${query}`;
  } else if (referralLink && isTrainer) {
    const [base, query] = referralLink.split("?");
    const cleanedBase = base.replace(Routes.register, Routes.subscriptions);
    // const cleanedBase = base.replace("/register", Routes.subscriptions);

    displayReferralLink = `${cleanedBase}?${query}`;
    // const [base, query] = referralLink.split("?");
    // displayReferralLink = `${base}${Routes.subscriptions}?${query}`;
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
  // const handleCopy = async () => {
  //   try {
  //     await navigator.clipboard.writeText(referralLink);
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000);
  //   } catch (err) {
  //     console.error("Failed to copy:", err);
  //   }
  // };
  return (
    <Box
      className="p-4 w-full h-full"
      display="flex"
      justifyContent="flex-start"
      gap={3}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          bgcolor: "white",
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          p: 3,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Top: Image and Edit button */}
          <Box display="flex" justifyContent="center" mb={3}>
            {role === "trainer" && (
              // <Box display="flex" flexDirection="column" alignItems="center">
              //   <input
              //     type="file"
              //     accept="image/*"
              //     disabled={!editMode}
              //     onChange={handleImageChange}
              //     ref={fileInputRef}
              //     className="hidden"
              //   />
              //   {imageURL ? (
              //     <Box
              //       onClick={() => editMode && fileInputRef.current?.click()}
              //       sx={{
              //         height: 114,
              //         width: 114,
              //         borderRadius: "50%",
              //         overflow: "hidden",
              //         cursor: editMode ? "pointer" : "default",
              //       }}
              //     >
              //       <Image
              //         src={imageURL}
              //         alt="Profile"
              //         width={114}
              //         height={114}
              //         className="object-cover w-full h-full"
              //       />
              //     </Box>
              //   ) : (
              //     <Box
              //       onClick={() => editMode && fileInputRef.current?.click()}
              //       sx={{
              //         height: 114,
              //         width: 114,
              //         display: "flex",
              //         alignItems: "center",
              //         justifyContent: "center",
              //         borderRadius: "50%",
              //         bgcolor: "#f0f0f0",
              //         cursor: editMode ? "pointer" : "default",
              //       }}
              //     >
              //       <Image src={userUploadImage} alt="Upload" />
              //     </Box>
              //   )}
              // </Box>



              // <div className="relative inline-block">
              //   <input
              //     type="file"
              //     disabled={!editMode}
              //     accept="image/*"
              //     onChange={handleImageChange}
              //     ref={fileInputRef}
              //     className="hidden"
              //   />

              //   {/* Image Container */}
              //   <div
              //     className={`rounded-full overflow-hidden cursor-pointer border-[2px] ${
              //       imageURL ? "h-[114px] w-[114px]" : "h-[130px] w-[130px]"
              //     }`}
              //     onClick={() => fileInputRef.current.click()}
              //   >
              //     <Image
              //       src={imageURL || avatarImage}
              //       alt="user-profile"
              //       fill
              //       className="object-cover rounded-full"
              //     />
              //   </div>

              //   {/* Edit Icon outside the image */}
              //   <div
              //     className="absolute top-[1] right-[5] bg-[#16a34a] rounded-full p-1 shadow-md flex items-center justify-center"
              //     onClick={(e) => {
              //       e.stopPropagation();
              //       fileInputRef.current.click();
              //     }}
              //   >
              //     <EditIcon className="text-white text-[18px]" />
              //   </div>
              // </div>


              <div className="relative inline-block" style={{ width: imageURL ? 114 : 130, height: imageURL ? 114 : 130 }}>
  {/* Hidden file input */}
  <input
    type="file"
    disabled={!editMode}
    accept="image/*"
    onChange={handleImageChange}
    ref={fileInputRef}
    className="hidden"
  />

  {/* Image container */}
  <div
    className="rounded-full overflow-hidden cursor-pointer border-2 w-full h-full"
    onClick={() => fileInputRef.current.click()}
  >
    <Image
      src={imageURL || avatarImage}
      alt="user-profile"
      fill
      className="object-cover rounded-full"
    />
  </div>

  {/* Edit icon in corner */}
  <div
    className="absolute bg-[#16a34a] rounded-full p-1 shadow-md flex items-center justify-center cursor-pointer"
    style={{
      top: "2%",        // 5% from top of container
      right: "2%",      // 5% from right of container
      transform: "translate(0, 0)", // ensures icon stays in corner
    }}
    onClick={(e) => {
      e.stopPropagation();
      fileInputRef.current.click();
    }}
  >
    <EditIcon className="text-white text-[18px]" />
  </div>
</div>

            )}
          </Box>

          {/* Edit/Cancel Button */}
          <Box display="flex" justifyContent="flex-end" mb={3}>
            <Button
              variant="contained"
              size="small"
              sx={{ height: "35px", textTransform: "none", gap: 1 }}
              onClick={toggleEditMode}
            >
              {editMode ? (
                "Cancel Edit"
              ) : (
                <EditIcon className="text-white text-[24px]" />
              )}
            </Button>
          </Box>

          {/* Form Fields */}
          <Grid container spacing={3}>
            {/* Full Name */}
            <Grid item xs={12}>
              <div>
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  disabled={!editMode}
                  id="userFullName"
                  className={`input-text bg-transparent appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.full_name ? "border-red-500" : "border-gray-300"
                  } ${
                    editMode ? "hover:border-green-600" : "cursor-not-allowed"
                  }`}
                  placeholder="Enter your full name"
                  {...register("full_name", {
                    required: "This field is required",
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="full_name"
                  render={({ message }) => (
                    <p className="text-red-500 text-sm mt-1">{message}</p>
                  )}
                />
              </div>
            </Grid>

            {/* Phone Number */}
            <Grid item xs={12}>
              <div>
                <label className="input-label">Phone Number</label>
                <input
                  type="text"
                  disabled={!editMode}
                  id="userPhoneNumber"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter your phone number"
                  className={`input-text bg-transparent appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    errors.phone_number ? "border-red-500" : "border-gray-300"
                  } ${
                    editMode ? "hover:border-green-600" : "cursor-not-allowed"
                  }`}
                  {...register("phone_number", {
                    required: "This field is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit phone number",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="phone_number"
                  render={({ message }) => (
                    <p className="text-red-500 text-sm mt-1">{message}</p>
                  )}
                />
              </div>
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <div>
                <label className="input-label">Email</label>
                <input
                  type="email"
                  disabled
                  id="userEmail"
                  placeholder="Enter your email"
                  className={`input-text bg-gray-100 text-gray-400 appearance-none border rounded-lg w-full py-3 px-3 leading-tight focus:outline-none ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } cursor-not-allowed`}
                  {...register("email", {
                    required: "This field is required",
                    pattern: {
                      value: /^[^@]+@[^@]+\.[^@]+$/,
                      message: "Enter valid email",
                    },
                  })}
                />
                <ErrorMessage
                  errors={errors}
                  name="email"
                  render={({ message }) => (
                    <p className="text-red-500 text-sm mt-1">{message}</p>
                  )}
                />
              </div>
            </Grid>
          </Grid>

          {/* Save Button */}
          {editMode && (
            <Box mt={4} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ px: 4 }}
                disabled={isPending}
              >
                Save
                {isPending && (
                  <CircularProgress size={18} sx={{ color: "white", ml: 2 }} />
                )}
              </Button>
            </Box>
          )}
        </form>
      </Box>
      {isFetching ? (
        <div className="flex flex-col w-full">
          <div className="rounded-2xl shadow-none bg-white border border-gray-200 p-2 flex flex-col max-w-md w-full md:w-auto animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
              <div className="h-10 w-20 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      ) : (
        <Card className="rounded-2xl shadow-md bg-white border border-gray-200 p-4 flex flex-1 flex-col max-w-lg max-h-[200px]">
          <h2 className="text-xl font-semibold text-gray-800">Invite & Earn</h2>
          {/* <p className="text-sm text-gray-600 mt-1">
            Invite your friends and they’ll get{" "}
            <span className="text-green-600 font-bold">$5</span> when they sign
            up.
          </p> */}
          <p className="text-sm text-gray-600 mt-1">
            Invite your friends{" "}
            {isCustomer ? "as a customer " : isTrainer ? "as a trainer " : ""}
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
                className="accent-green-600"
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
                className="accent-green-600"
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
              onClick={handleCopy}
              className="bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </Card>
      )}
    </Box>
  );
};

export default TrainerProfile;
