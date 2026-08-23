import axiosInstance from "./axios-instance";
import {
  CampaignData,
  CreateCampaignPayload,
  UpdateCampaignPayload,
  CampaignQueryParams,
  GetAllCampaignsResponse,
  CreateCampaignResponse,
  GetCampaignByIdResponse,
  UpdateCampaignResponse,
  DeleteCampaignResponse,
  SendCampaignResponse,
  GetCampaignStatsResponse,
  CampaignStatsData,
} from "@/types/campaign.types";

/**
 * Service layer for Campaign endpoints using Axios.
 * Implements API Specification: campaign_api_integration_spec.md
 */
export const campaignService = {
  /**
   * API 1: Create Campaign
   * POST /campaigns
   */
  async createCampaign(payload: CreateCampaignPayload): Promise<CampaignData> {
    const response = await axiosInstance.post<CreateCampaignResponse>("/campaigns", payload);
    return response.data.data;
  },

  /**
   * API 2: Get All Campaigns
   * GET /campaigns
   * Note: Backend returns `campaigns` array and `pagination` metadata
   */
  async getAllCampaigns(params?: CampaignQueryParams): Promise<GetAllCampaignsResponse> {
    const response = await axiosInstance.get<GetAllCampaignsResponse>("/campaigns", {
      params,
    });
    return response.data;
  },

  /**
   * API 3: Get Campaign By ID
   * GET /campaigns/:id
   */
  async getCampaignById(id: string): Promise<CampaignData> {
    const response = await axiosInstance.get<GetCampaignByIdResponse>(`/campaigns/${id}`);
    return response.data.data;
  },

  /**
   * API 4: Update Campaign
   * PATCH /campaigns/:id
   */
  async updateCampaign(id: string, payload: UpdateCampaignPayload): Promise<CampaignData> {
    const response = await axiosInstance.patch<UpdateCampaignResponse>(`/campaigns/${id}`, payload);
    return response.data.data;
  },

  /**
   * API 5: Delete Campaign
   * DELETE /campaigns/:id
   */
  async deleteCampaign(id: string): Promise<DeleteCampaignResponse> {
    const response = await axiosInstance.delete<DeleteCampaignResponse>(`/campaigns/${id}`);
    return response.data;
  },

  /**
   * API 6: Send Campaign
   * POST /campaigns/:id/send
   */
  async sendCampaign(id: string): Promise<CampaignData> {
    const response = await axiosInstance.post<SendCampaignResponse>(`/campaigns/${id}/send`, {});
    return response.data.data;
  },

  /**
   * API 7: Get Campaign Statistics
   * GET /campaigns/:id/stats
   */
  async getCampaignStats(id: string): Promise<CampaignStatsData> {
    const response = await axiosInstance.get<GetCampaignStatsResponse>(`/campaigns/${id}/stats`);
    return response.data.data;
  },
};
