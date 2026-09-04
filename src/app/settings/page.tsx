"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PageHeader } from "@/components/layout/page-header"
import { User, MessageSquare, Palette } from "lucide-react"

import dynamic from "next/dynamic"
import { LoadingState } from "@/components/shared/loading-state"

// Active Dynamic Settings Sub-components
const ProfileSettings = dynamic(() => import("@/components/settings/profile-settings").then(mod => mod.ProfileSettings), {
  loading: () => <LoadingState rows={2} />,
  ssr: false
})
const WhatsAppSettings = dynamic(() => import("@/components/settings/whatsapp-settings").then(mod => mod.WhatsAppSettings), {
  loading: () => <LoadingState rows={2} />,
  ssr: false
})
const AppearanceSettings = dynamic(() => import("@/components/settings/appearance-settings").then(mod => mod.AppearanceSettings), {
  loading: () => <LoadingState rows={2} />,
  ssr: false
})

type TabID = "profile" | "whatsapp" | "appearance"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<TabID>("profile")

  const tabs = [
    { id: "profile", label: "User Profile Details", icon: <User className="h-4 w-4" /> },
    { id: "whatsapp", label: "WhatsApp Meta Integration", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "appearance", label: "Appearance Theme", icon: <Palette className="h-4 w-4" /> },
  ]

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />
      case "whatsapp":
        return <WhatsAppSettings />
      case "appearance":
        return <AppearanceSettings />
      default:
        return <ProfileSettings />
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Account Settings"
        description="View live authenticated user profile details, coordinate WhatsApp gateway connections, and configure theme preferences."
      />

      <div className="grid gap-6 md:grid-cols-4 items-start font-sans">
        
        {/* Settings Navigation Sidebar */}
        <div className="hidden md:flex flex-col gap-1 p-1 bg-muted/30 border border-border/40 rounded-xl">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabID)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-left transition-all focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-1 focus:outline-none cursor-pointer ${
                  isActive 
                    ? "bg-emerald-600 text-white shadow-xs" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Mobile Dropdown navigation selector */}
        <div className="block md:hidden">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1.5">Settings Section</label>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as TabID)}
            className="w-full h-10 px-3 bg-card border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500/85 transition-all"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Selected settings card pane right-side column */}
        <div className="md:col-span-3 space-y-6">
          <div className="transition-all duration-200">
            {renderActiveComponent()}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

