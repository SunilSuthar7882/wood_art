import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { Routes } from "@/config/routes";
import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// export function useGetMealPlans(
//   page,
//   rowsPerPage,
//   searchValue,
//   categoryID,
//   customerID,
// ) {
//   const role = getLocalStorageItem("role");
//   const { showSnackbar } = useSnackbar?.() || { showSnackbar: () => {} };

//   // Build the API URL with query parameters
//   const buildUrl = () => {
//     const baseEndpoint =
//       role === "customer"
//         ? API_ENDPOINTS.GET_PLANS_BY_CUSTOMER
//         : role === "admin"
//         ? API_ENDPOINTS.GET_DIET_PLANS
//         : API_ENDPOINTS.GET_DIET_PLANS_BY_TRAINER;

//     const params = new URLSearchParams({
//       page: (page+1).toString(),
//       limit: rowsPerPage.toString(),
//     });

//     // if (activeStatus && activeStatus !== "all") {
//     //   params.append("status", activeStatus);
//     // }

//     if (searchValue && searchValue.trim()) {
//       params.append("search", searchValue.trim());
//     }
//     if (categoryID) {
//       params.append("category_id", categoryID);
//     }
//     if (role === "trainer" && customerID) {
//       params.append("user_id", customerID);
//     }

//     return `${baseEndpoint}?${params.toString()}`;
//   };

//   // Use the query hook to fetch data
//   return useQuery({
//     queryKey: [
//   "getMealPlans",
//   page,
//   rowsPerPage,
//   searchValue,
//   categoryID,
//   customerID,
//   role,
// ],

//     queryFn: async () => {
//       try {
//         console.log("UI page index:", page, "API URL:", buildUrl());
//         const response = await HttpClient.get(buildUrl());
//         return response;
//       } catch (error) {
//         // Show error message to user
//         showSnackbar?.("Failed to load diet plans", "error");
//         throw error;
//       }
//     },
//     keepPreviousData: false, // Keep previous results while fetching new data
//     refetchOnWindowFocus: false,
//     staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
//     onError: (error) => {
//       console.error("Failed to fetch meal plan list:", error.message);
//     },
//   });
// }

export function useGetMealPlans(
  page,
  rowsPerPage,
  searchValue,
  categoryID,
  sortValue,
  customerID
) {
  const role = getLocalStorageItem("role");
  const { showSnackbar } = useSnackbar?.() || { showSnackbar: () => {} };

  // Detect pagination base once
  const paginationBase = useRef(null); // null = unknown, 0 = zero-based, 1 = one-based

  // Build URL dynamically
  const buildUrl = (detectedBase) => {
    const baseEndpoint =
      role === "customer"
        ? API_ENDPOINTS.GET_PLANS_BY_CUSTOMER
        : role === "admin"
        ? API_ENDPOINTS.GET_DIET_PLANS
        : API_ENDPOINTS.GET_DIET_PLANS_BY_TRAINER;

    const base = detectedBase ?? 1; // assume 1-based until detected
    const apiPage = page + base;

    const params = new URLSearchParams({
      page: apiPage.toString(),
      limit: rowsPerPage.toString(),
    });

    if (searchValue && searchValue.trim()) {
      params.append("search", searchValue.trim());
    }
    if (categoryID) {
      params.append("category_id", categoryID);
    }
    if (sortValue) {
      params.append("sort_by", sortValue);
    }
    if (role === "trainer" && customerID) {
      params.append("user_id", customerID);
    }

    return `${baseEndpoint}?${params.toString()}`;
  };

  return useQuery({
    queryKey: [
      "getMealPlans",
      page,
      rowsPerPage,
      searchValue,
      categoryID,
      customerID,
      sortValue,
      role,
    ],
    queryFn: async () => {
      try {
        const url = buildUrl(paginationBase.current);
        const response = await HttpClient.get(url);

        // Detect backend pagination base once
        if (paginationBase.current === null && response?.page_info) {
          const detected = response.page_info.current_page === page ? 0 : 1;
          paginationBase.current = detected;
          console.log(
            "🔍 Detected pagination base:",
            detected === 0 ? "0-based" : "1-based"
          );
        }

        return response;
      } catch (error) {
        showSnackbar?.("Failed to load diet plans", "error");
        throw error;
      }
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      console.error("Failed to fetch meal plan list:", error.message);
    },
  });
}

