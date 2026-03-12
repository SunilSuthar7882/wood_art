import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetcustomergetplanerequestadminbyid(request_id) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["Getcustomergetplanerequestadminbyid"],
    queryFn: async () =>
      HttpClient.get(
        request_id &&
          `${API_ENDPOINTS.CUSTOMER_PLAN_REQUEST_GET_BY_ADMIN_ID_DETAILS}?request_id=${request_id}`
      ),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
    gcTime: 0,
  });
}
