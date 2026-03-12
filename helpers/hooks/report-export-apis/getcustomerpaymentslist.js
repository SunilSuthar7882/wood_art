import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useGetCustomerPayments() {
  return useMutation({
    mutationFn: async (input) =>
      HttpClient.post(API_ENDPOINTS.GET_CUSTOMER_PAYMENT, input),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error(`${error.message}`);
    },
  });
}