export function useGetMealPlan({ mealPlanId, enabled = true }) {
  const role = getLocalStorageItem("role");

  const queryKey = ["getMealPlan", mealPlanId, role];

  const baseUrl =
    role === "admin"
      ? API_ENDPOINTS.GET_MEAL_PLAN_BY_ADMIN
      : role === "customer"
      ? API_ENDPOINTS.GET_MEAL_BY_CUSTOMER
      : role === "trainer"
      ? API_ENDPOINTS.GET_MEAL_BY_TRAINER
      : null;

  const queryFn = () => {
    const params = new URLSearchParams({
      plan_id: String(mealPlanId),
    });

    return HttpClient.get(`${baseUrl}?${params.toString()}`);
  };

  return useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    enabled,
    onError: (error) => {
      console.error("Failed to fetch meal plan list:", error.message);
    },
  });
}

export function useAddFood() {
  const role = getLocalStorageItem("role");
  const queryClient = useQueryClient();

  const baseUrl =
    role === "admin"
      ? API_ENDPOINTS.ADD_FOOD
      : role === "trainer"
      ? API_ENDPOINTS.ADD_FOOD_BY_TRAINER
      : API_ENDPOINTS.ADD_FOOD_BY_CUSTOMER;

  return useMutation({
    mutationFn: async (payload) => {
      const res = await HttpClient.post(baseUrl, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["addFood"]);
    },
    onError: (error) => {
      console.error(`Failed to add food: ${error.message}`);
    },
  });
}

export function useAddRecipeFood() {
  const role = getLocalStorageItem("role");
  const queryClient = useQueryClient();

  // const baseUrl =
  //   role === "admin"
  //     ? API_ENDPOINTS.ADD_RECIPE_FOOD
  //     : role === "trainer"
  //     ? API_ENDPOINTS.ADD_RECIPE_FOOD
  //     : API_ENDPOINTS.ADD_RECIPE_FOOD;

  return useMutation({
    mutationFn: async (payload) => {
      const res = await HttpClient.post(API_ENDPOINTS.ADD_RECIPE_FOOD, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["addFood"]);
    },
    onError: (error) => {
      console.error(`Failed to add food: ${error.message}`);
    },
  });
}

export function useManageFavoriteFood() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // pick endpoint based on role
  const baseUrl = API_ENDPOINTS.MANGE_FAV_FOOD;

  return useMutation({
    // 1) mutationFn with try/catch + normalized error
    mutationFn: async (foodId) => {
      try {
        const { data } = await HttpClient.patch(
          baseUrl,
          { food_id: foodId },
          {
            params: { food_id: foodId },
          }
        );
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

    // 2) onSuccess: invalidate and notify
    onSuccess: () => {
      queryClient.invalidateQueries(["editMealSlot"]);
      showSnackbar("Food status updated successfully!", "success");
    },

    // 3) onError: log and notify
    onError: (error) => {
      console.error("Failed to add as favorite food:", error);
      showSnackbar(`Add failed: ${error.message}`, "error");
    },
  });
}

// export function useFetchFavFoodList(type) {
//   const role = getLocalStorageItem("role");

//   const getUrl = () => {
//     const baseEndpoint = API_ENDPOINTS.FAV_FOOD;
//     if (!baseEndpoint) return null;

//     // Build query string safely
//     const queryParams = new URLSearchParams();
//     if (type) queryParams.append("type", type);

//     return queryParams.toString()
//       ? `${baseEndpoint}?${queryParams.toString()}`
//       : baseEndpoint;
//   };

//   return useQuery({
//     queryKey: ["getFavFoods", role, type],
//     queryFn: async () => {
//       const url = getUrl();
//       if (!url) throw new Error("Invalid endpoint");

//       const response = await HttpClient.get(url);
//       return response;
//     },
//     keepPreviousData: true,
//     refetchOnWindowFocus: false,
//     onError: (error) => {
//       console.error("Failed to fetch favorite food list:", error.message);
//     },
//   });
// }

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useFetchFoodList({
  pageSize = 10,
  searchValue,
  type,
  foodIdToReplace,
  typeOption,
  get_own,
}) {
  const role = getLocalStorageItem("role");

  const getUrl = (pageParam = 0) => {
    const baseEndpoint = API_ENDPOINTS.GET_FOOD;
    if (!baseEndpoint) return null;

    const params = new URLSearchParams();

    params.append("page", (pageParam + 1).toString());
    params.append("limit", pageSize.toString());
    if (type) params.append("type", type.toString());
    if (typeOption) params.append("type", typeOption.toString());
    if (searchValue) params.append("search", searchValue);
    if (foodIdToReplace) params.append("excluded_food_id", foodIdToReplace);
    // if (role === "trainer") params.append("get_own", "true");
    return `${baseEndpoint}?${params.toString()}`;
  };

  return useInfiniteQuery({
    queryKey: ["getFoods", pageSize, searchValue, typeOption, role],
    queryFn: async ({ pageParam = 0 }) => {
      // await sleep(500);
      const url = getUrl(pageParam);
      if (!url) throw new Error("Invalid endpoint");

      const response = await HttpClient.get(url);

      const pageData = response.data?.page_data ?? [];
      const pageInfo = response.data?.page_information ?? {};

      return {
        foods: pageData,
        nextPage: pageInfo.next_page !== 0 ? pageInfo.current_page : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    enabled: !!role,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error("Failed to fetch food list:", error.message);
    },
  });
}

export function useFetchFavFoodList({ type, typeOption }) {
  const role = getLocalStorageItem("role");

  const getUrl = () => {
    const baseEndpoint = API_ENDPOINTS.FAV_FOOD;
    if (!baseEndpoint) return null;

    const params = new URLSearchParams();
    if (type) {
      params.append("type", type);
    }
    if (typeOption) {
      params.append("type", typeOption);
    }

    return params.toString()
      ? `${baseEndpoint}?${params.toString()}`
      : baseEndpoint;
  };

  return useQuery({
    queryKey: ["getFavFoods", type, typeOption, role],
    queryFn: async () => {
      const url = getUrl();
      if (!url) throw new Error("Invalid endpoint");

      const response = await HttpClient.get(url);
      return response;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error("Failed to fetch favorite food list:", error.message);
    },
  });
}

export function useCreateFood() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.post(
          API_ENDPOINTS.CREATE_FOOD,
          payload
        );
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
      queryClient.invalidateQueries(["create-coupon"]);
      showSnackbar("Food created successfully!", "success");
    },

    onError: (error) => {
      console.error("Failed to create food:", error);
      showSnackbar(`Creation failed: ${error.message}`, "error");
    },
  });
}

