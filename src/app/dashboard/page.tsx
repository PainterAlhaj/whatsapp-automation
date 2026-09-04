"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, UserPlus, RefreshCw } from "lucide-react"
import Link from "next/link"

import dynamic from "next/dynamic"
import { useQueryClient } from "@tanstack/react-query"
import { DASHBOARD_QUERY_KEY } from "@/hooks/use-dashboard"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { SubscriptionStatus } from "@/components/dashboard/subscription-status"
import { subscriptionStatus } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth/auth-context"

const AnalyticsCharts = dynamic(
  () => import("@/components/dashboard/analytics-charts").then(mod => mod.AnalyticsCharts),
  {
    loading: () => (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="h-[380px] animate-pulse bg-muted/20 border border-border rounded-xl" />
        <div className="h-[380px] animate-pulse bg-muted/20 border border-border rounded-xl" />
      </div>
    ),
    ssr: false
  }
)

export default function DashboardPage() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY })
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const displayName = user?.firstName || user?.email?.split("@")[0] || "User"

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Real-time insights and marketing operations for your WhatsApp automated broadcasting."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="rounded-lg text-xs md:text-sm font-semibold cursor-pointer border-border/80 gap-1.5 shrink-0 whitespace-nowrap"
        >
          <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isRefreshing ? "animate-spin" : ""}`} /> Refresh
        </Button>
        <Button variant="outline" size="sm" asChild className="rounded-lg text-xs md:text-sm font-semibold cursor-pointer border-border/80 shrink-0 whitespace-nowrap">
          <Link href="/contacts" className="flex items-center gap-1.5">
            <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Add Contacts
          </Link>
        </Button>
        <Button size="sm" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs md:text-sm font-semibold cursor-pointer border border-transparent shrink-0 whitespace-nowrap">
          <Link href="/campaigns" className="flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> New Campaign
          </Link>
        </Button>
      </PageHeader>

      <div className="space-y-4 sm:space-y-6">
        {/* Personalized Welcome Banner */}
        <Card className="text-left overflow-hidden">
          <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">Good afternoon, {displayName} 👋</h2>
              <p className="text-xs text-muted-foreground/95 max-w-xl">
                WhatsFlow automation systems are active. Your phone channels are online, and 4 scheduled broadcasts are prepared for delivery.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
              <Badge variant="success" className="gap-1.5 py-1 px-2.5 rounded-md font-semibold text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> {subscriptionStatus.planName} Plan
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <StatsCards />

        {/* Analytics Charts Grid */}
        <AnalyticsCharts />

        {/* Bottom Section: Activities & Utilities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Platform Activity Logs (2/3 width) */}
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          {/* Billing & Shortcuts Area (1/3 width) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <SubscriptionStatus />
            <QuickActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
