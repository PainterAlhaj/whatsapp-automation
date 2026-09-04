import axiosInstance from "./axios-instance";
import {
  Conversation,
  ConversationQueryParams,
  CreateConversationPayload,
  GetConversationsResponse,
  SingleConversationResponse,
  GetMessagesQueryParams,
  GetMessagesResponse,
  SendOutboundMessagePayload,
  SendMessageResponse,
  UpdateConversationPayload,
  BasicSuccessResponse,
} from "@/types/chat.types";

/**
 * Service layer for WhatsApp Live Chat & Conversations endpoints using Axios.
 * Base URL: /api/v1 (configured in axiosInstance)
 */
export const chatService = {
  /**
   * GET /conversations
   * Fetch paginated & searchable conversation list
   */
  async getConversations(params?: ConversationQueryParams): Promise<GetConversationsResponse> {
    const cleanParams: Record<string, any> = {};
    if (params?.page) cleanParams.page = params.page;
    if (params?.limit) cleanParams.limit = params.limit;
    if (params?.search && params.search.trim()) cleanParams.search = params.search.trim();
    if (params?.status && params.status !== "ALL") cleanParams.status = params.status;

    const response = await axiosInstance.get<GetConversationsResponse>("/conversations", {
      params: cleanParams,
    });
    return response.data;
  },

  /**
   * POST /conversations
   * Create or retrieve conversation for a contact
   */
  async createConversation(payload: CreateConversationPayload): Promise<Conversation> {
    const response = await axiosInstance.post<SingleConversationResponse>("/conversations", payload);
    return response.data.data;
  },

  /**
   * GET /conversations/:id
   * Fetch single conversation details
   */
  async getConversationById(id: string): Promise<Conversation> {
    const response = await axiosInstance.get<SingleConversationResponse>(`/conversations/${id}`);
    return response.data.data;
  },

  /**
   * GET /conversations/:conversationId/messages
   * Fetch paginated message history for a conversation
   */
  async getMessages(
    conversationId: string,
    params?: GetMessagesQueryParams
  ): Promise<GetMessagesResponse> {
    const response = await axiosInstance.get<GetMessagesResponse>(
      `/conversations/${conversationId}/messages`,
      {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 50,
        },
      }
    );
    return response.data;
  },

  /**
   * PATCH /conversations/:conversationId/read
   * Mark conversation as read (resets unreadCount to 0)
   */
  async markAsRead(conversationId: string): Promise<SingleConversationResponse> {
    const response = await axiosInstance.patch<SingleConversationResponse>(
      `/conversations/${conversationId}/read`
    );
    return response.data;
  },

  /**
   * POST /conversations/:conversationId/messages
   * Send outbound WhatsApp message
   */
  async sendMessage(
    conversationId: string,
    payload: SendOutboundMessagePayload
  ): Promise<SendMessageResponse> {
    const response = await axiosInstance.post<SendMessageResponse>(
      `/conversations/${conversationId}/messages`,
      payload
    );
    return response.data;
  },

  /**
   * PATCH /conversations/:conversationId
   * Update conversation status or archive state
   */
  async updateConversation(
    id: string,
    payload: UpdateConversationPayload
  ): Promise<SingleConversationResponse> {
    const response = await axiosInstance.patch<SingleConversationResponse>(
      `/conversations/${id}`,
      payload
    );
    return response.data;
  },

  /**
   * DELETE /conversations/:conversationId
   * Delete conversation
   */
  async deleteConversation(id: string): Promise<BasicSuccessResponse> {
    const response = await axiosInstance.delete<BasicSuccessResponse>(`/conversations/${id}`);
    return response.data;
  },
};
