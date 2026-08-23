"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PageHeader } from "@/components/layout/page-header"
import { 
  User, 
  Briefcase, 
  MessageSquare, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Code2, 
  AlertTriangle 
} from "lucide-react"

import dynamic from "next/dynamic"
import { LoadingState } from "@/components/shared/loading-state"

// Settings Sub-components (dynamically loaded for code-splitting)
const ProfileSettings = dynamic(() => import("@/components/settings/profile-settings").then(mod => mod.ProfileSettings), {
  loading: () => <LoadingState rows={2} />,
  ssr: false
})
const CompanySettings = dynamic(() => import("@/components/settings/company-settings").then(mod => mod.CompanySettings), {
  loading: () => <LoadingState rows={2} />,
  ssr: false
})
const WhatsAppSettings = dynamic(() => import("@/components/settings/whatsapp-settings").then(mod => mod.WhatsAppSettings), {
  loading: () => <LoadingState rows={2} />,
  ssr: false
})
const NotificationPreferences = dynamic(() => import("@/components/settings/notification-preferences").then(mod => mod.NotificationPreferences), {
  loading: () => <LoadingState rows={2} />,
  ssr: false
})
const SecuritySettings = dynamic(() => import("@/components/settings/security-settings").then(mod => mod.SecuritySettings), {
  loading: () => <LoadingState rows={2} />,
  ssr: false
})
const AppearanceSettings = dynamic(() => import("@/components/settings/appearance-settings").then(mod => mod.AppearanceSettings), {
  loading: () => <LoadingState rows={2} />,
  ssr: false
})
const LanguageRegion = dynamic(() => import("@/components/settings/language-region").then(mod => mod.LanguageRegion), {
  loading: () => <LoadingState rows={2} />,
  ssr: false
})
const ApiWebhooks = dynamic(() => import("@/components/settings/api-webhooks").then(mod => mod.ApiWebhooks), {
  loading: () => <LoadingState rows={2} />,
  ssr: false
})
const DangerZone = dynamic(() => import("@/components/settings/danger-zone").then(mod => mod.DangerZone), {
  loading: () => <LoadingState rows={2} />,
  ssr: false
})

type TabID = 
  | "profile" 
  | "company" 
  | "whatsapp" 
  | "notifications" 
  | "security" 
  | "appearance" 
  | "language" 
  | "api" 
  | "danger"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<TabID>("profile")

  const tabs = [
    { id: "profile", label: "Profile Settings", icon: <User className="h-4 w-4" /> },
    { id: "company", label: "Company Workspace", icon: <Briefcase className="h-4 w-4" /> },
    { id: "whatsapp", label: "WhatsApp Meta Integration", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "notifications", label: "Notification Configs", icon: <Bell className="h-4 w-4" /> },
    { id: "security", label: "Security & Credentials", icon: <Shield className="h-4 w-4" /> },
    { id: "appearance", label: "Appearance Theme", icon: <Palette className="h-4 w-4" /> },
    { id: "language", label: "Language & Locale", icon: <Globe className="h-4 w-4" /> },
    { id: "api", label: "API Keys & Webhooks", icon: <Code2 className="h-4 w-4" /> },
    { id: "danger", label: "Danger Zone", icon: <AlertTriangle className="h-4 w-4" />, isDanger: true }
  ]

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />
      case "company":
        return <CompanySettings />
      case "whatsapp":
        return <WhatsAppSettings />
      case "notifications":
        return <NotificationPreferences />
      case "security":
        return <SecuritySettings />
      case "appearance":
        return <AppearanceSettings />
      case "language":
        return <LanguageRegion />
      case "api":
        return <ApiWebhooks />
      case "danger":
        return <DangerZone />
      default:
        return <ProfileSettings />
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Account Settings"
        description="Configure your dashboard theme preference, coordinate WhatsApp gateway connections, update profile logs, and view API secrets."
      />

      <div className="grid gap-6 md:grid-cols-4 items-start font-sans">
        
        {/* Settings Navigation Sidebar (Hidden on mobile dropdown style) */}
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
                    ? tab.isDanger 
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : "bg-emerald-600 text-white" 
                    : tab.isDanger
                      ? "text-red-500/80 hover:bg-red-500/10 hover:text-red-600"
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
