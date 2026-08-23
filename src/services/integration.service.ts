import axiosInstance from "./axios-instance";
import {
  ConnectIntegrationRequest,
  ConnectIntegrationResponse,
  GetIntegrationResponse,
  UpdateIntegrationRequest,
  VerifyIntegrationResponse,
  GenericSuccessResponse,
  IntegrationData,
} from "@/types/integration.types";

/**
 * Service layer for Integration & Webhook endpoints using Axios.
 * Implements API Specification: integration_api_specification.md
 */
export const integrationService = {
  /**
   * API 2: Get Connected Integration
   * GET /integrations
   */
  async getIntegration(): Promise<IntegrationData | null> {
    try {
      const response = await axiosInstance.get<GetIntegrationResponse>("/integrations");
      return response.data.data;
    } catch (error: any) {
      // 404 Not Found indicates no integration exists for the user yet
      if (error.message?.includes("not found") || error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * API 1: Connect Integration
   * POST /integrations/connect
   */
  async connectIntegration(payload: ConnectIntegrationRequest): Promise<ConnectIntegrationResponse> {
    const response = await axiosInstance.post<ConnectIntegrationResponse>("/integrations/connect", payload);
    return response.data;
  },

  /**
   * API 3: Verify Integration
   * GET /integrations/verify
   */
  async verifyIntegration(): Promise<VerifyIntegrationResponse> {
    const response = await axiosInstance.get<VerifyIntegrationResponse>("/integrations/verify");
    return response.data;
  },

  /**
   * API 4: Update Integration
   * PATCH /integrations
   */
  async updateIntegration(payload: UpdateIntegrationRequest): Promise<GetIntegrationResponse> {
    const response = await axiosInstance.patch<GetIntegrationResponse>("/integrations", payload);
    return response.data;
  },

  /**
   * API 5: Delete Integration
   * DELETE /integrations
   */
  async deleteIntegration(): Promise<GenericSuccessResponse> {
    const response = await axiosInstance.delete<GenericSuccessResponse>("/integrations");
    return response.data;
  },
};
