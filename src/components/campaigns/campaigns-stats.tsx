"use client";

import * as React from "react";
import { Megaphone, Play, Clock, CheckCircle2 } from "lucide-react";
import { StatsCard, StatsCardProps } from "../shared/stats-card";
import { useCampaigns } from "@/hooks/use-campaigns";

export function CampaignsStats() {
  const { data: response } = useCampaigns({ limit: 100 });
  const campaigns = response?.campaigns || [];
  const total = response?.pagination?.total ?? campaigns.length;

  const activeCount = campaigns.filter((c) => c.status === "PROCESSING").length;
  const scheduledCount = campaigns.filter((c) => c.status === "SCHEDULED").length;
  const completedCount = campaigns.filter((c) => c.status === "COMPLETED").length;

  const totalSent = campaigns.reduce((acc, c) => acc + (c.sentCount || 0), 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + (c.deliveredCount || 0), 0);
  const avgDeliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;

  const statsData = [
    {
      title: "Total Campaigns",
      value: total.toLocaleString(),
      description: "Total broadcasts created",
      change: total > 0 ? "+100%" : "0%",
      trend: "up" as const,
    },
    {
      title: "Active Campaigns",
      value: activeCount.toLocaleString(),
      description: "Currently in processing status",
      change: activeCount > 0 ? "Live" : "Idle",
      trend: activeCount > 0 ? ("up" as const) : ("neutral" as const),
    },
    {
      title: "Scheduled Queue",
      value: scheduledCount.toLocaleString(),
      description: "Pending future dispatches",
      change: scheduledCount > 0 ? "Queued" : "None",
      trend: "neutral" as const,
    },
    {
      title: "Completed Broadcasts",
      value: completedCount > 0 ? completedCount.toLocaleString() : `${avgDeliveryRate}% Rate`,
      description: "Successfully dispatched broadcasts",
      change: completedCount > 0 ? `${avgDeliveryRate}% delivered` : "Ready",
      trend: "up" as const,
    },
  ];

  const getIcon = (title: string) => {
    switch (title) {
      case "Total Campaigns":
        return <Megaphone className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case "Active Campaigns":
        return <Play className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case "Scheduled Queue":
        return <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const getIconBg = (title: string) => {
    switch (title) {
      case "Total Campaigns":
        return "bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/20";
      case "Active Campaigns":
        return "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/20";
      case "Scheduled Queue":
        return "bg-purple-50 dark:bg-purple-950/30 border border-purple-100/50 dark:border-purple-900/20";
      default:
        return "bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/20";
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={getIcon(stat.title)}
          iconBgClass={getIconBg(stat.title)}
          description={stat.description}
          change={stat.change}
          trend={stat.trend as StatsCardProps["trend"]}
        />
      ))}
    </div>
  );
}
