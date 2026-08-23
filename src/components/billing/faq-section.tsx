"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ChevronDown, HelpCircle } from "lucide-react"
import { billingFaqsData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function FaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0) // default open first

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <Card className="border-border/80 shadow-xs text-left font-sans">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Frequently Asked Questions
        </CardTitle>
        <CardDescription className="text-[11px]">
          Answers to common questions regarding our pricing tiers, Meta conversation limits, and payments.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0 divide-y divide-border/40">
        {billingFaqsData.map((faq, idx) => {
          const isOpen = openIndex === idx
          
          return (
            <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between text-xs font-semibold text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus:outline-none cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-4",
                  isOpen && "rotate-180 text-emerald-500"
                )} />
              </button>

              <div className={cn(
                "grid transition-all duration-200 ease-in-out overflow-hidden text-[11px] text-muted-foreground/90 leading-relaxed",
                isOpen ? "grid-rows-[1fr] mt-2 opacity-100" : "grid-rows-[0fr] opacity-0"
              )}>
                <div className="overflow-hidden">
                  {faq.answer}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
