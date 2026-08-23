import { env } from "@/config/env";
import {
  CampaignsRepository,
  MockCampaignsRepository,
  HttpCampaignsRepository,
} from "./campaigns.repository";
import {
  ContactsRepository,
  MockContactsRepository,
  HttpContactsRepository,
} from "./contacts.repository";
import {
  AutomationsRepository,
  MockAutomationsRepository,
  HttpAutomationsRepository,
} from "./automations.repository";
import {
  AuthRepository,
  MockAuthRepository,
  HttpAuthRepository,
} from "./auth.repository";

// Singletons definition
export let campaignsRepository: CampaignsRepository;
export let contactsRepository: ContactsRepository;
export let automationsRepository: AutomationsRepository;
export let authRepository: AuthRepository;

if (env.useMockApi) {
  // Use mock memory-based repositories
  campaignsRepository = new MockCampaignsRepository();
  contactsRepository = new MockContactsRepository();
  automationsRepository = new MockAutomationsRepository();
  authRepository = new MockAuthRepository();
} else {
  // Use HTTP REST-based repositories
  campaignsRepository = new HttpCampaignsRepository();
  contactsRepository = new HttpContactsRepository();
  automationsRepository = new HttpAutomationsRepository();
  authRepository = new HttpAuthRepository();
}

export * from "./campaigns.repository";
export * from "./contacts.repository";
export * from "./automations.repository";
export * from "./auth.repository";
