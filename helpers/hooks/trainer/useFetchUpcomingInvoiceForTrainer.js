import {useQuery} from '@tanstack/react-query';

import { API_ENDPOINTS } from '@/helpers/api-endpoints';
import { HttpClient } from '@/helpers/clients/http-client';
import { useSnackbar } from '@/app/contexts/SnackbarContext';


const useFetchUpcomingInvoiceForTrainer = (options = {}) => {
     const { showSnackbar } = useSnackbar();
    const fetchUpcomingInvoice = async () =>{
        const endpoint = API_ENDPOINTS.GET_STRIPE_PLAN_UPCOMING_INVOICES;
        try {
            const response = await HttpClient.get(endpoint);
              if (response?.data?.success === false) {
        const msg = response?.data?.message || "Something went wrong.";
        showSnackbar(msg, "error");
        throw new Error(msg);
      }
            return response?.data;
        } catch (err) {
            const errorMsg =
        err?.response?.data?.message || err?.message || "Something went wrong.";
      showSnackbar(errorMsg, "error");
      throw new Error(errorMsg);
            // console.error("Failed to fetch stripe plan list:", err.message);
            // throw new Error(err.message);
        }
    }

  const {data, isError, isLoading} = useQuery({
    queryKey: ['Invoice'],
    queryFn: fetchUpcomingInvoice,
    retry: false,
    enabled: options.enabled ?? true,
  });

  const invoice = data &&  Object?.keys(data).length === 0 ? [] : data;

  return {
    data: invoice,
    isError,
    isLoading,
  };
};

export default useFetchUpcomingInvoiceForTrainer;