export function useGetTemplatePlan({ templateId, enabled = true }) {
  const queryKey = ["getMealPlan", templateId];

  const baseUrl = API_ENDPOINTS.GET_TEMPLATE_PLAN;

  const queryFn = () => {
    const params = new URLSearchParams({
      template_id: String(templateId),
    });

    return HttpClient.get(`${baseUrl}?${params.toString()}`);
  };

  return useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    enabled: !!templateId && enabled,
    onError: (error) => {
      console.error("Failed to fetch meal plan list:", error.message);
    },
  });
}

export function useGetTemplatePlans(
  page,
  pageSize,
  searchValue,
  categoryID,
  sortValue
) {
  const { showSnackbar } = useSnackbar?.() || { showSnackbar: () => {} };

  const buildUrl = () => {
    const baseEndpoint = API_ENDPOINTS.GET_TEMPLATE_PLANS;

    const params = new URLSearchParams({
      page: (page + 1).toString(),
      limit: pageSize.toString(),
    });

    // if (activeStatus && activeStatus !== "all") {
    //   params.append("status", activeStatus);
    // }

    if (searchValue && searchValue.trim()) {
      params.append("search", searchValue.trim());
    }
    if (categoryID) {
      params.append("category_id", categoryID);
    }
    if (sortValue) {
      params.append("sort_by", sortValue);
    }
    return `${baseEndpoint}?${params.toString()}`;
  };

  return useQuery({
    queryKey: [
      "getTemplatePlans",
      page,
      pageSize,
      searchValue,
      categoryID,
      sortValue,
    ],
    queryFn: async () => {
      try {
        const response = await HttpClient.get(buildUrl());
        return response;
      } catch (error) {
        showSnackbar?.("Failed to load template plans", "error");
        throw error;
      }
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      console.error("Failed to fetch template plans:", error.message);
    },
  });
}

export function useAddNewTemplateMealSlot() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // pick endpoint based on role
  const role = getLocalStorageItem("role");
  const baseUrl = API_ENDPOINTS.ADD_TEMPLATE_MEAL_SLOT;

  return useMutation({
    // 1) mutationFn with try/catch + normalized error
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.post(baseUrl, payload);
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

    // 2) onSuccess: invalidate and notify
    onSuccess: () => {
      queryClient.invalidateQueries(["addMealSlot"]);
      showSnackbar("Meal slot added successfully!", "success");
    },

    // 3) onError: log and notify
    onError: (error) => {
      console.error("Failed to add meal slot:", error);
      showSnackbar(`Add failed: ${error.message}`, "error");
    },
  });
}

export function useAddFoodInTemplate() {
  const role = getLocalStorageItem("role");
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const baseUrl = API_ENDPOINTS.ADD_FOOD_IN_TEMPLATE;

  return useMutation({
    mutationFn: async (payload) => {
      const res = await HttpClient.post(baseUrl, payload);
      return res;
    },
    onSuccess: (data) => {
      if (data?.success) {
        showSnackbar(data.message || "Food added successfully.");
      } else {
        showSnackbar(data?.message || "Something went wrong.");
      }
      queryClient.invalidateQueries(["addFood"]);
    },
    onError: (error) => {
      console.error(`Failed to add food: ${error.message}`);
      showSnackbar("Failed to add food. Please try again.");
    },
  });
}

