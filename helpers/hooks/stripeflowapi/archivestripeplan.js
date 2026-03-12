import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function archiveStripePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ plan_id }) => {
      return HttpClient.patch(
        `${API_ENDPOINTS.ARCHIVE_STRIPE_PLAN}?plan_id=${plan_id}`
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getstripeplan"]);
      return data;
    },
    onError: (error) => {
      return error;
    },
  });
}
