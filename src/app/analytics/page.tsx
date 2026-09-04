"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Download, 
  ChevronDown, 
  TrendingUp, 
  RefreshCw,
  FileSpreadsheet,
  FileText,
  FileCode2,
  AlertCircle
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { AnalyticsStats } from "@/components/analytics/analytics-stats"
import { AnalyticsCampaignsTable } from "@/components/analytics/analytics-campaigns-table"
import { TopTemplates } from "@/components/analytics/top-templates"
import { TopGroups } from "@/components/analytics/top-groups"
import { ActivityTimeline } from "@/components/analytics/activity-timeline"
import dynamic from "next/dynamic"
import { EmptyState } from "@/components/shared/empty-state"
import analyticsService from "@/services/analytics.service"
import { AnalyticsData } from "@/types/analytics.types"

const AnalyticsCharts = dynamic(
  () => import("@/components/analytics/analytics-charts").then(mod => mod.AnalyticsCharts),
  {
    loading: () => (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-[220px] animate-pulse bg-muted/20 border border-border rounded-xl" />
        <div className="h-[220px] animate-pulse bg-muted/20 border border-border rounded-xl" />
        <div className="h-[220px] animate-pulse bg-muted/20 border border-border rounded-xl" />
        <div className="h-[220px] animate-pulse bg-muted/20 border border-border rounded-xl" />
      </div>
    ),
    ssr: false
  }
)

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = React.useState("Last 30 Days")
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Map label to API param
  const getDateRangeParam = (label: string) => {
    switch (label) {
      case "Last 7 Days":
        return "7d"
      case "Last 90 Days":
        return "90d"
      default:
        return "30d"
    }
  }

  const fetchAnalytics = React.useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const param = getDateRangeParam(dateRange)
      const data = await analyticsService.getAnalytics(param)
      setAnalyticsData(data)
    } catch (err: any) {
      console.error("Failed to fetch analytics:", err)
      setError(err?.response?.data?.message || err?.message || "Failed to load backend analytics data")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [dateRange])

  React.useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const handleExport = (format: string) => {
    if (!analyticsData) return

    if (format === "CSV") {
      const headers = ["Campaign Name", "Status", "Audience", "Sent", "Delivered", "Failed", "Replies", "CTR (%)"]
      const rows = analyticsData.campaignsTableData.map(c => [
        `"${c.name}"`,
        c.status,
        c.audience,
        c.sent,
        c.delivered,
        c.failed,
        c.replies,
        c.ctr
      ])

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n")
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `analytics_report_${dateRange.toLowerCase().replace(/\s+/g, "_")}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert(`Exporting Analytics report in ${format} format. Report for ${dateRange} generated.`)
    }
  }

  const hasNoData = !analyticsData || (
    analyticsData.campaignsTableData.length === 0 &&
    analyticsData.stats.every(s => s.numericValue === 0)
  )

  return (
    <DashboardLayout>
      <PageHeader
        title="Analytics"
        description="Monitor delivery rates, reply coefficients, template conversions, and message consumption logs."
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh Data Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => fetchAnalytics(true)}
            disabled={loading || isRefreshing}
            className="h-9 px-3 rounded-lg border-border/80 text-xs font-semibold cursor-pointer gap-1.5"
            title="Refetch live analytics from backend"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-emerald-500" : "text-muted-foreground"}`} />
            Refresh
          </Button>

          {/* Interactive Date Range Picker */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 px-3 text-xs md:text-sm font-semibold border-border/80 rounded-lg cursor-pointer gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {dateRange}
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuItem onClick={() => setDateRange("Last 7 Days")} className="cursor-pointer text-xs">Last 7 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("Last 30 Days")} className="cursor-pointer text-xs">Last 30 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateRange("Last 90 Days")} className="cursor-pointer text-xs">Last 90 Days</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Report options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-9 px-3 text-xs md:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer border border-transparent gap-1.5">
                <Download className="h-4 w-4" /> Export Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44" align="end">
              <DropdownMenuItem onClick={() => handleExport("PDF")} className="cursor-pointer text-xs gap-2">
                <FileText className="h-4 w-4 text-red-500" /> Export to PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("Excel")} className="cursor-pointer text-xs gap-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("CSV")} className="cursor-pointer text-xs gap-2">
                <FileCode2 className="h-4 w-4 text-blue-500" /> Export to CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </PageHeader>

      {error ? (
        <div className="p-6 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20 text-center space-y-3 my-6">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Analytics Error</h3>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => fetchAnalytics()} className="mt-2 text-xs">
            Try Again
          </Button>
        </div>
      ) : loading && !analyticsData ? (
        <div className="space-y-6">
          <AnalyticsStats loading={true} />
          <AnalyticsCharts loading={true} />
          <AnalyticsCampaignsTable loading={true} />
        </div>
      ) : hasNoData ? (
        <EmptyState
          title="No analytics data recorded"
          description={`We couldn't locate any message logs or active campaign dispatches for date range: ${dateRange}. Launch your first broadcast campaign to start tracking real-time analytics.`}
          icon={<TrendingUp className="h-9 w-9 text-muted-foreground/60" />}
          actionLabel="Reset Date Filter"
          onAction={() => setDateRange("Last 30 Days")}
        />
      ) : (
        <div className="space-y-6">
          {/* 1. Analytics KPI Cards */}
          <AnalyticsStats stats={analyticsData?.stats} />

          {/* 2. Charts Grid */}
          <AnalyticsCharts data={analyticsData?.charts} />

          {/* 3. Campaign Performance Table */}
          <AnalyticsCampaignsTable campaigns={analyticsData?.campaignsTableData} />

          {/* 4. Split Columns for Templates, Groups and Timeline logs */}
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <TopTemplates templates={analyticsData?.topTemplatesData} />
            </div>
            <div className="md:col-span-4">
              <TopGroups groups={analyticsData?.topGroupsData} />
            </div>
            <div className="md:col-span-4">
              <ActivityTimeline timeline={analyticsData?.activityTimelineData} />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
