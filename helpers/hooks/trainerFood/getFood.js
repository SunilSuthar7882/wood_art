import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../api-endpoints";
import { HttpClient } from "../../clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useSnackbar } from "@/app/contexts/SnackbarContext";

export function useGettrainerFood(
  page,
  rowsPerPage,
  searchValue,
  type,
  get_own,
  categoryID,
  sortValue
) {
  const role = getLocalStorageItem("role");
  const { showSnackbar } = useSnackbar?.() || { showSnackbar: () => {} };

  // ✅ Build dynamic URL
  const buildUrl = () => {
    const baseEndpoint = API_ENDPOINTS.GET_FOOD;

    const params = new URLSearchParams({
      page: (page + 1).toString(),
      limit: rowsPerPage.toString(),
    });

    if (categoryID) params.append("category_id", categoryID);
    if (sortValue) params.append("sort_by", sortValue);
    if (get_own) params.append("get_own", get_own);
    if (type === "recipe") params.append("type", "recipe");
    if (type === "food") params.append("type", "food");
    if (searchValue && searchValue.trim())
      params.append("search", searchValue.trim());

    // Role-based condition (uncomment if needed)
    // if (role === "trainer" || role === "admin") params.append("get_own", "true");

    return `${baseEndpoint}?${params.toString()}`;
  };

  return useQuery({
    queryKey: [
      "gettrainerFoods",
      page,
      rowsPerPage,
      searchValue,
      type,
      get_own,
      categoryID,
      sortValue,
      role,
    ],
    queryFn: async () => {
      try {
        const response = await HttpClient.get(buildUrl());
        return response;
      } catch (error) {
        showSnackbar("Failed to load food", "error");
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
