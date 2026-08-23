"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Table as TableIcon, 
  GitCommit, 
  Info, 
  X, 
  Terminal, 
  Monitor, 
  Globe, 
  SlidersHorizontal,
  FileDown
} from "lucide-react"
import { ActivityLogItem } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { EmptyState } from "../shared/empty-state"
import { LoadingState } from "../shared/loading-state"
import { StatusBadge } from "../shared/status-badge"

const ITEMS_PER_PAGE = 5

interface ActivityTableTimelineProps {
  logs: ActivityLogItem[]
  isLoading?: boolean
}

export function ActivityTableTimeline({ logs, isLoading = false }: ActivityTableTimelineProps) {
  const [viewMode, setViewMode] = React.useState<"table" | "timeline">("table")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [currentPage, setCurrentPage] = React.useState(1)
  const [selectedItem, setSelectedItem] = React.useState<ActivityLogItem | null>(null)
  const [showFilters, setShowFilters] = React.useState(false)

  // Export action handler
  const handleExport = (format: "csv" | "excel" | "pdf") => {
    alert(`Success: Exported audit log stack (containing ${filteredLogs.length} items) as ${format.toUpperCase()}.`)
  }

  // Filter calculation
  const filteredLogs = React.useMemo(() => {
    return logs.filter(log => {
      const matchSearch = 
        log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.includes(searchQuery)

      const matchCategory = categoryFilter === "all" || log.category === categoryFilter
      const matchStatus = statusFilter === "all" || log.status === statusFilter

      return matchSearch && matchCategory && matchStatus
    })
  }, [logs, searchQuery, categoryFilter, statusFilter])

  // Reset pagination on filters shift
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter, statusFilter])

  // Pagination bounds
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)
  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredLogs, currentPage])

  // Categories helper
  const categories = [
    "all", "authentication", "campaigns", "contacts", "templates", 
    "automations", "analytics", "billing", "integrations", "settings", "security", "system"
  ]

  // Category Colors
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "authentication": return "bg-slate-100 text-slate-700 border-slate-200"
      case "campaigns": return "bg-blue-50/80 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400"
      case "contacts": return "bg-teal-50/80 text-teal-700 border-teal-100 dark:bg-teal-950/20 dark:text-teal-400"
      case "templates": return "bg-indigo-50/80 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400"
      case "automations": return "bg-purple-50/80 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400"
      case "billing": return "bg-amber-50/80 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400"
      case "integrations": return "bg-pink-50/80 text-pink-700 border-pink-100 dark:bg-pink-950/20 dark:text-pink-400"
      case "settings": return "bg-orange-50/80 text-orange-700 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400"
      case "security": return "bg-red-50/80 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400"
      default: return "bg-emerald-50/80 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400"
    }
  }

  return (
    <div className="space-y-4 text-left font-sans text-xs relative">
      
      {/* 1. Filtering & Search Toolbar */}
      <Card className="border-border/80 shadow-xs">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by User, Activity, Resource, IP Address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 h-8 text-xs focus-visible:ring-emerald-500/80"
              />
            </div>

            {/* View & Filter Toggles */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "h-8 px-2.5 rounded-lg text-xs font-semibold cursor-pointer border-border/80 gap-1.5",
                  showFilters && "bg-muted"
                )}
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" /> Filters
              </Button>

              <div className="flex rounded-lg border border-border p-0.5 bg-muted/20 shrink-0">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "h-7 w-7 p-0 cursor-pointer rounded-md",
                    viewMode === "table" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                  )}
                  title="Table layout"
                >
                  <TableIcon className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setViewMode("timeline")}
                  className={cn(
                    "h-7 w-7 p-0 cursor-pointer rounded-md",
                    viewMode === "timeline" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                  )}
                  title="Timeline layout"
                >
                  <GitCommit className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Export Dropdown Popover */}
              <div className="relative group shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 rounded-lg text-xs font-semibold cursor-pointer border-border/80 gap-1.5"
                >
                  <FileDown className="h-3.5 w-3.5 text-muted-foreground" /> Export
                </Button>
                <div className="absolute right-0 top-full mt-1 w-28 bg-card border border-border rounded-lg shadow-md hidden group-hover:block hover:block z-20 py-1 font-semibold">
                  <button onClick={() => handleExport("csv")} className="w-full text-left px-3 py-1.5 hover:bg-muted text-[10px] block cursor-pointer">Export CSV</button>
                  <button onClick={() => handleExport("excel")} className="w-full text-left px-3 py-1.5 hover:bg-muted text-[10px] block cursor-pointer">Export Excel</button>
                  <button onClick={() => handleExport("pdf")} className="w-full text-left px-3 py-1.5 hover:bg-muted text-[10px] block cursor-pointer">Export PDF</button>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced filter panels */}
          {showFilters && (
            <div className="grid gap-3 pt-3 border-t border-border/40 sm:grid-cols-2 lg:grid-cols-3">
              {/* Category */}
              <div className="space-y-1">
                <span className="font-bold text-muted-foreground uppercase text-[9px] block">Audit Category</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-8 px-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <span className="font-bold text-muted-foreground uppercase text-[9px] block">Execution Outcome</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-8 px-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80"
                >
                  <option value="all">All Outcomes</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="warning">Warning</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCategoryFilter("all")
                    setStatusFilter("all")
                    setSearchQuery("")
                  }}
                  className="h-8 w-full border border-border/60 hover:bg-muted text-xs cursor-pointer"
                >
                  Reset Advanced Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Loading / Skeleton / List View */}
      {isLoading ? (
        /* Loading Skeleton */
        <LoadingState rows={4} />
      ) : filteredLogs.length === 0 ? (
        /* Empty State */
        <EmptyState
          title="No activities found"
          description="No audit log activities correspond with your current category selections, query searches, or execution outcomes."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery("")
            setCategoryFilter("all")
            setStatusFilter("all")
          }}
        />
      ) : viewMode === "table" ? (
        /* Table View Layout */
        <Card className="border-border/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto max-h-[460px]">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 bg-muted/90 dark:bg-muted/95 backdrop-blur-xs text-muted-foreground border-b border-border font-bold uppercase text-[9px] tracking-wider z-10">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Activity</th>
                  <th className="px-4 py-3">Resource Target</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Outcome</th>
                  <th className="px-4 py-3">IP Address</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 bg-card">
                {paginatedLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                    onClick={() => setSelectedItem(log)}
                  >
                    <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">{log.timestamp}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-foreground block">{log.user.name}</span>
                      <span className="text-[9px] text-muted-foreground block">{log.user.email}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">{log.activity}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{log.resource}</td>
                    <td className="px-4 py-3">
                      <Badge className={cn("text-[9px] font-semibold border px-1.5 py-0 capitalize", getCategoryColor(log.category))}>
                        {log.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={log.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">{log.ipAddress}</td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedItem(log)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground cursor-pointer rounded-md"
                      >
                        <Info className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Timeline View Layout */
        <Card className="border-border/80 shadow-xs p-6">
          <div className="relative pl-6 border-l border-border space-y-6 py-2">
            {paginatedLogs.map((log) => (
              <div 
                key={log.id} 
                className="relative group cursor-pointer"
                onClick={() => setSelectedItem(log)}
              >
                {/* Dots marker indicator */}
                <span className={cn(
                  "absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-background ring-1 ring-border flex items-center justify-center transition-transform group-hover:scale-110",
                  log.status === "success" ? "bg-emerald-500" : log.status === "failed" ? "bg-red-500" : "bg-amber-500"
                )} />

                <div className="space-y-1.5 p-3 rounded-lg border border-border/40 bg-muted/10 hover:bg-muted/20 transition-all max-w-2xl">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <strong className="font-bold text-foreground">{log.activity}</strong>
                      <Badge className={cn("text-[8px] font-semibold border px-1.5 py-0 capitalize", getCategoryColor(log.category))}>
                        {log.category}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">{log.timestamp}</span>
                  </div>

                  <p className="text-muted-foreground">
                    Targeted <strong className="font-medium text-foreground">{log.resource}</strong> initiated by <strong className="font-medium text-foreground">{log.user.name}</strong> ({log.user.email}).
                  </p>

                  <div className="flex gap-4 text-[10px] text-muted-foreground font-mono pt-1">
                    <span>IP: {log.ipAddress}</span>
                    <span>Device: {log.device}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 3. Pagination panel */}
      {filteredLogs.length > 0 && !isLoading && (
        <div className="flex items-center justify-between p-4 border border-border/80 bg-card rounded-xl">
          <span className="text-muted-foreground">
            Showing <strong className="font-semibold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{" "}
            <strong className="font-semibold text-foreground">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)}
            </strong>{" "}
            of <strong className="font-semibold text-foreground">{filteredLogs.length}</strong> entries
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

      {/* 4. Slide-out details drawer sidebar overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-background/60 backdrop-blur-xs">
          {/* Backdrop closer clicker */}
          <div className="flex-1 cursor-pointer" onClick={() => setSelectedItem(null)} />

          {/* Drawer container panel */}
          <div className="w-full max-w-lg bg-card border-l border-border shadow-xl h-full overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
            
            {/* Header */}
            <div className="p-5 border-b border-border/80 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-muted-foreground">ID: {selectedItem.id}</span>
                <h3 className="text-sm font-extrabold text-foreground">Audit Record Details</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItem(null)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg border border-border"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Contents */}
            <div className="p-5 space-y-6 flex-1 text-left">
              {/* Profile details */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Author Information</span>
                <div className="p-3 bg-muted/30 border border-border/60 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{selectedItem.user.name}</span>
                    <Badge className={cn("text-[8px] font-semibold border px-1.5 py-0 capitalize", getCategoryColor(selectedItem.category))}>
                      {selectedItem.category}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground block">{selectedItem.user.email}</span>
                </div>
              </div>

              {/* Action metadata */}
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Execution Summary</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Event Action</span>
                    <strong className="font-bold text-foreground block">{selectedItem.activity}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Execution Outcome</span>
                    <div className="pt-0.5 block"><StatusBadge status={selectedItem.status} /></div>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Timestamp</span>
                    <span className="font-mono text-muted-foreground block">{selectedItem.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Resource Target</span>
                    <span className="font-medium text-foreground block truncate">{selectedItem.resource}</span>
                  </div>
                </div>
              </div>

              {/* Diff Values */}
              <div className="space-y-3 pt-3 border-t border-border/40">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Value Changes</span>
                <div className="space-y-2.5">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Previous Value State</span>
                    <div className="p-2.5 bg-muted/20 border border-border/40 rounded-lg text-muted-foreground font-mono text-[10px] break-all">
                      {selectedItem.details.previousValue || "—"}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">New Value State</span>
                    <div className="p-2.5 bg-muted/20 border border-border/40 rounded-lg text-foreground font-mono text-[10px] break-all">
                      {selectedItem.details.newValue || "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Context Device */}
              <div className="space-y-3 pt-3 border-t border-border/40">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Request Environment Context</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2 bg-muted/20 border border-border/30 rounded-lg text-center">
                    <Globe className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                    <span className="text-[9px] text-muted-foreground block">IP Address</span>
                    <strong className="font-mono text-foreground text-[10px] block">{selectedItem.ipAddress}</strong>
                  </div>
                  <div className="p-2 bg-muted/20 border border-border/30 rounded-lg text-center">
                    <Monitor className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                    <span className="text-[9px] text-muted-foreground block">Browser Profile</span>
                    <strong className="font-medium text-foreground text-[9px] block truncate" title={selectedItem.details.browser}>{selectedItem.details.browser}</strong>
                  </div>
                  <div className="p-2 bg-muted/20 border border-border/30 rounded-lg text-center">
                    <Terminal className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                    <span className="text-[9px] text-muted-foreground block">Operating System</span>
                    <strong className="font-medium text-foreground text-[9px] block truncate" title={selectedItem.details.os}>{selectedItem.details.os}</strong>
                  </div>
                </div>
              </div>

              {/* JSON Metadata */}
              {selectedItem.details.meta && (
                <div className="space-y-2 pt-3 border-t border-border/40">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Payload Metadata (JSON)</span>
                  <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-[9px] rounded-lg overflow-x-auto max-h-40 leading-normal">
                    {selectedItem.details.meta}
                  </pre>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/80 bg-muted/10 text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItem(null)}
                className="h-8 px-4 border-border/80 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Audit details
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
