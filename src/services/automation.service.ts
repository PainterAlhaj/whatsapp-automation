import axiosInstance from "./axios-instance";
import {
  Automation,
  CreateAutomationPayload,
  UpdateAutomationPayload,
  AutomationsListResponse,
  SingleAutomationResponse,
  BasicAutomationSuccessResponse,
} from "@/types/automation.types";

/**
 * Service layer for Automation endpoints using Axios.
 * Communicates directly with backend automation module API (/api/v1/automations).
 */
export const automationService = {
  /**
   * GET /automations
   * Get all automations for authenticated user
   */
  async getAllAutomations(): Promise<Automation[]> {
    const response = await axiosInstance.get<AutomationsListResponse>("/automations");
    return response.data.data;
  },

  /**
   * GET /automations/:id
   * Get single automation by ID
   */
  async getAutomationById(id: string): Promise<Automation> {
    const response = await axiosInstance.get<SingleAutomationResponse>(`/automations/${id}`);
    return response.data.data;
  },

  /**
   * POST /automations
   * Create a new automation
   */
  async createAutomation(payload: CreateAutomationPayload): Promise<Automation> {
    const response = await axiosInstance.post<SingleAutomationResponse>("/automations", payload);
    return response.data.data;
  },

  /**
   * PUT /automations/:id
   * Update existing automation details or status
   */
  async updateAutomation(id: string, payload: UpdateAutomationPayload): Promise<Automation> {
    const response = await axiosInstance.put<SingleAutomationResponse>(`/automations/${id}`, payload);
    return response.data.data;
  },

  /**
   * DELETE /automations/:id
   * Delete an automation
   */
  async deleteAutomation(id: string): Promise<BasicAutomationSuccessResponse> {
    const response = await axiosInstance.delete<BasicAutomationSuccessResponse>(`/automations/${id}`);
    return response.data;
  },

  /**
   * POST /automations/:id/trigger
   * Manually trigger an automation execution
   */
  async triggerAutomation(id: string): Promise<BasicAutomationSuccessResponse> {
    const response = await axiosInstance.post<BasicAutomationSuccessResponse>(`/automations/${id}/trigger`, {});
    return response.data;
  },
};
