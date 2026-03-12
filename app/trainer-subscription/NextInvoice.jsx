import React from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  styled,
} from "@mui/material";
import { CalendarToday as CalendarTodayIcon } from "@mui/icons-material";
import { formatCurrency } from "@/utils/utils";
import dayjs from "dayjs";

const NextInvoice = ({ invoice, isLoading, isError }) => {
  console.log("invoice", invoice);
  // Styled components
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
    marginBottom: theme.spacing(1),
  }));

  const renderUpcomingInvoiceSection = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (!invoice || !invoice.line_items || invoice.line_items.length === 0) {
      return (
        <Alert severity="info">
          No upcoming invoice information available.
        </Alert>
      );
    }

    const lineItem = invoice.line_items[0];

    return (
      <Box>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Next Billing Date
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {lineItem.period?.end
                  ? dayjs(lineItem.period.end).format("MMMM D, YYYY")
                  : "—"}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Plan Details
            </Typography>
            <Typography variant="body1">
              {lineItem.description || "—"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Amount Due
            </Typography>
            <Typography variant="body1" fontWeight={600} color="primary">
              {formatCurrency(invoice.amount_due, invoice.currency)}
            </Typography>
          </Box>
        </Stack>
      </Box>
    );
  };

  return (
    <Stack spacing={3}>
      <StyledPaper>
        <SectionTitle variant="h6">
          <CalendarTodayIcon sx={{ mr: 1 }} />
          Upcoming Invoice
        </SectionTitle>
        <Divider className="!mb-2" />
        {renderUpcomingInvoiceSection()}
      </StyledPaper>
    </Stack>
  );
};

export default NextInvoice;
