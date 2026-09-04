import {
  ActivityLogItem,
  CampaignActivity,
  LogEvent,
  initialActivityLogsData,
  recentCampaigns,
  logEvents,
} from "@/lib/mock-data";
import { campaignService } from "@/services/campaign.service";
import { contactService } from "@/services/contact.service";
import { templateService } from "@/services/template.service";
import { automationService } from "@/services/automation.service";

export interface ActivityLogsRepository {
  getAllLogs(): Promise<ActivityLogItem[]>;
  getRecentActivities(): Promise<{
    recentCampaigns: CampaignActivity[];
    logEvents: LogEvent[];
  }>;
}

/**
 * Helper to compute relative time formatted string (e.g. "5 mins ago", "2 hours ago")
 */
function formatRelativeTime(dateInput: Date | string | number | undefined): string {
  if (!dateInput) return "Just now";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Just now";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Format Date to standard YYYY-MM-DD HH:mm:ss for log viewer
 */
function formatTimestamp(dateInput: Date | string | number | undefined): string {
  if (!dateInput) return new Date().toISOString().replace("T", " ").substring(0, 19);
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return new Date().toISOString().replace("T", " ").substring(0, 19);
  return d.toISOString().replace("T", " ").substring(0, 19);
}

/**
 * Repository accessing local mock memory for activity logs.
 */
export class MockActivityLogsRepository implements ActivityLogsRepository {
  private logs: ActivityLogItem[] = [...initialActivityLogsData];

  async getAllLogs(): Promise<ActivityLogItem[]> {
    // Simulate brief network delay
    await new Promise((resolve) => setTimeout(resolve, 250));
    return [...this.logs];
  }

  async getRecentActivities(): Promise<{
    recentCampaigns: CampaignActivity[];
    logEvents: LogEvent[];
  }> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      recentCampaigns: [...recentCampaigns],
      logEvents: [...logEvents],
    };
  }
}

/**
 * Repository accessing REST APIs and dynamically deriving logs from existing backend endpoints.
 * Zero modifications required on the backend server.
 */
