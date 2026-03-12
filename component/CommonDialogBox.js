import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  DialogContentText,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// Common Dialog Component
export default function CommonDialogBox({
  open,
  handleClose,
  title,
  content,
  actions,
  width,
  fullWidth = false,
  form = null,
  sx = {},
  textButton = null,
  padding = 0,
  ...props
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      {...props}
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      fullWidth={fullWidth}
      maxWidth={false}
      fullScreen={fullScreen}
      sx={{
        "& .MuiDialog-paper": {
          width: width || "500px",
          maxWidth: "90%",
          borderRadius: "16px",
          padding: "10px 24px",
        },
      }}
    >
      <DialogTitle
        id="dialog-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: padding,
        }}
      >
        <Typography fontWeight={600} fontSize={"24px"} lineHeight={"32px"}>
          {title}
        </Typography>

        <IconButton
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[900],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: "4px 0px 4px 0px" }}>
        {form || (
          <DialogContentText component={"span"}>{content}</DialogContentText>
        )}
      </DialogContent>

      <DialogActions></DialogActions>
    </Dialog>
  );
}
