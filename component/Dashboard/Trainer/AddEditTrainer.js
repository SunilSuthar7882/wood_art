import { useSnackbar } from "@/app/contexts/SnackbarContext";
// import { Routes } from "@/config/routes";
import { updateTrainerByadmin } from "@/helpers/hooks/trainersectionapi/updatetrainerbyadmin";
import { updateTrainerBySuperadmin } from "@/helpers/hooks/trainersectionapi/updatetrainerbysuperadmin";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import UserFormSkeleton from "@/component/CommonComponents/UserFromSkeleton";
export default function AddEditTrainer({
  adminId,
  action,
  storeediteData,
  loading,
}) {
  
  // const updateCustomerInfo = useEditCustomerDetailMutation();
  const [role, setrole] = useState(null);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  //  const [saving, setSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New State
  const [editestoreId, seteditestoreId] = useState(null);
  const { mutate: updatetrainerbysuperadmin } = updateTrainerBySuperadmin();
  const { mutate: updatetrainerbyadmin } = updateTrainerByadmin();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });
  useEffect(() => {
    setrole(localStorage.getItem("role"));
  }, []);
  // useEffect(() => {
  //   if (userData) {
  //     setValue("full_name", userData?.first_name || "");
  //   }
  // }, [userData, setValue]);
  useEffect(() => {
    if (storeediteData) {
      seteditestoreId(storeediteData.id);
      setValue("full_name", storeediteData?.full_name);
      setValue("email", storeediteData?.email);
      setValue("phone_number", storeediteData?.phone_number.toString());
    }
  }, [storeediteData]);
  const onSubmit = (data) => {
    setIsSubmitting(true);
     
    if (action === "edite-trainer-by-superadmin") {
      if (role === "super_admin") {
        data.trainer_id = editestoreId;
        updatetrainerbysuperadmin(data, {
          onSuccess: (data) => {
            showSnackbar(data?.message, "success");
            // router.push(Routes.trainer);
            router.back();
            reset();
            setIsSubmitting(false);
          },
          onError: (error) => {
            showSnackbar(error?.response?.data?.message, "error");
            setIsSubmitting(false);
          },
        });
      } else if (role === "admin") {
        data.trainer_id = editestoreId;
        updatetrainerbyadmin(data, {
          onSuccess: (data) => {
            showSnackbar(data?.message, "success");
            // router.push(Routes.trainer);
            router.back();
            reset();
            setIsSubmitting(false);
          },
          onError: (error) => {
            showSnackbar(error?.response?.data?.message, "error");
            setIsSubmitting(false);
          },
        });
      }
    }
    const formdata = new FormData();
    formdata.append("admin_id", adminId);
    formdata.append("full_name", data.full_name);
    formdata.append("email", data.email);
    formdata.append("phone_no", data.phone_no);

    // updateCustomerInfo.mutate(formdata, {
    //   onSuccess: (data) => {
    //     successNotification(data?.message);
    //     reset();
    //   },
    // });
  };

  return (
    <div className="p-4 border rounded-lg">
      {loading ? (
        <UserFormSkeleton />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            <div>
              <label className="input-label">Full Name</label>
              <input
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
              <input
                type="text"
                id="userEmail"
                disabled={storeediteData?.email}
                placeholder="Enter your email address"
                className="input-text focus:outline-none focus:shadow-outline"
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
              <label className="input-label">Phone number</label>
              <input
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
                    value: 5,
                    message: "Phone number length must be at least 5",
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

          <div className="flex items-center">
            {/* <button
            type="submit"
            className="btn btn-primary me-3 px-5"
            disabled={updateCustomerInfo.isPending}
          >
            Save
            {updateCustomerInfo.isPending && (
              { <CircularProgress
                size={18}
                sx={{ color: "white", marginLeft: "10px" }}
              /> }
            )}
          </button> */}

            {/* <button
              type="submit"
              disabled={saving}
              className={`btn me-3 flex items-center justify-center gap-2 transition-colors duration-200 
               btn-primary px-5 py-2 ${
                 saving ? "opacity-75 cursor-not-allowed" : ""
               }`}
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
                const isAddAction =
                  action === "add-admin-by-superadmin" ||
                  action === "add-trainer-by-admin";
                const isEditAction = 
                action === "edite-admin-by-superadmin"||
                action === "edite-trainer-by-superadmin";
                const baseLabel = isAddAction
                  ? "Add"
                  : isEditAction
                  ? "Save"
                  : "Submit";

                const loadingLabel = isSubmitting
                  ? baseLabel === "Save"
                    ? "Saving..."
                    : baseLabel + "ing..."
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
              className="btn btn-primary-outline px-5"
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
