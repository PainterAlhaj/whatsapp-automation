export type ConversationStatus = "OPEN" | "CLOSED" | "PENDING";
export type MessageDirection = "INBOUND" | "OUTBOUND";
export type MessageStatus = "SENT" | "DELIVERED" | "READ" | "FAILED" | "RECEIVED";
export type MessageType = "TEXT" | "IMAGE" | "DOCUMENT" | "AUDIO" | "VIDEO" | "LOCATION" | "TEMPLATE";

export interface ConversationContact {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  avatar?: string;
}

export interface Conversation {
  id: string;
  _id?: string;
  contact?: ConversationContact;
  integration?: string;
  lastMessage?: string;
  lastMessageType?: MessageType | string;
  lastMessageAt?: string;
  status: ConversationStatus | string;
  unreadCount: number;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  _id?: string;
  conversationId?: string;
  conversation?: string | Partial<Conversation>;
  contact?: ConversationContact | string;
  integration?: string;
  direction: MessageDirection;
  type: MessageType | string;
  content: string;
  metaMessageId?: string;
  status: MessageStatus;
  sentAt?: string | null;
  deliveredAt?: string | null;
  readAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConversationQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ALL" | "UNREAD" | "OPEN" | "CLOSED" | string;
}

export interface CreateConversationPayload {
  contactId?: string;
  phone?: string;
}

export interface GetConversationsResponse {
  success: boolean;
  message?: string;
  data: {
    conversations: Conversation[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface SingleConversationResponse {
  success: boolean;
  message?: string;
  data: Conversation;
}

export interface GetMessagesQueryParams {
  page?: number;
  limit?: number;
}

export interface GetMessagesResponse {
  success: boolean;
  message?: string;
  data: Message[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SendOutboundMessagePayload {
  text: string;
}

export interface SendMessageResponse {
  success: boolean;
  message?: string;
  data: Message;
}

export interface UpdateConversationPayload {
  status?: ConversationStatus | string;
  isArchived?: boolean;
}

export interface BasicSuccessResponse {
  success: boolean;
  message?: string;
}