export function useGetFoodAllList(page, rowsPerPage, searchValue, type) {
  const role = getLocalStorageItem("role");
  const { showSnackbar } = useSnackbar?.() || { showSnackbar: () => {} };
  const buildUrl = () => {
    const baseEndpoint = API_ENDPOINTS.GET_FOOD;

    const params = new URLSearchParams({
      page: (page + 1).toString(),
      limit: rowsPerPage.toString(),
    });

    if (type === "recipe") {
      params.append("type", "recipe");
    }
    if (type === "food") {
      params.append("type", "food");
    }
    if (searchValue && searchValue.trim()) {
      params.append("search", searchValue.trim());
    }
    if (role === "trainer" || "admin") params.append("get_own", "true");
    return `${baseEndpoint}?${params.toString()}`;
  };
  return useQuery({
    queryKey: ["getAllFoods", page, rowsPerPage, searchValue, role],
    queryFn: async () => {
      try {
        const response = await HttpClient.get(buildUrl());
        return response;
      } catch (error) {
        showSnackbar?.("Failed to load food", "error");
        throw error;
      }
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      console.error("Failed to fetch food list:", error.message);
    },
  });
}

export function useGetFoodData({ food_id, enabled = true }) {
  // const role = getLocalStorageItem("role");

  const queryKey = ["getFoodData", food_id];

  const baseUrl = API_ENDPOINTS.GET_FOOD_DATA;

  const queryFn = () => {
    const params = new URLSearchParams({
      food_id: String(food_id),
    });

    return HttpClient.get(`${baseUrl}?${params.toString()}`);
  };

  return useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    enabled: !!food_id && enabled,
    onError: (error) => {
      console.error("Failed to fetch meal plan list:", error.message);
    },
  });
}

export function useFetchFoodCategories( type, searchValue = "") {
  const role = getLocalStorageItem("role");

  const getUrl = () => {
    const baseEndpoint = API_ENDPOINTS.GET_FOOD_CATEGORIES;
    if (!baseEndpoint) return null;

    const params = new URLSearchParams();
    if (searchValue) params.append("search", searchValue);
    if (type) params.append("type", type);

    return `${baseEndpoint}?${params.toString()}`;
  };

  return useQuery({
    queryKey: ["foodCategories", searchValue,type, role],
    queryFn: async () => {
      const url = getUrl();
      if (!url) throw new Error("Invalid category endpoint");

      const response = await HttpClient.get(url);
      return response?.data || []; // Assumes API returns { data: [...] }
    },
    enabled: !!role,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error("Failed to fetch food categories:", error.message);
    },
  });
}

export function useCreateNewFood() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.post(
          API_ENDPOINTS.CREATE_FOOD,
          payload
        );
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
      queryClient.invalidateQueries(["create-coupon"]);
      showSnackbar("Food created successfully!", "success");
    },

    onError: (error) => {
      console.error("Failed to create food:", error);
      showSnackbar(`Creation failed: ${error.message}`, "error");
    },
  });
}

export function useFetchServingUnits() {
  return useQuery({
    queryKey: ["servingUnits"],
    queryFn: async () => {
      const response = await HttpClient.get(API_ENDPOINTS.GET_SERVING_UNITS);
      return response?.data || [];
    },
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error("Failed to fetch serving units:", error.message);
    },
  });
}

export function useEditServingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input) =>
      HttpClient.patch(API_ENDPOINTS.EDIT_SERVING, input),
    onSuccess: (data) => {
      // Optionally refetch serving list or food data
      // queryClient.invalidateQueries(["foodData"]);
      return data;
    },
    onError: (error) => {
      console.error("Serving update error:", error.message);
    },
  });
}

export function useEditFoodInfoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return HttpClient.patch(API_ENDPOINTS.EDIT_FOOD_INFO, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(); // Optional: refetch updated food data
    },
    onError: (error) => {
      console.error("Error updating food info:", error.message);
    },
  });
}

export function useDeleteServingMutation() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (servingId) => {
      try {
        const { data } = await HttpClient.delete(API_ENDPOINTS.DELETE_SERVING, {
          params: { food_serving_id: servingId },
        });
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
      queryClient.invalidateQueries(["food-data"]);
      showSnackbar("Serving deleted successfully!", "success");
    },
    onError: (error) => {
      console.error("Failed to delete serving:", error);
      showSnackbar(`Delete failed: ${error.message}`, "error");
    },
  });
}

export function useAddFoodServingMutation() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar(); // Optional

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await HttpClient.post(
        API_ENDPOINTS.ADD_FOOD_SERVING,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["foodData"]); // Replace with correct key
      showSnackbar?.("Serving added successfully", "success");
    },
    onError: (err) => {
      console.error("Add Serving failed:", err);
      showSnackbar?.(`Failed: ${err.message}`, "error");
    },
  });
}

