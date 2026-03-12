
import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useQuery } from "@tanstack/react-query";

export function useGetChat(user_id,loadMoreChat) {
  return useQuery({
    queryKey: ["getchat",user_id,loadMoreChat],
    queryFn: async () =>
      HttpClient.get(
     `${API_ENDPOINTS.GET_CHAT}?user_id=${user_id}&page=${loadMoreChat}`
      ),
      enabled: !!user_id,
    onSuccess:(data)=>{
        return data;
    },
   
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
  });
}
