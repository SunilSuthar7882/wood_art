import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteFoodByTrainer() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const role = getLocalStorageItem("role");
  const baseUrl =
    role === "admin"
      ? API_ENDPOINTS.DELETE_FOOD_BY_ADMIN
      : role === "trainer"
      ? API_ENDPOINTS.DELETE_FOOD_BY_TRAINER
      : API_ENDPOINTS.DELETE_FOOD_BY_CUSTOMER;

  return useMutation({
    // 1) mutationFn instead of first positional arg
    mutationFn: async (foodId) => {
      try {
        const { data } = await HttpClient.delete(baseUrl, {
          params: { food_slot_id: foodId },
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

    // 2) keep your callbacks here
    onSuccess: () => {
      queryClient.invalidateQueries(["trainer"]);
      showSnackbar("Food deleted successfully!", "success");
    },
    onError: (error) => {
      console.error("Failed to delete food by trainer:", error);
      showSnackbar(`Delete failed: ${error.message}`, "error");
    },
  });
}

export function useAddNewMealSlot() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // pick endpoint based on role
  const role = getLocalStorageItem("role");
  const baseUrl =
    role === "admin"
      ? API_ENDPOINTS.ADD_MEAL_SLOT_BY_ADMIN
      : role === "trainer"
      ? API_ENDPOINTS.ADD_MEAL_SLOT_BY_TRAINER
      : API_ENDPOINTS.ADD_MEAL_SLOT_BY_CUSTOMER;

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

export function useEditMealSlot() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // pick endpoint based on role
  const role = getLocalStorageItem("role");
  const baseUrl =
    role === "admin"
      ? API_ENDPOINTS.EDIT_MEAL_SLOT_BY_ADMIN
      : role === "trainer"
      ? API_ENDPOINTS.EDIT_MEAL_SLOT_BY_TRAINER
      : API_ENDPOINTS.EDIT_MEAL_SLOT_BY_CUSTOMER;

  return useMutation({
    // 1) mutationFn with try/catch + normalized error
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.patch(baseUrl, payload);
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
      showSnackbar("Meal slot edited successfully!", "success");
    },

    // 3) onError: log and notify
    onError: (error) => {
      console.error("Failed to edit meal slot:", error);
      showSnackbar(`Add failed: ${error.message}`, "error");
    },
  });
}

export function useDeleteMealSlot() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // pick endpoint based on role
  const role = getLocalStorageItem("role");
  const baseUrl =
    role === "admin"
      ? API_ENDPOINTS.DELETE_MEAL_SLOT_BY_ADMIN
      : role === "trainer"
      ? API_ENDPOINTS.DELETE_MEAL_SLOT_BY_TRAINER
      : API_ENDPOINTS.DELETE_MEAL_SLOT_BY_CUSTOMER;

  return useMutation({
    mutationFn: async (slotId) => {
      try {
        const url = `${baseUrl}?slot_id=${slotId}`;
        const response = await HttpClient.delete(url);
        return response.data;
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
      // re-fetch the meal-slot queries (adjust key as needed)
      queryClient.invalidateQueries(["editMealSlot"]);
      showSnackbar("Meal slot deleted successfully!", "success");
    },

    onError: (error) => {
      console.error("Failed to delete meal slot:", error);
      showSnackbar(`Delete failed: ${error.message}`, "error");
    },
  });
}

export function useMealPlanComplete() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const role = getLocalStorageItem("role");
  const baseUrl =
    role === "admin"
      ? API_ENDPOINTS.MEAL_PLAN_SAVE_BY_ADMIN
      : role === "trainer"
      ? API_ENDPOINTS.SAVE_MEAL_PLAN_BY_TRAINER
      : API_ENDPOINTS.SAVE_MEAL_PLAN_BY_CUSTOMER;

  return useMutation({
    mutationFn: async (payload) => {
      const data = await HttpClient.post(baseUrl, null, payload);
      return data;
    },

    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries(["mealSlotComplete"]);
        showSnackbar(
          data.message || "Meal plan saved successfully!",
          "success"
        );
      } else {
        showSnackbar(data.message || "Something went wrong", "error");
      }
    },
  });
}

export function useDeletetempSlot() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const baseUrl = API_ENDPOINTS.DELETE_TEMPLATE_SLOT;

  if (!baseUrl) {
    throw new Error("No delete-meal-slot endpoint found for current role");
  }

  return useMutation({
    mutationFn: async (slotId) => {
      try {
        const url = `${baseUrl}?slot_id=${slotId}`;
        const response = await HttpClient.delete(url);
        return response.data;
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
      // re-fetch the meal-slot queries (adjust key as needed)
      queryClient.invalidateQueries(["editMealSlot"]);
      showSnackbar("Meal slot deleted successfully!", "success");
    },

    onError: (error) => {
      console.error("Failed to delete meal slot:", error);
      showSnackbar(`Delete failed: ${error.message}`, "error");
    },
  });
}

export function useEditTempSlot() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // pick endpoint based on role
  const role = getLocalStorageItem("role");
  const baseUrl = API_ENDPOINTS.EDIT_TEMP_SLOT;

  return useMutation({
    // 1) mutationFn with try/catch + normalized error
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.patch(baseUrl, payload);
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
      showSnackbar("Meal slot edited successfully!", "success");
    },

    // 3) onError: log and notify
    onError: (error) => {
      console.error("Failed to edit meal slot:", error);
      showSnackbar(`Add failed: ${error.message}`, "error");
    },
  });
}

