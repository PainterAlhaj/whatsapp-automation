import axiosInstance from "./axios-instance";
import {
  Template,
  CreateTemplatePayload,
  UpdateTemplatePayload,
  GetTemplatesQueryParams,
  GetTemplatesResponse,
  SingleTemplateResponse,
  BasicSuccessResponse,
  SyncTemplatesResponse,
  SyncResultData,
} from "@/types/template.types";

/**
 * Service layer for Template endpoints using Axios.
 * Implements API Specification: template_api_specification.md
 */
export const templateService = {
  /**
   * API 1: Create Template
   * POST /templates
   */
  async createTemplate(payload: CreateTemplatePayload): Promise<Template> {
    const response = await axiosInstance.post<SingleTemplateResponse>("/templates", payload);
    return response.data.data;
  },

  /**
   * API 2: Get All Templates
   * GET /templates
   * Note: Backend returns `templates` and `pagination` directly at root level of response
   */
  async getAllTemplates(params?: GetTemplatesQueryParams): Promise<GetTemplatesResponse> {
    const response = await axiosInstance.get<GetTemplatesResponse>("/templates", {
      params,
    });
    return response.data;
  },

  /**
   * API 3: Get Template By ID
   * GET /templates/:id
   */
  async getTemplateById(id: string): Promise<Template> {
    const response = await axiosInstance.get<SingleTemplateResponse>(`/templates/${id}`);
    return response.data.data;
  },

  /**
   * API 4: Update Template
   * PUT /templates/:id
   */
  async updateTemplate(id: string, payload: UpdateTemplatePayload): Promise<Template> {
    const response = await axiosInstance.put<SingleTemplateResponse>(`/templates/${id}`, payload);
    return response.data.data;
  },

  /**
   * API 5: Delete Template
   * DELETE /templates/:id
   */
  async deleteTemplate(id: string): Promise<BasicSuccessResponse> {
    const response = await axiosInstance.delete<BasicSuccessResponse>(`/templates/${id}`);
    return response.data;
  },

  /**
   * API 6: Sync Templates from Meta
   * POST /templates/sync
   */
  async syncTemplates(): Promise<SyncResultData> {
    const response = await axiosInstance.post<SyncTemplatesResponse>("/templates/sync", {});
    return response.data.data;
  },
};
