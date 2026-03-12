"use client";

import { API_ENDPOINTS } from "@/helpers/api-endpoints";
import { HttpClient } from "@/helpers/clients/http-client";
import { errorNotification } from "@/helpers/notification";
import { useMutation } from "@tanstack/react-query";

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (input) =>
      HttpClient.post(API_ENDPOINTS.SIGNUP, input),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      console.error("error===>", error);
      
      errorNotification(`${error?.response?.data?.errors?.[0] || error?.response?.data?.message || error?.message}`);
    },
  });
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: async (input) =>
      HttpClient.post(API_ENDPOINTS.VERIFY_EMAIL, input),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      errorNotification(`${error?.response?.data?.errors?.[0] || error?.response?.data?.message || error.message}`);
    },
  });
}


export function useResendOtpMutation() {
  return useMutation({
    mutationFn: async (input) =>
      HttpClient.get(API_ENDPOINTS.RESEND_OTP, input),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      errorNotification(`${error?.response?.data?.errors?.[0] || error?.response?.data?.message || error.message}`);
    },
  });
}


export function useGetCountriesMutation() {
  return useMutation({
    mutationFn: async (input) =>
      HttpClient.get(API_ENDPOINTS.GET_COUNTRIES, input),
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      errorNotification(`${error?.response?.data?.errors?.[0] || error?.response?.data?.message || error.message}`);
    },
  });
}

