"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Sparkles, EyeOff, Eye, AlertCircle } from "lucide-react"

// Billing Components
import { CurrentSubscription } from "@/components/billing/current-subscription"
import { UsageOverview } from "@/components/billing/usage-overview"
import { PricingPlans } from "@/components/billing/pricing-plans"
import { PaymentMethods } from "@/components/billing/payment-methods"
import { BillingHistory } from "@/components/billing/billing-history"
import { CouponInvoice } from "@/components/billing/coupon-invoice"
import { FaqSection } from "@/components/billing/faq-section"

export default function BillingPage() {
  const [isEmptyState, setIsEmptyState] = React.useState(false)

  const handleUpgradeClick = () => {
    // Scroll smoothly to pricing
    const pricingEl = document.getElementById("pricing-section")
    if (pricingEl) {
      pricingEl.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Billing & Subscription"
        description="Manage subscription plans, track message usage thresholds, configure saved credit cards, and review receipts."
      >
        <div className="flex items-center gap-2">
          {/* Switch View Toggle (Empty State Simulation) */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEmptyState(!isEmptyState)}
            className="h-9 px-3 rounded-lg border border-border/80 text-xs font-semibold cursor-pointer gap-1.5"
            title="Toggle between active subscription and empty billing state for verification"
          >
            {isEmptyState ? (
              <>
                <Eye className="h-4 w-4 text-emerald-500" /> Active Subscription
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 text-muted-foreground" /> Simulated Empty State
              </>
            )}
          </Button>

          {!isEmptyState && (
            <Button 
              onClick={handleUpgradeClick}
              className="h-9 px-3 text-xs md:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer border border-transparent gap-1.5"
            >
              <Sparkles className="h-4 w-4" /> Upgrade Plan
            </Button>
          )}
        </div>
      </PageHeader>
      
      {isEmptyState ? (
        /* Empty State Billing UI */
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="border border-dashed border-border/80 rounded-xl p-12 text-center flex flex-col items-center justify-center bg-card shadow-xs">
            <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 mb-5 text-red-500">
              <AlertCircle className="h-9 w-9 text-red-500" />
            </div>
            <h3 className="font-bold text-sm text-foreground mb-1">No active subscription detected</h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
              Your account current billing cycle has expired or plan was cancelled. Select a plan below to resume sending automation broadcasts.
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => setIsEmptyState(false)} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer border border-transparent"
              >
                Restore Demo Active State
              </Button>
            </div>
          </div>

          {/* Pricing cards rendered below empty state so the user can easily select one */}
          <div id="pricing-section">
            <PricingPlans />
          </div>
        </div>
      ) : (
        /* Rich Active Subscription View */
        <div className="space-y-8">
          {/* 1. Subscription Details Card */}
          <CurrentSubscription />

          {/* 2. Usage Overview Progress Cards */}
          <UsageOverview />

          {/* 3. Pricing Tier Matrix */}
          <div id="pricing-section">
            <PricingPlans />
          </div>

          {/* 4. Credit Cards and Promo Code calculations split row */}
          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            <PaymentMethods />
            <CouponInvoice />
          </div>

          {/* 5. Invoices lists and FAQ splits row */}
          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            <BillingHistory />
            <FaqSection />
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
