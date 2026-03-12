import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { Routes } from "@/config/routes";
import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { getLocalStorageItem } from "@/helpers/localStorage";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useGetMamAdmins(page, rowsPerPage, activeStatus, searchValue) {
  //pageSize
  const role = getLocalStorageItem("role");

  const buildUrl = () => {
    const baseEndpoint = API_ENDPOINTS.GET_MAM_ADMIN;
    const params = new URLSearchParams({
      page: (page + 1).toString(),
      limit: rowsPerPage.toString(), //pageSize
    });

    if (activeStatus && activeStatus !== "all") {
      params.append("status", activeStatus);
    }

    if (searchValue) {
      params.append("search", searchValue);
    }

    return `${baseEndpoint}?${params.toString()}`;
  };

  return useQuery({
    queryKey: ["mamAdmins", page, activeStatus, searchValue, role],
    queryFn: () => HttpClient.get(buildUrl()),
    onError: (error) => {
      console.error("Failed to fetch admin list:", error.message);
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    keepPreviousData: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useGetMamAdminsInfinite() {
  return useInfiniteQuery({
    queryKey: ["mamAdmins-infinite"],
    queryFn: async ({ pageParam = 1 }) =>
      HttpClient.get(
        `${API_ENDPOINTS.GET_MAM_ADMIN}?page=${pageParam}&limit=15&status=active`
      ),
    getNextPageParam: (lastPage) => {
      const pageInfo = lastPage.data.page_information;
      return pageInfo.current_page < pageInfo.last_page
        ? pageInfo.current_page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
}

export function useGetUserProfile() {
  return useQuery({
    queryKey: ["getProfile"],
    queryFn: async () => HttpClient.get(`${API_ENDPOINTS.GET_PROFILE}`),
    onError: (error) => {
      console.error("Failed to fetch Users list :", error.message);
    },
  });
}

export function useAdminTransferToAdmin(options = {}) {
  const role = getLocalStorageItem("role");
  const baseUrl =
    role === "super_admin" ? API_ENDPOINTS.TRANSFER_ADMIN_TO_ADMIN : null;

  const mutationFn = ({ fromAdmin, toAdmin }) => {
    if (!baseUrl) {
      return Promise.reject(new Error("Invalid role or baseUrl"));
    }

    const params = new URLSearchParams({
      from_admin_id: String(fromAdmin),
      to_admin_id: String(toAdmin),
    });

    return HttpClient.post(`${baseUrl}?${params.toString()}`);
  };

  return useMutation({
    mutationFn,
    // Merge default logging with user-provided callbacks
    onSuccess: (data, variables, context) => {
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error, variables, context) => {
      console.error("Failed to transfer admin to admin data:", error.message);
      if (options.onError) {
        options.onError(error);
      }
    },
  });
}

export function useGetCustomerRemoveRequest(page, rowsPerPage, activeStatus) {
  //pageSize
  const role = getLocalStorageItem("role");

  const buildUrl = () => {
    const baseEndpoint = API_ENDPOINTS.GET_DELETE_CUSTOMER_REQUESTS_BY_ADMIN;
    const params = new URLSearchParams({
      page: (page + 1).toString(),
      limit: rowsPerPage.toString(), //pageSize
    });
    if (activeStatus) {
      params.append("status", activeStatus);
    }
    return `${baseEndpoint}?${params.toString()}`;
  };

  return useQuery({
    queryKey: ["customerDeleteRequests", page, activeStatus, role],
    queryFn: () => HttpClient.get(buildUrl()),
    onError: (error) => {
      console.error(
        "Failed to fetch delete customer request list:",
        error.message
      );
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    keepPreviousData: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useUpdateDeleteCustomerStatus() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  // pick endpoint based on role
  const role = getLocalStorageItem("role");
  const baseUrl =
    role === "admin"
      ? API_ENDPOINTS.UPDATE_DELETE_CUSTOMER_REQUEST_BY_ADMIN
      : null;

  return useMutation({
    // 1) mutationFn with try/catch + normalized error
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.patch(baseUrl, null, {
          params: payload,
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

    // 2) onSuccess: invalidate and notify
    onSuccess: (data) => {
      queryClient.invalidateQueries(["editMealSlot"]);
      showSnackbar(data?.message || "Status updated successfully!", "success");
    },

    // 3) onError: log and notify
    onError: (error) => {
      showSnackbar(
        error?.response?.data?.message || "Failed to update status!",
        "error"
      );
    },
  });
}

export function useGetStripeCoupons(coupon_for) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["GetStripeCoupons", coupon_for],
    enabled: Boolean(coupon_for),
    queryFn: async () => {
      const url = `${API_ENDPOINTS.GET_STRIPE_COUPONS}?coupon_for=${coupon_for}`;
      return HttpClient.get(url);
    },
    onSuccess: (data) => {
      // If you need to invalidate or update another query:
      // queryClient.invalidateQueries(["SomeOtherQueryKey"]);
      return data;
    },
    onError: (error) => {
      console.error("Failed to fetch Stripe coupons:", error.message);
    },
    gcTime: 0,
  });
}

export function useDeleteStripeCoupon() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (couponId) => {
      try {
        const { data } = await HttpClient.delete(
          API_ENDPOINTS.DELETE_STRIPE_COUPON,
          {
            params: { coupon_id: couponId },
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
    onSuccess: () => {
      queryClient.invalidateQueries(["stripe-coupons"]);
      showSnackbar("Coupon deleted successfully!", "success");
    },
    onError: (error) => {
      console.error("Failed to delete coupon:", error);
      showSnackbar(`Delete failed: ${error.message}`, "error");
    },
  });
}

export function useAddStripeCoupon() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.post(
          API_ENDPOINTS.ADD_STRIPE_COUPON,
          payload
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

    onSuccess: () => {
      queryClient.invalidateQueries(["stripe-coupons"]);
      showSnackbar("Coupon created successfully!", "success");
    },

    onError: (error) => {
      console.error("Failed to add coupon:", error);
      showSnackbar(`Creation failed: ${error.message}`, "error");
    },
  });
}

export function useAddStripePromo() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.post(
          API_ENDPOINTS.ADD_STRIPE_PROMO,
          payload
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

    onSuccess: () => {
      queryClient.invalidateQueries(["stripe-coupons"]);
      showSnackbar("Coupon created successfully!", "success");
    },

    onError: (error) => {
      console.error("Failed to add coupon:", error);
      showSnackbar(`Creation failed: ${error.message}`, "error");
    },
  });
}

export function useDeleteAdminBySuperAdmin() {
  const queryClient = useQueryClient();
  const role = getLocalStorageItem("role");

  const baseUrl =
    role === "super_admin" ? API_ENDPOINTS.DELETE_ADMIN_BY_SUPERADMIN : null;

  return useMutation({
    mutationFn: async (admin_id) => {
      if (!baseUrl) {
        throw new Error("Unauthorized: Only super_admin can delete an admin.");
      }
      return HttpClient.delete(`${baseUrl}?admin_id=${admin_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin"]);
    },
    onError: (error) => {
      console.error("Failed to delete admin by super admin:", error.message);
    },
  });
}

export function useGetTrainerPerformanceData(page, limit) {
  return useQuery({
    queryKey: ["GetTrainerPerformanceData"],
    queryFn: async () =>
      HttpClient.get(
        `${API_ENDPOINTS.GET_TRAINER_PERFORMANCE}?page=${page}&limit=${limit}`
      ),
    onError: (error) => {
      console.error("Failed to fetch Mam Admins list :", error.message);
    },
    // keepPreviousData: true,
    // refetchOnWindowFocus: false,
  });
}

export function useRegisterCustomer() {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  return useMutation({
    mutationFn: async (formdata) => {
      try {
        const { data } = await HttpClient.post(
          API_ENDPOINTS.REGISTER_CUSTOMER,
          formdata,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
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

    onSuccess: (data) => {
      showSnackbar(
        data?.message || "Customer registered successfully!",
        "success"
      );
      // router.back();
    },

    onError: (error) => {
      console.error("Registration failed:", error);
      showSnackbar(`Registration failed: ${error.message}`, "error");
    },
  });
}

export function useSendVerification() {
  const { showSnackbar } = useSnackbar();
  // const router = useRouter();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await HttpClient.post(
        API_ENDPOINTS.SEND_VERIFICATION_CODE,
        payload
      );
      return response.data;
    },

    onSuccess: (data) => {
      showSnackbar(
        data?.message || "Verification code sent successfully!",
        "success"
      );
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.response?.statusText ||
        error?.message ||
        "An unknown error occurred";

      console.error("Code not sent:", error);
      showSnackbar(`Code not sent: ${message}`, "error");
    },
  });
}

export function useVerifyCode() {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.post(
          API_ENDPOINTS.VERIFY_EMAIL,
          payload
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

    onSuccess: (data) => {
      showSnackbar(data?.message || "Email Verified Successfully!", "success");
      // router.back();
    },

    onError: (error) => {
      console.error("Email Not Verified:", error);
      showSnackbar(`Email Not Verified: ${error.message}`, "error");
    },
  });
}

export function useGetSignUpRequest(role) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["GetStripeCoupons", role],
    enabled: Boolean(role),
    queryFn: async () => {
      const url = `${API_ENDPOINTS.GET_SIGNUP_REQUEST}?role=${role}`;
      return HttpClient.get(url);
    },
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("Failed to fetch Stripe coupons:", error.message);
    },
    gcTime: 0,
  });
}

export function useGetSignUpRequestById(request_id) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["GetSignUpRequestById", request_id],
    enabled: Boolean(request_id),
    queryFn: async () => {
      const url = `${API_ENDPOINTS.GET_SIGNUP_REQUEST_BY_ID}?request_id=${request_id}`;
      return HttpClient.get(url);
    },
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("Failed to fetch signup request:", error.message);
    },
    gcTime: 0,
  });
}

export function useUpdateSignupStatus() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.patch(
          API_ENDPOINTS.UPDATE_REQUEST,
          payload
        );
        return data;
      } catch (err) {
        throw err; // preserve original error for onError
      }
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries(["updateRequest"]);
      showSnackbar(data?.message || "Admin Assigned successfully!", "success");
    },

    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Trainer cannot accept more customers. Ask them to upgrade their plan.";

      showSnackbar(errorMessage, "error");
    },
  });
}

export function useGetCustoemrStripePlan() {
  return useQuery({
    queryKey: ["GetcustomerStripePlans"],
    queryFn: async () => {
      const url = `${API_ENDPOINTS.GET_STRIPE_PLAN_CUSTOMER_PLANS}`;
      return HttpClient.get(url);
    },
    onSuccess: (data) => {},
    onError: (error) => {
      console.error("Failed to fetch Stripe Plan:", error.message);
    },
  });
}
export function useGetTrainerStripePlan() {
  return useQuery({
    queryKey: ["GetStripePlans"],
    queryFn: async () => {
      const url = `${API_ENDPOINTS.GET_TRAINER_STRIPE_PLANS}`;
      return HttpClient.get(url);
    },
    onSuccess: (data) => {},
    onError: (error) => {
      console.error("Failed to fetch Stripe Plan:", error.message);
    },
  });
}

export function useRegisterTrainer() {
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (formdata) => {
      try {
        const payload = {
          full_name: formdata.full_name,
          email: formdata.email,
          password: formdata.password,
          confirm_password: formdata.confirm_password,
          phone_number: formdata.phone_number,
          address: {
            line1: formdata.address?.line1 || "",
            line2: formdata.address?.line2 || "",
            city: formdata.address?.city || "",
            state: formdata.address?.state || "",
            country: formdata.address?.country || "",
            postal_code: formdata.address?.postal_code || "",
          },
          ...(formdata.price_id ? { price_id: formdata.price_id } : {}),
          ...(formdata.referral_code
            ? { referral_code: formdata.referral_code }
            : {}),
          ...(formdata.coupon_code
            ? { coupon_code: formdata.coupon_code }
            : {}),
        };

        const { data } = await HttpClient.post(
          API_ENDPOINTS.REGISTER_TRAINER,
          payload
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

    onSuccess: (data) => {
      showSnackbar(
        data?.message || "Trainer registered successfully!",
        "success"
      );
    },

    onError: (error) => {
      console.error("Registration failed:", error);
      showSnackbar(`Registration failed: ${error.message}`, "error");
    },
  });
}

export function usePurchaseStripePlanByTrainerRegister() {
  const role = getLocalStorageItem("role");

  const baseUrl = role === "trainer" ? API_ENDPOINTS.REGISTER_TRAINER : null;

  const mutationFn = ({ priceId, couponCode }) => {
    if (!baseUrl) {
      return Promise.reject(new Error("Invalid role or baseUrl"));
    }

    const params = new URLSearchParams({
      price_id: String(priceId),
      coupon_code: String(couponCode),
    });

    return HttpClient.post(`${baseUrl}?${params.toString()}`);
  };

  return useMutation({
    mutationFn,
    onError: (error) => {
      console.error("Failed to purchase trainer stripe plan:", error.message);
    },
  });
}

export function useDeleteFoodItem() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (foodId) => {
      const res = await HttpClient.delete(API_ENDPOINTS.DELETE_FOOD_ITEM, {
        params: { food_id: foodId },
      });
      return res;
    },
    onSuccess: (res) => {
      showSnackbar(res.message, "success");
      queryClient.invalidateQueries(["favorite-foods"]);
      queryClient.invalidateQueries(["all-foods"]);
    },
    onError: (err) => {
      const message = err.response?.data?.message || err.message;
      showSnackbar(message, "error");
    },
  });
}

export function useEditTrainerProfile() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (input) => {
      try {
        const { data } = await HttpClient.patch(
          API_ENDPOINTS.UPDATE_PROFILE,
          input
        );
        return data;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.statusText ||
          err?.message ||
          "An unknown error occurred";
        throw new Error(message);
      }
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries(["getprofile"]);
      showSnackbar(data?.message || "Profile updated successfully!", "success");
    },

    onError: (error) => {
      showSnackbar(error?.message || "Failed to update profile!", "error");
    },
  });
}

export function useEditAdminProfile() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (input) => {
      try {
        const { data } = await HttpClient.patch(
          API_ENDPOINTS.UPDATE_PROFILE,
          input
        );
        return data;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.statusText ||
          err?.message ||
          "An unknown error occurred";
        throw new Error(message);
      }
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries(["getprofile"]);
      showSnackbar(data?.message || "Profile updated successfully!", "success");
    },

    onError: (error) => {
      showSnackbar(error?.message || "Failed to update profile!", "error");
    },
  });
}

export function useEditSuperAdminProfile() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (input) => {
      try {
        const { data } = await HttpClient.patch(
          API_ENDPOINTS.UPDATE_PROFILE,
          input
        );
        return data;
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.response?.statusText ||
          err?.message ||
          "An unknown error occurred";
        throw new Error(message);
      }
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries(["getprofile"]);
      showSnackbar(data?.message || "Profile updated successfully!", "success");
    },

    onError: (error) => {
      showSnackbar(error?.message || "Failed to update profile!", "error");
    },
  });
}

export function useDisassociateCustomer() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const { data } = await HttpClient.patch(
          `${API_ENDPOINTS.DISASSOCIATE_CUSTOMER}`,
          null,
          {
            params: payload,
          }
        );
        return data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.response?.statusText ||
          err.message ||
          "An unknown error occurred while disassociating customer";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]);
    },
    onError: (error) => {
      console.error("Failed to disassociate customer:", error);
      showSnackbar(`Disassociation failed: ${error.message}`, "error");
    },
  });
}

export function useDeleteMealPlan() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const role = getLocalStorageItem("role");
  const baseUrl =
    role === "admin"
      ? API_ENDPOINTS.DELETE_MEAL_PLAN
      : role === "trainer"
      ? API_ENDPOINTS.DELETE_MEAL_PLAN_BY_TRAINER
      : API_ENDPOINTS.DELETE_MEAL_PLAN_BY_CUSTOMER;
  return useMutation({
    mutationFn: async (planId) => {
      try {
        const { data } = await HttpClient.delete(baseUrl, {
          params: { plan_id: planId },
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
    onSuccess: () => {
      queryClient.invalidateQueries(["meal-plans"]);
      showSnackbar("Meal plan deleted successfully!", "success");
    },
    onError: (error) => {
      console.error("Failed to delete meal plan:", error);
      showSnackbar(`Delete failed: ${error.message}`, "error");
    },
  });
}

export function useDeleteTempPlan() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (planId) => {
      try {
        const { data } = await HttpClient.delete(
          API_ENDPOINTS.TEMPLATE_DELETE,
          {
            params: { template_id: planId },
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
    onSuccess: () => {
      queryClient.invalidateQueries(["meal-plans"]);
      showSnackbar("Meal plan deleted successfully!", "success");
    },
    onError: (error) => {
      console.error("Failed to delete meal plan:", error);
      showSnackbar(`Delete failed: ${error.message}`, "error");
    },
  });
}

export function useRemoveFood() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const role = getLocalStorageItem("role");
  const baseUrl = API_ENDPOINTS.REMOVE_FOOD;

  return useMutation({
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

    onSuccess: () => {
      queryClient.invalidateQueries(["trainer"]);
      showSnackbar("Food Removed successfully!", "success");
    },
    onError: (error) => {
      console.error("Failed to delete food by trainer:", error);
      showSnackbar(`Delete failed: ${error.message}`, "error");
    },
  });
}

export function useSaveTemplate() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const role = getLocalStorageItem("role");

  const baseUrl =
    role === "admin"
      ? API_ENDPOINTS.SAVE_TEMP_BY_ADMIN
      : role === "trainer"
      ? API_ENDPOINTS.SAVE_TEMP_BY_TRAINER
      : API_ENDPOINTS.SAVE_TEMP_BY_CUSTOMER;

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const data = await HttpClient.post(baseUrl, payload);
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

    onSuccess: (data) => {
      if (data?.success === true) {
        queryClient.invalidateQueries(["mealPlanComplete"]);
        showSnackbar(
          data.message || "Meal plan saved successfully!",
          "success"
        );

        // if (role === "customer") {
        //   router.push(Routes.dietPlan);
        // } else if (role === "trainer") {
        //   router.push(Routes.mealplantemplate);
        // } else if (role === "admin") {
        //   router.push(Routes.mealplantemplate);
        // }
      } else {
        showSnackbar(data.message || "Meal plan save failed.", "error");
      }
    },
  });
}

export function useSaveTemplateinRequest() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const role = getLocalStorageItem("role");

  const baseUrl =
    role === "admin"
      ? API_ENDPOINTS.SAVE_TEMP_BY_ADMIN
      : role === "trainer"
      ? API_ENDPOINTS.SAVE_TEMP_BY_TRAINER
      : API_ENDPOINTS.SAVE_TEMP_BY_CUSTOMER;

  return useMutation({
    mutationFn: async (payload) => {
      try {
        const data = await HttpClient.post(baseUrl, payload);
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

    onSuccess: (data) => {
      if (data?.success === true) {
        queryClient.invalidateQueries(["mealPlanComplete"]);
        showSnackbar(
          data.message || "Meal plan saved successfully!",
          "success"
        );

        if (role === "customer") {
          router.push(Routes.dietPlan);
        } else if (role === "trainer") {
          router.push(Routes.customerplanrequesttotrainer);
        } else if (role === "admin") {
          router.push(Routes.customerplanrequesttoadmin);
        }
      } else {
        showSnackbar(data.message || "Meal plan save failed.", "error");
      }
    },
  });
}

export function useCreateMealPlan() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const router = useRouter();
  const role = getLocalStorageItem("role");

  return useMutation({
    mutationFn: async ({
      isLoading,
      formData,
      isTemplateCreation = false,
      customerTrainerId = null,
      customerAdminId = null,
      templatePlanId = null,
      clonedTemplateData = null,
      customerId = null,
    }) => {
      console.log("formData", formData);
      const number_of_days =
        clonedTemplateData?.number_of_days || formData.number_of_days;

      let payload = {
        name: formData.plan_name,
        number_of_days,
        plan_category_ids: (formData.category_ids || []).map((cat) =>
          typeof cat === "object" ? cat.id : cat
        ),
        // plan_category_ids: formData.category_ids.map((cat) => cat.id),
        // meals_per_day: formData.meals_per_day,
        // snacks_per_day: formData.snacks_per_day,
        // plan_category_ids: formData.category_ids,
      };
      if (formData.meals_per_day !== "") {
        payload.meals_per_day = formData.meals_per_day;
      }

      if (formData.snacks_per_day !== "") {
        payload.snacks_per_day = formData.snacks_per_day;
      }

      if (isTemplateCreation && role === "admin") {
        payload = {
          ...payload,
          ...(formData.visible_to_admins && { visible_to_admins: true }),
          ...(formData.visible_to_trainers && { visible_to_trainers: true }),
          ...(formData.visible_to_customers && { visible_to_customers: true }),
        };
      }

      const endpoint = isTemplateCreation
        ? API_ENDPOINTS.CREATE_TEMPLATE_PLAN
        : role === "admin"
        ? API_ENDPOINTS.CREATE_MEAL_PLAN
        : role === "trainer"
        ? API_ENDPOINTS.CREATE_MEAL_PLAN_BY_TRAINER
        : API_ENDPOINTS.CREATE_MEAL_PLAN_BY_CUSTOMER;

      const request_id =
        role === "trainer" && !isTemplateCreation
          ? customerTrainerId
          : role === "admin" && !isTemplateCreation
          ? customerAdminId
          : null;

      const user_id =
        role === "trainer" && !isTemplateCreation && !request_id
          ? customerId
          : null;

      const type = request_id || user_id ? "custom" : "general";

      const response = await HttpClient.post(endpoint, {
        ...payload,
        type,
        ...(request_id ? { request_id } : user_id ? { user_id } : {}),
      });

      return {
        ...response,
        templatePlanId,
        isTemplateCreation,
        request_id,
        customer_id: user_id,
      };
    },
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries(["mealPlans"]);
        showSnackbar(
          data.message || "Meal plan created successfully!",
          "success"
        );

        const planId = data?.data?.id;
        const requestId = data?.request_id;
        const customerID = data?.customer_id;
        const { templatePlanId, isTemplateCreation } = data;

        const queryParams = templatePlanId
          ? `?template_id=${templatePlanId}`
          : "";

        if (role === "trainer" && customerID) {
          router.push(`/customer/${customerID}/plan/${planId}${queryParams}`);
        } else if (requestId) {
          const basePath =
            role === "trainer"
              ? `/customer-trainer-request/request-details/edit/${requestId}`
              : `/customer-admin-request/request-details/edit/${requestId}`;

          router.push(`${basePath}${queryParams}`);
        } else if (planId) {
          const basePath = isTemplateCreation
            ? `/template-plan/edit-template-plan/${planId}`
            : `/diet-plan/edit-diet-plan/${planId}`;

          router.push(`${basePath}${queryParams}`);
        }
      } else {
        showSnackbar(data.message || "Meal plan creation failed.", "error");
      }
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong.";
      showSnackbar(message, "error");
    },
  });
}
