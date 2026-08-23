import { Send, Play, Link2, CheckCircle2, UserPlus, FileText, GitBranch } from "lucide-react"
import * as React from "react"

// Types
export interface StatItem {
  title: string
  value: string
  description: string
  change: string
  trend: "up" | "down" | "neutral"
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
}

export interface ChartTrendItem {
  date: string
  messages: number
}

export interface ChartCampaignPerformanceItem {
  name: string
  Sent: number
  Delivered: number
}

export interface CampaignActivity {
  id: string
  name: string
  status: "sending" | "completed" | "failed"
  recipients: number
  deliveryRate: string
  time: string
}

export interface LogEvent {
  id: string
  type: "delivery" | "read" | "reply" | "template"
  description: string
  time: string
  user: string
}

export interface ShortcutAction {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export interface UserSubscription {
  planName: string
  status: "active" | "trial" | "expired"
  used: number
  limit: number
  remaining: number
  percentage: number
  renewalDate: string
}

export interface UserContext {
  name: string
  fullName: string
  email: string
  avatarInitials: string
  role: string
}

// Data Exports
export const userContext: UserContext = {
  name: "John",
  fullName: "John Doe",
  email: "john.doe@whatsflow.com",
  avatarInitials: "JD",
  role: "Administrator"
}

export const statsData: StatItem[] = [
  {
    title: "Total Messages Sent",
    value: "34,512",
    description: "vs 30,684 last month",
    change: "+12.4%",
    trend: "up",
    icon: Send,
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/20"
  },
  {
    title: "Active Campaigns",
    value: "3",
    description: "2 scheduled in queue",
    change: "+1",
    trend: "up",
    icon: Play,
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-50 dark:bg-purple-950/30 border border-purple-100/50 dark:border-purple-900/20"
  },
  {
    title: "Connected Accounts",
    value: "4 / 5",
    description: "1 account needs pairing",
    change: "80%",
    trend: "neutral",
    icon: Link2,
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-950/30 border border-amber-100/50 dark:border-amber-900/20"
  },
  {
    title: "Message Delivery Rate",
    value: "98.7%",
    description: "vs 98.5% last week",
    change: "+0.2%",
    trend: "up",
    icon: CheckCircle2,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/20"
  }
]

export const trendData: ChartTrendItem[] = [
  { date: "Mon", messages: 3200 },
  { date: "Tue", messages: 4500 },
  { date: "Wed", messages: 4100 },
  { date: "Thu", messages: 5600 },
  { date: "Fri", messages: 6800 },
  { date: "Sat", messages: 4900 },
  { date: "Sun", messages: 5412 }
]

export const campaignPerformanceData: ChartCampaignPerformanceItem[] = [
  { name: "Welcome_v2", Sent: 1200, Delivered: 1185 },
  { name: "Promo_June", Sent: 3400, Delivered: 3342 },
  { name: "Feedback_Flow", Sent: 850, Delivered: 835 },
  { name: "Cart_Recovery", Sent: 1500, Delivered: 1472 },
  { name: "System_Alert", Sent: 2200, Delivered: 2196 }
]

export const recentCampaigns: CampaignActivity[] = [
  {
    id: "1",
    name: "Promo_June_Blast",
    status: "completed",
    recipients: 3400,
    deliveryRate: "98.3%",
    time: "2 hours ago"
  },
  {
    id: "2",
    name: "Cart_Recovery_Flow",
    status: "sending",
    recipients: 148,
    deliveryRate: "99.1%",
    time: "In progress"
  },
  {
    id: "3",
    name: "Feedback_Checkin",
    status: "completed",
    recipients: 850,
    deliveryRate: "98.2%",
    time: "Yesterday"
  },
  {
    id: "4",
    name: "Flash_Sale_Alert",
    status: "failed",
    recipients: 500,
    deliveryRate: "12.4%",
    time: "3 days ago"
  }
]

export const logEvents: LogEvent[] = [
  {
    id: "e1",
    type: "read",
    description: "read template 'Welcome_User_v2'",
    time: "2m ago",
    user: "+1 (555) 019-2834"
  },
  {
    id: "e2",
    type: "reply",
    description: "responded to Automation flow 'Sales Pitch'",
    time: "8m ago",
    user: "+44 20 7946 0912"
  },
  {
    id: "e3",
    type: "delivery",
    description: "delivered message 'Order Confirmation'",
    time: "15m ago",
    user: "+91 98765 43210"
  },
  {
    id: "e4",
    type: "template",
    description: "Template 'Coupon_15_off' approved by Meta",
    time: "1h ago",
    user: "System"
  },
  {
    id: "e5",
    type: "read",
    description: "read template 'Promo_June_Blast'",
    time: "1h ago",
    user: "+1 (555) 014-9988"
  }
]

export const shortcutActions: ShortcutAction[] = [
  {
    title: "Create Campaign",
    description: "Launch a message broadcast",
    href: "/campaigns",
    icon: Send,
    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20"
  },
  {
    title: "Add Contacts",
    description: "Import lists or single users",
    href: "/contacts",
    icon: UserPlus,
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
  },
  {
    title: "Create Template",
    description: "Design HSM approved texts",
    href: "/templates",
    icon: FileText,
    color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20"
  },
  {
    title: "Setup Automation",
    description: "Build chatbot workflow responder",
    href: "/automations",
    icon: GitBranch,
    color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20"
  }
]

export const subscriptionStatus: UserSubscription = {
  planName: "Growth Pro",
  status: "active",
  used: 34512,
  limit: 50000,
  remaining: 15488,
  percentage: 69,
  renewalDate: "June 25, 2026"
}

// Contacts-specific types & dataset
export interface ContactActivity {
  id: string
  type: "delivery" | "read" | "reply" | "optin" | "optout"
  description: string
  time: string
}

export interface Contact {
  id: string
  name: string
  phone: string
  group: string
  status: "active" | "inactive"
  lastActivity: string
  createdDate: string
  notes: string
  activityHistory: ContactActivity[]
}

export interface ContactsStatItem {
  title: string
  value: string
  description: string
  change?: string
  trend?: "up" | "down" | "neutral"
}

export const contactsStatsData: ContactsStatItem[] = [
  {
    title: "Total Contacts",
    value: "1,248",
    description: "All time growth",
    change: "+8.4%",
    trend: "up"
  },
  {
    title: "Active Contacts",
    value: "942",
    description: "Interacted in last 30d",
    change: "+12.1%",
    trend: "up"
  },
  {
    title: "Custom Groups",
    value: "8 Segments",
    description: "For target broadcasts",
  },
  {
    title: "New This Month",
    value: "84",
    description: "Added since June 1st",
    change: "+15.3%",
    trend: "up"
  }
]

export const initialContacts: Contact[] = [
  {
    id: "c1",
    name: "Alice Smith",
    phone: "+1 (555) 019-2834",
    group: "VIP Customers",
    status: "active",
    lastActivity: "2 hours ago",
    createdDate: "May 12, 2026",
    notes: "Prefers updates via PDF. Interested in seasonal discount codes.",
    activityHistory: [
      { id: "ca1", type: "read", description: "Opened template 'Promo_June_Blast'", time: "2 hours ago" },
      { id: "ca2", type: "delivery", description: "Received coupon template 'Discount_15'", time: "May 28, 2026" },
      { id: "ca3", type: "optin", description: "Subscribed via website form widget", time: "May 12, 2026" }
    ]
  },
  {
    id: "c2",
    name: "Bob Jones",
    phone: "+44 20 7946 0912",
    group: "Lead Segment",
    status: "active",
    lastActivity: "8 mins ago",
    createdDate: "June 02, 2026",
    notes: "Follow up regarding enterprise pricing tier query.",
    activityHistory: [
      { id: "ca4", type: "reply", description: "Responded 'Send pricing brochure'", time: "8 mins ago" },
      { id: "ca5", type: "delivery", description: "Received automated flow 'Welcome_Lead'", time: "June 02, 2026" }
    ]
  },
  {
    id: "c3",
    name: "Charlie Singh",
    phone: "+91 98765 43210",
    group: "Support Queue",
    status: "inactive",
    lastActivity: "1 day ago",
    createdDate: "April 18, 2026",
    notes: "Requested system alerts only. Opted out of marketing lists.",
    activityHistory: [
      { id: "ca6", type: "read", description: "Read order delivery update alert", time: "1 day ago" },
      { id: "ca7", type: "optout", description: "Opted out of marketing broadcasts", time: "May 10, 2026" }
    ]
  },
  {
    id: "c4",
    name: "Diana Prince",
    phone: "+1 (555) 014-9988",
    group: "VIP Customers",
    status: "active",
    lastActivity: "1 hour ago",
    createdDate: "May 25, 2026",
    notes: "Partner integration account manager. Primary point of contact.",
    activityHistory: [
      { id: "ca8", type: "reply", description: "Replied to custom template responder", time: "1 hour ago" },
      { id: "ca9", type: "delivery", description: "Delivered welcome message", time: "May 25, 2026" }
    ]
  },
  {
    id: "c5",
    name: "Ethan Hunt",
    phone: "+1 (555) 012-3456",
    group: "Lead Segment",
    status: "active",
    lastActivity: "3 days ago",
    createdDate: "June 04, 2026",
    notes: "Demo account scheduled for next Thursday. High priority lead.",
    activityHistory: [
      { id: "ca10", type: "read", description: "Read template 'Demo_Scheduled_Alert'", time: "3 days ago" },
      { id: "ca11", type: "optin", description: "Opted in through API registration page", time: "June 04, 2026" }
    ]
  },
  {
    id: "c6",
    name: "Fiona Gallagher",
    phone: "+353 1 496 0123",
    group: "Inactive List",
    status: "inactive",
    lastActivity: "Never",
    createdDate: "March 10, 2026",
    notes: "Number flag returned error. Need manual confirmation of phone format.",
    activityHistory: [
      { id: "ca12", type: "optin", description: "Initial signup request submitted", time: "March 10, 2026" }
    ]
  },
  {
    id: "c7",
    name: "George Cooper",
    phone: "+1 (555) 015-8811",
    group: "Support Queue",
    status: "active",
    lastActivity: "1 week ago",
    createdDate: "April 02, 2026",
    notes: "Regular support customer. Highly active on chat threads.",
    activityHistory: [
      { id: "ca13", type: "read", description: "Read support agent ticket notification", time: "1 week ago" }
    ]
  },
  {
    id: "c8",
    name: "Hannah Abbott",
    phone: "+44 1632 960012",
    group: "Newsletter Sub",
    status: "active",
    lastActivity: "5 hours ago",
    createdDate: "June 01, 2026",
    notes: "Subscribed via newsletter pop-up on landing page. Send weekly blogs.",
    activityHistory: [
      { id: "ca14", type: "delivery", description: "Received weekly recap automated post", time: "5 hours ago" }
    ]
  },
  {
    id: "c9",
    name: "Ian Malcolm",
    phone: "+1 (555) 017-7733",
    group: "Lead Segment",
    status: "inactive",
    lastActivity: "2 weeks ago",
    createdDate: "May 01, 2026",
    notes: "Disagreed on price points. Archive until seasonal discount campaigns.",
    activityHistory: [
      { id: "ca15", type: "optout", description: "Opted out of weekly newsletter list", time: "May 15, 2026" }
    ]
  },
  {
    id: "c10",
    name: "Julia Roberts",
    group: "VIP Customers",
    phone: "+1 (555) 019-0099",
    status: "active",
    lastActivity: "12 hours ago",
    createdDate: "May 10, 2026",
    notes: "Interested in early releases of SaaS plugins.",
    activityHistory: [
      { id: "ca16", type: "read", description: "Read plugin beta release template", time: "12 hours ago" }
    ]
  }
]

export const groupsList = [
  "VIP Customers",
  "Lead Segment",
  "Support Queue",
  "Newsletter Sub",
  "Inactive List"
]

// Campaigns-specific types & dataset
export interface CampaignActivityItem {
  id: string
  type: "created" | "approved" | "sending" | "completed" | "paused" | "scheduled"
  description: string
  time: string
}

export interface Campaign {
  id: string
  name: string
  status: "active" | "scheduled" | "completed" | "draft"
  audienceSize: number
  messagesSent: number
  deliveryRate: number // e.g. 98.4
  scheduledDate: string
  templateName: string
  activityTimeline: CampaignActivityItem[]
}

export interface MessageTemplate {
  id: string
  name: string
  category: "marketing" | "utility" | "alert"
  body: string
  variables: string[]
}

export interface CampaignsStatItem {
  title: string
  value: string
  description: string
  change?: string
  trend?: "up" | "down" | "neutral"
}

export const campaignsStatsData: CampaignsStatItem[] = [
  {
    title: "Total Campaigns",
    value: "24",
    description: "All time broadcasts",
    change: "+4 this month",
    trend: "up"
  },
  {
    title: "Active Campaigns",
    value: "1",
    description: "Currently broadcasting",
    change: "Live sending",
    trend: "up"
  },
  {
    title: "Scheduled Queue",
    value: "3 Pending",
    description: "Automations in queue",
    change: "Next in 4h",
    trend: "neutral"
  },
  {
    title: "Completed Broadcasts",
    value: "20",
    description: "Sent and delivered",
    change: "98.5% avg delivery",
    trend: "up"
  }
]

export const messageTemplates: MessageTemplate[] = [
  {
    id: "t1",
    name: "promo_summer_blast",
    category: "marketing",
    body: "Hello {{1}}! ☀️ Our Summer Sale is officially live. Get an exclusive 15% off all orders using code {{2}} at checkout! Valid till Sunday.",
    variables: ["Customer Name", "Promo Code"]
  },
  {
    id: "t2",
    name: "order_confirmation_alert",
    category: "utility",
    body: "Hi {{1}}, thank you for your order! Your purchase details for Order #{{2}} have been confirmed. We will message you once it ships.",
    variables: ["Customer Name", "Order Number"]
  },
  {
    id: "t3",
    name: "lead_followup_chat",
    category: "marketing",
    body: "Hello {{1}}! Thanks for checking out WhatsFlow. We noticed you queried our pricing tiers. Would you like to schedule a 10-minute demo on {{2}}?",
    variables: ["Lead Name", "Proposed Date"]
  },
  {
    id: "t4",
    name: "otp_verification_code",
    category: "alert",
    body: "WhatsFlow: Your security validation code is {{1}}. Please do not share this OTP with anyone. It expires in 5 minutes.",
    variables: ["Verification Code"]
  }
]

export const initialCampaigns: Campaign[] = [
  {
    id: "cmp1",
    name: "Promo June Blast",
    status: "active",
    audienceSize: 520,
    messagesSent: 412,
    deliveryRate: 98.2,
    scheduledDate: "Active Now",
    templateName: "promo_summer_blast",
    activityTimeline: [
      { id: "cmpl1", type: "sending", description: "Broadcasting messages to Lead Segment", time: "25 mins ago" },
      { id: "cmpl2", type: "approved", description: "WhatsApp Meta approved template configuration", time: "1 hour ago" },
      { id: "cmpl3", type: "created", description: "Campaign draft created by Admin", time: "2 hours ago" }
    ]
  },
  {
    id: "cmp2",
    name: "VIP Appreciation Broadcast",
    status: "scheduled",
    audienceSize: 120,
    messagesSent: 0,
    deliveryRate: 0,
    scheduledDate: "Jun 12, 2026 - 10:00 AM",
    templateName: "promo_summer_blast",
    activityTimeline: [
      { id: "cmpl4", type: "scheduled", description: "Broadcast scheduled for VIP Customers group", time: "May 28, 2026" },
      { id: "cmpl5", type: "created", description: "Campaign drafted and template set", time: "May 28, 2026" }
    ]
  },
  {
    id: "cmp3",
    name: "Order Confirmations Flow",
    status: "completed",
    audienceSize: 1240,
    messagesSent: 1240,
    deliveryRate: 99.4,
    scheduledDate: "Completed Jun 01",
    templateName: "order_confirmation_alert",
    activityTimeline: [
      { id: "cmpl6", type: "completed", description: "Completed delivery to 1,240 contacts", time: "Jun 01, 2026" },
      { id: "cmpl7", type: "sending", description: "Started broadcasting sequence", time: "May 31, 2026" },
      { id: "cmpl8", type: "approved", description: "Meta approval received", time: "May 30, 2026" }
    ]
  },
  {
    id: "cmp4",
    name: "Welcome Onboarding Sequence",
    status: "completed",
    audienceSize: 850,
    messagesSent: 850,
    deliveryRate: 98.7,
    scheduledDate: "Completed May 20",
    templateName: "lead_followup_chat",
    activityTimeline: [
      { id: "cmpl9", type: "completed", description: "Onboarding broadcast finished sending", time: "May 20, 2026" }
    ]
  },
  {
    id: "cmp5",
    name: "Inactive Users Re-engage",
    status: "draft",
    audienceSize: 430,
    messagesSent: 0,
    deliveryRate: 0,
    scheduledDate: "Not Scheduled",
    templateName: "promo_summer_blast",
    activityTimeline: [
      { id: "cmpl10", type: "created", description: "Draft created for Inactive List", time: "June 05, 2026" }
    ]
  }
]

// Message templates structures and mock data
export interface Template {
  id: string
  name: string
  category: "welcome" | "promo" | "order" | "reminder" | "followup" | "custom"
  status: "approved" | "pending" | "rejected" | "draft"
  body: string
  variables: string[]
  lastUsed: string
  usageCount: number
  language: string
}

export interface TemplateStatsItem {
  title: string
  value: string
  description: string
  change?: string
  trend?: "up" | "down" | "neutral"
}

export const templateStatsData: TemplateStatsItem[] = [
  {
    title: "Total Templates",
    value: "14",
    description: "SaaS message layouts",
    change: "+2 this week",
    trend: "up"
  },
  {
    title: "Approved by Meta",
    value: "10",
    description: "Ready to broadcast",
    change: "90.9% approval",
    trend: "up"
  },
  {
    title: "Pending Review",
    value: "3",
    description: "Under review by Meta",
    change: "Est. response <24h",
    trend: "neutral"
  },
  {
    title: "Most Used Template",
    value: "promo_summer_sale",
    description: "1,540 total sends",
    change: "44.7% share",
    trend: "up"
  }
]

export const templateCategories = [
  { id: "welcome", label: "Welcome Messages" },
  { id: "promo", label: "Promotions" },
  { id: "order", label: "Order Updates" },
  { id: "reminder", label: "Reminders" },
  { id: "followup", label: "Follow-ups" },
  { id: "custom", label: "Custom" }
]

export const initialTemplates: Template[] = [
  {
    id: "t_welcome_1",
    name: "welcome_onboarding",
    category: "welcome",
    status: "approved",
    body: "Hello {{1}}! Welcome to WhatsFlow. We are thrilled to have you. To get started with your automated integrations, check our guides here: {{2}}",
    variables: ["Customer Name", "Onboarding Link"],
    lastUsed: "2 hours ago",
    usageCount: 850,
    language: "English (US)"
  },
  {
    id: "t_promo_1",
    name: "promo_summer_sale",
    category: "promo",
    status: "approved",
    body: "Hi {{1}}! ☀️ Summer is here, and so is our biggest sale of the year. Grab a {{2}} discount on all templates using code {{3}} at checkout!",
    variables: ["Customer Name", "Discount Percentage", "Coupon Code"],
    lastUsed: "25 mins ago",
    usageCount: 1540,
    language: "English (US)"
  },
  {
    id: "t_order_1",
    name: "order_status_update",
    category: "order",
    status: "approved",
    body: "Dear {{1}}, order #{{2}} status has been updated to: {{3}}. Tracking link: {{4}}",
    variables: ["Customer Name", "Order Number", "Status", "Tracking URL"],
    lastUsed: "Yesterday",
    usageCount: 1240,
    language: "English (US)"
  },
  {
    id: "t_reminder_1",
    name: "appointment_reminder",
    category: "reminder",
    status: "approved",
    body: "Hello {{1}}, this is a friendly reminder of your upcoming WhatsApp demo scheduled for {{2}} at {{3}}.",
    variables: ["Client Name", "Date", "Time"],
    lastUsed: "3 days ago",
    usageCount: 420,
    language: "English (US)"
  },
  {
    id: "t_followup_1",
    name: "lead_follow_up",
    category: "followup",
    status: "pending",
    body: "Hi {{1}}! We noticed you signed up for WhatsFlow but haven't sent a broadcast campaign yet. Would you like to chat with one of our API specialists on {{2}}?",
    variables: ["Lead Name", "Proposed Date"],
    lastUsed: "Never",
    usageCount: 0,
    language: "English (US)"
  },
  {
    id: "t_custom_1",
    name: "feedback_survey_request",
    category: "custom",
    status: "approved",
    body: "Hey {{1}}, how did we do? Please take 1 minute to rate your automation setup: {{2}}",
    variables: ["Customer Name", "Survey Link"],
    lastUsed: "1 week ago",
    usageCount: 310,
    language: "English (US)"
  },
  {
    id: "t_custom_2",
    name: "alert_billing_issue",
    category: "custom",
    status: "rejected",
    body: "IMPORTANT: Hi {{1}}, your subscription payment has failed. Please update payment method to avoid template suspension: {{2}}",
    variables: ["Billing Name", "Account Link"],
    lastUsed: "Never",
    usageCount: 0,
    language: "English (US)"
  },
  {
    id: "t_promo_2",
    name: "draft_new_promo",
    category: "promo",
    status: "draft",
    body: "Hey {{1}}! Only a few hours left to claim your discount: {{2}}",
    variables: ["Name", "Discount Link"],
    lastUsed: "Never",
    usageCount: 0,
    language: "English (US)"
  }
]

// Automation management structures and mock data
export interface AutomationStep {
  id: string
  type: "trigger" | "action" | "wait" | "condition"
  title: string
  description: string
}

export interface Automation {
  id: string
  name: string
  trigger: string
  status: "active" | "paused" | "draft"
  lastExecution: string
  totalExecutions: number
  successRate: number
  steps: AutomationStep[]
}

export interface AutomationExecution {
  id: string
  automationName: string
  trigger: string
  executedAt: string
  status: "success" | "failed" | "processing"
  duration: string
}

export interface AutomationStatsItem {
  title: string
  value: string
  description: string
  change?: string
  trend?: "up" | "down" | "neutral"
}

export const automationStatsData: AutomationStatsItem[] = [
  {
    title: "Total Automations",
    value: "8",
    description: "Configured flows",
    change: "+1 this week",
    trend: "up"
  },
  {
    title: "Active Flows",
    value: "5",
    description: "Running in background",
    change: "62.5% rate",
    trend: "up"
  },
  {
    title: "Draft Rules",
    value: "3",
    description: "Unpublished flows",
    change: "Ready to deploy",
    trend: "neutral"
  },
  {
    title: "Executions Today",
    value: "420",
    description: "Triggered events",
    change: "+12.4% vs yesterday",
    trend: "up"
  }
]

export const initialAutomations: Automation[] = [
  {
    id: "auto_1",
    name: "Abandoned Cart Reminder",
    trigger: "New Order",
    status: "active",
    lastExecution: "15 mins ago",
    totalExecutions: 840,
    successRate: 98.2,
    steps: [
      { id: "s1", type: "trigger", title: "New Order Placed", description: "Triggered when checkout contains unpaid items" },
      { id: "s2", type: "wait", title: "Wait 15 Minutes", description: "Pause sequence to allow natural purchase completion" },
      { id: "s3", type: "action", title: "Send Template Message", description: "Send: promo_summer_sale to checkout contact" },
      { id: "s4", type: "action", title: "Assign Customer Tag", description: "Add tag: Abandoned Cart Followed" }
    ]
  },
  {
    id: "auto_2",
    name: "VIP Customer Welcome Flow",
    trigger: "New Contact",
    status: "active",
    lastExecution: "2 hours ago",
    totalExecutions: 310,
    successRate: 99.1,
    steps: [
      { id: "s5", type: "trigger", title: "New Contact Added", description: "Triggered when group matches 'VIP Customers'" },
      { id: "s6", type: "wait", title: "Wait 5 Minutes", description: "Short delay before onboarding contact" },
      { id: "s7", type: "action", title: "Send Onboarding Template", description: "Send: welcome_onboarding layout to phone" },
      { id: "s8", type: "wait", title: "Wait 24 Hours", description: "Buffer period before final check-in step" },
      { id: "s9", type: "action", title: "Notify Team Lead", description: "Trigger slack alert: VIP sequence finished" }
    ]
  },
  {
    id: "auto_3",
    name: "Keyword Help Chatbot",
    trigger: "Keyword Received",
    status: "active",
    lastExecution: "4 mins ago",
    totalExecutions: 1540,
    successRate: 97.5,
    steps: [
      { id: "s10", type: "trigger", title: "Keyword Matches 'help'", description: "Triggered when incoming message body matches help" },
      { id: "s11", type: "action", title: "Send WhatsApp Response", description: "Send auto support menu response bubble" },
      { id: "s12", type: "action", title: "Add Contact Note", description: "Note: Help menu trigger recorded" }
    ]
  },
  {
    id: "auto_4",
    name: "Birthday Promotion Broadcast",
    trigger: "Birthday",
    status: "paused",
    lastExecution: "Yesterday",
    totalExecutions: 120,
    successRate: 100.0,
    steps: [
      { id: "s13", type: "trigger", title: "Birthday Calendar Match", description: "Triggered on contact birthday date check" },
      { id: "s14", type: "action", title: "Send Template Message", description: "Send: promo_summer_sale coupon message" },
      { id: "s15", type: "wait", title: "Wait 3 Days", description: "Follow up delay trigger" },
      { id: "s16", type: "action", title: "Send WhatsApp Offer Reminder", description: "Send discount code expiration alert" }
    ]
  },
  {
    id: "auto_5",
    name: "Appointment Scheduler Followup",
    trigger: "Appointment Reminder",
    status: "draft",
    lastExecution: "Never",
    totalExecutions: 0,
    successRate: 0,
    steps: [
      { id: "s17", type: "trigger", title: "Appointment Calendar Event", description: "Triggered 2 hours before scheduled slot" },
      { id: "s18", type: "action", title: "Send Template Message", description: "Send: appointment_reminder template confirmation" }
    ]
  }
]

export const initialExecutions: AutomationExecution[] = [
  {
    id: "ex_1",
    automationName: "Abandoned Cart Reminder",
    trigger: "New Order",
    executedAt: "2026-06-28 16:10:12",
    status: "success",
    duration: "15m 12s"
  },
  {
    id: "ex_2",
    automationName: "Keyword Help Chatbot",
    trigger: "Keyword Received",
    executedAt: "2026-06-28 16:08:44",
    status: "success",
    duration: "1.2s"
  },
  {
    id: "ex_3",
    automationName: "VIP Customer Welcome Flow",
    trigger: "New Contact",
    executedAt: "2026-06-28 14:15:30",
    status: "success",
    duration: "24h 5m"
  },
  {
    id: "ex_4",
    automationName: "Abandoned Cart Reminder",
    trigger: "New Order",
    executedAt: "2026-06-28 13:40:22",
    status: "failed",
    duration: "12s"
  },
  {
    id: "ex_5",
    automationName: "Keyword Help Chatbot",
    trigger: "Keyword Received",
    executedAt: "2026-06-28 13:02:10",
    status: "success",
    duration: "1.1s"
  },
  {
    id: "ex_6",
    automationName: "Birthday Promotion Broadcast",
    trigger: "Birthday",
    executedAt: "2026-06-27 09:00:00",
    status: "success",
    duration: "3d 20s"
  },
  {
    id: "ex_7",
    automationName: "Abandoned Cart Reminder",
    trigger: "New Order",
    executedAt: "2026-06-28 16:20:12",
    status: "processing",
    duration: "10m 0s"
  }
]

// Analytics management structures and mock data
export interface AnalyticsStatsItem {
  title: string
  value: string
  description: string
  change: string
  trend: "up" | "down" | "neutral"
}

export interface CampaignPerformanceItem {
  name: string
  audience: number
  sent: number
  delivered: number
  failed: number
  replies: number
  ctr: number
  status: "completed" | "active" | "scheduled"
}

export interface TemplatePerformanceItem {
  name: string
  usageCount: number
  deliveryRate: number
  replyRate: number
}

export interface GroupPerformanceItem {
  name: string
  contacts: number
  messagesSent: number
  engagement: number
}

export interface ActivityTimelineItem {
  id: string
  timestamp: string
  type: "broadcast" | "template" | "contact" | "automation"
  message: string
}

export interface ChartDataItem {
  label: string
  value: number
  secondaryValue?: number
}

export const analyticsStats: AnalyticsStatsItem[] = [
  {
    title: "Total Messages Sent",
    value: "28,450",
    description: "All campaigns & triggers",
    change: "+14.8% vs last month",
    trend: "up"
  },
  {
    title: "Delivered Messages",
    value: "27,910",
    description: "Meta API confirmed receipt",
    change: "98.1% delivery rate",
    trend: "up"
  },
  {
    title: "Failed Messages",
    value: "540",
    description: "Invalid numbers or blocked",
    change: "-2.3% rate decrease",
    trend: "down"
  },
  {
    title: "Delivery Success Rate",
    value: "98.1%",
    description: "Meta API benchmark average",
    change: "+0.4% improvement",
    trend: "up"
  },
  {
    title: "Reply Conversation Rate",
    value: "34.2%",
    description: "Direct user response rate",
    change: "+5.1% engagement lift",
    trend: "up"
  },
  {
    title: "Active Contacts",
    value: "1,248",
    description: "Messaged in last 30 days",
    change: "+8.4% database growth",
    trend: "up"
  }
]

export const analyticsCampaignsData: CampaignPerformanceItem[] = [
  {
    name: "Summer Coupon Broadcast",
    audience: 450,
    sent: 450,
    delivered: 442,
    failed: 8,
    replies: 180,
    ctr: 40.0,
    status: "completed"
  },
  {
    name: "VIP Loyalty Rewards Promo",
    audience: 310,
    sent: 310,
    delivered: 308,
    failed: 2,
    replies: 145,
    ctr: 46.7,
    status: "completed"
  },
  {
    name: "Abandoned Cart Reminder",
    audience: 840,
    sent: 840,
    delivered: 825,
    failed: 15,
    replies: 285,
    ctr: 33.9,
    status: "active"
  },
  {
    name: "Feedback Survey Request",
    audience: 120,
    sent: 120,
    delivered: 118,
    failed: 2,
    replies: 42,
    ctr: 35.0,
    status: "completed"
  },
  {
    name: "Weekly Product Newsletter",
    audience: 1500,
    sent: 0,
    delivered: 0,
    failed: 0,
    replies: 0,
    ctr: 0.0,
    status: "scheduled"
  }
]

export const templatePerformanceData: TemplatePerformanceItem[] = [
  { name: "promo_summer_sale", usageCount: 1540, deliveryRate: 98.2, replyRate: 38.4 },
  { name: "order_status_update", usageCount: 1240, deliveryRate: 99.1, replyRate: 12.5 },
  { name: "welcome_onboarding", usageCount: 850, deliveryRate: 98.8, replyRate: 44.2 },
  { name: "appointment_reminder", usageCount: 420, deliveryRate: 99.5, replyRate: 15.0 },
  { name: "feedback_survey_request", usageCount: 310, deliveryRate: 98.0, replyRate: 22.8 }
]

export const groupPerformanceData: GroupPerformanceItem[] = [
  { name: "VIP Customers", contacts: 310, messagesSent: 2840, engagement: 68.4 },
  { name: "Leads Segment", contacts: 540, messagesSent: 1540, engagement: 31.2 },
  { name: "Active Subscribers", contacts: 248, messagesSent: 1240, engagement: 45.0 },
  { name: "Inactive Shoppers", contacts: 150, messagesSent: 850, engagement: 18.5 }
]

export const activityTimelineData: ActivityTimelineItem[] = [
  { id: "act_1", timestamp: "5 mins ago", type: "automation", message: "Abandoned Cart Reminder triggered for +1 555-0199" },
  { id: "act_2", timestamp: "12 mins ago", type: "broadcast", message: "Summer Coupon Broadcast completed (450 contacts)" },
  { id: "act_3", timestamp: "1 hour ago", type: "template", message: "Template draft_new_promo approved by Meta compliance checks" },
  { id: "act_4", timestamp: "2 hours ago", type: "contact", message: "Imported 120 new contacts into Leads Segment" },
  { id: "act_5", timestamp: "1 day ago", type: "automation", message: "Keyword Help Chatbot triggered 42 times today" }
]

// Data for custom SVG charts
export const sentMessagesChartData: ChartDataItem[] = [
  { label: "Mon", value: 1200 },
  { label: "Tue", value: 1850 },
  { label: "Wed", value: 1500 },
  { label: "Thu", value: 2400 },
  { label: "Fri", value: 2100 },
  { label: "Sat", value: 950 },
  { label: "Sun", value: 1400 }
]

export const deliveryFailedChartData: ChartDataItem[] = [
  { label: "Mon", value: 1180, secondaryValue: 20 },
  { label: "Tue", value: 1820, secondaryValue: 30 },
  { label: "Wed", value: 1485, secondaryValue: 15 },
  { label: "Thu", value: 2360, secondaryValue: 40 },
  { label: "Fri", value: 2065, secondaryValue: 35 },
  { label: "Sat", value: 940, secondaryValue: 10 },
  { label: "Sun", value: 1380, secondaryValue: 20 }
]

export const contactGrowthChartData: ChartDataItem[] = [
  { label: "Week 1", value: 800 },
  { label: "Week 2", value: 950 },
  { label: "Week 3", value: 1120 },
  { label: "Week 4", value: 1248 }
]

export const categoryDistributionData: ChartDataItem[] = [
  { label: "Promotions", value: 45 },
  { label: "Utility / Updates", value: 28 },
  { label: "Welcome / Onboarding", value: 17 },
  { label: "Custom Chatbot", value: 10 }
]

// Billing & Subscription Interfaces
export interface PaymentMethodItem {
  id: string
  brand: "Visa" | "MasterCard" | "AmericanExpress"
  last4: string
  expiry: string
  isDefault: boolean
}

export interface InvoiceItem {
  id: string
  date: string
  amount: number
  status: "paid" | "failed" | "processing"
}

export interface PricingPlanItem {
  name: string
  price: string
  billingCycle: string
  description: string
  features: string[]
  isPopular?: boolean
  badge?: string
}

export interface FaqItem {
  question: string
  answer: string
}

// Billing Mock Data
export const paymentMethodsData: PaymentMethodItem[] = [
  {
    id: "pm_1",
    brand: "Visa",
    last4: "4242",
    expiry: "12/28",
    isDefault: true
  },
  {
    id: "pm_2",
    brand: "MasterCard",
    last4: "8899",
    expiry: "06/27",
    isDefault: false
  }
]

export const invoicesData: InvoiceItem[] = [
  {
    id: "INV-2026-003",
    date: "Jun 25, 2026",
    amount: 79.00,
    status: "paid"
  },
  {
    id: "INV-2026-002",
    date: "May 25, 2026",
    amount: 79.00,
    status: "paid"
  },
  {
    id: "INV-2026-001",
    date: "Apr 25, 2026",
    amount: 29.00,
    status: "paid"
  }
]

export const pricingPlansData: PricingPlanItem[] = [
  {
    name: "Starter",
    price: "$29",
    billingCycle: "per month",
    description: "Perfect for growing startups and personal branding workflows.",
    features: [
      "10,000 Messages / month",
      "2 Connected WhatsApp Accounts",
      "1,000 Contacts limit",
      "Basic delivery analytics",
      "Standard template creator",
      "Email support within 24h"
    ]
  },
  {
    name: "Professional",
    price: "$79",
    billingCycle: "per month",
    description: "Advanced automation, templates, and high capacity sending queues.",
    features: [
      "50,000 Messages / month",
      "5 Connected WhatsApp Accounts",
      "2,500 Contacts limit",
      "Advanced read/reply analytics",
      "Visual workflow automation builder",
      "Meta API template variable mapping",
      "Priority priority chat support"
    ],
    isPopular: true,
    badge: "Popular Plan"
  },
  {
    name: "Enterprise",
    price: "Custom",
    billingCycle: "custom contact",
    description: "High volume sending, multi-agent inbox, dedicated infrastructure.",
    features: [
      "Unlimited Messages / month",
      "Unlimited Connected Accounts",
      "Unlimited Contacts database",
      "Custom analytics & webhook hooks",
      "Direct Meta API custom routes",
      "Dedicated account engineer SLA",
      "24/7 Phone & support channels"
    ],
    badge: "Contact Sales"
  }
]

export const billingFaqsData: FaqItem[] = [
  {
    question: "How do conversation credits work with Meta API?",
    answer: "Meta charges per 24-hour conversation session. We include 1,000 free service conversation credits every month. Additional consumption is billed directly to your saved payment card or linked Meta developer profile."
  },
  {
    question: "Can I upgrade or downgrade my plan at any time?",
    answer: "Yes, you can upgrade instantly from your settings dashboard. Downgrades or plan cancellations take effect at the end of your current active billing cycle."
  },
  {
    question: "Do you offer discounts for annual commitments?",
    answer: "Yes! If you switch your subscription renewal to annual billing from the payment summary workspace, you will save 20% on your base rate."
  },
  {
    question: "What payment methods do you support?",
    answer: "We support all major global debit and credit cards, including Visa, MasterCard, and American Express, processed securely via Stripe."
  }
]

// Settings Types
export interface ProfileSettings {
  name: string
  email: string
  phone: string
  avatarUrl: string
}

export interface CompanySettings {
  companyName: string
  businessEmail: string
  website: string
  timeZone: string
  country: string
}

export interface WhatsAppSettings {
  connectedNumber: string
  businessDisplayName: string
  connectionStatus: "connected" | "disconnected" | "connecting"
}

export interface NotificationPreferences {
  emailNotifications: boolean
  whatsappNotifications: boolean
  campaignAlerts: boolean
  systemUpdates: boolean
}

export interface ActiveSessionItem {
  id: string
  device: string
  location: string
  ip: string
  activeNow: boolean
}

export interface AppearancePreferences {
  theme: "light" | "dark" | "system"
  sidebarPosition: "left" | "right"
  compactMode: boolean
}

export interface RegionalSettings {
  language: string
  dateFormat: string
  timeFormat: "12h" | "24h"
  currency: string
}

export interface ApiWebhookSettings {
  apiKey: string
  webhookUrl: string
}

// Initial Settings Mock Data
export const initialProfileSettings: ProfileSettings = {
  name: "John Doe",
  email: "john.doe@whatsflow.com",
  phone: "+1 (555) 019-2834",
  avatarUrl: ""
}

export const initialCompanySettings: CompanySettings = {
  companyName: "WhatsFlow Solutions Inc.",
  businessEmail: "billing@whatsflow.com",
  website: "https://whatsflow.com",
  timeZone: "UTC-5 (Eastern Time)",
  country: "United States"
}

export const initialWhatsAppSettings: WhatsAppSettings = {
  connectedNumber: "+1 (555) 019-9988",
  businessDisplayName: "WhatsFlow Notifications",
  connectionStatus: "connected"
}

export const initialNotificationPreferences: NotificationPreferences = {
  emailNotifications: true,
  whatsappNotifications: true,
  campaignAlerts: true,
  systemUpdates: false
}

export const mockActiveSessions: ActiveSessionItem[] = [
  {
    id: "s1",
    device: "Chrome on macOS (14.2)",
    location: "New York, USA",
    ip: "192.168.1.42",
    activeNow: true
  },
  {
    id: "s2",
    device: "Safari on iPhone 15 Pro",
    location: "New York, USA",
    ip: "192.168.1.189",
    activeNow: false
  }
]

export const initialAppearancePreferences: AppearancePreferences = {
  theme: "light",
  sidebarPosition: "left",
  compactMode: false
}

export const initialRegionalSettings: RegionalSettings = {
  language: "en-US",
  dateFormat: "YYYY-MM-DD",
  timeFormat: "12h",
  currency: "USD ($)"
}

export const initialApiWebhookSettings: ApiWebhookSettings = {
  apiKey: "wf_live_55a123f8e9cd40939a2be10c9d92e8",
  webhookUrl: "https://api.whatsflow.com/v1/webhook"
}

// Notification Center interfaces
export interface NotificationCenterItem {
  id: string
  title: string
  description: string
  time: string
  category: "campaigns" | "automations" | "billing" | "security" | "system"
  read: boolean
  severity: "info" | "success" | "warning" | "error"
}

export const initialNotificationsCenterData: NotificationCenterItem[] = [
  {
    id: "n_1",
    title: "Campaign Concluded Successfully",
    description: "Promo_June_Blast completed transmission to all 3,400 list contacts. 98.3% delivery success rate.",
    time: "5m ago",
    category: "campaigns",
    read: false,
    severity: "success"
  },
  {
    id: "n_2",
    title: "Webhook Delivery Retries Exhausted",
    description: "Failure returning webhook callback payload response to endpoint: https://api.whatsflow.com/v1/webhook (status: 504 Timeout).",
    time: "25m ago",
    category: "system",
    read: false,
    severity: "error"
  },
  {
    id: "n_3",
    title: "New Host Authorized login",
    description: "An administrator logged into this workspace using Chrome on macOS (14.2) from IP: 192.168.1.42.",
    time: "2h ago",
    category: "security",
    read: true,
    severity: "warning"
  },
  {
    id: "n_4",
    title: "Invoice INV-2026-003 Discharged",
    description: "Your monthly plan base rate and API credits charge of $91.50 was billed successfully to Visa ending in 4242.",
    time: "1d ago",
    category: "billing",
    read: true,
    severity: "success"
  },
  {
    id: "n_5",
    title: "Automation recovery triggered",
    description: "Flow 'Cart_Recovery_Flow' triggered response sequences for contact +1 (555) 019-2834.",
    time: "2d ago",
    category: "automations",
    read: false,
    severity: "info"
  },
  {
    id: "n_6",
    title: "Meta Template Vetted & Approved",
    description: "Meta reviewers approved template profile 'Summer_Coupon_Broadcast' for marketing activities.",
    time: "3d ago",
    category: "campaigns",
    read: true,
    severity: "success"
  },
  {
    id: "n_7",
    title: "Account Limit Warning cap",
    description: "Connected WhatsApp business number channels have reached 80% capacity checks (4 of 5 active lines).",
    time: "4d ago",
    category: "system",
    read: true,
    severity: "warning"
  },
  {
    id: "n_8",
    title: "Automation threshold pause",
    description: "Visual flows 'Welcome_User' has been temporarily paused due to broken template link references.",
    time: "5d ago",
    category: "automations",
    read: false,
    severity: "error"
  }
]

// Integrations Interfaces
export interface IntegrationItem {
  id: string
  name: string
  description: string
  category: "messaging" | "crm" | "ecommerce" | "payments" | "productivity" | "marketing"
  status: "connected" | "disconnected" | "connecting"
  featured: boolean
}

export interface IntegrationActivity {
  id: string
  integrationName: string
  action: string
  time: string
}

export const initialIntegrationsData: IntegrationItem[] = [
  {
    id: "int_whatsapp",
    name: "WhatsApp Business Platform",
    description: "Send templates, retrieve message statuses, and coordinate automations directly via Meta Cloud API.",
    category: "messaging",
    status: "connected",
    featured: true
  },
  {
    id: "int_meta",
    name: "Meta Suite Developer Console",
    description: "Manage display identities, register outbound phone numbers, and coordinate templates review processes.",
    category: "messaging",
    status: "connected",
    featured: true
  },
  {
    id: "int_gsheets",
    name: "Google Sheets",
    description: "Export campaign read outcomes, sync contact registries, and log real-time replies instantly.",
    category: "productivity",
    status: "connected",
    featured: true
  },
  {
    id: "int_gmail",
    name: "Gmail Outbound Service",
    description: "Forward system status notifications, invoice summaries, and delivery failure sheets.",
    category: "productivity",
    status: "disconnected",
    featured: true
  },
  {
    id: "int_slack",
    name: "Slack Notify Workspace",
    description: "Forward alerts and campaign conclusion summaries to Slack channels for administrative visibility.",
    category: "productivity",
    status: "disconnected",
    featured: false
  },
  {
    id: "int_zapier",
    name: "Zapier Automations",
    description: "Connect WhatsApp messaging flows to 5,000+ software services using custom triggers and zaps.",
    category: "productivity",
    status: "disconnected",
    featured: false
  },
  {
    id: "int_shopify",
    name: "Shopify Storefront Sync",
    description: "Automate cart recovery, dispatch order invoices, and deliver tracking codes via WhatsApp messages.",
    category: "ecommerce",
    status: "disconnected",
    featured: false
  },
  {
    id: "int_woocommerce",
    name: "WooCommerce Plugins",
    description: "Trigger WhatsApp templates on new orders, refunds, and shipment updates.",
    category: "ecommerce",
    status: "disconnected",
    featured: false
  },
  {
    id: "int_hubspot",
    name: "HubSpot CRM Systems",
    description: "Sync conversational timeline threads with client cards and segment contact lists.",
    category: "crm",
    status: "disconnected",
    featured: false
  },
  {
    id: "int_salesforce",
    name: "Salesforce Cloud Suite",
    description: "Manage lead sequences and pipeline status changes from WhatsApp reply logs.",
    category: "crm",
    status: "disconnected",
    featured: false
  },
  {
    id: "int_stripe",
    name: "Stripe Payment Gateway",
    description: "Dispatch WhatsApp payment links and credit card invoice billing receipts.",
    category: "payments",
    status: "connected",
    featured: false
  },
  {
    id: "int_razorpay",
    name: "Razorpay Billing Gateway",
    description: "Coordinate subscription payment reminders and confirmation sheets.",
    category: "payments",
    status: "disconnected",
    featured: false
  }
]

export const mockIntegrationActivityData: IntegrationActivity[] = [
  {
    id: "act_1",
    integrationName: "Stripe Payment Gateway",
    action: "Authorized credential keys",
    time: "2 hours ago"
  },
  {
    id: "act_2",
    integrationName: "Google Sheets",
    action: "Synchronized contact spreadsheet list",
    time: "Yesterday"
  },
  {
    id: "act_3",
    integrationName: "WhatsApp Business Platform",
    action: "Reconnected API Cloud gateway session",
    time: "3 days ago"
  },
  {
    id: "act_4",
    integrationName: "Shopify Storefront Sync",
    action: "De-authorized active API sessions",
    time: "5 days ago"
  }
]

// Activity Logs Interfaces
export interface ActivityLogItem {
  id: string
  timestamp: string
  user: {
    name: string
    email: string
  }
  activity: string
  resource: string
  category: "authentication" | "campaigns" | "contacts" | "templates" | "automations" | "analytics" | "billing" | "integrations" | "settings" | "security" | "system"
  status: "success" | "failed" | "pending" | "warning"
  ipAddress: string
  device: string
  details: {
    previousValue?: string
    newValue?: string
    browser: string
    os: string
    meta?: string
  }
}

export const initialActivityLogsData: ActivityLogItem[] = [
  {
    id: "log_01",
    timestamp: "2026-06-30 21:44:12",
    user: { name: "Admin User", email: "admin@whatsflow.com" },
    activity: "Campaign Sent",
    resource: "Summer Promo Blast v3",
    category: "campaigns",
    status: "success",
    ipAddress: "192.168.1.42",
    device: "Chrome / macOS",
    details: {
      previousValue: "Draft status",
      newValue: "Completed sending to 1,248 contacts",
      browser: "Chrome (124.0.0)",
      os: "macOS Sonoma (14.2)",
      meta: JSON.stringify({ campaignId: "camp_981", deliverySuccess: "98.3%" }, null, 2)
    }
  },
  {
    id: "log_02",
    timestamp: "2026-06-30 20:30:15",
    user: { name: "Admin User", email: "admin@whatsflow.com" },
    activity: "Integration Connected",
    resource: "Stripe Payment Gateway",
    category: "integrations",
    status: "success",
    ipAddress: "192.168.1.42",
    device: "Chrome / macOS",
    details: {
      previousValue: "Disconnected",
      newValue: "Connected (Live mode)",
      browser: "Chrome (124.0.0)",
      os: "macOS Sonoma (14.2)",
      meta: JSON.stringify({ integrationId: "int_stripe", webhookAttached: true }, null, 2)
    }
  },
  {
    id: "log_03",
    timestamp: "2026-06-30 19:15:00",
    user: { name: "System Daemon", email: "system@whatsflow.com" },
    activity: "Automation Failed",
    resource: "Cart Recovery Automation",
    category: "automations",
    status: "failed",
    ipAddress: "10.0.4.15",
    device: "NodeJS Server / Linux",
    details: {
      previousValue: "Trigger active",
      newValue: "Failed dispatching message to +1 (555) 019-2834 (Status: Meta API rate limit exceeded)",
      browser: "Axios (1.6.2)",
      os: "Ubuntu (22.04 LTS)",
      meta: JSON.stringify({ automationId: "auto_502", errorCode: 100, errorType: "RateLimit" }, null, 2)
    }
  },
  {
    id: "log_04",
    timestamp: "2026-06-30 18:05:22",
    user: { name: "Admin User", email: "admin@whatsflow.com" },
    activity: "Template Created",
    resource: "Summer_Coupon_Broadcast",
    category: "templates",
    status: "success",
    ipAddress: "192.168.1.42",
    device: "Chrome / macOS",
    details: {
      previousValue: "None",
      newValue: "Template drafted and submitted to Meta review",
      browser: "Chrome (124.0.0)",
      os: "macOS Sonoma (14.2)",
      meta: JSON.stringify({ language: "en-US", variables: ["username", "coupon_code"] }, null, 2)
    }
  },
  {
    id: "log_05",
    timestamp: "2026-06-30 17:50:11",
    user: { name: "Jane Doe", email: "jane@whatsflow.com" },
    activity: "Contact Deleted",
    resource: "+1 (555) 012-9843",
    category: "contacts",
    status: "warning",
    ipAddress: "172.56.21.99",
    device: "Safari / iOS",
    details: {
      previousValue: "Active contact",
      newValue: "Permanently deleted contact",
      browser: "Safari Mobile (17.2)",
      os: "iOS (17.2)",
      meta: JSON.stringify({ contactId: "con_201", triggerDeletedLogs: true }, null, 2)
    }
  },
  {
    id: "log_06",
    timestamp: "2026-06-30 16:12:45",
    user: { name: "Admin User", email: "admin@whatsflow.com" },
    activity: "API Key Generated",
    resource: "Developer Admin Token",
    category: "security",
    status: "success",
    ipAddress: "192.168.1.42",
    device: "Chrome / macOS",
    details: {
      previousValue: "None",
      newValue: "Issued wf_live_55a123f... key token",
      browser: "Chrome (124.0.0)",
      os: "macOS Sonoma (14.2)",
      meta: JSON.stringify({ scopes: ["write:messages", "read:contacts"] }, null, 2)
    }
  },
  {
    id: "log_07",
    timestamp: "2026-06-30 15:40:02",
    user: { name: "Admin User", email: "admin@whatsflow.com" },
    activity: "Settings Updated",
    resource: "Two-Factor Auth Configuration",
    category: "settings",
    status: "success",
    ipAddress: "192.168.1.42",
    device: "Firefox / Windows",
    details: {
      previousValue: "2FA Disabled",
      newValue: "2FA Enabled via Authenticator app",
      browser: "Firefox (125.0)",
      os: "Windows 11 Home",
      meta: JSON.stringify({ method: "TOTP", timestamp: 1782805202 }, null, 2)
    }
  },
  {
    id: "log_08",
    timestamp: "2026-06-30 14:22:18",
    user: { name: "Admin User", email: "admin@whatsflow.com" },
    activity: "Subscription Updated",
    resource: "Professional Plan Tier",
    category: "billing",
    status: "success",
    ipAddress: "192.168.1.42",
    device: "Chrome / macOS",
    details: {
      previousValue: "Starter Tier ($29/mo)",
      newValue: "Professional Tier ($79/mo)",
      browser: "Chrome (124.0.0)",
      os: "macOS Sonoma (14.2)",
      meta: JSON.stringify({ pricingId: "plan_pro", monthlyBilling: true }, null, 2)
    }
  },
  {
    id: "log_09",
    timestamp: "2026-06-30 12:00:00",
    user: { name: "Security Watchdog", email: "security@whatsflow.com" },
    activity: "Security Event",
    resource: "Multiple Login Failures",
    category: "security",
    status: "warning",
    ipAddress: "203.0.113.111",
    device: "Edge / Windows",
    details: {
      previousValue: "Locked",
      newValue: "IP 203.0.113.111 blocked for 15 minutes due to 5 consecutive auth errors",
      browser: "Edge (123.0)",
      os: "Windows 11 Pro",
      meta: JSON.stringify({ consecutiveFailures: 5, userTarget: "admin@whatsflow.com" }, null, 2)
    }
  },
  {
    id: "log_10",
    timestamp: "2026-06-30 11:30:15",
    user: { name: "Jane Doe", email: "jane@whatsflow.com" },
    activity: "Login",
    resource: "Client session",
    category: "authentication",
    status: "success",
    ipAddress: "172.56.21.99",
    device: "Safari / iOS",
    details: {
      previousValue: "Offline",
      newValue: "Online session established",
      browser: "Safari Mobile (17.2)",
      os: "iOS (17.2)",
      meta: JSON.stringify({ sessionDurationLimit: 86400 }, null, 2)
    }
  }
]









