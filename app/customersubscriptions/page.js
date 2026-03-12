"use client";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import logo from "../../public/images/logo.webp";
import Image from "next/image";
import { useGetCustoemrStripePlan } from "@/helpers/hooks/mamAdmin/mamAdmin";

export default function CustomerSubscriptionPlans() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetCustoemrStripePlan();
  const handlePlanSelect = (plan) => {
    localStorage.setItem("selectedPlanId", plan.price.id);
    localStorage.setItem("selectedPlan", JSON.stringify(plan));
    // router.push("/register/trainer");
    const currentQuery = window.location.search; // includes "?" if exists
    if (currentQuery) {
      router.push(`/register/customer${currentQuery}`);
    } else {
      router.push("/register/customer");
    }
  };

  // Convert response to flat usable plans
  const mappedPlans =
    data?.data?.map((item) => ({
      product: item.product,
      price: item.prices[0],
    })) || [];

  return (
    <Box className=" bg-green-50 flex flex-col items-center px-4 py-6">
      {/* Logo */}
      <Box mb={2} display="flex" justifyContent="center">
        <Image
          src={logo}
          alt="Mam Logo"
          width={100}
          height={100}
          style={{ objectFit: "contain" }}
          // priority
        />
      </Box>

      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        maxWidth="1400px"
        mb={3}
        position="relative"
        textAlign="center"
        flexDirection="column"
      >
        <Box position="absolute" left={0} top={0}>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{
              color: "green",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { backgroundColor: "rgba(0,128,0,0.1)" },
            }}
          >
            Back
          </Button>
        </Box>

        <Typography variant="h5" fontWeight={700} color="green" mb={1}>
          Choose Your Subscription
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          fontWeight={500}
          mb={1}
          sx={{ maxWidth: "600px", mx: "auto" }}
        >
          Empower Your Fitness Journey with Professional Training Plans
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
        >
          Join thousands of satisfied clients who have transformed their health
          with our expert trainers
        </Typography>
      </Box>

      {/* Plan Cards Container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          p: { xs: 2, sm: 4 },
          minHeight: "500px",
          backgroundColor: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: "24px",
          border: "2px solid #a7f3d0",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <CircularProgress color="success" />
        ) : isError ? (
          <Typography color="error">
            Failed to load subscription plans. Please try again later.
          </Typography>
        ) : Array.isArray(mappedPlans) && mappedPlans.length > 0 ? (
          <>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {mappedPlans.map((plan, index) => (
                <Paper
                  key={index}
                  elevation={3}
                  sx={{
                    flex: "1 1 280px",
                    maxWidth: 360,
                    backgroundColor: "white",
                    border: "2px solid #a7f3d0",
                    borderRadius: "16px",
                    p: 3,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                      borderColor: "#86efac",
                      "&::before": { opacity: 1 },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(135deg, rgba(34,197,94,0.05) 0%, rgba(16,185,129,0.05) 100%)",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    },
                  }}
                  onClick={() => handlePlanSelect(plan)}
                >
                  {/* Card Content */}
                  <Box sx={{ position: "relative", zIndex: 1, height: "100%" }}>
                    <Box mb={2}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "12px",
                            background:
                              "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: 700,
                            fontSize: "1.2rem",
                          }}
                        >
                          {plan.product.name.charAt(0)}
                        </Box>
                        <Typography variant="h6" fontWeight={700} color="green">
                          {plan.product.name}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ minHeight: "48px", lineHeight: 1.5 }}
                      >
                        {plan.product.description}
                      </Typography>
                    </Box>

                    {/* Price */}
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 2,
                        mb: 3,
                        backgroundColor: "rgba(34,197,94,0.05)",
                        borderRadius: "12px",
                        border: "1px solid rgba(34,197,94,0.1)",
                      }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="green"
                        mb={0.5}
                      >
                        {plan.price.unit_amount === 0
                          ? "Free"
                          : `$${(plan.price.unit_amount / 100).toFixed(2)}`}
                      </Typography>
                      {plan.price.unit_amount > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          per month
                        </Typography>
                      )}
                    </Box>

                    {/* Select Button */}
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      sx={{
                        fontWeight: 600,
                        textTransform: "none",
                        py: 1.5,
                        borderRadius: "12px",
                        background:
                          "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
                        boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #16a34a 0%, #059669 100%)",
                          boxShadow: "0 6px 20px rgba(34,197,94,0.4)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Select Plan
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>

            {/* Footer Message */}
            {/* <Box mt={4} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                All plans include 24/7 customer support.
              </Typography>
            </Box> */}
          </>
        ) : (
          <Typography color="text.secondary">
            No subscription plans available at the moment.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
