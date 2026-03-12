import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useQuery } from "@tanstack/react-query";

export function useGetdropdownadmintrainerlist(adminId) {
  const role = getLocalStorageItem("role");

  const buildUrl = () => {
    const baseEndpoint = API_ENDPOINTS.GET_TRAINER_DROPDOWN_LIST;
    const params = new URLSearchParams({
      admin_id: adminId,
    });
    return `${baseEndpoint}?${params.toString()}`;
  };

  return useQuery({
    queryKey: ["getdropdownadmintrainerlist", adminId],
    queryFn: () => HttpClient.get(buildUrl()),
    enabled: !!adminId,
    onError: (error) => {
      console.error("Failed to fetch trainer list:", error.message);
    },
  });
}
