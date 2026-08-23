"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { templatePerformanceData } from "@/lib/mock-data"

export function TopTemplates() {
  return (
    <Card className="border-border/80 shadow-xs text-left h-full">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-sm font-bold text-foreground">Top Performing Templates</CardTitle>
        <CardDescription className="text-[11px]">Most utilized template structures and conversation responses</CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-4">
        {templatePerformanceData.slice(0, 4).map((tpl, idx) => (
          <div key={idx} className="space-y-1.5 pb-3 border-b border-border/40 last:border-b-0 last:pb-0 font-sans">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground truncate max-w-[150px]">{tpl.name}</span>
              <span className="text-[10px] text-muted-foreground bg-muted/40 font-mono px-1.5 py-0.5 rounded-full font-medium">
                {tpl.usageCount.toLocaleString()} uses
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[10px] text-muted-foreground pt-0.5">
              <div>
                <div className="flex justify-between mb-0.5 font-medium">
                  <span>Delivery Success</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{tpl.deliveryRate}%</span>
                </div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${tpl.deliveryRate}%` }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-0.5 font-medium">
                  <span>Reply Conversion</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">{tpl.replyRate}%</span>
                </div>
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${tpl.replyRate}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
