import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useExportTrainerPerformance() {
  const queryClient = useQueryClient(); 
    return useMutation({
    mutationFn: async ({ start_date }) => {
      return HttpClient.post(
        `${API_ENDPOINTS.REPORT_EXPORT_TRAINER_PERFORMANCE}?start_date=${start_date}`
      );
    },
    onSuccess: () => {
     
    },
    onError: (error) => {
      console.error("Failed to update item:", error.message);
    },
  });
}
export function useExportTrainer() {
  const queryClient = useQueryClient(); 
    return useMutation({
    mutationFn: async ({ start_date }) => {
      return HttpClient.post(
        `${API_ENDPOINTS.REPORT_EXPORT_TRAINERS}?start_date=${start_date}`
      );
    },
    onSuccess: () => {
     
    },
    onError: (error) => {
      console.error("Failed to update item:", error.message);
    },
  });
}
export function useExportCustomers() {
  const queryClient = useQueryClient(); 
    return useMutation({
    mutationFn: async ({ start_date }) => {
      return HttpClient.post(
        `${API_ENDPOINTS.REPORT_EXPORT_CUSTOMERS}?start_date=${start_date}`
      );
    },
    onSuccess: () => {
     
    },
    onError: (error) => {
      console.error("Failed to update item:", error.message);
    },
  });
}
export function useExportMealPlans() {
  const queryClient = useQueryClient(); 
    return useMutation({
    mutationFn: async ({ start_date }) => {
      return HttpClient.post(
        `${API_ENDPOINTS.REPORT_EXPORT_MEAL_PLANS}?start_date=${start_date}`
      );
    },
    onSuccess: () => {
     
    },
    onError: (error) => {
      console.error("Failed to update item:", error.message);
    },
  });
}


export function useExportpaymentRole() {
  const queryClient = useQueryClient(); 
    return useMutation({
    mutationFn: async ({ start_date,role }) => {
      return HttpClient.post(
        `${API_ENDPOINTS.REPORT_EXPORT_USER_PAYMENTS}?start_date=${start_date}&role=${role}`
      );
    },
    onSuccess: () => {
     
    },
    onError: (error) => {
      console.error("Failed to update item:", error.message);
    },
  });
}