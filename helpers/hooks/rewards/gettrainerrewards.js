import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useQuery } from "@tanstack/react-query";


export function useGetTrainerRewards(page, rowsPerPage, searchValue,user_id, start_date, paidStatus) {
  const buildUrl = () => {
    const params = new URLSearchParams({
      page: (page + 1).toString(),
      limit: rowsPerPage.toString(),
    });

    if (searchValue) {
      params.append("search", searchValue);
    }
    if (user_id) {
      params.append("user_id", user_id);
    }
    if(start_date){
      params.append("start_date",start_date);
    }
    if (paidStatus && paidStatus !== "all") {
    params.append("status", paidStatus);
  }

    return `${API_ENDPOINTS.GET_TRAINER_REWARDS}?${params.toString()}`;
  };

  return useQuery({
    queryKey: ["getTrainerRewards", page, rowsPerPage, searchValue, user_id, start_date, paidStatus],
    queryFn: () => HttpClient.get(buildUrl()),
    // enabled: Boolean(trainerId), // only fetch if trainerId is available
    onError: (error) => {
      console.error("Failed to fetch trainer rewards list:", error.message);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    keepPreviousData: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}






export function useGetTrainerRewardsCount(searchValue,user_id, start_date, paidStatus) {
  const buildUrl = () => {
    const params = new URLSearchParams({
      // page: (page + 1).toString(),
      // limit: rowsPerPage.toString(),
    });

    if (searchValue) {
      params.append("search", searchValue);
    }
    if (user_id) {
      params.append("user_id", user_id);
    }
    if(start_date){
      params.append("start_date",start_date);
    }
    if(paidStatus !=="all"){
      params.append("status", paidStatus);
    }

    return `${API_ENDPOINTS.GET_TRAINER_REWARDS_COUNT}?${params.toString()}`;
  };

  return useQuery({
    queryKey: ["getTrainerRewardsCounts", searchValue, user_id, start_date, paidStatus],
    queryFn: () => HttpClient.get(buildUrl()),
    // enabled: Boolean(trainerId), // only fetch if trainerId is available
    onError: (error) => {
      console.error("Failed to fetch trainer rewards list:", error.message);
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    keepPreviousData: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
