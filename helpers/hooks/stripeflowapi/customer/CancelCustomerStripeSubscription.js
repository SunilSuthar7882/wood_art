import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCancelStripeSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Call the PATCH endpoint without passing any ID
      return HttpClient.patch(
        `${API_ENDPOINTS.STRIPE_CUSTOMER_PLAN_CANCEL_SUBSCRIPTION}`
      );
    },
    onSuccess: () => {
      // Optionally, invalidate queries if needed
      queryClient.invalidateQueries(["getCustomerStripePlan"]);
    },
    onError: (error) => {
      console.error("Failed to cancel subscription:", error);
    },
  });
}
