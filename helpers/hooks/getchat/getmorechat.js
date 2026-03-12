import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useGetMoreChat(user_id,loadMoreChat) {
  return useQuery({
    queryKey: ["getmorechat",user_id,loadMoreChat],
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
