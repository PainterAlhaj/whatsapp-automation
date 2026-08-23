"use client"

import * as React from "react"
import Link from "next/link"
import { ShieldCheck, Sparkles, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { subscriptionStatus } from "@/lib/mock-data"

export function SubscriptionStatus() {
  const { planName, used, remaining, percentage, renewalDate } = subscriptionStatus

  return (
    <Card className="text-left flex flex-col h-full justify-between">
      <CardContent className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-800/20">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Plan Type</span>
                <span className="text-sm font-bold text-foreground">{planName}</span>
              </div>
            </div>
            <Badge variant="success">Active</Badge>
          </div>

          {/* Quota Progress Bar */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-muted-foreground/90 font-medium">Message Limit Usage</span>
              <span className="text-xs font-bold text-foreground">{percentage}%</span>
            </div>

            <div className="w-full bg-muted dark:bg-zinc-800/50 rounded-full h-2 overflow-hidden border border-border/30">
              <div 
                className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex justify-between text-xs font-medium pt-1">
              <span className="text-muted-foreground">{used.toLocaleString()} sent</span>
              <span className="text-foreground">{remaining.toLocaleString()} remaining</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/60 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground/95">Next billing date:</span>
            <span className="font-semibold text-foreground">{renewalDate}</span>
          </div>

          <div className="flex gap-2.5">
            <Button variant="outline" size="sm" asChild className="flex-1 rounded-lg font-semibold text-xs py-2 cursor-pointer border-border/80">
              <Link href="/billing" className="flex items-center justify-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" /> Billing
              </Link>
            </Button>
            <Button size="sm" asChild className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs py-2 cursor-pointer border border-transparent">
              <Link href="/billing" className="flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-200" /> Upgrade
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
