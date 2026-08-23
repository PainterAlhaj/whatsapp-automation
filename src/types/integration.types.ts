/**
 * Integration & Webhook Module Data Models and API Request/Response Types
 * Single source of truth: integration_api_specification.md
 */

export type IntegrationProvider = "WHATSAPP_CLOUD";
export type IntegrationStatus = "CONNECTED" | "DISCONNECTED" | "EXPIRED";

export interface IntegrationData {
  id: string;
  phoneNumber: string;
  businessAccountId: string;
  phoneNumberId: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  lastVerifiedAt: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface VerifiedMetaDetails {
  id: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  verifiedName: string;
  status: "CONNECTED";
  lastVerifiedAt: string;
}

export interface ConnectIntegrationRequest {
  businessAccountId: string;
  phoneNumberId: string;
  phoneNumber: string;
  accessToken: string;
  appId?: string;
  appSecret?: string;
  webhookVerifyToken?: string;
}

export interface UpdateIntegrationRequest {
  businessAccountId?: string;
  phoneNumberId?: string;
  phoneNumber?: string;
  accessToken?: string;
  appId?: string;
  appSecret?: string;
  webhookVerifyToken?: string;
}

export interface ConnectIntegrationResponse {
  success: boolean;
  message: string;
  data: IntegrationData;
}

export interface GetIntegrationResponse {
  success: boolean;
  message: string;
  data: IntegrationData;
}

export interface VerifyIntegrationResponse {
  success: boolean;
  message: string;
  data: VerifiedMetaDetails;
}

export interface GenericSuccessResponse {
  success: boolean;
  message: string;
}
