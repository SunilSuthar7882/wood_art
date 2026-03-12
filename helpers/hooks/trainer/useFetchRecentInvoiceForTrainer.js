import { useQuery } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";

const useFetchRecentInvoiceForTrainer = () => {
  const fetchUpcomingInvoice = async () => {
    const endpoint = API_ENDPOINTS.GET_STRIPE_PLAN_INVOICES + "?limit=100";

    try {
      const response = await HttpClient.get(endpoint);
      
      return response?.data;
    } catch (err) {
      console.error("Failed to fetch stripe plan list:", err.message);
      throw new Error(err.message);
    }
  };

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["RecentInvoice"],
    queryFn: fetchUpcomingInvoice,
    retry: false,
  });

  const invoice = data && Object?.keys(data).length === 0 ? [] : data;

   
  return {
    data: invoice,
    isError,
    isLoading,
    refetch,
  };
};

export default useFetchRecentInvoiceForTrainer;
