import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useQuery } from "@tanstack/react-query";

export function useGetfoodshoppinglistbycustomer(plan_id) {
  const role = getLocalStorageItem("role");
  const baseUrl =
   `${API_ENDPOINTS.GET_FOOD_SHOPPING_LIST}?plan_id=${plan_id}`
    
     
  return useQuery({
    queryKey: ["Getfoodshoppinglistbycustomer"],
    queryFn: async () => HttpClient.get(baseUrl),
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
  });
}
