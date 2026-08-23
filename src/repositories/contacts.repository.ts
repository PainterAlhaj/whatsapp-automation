import { Contact as MockContact, initialContacts } from "@/lib/mock-data";
import { contactService } from "@/services/contact.service";
import { Contact as ApiContact } from "@/types/contact.types";

export interface ContactsRepository {
  getAll(): Promise<MockContact[]>;
  getById(id: string): Promise<MockContact | null>;
  create(contact: Omit<MockContact, "id"> & { id?: string }): Promise<MockContact>;
  update(id: string, contact: Partial<MockContact>): Promise<MockContact>;
  delete(id: string): Promise<void>;
}

/**
 * Repository accessing local mock memory.
 */
export class MockContactsRepository implements ContactsRepository {
  private contacts: MockContact[] = [...initialContacts];

  async getAll(): Promise<MockContact[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...this.contacts];
  }

  async getById(id: string): Promise<MockContact | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const item = this.contacts.find((c) => c.id === id);
    return item ? { ...item } : null;
  }

  async create(contact: Omit<MockContact, "id"> & { id?: string }): Promise<MockContact> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newContact: MockContact = {
      ...contact,
      id: contact.id || `con_${Date.now()}`,
    };
    this.contacts = [newContact, ...this.contacts];
    return { ...newContact };
  }

  async update(id: string, contact: Partial<MockContact>): Promise<MockContact> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    let updated: MockContact | null = null;
    this.contacts = this.contacts.map((c) => {
      if (c.id === id) {
        updated = { ...c, ...contact };
        return updated;
      }
      return c;
    });

    if (!updated) {
      throw new Error(`Contact with ID ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    this.contacts = this.contacts.filter((c) => c.id !== id);
  }
}

/**
 * Helper to transform API contact into legacy representation if needed
 */
function mapApiContactToMock(c: ApiContact): MockContact {
  return {
    id: c._id,
    name: `${c.firstName || ""} ${c.lastName || ""}`.trim(),
    phone: c.phoneNumber,
    group: c.groups?.[0] || c.tags?.[0] || "General",
    status: c.status === "active" ? "active" : "inactive",
    lastActivity: c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleDateString() : "No recent activity",
    createdDate: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A",
    notes: c.notes || "",
    activityHistory: [],
  };
}

/**
 * Repository accessing REST API endpoints.
 */
export class HttpContactsRepository implements ContactsRepository {
  async getAll(): Promise<MockContact[]> {
    const res = await contactService.getAllContacts({ limit: 100 });
    return res.contacts.map(mapApiContactToMock);
  }

  async getById(id: string): Promise<MockContact | null> {
    const c = await contactService.getContactById(id);
    return c ? mapApiContactToMock(c) : null;
  }

  async create(contact: Omit<MockContact, "id"> & { id?: string }): Promise<MockContact> {
    const nameParts = contact.name.trim().split(" ");
    const firstName = nameParts[0] || "Unnamed";
    const lastName = nameParts.slice(1).join(" ");
    const created = await contactService.createContact({
      firstName,
      lastName: lastName || undefined,
      phoneNumber: contact.phone,
      tags: [contact.group],
      notes: contact.notes,
      status: "active",
    });
    return mapApiContactToMock(created);
  }

  async update(id: string, contact: Partial<MockContact>): Promise<MockContact> {
    const payload: Record<string, unknown> = {};
    if (contact.name) {
      const parts = contact.name.trim().split(" ");
      payload.firstName = parts[0];
      payload.lastName = parts.slice(1).join(" ");
    }
    if (contact.phone) payload.phoneNumber = contact.phone;
    if (contact.notes !== undefined) payload.notes = contact.notes;
    if (contact.status) payload.status = contact.status;

    const updated = await contactService.updateContact(id, payload);
    return mapApiContactToMock(updated);
  }

  async delete(id: string): Promise<void> {
    await contactService.deleteContact(id);
  }
}
