import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { HttpClient } from "@/helpers/clients/http-client";
import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { getLocalStorageItem } from "@/helpers/localStorage";

const useFetchPremiumPlansForTrainer = () => {
  const role = getLocalStorageItem("role");

  const fetchTrainerPlanDetails = async () => {
    if (role !== "trainer") throw new Error("Invalid role");

    const endpoint = API_ENDPOINTS.STRIPE_PLAN_GET_BY_TRAINER;

    try {
      const response = await HttpClient.get(endpoint);
      return response;
    } catch (err) {
      console.error("Failed to fetch stripe plan list:", err.message);
      throw new Error(err.message);
    }
  };

  const {
    data,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["trainerPlan", role],
    queryFn: fetchTrainerPlanDetails,
    enabled: role === "trainer",
  });

  const currentPlanProductId = data?.data?.current_subscription?.product_id;
  const plans = data?.data?.plans || [];

  const currentPlan = useMemo(() => {
    return plans.find((plan) => plan.product.id === currentPlanProductId);
  }, [plans, currentPlanProductId]);

  const maxCustomer = useMemo(() => {
    const value = currentPlan?.product?.metadata?.max_customer;
    return value ? parseInt(value, 10) || 0 : 0;
  }, [currentPlan]);



  return {
    plans,
    isError,
    isLoading,
    currentSubscription: data?.data?.current_subscription,
    maxCustomer,
  };
};

export default useFetchPremiumPlansForTrainer;
