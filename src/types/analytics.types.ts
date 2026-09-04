export interface AnalyticsStatItem {
  title: string;
  value: string;
  numericValue: number;
  description: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface CategoryDistributionItem {
  label: string;
  value: number;
  count?: number;
}

export interface AnalyticsChartsData {
  sentMessagesChartData: ChartDataPoint[];
  deliveryFailedChartData: ChartDataPoint[];
  contactGrowthChartData: ChartDataPoint[];
  categoryDistributionData: CategoryDistributionItem[];
}

export interface AnalyticsCampaignRow {
  id: string;
  name: string;
  status: string;
  audience: number;
  sent: number;
  delivered: number;
  failed: number;
  replies: number;
  ctr: number;
}

export interface TopTemplateItem {
  name: string;
  usageCount: number;
  deliveryRate: number;
  replyRate: number;
}

export interface TopGroupItem {
  name: string;
  contacts: number;
  messagesSent: number;
  engagement: number;
}

export interface ActivityTimelineItem {
  id: string;
  timestamp: string;
  message: string;
  type: "broadcast" | "template" | "contact" | "system";
}

export interface AnalyticsData {
  stats: AnalyticsStatItem[];
  charts: AnalyticsChartsData;
  campaignsTableData: AnalyticsCampaignRow[];
  topTemplatesData: TopTemplateItem[];
  topGroupsData: TopGroupItem[];
  activityTimelineData: ActivityTimelineItem[];
}

export interface AnalyticsApiResponse {
  success: boolean;
  message: string;
  data: AnalyticsData;
}
