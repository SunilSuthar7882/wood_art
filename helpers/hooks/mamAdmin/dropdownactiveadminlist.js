import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useQuery } from "@tanstack/react-query";

export function useDropdownActiveAdminList() {
  return useQuery({
    queryKey: ["GetDropdownActiveAdminList"],
    queryFn: async () =>
      HttpClient.get(
       
      `${API_ENDPOINTS.GET_ADMIN_DROPDOWN_LIST}`
         
      ),
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
    // keepPreviousData: true,
    // refetchOnWindowFocus: false,
  });
}
