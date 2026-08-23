import axiosInstance from "./axios-instance";
import {
  Contact,
  CreateContactPayload,
  UpdateContactPayload,
  GetContactsQueryParams,
  GetContactsResponse,
  SingleContactResponse,
  BasicSuccessResponse,
  ImportContactsResponse,
} from "@/types/contact.types";

/**
 * Service layer for Contact endpoints using Axios.
 * Implements API Specification: contact_api_specification.md
 */
export const contactService = {
  /**
   * API 1: Create Contact
   * POST /contacts
   */
  async createContact(payload: CreateContactPayload): Promise<Contact> {
    const response = await axiosInstance.post<SingleContactResponse>("/contacts", payload);
    return response.data.data;
  },

  /**
   * API 2: Get All Contacts
   * GET /contacts
   * Returns contacts array and pagination metadata directly at response root
   */
  async getAllContacts(params?: GetContactsQueryParams): Promise<GetContactsResponse> {
    const response = await axiosInstance.get<GetContactsResponse>("/contacts", {
      params,
    });
    return response.data;
  },

  /**
   * API 3: Get Contact By ID
   * GET /contacts/:id
   */
  async getContactById(id: string): Promise<Contact> {
    const response = await axiosInstance.get<SingleContactResponse>(`/contacts/${id}`);
    return response.data.data;
  },

  /**
   * API 4: Update Contact
   * PATCH /contacts/:id
   */
  async updateContact(id: string, payload: UpdateContactPayload): Promise<Contact> {
    const response = await axiosInstance.patch<SingleContactResponse>(`/contacts/${id}`, payload);
    return response.data.data;
  },

  /**
   * API 5: Delete Contact
   * DELETE /contacts/:id
   */
  async deleteContact(id: string): Promise<BasicSuccessResponse> {
    const response = await axiosInstance.delete<BasicSuccessResponse>(`/contacts/${id}`);
    return response.data;
  },

  /**
   * API 6: Import Contacts (CSV)
   * POST /contacts/import
   * Multipart FormData file upload
   */
  async importContacts(file: File): Promise<ImportContactsResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<ImportContactsResponse>("/contacts/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * API 7: Export Contacts (CSV)
   * GET /contacts/export
   * Binary file download handler
   */
  async exportContacts(): Promise<void> {
    const response = await axiosInstance.get("/contacts/export", {
      responseType: "blob",
    });

    // Extract filename from response headers or generate default filename
    const contentDisposition = response.headers["content-disposition"];
    let filename = `contacts-${new Date().toISOString().split("T")[0]}.csv`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename=(.+)/);
      if (match && match[1]) {
        filename = match[1].replace(/"/g, "").trim();
      }
    }

    // Trigger browser file download
    const blob = new Blob([response.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
