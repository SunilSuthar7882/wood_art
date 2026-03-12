import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useQuery } from "@tanstack/react-query";

export function useGetRewardUsersDropdown() {
  return useQuery({
    queryKey: ["rewardUsersDropdown"],
    queryFn: async () => HttpClient.get(API_ENDPOINTS.REWARD_USERS_DROPDOWN),
    onError: (error) => {
      console.error("Failed to fetch reward users dropdown:", error?.message);
    },
  });
}
