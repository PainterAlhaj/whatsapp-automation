import { Template } from "./template.types";

export type AutomationTrigger = "CONTACT_CREATED";
export type AutomationStatus = "ACTIVE" | "INACTIVE";

export interface Automation {
  _id: string;
  user: string;
  name: string;
  trigger: AutomationTrigger;
  template: Template | string; // populated template object or ID
  status: AutomationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAutomationPayload {
  name: string;
  trigger: AutomationTrigger;
  template: string; // APPROVED template Mongo ID
  status?: AutomationStatus;
}

export interface UpdateAutomationPayload {
  name?: string;
  trigger?: AutomationTrigger;
  template?: string;
  status?: AutomationStatus;
}

export interface AutomationsListResponse {
  success: boolean;
  message: string;
  data: Automation[];
}

export interface SingleAutomationResponse {
  success: boolean;
  message: string;
  data: Automation;
}

export interface BasicAutomationSuccessResponse {
  success: boolean;
  message: string;
}
