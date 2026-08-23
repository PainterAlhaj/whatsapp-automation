"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { shortcutActions } from "@/lib/mock-data"

export function QuickActions() {
  return (
    <Card className="text-left">
      <CardHeader>
        <CardTitle>Quick Shortcuts</CardTitle>
        <CardDescription>Direct navigation routes to configure features.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {shortcutActions.map((action, idx) => (
          <Link
            key={idx}
            href={action.href}
            className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-muted/10 hover:bg-muted/40 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer"
          >
            <div className={cn("p-2 rounded-lg shrink-0 transition-transform duration-250 group-hover:scale-105", action.color)}>
              <action.icon className="h-4.5 w-4.5" />
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <span className="text-xs font-bold text-foreground block truncate">{action.title}</span>
              <span className="text-[10px] text-muted-foreground block truncate mt-0.5">{action.description}</span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
