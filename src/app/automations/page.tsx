"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AutomationsStats } from "@/components/automations/automations-stats"
import { AutomationsList } from "@/components/automations/automations-list"
import { useAutomations } from "@/hooks/use-automations"

export default function AutomationsPage() {
  const { data: automations = [], isLoading } = useAutomations()

  const triggerCreateAutomation = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-create-automation"))
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Automations"
        description="Configure rule templates, scheduling delays, and triggers for automated customer chats."
      >
        <Button onClick={triggerCreateAutomation} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 rounded-lg text-xs md:text-sm font-semibold cursor-pointer border border-transparent">
          <Plus className="h-4 w-4" /> Create Flow
        </Button>
      </PageHeader>
      
      <div className="space-y-6">
        {/* Automations KPI Cards with live dynamic metrics */}
        <AutomationsStats automations={automations} isLoading={isLoading} />

        {/* Core Double-Column directory and visual preview */}
        <AutomationsList />
      </div>
    </DashboardLayout>
  )
}
