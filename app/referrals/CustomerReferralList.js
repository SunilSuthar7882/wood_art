"use client";

import { useState, useEffect } from "react";
import { Paper } from "@mui/material";
import CustomTable from "@/component/CommonComponents/CommonTable";
import { useGetUserRewards } from "@/helpers/hooks/rewards/getuserrewards";

const CustomerReferralList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  const { data, isFetching, refetch } = useGetUserRewards(
    page,
    rowsPerPage,
    searchValue
  );

  const totalRows = data?.data?.page_information?.total_data || 0;

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
    { field: "rewardName", headerName: "Reward Name", width: 250 },
    { field: "points", headerName: "Points", width: 150 },
    { field: "earnedDate", headerName: "Earned Date", width: 200 },
  ];

  const rows =
    data?.data?.page_data?.map((row) => ({
      id: row.id,
      rewardName: row.reward_name,
      points: row.points,
      earnedDate: row.earned_date,
    })) || [];

  return (
    <div className="h-full flex flex-col w-full p-2">
      {/* <div className="mb-3">
        <input
          type="text"
          placeholder="Search rewards..."
          className="bg-transparent border rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div> */}

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
            page,
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

export default CustomerReferralList;
