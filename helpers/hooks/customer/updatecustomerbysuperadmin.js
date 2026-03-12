"use client";

import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function updateCustomerBySuperadmin() {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: async (input) =>
      HttpClient.patch(API_ENDPOINTS.USER_EIDT_CUSTOMER_BY_SUPERADMIN, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getcustomers"]); 

      return data;
    },
    onError: (error) => {
      
    },
  });
}
