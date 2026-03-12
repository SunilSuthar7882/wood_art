"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { useGetTrainerPerformanceData } from "@/helpers/hooks/mamAdmin/mamAdmin";
import CommonTable from "@/component/CommonComponents/CommonTable";
import { useExportTrainerPerformance } from "@/helpers/hooks/report-export-apis/reportExportAPI";

const TrainerPerformanceReport = ({ start_date,dateRange }) => {
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalRows: 0,
  });

  const {
    data: trainerPerformanceData,
    isFetching: isFetchingTrainerPerformanceData,
    refetch: refetchTrainerPerformanceData,
  } = useGetTrainerPerformanceData(pagination.page + 1, pagination.rowsPerPage);
  const rows = Array.isArray(trainerPerformanceData?.data?.page_data)
    ? trainerPerformanceData.data.page_data.map((trainer) => ({
        id: trainer.id,
        name: trainer.full_name || "Unnamed Trainer",
        customers: trainer.total_customers || 0,
        mealPlans: trainer.total_custom_meal_plans || 0,
      }))
    : [];

  const columns = [
    { field: "name", headerName: "Trainer Name", flex: 1 },
    { field: "customers", headerName: "Total Customers", flex: 1 },
    { field: "mealPlans", headerName: "Total Meal Plans", flex: 1 },
  ];

  useEffect(() => {
    refetchTrainerPerformanceData();
  }, [pagination.page, pagination.rowsPerPage,dateRange]);

  const handleChangePage = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setPagination((prev) => ({
      ...prev,
      rowsPerPage: newRowsPerPage,
    }));
  };

  const exportToCSV = (data, filename) => {
    const csvContent = data
      .map((row) => Object.values(row).join(","))
      .join("\n");
    const header = Object.keys(data[0] || {}).join(",") + "\n";
    const blob = new Blob([header + csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  const { mutate: exportTrainerPerformance, isLoading: isExporting } =
    useExportTrainerPerformance();
  const handleExportTrainerPerformance = () => {
    exportTrainerPerformance(
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
  
  const exportToXLS = (data, filename) => {
     
    alert(
      "XLS export functionality would be implemented with a library like xlsx"
    );
  };

  return (
    <Card>
      <CardHeader
        title="Trainer Performance"
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<Download />}
              onClick={handleExportTrainerPerformance}
              disabled={!rows.length}
            >
              Export CSV
            </Button>
          </Stack>
        }
      />
      <CardContent>
        <Paper
          sx={{
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <CommonTable
            columns={columns}
            rows={rows}
            loading={isFetchingTrainerPerformanceData}
            pagination={{
              page: pagination.page,
              rowsPerPage: pagination.rowsPerPage,
              totalRows:
                trainerPerformanceData?.data?.page_information?.total_data || 0,
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Paper>
      </CardContent>
    </Card>
  );
};

export default TrainerPerformanceReport;
