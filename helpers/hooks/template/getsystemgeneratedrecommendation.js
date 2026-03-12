import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useQuery } from "@tanstack/react-query";

export function useGetSystemGeneratedRecommendation({
  // user_id = "",
  max_calories = "",
  min_calories = "",
}) {
  const params = new URLSearchParams();

  // if (user_id) params.append("user_id", user_id.toString());
  if (max_calories) params.append("max_calories", max_calories);
  if (min_calories) params.append("min_calories", min_calories);

  const url = `${
    API_ENDPOINTS.GET_SYSTEM_GENERATED_RECOMMENDATION
  }?${params.toString()}`;

  return useQuery({
    queryKey: [
      "getsystemgeneratedrecommendation",
      // user_id,
      max_calories,
      min_calories,
    ],
    queryFn: async () => HttpClient.get(url),
    enabled: Boolean(max_calories && min_calories),
    keepPreviousData: true,
    onError: (error) => {
      console.error(
        "Failed to fetch system generated recommendation:",
        error.message
      );
    },
  });
}
