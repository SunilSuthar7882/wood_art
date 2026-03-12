import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useQuery } from "@tanstack/react-query";

export function useGetParentDetails() {
  const role = getLocalStorageItem("role");

  const buildUrl =
    role !== "admin" && role !== "super_admin"
      ? API_ENDPOINTS.GET_PARENT_DETAILS
      : null;

  return useQuery({
    queryKey: ["getParentDetails", role],
    queryFn: async () => {
      if (!buildUrl) return null;
      return HttpClient.get(buildUrl);
    },
    enabled: !!buildUrl,
    onError: (error) => {
      console.error("Failed to fetch parent details:", error.message);
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
}
