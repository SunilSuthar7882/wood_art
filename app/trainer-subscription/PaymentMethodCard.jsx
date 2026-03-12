import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

const PaymentMethodCard = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderRadius: "12px",
        p: 3,
        mb: 3
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Payment Method
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 24,
            backgroundColor: "#eee",
            borderRadius: 1,
            mr: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography fontSize="12px" fontWeight={600}>
            VISA
          </Typography>
        </Box>
        <Typography>•••• •••• •••• 4242</Typography>
      </Box>

      <Typography variant="body2" color="#555" gutterBottom>
        Expires 12/2025
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="body2"
        sx={{
          color: "#109A4E",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        Update Payment Method
      </Typography>
    </Paper>
  );
};

export default PaymentMethodCard;