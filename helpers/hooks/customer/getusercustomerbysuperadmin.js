import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useQuery } from "@tanstack/react-query";

export function useGetusercustomerbysuperadmin(customer_id) {
  const role = getLocalStorageItem("role");
  const baseUrl =
    role === "super_admin"
      ? `${API_ENDPOINTS.USER_GET_CUSTOMER_BY_SUPERADMIN}?customer_id=${customer_id}`
      : role === "admin"
      ? `${API_ENDPOINTS.USER_GET_CUSTOMER_BY_ADMIN}?customer_id=${customer_id}`
      : role === "trainer"
      ? `${API_ENDPOINTS.USER_GET_CUSTOMER_BY_TRAINER}?customer_id=${customer_id}`
      : null;
  return useQuery({
    queryKey: ["Getusercustomerbysuperadmin"],
    queryFn: async () => HttpClient.get(baseUrl),
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
  });
}
