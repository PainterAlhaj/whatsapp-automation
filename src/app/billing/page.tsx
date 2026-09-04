"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { Sparkles, EyeOff, Eye, AlertCircle, Wrench, ShieldAlert, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

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
  const [isNoticeModalOpen, setIsNoticeModalOpen] = React.useState(false)

  const handleUpgradeClick = () => {
    setIsNoticeModalOpen(true)
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

      {/* Professional "Under Implementation" Notice Banner */}
      <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200 backdrop-blur-sm flex items-start gap-3 shadow-xs">
        <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
          <Wrench className="h-5 w-5" />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
              Billing Gateway — Under Active Implementation
            </h4>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              Feature Preview Mode
            </span>
          </div>
          <p className="text-xs text-amber-800/90 dark:text-amber-200/90 mt-1 leading-relaxed">
            Notice: The Billing & Payment Gateway module is currently under active implementation. All plan figures, subscription metrics, and payment options shown on this page are provided for UI/UX demonstration purposes. Live payment processing (Stripe / Razorpay) will be enabled in an upcoming release.
          </p>
        </div>
      </div>
      
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

      {/* Under Implementation Modal Popup */}
      <Dialog open={isNoticeModalOpen} onOpenChange={setIsNoticeModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Wrench className="h-5 w-5" /> Module Under Implementation
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed pt-2 text-left">
              The Payment Gateway and Plan Subscription system is currently undergoing active engineering integration.
              <br /><br />
              Live payment checkout and automated invoice generation will be launched in the next platform release. Thank you for your patience during this preview phase!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <Button
              size="sm"
              onClick={() => setIsNoticeModalOpen(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold px-4 cursor-pointer"
            >
              Understood
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
