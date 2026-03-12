"use client";
import { CustomButton } from "@/app/ThemeRegistry";
import CommonLoader from "@/component/CommonLoader";
import {
  useGetMealPlan,
  useGetTemplatePlan,
} from "@/helpers/hooks/mamAdmin/mealPlanList";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import MealPlanDetails from "@/component/CommonComponents/MealPlanDetails";
import AddEditDietPlanModal from "@/component/Dashboard/ManagePlan/AddEditDietPlanModal";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { useGetcustomergetplanerequesttrainerbyid } from "@/helpers/hooks/trainersectionapi/customergetplanerequesttraineriddetails";

const Page = () => {
  const { customertrainerid } = useParams();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const searchParams = useSearchParams();
  const templateIdFromQuery = searchParams.get("template_id");
  const [modalState, setModalState] = useState({
    open: false,
    isTemplateCreation: false,
    templateData: null,
  });

  const { data: planData } = useGetTemplatePlan({
    templateId: templateIdFromQuery,
  });

  const {
    data: trainerCustomerDetailsData,
    refetch: refetchtrainercustomerDetailsid,
    isFetching: isTrainerCustomerDetailsFetching,
    isError: isTrainerCustomerDetailsError,
    error: trainerCustomerDetailsError,
    isLoading: trainerCustomerDetailsLoading,
  } = useGetcustomergetplanerequesttrainerbyid(customertrainerid);

  useEffect(() => {
    refetchtrainercustomerDetailsid();
  }, [refetchtrainercustomerDetailsid]);

  const mealPlanId =
    trainerCustomerDetailsData?.data?.customer?.custom_plan?.id;
  const {
    data: mealPlanData,
    isFetching: isGetMealPlanPending,
    refetch,
  } = useGetMealPlan({
    mealPlanId,
  });

  const goBack = () => {
    router.back();
  };
  if (isTrainerCustomerDetailsError) {
    showSnackbar(trainerCustomerDetailsError?.message, "error");
    goBack();
  }
  if (isTrainerCustomerDetailsFetching) return <CommonLoader />;

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        height={"100%"}
        width={"100%"}
        p={2}
        gap={2}
      >
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          height={"40px"}
          alignItems={"center"}
        >
          <Stack direction={"row"} spacing={0.5}>
            <IconButton onClick={goBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography fontSize={"24px"} fontWeight={700}>
              Customer: {trainerCustomerDetailsData?.data?.customer?.full_name}
            </Typography>
          </Stack>
          {!!trainerCustomerDetailsData?.data?.customer?.custom_plan ? (
            <Button
              variant="contained"
              size="medium"
              onClick={() => {
                router.push(
                  `/customer-trainer-request/request-details/edit/${customertrainerid}`
                );
              }}
              startIcon={
                isGetMealPlanPending || isTrainerCustomerDetailsFetching ? (
                  false
                ) : (
                  <EditIcon className="text-white" />
                )
              }
              loading={isGetMealPlanPending || isTrainerCustomerDetailsFetching}
              disabled={
                isGetMealPlanPending || isTrainerCustomerDetailsFetching
              }
            >
              Edit Meal Plan
            </Button>
          ) : (
            <CustomButton
              variant={"contained"}
              onClick={() =>
                setModalState({ open: true, isTemplateCreation: false })
              }
              loading={isGetMealPlanPending || isTrainerCustomerDetailsFetching}
              disabled={
                isGetMealPlanPending || isTrainerCustomerDetailsFetching
              }
            >
              + Add plan
            </CustomButton>
          )}
        </Box>
        <Box
          flex={1}
          overflow={"auto"}
          bgcolor={"white"}
          borderRadius={"13px"}
          p={2}
        >
          <MealPlanDetails data={trainerCustomerDetailsData?.data} />
        </Box>
      </Box>

      {/* <AddEditDietPlanModal
        isOpen={modalState.open}
        setIsOpen={(val) => setModalState((prev) => ({ ...prev, open: val }))}
        isTemplateCreation={modalState.isTemplateCreation}
        clonedTemplateData={modalState.templateData}
        customerTrainerId={customertrainerid}
      /> */}
    </>
  );
};

export default Page;
