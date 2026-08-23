"use client";

import * as React from "react";
import { Users, Radio, Layers, UserPlus } from "lucide-react";
import { StatsCard, StatsCardProps } from "../shared/stats-card";
import { useContacts } from "@/hooks/use-contacts";

export function ContactsStats() {
  const { data: totalData } = useContacts({ limit: 1 });
  const { data: activeData } = useContacts({ limit: 1, status: "active" });

  const totalCount = totalData?.pagination?.total ?? 0;
  const activeCount = activeData?.pagination?.total ?? 0;

  const statsList = React.useMemo(() => [
    {
      title: "Total Contacts",
      value: totalCount > 0 ? totalCount.toLocaleString() : "0",
      description: "Across all segments & lists",
      change: "+12%",
      trend: "up" as const,
    },
    {
      title: "Active Contacts",
      value: activeCount > 0 ? activeCount.toLocaleString() : "0",
      description: "Subscribed & reachables",
      change: "+8.4%",
      trend: "up" as const,
    },
    {
      title: "Custom Groups",
      value: "6",
      description: "Targeted audience segments",
      change: "Static",
      trend: "up" as const,
    },
    {
      title: "New This Week",
      value: "128",
      description: "Organic & CSV imports",
      change: "+24%",
      trend: "up" as const,
    },
  ], [totalCount, activeCount]);

  const getIcon = (title: string) => {
    switch (title) {
      case "Total Contacts":
        return <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case "Active Contacts":
        return <Radio className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case "Custom Groups":
        return <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <UserPlus className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
    }
  };

  const getIconBg = (title: string) => {
    switch (title) {
      case "Total Contacts":
        return "bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/20";
      case "Active Contacts":
        return "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/20";
      case "Custom Groups":
        return "bg-purple-50 dark:bg-purple-950/30 border border-purple-100/50 dark:border-purple-900/20";
      default:
        return "bg-amber-50 dark:bg-amber-950/30 border border-amber-100/50 dark:border-amber-900/20";
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsList.map((stat, index) => (
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
