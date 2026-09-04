"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLayout } from "./layout-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { navigationData } from "@/config/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { useContacts } from "@/hooks/use-contacts"
import { useCampaigns } from "@/hooks/use-campaigns"

export function Sidebar() {
  const pathname = usePathname()
  const { isSidebarCollapsed, toggleSidebar } = useLayout()
  const { logout } = useAuth()
  const { data: contactsData } = useContacts({ limit: 1 })
  const { data: campaignsData } = useCampaigns({ limit: 100 })

  const totalContacts = contactsData?.pagination?.total ?? 0

  const activeCampaignsCount = React.useMemo(() => {
    if (!campaignsData?.campaigns) return 0
    return campaignsData.campaigns.filter(
      (c) => c.status === "PROCESSING" || c.status === "SCHEDULED"
    ).length
  }, [campaignsData])

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col fixed inset-y-0 left-0 z-20 bg-background border-r border-border transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center px-4 justify-between border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-lg shrink-0">
            W
          </div>
          <span
            className={cn(
              "font-semibold text-lg text-foreground tracking-tight transition-all duration-300 ease-in-out whitespace-nowrap",
              isSidebarCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
            )}
          >
            Whats<span className="text-emerald-600 font-bold">Flow</span>
          </span>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
        {navigationData.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && !isSidebarCollapsed && (
              <span className="px-3 text-[11px] font-semibold text-muted-foreground/85 uppercase tracking-wider block mb-2">
                {section.title}
              </span>
            )}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                let displayBadge = item.badge
                if (item.name === "Contacts") {
                  displayBadge = totalContacts > 0 ? totalContacts.toLocaleString() : undefined
                } else if (item.name === "Campaigns") {
                  displayBadge = activeCampaignsCount > 0 ? `${activeCampaignsCount} active` : undefined
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative focus-visible:ring-2 focus-visible:ring-emerald-500/85 focus-visible:ring-offset-1 focus:outline-none",
                      isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                        isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "transition-all duration-300 ease-in-out whitespace-nowrap",
                        isSidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
                      )}
                    >
                      {item.name}
                    </span>

                    {/* Tooltip for collapsed sidebar */}
                    {isSidebarCollapsed && (
                      <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-150 origin-left bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 text-xs px-2.5 py-1.5 rounded-md shadow-md pointer-events-none z-50 whitespace-nowrap">
                        {item.name}
                      </div>
                    )}

                    {/* Badge */}
                    {displayBadge && !isSidebarCollapsed && (
                      <Badge variant={item.badgeVariant} className="ml-auto">
                        {displayBadge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-border mt-auto">
        <button
          onClick={() => logout()}
          className={cn(
            "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10 transition-all duration-200 group relative focus-visible:ring-2 focus-visible:ring-red-500/85 focus-visible:ring-offset-1 focus:outline-none cursor-pointer"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
          <span
            className={cn(
              "transition-all duration-300 ease-in-out whitespace-nowrap",
              isSidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
            )}
          >
            Logout
          </span>
          {isSidebarCollapsed && (
            <div className="absolute left-16 scale-0 group-hover:scale-100 transition-all duration-150 origin-left bg-red-600 text-white text-xs px-2.5 py-1.5 rounded-md shadow-md pointer-events-none z-50 whitespace-nowrap">
              Logout
            </div>
          )}
        </button>
      </div>

      {/* Collapse Toggle Button (Desktop Only) */}
      <div className="absolute bottom-8 -right-3 z-30 hidden md:block">
        <Button
          variant="outline"
          onClick={toggleSidebar}
          className="h-6 w-6 rounded-full bg-background border border-border shadow-xs hover:bg-muted dark:hover:bg-accent text-muted-foreground flex items-center justify-center p-0 cursor-pointer transition-transform duration-200 hover:scale-110"
        >
          {isSidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </aside>
  )
}
