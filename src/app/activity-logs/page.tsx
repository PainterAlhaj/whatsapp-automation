"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { ActivityLogItem } from "@/lib/mock-data"
import { activityLogsRepository } from "@/repositories"
import { 
  ToggleLeft, 
  ToggleRight, 
  RefreshCw
} from "lucide-react"

// Activity components
import { ActivityStats } from "@/components/activity-logs/activity-stats"
import { ActivityTableTimeline } from "@/components/activity-logs/activity-table-timeline"

export default function ActivityLogsPage() {
  const [logs, setLogs] = React.useState<ActivityLogItem[]>([])
  const [cachedLogs, setCachedLogs] = React.useState<ActivityLogItem[]>([])
  const [isEmptyState, setIsEmptyState] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchLogs = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await activityLogsRepository.getAllLogs()
      setLogs(data)
      setCachedLogs(data)
      setIsEmptyState(data.length === 0)
    } catch (err) {
      console.error("Failed to load activity logs:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // Simulation handlers
  const handleToggleEmpty = () => {
    if (isEmptyState) {
      setLogs(cachedLogs)
      setIsEmptyState(false)
    } else {
      setLogs([])
      setIsEmptyState(true)
    }
  }

  const handleRefresh = () => {
    fetchLogs()
  }

  // Summary counts
  const successCount = logs.filter(l => l.status === "success").length
  const failedCount = logs.filter(l => l.status === "failed").length
  const warningCount = logs.filter(l => l.status === "warning").length

  return (
    <DashboardLayout>
      <PageHeader
        title="Activity Audit Logs"
        description="Monitor system authentication audits, automation dispatches, templates reviews, and security changes."
      >
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 px-2.5 rounded-lg text-xs font-semibold border-border/80 text-foreground hover:bg-muted/40 cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className={className("h-3.5 w-3.5", isLoading && "animate-spin")} />
            <span>{isLoading ? "Refreshing..." : "Refresh Feed"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleEmpty}
            className="h-8 px-2.5 rounded-lg text-xs font-semibold border-border/80 text-foreground hover:bg-muted/40 cursor-pointer flex items-center gap-1.5"
          >
            {isEmptyState ? (
              <>
                <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                <span>Restore Logs</span>
              </>
            ) : (
              <>
                <ToggleRight className="h-4 w-4 text-emerald-500" />
                <span>Empty State</span>
              </>
            )}
          </Button>
        </div>
      </PageHeader>

      <div className="space-y-6 font-sans text-xs">
        
        {/* 1. Summary Cards */}
        <ActivityStats 
          totalCount={logs.length}
          successCount={successCount}
          failedCount={failedCount}
          warningCount={warningCount}
        />

        {/* 2. Main list grid */}
        <ActivityTableTimeline 
          logs={logs}
          isLoading={isLoading}
        />

      </div>
    </DashboardLayout>
  )
}

// Quick className join utility for internal fallback if absent
function className(...args: (string | boolean | undefined)[]) {
  return args.filter(Boolean).join(" ")
}

