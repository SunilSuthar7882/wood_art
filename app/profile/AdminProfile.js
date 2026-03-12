"use client";
import React, { useEffect, useRef, useState } from "react";
import { ErrorMessage } from "@hookform/error-message";

import { Box, Button, CircularProgress, Grid } from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { getLocalStorageItem } from "@/helpers/localStorage";
import userUploadImage from "../../public/images/upload-user-photo.png";
import { useGetProfile } from "@/helpers/hooks/profilesection/getprofile";
import { errorNotification, successNotification } from "@/helpers/notification";
import EditIcon from "@mui/icons-material/Edit";
import { useEditAdminProfile } from "@/helpers/hooks/mamAdmin/mamAdmin";
import { User } from "lucide-react";
import avatarImage from "../../public/avatarimage.jpeg";


const AdminProfile = () => {
  const { data, isFetching, refetch } = useGetProfile();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const fileInputRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const role = getLocalStorageItem("role");
  const { mutate: editadminprofile, isPending } = useEditAdminProfile();
  const [initialData, setInitialData] = useState({});
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

    editadminprofile(formdata, {
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

  return (
    <Box
      className="p-4 w-full h-full"
      display="flex"
      justifyContent="flex-start"
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
          {/* <Box display="flex" justifyContent="center" mb={3}>
            {role === "admin" && (
              <div className="relative inline-block">
                <input
                  type="file"
                  disabled={!editMode}
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />

                <div
                  className={`rounded-full overflow-hidden cursor-pointer border-[2px] ${
                    imageURL ? "h-[114px] w-[114px]" : "h-[130px] w-[130px]"
                  }`}
                  onClick={() => fileInputRef.current.click()}
                >
                  <Image
                    src={imageURL || avatarImage}
                    alt="user-profile"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>

                <div
                  className="absolute top-[1] right-[5] bg-[#16a34a] rounded-full p-1 shadow-md flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current.click();
                  }}
                >
                  <EditIcon  className="text-white text-[18px]" />
                </div>
              </div>
            )}
          </Box> */}
<Box display="flex" justifyContent="center" mb={3}>
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
    className="absolute bg-[#16a34a] rounded-full shadow-md flex items-center justify-center cursor-pointer"
    style={{
      top: "5%",
      right: "5%",
      width: "28px",    // fixed size for the icon background
      height: "28px",
    }}
    onClick={(e) => {
      e.stopPropagation();
      fileInputRef.current.click();
    }}
  >
    <EditIcon className="text-white text-[18px]" />
  </div>
</div>
</Box> 


          {/* Edit/Cancel Button */}
          <Box display="flex" justifyContent="flex-end" mb={3}>
            <Button
              variant="contained"
              size="small"
              sx={{ height: "35px", textTransform: "none", gap: 1 }}
              onClick={toggleEditMode}
            >
              {editMode ? "Cancel Edit" : <EditIcon className="text-white text-[24px]"/>}
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
    </Box>
  );
};

export default AdminProfile;
