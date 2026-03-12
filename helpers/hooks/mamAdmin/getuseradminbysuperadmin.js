// import { API_ENDPOINTS } from "@/helpers/api-endpoints";
// import { HttpClient } from "@/helpers/clients/http-client";
// import { useQuery } from "@tanstack/react-query";

// export function useGetuseradminbysuperadmin(admin_id) {
//   return useQuery({
//     queryKey: ["Getuseradminbysuperadmin"],
//     queryFn: async () =>
//       HttpClient.get(
       
//       `${API_ENDPOINTS.USER_GET_ADMIN_BY_SUPERADMIN}?admin_id=${admin_id}`
         
//       ),
//     onError: (error) => {
//       console.error("Failed to fetch Mam Admins list :", error.message);
//     },
//   });
// }


import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useQuery } from "@tanstack/react-query";

export function useGetuseradminbysuperadmin(admin_id, options = {}) {
  return useQuery({
    queryKey: ["Getuseradminbysuperadmin", admin_id],
    queryFn: async () =>
      HttpClient.get(
        `${API_ENDPOINTS.USER_GET_ADMIN_BY_SUPERADMIN}?admin_id=${admin_id}`
      ),
    enabled: !!admin_id, // default safeguard
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
    ...options, // allow caller to override (e.g. enabled, staleTime, etc.)
  });
}
