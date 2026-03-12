import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteCustomerbySuperadmin() {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: async (customer_id) => {
      return HttpClient.delete(
        `${API_ENDPOINTS.DELETE_CUSTOMER_BY_SUPERADMIN}?customer_id=${customer_id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["customer"]); 
    },
    onError: (error) => {
      console.error("Failed to delete contractor:", error.message);
    },
  });
}