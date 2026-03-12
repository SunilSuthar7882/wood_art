"use client";

import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { errorNotification } from "@/helpers/notification";
import { useMutation } from "@tanstack/react-query";

export function useNearbyPlacesMutation() {
  return useMutation({
    mutationFn: async (input) =>
      HttpClient.get(API_ENDPOINTS.GET_NEARBY_PLACES, input),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      errorNotification(`${error.message}`);
    },
  });
}
