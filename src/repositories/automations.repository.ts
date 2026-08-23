import { automationService } from "@/services/automation.service";
import { Automation, CreateAutomationPayload, UpdateAutomationPayload } from "@/types/automation.types";

export interface AutomationsRepository {
  getAll(): Promise<Automation[]>;
  getById(id: string): Promise<Automation | null>;
  create(automation: CreateAutomationPayload): Promise<Automation>;
  update(id: string, automation: UpdateAutomationPayload): Promise<Automation>;
  delete(id: string): Promise<void>;
  trigger(id: string): Promise<void>;
}

/**
 * Repository accessing REST API endpoints.
 */
export class HttpAutomationsRepository implements AutomationsRepository {
  async getAll(): Promise<Automation[]> {
    return automationService.getAllAutomations();
  }

  async getById(id: string): Promise<Automation | null> {
    try {
      return await automationService.getAutomationById(id);
    } catch {
      return null;
    }
  }

  async create(automation: CreateAutomationPayload): Promise<Automation> {
    return automationService.createAutomation(automation);
  }

  async update(id: string, automation: UpdateAutomationPayload): Promise<Automation> {
    return automationService.updateAutomation(id, automation);
  }

  async delete(id: string): Promise<void> {
    await automationService.deleteAutomation(id);
  }

  async trigger(id: string): Promise<void> {
    await automationService.triggerAutomation(id);
  }
}

export class MockAutomationsRepository extends HttpAutomationsRepository {}
