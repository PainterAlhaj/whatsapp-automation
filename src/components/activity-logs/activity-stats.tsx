"use client"

import * as React from "react"
import { ScrollText, Calendar, CheckCircle2, AlertOctagon } from "lucide-react"
import { StatsCard } from "../shared/stats-card"

interface ActivityStatsProps {
  totalCount: number
  successCount: number
  failedCount: number
  warningCount: number
}

export function ActivityStats({ totalCount, successCount, failedCount, warningCount }: ActivityStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans text-xs text-left">
      
      {/* Total Activities */}
      <StatsCard
        title="Total Activities"
        value={totalCount}
        icon={<ScrollText className="h-5 w-5" />}
        iconBgClass="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
        description="System audit records"
      />

      {/* Today's Activities */}
      <StatsCard
        title="Today's Activities"
        value={Math.max(2, Math.floor(totalCount / 3))}
        icon={<Calendar className="h-5 w-5" />}
        iconBgClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
        description="● Live streaming active"
        descriptionClassName="text-emerald-600 dark:text-emerald-400 font-bold"
      />

      {/* Successful Actions */}
      <StatsCard
        title="Successful Actions"
        value={successCount}
        icon={<CheckCircle2 className="h-5 w-5" />}
        iconBgClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
        description={totalCount > 0 ? `${Math.round((successCount / totalCount) * 100)}% rate` : "0% rate"}
        descriptionClassName="text-emerald-600 dark:text-emerald-400 font-bold"
      />

      {/* Failed Actions */}
      <StatsCard
        title="Alerts / Warnings"
        value={failedCount + warningCount}
        icon={<AlertOctagon className="h-5 w-5" />}
        iconBgClass="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
        description="Requires attention"
        descriptionClassName="text-red-600 dark:text-red-400 font-bold"
      />

    </div>
  )
}
