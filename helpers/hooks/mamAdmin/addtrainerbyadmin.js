"use client";

import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "@/app/contexts/SnackbarContext";

export function addTrainerByadmin() {

  const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbar();
  
    return useMutation({
      mutationFn: async (payload) => {
        try {
          const { data } = await HttpClient.post(API_ENDPOINTS.ADD_TRAINER_BY_ADMIN, payload);
          return data;
        } catch (err) {
          const message =
            err.response?.data?.message ||
            err.response?.statusText ||
            err.message ||
            "An unknown error occurred";
          throw new Error(message);
        }
      },
  
      onSuccess: () => {
        queryClient.invalidateQueries(["getTrainers"]);
        showSnackbar("Email and Password sent to mail successfully!", "success");
      },
  
      onError: (error) => {
        console.error("Failed to add trainer:", error);
        showSnackbar(`Creation failed: ${error.message}`, "error");
      },
    });
}
