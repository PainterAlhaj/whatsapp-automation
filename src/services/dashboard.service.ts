import axiosInstance from "./axios-instance";
import { DashboardStatsData, DashboardStatsResponse } from "@/types/dashboard.types";

/**
 * Service layer for Dashboard endpoints using Axios.
 * Implements API Specification: dashboard_api_specification.md
 */
export const dashboardService = {
  /**
   * API: Get Dashboard Statistics
   * GET /dashboard (Resolves to /api/v1/dashboard via axiosInstance baseURL)
   */
  async getDashboardStats(): Promise<DashboardStatsData> {
    const response = await axiosInstance.get<DashboardStatsResponse>("/dashboard");
    return response.data.data;
  },
};

export default dashboardService;