export function useGetFoodServings({ food_id, enabled = true }) {
  // const role = getLocalStorageItem("role");

  const queryKey = ["getFoodData", food_id];

  const baseUrl = API_ENDPOINTS.GET_FOOD_SERVINGS;

  const queryFn = () => {
    const params = new URLSearchParams({
      food_id: String(food_id),
    });

    return HttpClient.get(`${baseUrl}?${params.toString()}`);
  };

  return useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    enabled: !!food_id && enabled,
    onError: (error) => {
      console.error("Failed to fetch food data:", error.message);
    },
  });
}

export function useUpdateFoodServingMutation() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await HttpClient.patch(
        API_ENDPOINTS.UPDATE_FOOD_SERVING_MEAL_PLAN,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mealPlan"]);
      showSnackbar?.("Serving updated successfully", "success");
    },
    onError: (err) => {
      console.error("Update Serving failed:", err);
      showSnackbar?.(`Update failed: ${err.message}`, "error");
    },
  });
}
export function useUpdateRecipeServingMutation() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await HttpClient.patch(
        API_ENDPOINTS.UPDATE_RECIPE_SERVINGS,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mealPlan"]);
      showSnackbar?.("Serving updated successfully", "success");
    },
    onError: (err) => {
      console.error("Update Serving failed:", err);
      showSnackbar?.(`Update failed: ${err.message}`, "error");
    },
  });
}

export function useUpdateTemplateFoodServingMutation() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await HttpClient.patch(
        API_ENDPOINTS.UPDATE_FOOD_SERVING_TEMPLATE_PLAN,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mealPlan"]);
      showSnackbar?.("Serving updated successfully", "success");
    },
    onError: (err) => {
      console.error("Update Serving failed:", err);
      showSnackbar?.(`Update failed: ${err.message}`, "error");
    },
  });
}

export function useFetchSlotNames() {
  return useQuery({
    queryKey: ["mealPlanSlots"],
    queryFn: async () => {
      const response = await HttpClient.get(API_ENDPOINTS.GET_MEAL_SLOT_NAMES);
      return response?.data || [];
    },
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error("Failed to fetch serving units:", error.message);
    },
  });
}

import { useRouter } from "next/navigation"; // ✅ App Router
import { useRef } from "react";

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const router = useRouter(); // 👈

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.post(
          API_ENDPOINTS.CREATE_RECIPE,
          payload
        );
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

    onSuccess: (data) => {
      queryClient.invalidateQueries(["create-recipe"]);
      showSnackbar("Recipe created successfully!", "success");

      const recipeId = data?.id; // Adjust based on actual response key
      if (recipeId) {
        router.push(`${Routes.editRecipe}${recipeId}`);
      }
    },

    onError: (error) => {
      console.error("Failed to create recipe:", error);
      showSnackbar(`Creation failed: ${error.message}`, "error");
    },
  });
}

export function useSaveAsDraftRecipe() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const router = useRouter(); // 👈

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.patch(
          API_ENDPOINTS.EDIT_RECIPE,
          payload
        );
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

    onSuccess: (data) => {
      queryClient.invalidateQueries(["create-recipe"]);
      showSnackbar("Recipe Updated successfully!", "success");

      // const recipeId = data?.id; // Adjust based on actual response key
      // if (recipeId) {
      //   router.push(`${Routes.editRecipe}${recipeId}`);
      // }
    },

    onError: (error) => {
      console.error("Failed to create recipe:", error);
      showSnackbar(`Creation failed: ${error.message}`, "error");
    },
  });
}

export function useSaveAndFinishRecipe() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.patch(
          API_ENDPOINTS.SAVE_AND_FINISH_RECIPE,
          payload
        );
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

    onSuccess: (data) => {
      queryClient.invalidateQueries(["create-recipe"]);
      showSnackbar("Recipe updated successfully!", "success");

      // Optional redirect
      // const recipeId = data?.id;
      // if (recipeId) {
      //   router.push(`${Routes.editRecipe}${recipeId}`);
      // }
    },

    onError: (error) => {
      console.error("Failed to update recipe:", error);
      showSnackbar(`Update failed: ${error.message}`, "error");
    },
  });
}

