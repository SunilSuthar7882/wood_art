import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddCustomerDetailMutation() {
  return useMutation({
    mutationFn: async (input) =>
      HttpClient.post(API_ENDPOINTS.ADD_CUSTOMER, input),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error(`${error.message}`);
    },
  });
}
export function useEditCustomerDetailMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) =>
      HttpClient.patch(API_ENDPOINTS.EDIT_CUSTOMER, input),
    onSuccess: (data) => {
      //   queryClient.invalidateQueries(["userDetails"]);
      return data;
    },
    onError: (error) => {
      console.error(`${error.message}`);
    },
  });
}
