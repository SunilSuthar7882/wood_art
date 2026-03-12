import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useQuery } from "@tanstack/react-query";

// export function useGetMealCategories(enabled = true) {
//   return useQuery({
//     queryKey: ["getMealCategory"],
//     queryFn: async () => {
//       const response = await HttpClient.get(API_ENDPOINTS.GET_MEAL_PLAN_CATEGORY);
//       return response.data.data;
//     },
//     enabled,
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 30 * 60 * 1000,
//     retry: 3,
//     retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
//     onError: (error) => {
//       console.error("Failed to fetch meal categories:", error);
//     },
//   });
// }

export function useGetMealCategories(enabled = true) {
  return useQuery({
    queryKey: ["getMealCategory"],
    queryFn: async () => {
      const response = await HttpClient.get(
        API_ENDPOINTS.GET_MEAL_PLAN_CATEGORY
      );
      const raw = response.data; // <-- not response.data.data
      return raw.map((item) => ({
        id: item.id,
        name: item.name,
      }));
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error("Failed to fetch meal categories:", error);
    },
  });
}

export const useGetAllTemplatePlans = ({
  searchText = "",
  numberOfDays = "",
  mealsPerDay = "",
  categoryId = [],
  minCalories = "",
  maxCalories = "",
  macroProfiles = "",
  enabled = true,
}) => {
  return useQuery({
    queryKey: [
      "all-template-plans",
      {
        searchText,
        numberOfDays,
        mealsPerDay,
        categoryId,
        minCalories,
        maxCalories,
        macroProfiles,
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: "1",
        limit: "1000",
      });

      if (searchText) params.append("search", searchText);
      if (numberOfDays) params.append("number_of_days", numberOfDays);
      if (mealsPerDay) params.append("meals_per_day", mealsPerDay);
      // if (categoryId) params.append("category_id", categoryId);
      // if (Array.isArray(categoryId) && categoryId.length > 0) {
      //   categoryId.forEach((id) => {
      //     params.append("category_id[]", String(id));
      //   });
      // } else if (categoryId) {
      //   params.append("category_id[]", String(categoryId));
      // }
      // ✅ Handle category ids only if explicitly selected
      if (Array.isArray(categoryId) && categoryId.length > 0) {
        categoryId.forEach((id) => {
          params.append("category_id[]", String(id));
        });
      } else if (typeof categoryId === "string" && categoryId.trim() !== "") {
        params.append("category_id[]", categoryId);
      }

      if (minCalories) params.append("min_calories", minCalories);
      if (maxCalories) params.append("max_calories", maxCalories);
      if (macroProfiles) params.append("macro_profile_id", macroProfiles);

      const response = await HttpClient.get(
        `${API_ENDPOINTS.GET_ALL_TEMPLATE_PLANS}?${params.toString()}`
      );

      return response?.data?.page_data || [];
    },
    enabled: Boolean(enabled), // ensures `false`, `null`, or `undefined` disables query
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    keepPreviousData: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error("❌ Failed to fetch template plans:", error);
    },
  });
};
