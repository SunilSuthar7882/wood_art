import React from "react";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { Close, CheckCircle, ErrorOutline } from "@mui/icons-material";
import { CustomButton } from "@/app/ThemeRegistry";

const STATUS_CONFIG = {
  success: {
    title: "Payment Successful!",
    message:
      "Your payment has been processed successfully. You will be redirected shortly.",
    color: "#60b973",
    bgColor: "#e8f5e9",
    icon: <CheckCircle color="success" sx={{ fontSize: 40 }} />,
    showProgressBar: true,
    footerText: "Redirecting in a few seconds...",
    showButton: false,
  },
  failed: {
    title: "Payment Failed",
    color: "#f44336",
    bgColor: "#ffebee",
    icon: <ErrorOutline color="error" sx={{ fontSize: 40 }} />,
    showProgressBar: false,
    showButton: true,
    buttonText: "Try Again",
    buttonColor: "error",
  },
  processing: {
    title: "Payment Processing",
    message: "Your payment is being processed. This might take a moment.",
    color: "#2196f3",
    bgColor: "#e3f2fd",
    icon: <CircularProgress color="primary" />,
    showProgressBar: false,
    footerText: "Please do not close this window.",
    showButton: false,
  },
};

const PaymentStatusModal = ({
  open,
  onClose,
  status = "processing",
  error = "",
}) => {
  const config = STATUS_CONFIG[status];

  if (!config) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={`payment-${status}-modal`}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          outline: "none",
          border: `1px solid ${config.color}`,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: config.bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            {config.icon}
          </Box>
          <Typography variant="h5" fontWeight={600} mb={1}>
            {config.title}
          </Typography>

          {/* Error message for failed status */}
          {status === "failed" && error && (
            <Typography variant="body1" color="error" mb={1}>
              {error}
            </Typography>
          )}

          {/* General message */}
          {config.message && (
            <Typography variant="body1" color="text.secondary" mb={3}>
              {config.message}
            </Typography>
          )}

          {/* Additional message for failed status */}
          {status === "failed" && (
            <Typography variant="body2" color="text.secondary" mb={3}>
              Please check your payment details and try again.
            </Typography>
          )}

          {/* Progress bar for success status */}
          {config.showProgressBar && (
            <Box
              sx={{
                width: "100%",
                height: 4,
                bgcolor: "#e0e0e0",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: config.color,
                  animation: "pulse 1.5s infinite",
                  "@keyframes pulse": {
                    "0%": {
                      opacity: 0.6,
                    },
                    "50%": {
                      opacity: 1,
                    },
                    "100%": {
                      opacity: 0.6,
                    },
                  },
                }}
              />
            </Box>
          )}

          {/* Button for failed status */}
          {config.showButton && (
            <CustomButton
              variant="contained"
              color={config.buttonColor}
              onClick={onClose}
              sx={{ minWidth: 120 }}
            >
              {config.buttonText}
            </CustomButton>
          )}

          {/* Footer text */}
          {config.footerText && (
            <Typography variant="caption" color="text.secondary" mt={2}>
              {config.footerText}
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default PaymentStatusModal;
