import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useQuery } from "@tanstack/react-query";

export function useGetAllPayments({ limit = 10, start_after = "", user_id = "", start_date = "" }) {
  const params = new URLSearchParams();

  if (limit) params.append("limit", limit.toString());
  if (start_after) params.append("start_after", start_after);
  if (user_id) params.append("user_id", user_id.toString());
  if (start_date) params.append("start_date", start_date);

  const url = `${API_ENDPOINTS.GET_ALL_PAYMENTS}?${params.toString()}`;

  return useQuery({
    queryKey: ["GetAllPayments", limit, start_after, user_id, start_date],
    queryFn: async () => HttpClient.get(url),
    // enabled: !!user_id,
    keepPreviousData: true,
    onError: (error) => {
      console.error("Failed to fetch payments:", error.message);
    },
  });
}
