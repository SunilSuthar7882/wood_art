import React from "react";
import { Paper, Typography, Divider, Grid } from "@mui/material";

const PlanComparisonCard = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderRadius: "12px",
        p: 3,
        position: "sticky",
        top: "20px",
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Plan Comparison
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Typography fontWeight={600}>Feature</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontWeight={600}>Availability</Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
        </Grid>

        <Grid item xs={6}>
          <Typography>Number of Customers</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>2 - 100</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>Support</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Basic to 24/7</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>Analytics</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Standard & Premium</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>API Access</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Standard & Premium</Typography>
        </Grid>

        <Grid item xs={6}>
          <Typography>White-label</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Premium only</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" color="#555">
        Not sure which plan is right for you? Contact our support
        team for personalized assistance.
      </Typography>
    </Paper>
  );
};

export default PlanComparisonCard;