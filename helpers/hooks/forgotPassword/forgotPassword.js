"use client";

import { useSnackbar } from "@/app/contexts/SnackbarContext";
import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useForgotPasswordSendEmail() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    // 1. your mutation function posts to a *defined* URL
    mutationFn: async (payload) => {
      const res = await HttpClient.post(
        API_ENDPOINTS.FORGOT_PASSWORD_SEND_EMAIL,
        payload
      );
      return res;
    },
    // 2. on success: invalidate, show toast, redirect
    onSuccess: (data) => {
      queryClient.invalidateQueries(["forgotPasswordSendEmail"]);
      showSnackbar(data.message ?? "Email sent!", "success");
      return data;
    },

    // 3. on error: extract a friendly message and show toast
    onError: (error) => {
      // axios error might be in error.response.data.message
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      showSnackbar(message, "error");
      // re-throw if you want to let callers handle it too
      throw error;
    },
  });
}

export function useForgotPassword() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    // 1. your mutation function posts to a *defined* URL
    mutationFn: async (payload) => {
      const res = await HttpClient.post(API_ENDPOINTS.FORGOT_PASSWORD, payload);
      return res;
    },
    // 2. on success: invalidate, show toast, redirect
    onSuccess: (data) => {
      queryClient.invalidateQueries(["forgotPassword"]);
      showSnackbar(data.message ?? "Password reset successfully!", "success");
      return data;
    },

    // 3. on error: extract a friendly message and show toast
    onError: (error) => {
      // axios error might be in error.response.data.message
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      showSnackbar(message, "error");
      // re-throw if you want to let callers handle it too
      throw error;
    },
  });
}

export function useVerifyForgotPasswordToken() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    // 1. your mutation function posts to a *defined* URL
    mutationFn: async (payload) => {
      const res = await HttpClient.post(
        API_ENDPOINTS.VERIFY_FORGET_PASSWORD_TOKEN,
        payload
      );
      return res;
    },
    // 2. on success: invalidate, show toast, redirect
    onSuccess: (data) => {
      queryClient.invalidateQueries(["verifyForgotPasswordToken"]);
      showSnackbar(data.message ?? "Password token verified", "success");
      return data;
    },

    // 3. on error: extract a friendly message and show toast
    onError: (error) => {
      // axios error might be in error.response.data.message
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      showSnackbar(message, "error");
      // re-throw if you want to let callers handle it too
      throw error;
    },
  });
}




export function useChangePassword() {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    // 1. your mutation function posts to a *defined* URL
    mutationFn: async (payload) => {
      const res = await HttpClient.patch(API_ENDPOINTS.CHANGE_PASSWORD, payload);
      return res;
    },
    // 2. on success: invalidate, show toast, redirect
    onSuccess: (data) => {
      queryClient.invalidateQueries(["change-password"]);
      showSnackbar(data.message ?? "Password changed successfully!", "success");
      return data;
    },

    // 3. on error: extract a friendly message and show toast
    onError: (error) => {
      // axios error might be in error.response.data.message
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      showSnackbar(message, "error");
      // re-throw if you want to let callers handle it too
      throw error;
    },
  });
}