export function useTempPlanComplete() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // pick endpoint based on role
  const role = getLocalStorageItem("role");
  const baseUrl = API_ENDPOINTS.SAVE_TEMPLATE_PLAN;

  return useMutation({
    // 1) mutationFn with try/catch + normalized error
    mutationFn: async (payload) => {
      try {
        const res = await HttpClient.post(baseUrl, null, payload);
        return res;
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
    onSuccess: (data) => {
      if (data?.success) {
        showSnackbar(data.message || "Template completed successfully.");
      } else {
        showSnackbar(data?.message || "Something went wrong.");
      }
      queryClient.invalidateQueries(["addFood"]);
    },
    onError: (error) => {
      console.error(`Failed to complete template: ${error.message}`);
      showSnackbar(`${error.message}`, "error");
    },
  });
}


// export function useAddFavMealInPlan() {
//   const queryClient = useQueryClient();
//   const { showSnackbar } = useSnackbar();

//   const baseUrl = API_ENDPOINTS.ADD_FAV_MEAL_PLAN; // Use the unified endpoint here

//   return useMutation({
//     mutationFn: async (payload) => {
//       try {
//         const { data } = await HttpClient.post(baseUrl, payload);
//         return data;
//       } catch (err) {
//         const message =
//           err.response?.data?.message ||
//           err.response?.statusText ||
//           err.message ||
//           "An unknown error occurred";
//         throw new Error(message);
//       }
//     },

//     onSuccess: () => {
//       queryClient.invalidateQueries(["addMealSlot"]);
//       showSnackbar("Meal slot added successfully!", "success");
//     },

//     onError: (error) => {
//       console.error("Failed to add meal slot:", error);
//       showSnackbar(`Add failed: ${error.message}`, "error");
//     },
//   });
// }




export function useAddFavMealInPlan() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const baseUrl = API_ENDPOINTS.ADD_FAV_MEAL_PLAN;

  return useMutation({
    mutationFn: async ({ favoriteMealId, mealPlanDayId }) => {
      try {
        const params = new URLSearchParams({
          favorite_meal_id: Number(favoriteMealId),
          meal_plan_day_id: mealPlanDayId,
        });

        const  data  = await HttpClient.post(`${baseUrl}?${params.toString()}`);
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

    onSuccess: ({message}) => {
      queryClient.invalidateQueries(["addFavMEalinPlan"]);
      showSnackbar(message, "success");
    },

    onError: ({message}) => {
      console.error("Failed to add favorite meal:", error);
      showSnackbar(message, "error");
    },
  });
}



export function useAddFavMealInTemplatePlan() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const baseUrl = API_ENDPOINTS.ADD_FAV_MEAL_TEMPLATE_PLAN;

  return useMutation({
    mutationFn: async ({ favoriteMealId, mealPlanDayId }) => {
      try {
        const params = new URLSearchParams({
          favorite_meal_id: Number(favoriteMealId),
          template_day_id: mealPlanDayId,
        });

        const  data  = await HttpClient.post(`${baseUrl}?${params.toString()}`);
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

    onSuccess: ({message}) => {
      queryClient.invalidateQueries(["addFavMEalinPlan"]);
      showSnackbar(message, "success");
    },

    onError: ({message}) => {
      console.error("Failed to add favorite meal:", error);
      showSnackbar(message, "error");
    },
  });
}





// export function useAddFavMealInPlan({ planId, router }) {
//   const queryClient = useQueryClient();
//   const { showSnackbar } = useSnackbar();

//   const baseUrl = API_ENDPOINTS.ADD_FAV_MEAL_PLAN;

//   return useMutation({
//     mutationFn: async ({ favoriteMealId, mealPlanDayId }) => {
//       const params = new URLSearchParams({
//         favorite_meal_id: Number(favoriteMealId),
//         meal_plan_day_id: mealPlanDayId,
//       });
//       const data = await HttpClient.post(`${baseUrl}?${params.toString()}`);
//       return data;
//     },

//     onSuccess: ({ message }) => {
//       queryClient.invalidateQueries(["addFavMEalinPlan"]);
//       showSnackbar(message, "success");

//       if (planId) {
//         router.push(`/diet-plan/edit-diet-plan/${planId}`);
//       }
//     },

//     onError: ({ message }) => {
//       console.error("Failed to add favorite meal:", message);
//       showSnackbar(message, "error");
//     },
//   });
// }



export function useSwapFood() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const baseUrl = API_ENDPOINTS.SWAP_FOOD; // define your endpoint

  return useMutation({
    mutationFn: async ({ food_slot_id, new_food_id, applied_to }) => {
      try {
        const payload = {
          food_slot_id,
          new_food_id,
          applied_to,
        };

        const  data  = await HttpClient.patch(baseUrl, payload);
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
      queryClient.invalidateQueries(["mealPlan"]); // adjust your query key
      showSnackbar(message, "success");
    },

    onError: (error) => {
      console.error("Failed to swap food:", error);
      showSnackbar(error.message, "error");
    },
  });
}
