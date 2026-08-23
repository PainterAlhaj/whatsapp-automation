import { Campaign, initialCampaigns } from "@/lib/mock-data";
import { campaignService } from "@/services/campaign.service";
import { CampaignData } from "@/types/campaign.types";

export interface CampaignsRepository {
  getAll(): Promise<Campaign[]>;
  getById(id: string): Promise<Campaign | null>;
  create(campaign: Omit<Campaign, "id"> & { id?: string }): Promise<Campaign>;
  update(id: string, campaign: Partial<Campaign>): Promise<Campaign>;
  delete(id: string): Promise<void>;
}

/**
 * Helper to map backend CampaignData to UI Campaign format
 */
const mapBackendToCampaign = (raw: CampaignData): Campaign => {
  const deliveryRate = raw.sentCount > 0 ? Math.round((raw.deliveredCount / raw.sentCount) * 100) : 0;
  let status: Campaign["status"] = "draft";
  if (raw.status === "PROCESSING") status = "active";
  if (raw.status === "SCHEDULED") status = "scheduled";
  if (raw.status === "COMPLETED") status = "completed";

  const templateName = typeof raw.template === "object" && raw.template !== null ? raw.template.name : String(raw.template || "");

  return {
    id: raw._id,
    name: raw.name,
    status,
    audienceSize: raw.totalRecipients || 0,
    messagesSent: raw.sentCount || 0,
    deliveryRate,
    scheduledDate: raw.scheduledAt ? new Date(raw.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "2-digit" }) : "Active Now",
    templateName,
    activityTimeline: [],
  };
};

/**
 * Repository accessing local mock memory.
 */
export class MockCampaignsRepository implements CampaignsRepository {
  private campaigns: Campaign[] = [...initialCampaigns];

  async getAll(): Promise<Campaign[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...this.campaigns];
  }

  async getById(id: string): Promise<Campaign | null> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const item = this.campaigns.find((c) => c.id === id);
    return item ? { ...item } : null;
  }

  async create(campaign: Omit<Campaign, "id"> & { id?: string }): Promise<Campaign> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newCampaign: Campaign = {
      ...campaign,
      id: campaign.id || `cmp_${Date.now()}`,
    };
    this.campaigns = [newCampaign, ...this.campaigns];
    return { ...newCampaign };
  }

  async update(id: string, campaign: Partial<Campaign>): Promise<Campaign> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let updated: Campaign | null = null;
    this.campaigns = this.campaigns.map((c) => {
      if (c.id === id) {
        updated = { ...c, ...campaign };
        return updated;
      }
      return c;
    });

    if (!updated) {
      throw new Error(`Campaign with ID ${id} not found`);
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    this.campaigns = this.campaigns.filter((c) => c.id !== id);
  }
}

/**
 * Repository accessing REST API endpoints.
 */
export class HttpCampaignsRepository implements CampaignsRepository {
  async getAll(): Promise<Campaign[]> {
    const res = await campaignService.getAllCampaigns();
    return res.campaigns.map(mapBackendToCampaign);
  }

  async getById(id: string): Promise<Campaign | null> {
    try {
      const data = await campaignService.getCampaignById(id);
      return mapBackendToCampaign(data);
    } catch {
      return null;
    }
  }

  async create(campaign: Omit<Campaign, "id"> & { id?: string }): Promise<Campaign> {
    const created = await campaignService.createCampaign({
      name: campaign.name,
      template: campaign.templateName,
      contacts: [],
    });
    return mapBackendToCampaign(created);
  }

  async update(id: string, campaign: Partial<Campaign>): Promise<Campaign> {
    const updated = await campaignService.updateCampaign(id, {
      name: campaign.name,
    });
    return mapBackendToCampaign(updated);
  }

  async delete(id: string): Promise<void> {
    await campaignService.deleteCampaign(id);
  }
}

