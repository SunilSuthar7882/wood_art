import React, { useState } from "react";
import {
  Typography,
  Paper,
  Stack,
  Box,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import ReceiptIcon from "@mui/icons-material/Receipt";
import dayjs from "dayjs";
import { formatCurrency, StatusChip } from "@/utils/utils";

// Styled components for better aesthetics
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: "12px",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

// Enhanced Custom toolbar to ensure visibility
function CustomToolbar(props) {
  const { pageSize, setPageSize, onLimitChange } = props;

  const handleLimitChange = (event) => {
    const newLimit = event.target.value;
    setPageSize(newLimit);
    if (onLimitChange) {
      onLimitChange(newLimit);
    }
  };

  return (
    <GridToolbarContainer
      sx={{
        display: "flex",
        justifyContent: "space-between",
        p: 1,
        width: "100%",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <GridToolbarExport />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="limit-select-label">Limit</InputLabel>
        <Select
          labelId="limit-select-label"
          id="limit-select"
          value={pageSize}
          label="Limit"
          onChange={handleLimitChange}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
          <MenuItem value={"all"}>All</MenuItem>
        </Select>
      </FormControl>
    </GridToolbarContainer>
  );
}

const InvoiceHistory = ({
  invoiceData,

  isLoading,
  isError,
  refetch,
}) => {
  // State for managing page size
  const [pageSize, setPageSize] = useState(5);

  // Handle limit change and refetch data
  const handleLimitChange = () => {
    // Ensure we refetch data when limit changes
    setTimeout(() => {
      refetch();
    }, 0);
  };

  // DataGrid columns configuration with centered alignment
  const columns = [
    {
      field: "invoice_number",
      headerName: "Invoice No.",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Typography variant="body2">{params.value || "N/A"}</Typography>
        </Box>
      ),
    },
    {
      field: "created",
      headerName: "Date",
      flex: 1,
      headerAlign: "center",
      align: "center",
      valueGetter: (params) => new Date(params?.row?.created),
      renderCell: (params) => (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Typography variant="body2">
            {dayjs(params.row.created).format("MMM D, YYYY")}
          </Typography>
        </Box>
      ),
    },
    {
      field: "total",
      headerName: "Amount",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            {formatCurrency(params.row.total, params.row.currency)}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <StatusChip status={params.row.status} />,
    },
  ];

  // Invoice history section rendering
  const renderInvoiceHistorySection = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={28} />
        </Box>
      );
    }

    if (invoiceData.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          No invoice history available.
        </Alert>
      );
    }

    return (
      <Box sx={{ height: 400, width: "100%", mt: 2 }}>
        <DataGrid
          rows={invoiceData.map((invoice, index) => ({
            ...invoice,
            id: invoice.invoice_number || `invoice-${index}`,
          }))}
          columns={columns}
          // Use rowsPerPage instead of pageSize for newer versions of DataGrid
          pageSize={pageSize === "all" ? 100 : pageSize}
          // These settings should hide pagination properly
          hideFooter={true}
          disableColumnFilter={false}
          disableColumnSelector={false}
          disableDensitySelector={false}
          // Ensure selection is disabled
          disableSelectionOnClick
          disableRowSelectionOnClick
          // Show loading state
          loading={isLoading}
          // CRITICAL: Use slots instead of components in newer MUI DataGrid versions
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            toolbar: {
              pageSize,
              setPageSize,
              onLimitChange: handleLimitChange,
            },
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              borderRadius: "8px 8px 0 0",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f9f9f9",
            },
            // Enable column menu button for additional options
            "& .MuiDataGrid-columnHeaderTitleContainer": {
              padding: "0 8px",
            },
            // Hide footer (rows per page, etc.)
            "& .MuiDataGrid-footerContainer": {
              display: "none",
            },
            // Center column headers text
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
            },
            // Ensure toolbar is visible
            "& .MuiDataGrid-toolbarContainer": {
              display: "flex",
              justifyContent: "space-between",
              padding: "8px",
              backgroundColor: "#fafafa",
              borderRadius: "8px 8px 0 0",
            },
          }}
        />
      </Box>
    );
  };

  return (
    <Stack spacing={3}>
      {/* Invoice History Section */}
      <StyledPaper>
        <SectionTitle variant="h6">
          <ReceiptIcon sx={{ mr: 1 }} />
          Invoice History
        </SectionTitle>
        {renderInvoiceHistorySection()}
      </StyledPaper>
    </Stack>
  );
};

export default InvoiceHistory;
