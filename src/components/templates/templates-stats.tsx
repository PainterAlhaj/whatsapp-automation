"use client";

import * as React from "react";
import { ArrowUpRight, Copy, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTemplates } from "@/hooks/use-templates";

export function TemplatesStats() {
  const { data: response, isLoading } = useTemplates({ limit: 100 });
  const templates = response?.templates || [];
  const total = response?.pagination?.total ?? templates.length;

  const approvedCount = templates.filter((t) => t.status === "APPROVED").length;
  const pendingCount = templates.filter((t) => t.status === "PENDING").length;
  const rejectedCount = templates.filter((t) => t.status === "REJECTED").length;

  const statsData = [
    {
      title: "Total Templates",
      value: isLoading ? "..." : total.toLocaleString(),
      description: "SaaS message layouts",
      change: total > 0 ? `${total} active` : "0 active",
      trend: "up" as const,
    },
    {
      title: "Approved by Meta",
      value: isLoading ? "..." : approvedCount.toLocaleString(),
      description: "Ready to broadcast",
      change: total > 0 ? `${Math.round((approvedCount / total) * 100)}% approved` : "0%",
      trend: "up" as const,
    },
    {
      title: "Pending Review",
      value: isLoading ? "..." : pendingCount.toLocaleString(),
      description: "Under review by Meta",
      change: pendingCount > 0 ? "In review" : "0 pending",
      trend: "neutral" as const,
    },
    {
      title: "Rejected / Issues",
      value: isLoading ? "..." : rejectedCount.toLocaleString(),
      description: "Non-compliant layouts",
      change: rejectedCount > 0 ? "Needs edit" : "0 issues",
      trend: rejectedCount > 0 ? ("down" as const) : ("neutral" as const),
    },
  ];

  const getIcon = (title: string) => {
    switch (title) {
      case "Total Templates":
        return <Copy className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case "Approved by Meta":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case "Pending Review":
        return <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
    }
  };

  const getIconBg = (title: string) => {
    switch (title) {
      case "Total Templates":
        return "bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/20";
      case "Approved by Meta":
        return "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/20";
      case "Pending Review":
        return "bg-purple-50 dark:bg-purple-950/30 border border-purple-100/50 dark:border-purple-900/20";
      default:
        return "bg-amber-50 dark:bg-amber-950/30 border border-amber-100/50 dark:border-amber-900/20";
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="hover:-translate-y-0.5 hover:shadow-md cursor-default border-border/80">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
              <div className={`p-2 rounded-lg shrink-0 ${getIconBg(stat.title)}`}>
                {getIcon(stat.title)}
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-1">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-foreground truncate max-w-[150px]">
                {stat.value}
              </span>
              {stat.change && (
                <Badge variant={stat.trend === "up" ? "success" : "secondary"} className="gap-0.5 font-semibold shrink-0 text-[10px]">
                  {stat.trend === "up" && <ArrowUpRight className="h-2.5 w-2.5" />}
                  {stat.change}
                </Badge>
              )}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground/90 font-normal">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
