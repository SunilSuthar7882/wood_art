import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useQuery } from "@tanstack/react-query";

export function useGetusertrainerbysuperadmin(trainer_id) {
  const role = getLocalStorageItem("role");
  const baseUrl =
    role === "super_admin"
      ? `${API_ENDPOINTS.USER_GET_TRAINER_BY_SUPERADMIN}?trainer_id=${trainer_id}`
      : role === "admin"
      ? `${API_ENDPOINTS.USER_GET_TRAINER_BY_ADMIN}?trainer_id=${trainer_id}`
      : null;

  return useQuery({
    queryKey: ["Getusertrainerbysuperadmin"],
    queryFn: async () =>
      HttpClient.get(
        baseUrl
      ),
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
  });
}
