"use client"

import * as React from "react"
import { Users, FileText, Send, Play, CheckCircle2, MessageSquare, AlertCircle, RefreshCw } from "lucide-react"
import { StatsCard, StatsCardProps } from "../shared/stats-card"
import { useDashboardStats } from "@/hooks/use-dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function StatsCards() {
  const { data: stats, isLoading, isError, error, refetch, isFetching } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <Card key={index} className="h-[128px] animate-pulse bg-muted/20 border-border/80">
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-muted/50 rounded" />
                <div className="h-9 w-9 bg-muted/50 rounded-lg" />
              </div>
              <div className="h-7 w-16 bg-muted/50 rounded mt-2" />
              <div className="h-3 w-32 bg-muted/30 rounded mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="border-destructive/30 bg-destructive/5 text-left">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10 text-destructive shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Failed to load dashboard statistics</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {error?.message || "An unexpected error occurred while fetching stats."}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="shrink-0 gap-1.5 border-border/80"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const items = [
    {
      title: "Total Contacts",
      value: stats?.totalContacts?.toLocaleString() ?? "0",
      description: "Saved in address book",
      icon: <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      iconBg: "bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/20",
    },
    {
      title: "Total Templates",
      value: stats?.totalTemplates?.toLocaleString() ?? "0",
      description: "Synced & active on Meta",
      icon: <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      iconBg: "bg-amber-50 dark:bg-amber-950/30 border border-amber-100/50 dark:border-amber-900/20",
    },
    {
      title: "Total Campaigns",
      value: stats?.totalCampaigns?.toLocaleString() ?? "0",
      description: "All-time broadcasts",
      icon: <Send className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
      iconBg: "bg-purple-50 dark:bg-purple-950/30 border border-purple-100/50 dark:border-purple-900/20",
    },
    {
      title: "Active Campaigns",
      value: stats?.activeCampaigns?.toLocaleString() ?? "0",
      description: "Currently dispatching",
      change: stats?.activeCampaigns && stats.activeCampaigns > 0 ? "Live" : undefined,
      trend: stats?.activeCampaigns && stats.activeCampaigns > 0 ? ("up" as StatsCardProps["trend"]) : undefined,
      icon: <Play className="h-5 w-5 text-sky-600 dark:text-sky-400" />,
      iconBg: "bg-sky-50 dark:bg-sky-950/30 border border-sky-100/50 dark:border-sky-900/20",
    },
    {
      title: "Completed Campaigns",
      value: stats?.completedCampaigns?.toLocaleString() ?? "0",
      description: "Finished deliverability",
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/20",
    },
    {
      title: "Messages Sent",
      value: stats?.totalMessagesSent?.toLocaleString() ?? "0",
      description: "Dispatched successfully",
      valueClassName: "text-emerald-600 dark:text-emerald-400",
      icon: <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/20",
    },
    {
      title: "Failed Messages",
      value: stats?.totalFailedMessages?.toLocaleString() ?? "0",
      description: "Failed delivery attempts",
      valueClassName: stats?.totalFailedMessages && stats.totalFailedMessages > 0 ? "text-rose-600 dark:text-rose-400" : undefined,
      icon: <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />,
      iconBg: "bg-rose-50 dark:bg-rose-950/30 border border-rose-100/50 dark:border-rose-900/20",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          valueClassName={stat.valueClassName}
          icon={stat.icon}
          iconBgClass={stat.iconBg}
          description={stat.description}
          change={stat.change}
          trend={stat.trend}
        />
      ))}
    </div>
  )
}
