"use client"

import * as React from "react"
import { Send, CheckCircle2, AlertCircle, Activity, MessageSquare, Users } from "lucide-react"
import { StatsCard, StatsCardProps } from "../shared/stats-card"
import { AnalyticsStatItem } from "@/types/analytics.types"

interface AnalyticsStatsProps {
  stats?: AnalyticsStatItem[]
  loading?: boolean
}

export function AnalyticsStats({ stats = [], loading = false }: AnalyticsStatsProps) {
  const getIcon = (title: string) => {
    switch (title) {
      case "Total Messages Sent":
        return <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      case "Delivered Messages":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      case "Failed Messages":
        return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
      case "Delivery Success Rate":
        return <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      case "Reply Conversation Rate":
        return <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
      default:
        return <Users className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
    }
  }

  const getIconBg = (title: string) => {
    switch (title) {
      case "Total Messages Sent":
        return "bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/20"
      case "Delivered Messages":
        return "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/20"
      case "Failed Messages":
        return "bg-red-50 dark:bg-red-950/30 border border-red-100/50 dark:border-red-900/20"
      case "Delivery Success Rate":
        return "bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/20"
      case "Reply Conversation Rate":
        return "bg-purple-50 dark:bg-purple-950/30 border border-purple-100/50 dark:border-purple-900/20"
      default:
        return "bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-100/50 dark:border-zinc-900/20"
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-24 animate-pulse rounded-xl bg-muted/20 border border-border/80" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={getIcon(stat.title)}
          iconBgClass={getIconBg(stat.title)}
          description={stat.description}
          change={stat.change ? stat.change.split(" ")[0] : undefined}
          trend={stat.trend as StatsCardProps["trend"]}
          titleClassName="text-xs font-semibold truncate max-w-[120px]"
          valueClassName="text-lg md:text-xl max-w-[100px]"
          descriptionClassName="text-[10px] truncate"
        />
      ))}
    </div>
  )
}
