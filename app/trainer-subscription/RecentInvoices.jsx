import React from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  styled,
} from "@mui/material";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/utils";
import { getLocalStorageItem } from "@/helpers/localStorage";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: "12px",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
}));

const RecentInvoices = ({
  invoiceData = [],
  setActiveTab,
  isLoading,
  isError,
}) => {
  const hasData = Array.isArray(invoiceData) && invoiceData.length > 0;
  const role = getLocalStorageItem("role");
  const trainerRole = role === "trainer";
  return (
    <StyledPaper>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          fontSize: "1rem",
        }}
      >
        Recent Invoices
      </Typography>

      {/* Loading Spinner */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={24} />
        </Box>
      ) : isError ? (
        <Typography variant="body2" color="error" textAlign="center" py={2}>
          Failed to load invoices.
        </Typography>
      ) : !hasData ? (
        <Typography variant="body2" textAlign="center" py={2}>
          No recent invoices available.
        </Typography>
      ) : (
        invoiceData.slice(0, 5).map((invoice, idx) => {
          const formattedDate = invoice.created
            ? dayjs(invoice.created).format("YYYY-MM-DD")
            : "N/A";

          const formattedAmount = formatCurrency(
            invoice.total,
            invoice.currency
          );

          return (
            <Box
              key={invoice.invoice_number || `invoice-${idx}`}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
                borderBottom:
                  idx < invoiceData.length - 1 ? "1px solid #f0f0f0" : "none",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {formattedDate}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formattedAmount}
              </Typography>
            </Box>
          );
        })
      )}

      {/* View All Link */}

      {/* {trainerRole && hasData && ( */}
      { hasData && (
        <Box mt={2} textAlign="center">
          <Typography
            variant="body2"
            sx={{
              color: "#109A4E",
              cursor: "pointer",
              fontWeight: 500,
              textDecoration: "underline",
            }}
            onClick={() => { if(trainerRole){
              setActiveTab(2)
            } else{
              setActiveTab(1)
            }}}
          >
            View All Invoices
          </Typography>
        </Box>
      )}
    </StyledPaper>
  );
};

export default RecentInvoices;
