
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CommonLoader from "./CommonLoader";

export default function DeleteConfirmationModal({
  loading=false,
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmButtonText,
  cancelButtonText,
  confirmButtonDisabled = false,
  confirmButtonLoading = false,
}) {
  const isLoading = loading || confirmButtonLoading;

  if(loading) return <CommonLoader/>;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      PaperProps={{
        sx: {
          maxWidth: "400px",
          width: "100%",
          p: 0,
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        id="delete-dialog-title"
        sx={{
          px: 2.5,
          pt: 2,
          pb: 1,
          fontWeight: 600,
          fontSize: "1rem",
        }}
      >
        {title || "Confirm Delete"}
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
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, pt: 0.5, pb: 1 }}>
        <DialogContentText
          id="delete-dialog-description"
          sx={{ fontSize: "0.9rem", color: "text.secondary" }}
        >
          {content ||
            "Are you sure you want to delete this item? This action cannot be undone."}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2, pt: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          size="small"
          sx={{
            textTransform: "capitalize",
          }}
           disabled={isLoading}
        >
          {cancelButtonText || "Cancel"}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          size="small"
          disabled={confirmButtonDisabled || isLoading}
          sx={{
            backgroundColor: "#DC2626", // Tailwind red-600
            "&:hover": {
              backgroundColor: "#B91C1C", // Tailwind red-700
            },
            minWidth: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textTransform: "capitalize",
          }}
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Deleting...
            </span>
          ) : (
            confirmButtonText || "Delete"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
