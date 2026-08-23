"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CampaignsStats } from "@/components/campaigns/campaigns-stats"
import { CampaignsList } from "@/components/campaigns/campaigns-list"

export default function CampaignsPage() {
  const triggerCreateCampaign = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-create-campaign"))
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Campaigns"
        description="Broadcast messages to your contacts, track send rates, and analyze conversions."
      >
        <Button onClick={triggerCreateCampaign} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 rounded-lg text-xs md:text-sm font-semibold cursor-pointer border border-transparent">
          <Plus className="h-4 w-4" /> Create Broadcast
        </Button>
      </PageHeader>

      <div className="space-y-6">
        {/* Campaign Metrics Cards */}
        <CampaignsStats />

        {/* Core Interactive Campaigns Directory */}
        <CampaignsList />
      </div>
    </DashboardLayout>
  )
}
