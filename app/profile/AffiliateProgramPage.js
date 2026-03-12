"use client";

import React from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";

const AffiliateProgramPage = ({ handleCloseDialogBox }) => {
  return (
    <Box
      sx={{
        bgcolor: "#F9FAFB",
        height: "100%",
        width: "100%",
        py: 3,
        px: { xs: 1, md: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* Header Section */}
      <Box textAlign="center">
        <Typography variant="h4" fontWeight={800} color="#002653">
          Join the <span style={{ color: "#32a24c" }}>Macros And Meals</span>{" "}
          Affiliate Program
        </Typography>
        <Typography variant="h6" mt={1} color="#334155" fontWeight={500}>
          Unlock Recurring Monthly Income
        </Typography>
        <Typography
          variant="body1"
          mt={2}
          color="#475569"
          maxWidth="700px"
          mx="auto"
        >
          Are you an influencer, trainer, celebrity, or someone with a strong
          social media following? Partner with us and earn significant,
          recurring monthly commissions by promoting the most innovative diet
          creation software on the market.
        </Typography>
      </Box>

      {/* Why Partner Section */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#002653"
            gutterBottom
          >
            Why Partner With Us?
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" mb={2}>
            <strong>Industry-Leading Recurring Payouts:</strong> Earn $5 every
            month for each active member you refer. Unlike typical affiliate
            programs that pay a one-time fee ($2–$5 per signup), we reward you
            for ongoing retention. Example: Refer 1,000 active members and
            receive $5,000 monthly. If 100 cancel, you still earn $4,500 the
            next month.
          </Typography>
          <Typography variant="body1">
            <strong>Competitive Edge:</strong> Our software offers unique
            features not found elsewhere, making it easy to promote and retain
            users.
          </Typography>
        </CardContent>
      </Card>

      {/* How It Works Section */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#002653"
            gutterBottom
          >
            How It Works
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography>
              ✅ <strong>Sign Up as an Affiliate:</strong> Get your unique
              referral code.
            </Typography>
            <Typography>
              📣 <strong>Promote to Your Audience:</strong> Share your code via
              social media, email, or your website.
            </Typography>
            <Typography>
              💰 <strong>Earn Monthly:</strong> For every active member who
              signs up with your code, you receive $5 every month they remain
              subscribed.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Unique Features */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#002653"
            gutterBottom
          >
            What Makes Our Diet Creation Software Unique?
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>BMR Calculation:</strong> Accurately determines each
                member’s basal metabolic rate.
              </Typography>
              <Typography>
                <strong>TDEE Calculation:</strong> Calculates total daily energy
                expenditure for precise calorie needs.
              </Typography>
              <Typography>
                <strong>Macro Calculation:</strong> Customizes macronutrient
                breakdowns based on real data.
              </Typography>
              <Typography>
                <strong>Diet Plan Creation:</strong> Choose from keto, vegan,
                high-protein, diabetic-safe, or fully customize your
                plan—including number of meals per day.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Flexible Access:</strong> Available on both app and
                website for user convenience.
              </Typography>
              <Typography>
                <strong>No Other Software Like It:</strong> No competitor offers
                this level of automation and customization.
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Affiliate Benefits */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#002653"
            gutterBottom
          >
            Affiliate Benefits
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography>
              💸 <strong>Unlimited Earning Potential:</strong> The more people
              you refer, the more you earn—every month.
            </Typography>
            <Typography>
              📊 <strong>Simple Tracking:</strong> Access to a dashboard to
              monitor signups and payouts (details provided upon acceptance).
            </Typography>
            <Typography>
              ⏰ <strong>Prompt Payments:</strong> Receive your commission every
              month for all active memberships.
            </Typography>
          </Box>

          <Box mt={3}>
            <Typography fontWeight={700} mb={1}>
              Example Earnings:
            </Typography>
            <Typography>Refer 100 members = $500/month</Typography>
            <Typography>Refer 500 members = $2,500/month</Typography>
            <Typography>Refer 1,000 members = $5,000/month</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* How to Get Started */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#002653"
            gutterBottom
          >
            How to Get Started
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" flexDirection="column" gap={1.5}>
            {[
              "Sign up with Macros And Meals.",
              "Apply to join our affiliate program.",
              "Receive your unique referral code.",
              "Start promoting and earning recurring income.",
            ].map((text, index) => (
              <Box key={index} display="flex" alignItems="center" gap={1}>
                {/* Step Circle */}
                <Box
                  width={20}
                  height={20}
                  borderRadius="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor="#32a24c"
                  color="#fff"
                  fontSize="14px"
                  fontWeight={500}
                >
                  {index + 1}
                </Box>

                {/* Step Text */}
                <Typography fontSize="15px" color="#111827" fontWeight={500}>
                  {text}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Terms of Withdrawal */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography
            variant="h5"
            fontWeight={700}
            color="#002653"
            gutterBottom
          >
            Terms of Withdrawal
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography>
            <strong>Minimum Payout Threshold:</strong> Affiliates must
            accumulate a minimum of $50 USD in approved commissions before
            requesting a withdrawal.
          </Typography>
          <Typography mt={1}>
            <strong>Valid Payment Methods:</strong> PayPal, Bank Transfer, or
            approved digital platforms.
          </Typography>
          <Typography mt={1}>
            <strong>Payment Schedule:</strong> Commissions verified monthly;
            processed within 10 business days after month-end.
          </Typography>
          <Typography mt={1}>
            <strong>Verification & Eligibility:</strong> Only verified, active,
            paid subscriptions count. Fraudulent or self-referrals are excluded.
          </Typography>
          <Typography mt={1}>
            <strong>Cumulative Balances:</strong> Unpaid balances carry over
            until the $50 threshold is reached.
          </Typography>
          <Typography mt={1}>
            <strong>Currency & Fees:</strong> All payments in USD. Affiliates
            handle any conversion fees.
          </Typography>
          <Typography mt={1}>
            <strong>Withdrawal Requests:</strong> Can be made once balance ≥ $50
            via dashboard or email.
          </Typography>
          <Typography mt={1}>
            <strong>Account Standing:</strong> Suspended or terminated accounts
            forfeit unpaid commissions unless resolved within 30 days.
          </Typography>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Box textAlign="center">
        <Typography variant="h6" color="#002653" fontWeight={700}>
          Ready to join or have questions?
        </Typography>
        <Typography color="#475569" mt={1}>
          Contact us at{" "}
          <a
            href="mailto:info@macrosandmeals.com"
            style={{ color: "#32a24c", textDecoration: "none" }}
          >
            info@macrosandmeals.com
          </a>
        </Typography>

        {/* <Button
          variant="contained"
          sx={{
            mt: 3,
            bgcolor: "#32a24c",
            px: 4,
            py: 1.5,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { bgcolor: "#32a24c" },
          }}
          onClick={handleCloseDialogBox}
        >
          Join the Affiliate Program
        </Button> */}
      </Box>
    </Box>
  );
};

export default AffiliateProgramPage;
