import { Box } from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { memo } from "react";
import PaymentForm from "../PaymentForm";
import SubscriptionPlans from "../SubscriptionPlans";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC);

function Step6({ clientSecret, submitError, selectedPlan, setSelectedPlan }) {
  const appearance = {
    theme: "stripe",
    clientSecret,
    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: "#9ea3af",
      colorDanger: "#df1b41",
    },
  };

  return (
    <Box>
      {!clientSecret ? (
        <SubscriptionPlans
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          submitError={submitError}
        />
      ) : (
        <Box sx={{ mt: 4 }}>
          <Elements stripe={stripePromise} options={appearance}>
            <PaymentForm planDetails={selectedPlan?.prices?.[0]} />
          </Elements>
        </Box>
      )}
    </Box>
  );
}

export default memo(Step6);
