import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function editStripePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input) =>
      HttpClient.patch(API_ENDPOINTS.EDIT_STRIPE_PLAN, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getstripeplan"]);
      return data;
    },
    onError: (error) => {
      console.error(`${error.message}`);
    },
  });
}
