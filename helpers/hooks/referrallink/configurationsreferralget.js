import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useQuery } from "@tanstack/react-query";

export function useConfigurationsReferralget() {
  const baseUrl = `${API_ENDPOINTS.CONFIGURATIONS_REFERRAL_GET}`;

  return useQuery({
    queryKey: ["configurationsreferralget"],
    queryFn: async () => HttpClient.get(baseUrl),
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
  });
}
