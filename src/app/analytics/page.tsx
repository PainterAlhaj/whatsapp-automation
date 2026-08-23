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
  EyeOff, 
  Eye, 
  FileSpreadsheet,
  FileText,
  FileCode2
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
  const [isEmptyState, setIsEmptyState] = React.useState(false)

  const handleExport = (format: string) => {
    alert(`Exporting Analytics report in ${format} format. Your download will start shortly.`)
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Analytics"
        description="Monitor delivery rates, reply coefficients, template conversions, and message consumption logs."
      >
        <div className="flex flex-wrap items-center gap-2">
          {/* Switch View Toggle (Empty State Simulation) */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEmptyState(!isEmptyState)}
            className="h-9 px-3 rounded-lg border border-border/80 text-xs font-semibold cursor-pointer gap-1.5"
            title="Toggle between populated dashboard and empty state for testing"
          >
            {isEmptyState ? (
              <>
                <Eye className="h-4 w-4 text-emerald-500" /> Show Analytics
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 text-muted-foreground" /> Show Empty State
              </>
            )}
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
              <DropdownMenuItem onClick={() => setDateRange("Custom Range")} className="cursor-pointer text-xs">Custom Range</DropdownMenuItem>
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
      
      {isEmptyState ? (
        /* Empty State UI */
        <EmptyState
          title="No analytics data available"
          description={`We couldn't locate any completed campaign logs or triggered flow records for date range: ${dateRange}.`}
          icon={<TrendingUp className="h-9 w-9 text-muted-foreground/60" />}
          actionLabel="Reset Filters"
          onAction={() => setIsEmptyState(false)}
        />
      ) : (
        /* Full Rich Dashboard Workspace */
        <div className="space-y-6">
          {/* 1. Analytics KPI Cards */}
          <AnalyticsStats />

          {/* 2. Charts Grid */}
          <AnalyticsCharts />

          {/* 3. Campaign Performance Table (Full Width) */}
          <AnalyticsCampaignsTable />

          {/* 4. Split Columns for Templates, Groups and Timeline logs */}
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <TopTemplates />
            </div>
            <div className="md:col-span-4">
              <TopGroups />
            </div>
            <div className="md:col-span-4">
              <ActivityTimeline />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
