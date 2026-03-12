import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFetchCustomerStripePlan() {
  const role = getLocalStorageItem("role");

  const queryKey = ["getCustomerStripePlan", role];

  const baseUrl =
    role === "customer" ? API_ENDPOINTS.GET_STRIPE_PLAN_CUSTOMER : null;

  const queryFn = () => {
    return HttpClient.get(baseUrl);
  };

  return useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error("Failed to fetch customer plan:", error.message);
    },
  });
}

export function useCustomMealPlanRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const res = await HttpClient.post(
        API_ENDPOINTS.ADD_MEAL_PLAN_REQUEST,
        input
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["addCustomMealPlanRequest"]);
    },
    onError: (error) => {
      console.error(`Failed to add food: ${error.message}`);
    },
  });
}

export function useFetchCustomerMealPlanDetails() {
  const role = getLocalStorageItem("role");

  const queryKey = ["fetchCustomerMealPlanDetails", role];

  const baseUrl =
    role === "customer"
      ? API_ENDPOINTS.GET_MEAL_PLAN_DETAILS_BY_CUSTOMER
      : null;

  const queryFn = () => {
    return HttpClient.get(baseUrl);
  };

  return useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error(
        "Failed to fetch customer meal plan details:",
        error.message
      );
    },
  });
}

export function useVerifyCouponCode() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // pick endpoint based on role
  const baseUrl = API_ENDPOINTS.STRIPE_VERIFY_COUPON_CODE;

  return useMutation({
    // 1) mutationFn with try/catch + normalized error
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.post(
          baseUrl,
          {},
          {
            params: payload,
          }
        );
        return data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.response?.statusText ||
          err.message ||
          "An unknown error occurred";
        throw new Error(message);
      }
    },

    // 2) onSuccess: only show notification, don't invalidate queries
    onSuccess: () => {
      // Removed the invalidateQueries call to prevent re-renders
      showSnackbar("Coupon verified successfully!", "success");
    },

    // 3) onError: log and notify
    onError: (error) => {
      console.error("Failed to verify coupon:", error);
      showSnackbar(`Coupon verification failed: ${error.message}`, "error");
    },
  });
}
