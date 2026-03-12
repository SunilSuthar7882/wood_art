import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useQuery } from "@tanstack/react-query";

export function useGetCustomers(page, rowsPerPage, activeStatus, searchValue, trainerId) {
  const role = getLocalStorageItem("role");

  const buildUrl = () => {
    const baseEndpoint =
      role === "admin"
        ? API_ENDPOINTS.GET_CUSTOMER_BY_ADMIN
        : API_ENDPOINTS.GET_CUSTOMER;

    const params = new URLSearchParams({
      page: page.toString(),
      limit: rowsPerPage.toString(),
      trainer_id: trainerId,
    });

    if (activeStatus && activeStatus !== "all") {
      params.append("status", activeStatus);
    }

    if (searchValue) {
      params.append("search", searchValue);
    }

    return `${baseEndpoint}?${params.toString()}`;
  };

  return useQuery({
    queryKey: [
      "getcustomers",
      page,
      rowsPerPage,
      activeStatus,
      searchValue,
      trainerId,
      role,
    ],
    queryFn: () => HttpClient.get(buildUrl()),
    onError: (error) => {
      console.error("Failed to fetch users list:", error.message);
    },
  });
}

