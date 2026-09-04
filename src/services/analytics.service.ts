import axiosInstance from "./axios-instance";
import { AnalyticsApiResponse, AnalyticsData } from "@/types/analytics.types";

export const analyticsService = {
  /**
   * Fetch dynamic analytics data from backend API.
   * GET /analytics?dateRange=...
   */
  async getAnalytics(dateRange: string = "30d"): Promise<AnalyticsData> {
    const response = await axiosInstance.get<AnalyticsApiResponse>("/analytics", {
      params: { dateRange }
    });
    return response.data.data;
  }
};

export default analyticsService;
