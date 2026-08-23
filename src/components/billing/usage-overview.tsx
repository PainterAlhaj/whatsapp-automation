"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Link2, Users, HardDrive } from "lucide-react"

export function UsageOverview() {
  const metrics = [
    {
      title: "Messages Used",
      value: "34,512",
      limit: "50,000",
      percent: 69,
      icon: <Send className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      colorClass: "bg-blue-500",
      description: "Resets on July 25, 2026"
    },
    {
      title: "WhatsApp Accounts",
      value: "4",
      limit: "5",
      percent: 80,
      icon: <Link2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />,
      colorClass: "bg-purple-500",
      description: "Active message webhooks"
    },
    {
      title: "Contacts Used",
      value: "1,248",
      limit: "2,500",
      percent: 50,
      icon: <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
      colorClass: "bg-emerald-500",
      description: "Directory subscribers limit"
    },
    {
      title: "Storage Usage",
      value: "1.2 GB",
      limit: "5.0 GB",
      percent: 24,
      icon: <HardDrive className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      colorClass: "bg-amber-500",
      description: "Media uploads & templates"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-left">
      {metrics.map((item, idx) => (
        <Card key={idx} className="border-border/80 shadow-xs hover:shadow-md transition-all cursor-default">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground">{item.title}</span>
              <div className="p-1.5 rounded-lg bg-muted/50 border border-border/20">
                {item.icon}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tight text-foreground">{item.value}</span>
                <span className="text-xs text-muted-foreground">/ {item.limit}</span>
              </div>

              {/* Progress gauge */}
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-3">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${item.colorClass}`}
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>

            <div className="mt-2.5 flex justify-between items-center text-[10px] text-muted-foreground/90">
              <span>{item.description}</span>
              <span className="font-bold text-foreground">{item.percent}%</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
