import { env } from "@/config/env";
import { parseErrorResponse } from "./api-errors";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  token?: string;
}

/**
 * Standard HTTP client wrapping fetch API with headers and error handling.
 */
class ApiClient {
  private getBaseUrl(): string {
    return env.apiBaseUrl;
  }

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("whatsflow_auth_token");
    }
    return null;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
    const baseUrl = this.getBaseUrl();
    const url = new URL(path.startsWith("http") ? path : `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, token, headers: customHeaders, ...fetchInit } = options;
    const url = this.buildUrl(path, params);

    const headers = new Headers(customHeaders);
    if (!headers.has("Content-Type") && !(fetchInit.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json");
    }

    const authToken = token || this.getAuthToken();
    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }

    const config: RequestInit = {
      ...fetchInit,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await parseErrorResponse(response);
        
        // Centralized Token Expiry Interception
        if (error.status === 401 && typeof window !== "undefined") {
          localStorage.removeItem("whatsflow_auth_token");
          window.dispatchEvent(new Event("whatsflow-unauthorized"));
        }
        
        throw error;
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json() as T;
    } catch (err) {
      if (err instanceof Error && err.name === "ApiError") {
        throw err;
      }
      // Catch network failures
      throw new Error(err instanceof Error ? err.message : "Network error, please check connection.");
    }
  }

  public get<T>(path: string, options?: Omit<RequestOptions, "body" | "method">): Promise<T> {
    return this.request<T>(path, { ...options, method: "GET" });
  }

  public post<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "body" | "method">): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public put<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "body" | "method">): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public patch<T>(path: string, body?: unknown, options?: Omit<RequestOptions, "body" | "method">): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  public delete<T>(path: string, options?: Omit<RequestOptions, "body" | "method">): Promise<T> {
    return this.request<T>(path, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
