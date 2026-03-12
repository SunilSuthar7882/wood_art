import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetTrainers(
  page,
  rowsPerPage,
  adminId,
  activeStatus,
  searchValue
) {
  const role = getLocalStorageItem("role");
  const buildUrl = () => {
    const baseEndpoint =
      role === "admin"
        ? API_ENDPOINTS.GET_TRAINER_BY_ADMIN
        : API_ENDPOINTS.GET_TRAINER;

    const params = new URLSearchParams({
      page: (page + 1).toString(),
      limit: rowsPerPage.toString(),
    });

    if (activeStatus && activeStatus !=="all") {
      params.append("status", activeStatus);
    }

    if (searchValue) {
      params.append("search", searchValue);
    }

    if (adminId) {
      params.append("admin_id", adminId);
    }

    return `${baseEndpoint}?${params.toString()}`;
  };

  const shouldEnableQuery = role === "admin" ? true : Boolean(adminId);

  return useQuery({
    queryKey: ["getTrainers", page, activeStatus, searchValue, adminId],
    queryFn: () => HttpClient.get(buildUrl()),
    enabled: shouldEnableQuery,
    onError: (error) => {
      console.error("Failed to fetch trainers list:", error.message);
    },

    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    keepPreviousData: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

