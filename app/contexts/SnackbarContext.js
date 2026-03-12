"use client";
import React, { createContext, useState, useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { LinearProgress } from "@mui/material";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
    autoHideDuration: 3000,
  });

  const showSnackbar = (message, severity = "success", options = {}) => {
    setSnackbar({
      open: true,
      message,
      severity,
      autoHideDuration:
        options?.autoHideDuration !== undefined
          ? options.autoHideDuration
          : 3000,
    });
  };

  const handleClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const severityColors = {
    success: "#4caf50",
    error: "#ef5350",
    warning: "#ff9800",
    info: "#03a9f4",
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={snackbar.autoHideDuration ?? null} // allow null
      >
        <div style={{ width: "100%", position: "relative" }}>
          {snackbar.autoHideDuration !== null && (
            <LinearProgress
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1,
                backgroundColor: severityColors[snackbar.severity],
              }}
              sx={{
                "& .MuiLinearProgress-bar": {
                  backgroundColor: severityColors[snackbar.severity],
                },
                animation: `progress-animation ${snackbar.autoHideDuration}ms linear forwards`,
                "@keyframes progress-animation": {
                  from: { width: "0%" },
                  to: { width: "100%" },
                },
              }}
              variant="determinate"
              value={snackbar.open ? 0 : 100}
            />
          )}

          <Alert
            severity={snackbar.severity}
            variant="filled"
            onClose={handleClose}
            sx={{ padding: "0px 16px 2px 16px" }}
          >
            {snackbar.message}
          </Alert>
        </div>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};


export const useSnackbar = () => useContext(SnackbarContext);
