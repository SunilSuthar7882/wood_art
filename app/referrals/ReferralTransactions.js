"use client";

import { useState, useEffect } from "react";
import {
  Chip,
  Paper,
  MenuItem,
  Select,
  IconButton,
  Button,
  Typography,
  FormControl,
  InputLabel,
  InputAdornment,
  Box,
} from "@mui/material";
import { CheckCircle } from "lucide-react";
import CustomTable from "@/component/CommonComponents/CommonTable";
import {
  useGetTrainerRewards,
  useGetTrainerRewardsCount,
} from "@/helpers/hooks/rewards/gettrainerrewards";
import dayjs from "dayjs";
import { useUpdateRewardBySuperAdmin } from "@/helpers/hooks/rewards/rewardupdate";
import { useSnackbar } from "../contexts/SnackbarContext";
import CommonDialogBox from "@/component/CommonDialogBox";
import { useGetRewardUsersDropdown } from "@/helpers/hooks/rewards/rewarduserdropdownlist";
import { CalendarToday } from "@mui/icons-material";

const ReferralTransactions = () => {
  const [dateRange, setDateRange] = useState("30");

  const end_date = dayjs().endOf("day").format("YYYY-MM-DD");
  const start_date = dayjs()
    .subtract(Number(dateRange), "day")
    .startOf("day")
    .format("YYYY-MM-DD");
  const [paidStatus, setPaidStatus] = useState("all");

  const [page, setPage] = useState(0);
  const { showSnackbar } = useSnackbar();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRewardId, setSelectedRewardId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const { mutate: updateReward, isLoading } = useUpdateRewardBySuperAdmin();
  const { data, isFetching, refetch } = useGetTrainerRewards(
    page,
    rowsPerPage,
    searchValue,
    filterRole,
    start_date,
    paidStatus
    // user_id
  );
  const {
    data: rewardCount,
    isFetching: isFetchingTrainerRewardCount,
    refetch: refetchRewardCount,
  } = useGetTrainerRewardsCount(
    searchValue,
    filterRole,
    start_date,
    paidStatus
  );
  const totalUsersReffered = rewardCount?.data?.referred_users;
  const totalRewardEarned = rewardCount?.data?.total_reward;
  const totalActiveUsers = rewardCount?.data?.subscription_active_users;
  const totalInactiveUsers = rewardCount?.data?.subscription_inactive_users;
  const { data: userDropdownlist } = useGetRewardUsersDropdown();
  const pageInfo = data?.data?.page_information || {};
  const currentPage = (pageInfo.current_page ?? 1) - 1;
  const totalRows = pageInfo.total_data ?? 0;

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, searchValue, filterRole, start_date, paidStatus]);
  useEffect(() => {
    refetchRewardCount();
  }, [searchValue, filterRole, start_date, paidStatus]);
  const handleOpenDialog = (id) => {
    setSelectedRewardId(id);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setSelectedRewardId(null);
    setOpenDialog(false);
  };
  const columns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      width: 80,
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },

    {
      field: "markPaid",
      headerName: "Mark Paid",
      width: 120,
      renderCell: (params) => {
        if (params.row.status === "unpaid") {
          return (
            <Button
              variant="outlined"
              onClick={() => handleOpenDialog(params.row.id)}
              //   onClick={() => handleMarkPaid(params.row)}
            >
              Pay
            </Button>
            // <IconButton
            //   color="success"
            //   size="small"
            //   onClick={() => handleMarkPaid(params.row)}
            // >
            //   Pay Now
            //   {/* <CheckCircle size={18} /> */}
            // </IconButton>
          );
        }
        return null;
      },
    },
    { field: "referrerName", headerName: "Referrer Name", width: 200 },
    { field: "referrerEmail", headerName: "Referrer Email", width: 250 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        let color = "default";
        switch (params.value) {
          case "paid":
            color = "success";
            break;
          case "unpaid":
            color = "error";
            break;
          case "pending":
            color = "warning";
            break;
        }
        return (
          <Chip
            label={params.value?.toUpperCase()}
            color={color}
            size="small"
            variant="outlined"
          />
        );
      },
    },

    { field: "referrerRole", headerName: "Referrer Role", width: 150 },
    { field: "referredName", headerName: "Referred Name", width: 200 },
    { field: "referredEmail", headerName: "Referred Email", width: 250 },
    { field: "referredRole", headerName: "Referred Role", width: 150 },
    {
      field: "is_subscription_active",
      headerName: "Referred Account Status",
      width: 150,
      renderCell: (params) => {
        const isActive = params.value; // true or false
        return (
          <Box
            display={"flex"}
            justifyContent={"start"}
            alignItems={"center"}
            height={"100%"}
          >
            <Typography
              sx={{
                color: isActive === true ? "green" : "#cb3934",
                fontWeight: 600,
              }}
            >
              {isActive === true ? "Active" : "Inactive"}
            </Typography>
          </Box>
        );
      },
    },
    { field: "rewardAmount", headerName: "Reward Amount", width: 150 },
    { field: "earnedDate", headerName: "Earned Date", width: 200 },
  ];

  const rows =
    data?.data?.page_data.map((row) => ({
      id: row.id,
      referrerName: row.referrer_user?.full_name || "-",
      referrerEmail: row.referrer_user?.email || "-",
      referrerRole: row.referrer_user?.role || "-",
      referredName: row.referred_user?.full_name || "-",
      referredEmail: row.referred_user?.email || "-",
      referredRole: row.referred_user?.role || "-",
      is_subscription_active: row.referred_user?.is_subscription_active || "-",
      rewardAmount: row.reward_amount,
      status: row.status,
      earnedDate: dayjs(row.created_at).format("MM-DD-YYYY HH:mm"),
    })) || [];

  const handleConfirmPayment = () => {
    updateReward(
      { reward_id: selectedRewardId },
      {
        onSuccess: (data) => {
          showSnackbar(data?.message, "success");
          handleCloseDialog();
        },
        onError: (error) => {
          showSnackbar(error?.response?.data?.message, "error");
        },
      }
    );
  };

  const applyFilters = () => {
    setPage(0);
    refetch(start_date);
    refetchRewardCount(start_date);
  };

  return (
    <div className="h-full w-full pt-2 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        {/* Total Referrals */}
        <div className="flex flex-row items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 p-2 bg-[#ebf7f0] shadow-sm rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-black">
              Total Reffered Users:
            </span>
            <span className="text-lg font-semibold text-green-600">
              {totalUsersReffered}
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[#ebf7f0] shadow-sm rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-black">
              Total Reward Earned:
            </span>
            <span className="text-lg font-semibold text-green-600">
              {totalRewardEarned}
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-[#ebf7f0] shadow-sm rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-black">
              Active Users:
            </span>
            <span className="text-lg font-semibold text-green-600">
              {totalActiveUsers}
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-[#ebf7f0] shadow-sm rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-black">
              Inactive Users:
            </span>
            <span className="text-lg font-semibold text-green-600">
              {totalInactiveUsers}
            </span>
          </div>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              label="Date Range"
              onChange={(e) => {
                setDateRange(e.target.value);
                applyFilters();
              }}
              startAdornment={
                <InputAdornment position="start">
                  <CalendarToday
                    sx={{ color: "text.secondary", fontSize: 20 }}
                  />
                </InputAdornment>
              }
            >
              {/* <MenuItem value="7">Last 7 days</MenuItem> */}
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 3 months</MenuItem>
              <MenuItem value="180">Last 6 months</MenuItem>
              <MenuItem value="365">Last year</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Select User */}
        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-md font-medium">Sort:</span>
            <Select
              sx={{
                height: "38px",
                minWidth: "120px",
                backgroundColor: "white",
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "grey.300",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "emerald.500",
                },
                transition: "all 0.2s ease-in-out",
              }}
              onChange={(e) => setPaidStatus(e.target.value)}
              value={paidStatus}
              aria-label="Sort rewards by status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="unpaid">Un-paid</MenuItem>
            </Select>
          </div>

          {/* Select User */}
          <div className="flex items-center gap-2">
            <span className="text-md font-medium">Select User:</span>
            <Select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setPage(0);
              }}
              size="small"
              // sx={{ minWidth: 200 }}
              sx={{
                height: "38px",
                minWidth: "200px",
                backgroundColor: "white",
                borderRadius: "8px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "grey.300",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "emerald.500",
                },
                transition: "all 0.2s ease-in-out",
              }}
              displayEmpty
              renderValue={(selected) => {
                if (selected === "") {
                  return <span style={{ color: "#999" }}>Select User</span>;
                }
                const user =
                  userDropdownlist?.data?.find((u) => u.id === selected) ||
                  null;
                return user
                  ? `${user.full_name} (${user.role})`
                  : "Select User";
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {userDropdownlist?.data?.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.full_name} ({user.role})
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <Paper
        sx={{
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 2,
          flex: 1,
          overflow: "auto",
        }}
      >
        <CustomTable
          rows={rows}
          columns={columns}
          loading={isFetching}
          pagination={{
            page: currentPage,
            rowsPerPage,
            totalRows,
          }}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRows) => setRowsPerPage(newRows)}
          hideFooter={false}
          containerSx={{ overflow: "auto" }}
        />
      </Paper>
      <CommonDialogBox
        open={openDialog}
        handleClose={handleCloseDialog}
        title="Confirm Payment"
        content={
          <div className="flex flex-col space-y-4">
            <p>Are you sure you want to mark this reward as paid?</p>
            <div className="flex justify-end space-x-2">
              <Button onClick={handleCloseDialog} variant="outlined">
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPayment}
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </div>
        }
        width="400px"
      />
    </div>
  );
};
export default ReferralTransactions;
