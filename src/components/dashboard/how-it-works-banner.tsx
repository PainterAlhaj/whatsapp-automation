"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  ArrowRight,
  Plug,
  Users,
  FileText,
  Send,
  Sparkles,
  CheckCircle2
} from "lucide-react"

const setupSteps = [
  {
    step: 1,
    title: "Meta API",
    desc: "Cloud API Token",
    icon: Plug,
    badge: "Connected",
    done: true
  },
  {
    step: 2,
    title: "Import Contacts",
    desc: "E.164 Phone Formatting",
    icon: Users,
    badge: "Ready",
    done: true
  },
  {
    step: 3,
    title: "Submit Templates",
    desc: "Meta HSM Approval",
    icon: FileText,
    badge: "Approved",
    done: true
  },
  {
    step: 4,
    title: "Broadcast & Chat",
    desc: "Campaigns & Live Chat",
    icon: Send,
    badge: "Active",
    done: true
  }
]

export function HowItWorksBanner() {
  return (
    <Card className="relative overflow-hidden border border-emerald-500/25 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-zinc-900 text-white shadow-xl">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      <CardContent className="p-5 sm:p-6 space-y-5 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>Interactive Onboarding Guide</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              Need Help Setting Up Your WhatsApp Automation?
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Explore our step-by-step visual master guide covering Meta Cloud API setup, contact formatting, template approval, and broadcast execution.
            </p>
          </div>

          <Link href="/how-it-works" className="shrink-0">
            <Button
              size="sm"
              className="h-9 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer border-none flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <span>Explore Master Guide</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* 4-Step Visual Progress Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-white/10">
          {setupSteps.map((item) => {
            const IconComp = item.icon
            return (
              <Link
                key={item.step}
                href="/how-it-works"
                className="group flex flex-col p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <IconComp className="h-3.5 w-3.5" />
                  </div>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-emerald-400/30 text-emerald-300 bg-emerald-950/40">
                    Step {item.step}
                  </Badge>
                </div>
                <div className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition-colors truncate">
                  {item.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {item.desc}
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
