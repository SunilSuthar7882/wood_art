"use client"
import CustomTable from "@/component/CommonComponents/CommonTable";
import { useGetCustomerPayments } from "@/helpers/hooks/report-export-apis/getcustomerpaymentslist";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useExportpaymentRole } from "@/helpers/hooks/report-export-apis/reportExportAPI";

const columns = [
  { field: "full_name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 250 },
  {
    field: "phone_number",
    headerName: "Phone",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "customer_stripe_id",
    headerName: "Stripe ID",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "payment",
    headerName: "Payment ($)",
    width: 100,
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
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height={"100%"}
        >
          <Typography
            sx={{
              bgcolor: status.status === "active" ? "#26923e" : "#e0e0e0",
              p: 0.2,
              px: 1,
              borderRadius: "3px",
              color: status.status === "active" ? "white" : "black",
            }}
          >
            {status.status}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: "created_at",
    headerName: "Created",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
];

const CustomerPaymentListTable = ({
  open,
  customerPaymentData,
  start_date,
}) => {
  const {
    mutate: exportCustomerPayment,
    isLoading: iscustomerpaymentExporting,
  } = useExportpaymentRole();
  const handleExportCustomerPayment = () => {
    exportCustomerPayment(
      { start_date: start_date, role: "customer" },
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
  const isReadyToFetch =
    open && !!customerPaymentData?.customer_ids?.length && !!start_date;

  const [customerPaymentListPagination, setCustomerPaymentListPagination] =
    useState({
      page: 0,
      rowsPerPage: 10,
      totalRows: 0,
    });

  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalRows: 0,
  });

  const [tableData, setTableData] = useState([]);
  const [Totalrowdata, setTotalrowdata] = useState(null);

  const { mutate: getCustomerPaymentsList, isPending } =
    useGetCustomerPayments();

  const fetchCustomerPayments = () => {
    const payload = {
      page: pagination.page + 1,
      limit: pagination.rowsPerPage,
      start_date: start_date,
      customer_ids: customerPaymentData?.customer_ids,
    };

    getCustomerPaymentsList(payload, {
      onSuccess: (response) => {
        const pageData = response?.data?.page_data || [];
        const totalRows = response?.data?.page_information?.total_data || 0;

        setCustomerPaymentListPagination((prev) => ({
          ...prev,
          totalRows,
        }));

        const formattedRows = pageData.map((item) => ({
          id: item.id,
          full_name: item.full_name,
          email: item.email,
          phone_number: item.phone_number,
          status: item.status,
          customer_stripe_id: item.customer_stripe_id,
          payment: item.payment,
          created_at: dayjs(item.created_at).format("MMM D, YYYY"),
        }));

        setTableData(formattedRows);
        setTotalrowdata(response);
      },
    });
  };
  useEffect(() => {
    if (isReadyToFetch) {
      fetchCustomerPayments();
    }
  }, [pagination.page, pagination.rowsPerPage]);

  const handleChangePage = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setPagination((prev) => ({
      ...prev,
      rowsPerPage: newRowsPerPage,
    }));
  };
  return (
    <Box height="100%" width="100%" display="flex" flexDirection="column">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={1}
        mb={1}
      >
        <Typography variant="body1" color="text.secondary">
          {/* Optional summary */}
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<Download />}
          onClick={handleExportCustomerPayment}
        >
          Export CSV
        </Button>
      </Box>

      <Paper
        sx={{
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box flex={1} overflow="auto">
          <CustomTable
            columns={columns}
            rows={tableData}
            loading={isPending}
            hideFooter={false}
            pagination={{
              page: pagination.page,
              rowsPerPage: pagination.rowsPerPage,
              totalRows: Totalrowdata?.data?.page_information?.total_data || 0,
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerPaymentListTable;
