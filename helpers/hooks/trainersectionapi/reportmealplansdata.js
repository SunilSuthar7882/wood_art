import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useQuery } from "@tanstack/react-query";

export function useGetreportgetmealplansdata(page, limit,start_date,end_date) {
  return useQuery({
    queryKey: ["Getreportgetmealplansdata"],
    queryFn: async () =>
      HttpClient.get(
       
      `${API_ENDPOINTS.GET_MEAL_PLANS}?page=${page}&limit=${limit}&start_date=${start_date}&end_date=${end_date}`
         
      ),
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
    // keepPreviousData: true,
    // refetchOnWindowFocus: false,
  });
}
