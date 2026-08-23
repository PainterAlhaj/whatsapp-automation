"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Calendar, Ban } from "lucide-react"

export function CurrentSubscription() {
  const handleUpgradeClick = () => {
    alert("Scroll down to the pricing sheet to select your preferred package upgrades.")
  }

  const handleCancelClick = () => {
    const confirmation = window.confirm(
      "Are you sure you want to cancel your Professional Plan? You will lose access to automated workflows, templated variables, and visual flowchart nodes at the end of the billing period."
    )
    if (confirmation) {
      alert("Subscription cancellation scheduled. Your Professional Plan remains active until July 25, 2026.")
    }
  }

  return (
    <Card className="border-border/80 shadow-xs text-left font-sans">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-foreground">Current Subscription Plan</CardTitle>
            <CardDescription className="text-[11px]">
              Summary details regarding your active account credentials and pricing cycle.
            </CardDescription>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 border-none font-bold text-[9px] px-2 py-0.5 select-none uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 pt-2">
          {/* Plan details */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Plan Name</span>
            <span className="text-sm font-bold text-foreground block">Professional Plan</span>
          </div>

          {/* Pricing Details */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Plan Cost</span>
            <span className="text-sm font-bold text-foreground block font-mono">$79.00 <span className="text-[10px] text-muted-foreground font-normal">/ month</span></span>
          </div>

          {/* Billing Cycle */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Billing Cycle</span>
            <span className="text-sm font-bold text-foreground block">Monthly</span>
          </div>

          {/* Next Invoice Renewal Date */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Renewal Date</span>
            <span className="text-sm font-bold text-foreground block flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              July 25, 2026
            </span>
          </div>
        </div>

        <div className="w-full h-px bg-border/40 my-5" />

        <div className="flex flex-wrap items-center gap-3">
          <Button 
            onClick={handleUpgradeClick}
            className="h-9 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer border border-transparent gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" /> Upgrade Plan
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCancelClick}
            className="h-9 px-4 text-xs font-semibold border-border/80 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg cursor-pointer gap-1.5"
          >
            <Ban className="h-3.5 w-3.5" /> Cancel Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
