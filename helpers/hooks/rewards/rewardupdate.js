import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateRewardBySuperAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reward_id, data }) => {
      return HttpClient.patch(
        `${API_ENDPOINTS.UPDATE_REWARD_BY_SUPERADMIN}?reward_id=${reward_id}`,
        data
      );
    },
    onSuccess: () => {
      // Invalidate rewards list or any related query
      queryClient.invalidateQueries(["getTrainerRewards"]);
    },
    onError: (error) => {
      console.error("Failed to update reward:", error.message);
    },
  });
}
