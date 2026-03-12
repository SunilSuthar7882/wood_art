import React, { useEffect, useMemo, useState } from "react";
import { X, AlertTriangle, User, UserMinus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useDisassociateCustomer } from "@/helpers/hooks/mamAdmin/mamAdmin";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useGetdropdownadmintrainerlist } from "@/helpers/hooks/mamAdmin/dropdownadmintrainerlist";
import { Checkbox, FormControlLabel } from "@mui/material";
import CommonSelect from "./CommonSelect";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useDropdownActiveAdminList } from "@/helpers/hooks/mamAdmin/dropdownactiveadminlist";

const DisassociateCustomerModal = ({
  open,
  onClose,
  onConfirm,
  customerData,
}) => {
  const searchParams = useSearchParams();
  const trainerName = searchParams.get("trainer_name") || "";
  const { mutate: disassociateCustomer, isLoading } = useDisassociateCustomer();
  const role = getLocalStorageItem("role");
  const [assignToSelf, setAssignToSelf] = useState(true);
  const [assignToAdmin, setAssignToAdmin] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState("");
  const [selectedAdminId, setSelectedAdminId] = useState("");

  const [assignTrainer, setAssignTrainer] = useState(false);
  const [loginIdvalue, setloginIdvalue] = useState(null);
  const [adminIdvalue, setadminIdvalue] = useState(null);
  const [trainerIdvalue, setTrainerIdvalue] = useState(null);
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
  });
  const selectedTrainer = watch("trainer_id");
  const isConfirmDisabled =
    isLoading ||
    (assignTrainer && (!selectedTrainer || !selectedTrainer?.value));

  useEffect(() => {
    setloginIdvalue(localStorage.getItem("loginId"));
    setadminIdvalue(localStorage.getItem("adminId"));
    setTrainerIdvalue(localStorage.getItem("trainerId"));
  }, []);
  const adminIdaccordingRole =
    role === "super_admin" ? adminIdvalue : loginIdvalue;
  const {
    data: gettrainersList,
    isFetching: gettrainerfetching,
    refetch: gettrainerrefetch,
  } = useGetdropdownadmintrainerlist(adminIdaccordingRole);
  const {
    data: getadminlist,
    isFetching: gettingadminlist,
    refetch: refetchadminlist,
  } = useDropdownActiveAdminList();

  const trainerListOptions = useMemo(() => {
    if (!gettrainersList?.data) return [];
    return gettrainersList?.data.map((trainer) => ({
      label: trainer?.full_name,
      value: trainer?.id,
    }));
  }, [gettrainersList]);
  const adminListOptions = useMemo(() => {
    if (!getadminlist?.data) return [];
    return getadminlist?.data.map((admin) => ({
      label: admin?.full_name,
      value: admin?.id,
    }));
  }, [getadminlist]);

const handleDisassociate = () => {
  const userData = {
    customer_id: parseInt(customerData.id),
    ...(assignToSelf ? {} : (selectedTrainerId ? { trainer_id: selectedTrainerId } : {})),
    ...(assignToAdmin && selectedAdminId ? { admin_id: selectedAdminId } : {}),
  };


  disassociateCustomer(userData, {
    onSuccess: () => {
      if (onConfirm) onConfirm();
      handleClose();
    },
  });
};

const handleClose = () => {
  setAssignToSelf(true);
  setAssignTrainer(false);
  setAssignToAdmin(false);
  setSelectedTrainerId(null);
  setSelectedAdminId(null);
  resetField("trainer_id");
  resetField("admin_id");
  onClose();
};
  if (!open || !customerData) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <UserMinus className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Disassociate Customer
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto flex items-center justify-center bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Disassociate Customer
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              This will remove the customer from their current trainer and
              assign them to you (Admin).
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Customer
                </p>
                <p className="text-lg font-semibold text-gray-800">
                  {customerData?.name}
                </p>
                <p className="text-sm text-gray-600">{customerData?.email}</p>
                {customerData.phone && (
                  <p className="text-sm text-gray-600">{customerData?.phone}</p>
                )}
                {customerData?.joinDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    Member since:{" "}
                    {new Date(customerData?.joinDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 flex-1">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-blue-900 mb-1">FROM</p>
                  <p className="font-semibold text-blue-800">{trainerName}</p>
                  <p className="text-xs text-blue-600 font-medium">Trainer</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-blue-400" />
                <div className="w-2 h-2 rotate-45 border-t-2 border-r-2 border-blue-400" />
              </div>

              <div className="flex items-center gap-3 flex-1">
                <div className=" flex flex-col w-full gap-1 ml-2">
                  <div className="flex flex-row justify-between gap-2">
                    {role !== "super_admin" && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={assignToSelf}
                            onChange={() => {
                              setAssignToSelf(true);
                              setAssignTrainer(false);
                              setAssignToAdmin(false);
                              setValue("trainer_id", null);
                            }}
                            sx={{
                              padding: 0,
                              margin: 0,
                            }}
                          />
                        }
                        label="Your Self"
                      />
                    )}

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={assignTrainer}
                          onChange={() => {
                            setAssignTrainer(true);
                            setAssignToSelf(false);
                            setAssignToAdmin(false);
                          }}
                          sx={{
                            padding: 0,
                            margin: 0,
                          }}
                        />
                      }
                      label="Assign Trainer"
                    />
                    
                  </div>
                  {assignTrainer && (
                    <div className=" w-full">
                      <CommonSelect
                        name="trainer_id"
                        value={selectedTrainerId}
                        control={control}
                        onChange={(selectedOption) => {
                          setSelectedTrainerId(selectedOption?.value || null);
                        }}
                        options={trainerListOptions}
                        isRequired
                        placeholder="Select Trainer"
                      />
                      <ErrorMessage
                        errors={errors}
                        name="trainer_id"
                        render={({ message }) => (
                          <p className="errorMessage">{message}</p>
                        )}
                      />
                    </div>
                  )}
                  <div className="flex flex-row justify-between gap-2">
                   
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={assignToAdmin}
                          onChange={() => {
                            setAssignTrainer(false);
                            setAssignToSelf(false);
                            setAssignToAdmin(true);
                          }}
                          sx={{
                            padding: 0,
                            margin: 0,
                          }}
                        />
                      }
                      label="Assign Admin"
                    />
                  </div>
                  {assignToAdmin && (
                    <div className=" w-full">
                      <CommonSelect
                        name="admin_id"
                        value={selectedAdminId}
                        control={control}
                        onChange={(selectedOption) => {
                          setSelectedAdminId(selectedOption?.value || null);
                        }}
                        options={adminListOptions}
                        isRequired
                        placeholder="Select Admin"
                      />
                      <ErrorMessage
                        errors={errors}
                        name="admin_id"
                        render={({ message }) => (
                          <p className="errorMessage">{message}</p>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-green-100 rounded-full">
                <AlertTriangle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800 mb-1">
                  Automatic Assignment
                </p>
                <p className="text-sm text-green-700">
                  The customer will be automatically assigned to you as the
                  admin. You can reassign them to another trainer later if
                  needed. This ensures continuous service and management
                  oversight.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(handleDisassociate)}
              disabled={isConfirmDisabled}
              className={`px-4 py-2 rounded-lg font-medium transition text-white ${
                isConfirmDisabled
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isLoading ? "Processing..." : "Confirm Disassociation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisassociateCustomerModal;
