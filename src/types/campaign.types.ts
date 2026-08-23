export type CampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED";

export interface CampaignTemplateRef {
  _id: string;
  name: string;
  category?: string;
  type?: string;
  language?: string;
}

export interface CampaignContactRef {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status?: string;
}

export interface CampaignData {
  _id: string;
  user: string;
  name: string;
  description?: string;
  template: string | CampaignTemplateRef;
  contacts: string[] | CampaignContactRef[];
  status: CampaignStatus;
  scheduledAt: string | null;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignPayload {
  name: string;
  description?: string;
  template: string;
  contacts: string[];
  scheduledAt?: string | null;
}

export interface UpdateCampaignPayload {
  name?: string;
  description?: string;
  template?: string;
  contacts?: string[];
  scheduledAt?: string | null;
  status?: CampaignStatus;
}

export interface CampaignQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CampaignStatus;
  sort?: "createdAt" | "name" | "status" | "scheduledAt" | "totalRecipients";
  order?: "asc" | "desc";
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateCampaignResponse {
  success: boolean;
  message: string;
  data: CampaignData;
}

export interface GetAllCampaignsResponse {
  success: boolean;
  message: string;
  campaigns: CampaignData[];
  pagination: PaginationInfo;
}

export interface GetCampaignByIdResponse {
  success: boolean;
  message: string;
  data: CampaignData;
}

export interface UpdateCampaignResponse {
  success: boolean;
  message: string;
  data: CampaignData;
}

export interface DeleteCampaignResponse {
  success: boolean;
  message: string;
}

export interface SendCampaignResponse {
  success: boolean;
  message: string;
  data: CampaignData;
}

export interface CampaignStatsData {
  campaignName: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
  status: CampaignStatus;
}

export interface GetCampaignStatsResponse {
  success: boolean;
  message: string;
  data: CampaignStatsData;
}
