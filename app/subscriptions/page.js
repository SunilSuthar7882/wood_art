"use client";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGetTrainerStripePlan } from "@/helpers/hooks/mamAdmin/mamAdmin";
import logo from "../../public/images/logo.webp";
import Image from "next/image";
import { useState } from "react";

export default function SubscriptionPlans() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetTrainerStripePlan();
  const [open, setOpen] = useState(false);
  const handlePlanSelect = (plan) => {
    localStorage.setItem("selectedPlanId", plan.price.id);
    localStorage.setItem("selectedPlan", JSON.stringify(plan));
    // router.push("/register/trainer");
    const currentQuery = window.location.search; // includes "?" if exists
    if (currentQuery) {
      router.push(`/register/trainer${currentQuery}`);
    } else {
      router.push("/register/trainer");
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

                      {/* <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ minHeight: "48px", lineHeight: 1.5 }}
                      >
                        {plan.product.description}
                      </Typography> */}
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

                    {/* Features */}
                    <Box mb={3}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          backgroundColor: "rgba(34,197,94,0.05)",
                          borderRadius: "8px",
                        }}
                      >
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            backgroundColor: "#22c55e",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "12px",
                          }}
                        >
                          ✓
                        </Box>
                        <Typography variant="body2" color="text.primary">
                          <strong>Max Customers:</strong>{" "}
                          {plan.product.metadata?.max_customer || "-"}
                        </Typography>
                      </Box>
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
            <Box mt={1} textAlign="center">
              <Button
                variant="text"
                color="success"
                size="small"
                onClick={() => setOpen(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                }}
              >
                <span className="font-semibold">More than 60 customers?</span>
                <span className="ml-1">Contact Us</span>
              </Button>

              <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                  sx: { borderRadius: 2, p: 1 }, // tighter padding
                }}
              >
                <DialogTitle sx={{ fontSize: "1rem", pb: 1 }}>
                  Contact Us
                </DialogTitle>

                <DialogContent dividers sx={{ p: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    For plans supporting more than <b>60 customers</b>, please
                    get in touch with our team.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email us at{" "}
                    <a
                      href="mailto:info@macrosaandmeals.com"
                      className="text-green-600 font-medium"
                    >
                      info@macrosaandmeals.com
                    </a>
                  </Typography>
                </DialogContent>

                <DialogActions sx={{ px: 2, py: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=info@macrosaandmeals.com&cc=architsinghal@gmail.com&su=${encodeURIComponent(
                      "Contact About 60+ Customer Plan"
                    )}&body=${encodeURIComponent(
                      "Hi Team,\n\nI am interested in a plan supporting more than 60 customers. Please get in touch with me.\n\nThank you."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Send Email
                  </Button>

                  <Button size="small" onClick={() => setOpen(false)}>
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
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
