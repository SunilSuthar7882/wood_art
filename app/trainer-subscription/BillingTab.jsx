"use client";
import { Box, Typography } from "@mui/material";

import InvoiceHistory from "./InvoiceHistory";
import NextInvoice from "./NextInvoice";

import useFetchUpcomingInvoiceForTrainer from "@/helpers/hooks/trainer/useFetchUpcomingInvoiceForTrainer";
import useFetchRecentInvoiceForTrainer from "@/helpers/hooks/trainer/useFetchRecentInvoiceForTrainer";
const BillingTab = () => {
  const {
    data: invoiceData,
    isError: isInvoiceError,
    isLoading: isInvoiceLoading,
  } = useFetchUpcomingInvoiceForTrainer();

  const {
    data: recentInvoiceData,
    isError: isRecentInvoiceError,
    isLoading: isRecentInvoiceLoading,
    refetch: refetchInvoiceList,
  } = useFetchRecentInvoiceForTrainer();

  return (
    <Box>
      <Typography color="#000000" fontSize="24px" fontWeight={600} mb={3}>
        Billing & Invoices
      </Typography>
      <Box>
        <NextInvoice
          invoice={invoiceData}
          isLoading={isInvoiceLoading}
          isError={isInvoiceError}
        />

        <Box mt={3}>
          <InvoiceHistory
            invoiceData={recentInvoiceData}
            isLoading={isRecentInvoiceLoading}
            isError={isRecentInvoiceError}
            refetch={refetchInvoiceList}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BillingTab;
