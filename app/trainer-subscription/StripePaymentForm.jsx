import React, { useState, useEffect } from "react";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { CustomButton } from "../ThemeRegistry";
import PaymentStatusModal from "@/component/CommonComponents/PaymentStatusModal";
import Image from "next/image";
import logo from "../../public/images/logo.webp";

const StripePaymentForm = ({
  onCancel,
  onSuccess,
  paymentDetails,
  isRegistering,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [paymentElementMessage, setPaymentElementMessage] = useState(null);
  const [addressElementMessage, setAddressElementMessage] = useState(null);
  const storedPlan = localStorage.getItem("selectedPlan");
  const parsedPlan = storedPlan ? JSON.parse(storedPlan) : null;

  const planName = parsedPlan?.product?.name;
  const planPeriod = parsedPlan?.price?.recurring?.interval;
  const subscriptionPeriod = parsedPlan?.prices?.[0]?.recurring?.interval;

  // 💡 Payment values extracted inside the component
  const subtotal = paymentDetails?.sub_total ?? 0;
  const total = paymentDetails?.total ?? 0;
  const tax = paymentDetails?.tax ?? 0;
  const discountAmount =
    paymentDetails?.total_discount_amounts?.[0]?.amount ?? 0;
  const currency = paymentDetails?.currency?.toUpperCase() ?? "USD";

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);

  useEffect(() => {
    if (!elements) return;

    const paymentElement = elements.getElement("payment");
    if (paymentElement) {
      paymentElement.on("change", (event) => {
        setIsFormComplete(event.complete);
        setPaymentElementMessage(event.error?.message ?? null);
      });
    }

    return () => {
      if (paymentElement) {
        paymentElement.off("change");
      }
    };
  }, [elements]);

  const handleAddressChange = (event) => {
    if (event.complete) {
      setAddressElementMessage(null);
    } else if (event.error) {
      setAddressElementMessage(event.error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !isFormComplete) return;

    setProcessing(true);
    setError(null);

    try {
      const { error: paymentError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/trainer-dashboard`,
          },
          redirect: "if_required",
        });

      if (paymentError) {
        if (paymentError.type === "validation_error") {
          setError(paymentError.message ?? "Please check your payment details");
        } else {
          setError(paymentError.message ?? "An error occurred");
          setPaymentStatus("failed");
        }
        setProcessing(false);
      } else if (paymentIntent) {
        switch (paymentIntent.status) {
          case "succeeded":
            setPaymentStatus("success");
            localStorage.removeItem("selectedPlan");
            setError(null);
            setTimeout(() => {
              onSuccess();
            }, 3000);
            break;
          case "processing":
            setError(
              "Your payment is processing. We'll update you when payment is received."
            );
            setPaymentStatus("processing");
            break;
          case "requires_payment_method":
            setError("Your payment was not successful, please try again.");
            setPaymentStatus("failed");
            break;
          default:
            setError("Something went wrong with your payment.");
            setPaymentStatus("failed");
            break;
        }
        setProcessing(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      setPaymentStatus("failed");
      setProcessing(false);
    }
  };

  const closeModal = () => {
    setPaymentStatus(null);
    setError(null);
  };

  return (
    <>
      <Box mb={1} display="flex" justifyContent="center">
        <Image
          src={logo}
          alt="Mam Logo"
          width={150}
          height={150}
          style={{ objectFit: "contain" }}
          priority
        />
      </Box>
      <Paper
        elevation={0}
        sx={{
          p: 1,
          border: "1px solid #cdecd9",
          borderRadius: "12px",
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={1}>
          Payment Details
        </Typography>

        <Box mb={3}>
          <Typography variant="h5" gutterBottom>
            Order Summary
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body1" fontWeight={600}>
              Plan Name:
            </Typography>
            <Typography variant="body1">{planName}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body1">Subtotal:</Typography>
            <Typography variant="body1">
              {formatCurrency(subtotal)}
              {planPeriod || subscriptionPeriod
                ? ` /${planPeriod || subscriptionPeriod}`
                : ""}
            </Typography>
          </Box>

          {tax > 0 && (
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1">Tax:</Typography>
              <Typography variant="body1" color="red">
                {tax}%
              </Typography>
            </Box>
          )}

          {discountAmount > 0 && (
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body1">Coupon Applied:</Typography>
              <Typography variant="body1" color="success.main">
                -{formatCurrency(discountAmount)}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 1 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1" fontWeight={600}>
              Total:
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {formatCurrency(total)}
              {planPeriod || subscriptionPeriod
                ? ` /${planPeriod || subscriptionPeriod}`
                : ""}
            </Typography>
          </Box>
        </Box>

        <Box mb={3}>
          <PaymentElement />
          {paymentElementMessage && (
            <Typography
              color="error"
              variant="caption"
              sx={{ mt: 1, display: "block" }}
            >
              {paymentElementMessage}
            </Typography>
          )}
        </Box>

        {!isRegistering && (
          <Box mb={3}>
            <Typography variant="subtitle2" fontWeight={500} mb={1}>
              Billing Address
            </Typography>
            <AddressElement
              options={{
                mode: "billing",
                fields: { phone: "always" },
                validation: { phone: { required: "always" } },
              }}
              onChange={handleAddressChange}
            />
            {addressElementMessage && (
              <Typography
                color="error"
                variant="caption"
                sx={{ mt: 1, display: "block" }}
              >
                {addressElementMessage}
              </Typography>
            )}
          </Box>
        )}

        {error && !paymentStatus && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              bgcolor: "#fdeded",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ErrorOutline color="error" sx={{ mr: 1 }} />
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Paper>
        )}

        <Box display="flex" justifyContent="space-between" mt={3}>
          <CustomButton
            variant="outlined"
            onClick={onCancel}
            sx={{ minWidth: 120 }}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="contained"
            disabled={!stripe || processing || !isFormComplete}
            onClick={handleSubmit}
            sx={{ minWidth: 180 }}
            startIcon={
              processing && <CircularProgress size={20} color="inherit" />
            }
          >
            {processing ? "Processing..." : "Complete Payment"}
          </CustomButton>
        </Box>
      </Paper>

      <PaymentStatusModal
        open={!!paymentStatus}
        onClose={closeModal}
        status={paymentStatus}
        error={error}
      />
    </>
  );
};

export default StripePaymentForm;