export function useGetFoodAllRecipe(
  page,
  rowsPerPage,
  // activeStatus,
  searchValue,
  type
) {
  const role = getLocalStorageItem("role");
  const { showSnackbar } = useSnackbar?.() || { showSnackbar: () => {} };
  const buildUrl = () => {
    const baseEndpoint = API_ENDPOINTS.GET_FOOD;

    const params = new URLSearchParams({
      page: (page + 1).toString(),
      limit: rowsPerPage.toString(),
    });

    // if (activeStatus && activeStatus !== "all") {
    //   params.append("status", activeStatus);
    // }
    if (type === "recipe") {
      params.append("type", "recipe");
    }
    if (searchValue && searchValue.trim()) {
      params.append("search", searchValue.trim());
    }
    if (role === "trainer") params.append("get_own", "true");
    return `${baseEndpoint}?${params.toString()}`;
  };
  return useQuery({
    queryKey: [
      "getAllFoods",
      page,
      rowsPerPage,
      // activeStatus,
      searchValue,
      role,
    ],
    queryFn: async () => {
      try {
        const response = await HttpClient.get(buildUrl());
        return response;
      } catch (error) {
        showSnackbar?.("Failed to load food", "error");
        throw error;
      }
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      console.error("Failed to fetch food list:", error.message);
    },
  });
}

export function useCreateRecipeFromTemplate() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  return useMutation({
    // Accept full object (with payload + template info)
    mutationFn: async ({ payload }) => {
      const { data } = await HttpClient.post(
        API_ENDPOINTS.CREATE_RECIPE,
        payload
      );
      return data; // response only has the new recipe ID
    },

    // variables = { payload, templateRecipeId, isTemplateRecipe }
    onSuccess: (data, variables) => {
      const recipeId = data?.id;
      const { templateRecipeId, isTemplateRecipe } = variables;

      queryClient.invalidateQueries(["create-recipe"]);
      showSnackbar("Recipe created successfully!", "success");

      if (recipeId) {
        // Use templateRecipeId here as needed
        router.push(
          `${Routes.editRecipe}${recipeId}?template_id=${templateRecipeId}`
        );
      }
    },

    onError: (error) => {
      console.error("Failed to create recipe:", error);
      showSnackbar(`Creation failed: ${error.message}`, "error");
    },
  });
}

export function useSaveRecipe() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.post(
          API_ENDPOINTS.USE_RECIPE,
          payload
        );
        return { ...data, is_draft: payload.is_draft }; // include this so we can check it in onSuccess
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.response?.statusText ||
          err.message ||
          "An unknown error occurred";
        throw new Error(message);
      }
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries(["create-recipe"]);
      showSnackbar("Recipe Updated successfully!", "success");

      // ✅ Redirect logic based on is_draft flag
      if (data?.is_draft === true && data?.id) {
        router.push(`${Routes.editRecipe}${data.id}`);
      } else {
        router.push(Routes.recipe);
      }
    },

    onError: (error) => {
      console.error("Failed to create recipe:", error);
      showSnackbar(`Creation failed: ${error.message}`, "error");
    },
  });
}

export function useGetRecipeList(
  // page,
  // rowsPerPage,
  // activeStatus,
  searchValue,
  categoryId
) {
  const role = getLocalStorageItem("role");
  const { showSnackbar } = useSnackbar?.() || { showSnackbar: () => {} };
  const buildUrl = () => {
    const baseEndpoint = API_ENDPOINTS.GET_RECIPE_LIST;

    const params = new URLSearchParams({
      // page: (page + 1).toString(),
      // limit: rowsPerPage.toString(),
    });

    // if (activeStatus && activeStatus !== "all") {
    //   params.append("status", activeStatus);
    // }
    if (categoryId) {
      params.append("category_id", categoryId);
    }
    // if (type === "recipe") {
    //   params.append("type", "recipe");
    // }
    if (searchValue && searchValue.trim()) {
      params.append("search", searchValue.trim());
    }
    // if (role === "trainer") params.append("get_own", "true");
    return `${baseEndpoint}?${params.toString()}`;
  };
  return useQuery({
    queryKey: [
      "getAllFoods",
      // page,
      // rowsPerPage,
      // activeStatus,
      searchValue,
      categoryId,
      // role,
    ],
    queryFn: async () => {
      try {
        const response = await HttpClient.get(buildUrl());
        return response;
      } catch (error) {
        showSnackbar?.("Failed to load food", "error");
        throw error;
      }
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      console.error("Failed to fetch food list:", error.message);
    },
  });
}

