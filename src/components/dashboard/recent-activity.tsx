"use client"

import * as React from "react"
import { CheckCircle2, AlertCircle, RefreshCw, MessageSquare, Reply, Check, HeartHandshake } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { recentCampaigns, logEvents } from "@/lib/mock-data"

export function RecentActivity() {
  const getStatusBadge = (status: "sending" | "completed" | "failed") => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" className="gap-1 font-semibold">
            <CheckCircle2 className="h-3 w-3" /> Completed
          </Badge>
        )
      case "sending":
        return (
          <Badge variant="warning" className="gap-1 font-semibold animate-pulse">
            <RefreshCw className="h-3 w-3 animate-spin" /> Sending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="gap-1 font-semibold">
            <AlertCircle className="h-3 w-3" /> Failed
          </Badge>
        )
    }
  }

  const getLogIcon = (type: "delivery" | "read" | "reply" | "template") => {
    switch (type) {
      case "read":
        return (
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100/30 dark:border-blue-900/10">
            <MessageSquare className="h-4 w-4" />
          </div>
        )
      case "reply":
        return (
          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-100/30 dark:border-purple-900/10">
            <Reply className="h-4 w-4" />
          </div>
        )
      case "delivery":
        return (
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/30 dark:border-emerald-900/10">
            <Check className="h-4 w-4" />
          </div>
        )
      case "template":
        return (
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100/30 dark:border-amber-900/10">
            <HeartHandshake className="h-4 w-4" />
          </div>
        )
    }
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 text-left">
      {/* Recent Campaigns list */}
      <Card className="flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Status and reach of your recent message broadcasts.</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border/60">
            {recentCampaigns.map((campaign) => (
              <div key={campaign.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-foreground block">{campaign.name}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground/90 font-medium">
                    <span>{campaign.recipients.toLocaleString()} contacts</span>
                    <span>•</span>
                    <span>{campaign.time}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {getStatusBadge(campaign.status)}
                  <span className="text-[11px] font-bold text-foreground">{campaign.deliveryRate} delivery</span>
                </div>
              </div>
            ))}
          </CardContent>
        </div>
      </Card>

      {/* Live Event Feed logs */}
      <Card className="flex flex-col justify-between">
        <div>
          <CardHeader>
            <CardTitle>Live Activity Feed</CardTitle>
            <CardDescription>Real-time updates from automated flows and Meta API.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {logEvents.map((log) => (
              <div key={log.id} className="flex gap-3 items-start">
                <div className="shrink-0 mt-0.5">{getLogIcon(log.type)}</div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-xs font-bold text-foreground">{log.user}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{log.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/95 leading-relaxed font-normal">
                    {log.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
