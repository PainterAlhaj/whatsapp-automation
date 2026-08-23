"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { activityTimelineData } from "@/lib/mock-data"
import { Megaphone, FileText, UserPlus, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function ActivityTimeline() {
  const getIcon = (type: string) => {
    switch (type) {
      case "broadcast":
        return <Megaphone className="h-3 w-3 text-blue-600 dark:text-blue-400" />
      case "template":
        return <FileText className="h-3 w-3 text-amber-600 dark:text-amber-400" />
      case "contact":
        return <UserPlus className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
      default:
        return <Zap className="h-3 w-3 text-purple-600 dark:text-purple-400" />
    }
  }

  const getIconBg = (type: string) => {
    switch (type) {
      case "broadcast":
        return "bg-blue-50 dark:bg-blue-950/20 border-blue-200/40 dark:border-blue-900/30"
      case "template":
        return "bg-amber-50 dark:bg-amber-950/20 border-amber-200/40 dark:border-amber-900/30"
      case "contact":
        return "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/40 dark:border-emerald-900/30"
      default:
        return "bg-purple-50 dark:bg-purple-950/20 border-purple-200/40 dark:border-purple-900/30"
    }
  }

  return (
    <Card className="border-border/80 shadow-xs text-left h-full">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-sm font-bold text-foreground">Recent Activity Timeline</CardTitle>
        <CardDescription className="text-[11px]">Real-time feed of automated jobs and broadcast alerts</CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="relative border-l border-border/80 pl-4 ml-2.5 py-1 space-y-4">
          {activityTimelineData.map((item) => (
            <div key={item.id} className="relative font-sans text-xs">
              {/* Dot Icon marker */}
              <div className={cn(
                "absolute -left-[27px] top-0.5 p-1 rounded-full border bg-background shrink-0 select-none",
                getIconBg(item.type)
              )}>
                {getIcon(item.type)}
              </div>

              <div>
                <span className="text-[10px] text-muted-foreground font-medium block">
                  {item.timestamp}
                </span>
                <span className="text-foreground leading-normal mt-0.5 block font-medium">
                  {item.message}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