export function useManageFavoriteMeal() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const baseUrl = API_ENDPOINTS.MANGE_FAV_MEAL;

  return useMutation({
    mutationFn: async ({ id, title }) => {
      try {
        const data = await HttpClient.patch(baseUrl, {
          meal_plan_slot_id: id,
          title: title,
        });
        // console.log("dataaaaaaa",data?.data)
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

    onSuccess: ({ message }) => {
      queryClient.invalidateQueries(["favoriteMeal"]);
      showSnackbar(message, "success");
    },

    onError: ({ message }) => {
      console.error("Failed to add as favorite meal:", error);
      showSnackbar({ message }, "error");
    },
  });
}

export function useFetchFavMealList() {
  const role = getLocalStorageItem("role");

  const getUrl = () => {
    const baseEndpoint = API_ENDPOINTS.FAV_MEAL;
    if (!baseEndpoint) return null;
    return `${baseEndpoint}`;
  };

  return useQuery({
    queryKey: ["getFavMeal", role],
    queryFn: async () => {
      const url = getUrl();
      if (!url) throw new Error("Invalid endpoint");

      const response = await HttpClient.get(url);
      return response;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error("Failed to fetch favorite food list:", error.message);
    },
  });
}

// export function useFetchFavMealList({ mealType, search }) {
//   const role = getLocalStorageItem("role");

//   const getUrl = () => {
//     const baseEndpoint = API_ENDPOINTS.FAV_MEAL;
//     if (!baseEndpoint) return null;

//     const params = new URLSearchParams();

//     // append only if mealType exists and is not "all"
//     if (mealType && mealType !== "all") {
//       params.append("mealType", mealType);
//     }

//     // append only if search is not empty
//     if (search && search.trim() !== "") {
//       params.append("search", search.trim());
//     }

//     return params.toString() ? `${baseEndpoint}?${params.toString()}` : baseEndpoint;
//   };

//   return useQuery({
//     queryKey: ["getFavMeal", role, mealType, search], // include filters in key
//     queryFn: async () => {
//       const url = getUrl();
//       if (!url) throw new Error("Invalid endpoint");

//       const response = await HttpClient.get(url);
//       return response;
//     },
//     keepPreviousData: true,
//     refetchOnWindowFocus: false,
//     onError: (error) => {
//       console.error("Failed to fetch favorite food list:", error.message);
//     },
//   });
// }

export function useGetFavMealDetails({ favMealId, enabled = true }) {
  const queryKey = ["getFavMealDetails", favMealId];

  const queryFn = () => {
    const params = new URLSearchParams({
      meal_plan_slot_id: String(favMealId),
    });

    return HttpClient.get(
      `${API_ENDPOINTS.GET_FAV_MEAL_DETAILS}?${params.toString()}`
    );
  };

  return useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    enabled,
    onError: (error) => {
      console.error("Failed to fetch favorite meal details:", error.message);
    },
  });
}

// export function useGetRecentMealList({ page = 1, limit = 10 } = {}) {
//   const role = getLocalStorageItem("role");

//   const getUrl = () => {
//     const baseEndpoint = API_ENDPOINTS.RECENT_FAV_MEAL;
//     if (!baseEndpoint) return null;

//     const params = new URLSearchParams({
//       type: "favorite_meal",
//       page: String(page),
//       limit: String(limit),
//     });

//     return `${baseEndpoint}?${params.toString()}`;
//   };

//   return useQuery({
//     queryKey: ["getRecentMeal", role, page, limit],
//     queryFn: async () => {
//       const url = getUrl();
//       if (!url) throw new Error("Invalid endpoint");

//       const response = await HttpClient.get(url);
//       return response;
//     },
//     keepPreviousData: true,
//     refetchOnWindowFocus: false,
//     onError: (error) => {
//       console.error("Failed to fetch recent favorite meals:", error.message);
//     },
//   });
// }

// import { useInfiniteQuery } from "@tanstack/react-query";

// export function useGetRecentMealList({ type = "favorite_meal", limit = 10 } = {}) {
//   const role = getLocalStorageItem("role");

//   const fetchMeals = async ({ pageParam = 1 }) => {
//     const baseEndpoint = API_ENDPOINTS.RECENT_FAV_MEAL;
//     const params = new URLSearchParams({
//       type,
//       page: String(pageParam),
//       limit: String(limit),
//     });
//     const url = `${baseEndpoint}?${params.toString()}`;

//     const response = await HttpClient.get(url);

//     return {
//       meals: response.data.page_data,
//       nextPage: response.data.page_information.next_page,
//       currentPage: response.data.page_information.current_page,
//       totalPages: response.data.page_information.last_page,
//     };
//   };

//   return useInfiniteQuery({
//     queryKey: ["infiniteRecentMeals", role, type, limit],
//     queryFn: fetchMeals,
//     getNextPageParam: (lastPage) => {
//       return lastPage.nextPage ?? undefined;
//     },
//     refetchOnWindowFocus: false,
//     keepPreviousData: true,
//     onError: (error) => {
//       console.error("Failed to fetch recent favorite meals:", error.message);
//     },
//   });
// }

// export function useGetRecentMealList({ type =[], enabled = true, limit = 10 }) {
//   return useInfiniteQuery({
//     queryKey: ["getRecentMealList"],
//     queryFn: async ({ pageParam = 1 }) => {
//       const baseEndpoint = API_ENDPOINTS.RECENT_FAV_MEAL;
//       const params = new URLSearchParams({
//         type: type,
//         page: String(pageParam),
//         limit: String(limit),
//       });
//       const url = `${baseEndpoint}?${params.toString()}`;

