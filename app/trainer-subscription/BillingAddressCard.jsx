import React from "react";
import { Typography, Paper, Divider } from "@mui/material";

const BillingAddressCard = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderRadius: "12px",
        p: 3,
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Billing Address
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Typography gutterBottom>John Doe</Typography>
      <Typography variant="body2" color="#555" gutterBottom>
        123 Business St
      </Typography>
      <Typography variant="body2" color="#555" gutterBottom>
        San Francisco, CA 94103
      </Typography>
      <Typography variant="body2" color="#555">
        United States
      </Typography>
    </Paper>
  );
};

export default BillingAddressCard;
