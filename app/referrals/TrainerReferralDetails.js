"use client"
import CustomTable from "@/component/CommonComponents/CommonTable";
import { useExportTrainer } from "@/helpers/hooks/report-export-apis/reportExportAPI";
import { useGetreportgettrainer } from "@/helpers/hooks/trainersectionapi/reportgettrainers";
import { Box, Typography, Paper, Button } from "@mui/material";
import dayjs from "dayjs";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";

const TrainerReferralDetails = ({ start_date, end_date, dateRange }) => {
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalRows: 0,
  });
  const { page, rowsPerPage, totalRows } = pagination;
  const { mutate: exportTrainer, isLoading: istrainerExporting } =
    useExportTrainer();
  const {
    data: trainersData,
    isFetching: isFetchingtrainersData,
    refetch: refetchtrainersData,
  } = useGetreportgettrainer(
    pagination?.page + 1,
    pagination?.rowsPerPage,
    start_date,
    end_date
  );

  useEffect(() => {
    refetchtrainersData();
  }, [pagination?.page, pagination?.rowsPerPage, dateRange]);

  const onPageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setPagination((prev) => ({
      ...prev,
      rowsPerPage: newRowsPerPage,
      // page: 0,
    }));
  };
  const columns = [
    { field: "full_name", headerName: "Name", width: 250 },
    { field: "email", headerName: "Email", width: 300 },
    {
      field: "phone_number",
      headerName: "Phone",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "referral_amount",
      headerName: "Reward",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const status = params.row;
        return (
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"100%"}
            width={"100%"}
          >
            {status.status === "active" ? (
              <Typography
                sx={{
                  bgcolor: "#26923e",
                  p: 0.2,
                  borderRadius: "3px",
                  color: "white",
                  px: 1,
                }}
              >
                {status.status}
              </Typography>
            ) : (
              <Typography
                sx={{ bgcolor: "#e0e0e0", p: 0.2, borderRadius: "3px", px: 1 }}
              >
                {status.status}
              </Typography>
            )}
          </Box>
        );
      },
    },
    {
      field: "created_at",
      headerName: "Created",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
  ];
  const rows = trainersData?.data?.page_data?.map((item, index) => ({
    id: item.id,
    full_name: item.full_name,
    email: item.email,
    phone_number: item.phone_number,
    status: item.status,
    created_at: dayjs(item.created_at).format("MMM D, YYYY"),
  }));
  const handleExportTrainer = () => {
    exportTrainer(
      { start_date },
      {
        onSuccess: (res) => {
          const fileUrl = res?.data?.file;

          if (fileUrl) {
            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = fileUrl.split("/").pop();
            document.body.appendChild(link);
            link.click();
            link.remove();
          } else {
            console.error("File URL not found in API response.");
          }
        },
      }
    );
  };
  return (
    <Box
      height={"100%"}
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      flex={1}
      sx={{ overflow: "auto" }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          mt: 1,
        }}
      >
        <Typography variant="body1" color="text.secondary"></Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<Download />}
          onClick={handleExportTrainer}
        >
          Export CSV
        </Button>
        {/* </DialogActions> */}
      </Box>
      <Paper
        sx={{
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 2,
          flex: 1,
          overflow: "auto",
          display: "flex",
          minHeight: 300,
        }}
      >
        <Box sx={{ flex: 1, overflow: "auto", display: "flex" }}>
          <CustomTable
            columns={columns}
            rows={rows}
            loading={isFetchingtrainersData}
            hideFooter={false}
            pagination={{
              page,
              rowsPerPage,
              totalRows: trainersData?.data?.page_information?.total_data || 0,
            }}
            onPageChange={onPageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            containerSx={{ overflow: "auto" }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TrainerReferralDetails;