//       const response = await HttpClient.get(url);
//       return {
//         meals: response.data.page_data,
//         nextPage: response.data.page_information.next_page,
//         currentPage: response.data.page_information.current_page,
//         totalPages: response.data.page_information.last_page,
//       };
//     },
//     getNextPageParam: (lastPage) =>
//       lastPage?.nextPage ? lastPage.nextPage : undefined,
//     enabled,
//     refetchOnWindowFocus: false,
//   });
// }

export function useGetRecentMealList({ type, enabled = true, limit = 10 }) {
  return useInfiniteQuery({
    queryKey: ["getRecentMealList", type, limit], // include type in queryKey
    queryFn: async ({ pageParam = 1 }) => {
      const baseEndpoint = API_ENDPOINTS.RECENT_FAV_MEAL;
      const params = new URLSearchParams();

      // Handle type being array or string
      if (Array.isArray(type)) {
        type.forEach((t) => params.append("type[]", t));
      } else if (type) {
        params.append("type", type);
      }

      params.append("page", String(pageParam));
      params.append("limit", String(limit));

      const url = `${baseEndpoint}?${params.toString()}`;

      const response = await HttpClient.get(url);
      return {
        meals: response.data.page_data,
        nextPage: response.data.page_information.next_page,
        currentPage: response.data.page_information.current_page,
        totalPages: response.data.page_information.last_page,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage?.nextPage ? lastPage.nextPage : undefined,
    enabled,
    refetchOnWindowFocus: false,
  });
}

export function useGetRecipeAndFoodAllList(
  page,
  rowsPerPage,
  searchValue,
  type,
  categoryID,
  // categoryIDs,
  sortValue,
  get_own,
  is_created_by_you
) {
  // console.log("Sort by value:", sortValue);
  // console.log("categoryID:", categoryID);
  const role = getLocalStorageItem("role");
  const { showSnackbar } = useSnackbar?.() || { showSnackbar: () => {} };
  const buildUrl = () => {
    const baseEndpoint = API_ENDPOINTS.GET_FOOD_RECIPE_MANAGE;

    const params = new URLSearchParams({
      page: (page + 1).toString(),
      limit: rowsPerPage.toString(),
    });
    if (categoryID) {
      params.append("category_id", categoryID);
    }
    // if (categoryIDs) {
    //   params.append("category_id", categoryIDs);
    // }
    if (is_created_by_you) {
      params.append("is_created_by_you", is_created_by_you);
    }
    if (get_own) {
      params.append("get_own", get_own);
    }
    if (sortValue) {
      params.append("sort_by", sortValue);
    }

    if (type === "recipe") {
      params.append("type", "recipe");
    }
    if (type === "food") {
      params.append("type", "food");
    }
    if (searchValue && searchValue.trim()) {
      params.append("search", searchValue.trim());
    }
    // if (role === "trainer" || "admin") params.append("get_own", "true");
    console.log(params.toString());
    return `${baseEndpoint}?${params.toString()}`;
  };
  return useQuery({
    queryKey: [
      "getAllFoods",
      page,
      rowsPerPage,
      searchValue,
      type,
      categoryID,
      // categoryIDs,
      sortValue,
      role,
    ],
    queryFn: async () => {
      try {
        const response = await HttpClient.get(buildUrl());
        return response;
      } catch (error) {
        showSnackbar?.("Failed to load food", "error");
        throw error;
      }
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    onError: (error) => {
      console.error("Failed to fetch food list:", error.message);
    },
  });
}

export function useCreateNewServingSizeUnit() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const data = await HttpClient.post(
          API_ENDPOINTS.CREATE_NEW_SERVING_UNIT,
          payload
        );
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

    onSuccess: ({ message }) => {
      queryClient.invalidateQueries(["create-serving-size"]);
      showSnackbar(message, "success");
    },

    onError: ({ message }) => {
      // console.error("Failed to create food:", error);
      showSnackbar(message, "error");
    },
  });
}

export function useFetchReportCount({ start_date }) {
  const getUrl = () => {
    const baseEndpoint = API_ENDPOINTS.GET_REPORT_COUNT;
    if (!baseEndpoint) return null;

    const params = new URLSearchParams();
    if (start_date) {
      params.append("start_date", start_date);
    }

    return params.toString()
      ? `${baseEndpoint}?${params.toString()}`
      : baseEndpoint;
  };

  return useQuery({
    queryKey: ["getReportCount", start_date],
    queryFn: async () => {
      const url = getUrl();
      if (!url) throw new Error("Invalid endpoint");

      const response = await HttpClient.get(url);
      return response?.data;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    enabled: !!start_date, // only fetch when start_date exists
    onError: (error) => {
      console.error("Failed to fetch report count:", error.message);
    },
  });
}
