import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useQuery } from "@tanstack/react-query";

export function useGetProfile() {
  return useQuery({
    queryKey: ["getprofile"],
    queryFn: async () => HttpClient.get(API_ENDPOINTS.GET_PROFILE),
    onError: (error) => {
      console.error("Failed to fetch profile:", error.message);
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
}