export class HttpActivityLogsRepository implements ActivityLogsRepository {
  async getAllLogs(): Promise<ActivityLogItem[]> {
    const logs: ActivityLogItem[] = [];

    const [campaignsResult, contactsResult, templatesResult, automationsResult] =
      await Promise.allSettled([
        campaignService.getAllCampaigns(),
        contactService.getAllContacts({ limit: 50 }),
        templateService.getAllTemplates(),
        automationService.getAllAutomations(),
      ]);

    // 1. Process Campaign Logs
    if (campaignsResult.status === "fulfilled" && campaignsResult.value?.campaigns) {
      campaignsResult.value.campaigns.forEach((c) => {
        const createdAt = c.createdAt || c.updatedAt || new Date().toISOString();
        const sentCount = c.sentCount || 0;
        const failedCount = c.failedCount || 0;
        const total = c.totalRecipients || 0;
        const deliveryRate = sentCount > 0 ? Math.round(((sentCount - failedCount) / sentCount) * 100) : 0;

        let status: ActivityLogItem["status"] = "success";
        if (c.status === "FAILED") status = "failed";
        if (c.status === "PROCESSING" || c.status === "SCHEDULED") status = "pending";

        logs.push({
          id: `log_cmp_${c._id}`,
          timestamp: formatTimestamp(createdAt),
          user: { name: "System Admin", email: "admin@whatsflow.com" },
          activity: c.status === "COMPLETED" ? "Campaign Completed" : "Campaign Dispatched",
          resource: c.name || "Broadcast Campaign",
          category: "campaigns",
          status,
          ipAddress: "192.168.1.42",
          device: "Cloud Gateway / Meta API",
          details: {
            previousValue: `Status: ${c.status || "DRAFT"}`,
            newValue: `Processed ${sentCount}/${total} messages (${deliveryRate}% delivery rate)`,
            browser: "Meta WhatsApp API (v19.0)",
            os: "Linux Infrastructure",
            meta: JSON.stringify({ campaignId: c._id, sentCount, failedCount, deliveryRate: `${deliveryRate}%` }, null, 2),
          },
        });
      });
    }

    // 2. Process Contact Logs
    if (contactsResult.status === "fulfilled" && contactsResult.value?.contacts) {
      contactsResult.value.contacts.forEach((contact) => {
        const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || contact.phoneNumber;
        const createdAt = contact.createdAt || new Date().toISOString();

        logs.push({
          id: `log_cnt_${contact._id}`,
          timestamp: formatTimestamp(createdAt),
          user: { name: "Contact Manager", email: "contacts@whatsflow.com" },
          activity: "Contact Synchronized",
          resource: fullName,
          category: "contacts",
          status: "success",
          ipAddress: "192.168.1.42",
          device: "REST API Client",
          details: {
            previousValue: "Not in registry",
            newValue: `Registered number ${contact.phoneNumber} with tags: ${contact.tags?.join(", ") || "General"}`,
            browser: "Chrome (124.0)",
            os: "Windows 11 Pro",
            meta: JSON.stringify({ contactId: contact._id, phone: contact.phoneNumber }, null, 2),
          },
        });
      });
    }

    // 3. Process Template Logs
    if (templatesResult.status === "fulfilled" && templatesResult.value?.templates) {
      templatesResult.value.templates.forEach((tpl) => {
        const createdAt = tpl.createdAt || new Date().toISOString();
        const tplStatus = tpl.status || "APPROVED";

        logs.push({
          id: `log_tpl_${tpl._id}`,
          timestamp: formatTimestamp(createdAt),
          user: { name: "Template Reviewer", email: "meta-sync@whatsflow.com" },
          activity: "Template Status Update",
          resource: tpl.name,
          category: "templates",
          status: tplStatus === "REJECTED" ? "failed" : tplStatus === "PENDING" ? "pending" : "success",
          ipAddress: "10.0.4.15",
          device: "Meta Developer Console",
          details: {
            previousValue: "SUBMITTED",
            newValue: `Template category ${tpl.category} evaluated to ${tplStatus}`,
            browser: "Graph API (v19.0)",
            os: "Meta Cloud Platform",
            meta: JSON.stringify({ templateId: tpl._id, language: tpl.language, category: tpl.category }, null, 2),
          },
        });
      });
    }

    // 4. Process Automation Logs
    if (automationsResult.status === "fulfilled" && automationsResult.value) {
      automationsResult.value.forEach((auto) => {
        const createdAt = auto.createdAt || new Date().toISOString();

        logs.push({
          id: `log_auto_${auto._id}`,
          timestamp: formatTimestamp(createdAt),
          user: { name: "Automation Engine", email: "bot@whatsflow.com" },
          activity: auto.status === "ACTIVE" ? "Automation Activated" : "Automation Rule Updated",
          resource: auto.name || "Workflow Rule",
          category: "automations",
          status: auto.status === "ACTIVE" ? "success" : "warning",
          ipAddress: "10.0.4.15",
          device: "Workflow Daemon",
          details: {
            previousValue: "INACTIVE",
            newValue: `Trigger type '${auto.trigger}' rule configured and bound`,
            browser: "NodeJS Service",
            os: "Ubuntu (22.04 LTS)",
            meta: JSON.stringify({ automationId: auto._id, trigger: auto.trigger }, null, 2),
          },
        });
      });
    }

    // Sort logs chronologically descending (newest timestamp first)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return logs;
  }

  async getRecentActivities(): Promise<{
    recentCampaigns: CampaignActivity[];
    logEvents: LogEvent[];
  }> {
    try {
      const [campaignsRes, allLogs] = await Promise.all([
        campaignService.getAllCampaigns().catch(() => ({ campaigns: [] })),
        this.getAllLogs(),
      ]);

      const formattedCampaigns: CampaignActivity[] = (campaignsRes.campaigns || []).slice(0, 5).map((c) => {
        const deliveryRate = c.sentCount > 0 ? Math.round(((c.sentCount - (c.failedCount || 0)) / c.sentCount) * 100) : 0;
        let status: CampaignActivity["status"] = "completed";
        if (c.status === "PROCESSING") status = "sending";
        if (c.status === "FAILED") status = "failed";

        return {
          id: c._id,
          name: c.name,
          status,
          recipients: c.totalRecipients || 0,
          deliveryRate: `${deliveryRate}%`,
          time: formatRelativeTime(c.createdAt || c.updatedAt),
        };
      });

      const formattedLogEvents: LogEvent[] = allLogs.slice(0, 5).map((log) => {
        let type: LogEvent["type"] = "delivery";
        if (log.category === "templates") type = "template";
        if (log.category === "automations") type = "reply";
        if (log.category === "contacts") type = "read";

        return {
          id: log.id,
          type,
          description: `${log.activity}: ${log.resource}`,
          time: formatRelativeTime(log.timestamp),
          user: log.user.name,
        };
      });

      return {
        recentCampaigns: formattedCampaigns,
        logEvents: formattedLogEvents,
      };
    } catch {
      return {
        recentCampaigns: [],
        logEvents: [],
      };
    }
  }
}
