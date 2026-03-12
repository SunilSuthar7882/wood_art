import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorOutlineIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import CommonLoader from "../CommonLoader";

/**
 * A reusable confirmation modal component
 *
 * @param {Object} props
 * @param {boolean} props.open - Controls whether the modal is open
 * @param {Function} props.onClose - Function to call when modal is closed
 * @param {Function} props.onConfirm - Function to call when action is confirmed
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {string} props.confirmButtonText - Text for confirm button (default: "Confirm")
 * @param {string} props.cancelButtonText - Text for cancel button (default: "Cancel")
 * @param {string} props.type - Modal type: "warning", "success", "error", "info" (default: "warning")
 * @returns {JSX.Element}
 */
const ConfirmationModal = ({
  loading,
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  type = "warning", // warning, success, error, info
}) => {
  // Configuration based on type
  const typeConfig = {
    warning: {
      color: "#ff9800",
      bgColor: "#fff3e0",
      icon: <WarningIcon sx={{ color: "#ff9800", fontSize: 40 }} />,
      confirmButtonColor: "warning",
    },
    success: {
      color: "#60b973",
      bgColor: "#e8f5e9",
      icon: <CheckCircleIcon sx={{ color: "#60b973", fontSize: 40 }} />,
      confirmButtonColor: "success",
    },
    error: {
      color: "#f44336",
      bgColor: "#ffebee",
      icon: <ErrorOutlineIcon sx={{ color: "#f44336", fontSize: 40 }} />,
      confirmButtonColor: "error",
    },
    info: {
      color: "#2196f3",
      bgColor: "#e3f2fd",
      icon: <InfoIcon sx={{ color: "#2196f3", fontSize: 40 }} />,
      confirmButtonColor: "primary",
    },
  };

  const config = typeConfig[type] || typeConfig.warning;
if(loading) return <CommonLoader/>;
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="confirmation-modal">
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
          <CloseIcon />
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
            {title}
          </Typography>

          {message && (
            <Typography variant="body1" color="text.secondary" mb={3}>
              {message}
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={onClose} sx={{ minWidth: 100 }}>
              {cancelButtonText}
            </Button>
            <Button
              variant="contained"
              color={config.confirmButtonColor}
              onClick={onConfirm}
              sx={{ minWidth: 100 }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress size={18} color="inherit" />
                    <span>
                      {confirmButtonText === "Delete"
                        ? "Deleting..."
                        : "Processing..."}
                    </span>
                  </Box>
                </>
              ) : (
                confirmButtonText
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
