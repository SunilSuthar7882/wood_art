import React, { useEffect, useState } from "react";
import { MenuItem, Select } from "@mui/material";

import { LoadingButton } from "@mui/lab";
import {
  useAdminTransferToAdmin,
  useGetMamAdmins,
} from "@/helpers/hooks/mamAdmin/mamAdmin";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { AlertTriangle, ArrowLeftRight } from "lucide-react";

export default function TransferAdmin() {
  const [searchValue, setSearchValue] = useState("");
  const [activeStatus, setActiveStatus] = useState(null);
  const [fromAdminId, setFromAdminId] = useState("");
  const [toAdminId, setToAdminId] = useState("");
  const [adminList, setAdminList] = useState([]);

  const page = 0;
  const limit = 1000;

  const { data, isFetching, refetch } = useGetMamAdmins(
    page,
    limit,
    activeStatus,
    searchValue
  );

  const { showSnackbar } = useSnackbar();

  const { mutate: transferAdminToAdmin, isPending: isAdminTransferLoading } =
    useAdminTransferToAdmin({
      onSuccess: (res) => {
        showSnackbar(res?.message || "Transfer successful", "success");
        setFromAdminId("");
        setToAdminId("");
      },
      onError: (err) => {
        const msg = err?.response?.data?.message || "Transfer failed";
        showSnackbar(msg, "error");
      },
    });

  useEffect(() => {
    if (data?.data?.page_data) {
      setAdminList(data.data.page_data);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [page, activeStatus, searchValue]);

  const handleTransfer = () => {
    if (!fromAdminId || !toAdminId) {
      showSnackbar("Please select both admins before transferring.", "error");
      return;
    }

    const fromAdmin = adminList.find((admin) => admin.id === fromAdminId);
    const toAdmin = adminList.find((admin) => admin.id === toAdminId);

    if (!fromAdmin || !toAdmin) {
      showSnackbar("Invalid admin selected.", "error");
      return;
    }

    transferAdminToAdmin({ fromAdmin: fromAdminId, toAdmin: toAdminId });
  };

  const sourceAdmin = adminList.find((admin) => admin.id === fromAdminId);
  const targetAdmin = adminList.find((admin) => admin.id === toAdminId);

  return (
    <div className="flex flex-col h-full w-full">
      <h1 className="text-2xl font-bold">
        Reassign Users to a Different Admin
      </h1>
      <label className="text-sm text-gray-600 py-2">
        Easily transfer all associated trainers and customers from one admin to
        another.
      </label>
      <div className="bg-white rounded-lg p-6 flex flex-col gap-6 shadow-md">
        <div className="flex flex-col gap-6 md:flex-row md:gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">
              From Admin
            </label>

            <Select
              fullWidth
              value={fromAdminId}
              onChange={(e) => setFromAdminId(e.target.value)}
              displayEmpty
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                color: "gray",
              }}
            >
              <MenuItem value="" disabled>
                {isFetching ? "Loading..." : "Select From Admin"}
              </MenuItem>
              {isFetching ? (
                <MenuItem disabled>Loading admins...</MenuItem>
              ) : adminList.length === 0 ? (
                <MenuItem disabled>No admins available</MenuItem>
              ) : (
                adminList.map((admin) => (
                  <MenuItem key={admin.id} value={admin.id}>
                    {admin.full_name} ({admin.email})
                  </MenuItem>
                ))
              )}
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">
              To Admin
            </label>
            <Select
              fullWidth
              value={toAdminId}
              onChange={(e) => setToAdminId(e.target.value)}
              displayEmpty
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                color: "gray",
              }}
            >
              <MenuItem value="" disabled>
                {isFetching ? "Loading..." : "Select To Admin"}
              </MenuItem>

              {isFetching ? (
                <MenuItem disabled>Loading admins...</MenuItem>
              ) : adminList.filter((admin) => admin.id !== fromAdminId)
                  .length === 0 ? (
                <MenuItem disabled>No other admins available</MenuItem>
              ) : (
                adminList
                  .filter((admin) => admin.id !== fromAdminId)
                  .map((admin) => (
                    <MenuItem key={admin.id} value={admin.id}>
                      {admin.full_name} ({admin.email})
                    </MenuItem>
                  ))
              )}
            </Select>
          </div>
        </div>

        {sourceAdmin && targetAdmin && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-green-100 rounded-full">
                <AlertTriangle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-800 font-medium mb-2">
                  What will be transferred:
                </p>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>
                    • All trainers will be reassigned to{" "}
                    <span className="text-green-800 font-semibold">
                      {targetAdmin.full_name}
                    </span>
                  </li>
                  <li>
                    • All customers will be reassigned to{" "}
                    <span className="text-green-800 font-semibold">
                      {targetAdmin.full_name}
                    </span>
                  </li>
                  <li>
                    •{" "}
                    <span className="text-red-600 font-semibold">
                      {sourceAdmin.full_name}
                    </span>{" "}
                    will no longer have access to this data
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <LoadingButton
          variant="contained"
          onClick={handleTransfer}
          loading={isAdminTransferLoading}
          disabled={isFetching}
          sx={{
            marginTop: 2,
            borderRadius: 2,
            display: "block",
            mx: "auto",
            px: 6,
            py: 1.0,
            fontSize: 16,
            textTransform: "none",
          }}
        >
          <span
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            Transfer <ArrowLeftRight size={18} />
          </span>
        </LoadingButton>
      </div>
    </div>
  );
}
