import { AUTH_TOKEN_KEY } from "@/constants/tokenKey";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 60000,
});

Axios.interceptors.request.use((config) => {
  const token = Cookies.get(AUTH_TOKEN_KEY);
  if (config.data instanceof FormData) {
    //@ts-ignore
    config.headers = {
      ...config.headers,
      "Content-Type": "multipart/form-data",
      Authorization: `${token ? token : ""}`,
    };
  } else {
    //@ts-ignore
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json",
      Authorization: `${token ? token : ""}`,
    };
  }
  return config;
});

export default Axios;

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 502) {
      Cookies.remove(AUTH_TOKEN_KEY);
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export class HttpClient {
  // ===== GET =====
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await Axios.get(url, config);
    return response.data;
  }

  // ===== POST =====
  // Overload: no-body (just config)
  static async post<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  // Overload: with body
  static async post<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<T>;
  // Implementation
  static async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await Axios.request<T>({
      url,
      method: "POST",
      data: data ?? {},
      ...config,
    });
    return response.data;
  }

  // ===== PUT =====
  // Overload: no-body (just config)
  static async put<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  // Overload: with body
  static async put<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<T>;
  // Implementation
  static async put<T>(
    url: string,
    dataOrConfig?: unknown | AxiosRequestConfig,
    maybeConfig?: AxiosRequestConfig
  ): Promise<T> {
    const isNoBody =
      dataOrConfig === undefined ||
      dataOrConfig === null ||
      (typeof dataOrConfig === "object" &&
        !("data" in (dataOrConfig as AxiosRequestConfig)) &&
        "params" in (dataOrConfig as AxiosRequestConfig));
    if (isNoBody) {
      const config = (dataOrConfig as AxiosRequestConfig) ?? {};
      const response: AxiosResponse<T> = await Axios.request({
        url,
        method: "PUT",
        ...config,
      });
      return response.data;
    }
    const response: AxiosResponse<T> = await Axios.put(
      url,
      dataOrConfig,
      maybeConfig
    );
    return response.data;
  }

  static async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await Axios.request<T>({
      url,
      method: "PATCH",
      data: data ?? {},
      ...config,
    });
    return response.data;
  }

  static async delete<T>(
    url: string,
    config?: import("axios").AxiosRequestConfig
  ): Promise<T> {
    const response = await Axios.delete<T>(url, config);
    return response.data;
  }
}
