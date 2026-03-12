"use client";
import {
  useGetStripePlanByTrainer,
  usePurchaseStripePlanByTrainer,
  useUpgradeStripePlanByTrainer,
} from "@/helpers/hooks/stripeflowapi/trainerStripePlanApis";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StarIcon from "@mui/icons-material/Star";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { errorNotification } from "@/helpers/notification";
import BillingTab from "../trainer-subscription/BillingTab";
import PaymentProcessor from "../trainer-subscription/PaymentProcessor";
import { useFetchCustomerStripePlan } from "@/helpers/hooks/stripeflowapi/customer/customerPlans";
import ActivePlanTabcustomer from "./ActivePlanTabcustomer";
import CommonLoader from "@/component/CommonLoader";
const Page = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [upgradePlan, setUpgradePlan] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [paymentDisplay, setPaymentDisplay] = useState(false);
  const [isRegistering, setisRegistering] = useState(true);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState({
    productId: null,
    priceId: null,
    priceValue: null,
  });
  const [paymentDetailsData, setPaymentDetails] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  const [couponApplied, setCouponApplied] = useState(false);

  const {
    data,
    isPending: isFetching,
    refetch,
  } = useFetchCustomerStripePlan({
    enabled: true,
  });

  
  const showplandetails = !isFetching && !data?.data?.current_subscription;

  
  const {
    mutate: purchasePlan,
    isPending: isPurchaseLoading,
    error: purchaseError,
  } = usePurchaseStripePlanByTrainer();

  const {
    mutate: upgradeSubscriptionPlan,
    isPending: isUpgradeLoading,
    error: upgradeError,
  } = useUpgradeStripePlanByTrainer();

  useEffect(() => {
    if (data) {
      setSubscriptionData(data?.data);

      if (data?.data?.current_subscription) {
        setActivePlan(data.data.current_subscription);
      } else if (data?.data?.plans && data.data.plans.length > 0) {
        setActivePlan(data.data.plans[0]);
      }
    }
  }, [data]);

  const handleChangeTab = (_, newValue) => {
    setActiveTab(newValue);
  };

  const handlePayNow = (
    productId,
    priceId,
    priceValue,
    couponCode,
    verifiedCouponCode = null
  ) => {
    setSelectedPaymentDetails({
      productId,
      priceId,
      priceValue,
    });
    setisRegistering(false);
    const payload = { priceId, couponCode };
    const apiToCall = upgradePlan ? upgradeSubscriptionPlan : purchasePlan;
    apiToCall(payload, {
      onSuccess: (response) => {
        const clientSecret = response?.data?.client_secret;
        const paymentDetails = response?.data?.payment_details;

        if (clientSecret) {
          setClientSecret(clientSecret);
          setPaymentDetails(paymentDetails);
          setPaymentDisplay(true);
        }
      },
      onError: (error) => {
        console.error("Error purchasing plan:", error);
        const errorMessage = error?.response?.data?.message;
        errorNotification(errorMessage);
      },
    });
  };

  // Reset payment flow
  const handleCancelPayment = () => {
    setPaymentDisplay(false);
    setClientSecret(null);
    setisRegistering(false);
  };


  // If payment view is active
  if (paymentDisplay && clientSecret) {
    return (
      <PaymentProcessor
        isRegistering={isRegistering}
        clientSecret={clientSecret}
        priceValue={selectedPaymentDetails.priceValue}
        paymentDetails={paymentDetailsData}
        onCancel={handleCancelPayment}
        onSuccess={() => {
          setPaymentDisplay(false);
          refetch(); // Refresh subscription data
          setActiveTab(0); // Go to active plan tab
        }}
      />
    );
  }

  return (
    <Box
      p={2}
      height="100%"
      width="100%"
      display={"flex"}
      flexDirection={"column"}
    >
      {isFetching ? (
        <CommonLoader/>
      ) :showplandetails ? (
        <Box
          bgcolor="white"
          borderRadius="13px"
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          flex={1}
          overflow={"auto"}
        >
          <Typography
            fontSize={"20px"}
            fontWeight={500}
            color="error"
            sx={{ mt: 2, textAlign: "center" }}
          >
            Your plan is active offline by your admin or trainer.
          </Typography>
        </Box>
      ) : (
        <Box
          bgcolor="white"
          borderRadius="13px"
          height="100%"
          width="100%"
          p={1.3}
        >
          <Box
            height="100%"
            width="100%"
            bgcolor="#f2faf5"
            borderRadius="13px"
            overflow="auto"
            p={1.3}
          >
            <Tabs
              value={activeTab}
              onChange={handleChangeTab}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                mb: 0.5,
                "& .MuiTab-root": {
                  fontWeight: 600,
                  fontSize: "16px",
                  textTransform: "none",
                  minHeight: "15px",
                  padding: "0px 14px",
                },
                "& .MuiTabs-indicator": {
                  position: "absolute",
                  height: "2px",
                  bottom: "12px",
                },
              }}
            >
              <Tab label="My Plan" icon={<StarIcon />} iconPosition="start" />
              
              <Tab
                label="Billing"
                icon={<ReceiptIcon />}
                iconPosition="start"
              />
            </Tabs>

            {activeTab === 0 && (
              <ActivePlanTabcustomer
                subscriptionData={subscriptionData}
                activePlan={activePlan}
                setActiveTab={setActiveTab}
                upgradePlan={upgradePlan}
                setUpgradePlan={setUpgradePlan}
              />
            )}


            {activeTab === 1 && <BillingTab  />}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Page;
