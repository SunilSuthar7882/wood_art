import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdatefoodhaveitflagebycustomer() {
  const queryClient = useQueryClient(); 
    return useMutation({
    mutationFn: async ({ plan_id, food_serving_id }) => {
      return HttpClient.patch(
        `${API_ENDPOINTS.UPDATE_FOOD_HAVE_IT}?plan_id=${plan_id}&food_serving_id=${food_serving_id}`
      );
    },
    onSuccess: () => {
     
      queryClient.invalidateQueries(["Getfoodshoppinglistbycustomer"]);
    },
    onError: (error) => {
      console.error("Failed to update item:", error.message);
    },
  });
}