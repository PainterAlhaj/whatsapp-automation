/**
 * Dashboard Module TypeScript Interfaces & Types
 * Matching API Specification: dashboard_api_specification.md
 */

export interface DashboardStatsData {
  totalContacts: number;
  totalTemplates: number;
  totalCampaigns: number;
  totalMessagesSent: number;
  totalFailedMessages: number;
  activeCampaigns: number;
  completedCampaigns: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStatsData;
}

export interface ApiErrorResponse {
  success: boolean;
  status: string;
  message: string;
}
