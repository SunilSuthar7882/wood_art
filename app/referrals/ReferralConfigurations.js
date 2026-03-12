"use client";
import React, { useEffect } from "react";
import { Box, Container, Paper, Typography, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useConfigurationsReferralget } from "@/helpers/hooks/referrallink/configurationsreferralget";
import { userConfigurationsReferralupdate } from "@/helpers/hooks/referrallink/configurationsreferralupdate";
import CustomTable from "@/component/CommonComponents/CommonTable";

const ReferralConfigurations = () => {
  const { data, isFetching } = useConfigurationsReferralget();
  const { mutate: configurationsReferralUpdate } =
    userConfigurationsReferralupdate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      referral_customer_reward: 0,
      referral_trainer_reward: 0,
    },
  });

  useEffect(() => {
    if (data?.data) {
      reset({
        referral_customer_reward: data.data.referral_customer_reward || 0,
        referral_trainer_reward: data.data.referral_trainer_reward || 0,
      });
    }
  }, [data, reset]);

  const onSubmit = (data) => {
    configurationsReferralUpdate(data);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "reward", headerName: "Reward Amount", flex: 1 },
  ];
  const rows = [
    { id: 1, type: "Customer", reward: data?.data?.referral_customer_reward },
    { id: 2, type: "Trainer", reward: data?.data?.referral_trainer_reward },
  ];

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
      width={"100%"}
      // p={2}
      bgcolor={"#f4f5f8"}
      // sx={{ backgroundColor: "#f4f5f8", minHeight: "100vh", p: 2 }}
    >
      <Container maxWidth={false} disableGutters>
        <Typography
          sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
          color="text.primary"
        >
          Referral Configurations
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ py: 1, fontSize: "0.875rem", lineHeight: 1.5 }}
        >
          Set the reward amounts for customer and trainer referrals
        </Typography>

        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            mb: 4,
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  Customer Referral Reward ($)
                </Typography>
                <input
                  type="number"
                  {...register("referral_customer_reward", {
                    valueAsNumber: true,
                  })}
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    width: "200px",
                  }}
                />
              </Box>

              <Box>
                <Typography fontWeight={500} mb={0.5}>
                  Trainer Referral Reward ($)
                </Typography>
                <input
                  type="number"
                  {...register("referral_trainer_reward", {
                    valueAsNumber: true,
                  })}
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    width: "200px",
                  }}
                />
              </Box>

              <Box sx={{ mt: "30px" }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ bgcolor: "#01933c", height: "40px" }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>

        <Paper
          sx={{
            p: 2,
            borderRadius: 4,
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Current Rewards Overview
          </Typography>
          <CustomTable
            columns={columns}
            rows={rows}
            loading={isFetching}
            hideFooter={true}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default ReferralConfigurations;
