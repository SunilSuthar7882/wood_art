import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getLocalStorageItem } from "@/helpers/localStorage";


export function useDeleteTrainer() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
   const role = getLocalStorageItem("role");
    const baseUrl =
      role === "super_admin"
        ? `${API_ENDPOINTS.USER_DELETE_TRAINER}`
        : role === "admin"
        ? `${API_ENDPOINTS.USER_DELETE_TRAINER_BY_ADMIN}`
        : null;

  return useMutation({
    mutationFn: async (trainer_id) => {
      const res = await HttpClient.delete(baseUrl, {
        params: { trainer_id: trainer_id },
      });
      return res;
    },
    onSuccess: (res) => {
      showSnackbar(res.message, "success");
      queryClient.invalidateQueries(["Getusertrainerbysuperadmin"]);
    },
    onError: (err) => {
      const message = err.response?.data?.message || err.message;
      showSnackbar(message, "error");
    },
  });
}
