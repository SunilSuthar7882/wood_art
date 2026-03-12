import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HttpClient } from "../../clients/http-client";
import { API_ENDPOINTS } from "../../api-endpoints";

export function useCopiedDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return HttpClient.patch(API_ENDPOINTS.COPIED_DAY, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getMealPlan"]);
    },
  });
}
export function useCopiedDaySlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return HttpClient.patch(API_ENDPOINTS.COPIED_DAY_SLOT, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getMealPlan"]);
    },
  });
}
