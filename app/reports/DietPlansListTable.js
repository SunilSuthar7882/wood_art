"use-client";
import CustomTable from "@/component/CommonComponents/CommonTable";
import { useExportMealPlans } from "@/helpers/hooks/report-export-apis/reportExportAPI";
import { useGetreportgetmealplansdata } from "@/helpers/hooks/trainersectionapi/reportmealplansdata";
import { Box, Typography, Paper, Button } from "@mui/material";
import dayjs from "dayjs";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";

const DietPlansListTable = ({ start_date, end_date, dateRange }) => {
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalRows: 0,
  });
  const { page, rowsPerPage, totalRows } = pagination;
  const { mutate: exportMealPlans, isLoading: isMealPlansExporting } =
    useExportMealPlans();

  const {
    data: mealPlansData,
    isFetching: isFetchingmealPlansData,
    refetch: refetchmealPlansData,
  } = useGetreportgetmealplansdata(
    pagination?.page + 1,
    pagination?.rowsPerPage,
    start_date,
    end_date
  );
  useEffect(() => {
    refetchmealPlansData();
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
  const formatNumber = (val) => Number(val ?? 0).toFixed(2);
  const columns = [
    { field: "name", headerName: "Plan Name", width: 200 },
    { field: "plan_created_by", headerName: "Created By", width: 200 },
    { field: "number_of_days", headerName: "Duration", width: 100 },
    { field: "type", headerName: "Type", width: 200 },
    { field: "total_calories", headerName: "Calories", width: 100 },
    { field: "total_protein", headerName: "Protein (g)", width: 100 },
    { field: "total_carbs", headerName: "Carbs (g)", width: 100 },
    { field: "total_fat", headerName: "Fat (g)", width: 100 },
    { field: "total_fluid", headerName: "Fluid (ml)", width: 100 },
    {
      field: "created_at",
      headerName: "Created",
      width: 160,
    },
  ];
  const rows = mealPlansData?.data?.page_data?.map((item) => ({
    id: item.id,
    name: item.name,
    plan_created_by: item.plan_created_by?.full_name,
    number_of_days: item.number_of_days,
    type:
      item.type === "custom"
        ? `custom (${item.plan_customer?.full_name || "Unknown"})`
        : item.type,
    created_at: dayjs(item.created_at).format("MMM D, YYYY"),
    total_calories: formatNumber(item.total_calories),
    total_carbs: formatNumber(item.total_carbs),
    total_protein: formatNumber(item.total_protein),
    total_fat: formatNumber(item.total_fat),
    total_fluid: formatNumber(item.total_fluid), 
  }));
  const handleExportMealPlans = () => {
    exportMealPlans(
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
          onClick={handleExportMealPlans}
          sx={{ mr: 0 }}
        >
          Export CSV
        </Button>
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
            loading={isFetchingmealPlansData}
            hideFooter={false}
            pagination={{
              page,
              rowsPerPage,
              totalRows: mealPlansData?.data?.page_information?.total_data || 0,
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

export default DietPlansListTable;
