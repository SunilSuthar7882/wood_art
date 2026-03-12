"use client";

import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { errorNotification } from "@/helpers/notification";
import { useMutation } from "@tanstack/react-query";

export function useLoginByEmailMutation() {
  return useMutation({
    mutationFn: async (input) => HttpClient.post(API_ENDPOINTS.LOGIN, input),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
    },
  });
}
