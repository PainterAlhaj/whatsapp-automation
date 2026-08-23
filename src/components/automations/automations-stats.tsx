"use client"

import * as React from "react"
import { GitBranch, Play, PowerOff, UserPlus } from "lucide-react"
import { StatsCard } from "../shared/stats-card"
import { Automation } from "@/types/automation.types"

interface AutomationsStatsProps {
  automations?: Automation[]
  isLoading?: boolean
}

export function AutomationsStats({ automations = [], isLoading = false }: AutomationsStatsProps) {
  const totalCount = automations.length
  const activeCount = automations.filter((a) => a.status === "ACTIVE").length
  const inactiveCount = automations.filter((a) => a.status === "INACTIVE").length
  const contactCreatedCount = automations.filter((a) => a.trigger === "CONTACT_CREATED").length

  const stats = [
    {
      title: "Total Automations",
      value: isLoading ? "..." : totalCount.toString(),
      icon: <GitBranch className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      iconBgClass: "bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/20",
      description: "Total configured rules",
    },
    {
      title: "Active Flows",
      value: isLoading ? "..." : activeCount.toString(),
      icon: <Play className="h-5 w-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />,
      iconBgClass: "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/20",
      description: "Automations currently listening for events",
    },
    {
      title: "Inactive Flows",
      value: isLoading ? "..." : inactiveCount.toString(),
      icon: <PowerOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
      iconBgClass: "bg-amber-50 dark:bg-amber-950/30 border border-amber-100/50 dark:border-amber-900/20",
      description: "Disabled rules (will not run automatically)",
    },
    {
      title: "Contact Created Triggers",
      value: isLoading ? "..." : contactCreatedCount.toString(),
      icon: <UserPlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
      iconBgClass: "bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-900/20",
      description: "Flows for new contact creation",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconBgClass={stat.iconBgClass}
          description={stat.description}
          valueClassName="text-xl md:text-2xl"
        />
      ))}
    </div>
  )
}
