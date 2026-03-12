"use client";
import React, { useCallback, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Skeleton,
  Stack,
  Radio,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  TextField,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import { CustomButton } from "../ThemeRegistry";
import { formatStripePrice, PLAN_FEATURES } from "@/utils/utils";

// Move PlanCard component outside to prevent recreation on re-renders
const PlanCard = ({
  selectedPlan,
  setSelectedPlan,
  plan,
  selectedValue,
  activeProductId,
  handleChange,
  couponCode,
  setCouponCode,
  handlePayNow,
  isPurchaseLoading,
}) => {
  const isSelected = selectedValue === plan.product.id;
  const isActive = activeProductId === plan.product.id;
  const planName = plan.product.name;
  const price = plan.prices[0]?.unit_amount || 0;
  const interval = plan.prices[0]?.recurring?.interval || "month";
  const description = plan.product.description;
  const productId = plan.product.id;
  const priceId = plan.prices[0]?.id;
  const isPremium = planName === "Premium Plan";

  const metadata = plan.product.metadata || {};
  const dynamicFeatures = [
    `Max customers: ${metadata.max_customer || "N/A"}`,
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: isActive ? "#f2fbf6" : "white",
        borderRadius: "12px",
        p: 1.5,
        border: isSelected
          ? "2px solid #109A4E"
          : isActive
          ? "2px solid #109A4E"
          : "2px solid #cdecd9",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: isSelected ? "scale(1.02)" : "scale(1)",
        position: "relative",
        mb: 2,
        "&:hover": {
          borderColor: "#109A4E",
          boxShadow: "0 4px 12px rgba(16, 154, 78, 0.15)",
        },
      }}
      onClick={() => handleChange({ target: { value: productId } })}
    >
      {isPremium && (
        <Chip
          icon={<StarIcon fontSize="small" />}
          label="MOST POPULAR"
          color="primary"
          size="small"
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            backgroundColor: "#109A4E",
            fontWeight: 600,
          }}
        />
      )}

      {isActive && (
        <Chip
          icon={<CheckCircleOutlineIcon fontSize="small" />}
          label="Current Plan"
          color="success"
          size="small"
          sx={{
            backgroundColor: "#dff5e5",
            fontWeight: 500,
            color: "black",
          }}
        />
      )}

      <Stack direction="column" spacing={1.5} >
        <Stack direction="row" spacing={1} alignItems="center" >
          <Radio
            checked={isSelected || isActive}
            onChange={handleChange}
            value={productId}
            sx={{ p: 0 }}
          />
          <Typography variant="h6" fontWeight={600}>
            {planName}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
           sx={{ mt: "4px !important" }}
        >
          <Typography color="#000000" fontSize="14px" fontWeight={500} >
            {description}
          </Typography>
          <Stack alignItems="flex-end">
            <Typography variant="h5" fontWeight={600} color="#109A4E">
              {price === 0 ? "Free" : `$${formatStripePrice(price)} USD`}
            </Typography>
            {price > 0 && (
              <Typography color="#426686" fontSize="14px">
                per {interval}
              </Typography>
            )}
          </Stack>
        </Stack>

        <List disablePadding >
          {dynamicFeatures.map((feature, idx) => (
            <ListItem key={idx} disableGutters sx={{ py: 0.25 }}>
              <ListItemIcon sx={{ minWidth: 25 }}>
                <CheckCircleOutlineIcon
                  color={isSelected ? "primary" : "action"}
                  fontSize="small"
                />
              </ListItemIcon>
              <ListItemText 
                primary={feature}
                primaryTypographyProps={{
                  fontSize: "13.5px",
                  color: isSelected ? "#000" : "#555",
                }}
              />
            </ListItem>
          ))}
        </List>

        {isSelected && !isActive && price > 0 && (
          <Box>
            <TextField
              label="Coupon Code"
              variant="outlined"
              fullWidth
              sx={{ mt: 1.5 }}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="ENTER COUPON CODE"
            />

            <Box sx={{ mt: 1.5 }}>
              <CustomButton
                variant="contained"
                fullWidth
                endIcon={<ArrowForwardIcon />}
                onClick={() => {
                  setSelectedPlan(plan);
                  localStorage.setItem("selectedPlan", JSON.stringify(plan));
                  handlePayNow(
                    productId,
                    priceId,
                    formatStripePrice(price),
                    couponCode ? couponCode : ""
                  );
                }}
                loading={isPurchaseLoading}
                loadingIndicator="Loading…"
                disabled={isPurchaseLoading}
              >
                Select Plan
              </CustomButton>
            </Box>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

const BrowsePlansTab = ({
  subscriptionData,
  isFetching,
  isPurchaseLoading,
  handlePayNow,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const activeProductId =
    subscriptionData?.current_subscription?.product_id || null;
  const [selectedPlan, setSelectedPlan] = useState({});
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
 
  return (
    <Box>
      <Typography color="#000000" fontSize="24px" fontWeight={600} mb={3}>
        Available Subscription Plans
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          {isFetching ? (
            <>
              {[1, 2, 3].map((_, idx) => (
                <Skeleton
                  key={idx}
                  variant="rounded"
                  width="100%"
                  height={200}
                  sx={{ borderRadius: "10px", mb: 2 }}
                />
              ))}
            </>
          ) : (
            <>
              {subscriptionData?.plans?.map((plan) => (
                <PlanCard
                  key={plan.product.id}
                  plan={plan}
                  setSelectedPlan={setSelectedPlan}
                  selectedValue={selectedValue}
                  activeProductId={activeProductId}
                  handleChange={handleChange}
                  couponCode={couponCode}
                  setCouponCode={setCouponCode}
                  handlePayNow={handlePayNow}
                  isPurchaseLoading={isPurchaseLoading}
                />
              ))}
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BrowsePlansTab;
