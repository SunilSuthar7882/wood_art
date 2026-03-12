"use client";

import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function updateTrainerBySuperadmin() {
  const queryClient = useQueryClient(); 
  return useMutation({
    mutationFn: async (input) =>
      HttpClient.patch(API_ENDPOINTS.USER_EIDT_TRAINER_BY_SUPERADMIN, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getTrainers"]); 

      return data;
    },
    onError: (error) => {
      
    },
  });
}
