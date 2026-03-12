"use client";
import { CustomButton } from "@/app/ThemeRegistry";
import CommonLoader from "@/component/CommonLoader";
import { useGetcustomergetplanerequestadminbyid } from "@/helpers/hooks/mamAdmin/customergetplanerequestadminbyid";

import {
  useGetMealPlan,
  useGetTemplatePlan,
} from "@/helpers/hooks/mamAdmin/mealPlanList";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import AddEditDietPlanModal from "@/component/Dashboard/ManagePlan/AddEditDietPlanModal";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import MealPlanDetails from "@/component/CommonComponents/MealPlanDetails";
import { Routes } from "@/config/routes";

const Page = () => {
  const { customeradminid } = useParams();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [step, setStep] = useState("meal_details");

  const params = useParams();
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
    data: adminCustomerDetailsData,
    refetch: refetchadmincustomerDetailsid,
    isFetching: isAdminCustomerDetailsFetching,
    isError: isAdminCustomerDetailsError,
    error: adminCustomerDetailsError,
  } = useGetcustomergetplanerequestadminbyid(customeradminid);

  useEffect(() => {
    refetchadmincustomerDetailsid();
  }, [refetchadmincustomerDetailsid]);

  const mealPlanId = adminCustomerDetailsData?.data?.customer?.custom_plan?.id;

  const {
    data: mealPlanData,
    isFetching: isGetMealPlanPending,
    refetch,
  } = useGetMealPlan({
    mealPlanId,
    enabled: !!mealPlanId && step === "update_meal_plan",
  });

  const goBack = () => {
    router.back();
  };
  if (isAdminCustomerDetailsError) {
    showSnackbar(adminCustomerDetailsError?.message, "error");
    goBack();
  }
  if (isAdminCustomerDetailsFetching) return <CommonLoader />;

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
              Customer: {adminCustomerDetailsData?.data?.customer?.full_name}
            </Typography>
          </Stack>
          {!!adminCustomerDetailsData?.data?.customer?.custom_plan ? (
            <Button
              variant="contained"
              size="medium"
              onClick={() => {
                setStep("update_meal_plan");
                router.push(
                  `/customer-admin-request/request-details/edit/${customeradminid}`
                );
              }}
              // onClick={()=>()}
              startIcon={
                isGetMealPlanPending || isAdminCustomerDetailsFetching ? (
                  false
                ) : (
                  <EditIcon className="text-white" />
                )
              }
              loading={isGetMealPlanPending || isAdminCustomerDetailsFetching}
              disabled={isGetMealPlanPending || isAdminCustomerDetailsFetching}
            >
              Edit Meal Plan
            </Button>
          ) : (
            // <CustomButton
            //   variant={"contained"}
            //   onClick={() =>
            //     setModalState({ open: true, isTemplateCreation: false })
            //   }
            //   loading={isGetMealPlanPending || isAdminCustomerDetailsFetching}
            //   disabled={isGetMealPlanPending || isAdminCustomerDetailsFetching}
            // >
            //   + Add plan
            // </CustomButton>
            <CustomButton
              variant="contained"
              onClick={() =>
                router.push(
                  `${Routes.customeradminplandetails}${customeradminid}/create`
                )
              }
              loading={isGetMealPlanPending || isAdminCustomerDetailsFetching}
              disabled={isGetMealPlanPending || isAdminCustomerDetailsFetching}
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
          <MealPlanDetails data={adminCustomerDetailsData?.data} />
          <></>
        </Box>
      </Box>

      {/* <AddEditDietPlanModal
        isOpen={modalState.open}
        setIsOpen={(val) => setModalState((prev) => ({ ...prev, open: val }))}
        onSuccess={() => {
          refetch();
          setStep("update_meal_plan");
        }}
        isTemplateCreation={modalState.isTemplateCreation}
        clonedTemplateData={modalState.templateData}
        customerAdminId={customeradminid}
      /> */}
    </>
  );
};

export default Page;
