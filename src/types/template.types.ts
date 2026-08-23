export interface TemplateComponent {
  type: string; // "HEADER" | "BODY" | "FOOTER" | "BUTTONS"
  format?: string | null;
  text?: string;
  example?: Record<string, unknown> | null;
  buttons?: Array<Record<string, unknown>>;
}

export interface Template {
  _id: string;
  user: string;
  integration?: string;
  metaTemplateId?: string;
  name: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  language: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAUSED" | "DISABLED" | "IN_APPEAL";
  qualityScore?: "GREEN" | "YELLOW" | "RED" | null;
  components: TemplateComponent[];
  rejectionReason?: string;
  isDeletedOnMeta?: boolean;
  syncedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface TemplateButtonPayload {
  type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
  text: string;
  value?: string;
}

export interface CreateTemplatePayload {
  name: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  language: string;
  header?: string;
  body: string;
  footer?: string;
  examples?: {
    body?: string[];
    header?: string[];
  };
  buttons?: TemplateButtonPayload[];
}

export type UpdateTemplatePayload = Partial<CreateTemplatePayload> & {
  status?: Template["status"];
  rejectionReason?: string;
};

export interface GetTemplatesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  status?: Template["status"];
  sort?: "createdAt" | "name" | "category" | "status" | "language";
  order?: "asc" | "desc";
}

export interface SingleTemplateResponse {
  success: boolean;
  message: string;
  data: Template;
}

export interface GetTemplatesResponse {
  success: boolean;
  message: string;
  templates: Template[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SyncResultData {
  totalFetched: number;
  created: number;
  updated: number;
  deleted: number;
}

export interface SyncTemplatesResponse {
  success: boolean;
  message: string;
  data: SyncResultData;
}

export interface BasicSuccessResponse {
  success: boolean;
  message: string;
}

export interface ApiErrorResponse {
  success: boolean;
  status?: string;
  message?: string;
  errors?: Record<string, string>;
}
