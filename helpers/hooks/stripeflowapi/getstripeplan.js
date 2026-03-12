import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import { useQuery } from "@tanstack/react-query";

export function useGetStripePlan() {
  return useQuery({
    queryKey: ["getstripeplan"],
    queryFn: async () => HttpClient.get(API_ENDPOINTS.GET_STRIPE_PLAN),

    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
  });
}

export const useFetchStripeInvoices = ({ pageSize }) => {
  const role = getLocalStorageItem("role");

  const queryKey = ["fetchStripeInvoices", role];

  const baseUrl = API_ENDPOINTS.GET_STRIPE_PLAN_INVOICES;

  const queryFn = () => {
    if (!baseUrl) {
      return Promise.reject(new Error("Invalid role or baseUrl"));
    }

    const params = new URLSearchParams({
      limit: pageSize.toString(),
    });

    return HttpClient.get(`${baseUrl}?${params.toString()}`);
  };

  return useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error("Failed to fetch stripe invoices list:", error.message);
    },
  });
};

export const useFetchStripeUpcomingInvoice = () => {
  const role = getLocalStorageItem("role");

  const queryKey = ["fetchStripeUpcomingInvoice", role];

  const baseUrl = API_ENDPOINTS.GET_STRIPE_PLAN_UPCOMING_INVOICES;

  const queryFn = () => {
    if (!baseUrl) {
      return Promise.reject(new Error("Invalid role or baseUrl"));
    }

    return HttpClient.get(baseUrl);
  };

  return useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error(
        "Failed to fetch stripe upcoming invoices list:",
        error.message
      );
    },
  });
};
