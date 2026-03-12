import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useQuery } from "@tanstack/react-query";

export function useGetcustomergetplanerequestadmin(page,rowsPerPage, activeStatus) {
  return useQuery({
    queryKey: ["Getcustomergetplanerequestadmin"],
    queryFn: async () =>
      HttpClient.get(
        activeStatus
          ? `${API_ENDPOINTS.CUSTOMER_PLAN_REQUEST_GET_BY_ADMIN}?page=${page}&limit=${rowsPerPage}&status=${activeStatus}`
          : activeStatus
          ? `${API_ENDPOINTS.CUSTOMER_PLAN_REQUEST_GET_BY_ADMIN}?page=${page}&limit=${rowsPerPage}&status=${activeStatus}`
          : `${API_ENDPOINTS.CUSTOMER_PLAN_REQUEST_GET_BY_ADMIN}?page=${page}&limit=${rowsPerPage}`
      ),
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
  });
}
