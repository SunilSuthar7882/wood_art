import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useQuery } from "@tanstack/react-query";

export function userGetReferralLink() {
  const role = getLocalStorageItem("role");
  const role_api_call = role === "trainer" || role === "customer";
  const baseUrl = role_api_call && API_ENDPOINTS.GET_REFERRAL_LINK;

  return useQuery({
    queryKey: ["getreferrallink"],
    queryFn: async () => HttpClient.get(baseUrl),
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
  });
}
