"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bell, 
  Search, 
  Trash2, 
  Check, 
  Mail, 
  GitBranch, 
  CreditCard, 
  ShieldAlert, 
  Cpu, 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  EyeOff
} from "lucide-react"
import { initialNotificationsCenterData, NotificationCenterItem } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { EmptyState } from "../shared/empty-state"

const ITEMS_PER_PAGE = 4

type CategoryFilter = "all" | "campaigns" | "automations" | "billing" | "security" | "system"
type ReadFilter = "all" | "unread"

export function NotificationList() {
  const [notifications, setNotifications] = React.useState<NotificationCenterItem[]>(initialNotificationsCenterData)
  const [category, setCategory] = React.useState<CategoryFilter>("all")
  const [readState, setReadState] = React.useState<ReadFilter>("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)

  // Mark single as read/unread
  const handleToggleRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: !n.read } : n
    ))
  }

  // Delete single notification
  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Mark all as read
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  // Clear all notifications
  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to permanently clear all notifications?")) {
      setNotifications([])
    }
  }

  // Categories helper to get icon & style
  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case "campaigns":
        return {
          icon: <Mail className="h-4 w-4" />,
          bgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
        }
      case "automations":
        return {
          icon: <GitBranch className="h-4 w-4" />,
          bgClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
        }
      case "billing":
        return {
          icon: <CreditCard className="h-4 w-4" />,
          bgClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
        }
      case "security":
        return {
          icon: <ShieldAlert className="h-4 w-4" />,
          bgClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
        }
      case "system":
        return {
          icon: <Cpu className="h-4 w-4" />,
          bgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        }
      default:
        return {
          icon: <Bell className="h-4 w-4" />,
          bgClass: "bg-muted text-muted-foreground"
        }
    }
  }

  // Get severity border class
  const getSeverityBorder = (sev: string) => {
    switch (sev) {
      case "success": return "border-l-emerald-500"
      case "warning": return "border-l-amber-500"
      case "error": return "border-l-red-500"
      default: return "border-l-blue-500"
    }
  }

  // Filter calculation
  const filteredNotifications = React.useMemo(() => {
    return notifications.filter(n => {
      const matchCategory = category === "all" || n.category === category
      const matchRead = readState === "all" || (readState === "unread" && !n.read)
      const matchSearch = 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCategory && matchRead && matchSearch
    })
  }, [notifications, category, readState, searchQuery])

  // Precalculate unread counts using memoization to avoid redundant scans during render
  const unreadCounts = React.useMemo(() => {
    const counts: Record<CategoryFilter, number> = {
      all: 0,
      campaigns: 0,
      automations: 0,
      billing: 0,
      security: 0,
      system: 0
    }
    for (const n of notifications) {
      if (!n.read) {
        counts.all++
        if (n.category in counts) {
          counts[n.category as CategoryFilter]++
        }
      }
    }
    return counts
  }, [notifications])

  // Reset pagination on filter alteration
  React.useEffect(() => {
    setCurrentPage(1)
  }, [category, readState, searchQuery])

  // Pagination bounds
  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE)
  const paginatedNotifications = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredNotifications.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredNotifications, currentPage])

  const categoriesList: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: "All Alerts" },
    { id: "campaigns", label: "Campaigns" },
    { id: "automations", label: "Automations" },
    { id: "billing", label: "Billing" },
    { id: "security", label: "Security" },
    { id: "system", label: "System Status" }
  ]

  return (
    <div className="grid gap-6 md:grid-cols-4 items-start font-sans text-xs text-left">
      
      {/* 1. Sidebar Category Filters */}
      <div className="space-y-4">
        {/* Read / Unread tab switch */}
        <div className="flex gap-1 p-1 bg-muted/40 border border-border/40 rounded-xl">
          <button
            type="button"
            onClick={() => setReadState("all")}
            className={cn(
              "flex-1 py-1.5 rounded-lg font-bold transition-all focus-visible:ring-2 focus-visible:ring-emerald-500/85 focus-visible:ring-offset-1 focus:outline-none cursor-pointer",
              readState === "all" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            All Logs
          </button>
          <button
            type="button"
            onClick={() => setReadState("unread")}
            className={cn(
              "flex-1 py-1.5 rounded-lg font-bold transition-all focus-visible:ring-2 focus-visible:ring-emerald-500/85 focus-visible:ring-offset-1 focus:outline-none cursor-pointer flex items-center justify-center gap-1.5",
              readState === "unread" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Unread
            {unreadCounts.all > 0 && (
              <span className="h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-background animate-pulse" />
            )}
          </button>
        </div>

        {/* Category list */}
        <div className="flex flex-col gap-1 p-1.5 bg-muted/30 border border-border/40 rounded-xl">
          {categoriesList.map((cat) => {
            const isActive = category === cat.id
            const count = unreadCounts[cat.id]
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg font-semibold text-left transition-all focus-visible:ring-2 focus-visible:ring-emerald-500/85 focus-visible:ring-offset-1 focus:outline-none cursor-pointer",
                  isActive 
                    ? "bg-emerald-600 text-white" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{cat.label}</span>
                {count > 0 && (
                  <Badge 
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0 rounded-full border-none",
                      isActive ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    )}
                  >
                    {count}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Main content list panel */}
      <div className="md:col-span-3 space-y-4">
        
        {/* Search & Bulk actions */}
        <Card className="border-border/80 shadow-xs">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notification contents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 h-8 bg-background border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all"
              />
            </div>

            {/* Bulk options */}
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                disabled={notifications.filter(n => !n.read).length === 0}
                className="h-8 px-2.5 rounded-lg text-xs font-semibold cursor-pointer border-border/80 gap-1"
              >
                <Check className="h-3.5 w-3.5 text-emerald-500" /> Mark All Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={notifications.length === 0}
                className="h-8 px-2.5 rounded-lg text-xs font-semibold border-border/80 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications list */}
        <div className="space-y-3">
          {paginatedNotifications.length === 0 ? (
            /* Empty State */
            <EmptyState
              title="No alerts recorded"
              description="There are no notifications matching your active categories, status tags, or search keywords."
              actionLabel={searchQuery || category !== "all" || readState !== "all" ? "Reset Filters" : undefined}
              onAction={() => {
                setSearchQuery("")
                setCategory("all")
                setReadState("all")
              }}
            />
          ) : (
            paginatedNotifications.map((item) => {
              const meta = getCategoryMeta(item.category)
              return (
                <Card 
                  key={item.id}
                  className={cn(
                    "border border-border/80 border-l-4 shadow-xs transition-colors font-sans",
                    getSeverityBorder(item.severity),
                    !item.read && "bg-emerald-500/[0.01] border-emerald-500/30"
                  )}
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    
                    {/* Left Icon */}
                    <div className={cn(
                      "p-2 rounded-lg border shrink-0 mt-0.5",
                      meta.bgClass
                    )}>
                      {meta.icon}
                    </div>

                    {/* Middle content */}
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-bold text-xs text-foreground",
                            !item.read && "text-emerald-700 dark:text-emerald-400"
                          )}>
                            {item.title}
                          </span>
                          {!item.read && (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/95 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleRead(item.id)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground cursor-pointer rounded-md"
                        title={item.read ? "Mark as Unread" : "Mark as Read"}
                      >
                        {item.read ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600 cursor-pointer rounded-md"
                        title="Delete Alert"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Pagination controls */}
        {filteredNotifications.length > 0 && (
          <div className="flex items-center justify-between p-4 border border-border/80 bg-card rounded-xl text-xs">
            <span className="text-muted-foreground">
              Showing <strong className="font-semibold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{" "}
              <strong className="font-semibold text-foreground">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredNotifications.length)}
              </strong>{" "}
              of <strong className="font-semibold text-foreground">{filteredNotifications.length}</strong> items
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="h-8 px-2.5 rounded-lg border-border/80 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-0.5" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="h-8 px-2.5 rounded-lg border-border/80 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Next <ChevronRight className="h-4 w-4 ml-0.5" />
              </Button>
            </div>
          </div>
        )}

      </div>
      
    </div>
  )
}
