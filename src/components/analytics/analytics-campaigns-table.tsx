"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { analyticsCampaignsData } from "@/lib/mock-data"

const ITEMS_PER_PAGE = 5

export function AnalyticsCampaignsTable() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)

  const filteredCampaigns = React.useMemo(() => {
    return analyticsCampaignsData.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE)
  const paginatedCampaigns = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredCampaigns.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredCampaigns, currentPage])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  return (
    <Card className="border-border/80 shadow-xs text-left overflow-hidden">
      {/* Table Header Filter */}
      <div className="p-5 border-b border-border/50 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-muted/5">
        <div>
          <h3 className="text-sm font-bold text-foreground">Campaign Performance Metrics</h3>
          <span className="text-[10px] text-muted-foreground block mt-0.5">
            Real-time delivery counts, reply tracking, and Click-Through Rate conversion logs.
          </span>
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search campaign name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 h-8 bg-background border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all font-sans"
          />
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border/50 text-[10px] font-bold text-muted-foreground uppercase bg-muted/10 tracking-wider">
              <th className="py-3 px-5">Campaign Name</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-center">Audience</th>
              <th className="py-3 px-5 text-center">Sent</th>
              <th className="py-3 px-5 text-center text-emerald-600 dark:text-emerald-400">Delivered</th>
              <th className="py-3 px-5 text-center text-red-600 dark:text-red-400">Failed</th>
              <th className="py-3 px-5 text-center text-purple-600 dark:text-purple-400">Replies</th>
              <th className="py-3 px-5 text-right">CTR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-xs font-sans">
            {paginatedCampaigns.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-muted-foreground italic">
                  No matching campaign performance records found.
                </td>
              </tr>
            ) : (
              paginatedCampaigns.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/10 dark:hover:bg-accent/10 transition-colors">
                  <td className="py-3 px-5 font-semibold text-foreground">{item.name}</td>
                  <td className="py-3 px-5">
                    <Badge 
                      variant={
                        item.status === "completed" ? "success" : 
                        item.status === "active" ? "secondary" : 
                        "outline"
                      }
                      className="text-[9px] font-semibold uppercase"
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-5 text-center text-muted-foreground font-mono">{item.audience.toLocaleString()}</td>
                  <td className="py-3 px-5 text-center text-muted-foreground font-mono">{item.sent.toLocaleString()}</td>
                  <td className="py-3 px-5 text-center font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {item.delivered.toLocaleString()}
                  </td>
                  <td className="py-3 px-5 text-center font-semibold text-red-600 dark:text-red-400 font-mono">
                    {item.failed.toLocaleString()}
                  </td>
                  <td className="py-3 px-5 text-center font-semibold text-purple-600 dark:text-purple-400 font-mono">
                    {item.replies.toLocaleString()}
                  </td>
                  <td className="py-3 px-5 text-right font-bold text-foreground font-mono">
                    {item.ctr > 0 ? `${item.ctr.toFixed(1)}%` : "0.0%"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {filteredCampaigns.length > 0 && (
        <div className="flex items-center justify-between p-4 border-t border-border/40 text-xs">
          <span className="text-muted-foreground">
            Showing <strong className="font-semibold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{" "}
            <strong className="font-semibold text-foreground">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredCampaigns.length)}
            </strong>{" "}
            of <strong className="font-semibold text-foreground">{filteredCampaigns.length}</strong> campaigns
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
    </Card>
  )
}
