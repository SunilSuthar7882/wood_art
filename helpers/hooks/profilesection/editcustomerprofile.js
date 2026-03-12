import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function editCustomerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) =>
      HttpClient.patch(API_ENDPOINTS.UPDATE_CUSTOMER_PROFILE, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getprofile"]);
      return data;
    },
    onError: (error) => {
      console.error(`${error.message}`);
    },
  });
}
