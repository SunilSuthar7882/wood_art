import React from "react";
import { Box, Typography } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "./StripePaymentForm";

// Initialize Stripe - this would use your environment variable
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC);

const PaymentProcessor = ({
  isRegistering,
  clientSecret,
  paymentDetails,
  priceValue,
  onCancel,
  onSuccess,
}) => {
 
  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#109A4E",
      colorBackground: "#ffffff",
      colorText: "#426686",
      colorDanger: "#df1b41",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Box p={2} height="100%" width="100%">
      <Box
        bgcolor="white"
        borderRadius="13px"
        height="100%"
        width="100%"
        p={2}
        display="flex"
        flexWrap="wrap"
        flex={1}
        gap={10}
        overflow="auto"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
      >
        <Box my={4} width="100%" maxWidth="600px">
          <Elements stripe={stripePromise} options={options}>
            <StripePaymentForm onCancel={onCancel} onSuccess={onSuccess} paymentDetails={paymentDetails} isRegistering={isRegistering}/>
          </Elements>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentProcessor;
