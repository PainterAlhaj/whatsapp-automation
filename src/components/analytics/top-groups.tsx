"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { groupPerformanceData } from "@/lib/mock-data"

export function TopGroups() {
  return (
    <Card className="border-border/80 shadow-xs text-left h-full">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-sm font-bold text-foreground">Top Contact Groups</CardTitle>
        <CardDescription className="text-[11px]">Subscribers segments sorted by reply rates engagement</CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-4">
        {groupPerformanceData.slice(0, 4).map((group, idx) => (
          <div key={idx} className="flex items-center justify-between pb-3 border-b border-border/40 last:border-b-0 last:pb-0 font-sans">
            <div>
              <span className="text-xs font-semibold text-foreground block">{group.name}</span>
              <span className="text-[10px] text-muted-foreground block mt-0.5">
                {group.contacts.toLocaleString()} contacts • {group.messagesSent.toLocaleString()} messages
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                {group.engagement}%
              </span>
              <span className="text-[9px] text-muted-foreground uppercase font-mono block">
                Engagement
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
