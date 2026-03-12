"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RecentInvoices from "./RecentInvoices";
import NextInvoice from "./NextInvoice";
import { CustomButton } from "../ThemeRegistry";
import { formatStripePrice } from "@/utils/utils";
import useFetchPremiumPlansForTrainer from "@/helpers/hooks/trainer/useFetchPremiumPlansForTrainer";
import useFetchUpcomingInvoiceForTrainer from "@/helpers/hooks/trainer/useFetchUpcomingInvoiceForTrainer";
import useFetchRecentInvoiceForTrainer from "@/helpers/hooks/trainer/useFetchRecentInvoiceForTrainer";
import { getLocalStorageItem } from "@/helpers/localStorage";

const formatMetadataKey = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const formatMetadataValue = (value) => (value === "0" ? "Unlimited" : value);

const ActivePlanTab = ({ setActiveTab, setUpgradePlan, upgradePlan }) => {
  // const [upgradePlan, setUpgradePlan]=useState(false);
  const role = getLocalStorageItem("role");
  const trainerRole = role === "trainer";
  const [mounted, setMounted] = useState(false);
  const {
    data: invoiceData,
    isError: isInvoiceError,
    isLoading: isInvoiceLoading,
  } = useFetchUpcomingInvoiceForTrainer();

  const {
    data: recentInvoiceData,
    isError: isRecentInvoiceError,
    isLoading: isRecentInvoiceLoading,
  } = useFetchRecentInvoiceForTrainer();

  const ActivePlanCard = ({ setActiveTab, setUpgradePlan }) => {
    const { plans, isLoading, isError, currentSubscription } =
      useFetchPremiumPlansForTrainer();

    const getActivePlanDetails = () => {
      if (currentSubscription) {
        const match = plans?.find(
          (plan) => plan.product?.id === currentSubscription.product_id
        );
        return match ?? plans?.[0] ?? null;
      }
      return plans?.[0] ?? null;
    };

    useEffect(() => {
      setMounted(true);
    }, []);
    if (!mounted) {
      return null;
    }

    if (isLoading) {
      return <Skeleton variant="rounded" width="100%" height={300} />;
    }

    if (isError) {
      return (
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            p: 3,
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography color="error">
            Unable to load plan details. Please try again later.
          </Typography>
        </Paper>
      );
    }

    const activeDetails = getActivePlanDetails();
    if (!activeDetails) return null;

    const planName = activeDetails.product?.name ?? "Free Plan";
    const description = activeDetails.product?.description ?? "";
    const price = activeDetails.prices?.[0]?.unit_amount ?? 0;
    const interval = activeDetails.prices?.[0]?.recurring?.interval ?? "month";
    const metadata = activeDetails.product?.metadata ?? {};
    const maxCustomerLimit = metadata.max_customer ?? "0";

    const isCurrentPlan = currentSubscription
      ? activeDetails.product.id === currentSubscription.product_id
      : planName === "Free Plan";

    return (
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "white",
          borderRadius: "12px",
          p: 3,
          border: isCurrentPlan ? "2px solid #109A4E" : "1px solid #e0e0e0",
          position: "relative",
        }}
      >
        {isCurrentPlan && (
          <Chip
            label="CURRENT"
            color="primary"
            size="small"
            sx={{
              position: "absolute",
              top: -11,
              right: 16,
              backgroundColor: "#109A4E",
              fontWeight: 600,
            }}
          />
        )}

        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ textTransform: "uppercase" }}
            >
              {planName}
            </Typography>
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ textTransform: "uppercase" }}
            >
              {price > 0 ? `$${formatStripePrice(price)} USD` : "Free"}
            </Typography>
          </Stack>

          {price > 0 && (
            <Typography
              color="#426686"
              fontSize="14px"
              sx={{ textTransform: "uppercase" }}
            >
              per {interval}
            </Typography>
          )}

          <Typography
            color="#426686"
            fontSize="14px"
            sx={{ textTransform: "uppercase" }}
          >
            {description}
          </Typography>

          <List disablePadding>
            {Object.entries(metadata).map(([key, value]) => (
              <ListItem key={key} disableGutters sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <CheckCircleOutlineIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={`${formatMetadataKey(key)}: ${formatMetadataValue(
                    value
                  )}`}
                  primaryTypographyProps={{
                    fontSize: "14px",
                    textTransform: "capitalize",
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 2 }}>
            <CustomButton
              variant="outlined"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              sx={{ borderColor: "#109A4E", color: "#109A4E" }}
              onClick={() => {
                setActiveTab(1);
                setUpgradePlan(true);
              }}
            >
              Change Plan
            </CustomButton>
            {/* {!trainerRole ?  <CustomButton
              variant="outlined"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              sx={{ borderColor: "#109A4E", color: "#109A4E" }}
              onClick={() => {
                // setActiveTab(1);
                // setUpgradePlan(true);
                console.log("cancel plan")
              }}
            >
              Cancel
            </CustomButton>:   <CustomButton
              variant="outlined"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              sx={{ borderColor: "#109A4E", color: "#109A4E" }}
              onClick={() => {
                setActiveTab(1);
                setUpgradePlan(true);
              }}
            >
              Change Plan
            </CustomButton> } */}
          </Box>
        </Stack>
      </Paper>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <Typography color="#000000" fontSize="24px" fontWeight={600} mb={3}>
          Active Plan
        </Typography>
        <ActivePlanCard
          setActiveTab={setActiveTab}
          setUpgradePlan={setUpgradePlan}
        />
      </Grid>
      <Grid item xs={12} md={5}>
        <Box mb={3}>
          <NextInvoice
            invoice={invoiceData}
            isLoading={isInvoiceLoading}
            isError={isInvoiceError}
          />
        </Box>
        <Typography color="#000000" fontSize="18px" fontWeight={600} mb={2}>
          Recent Invoices
        </Typography>
        <RecentInvoices
          invoiceData={recentInvoiceData}
          setActiveTab={setActiveTab}
          isLoading={isRecentInvoiceLoading}
          isError={isRecentInvoiceError}
        />
      </Grid>
    </Grid>
  );
};

export default ActivePlanTab;
