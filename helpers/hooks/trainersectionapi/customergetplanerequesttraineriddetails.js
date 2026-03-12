import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetcustomergetplanerequesttrainerbyid(request_id) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["Getcustomergetplanerequesttrainerbyid"],
    queryFn: async () =>
      HttpClient.get(
        request_id &&
          `${API_ENDPOINTS.CUSTOMER_PLAN_REQUEST_GET_BY_TRAINER_ID_DETAILS}?request_id=${request_id}`
      ),
    onSuccess: (data) => {
      //   queryClient.invalidateQueries(["userDetails"]);
      return data;
    },
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
    gcTime: 0,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
}
