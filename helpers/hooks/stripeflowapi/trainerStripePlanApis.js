import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetStripePlanByTrainer({ enabled = true }) {
  const role = getLocalStorageItem("role");

  const queryKey = ["getMealPlan", role];

  const baseUrl =
    role === "trainer" ? API_ENDPOINTS.STRIPE_PLAN_GET_BY_TRAINER : null;

  const queryFn = () => {
    return HttpClient.get(baseUrl);
  };

  return useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    enabled,
    onError: (error) => {
      console.error("Failed to fetch stripe plan list:", error.message);
    },
  });
}

export function usePurchaseStripePlanByTrainer() {
  const role = getLocalStorageItem("role");

  const baseUrl =
    role === "trainer"
      ? API_ENDPOINTS.STRIPE_PLAN_PURCHASE_GET_BY_TRAINER
      : null;

   

  const mutationFn = ({ priceId, couponCode }) => {
    if (!priceId) {
      return Promise.reject(new Error("Invalid role or baseUrl"));
    }

    const params = new URLSearchParams({ price_id: String(priceId) });

    if (couponCode) {
      params.append("coupon_code", String(couponCode));
    }

    

    return HttpClient.post(`${baseUrl}?${params.toString()}`);
  };

  return useMutation({
    mutationFn,
    onError: (error) => {
      console.error("Failed to purchase trainer stripe plan:", error.message);
    },
  });
}

export function useUpgradeStripePlanByTrainer() {
  const role = getLocalStorageItem("role");

  const baseUrl =
    role === "trainer"
      ? API_ENDPOINTS.STRIPE_PLAN_UPGRADE_GET_BY_TRAINER
      : null;


  const mutationFn = ({ priceId, couponCode }) => {
    if (!priceId) {
      return Promise.reject(new Error("Invalid role or baseUrl"));
    }

    const params = new URLSearchParams({ price_id: String(priceId) });

    if (couponCode) {
      params.append("coupon_code", String(couponCode));
    }

    console.log("Url ==> ", `${baseUrl}?${params.toString()}`);

    return HttpClient.patch(`${baseUrl}?${params.toString()}`);
  };

  return useMutation({
    mutationFn,
    onError: (error) => {
      console.error("Failed to purchase trainer stripe plan:", error.message);
    },
  });
}
