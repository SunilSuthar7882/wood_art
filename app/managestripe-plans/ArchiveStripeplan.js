import { Box, Typography } from "@mui/material";
import React from "react";
import { CustomButton } from "../ThemeRegistry";
import { archiveStripePlan } from "@/helpers/hooks/stripeflowapi/archivestripeplan";
import { errorNotification, successNotification } from "@/helpers/notification";

const ArchiveStripeplan = ({ handleArchiveCloseModal, openModalId }) => {
  const { mutate: archivestripeplan } = archiveStripePlan();
 
  const handleArchivestripPlan = (plan_id) => {
 
    archivestripeplan(
      {
        plan_id: plan_id,
      },
      {
        onSuccess: (data) => {
          successNotification(data?.message);

          handleArchiveCloseModal();
        },
        onError: (error) => {
          errorNotification(error?.response?.data?.message);

          handleArchiveCloseModal();
        },
      }
    );
  };
  return (
    <Box display={"flex"} flexDirection={"column"} gap={2}>
      <Typography fontSize={"16px"} fontWeight={500}>
        Are you sure you want to archive this plan?
      </Typography>
      <Box
        display={"flex"}
        justifyContent={"end"}
        alignItems={"center"}
        gap={2}
      >
        <CustomButton
          variant={"contained"}
          sx={{ heigth: "25px" }}
          onClick={handleArchiveCloseModal}
        >
          No
        </CustomButton>
        <CustomButton
          variant={"contained"}
          sx={{ heigth: "25px" }}
          onClick={() => {
            handleArchivestripPlan(openModalId);
          }}
        >
          Yes
        </CustomButton>
      </Box>
    </Box>
  );
};

export default ArchiveStripeplan;
