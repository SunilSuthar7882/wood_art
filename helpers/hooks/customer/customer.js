import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetCustomerByTrainer(page, rowsPerPage, searchValue, role) {
  return useQuery({
    queryKey: ["customer", page, rowsPerPage, searchValue],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page + 1),
        limit: String(rowsPerPage),
      });

      if (searchValue) {
        params.append("search", searchValue);
      }

      return HttpClient.get(
        `${API_ENDPOINTS.GET_CUSTOMER_BY_TRAINER}?${params.toString()}`
      );
    },
    enabled: role === "trainer",
    onError: (error) => {
      console.error("Failed to fetch customer list:", error.message);
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 3,
  });
}

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
      showSnackbar("Meal slot deleted successfully!", "success");
    },
    onError: (error) => {
      console.error("Failed to delete food by trainer:", error);
      showSnackbar(`Delete failed: ${error.message}`, "error");
    },
  });
}

import { useSnackbar } from "@/app/contexts/SnackbarContext";

export function useDeleteCustomerByTrainer() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const role = getLocalStorageItem("role");

  const baseUrl =
    role === "trainer" ? API_ENDPOINTS.DELETE_CUSTOMER_BY_TRAINER : null;

  return useMutation({
    mutationFn: async (customer_id) => {
      return HttpClient.delete(`${baseUrl}?customer_id=${customer_id}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["deletecustomerbytrainer"]);

      showSnackbar(
        "Customer delete request sent successfully to the admin. Once the admin approves the request, the customer will be deleted permanently.",
        "success",
        {
          autoHideDuration: null,
        }
      );
    },

    onError: () => {
      showSnackbar("Failed to send delete request.", "error");
    },
  });
}

export function useDeleteFoodInRecipe() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const role = getLocalStorageItem("role");
  // const baseUrl =
  //   role === "admin"
  //     ? API_ENDPOINTS.DELETE_FOOD_IN_RECIPE
  //     : role === "trainer"
  //     ? API_ENDPOINTS.DELETE_FOOD_IN_RECIPE
  //     : API_ENDPOINTS.DELETE_FOOD_IN_RECIPE;

  return useMutation({
    // 1) mutationFn instead of first positional arg
    mutationFn: async (foodId) => {
      try {
        const { data } = await HttpClient.delete(
          API_ENDPOINTS.DELETE_FOOD_IN_RECIPE,
          {
            params: { ingredient_id: foodId },
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

    // 2) keep your callbacks here
    onSuccess: () => {
      queryClient.invalidateQueries(["trainer"]);
      showSnackbar("Food deleted successfully!", "success");
    },
    onError: (error) => {
      console.error("Failed to delete food:", error);
      showSnackbar(`Delete failed: ${error.message}`, "error");
    },
  });
}
