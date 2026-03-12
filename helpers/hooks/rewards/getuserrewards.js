import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useQuery } from "@tanstack/react-query";

export function useGetUserRewards(page, rowsPerPage, searchValue, paidStatus) {
  const buildUrl = () => {
    const params = new URLSearchParams({
      page: (page + 1).toString(),
      limit: rowsPerPage.toString(),
    });

    if (searchValue) {
      params.append("search", searchValue);
    }
    if(paidStatus !== "all"){
      params.append("status", paidStatus)
    }


    return `${API_ENDPOINTS.GET_USER_REWARDS}?${params.toString()}`;
  };

  return useQuery({
    queryKey: ["getUserRewards", page, rowsPerPage, paidStatus],
    queryFn: () => HttpClient.get(buildUrl()),
    // enabled: Boolean(userId), // only fetch if userId is available
    onError: (error) => {
      console.error("Failed to fetch user rewards list:", error.message);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    keepPreviousData: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
