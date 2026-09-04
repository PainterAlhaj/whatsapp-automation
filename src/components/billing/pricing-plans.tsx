"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { pricingPlansData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function PricingPlans() {
  const currentPlan = "Professional"
  
  const handleSelectPlan = (planName: string) => {
    if (planName === currentPlan) {
      alert("You are currently subscribed to this plan tier.")
    } else {
      alert(`Notice: Billing & Payment Gateway is currently under implementation. Live upgrades to ${planName} will be available in the upcoming release.`)
    }
  }

  return (
    <div className="space-y-4 text-left">
      <div>
        <h3 className="text-sm font-bold text-foreground">Available Subscription Plans</h3>
        <span className="text-[10px] text-muted-foreground block mt-0.5">
          Select the capacity that matches your marketing volume and team requirements.
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {pricingPlansData.map((plan, idx) => {
          const isCurrent = plan.name === currentPlan
          
          return (
            <Card 
              key={idx} 
              className={cn(
                "relative flex flex-col justify-between border-border/80 shadow-xs transition-all duration-200 overflow-hidden font-sans",
                plan.isPopular && "border-emerald-500/80 ring-1 ring-emerald-500/40 shadow-sm",
                isCurrent && "border-blue-500/80 ring-1 ring-blue-500/40"
              )}
            >
              {/* Popular / Current Badges */}
              {isCurrent && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-blue-600 text-white hover:bg-blue-600 text-[9px] font-bold px-2 py-0.5 border-none">
                    Current Plan
                  </Badge>
                </div>
              )}
              {plan.isPopular && !isCurrent && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-600 text-[9px] font-bold px-2 py-0.5 border-none">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div>
                <CardHeader className="p-5 pb-3">
                  <span className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">{plan.name}</span>
                  <div className="flex items-baseline gap-1 mt-2.5">
                    <span className="text-3xl font-extrabold text-foreground tracking-tight">{plan.price}</span>
                    <span className="text-xs text-muted-foreground">/{plan.billingCycle.split(" ")[1] || "mo"}</span>
                  </div>
                  <CardDescription className="text-xs mt-2.5 leading-relaxed text-muted-foreground/90">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0">
                  <div className="w-full h-px bg-border/40 my-3" />
                  
                  <ul className="space-y-2.5 text-xs text-muted-foreground/90">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              <div className="p-5 pt-0 mt-4">
                <Button 
                  onClick={() => handleSelectPlan(plan.name)}
                  className={cn(
                    "w-full rounded-lg text-xs font-bold py-2 cursor-pointer transition-all",
                    isCurrent 
                      ? "bg-muted text-muted-foreground hover:bg-muted" 
                      : plan.isPopular
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-background border border-border hover:bg-muted/30 text-foreground"
                  )}
                  disabled={isCurrent}
                >
                  {isCurrent 
                    ? "Active Subscription" 
                    : plan.name === "Enterprise" 
                      ? "Contact Sales" 
                      : `Upgrade to ${plan.name}`
                  }
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
