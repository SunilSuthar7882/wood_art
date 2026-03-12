import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function userConfigurationsReferralupdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) =>
      HttpClient.patch(API_ENDPOINTS.CONFIGURATIONS_REFERRAL_UPDATE, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["configurationsreferralget"]);
      return data;
    },
    onError: (error) => {
      return error;
    },
  });
}
