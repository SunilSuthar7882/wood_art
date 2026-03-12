import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function addStripePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) =>
      HttpClient.post(API_ENDPOINTS.ADD_STRIPE_PLAN, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getstripeplan"]);

      return data;
    },
    onError: (error) => {},
  });
}
