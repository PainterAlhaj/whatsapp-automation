import axios, { AxiosError } from "axios";
import { env } from "@/config/env";
import { ApiErrorResponse } from "@/types/contact.types";

const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL || env.apiBaseUrl || "http://localhost:5000/api/v1";
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

export const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request Interceptor: Attach Auth Bearer Token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("whatsflow_auth_token") ||
        localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Error Normalization & Auth Interception
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const { status, config, data } = error.response;

      // Handle 401 Unauthorized for non-auth endpoints
      const isAuthEndpoint =
        config?.url?.includes("/auth/login") ||
        config?.url?.includes("/auth/register");

      if (status === 401 && !isAuthEndpoint && typeof window !== "undefined") {
        localStorage.removeItem("whatsflow_auth_token");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("whatsflow-unauthorized"));
      }

      // Format custom error message if available
      const message =
        data?.message ||
        (data?.errors ? Object.values(data.errors).join(". ") : null) ||
        error.message ||
        "An unexpected error occurred.";

      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error("Network error. Please check your internet connection or server status."));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
