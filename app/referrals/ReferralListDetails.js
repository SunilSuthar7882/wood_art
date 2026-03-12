"use client";

import { useState, useEffect } from "react";
import { Box, Chip, Paper, Typography } from "@mui/material";
import CustomTable from "@/component/CommonComponents/CommonTable";
import { useGetTrainerRewards } from "@/helpers/hooks/rewards/gettrainerrewards";
import dayjs from "dayjs";

const ReferralListDetails = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  const { data, isFetching, refetch } = useGetTrainerRewards(
    page,
    rowsPerPage,
    searchValue
  );

  const pageInfo = data?.data?.page_information || {};
  const currentPage = (pageInfo.current_page ?? 1) - 1; // API 1-based → UI 0-based
  const totalRows = pageInfo.total_data ?? 0;

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, searchValue]);

  const columns = [
    {
      field: "srNo",
      headerName: "Sr. No.",
      width: 80,
      renderCell: (params) =>
        params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    // { field: "id", headerName: "ID", width: 100 },
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
          default:
            color = "default";
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
    // { field: "status", headerName: "Status", width: 150 },

    { field: "earnedDate", headerName: "Earned Date", width: 200 },
  ];

  const rows =
    data?.data?.page_data?.map((row) => ({
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
      earnedDate: dayjs(row.created_at).format("YYYY-MM-DD HH:mm"),
    })) || [];

  return (
    <div className="h-full w-full pt-2 flex flex-col">
      {/* <div className="mb-3">
        <input
          type="text"
          placeholder="Search trainer rewards..."
          className="bg-transparent border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div> */}
      <div className="flex items-center gap-2 p-2 bg-[#16a34a] w-fit shadow-sm rounded-lg border border-gray-200 mb-2 ">
        <span className="text-sm font-medium text-white">Total Referrals:</span>
        <span className="text-lg font-semibold text-white">{totalRows}</span>
      </div>
      {/* <Box>

<Typography bgcolor={"#ffffff"}>12323423</Typography>
</Box> */}

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
    </div>
  );
};
export default ReferralListDetails;
