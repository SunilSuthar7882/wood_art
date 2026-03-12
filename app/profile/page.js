"use client";
import React from "react";
import { CircularProgress, Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useGetProfile } from "@/helpers/hooks/profilesection/getprofile";
import { editCustomerProfile } from "@/helpers/hooks/profilesection/editcustomerprofile";
import { errorNotification, successNotification } from "@/helpers/notification";
import TrainerProfile from "./TrainerProfile";
import AdminProfile from "./AdminProfile";
import SuperAdminProfile from "./SuperAdminProfile";
import CustomerProfile from "./CustomerProfile";
import { userGetReferralLink } from "@/helpers/hooks/referrallink/usergetreferrallink";

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
const Page = () => {
  const { data, isFetching, refetch } = useGetProfile();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const fileInputRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const { mutate: editcustomerprofile } = editCustomerProfile();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  const {
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  const measurementStandard = watch("measurement_standard");
  useEffect(() => {
    if (data) {
      // Populate form values with the fetched profile data
      setValue("full_name", data?.data?.full_name || "");
      setValue("phone_number", data?.data?.phone_number || "");
      setValue("email", data?.data?.email || "");
      setValue("gender", data?.data?.gender === 1 ? "Male" : "Female");
      if (data?.data?.measurement_standard === "Metric") {
        setValue("height", data?.data?.height?.toString() || "");
      } else if (data?.data?.measurement_standard === "US Standard") {
        const feet = Math.floor(data?.data?.height / 12);
        const inch = data?.data?.height % 12;
        setValue("feet", feet.toString());
        setValue("inch", inch.toString());
      }
      setValue("weight", data?.data?.weight || "");
      setValue(
        "birth_date",
        data?.data?.birth_date ? dayjs(data?.data?.birth_date) : null
      );
      setValue("measurement_standard", {
        value: data?.data?.measurement_standard || "",
        label: data?.data?.measurement_standard || "",
      });
      setValue(
        "average_activity_level",
        data?.data?.average_activity_level || ""
      );
      setValue("meals_eaten_per_day", data?.data?.meals_eaten_per_day || "");
      setValue("fitness_goals", data?.data?.fitness_goals || "");
      setValue(
        "meal_plan_preferences",
        data?.data?.meal_plan_preferences?.map((item) => item.preferences) || []
      );
      setValue("is_access_granted", data?.data?.is_access_granted || false);
      setValue("track_my_progress", data?.data?.track_my_progress || false);
      setValue("self_service_plan", data?.data?.self_service_plan || false);

      // Set image URL if available
      if (data?.data?.avatar_path) {
        setImageURL(data.adata?.vatar_path);
      }
    }
  }, [data, setValue]);
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
    formdata.append("fitness_goals", data.fitness_goals);
    formdata.append("meal_plan_preferences", data.meal_plan_preferences);
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
    setEditMode((prevState) => !prevState);
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
    const storedRole = getLocalStorageItem("role");
    setRole(storedRole);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const renderProfileComponent = () => {
    switch (role) {
      case "admin":
        return <AdminProfile />;
      case "super_admin":
        return <SuperAdminProfile />;
      case "customer":
        return <CustomerProfile />;
      case "trainer":
        return <TrainerProfile />;
      default:
        return (
          <p className="text-center text-red-500">
            Unauthorized role or no role found.
          </p>
        );
    }
  };

  return (
    //  <div className="p-2 h-full w-full flex flex-1 overflow-auto items-center justify-center">
    //   <div className="flex flex-1 border rounded-lg bg-white h-full overflow-auto">
    //     {loading ? (
    //       <div className="flex flex-col justify-center items-center h-full">
    //         <CircularProgress style={{ color: "green" }} />
    //       </div>
    //     ) : (
    //       renderProfileComponent()
    //     )}
    //   </div>
    // </div>

    <div className="p-2 h-full w-full flex flex-1 overflow-auto items-center justify-center">
      <div className="flex flex-1 border rounded-lg bg-white h-full overflow-auto items-center justify-center">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <CircularProgress style={{ color: "green" }} />
          </div>
        ) : (
          renderProfileComponent()
        )}
      </div>
    </div>
  );
};

export default Page;
