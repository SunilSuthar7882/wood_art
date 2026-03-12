import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useQuery } from "@tanstack/react-query";

export function useGetUserDropdownList() {
  const baseUrl =
   `${API_ENDPOINTS.GET_USER_DROPDOWN_LIST}`
    
     
  return useQuery({
    queryKey: ["Getuserdropdownlist"],
    queryFn: async () => HttpClient.get(baseUrl),
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
  });
}
