/**
 * Contact Module TypeScript Interfaces & Types
 * Matching API Specification contact_api_specification.md
 */

// Core Contact Model Representation
export interface Contact {
  _id: string;
  user: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  email: string;
  tags: string[];
  groups: string[];
  notes: string;
  source: 'manual' | 'csv' | 'api' | 'whatsapp' | 'import';
  status: 'active' | 'blocked' | 'unsubscribed';
  lastMessageAt: string | null;
  customFields: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Request Payload Types
export interface CreateContactPayload {
  firstName: string;
  lastName?: string;
  phoneNumber: string;
  countryCode?: string;
  email?: string;
  tags?: string[];
  groups?: string[];
  notes?: string;
  source?: 'manual' | 'csv' | 'api' | 'whatsapp' | 'import';
  status?: 'active' | 'blocked' | 'unsubscribed';
  customFields?: Record<string, string>;
}

export type UpdateContactPayload = Partial<CreateContactPayload>;

export interface GetContactsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'blocked' | 'unsubscribed';
  sort?: 'createdAt' | 'firstName' | 'lastName' | 'phoneNumber' | 'status';
  order?: 'asc' | 'desc';
}

// Response Payload Types
export interface SingleContactResponse {
  success: boolean;
  message: string;
  data: Contact;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetContactsResponse {
  success: boolean;
  message: string;
  contacts: Contact[];
  pagination: PaginationMeta;
}

export interface ImportResultData {
  totalRows: number;
  imported: number;
  duplicates: number;
  failed: number;
}

export interface ImportContactsResponse {
  success: boolean;
  message: string;
  data: ImportResultData;
}

export interface BasicSuccessResponse {
  success: boolean;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  status: 'fail' | 'error';
  message: string;
  errors?: Record<string, string>;
}
