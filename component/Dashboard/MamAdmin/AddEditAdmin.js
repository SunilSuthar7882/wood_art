import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { Routes } from "@/config/routes";
import { addAdminBySuperadmin } from "@/helpers/hooks/mamAdmin/addadminbysuperadmin";
import { addTrainerByadmin } from "@/helpers/hooks/mamAdmin/addtrainerbyadmin";
import { addTrainerBySuperadmin } from "@/helpers/hooks/mamAdmin/addtrainerbysuperadmin";
import { updateAdminBySuperadmin } from "@/helpers/hooks/mamAdmin/updateadminbysuperadmin";
import { errorNotification, successNotification } from "@/helpers/notification";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CircularProgress from "@mui/material/CircularProgress";
import UserFormSkeleton from "@/component/CommonComponents/UserFromSkeleton";
import CommonLoader from "@/component/CommonLoader";

export default function AddEditAdmin({
  adminId,
  action,
  storeediteData,
  loading,
}) {
  const [role, setrole] = useState(null);
  const [getadminId, setgetadminId] = useState(null);
  const [editestoreId, seteditestoreId] = useState(null);
  // const [saving, setSaving] = useState(false); // New State
  const [isSubmitting, setIsSubmitting] = useState(false); // New State

  const { mutate: addadminbysuperadmin } = addAdminBySuperadmin();
  const { mutate: addtrainerbyadmin } = addTrainerByadmin();
  const { mutate: addtrainerbysuperadmin } = addTrainerBySuperadmin();
  const { mutate: updateadminbysuperadmin } = updateAdminBySuperadmin();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  //   const isAddAction =
  //   action === "add-admin-by-superadmin" || action === "add-trainer-by-admin";
  // const isEditAction = action === "edite-admin-by-superadmin";

  // // Label before submit
  // const baseLabel = isAddAction ? "Add" : isEditAction ? "Save" : "Submit";
  // // Label during submit
  // const loadingLabel = isSubmitting ? `${baseLabel}ing...` : baseLabel;

  useEffect(() => {
    setrole(localStorage.getItem("role"));
  }, []);

  useEffect(() => {
    setgetadminId(localStorage.getItem("adminId"));
  }, []);
  useEffect(() => {
    if (storeediteData) {
      seteditestoreId(storeediteData.id);
      setValue("full_name", storeediteData?.full_name);
      setValue("email", storeediteData?.email);
      setValue("phone_number", storeediteData?.phone_number.toString());
    }
  }, [storeediteData]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  // useEffect(() => {
  //   if (userData) {
  //     setValue("full_name", userData?.first_name || "");
  //   }
  // }, [userData, setValue]);

  const onSubmit = (data) => {
    setIsSubmitting(true);
 

    if (action === "add-admin-by-superadmin") {
      addadminbysuperadmin(data, {
        onSuccess: (data) => {
          successNotification(data?.message);
          router.push(Routes.mamAdmin);
          router.back();
          reset();
          setIsSubmitting(false);
        },
        onError: (error) => {
          errorNotification(error?.response?.data?.message);
          setIsSubmitting(false);
        },
      });
    } else if (action === "add-trainer-by-admin") {
      if (role === "super_admin") {
        data.admin_id = getadminId;
        addtrainerbysuperadmin(data, {
          onSuccess: (data) => {
            successNotification(data?.message);
            reset();
            router.back();
            setIsSubmitting(false);
          },
          onError: (error) => {
            errorNotification(error?.response?.data?.message);
            setIsSubmitting(false);
          },
        });
 
      } else if (role === "admin") {
        addtrainerbyadmin(data, {
          onSuccess: (data) => {
            successNotification(data?.message);
            reset();
            // router.push(Routes.trainer);
            router.back();
            setIsSubmitting(false);
          },
          onError: (error) => {
            errorNotification(error?.response?.data?.message);
            setIsSubmitting(false);
          },
        });
      }
    } else if (action === "edite-admin-by-superadmin") {
      if (role === "super_admin") {
        data.admin_id = editestoreId;
        updateadminbysuperadmin(data, {
          onSuccess: (data) => {
            showSnackbar(data?.message, "success");
            router.push(Routes.mamAdmin);
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
    formdata.append("phone_number", data.phone_no);

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
        // <UserFormSkeleton />
        <CommonLoader/>
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
                onChange={(e) => {
                  if (!storeediteData?.email) {
                    const lowercaseValue = e.target.value.toLowerCase();
                    e.target.value = lowercaseValue;

                    // Update react-hook-form manually
                    const nativeSetter = Object.getOwnPropertyDescriptor(
                      window.HTMLInputElement.prototype,
                      "value"
                    )?.set;
                    nativeSetter?.call(e.target, lowercaseValue);
                    e.target.dispatchEvent(
                      new Event("input", { bubbles: true })
                    );
                  }
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
              <CircularProgress
                size={18}
                sx={{ color: "white", marginLeft: "10px" }}
              />
            )}
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

            {/* <button
              type="submit"
              disabled={isSubmitting}
              className={`btn me-3 flex items-center justify-center gap-2 transition-colors duration-200 
    btn-primary px-5 py-2 ${
      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
    }`}
            >
              {loadingLabel}
              {isSubmitting && (
                <CircularProgress
                  size={16}
                  thickness={4}
                  sx={{ color: "white" }}
                  aria-label={baseLabel.toLowerCase()}
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
                const isEditAction = action === "edite-admin-by-superadmin";
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
