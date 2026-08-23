"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { LayoutProvider, useLayout } from "./layout-context"
import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { navigationData } from "@/config/navigation"

import { useAuth } from "@/lib/auth/auth-context"

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed, isMobileOpen, setIsMobileOpen } = useLayout()
  const { logout } = useAuth()
  const pathname = usePathname()

  // Close mobile drawer on route change
  React.useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname, setIsMobileOpen])

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-zinc-950/20 text-foreground flex flex-col">
      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar />

      {/* Mobile Drawer (visible on mobile only) */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 border-r border-border">
          <div className="flex flex-col h-full bg-background">
            {/* Mobile Brand Header */}
            <div className="flex h-16 items-center px-4 border-b border-border">
              <Link
                href="/dashboard"
                className="flex items-center gap-2"
                onClick={() => setIsMobileOpen(false)}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-lg shrink-0">
                  W
                </div>
                <span className="font-semibold text-lg text-foreground tracking-tight">
                  Whats<span className="text-emerald-600 font-bold">Flow</span>
                </span>
              </Link>
            </div>

            {/* Mobile Navigation List */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
              {navigationData.map((section, idx) => (
                <div key={idx} className="space-y-1">
                  {section.title && (
                    <span className="px-3 text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider block mb-2">
                      {section.title}
                    </span>
                  )}
                  <nav className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
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
                          <span>{item.name}</span>

                          {item.badge && (
                            <Badge variant={item.badgeVariant} className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      )
                    })}
                  </nav>
                </div>
              ))}
            </div>

            {/* Mobile Sidebar Footer */}
            <div className="p-3 border-t border-border mt-auto">
              <button
                onClick={() => {
                  setIsMobileOpen(false)
                  logout()
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/10 transition-all duration-200 group cursor-pointer"
                )}
              >
                <LogOut className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Page Content Wrapper */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "md:pl-[72px]" : "md:pl-64"
        )}
      >
        <Navbar />
        <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </LayoutProvider>
  )
}
