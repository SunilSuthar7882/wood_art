"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
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

import { CustomButton } from "../ThemeRegistry";
import { formatStripePrice } from "@/utils/utils";
import useFetchPremiumPlansForTrainer from "@/helpers/hooks/trainer/useFetchPremiumPlansForTrainer";
import useFetchUpcomingInvoiceForTrainer from "@/helpers/hooks/trainer/useFetchUpcomingInvoiceForTrainer";
import useFetchRecentInvoiceForTrainer from "@/helpers/hooks/trainer/useFetchRecentInvoiceForTrainer";
import { getLocalStorageItem } from "@/helpers/localStorage";
import NextInvoice from "../trainer-subscription/NextInvoice";
import RecentInvoices from "../trainer-subscription/RecentInvoices";
import { useCancelStripeSubscription } from "@/helpers/hooks/stripeflowapi/customer/CancelCustomerStripeSubscription";
import CommonDialogBox from "@/component/CommonDialogBox";
import { useSnackbar } from "../contexts/SnackbarContext";
import { height } from "@mui/system";

const formatMetadataKey = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const formatMetadataValue = (value) => (value === "0" ? "Unlimited" : value);

const ActivePlanTabcustomer = ({
  subscriptionData,
  setActiveTab,
  // isFetching,
}) => {
  const hasSubscription = !!subscriptionData?.current_subscription;
  const canceledAt = subscriptionData?.current_subscription?.canceled_at
    ? new Date(subscriptionData.current_subscription.canceled_at)
    : null;
  const periodEnd = subscriptionData?.current_subscription?.current_period_end
    ? new Date(subscriptionData.current_subscription.current_period_end)
    : null;
  // console.log("canceledAt", canceledAt);
  // console.log("periodEnd", periodEnd);
  const shouldFetchInvoice =
  hasSubscription && (!canceledAt || canceledAt >= periodEnd);
  // console.log("shouldFetchInvoice", shouldFetchInvoice);
  // const [upgradePlan, setUpgradePlan]=useState(false);
  const { showSnackbar } = useSnackbar();
  const role = getLocalStorageItem("role");
  const trainerRole = role === "trainer";
  const [mounted, setMounted] = useState(false);
  const {
    data: invoiceData,
    isError: isInvoiceError,
    isLoading: isInvoiceLoading,
  } = useFetchUpcomingInvoiceForTrainer({
   enabled: hasSubscription && shouldFetchInvoice,
  });

  const {
    data: recentInvoiceData,
    isError: isRecentInvoiceError,
    isLoading: isRecentInvoiceLoading,
  } = useFetchRecentInvoiceForTrainer();
  const [openDialog, setOpenDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  //   const { mutate: cancelSubscription, isLoading } =
  //     useCancelStripeSubscription();
  const cancelMutation = useCancelStripeSubscription();
  const handleCancelConfirm = () => {
    setIsCancelling(true);
    cancelMutation.mutate(undefined, {
      onSuccess: (data) => {
        showSnackbar(data?.message, "success");
        setOpenDialog(false);
      },
      onError: (error) => {
        showSnackbar(error?.response?.data?.message, "error");
      },
      onSettled: () => {
        setIsCancelling(false); // stop loading after success or error
      },
    });
  };
  // if (isFetching) {
  //   return <Skeleton variant="rounded" width="100%" height={300} />;
  // }
  const ActivePlanCard = ({ setActiveTab, subscriptionData }) => {
    const { plans, isLoading, isError, currentSubscription } =
      useFetchPremiumPlansForTrainer();
    console.log(subscriptionData);
    // const getActivePlanDetails = () => {
    //   if (currentSubscription) {
    //     const match = plans?.find(
    //       (plan) => plan.product?.id === currentSubscription.product_id
    //     );
    //     return match ?? plans?.[0] ?? null;
    //   }
    //   return plans?.[0] ?? null;
    // };

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

    // const activeDetails = getActivePlanDetails();
    const activeDetails = subscriptionData;
    if (!activeDetails) return null;

    // const planName = activeDetails.product?.name ?? "Free Plan";
    // const description = activeDetails.product?.description ?? "";
    // const price = activeDetails.prices?.[0]?.unit_amount ?? 0;
    // const interval = activeDetails.prices?.[0]?.recurring?.interval ?? "month";
    // const metadata = activeDetails.product?.metadata ?? {};
    // const maxCustomerLimit = metadata.max_customer ?? "0";

    // const isCurrentPlan = currentSubscription
    //   ? activeDetails.product.id === currentSubscription.product_id
    //   : planName === "Free Plan";
    const currentSub = activeDetails.current_subscription;

    // Find plan matching the product_id of current subscription
    const plan = activeDetails.plans.find(
      (p) => p.product.id === currentSub.product_id
    );
    const canceled_at = activeDetails?.current_subscription?.canceled_at;
    const cancel_at = activeDetails?.current_subscription?.cancel_at;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const cancelMessage = [
      canceled_at &&
        `This plan was canceled on ${new Date(canceled_at).toLocaleString(
          "en-IN",
          { timeZone: timezone }
        )}`,
      cancel_at &&
        `and will end on ${new Date(cancel_at).toLocaleString("en-IN", {
          timeZone: timezone,
        })}`,
    ]
      .filter(Boolean)
      .join(" ");

    //  let cancelMessage = null;
    // if (canceled_at) {
    //   cancelMessage = `This plan was canceled on ${new Date(canceled_at).toLocaleString("en-IN", {
    //     timeZone: timezone,
    //   })}`;
    // } else if (cancel_at) {
    //   cancelMessage = `This plan will be canceled on ${new Date(cancel_at).toLocaleString("en-IN", {
    //     timeZone: timezone,
    //   })}`;
    // }
    // const showCancelButton =
    //   activeDetails?.current_subscription?.cancel_at !== "null";
    const showCancelButton =
      activeDetails?.current_subscription?.cancel_at === null; // true if subscription exists
    const showMessage =
      !activeDetails?.current_subscription?.cancel_at !== null;
    const price = plan?.prices[0]?.unit_amount
      ? (plan.prices[0].unit_amount / 100).toFixed(2)
      : "N/A";
    return (
      <>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "white",
            borderRadius: "12px",
            p: 3,
            border: "1px solid #e0e0e0",
            position: "relative",
          }}
        >
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
                {plan?.product.name || "Plan Name"}
              </Typography>
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{ textTransform: "uppercase" }}
              >
                ${price} {plan?.prices[0]?.currency}
                {/* ${price}  {plan?.prices[0]?.recurring.interval} */}
                {/* {price > 0 ? `$${formatStripePrice(price)} USD` : "Free"} */}
              </Typography>
            </Stack>
            <Typography
              color="#426686"
              fontSize="14px"
              sx={{ textTransform: "uppercase" }}
            >
              per {plan?.prices[0]?.recurring.interval}
            </Typography>
            <Box
              display={"flex"}
              gap={1}
              justifyContent={"start"}
              alignItems={"center"}
            >
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
              <Typography
                fontSize={"14px"}
                fontWeight={400}
                color="textSecondary"
              >
                Status: {currentSub.status}
              </Typography>
            </Box>
            <Box
              display={"flex"}
              gap={1}
              justifyContent={"start"}
              alignItems={"center"}
            >
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
              <Typography
                fontSize={"14px"}
                fontWeight={400}
                color="textSecondary"
              >
                Price: ${price} / {plan?.prices[0]?.recurring.interval}
              </Typography>
            </Box>

            <Box
              display={"flex"}
              gap={1}
              justifyContent={"start"}
              alignItems={"center"}
            >
              <CheckCircleOutlineIcon color="primary" fontSize="small" />
              <Typography
                fontSize={"14px"}
                fontWeight={400}
                color="textSecondary"
              >
                Current Period:{" "}
                {new Date(currentSub.current_period_start).toLocaleDateString()}{" "}
                - {new Date(currentSub.current_period_end).toLocaleDateString()}
              </Typography>
            </Box>
            {showMessage && (
              <Box sx={{ mt: 2, color: "red" }}>
                <Typography variant="body2">{cancelMessage}</Typography>
              </Box>
            )}

            {showCancelButton && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <CustomButton
                  variant="contained"
                  color="error"
                  onClick={() => setOpenDialog(true)}
                  sx={{ height: "40px" }}
                >
                  Cancel
                </CustomButton>
              </Box>
            )}
          </Stack>
        </Paper>
      </>
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
          subscriptionData={subscriptionData}
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

      <CommonDialogBox
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        title="Cancel Subscription"
        content={
          <div className="flex flex-col space-y-4">
            <p>Are you sure you want to cancel this plan?</p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setOpenDialog(false)}
                variant="outlined"
                // disabled={cancelMutation.isLoading}
                disabled={isCancelling}
              >
                No
              </Button>
              <Button
                onClick={handleCancelConfirm}
                variant="contained"
                color="error"
                disabled={isCancelling}
                // disabled={cancelMutation.isLoading}
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </Button>
            </div>
          </div>
        }
        width="400px"
      />
    </Grid>
  );
};

export default ActivePlanTabcustomer;
