"use client";

import CustomTable from "@/component/CommonComponents/CommonTable";
import { Routes } from "@/config/routes";
import { useGetcustomergetplanerequesttrainer } from "@/helpers/hooks/trainersectionapi/customergetplanerequesttrainer";
import {
  Autocomplete,
  Box,
  Chip,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

const getStatusChipProps = (status) => {
  switch (status) {
    case "pending":
      return { label: "Pending", color: "warning", variant: "outlined" };
    case "in_progress":
      return { label: "In Progress", color: "success", variant: "outlined" };
    default:
      return { label: "Completed", color: "default", variant: "outlined" };
  }
};

const Page = () => {
  const router = useRouter();
  const [activeStatus, setActiveStatus] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, refetch, isLoading } = useGetcustomergetplanerequesttrainer(
    page + 1,
    rowsPerPage,
    activeStatus
  );

  const pageInfo = data?.data?.page_data || {};
  const currentPage = (pageInfo.current_page ?? 1) - 1; // API 1-based → UI 0-based
  const totalRows = pageInfo.total_data ?? 0;

  useEffect(() => {
    refetch();
  }, [page, activeStatus]);

  const rows =
    data?.data?.page_data?.map((row) => {
      const plan = row.customer?.custom_plan;
      return {
        id: row.id,
        name: row.customer?.full_name,
        email: row.customer?.email,
        status: row.status,
        planName: plan?.name || "No custom plan assigned",
        planType: plan?.type || "-",
        createdAt: plan?.created_at
          ? dayjs(plan.created_at).format("MM-DD-YYYY")
          : "-",
        isDraft: plan?.is_draft ? "Yes" : "No",
      };
    }) || [];

  const columns = [
    {
      field: "name",
      headerName: "Customer Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.7,
      renderCell: (params) => {
        const chipProps = getStatusChipProps(params.row.status);
        return <Chip {...chipProps} />;
      },
    },
    {
      field: "planName",
      headerName: "Plan Name",
      flex: 1,
    },
    {
      field: "planType",
      headerName: "Plan Type",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
    },
    {
      field: "isDraft",
      headerName: "Draft",
      flex: 0.5,
    },
  ];

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleRowClick = (params) => {
    router.push(`${Routes.customertrainerplandetails}${params.row.id}`);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
      p={2}
      gap={2}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        height="40px"
      >
        <Typography fontSize={24} fontWeight={700}>
          Custom Diet Plan Requests From Customer
        </Typography>
        <Autocomplete
          options={statusOptions}
          getOptionLabel={(option) => option.label}
          value={
            statusOptions.find((option) => option.value === activeStatus) ||
            null
          }
          onChange={(event, newValue) => {
            setActiveStatus(newValue ? newValue.value : null);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="All"
              variant="outlined"
              sx={{
                width: "170px",
                backgroundColor: "white",
                "& .MuiOutlinedInput-root": {
                  height: "46px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "8px",
                },
              }}
            />
          )}
          isOptionEqualToValue={(option, value) =>
            option.value === value?.value
          }
          clearOnBlur
          disableClearable={false}
        />
      </Box>
      <Paper
        sx={{
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 2,
          flex: 1,
          overflow: "hidden",
        }}
      >
        <CustomTable
          rows={rows}
          columns={columns}
          loading={isLoading}
          onRowClick={handleRowClick}
          pagination={{
                page: currentPage,
                rowsPerPage,
                totalRows,
              }}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
};

export default Page;
