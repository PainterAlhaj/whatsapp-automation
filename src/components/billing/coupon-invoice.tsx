"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Ticket, Calculator } from "lucide-react"

export function CouponInvoice() {
  const [couponCode, setCouponCode] = React.useState("")
  const [appliedDiscount, setAppliedDiscount] = React.useState<number | null>(null)
  const [couponError, setCouponError] = React.useState("")
  const [couponSuccess, setCouponSuccess] = React.useState("")

  const baseRate = 79.00
  const overages = 12.50 // Meta API billing charges

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    setCouponError("")
    setCouponSuccess("")

    const cleanCode = couponCode.trim().toUpperCase()
    if (cleanCode === "SAVINGS20") {
      setAppliedDiscount(20) // 20% Discount
      setCouponSuccess("Coupon code SAVINGS20 applied! 20% discount activated on base rate.")
    } else if (cleanCode === "") {
      setCouponError("Please enter a valid coupon code.")
    } else {
      setCouponError("Invalid or expired coupon code. Try 'SAVINGS20'.")
      setAppliedDiscount(null)
    }
  }

  const discountAmount = appliedDiscount ? (baseRate * appliedDiscount) / 100 : 0
  const estimatedTotal = baseRate - discountAmount + overages

  return (
    <div className="grid gap-6 md:grid-cols-2 text-left font-sans">
      {/* Coupon section */}
      <Card className="border-border/80 shadow-xs flex flex-col justify-between">
        <div>
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <Ticket className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Promotions & Coupons
            </CardTitle>
            <CardDescription className="text-[11px]">
              Apply active vouchers to discount your next base plan cycle renewal.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <Input 
                type="text" 
                placeholder="Enter coupon (e.g. SAVINGS20)" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="h-9 text-xs focus-visible:ring-emerald-500/80"
              />
              <Button 
                type="submit" 
                className="h-9 px-4 bg-background border border-border hover:bg-muted text-foreground rounded-lg text-xs font-semibold cursor-pointer"
              >
                Apply
              </Button>
            </form>

            {couponError && (
              <p className="text-[10px] text-red-600 dark:text-red-400 font-medium">
                {couponError}
              </p>
            )}
            {couponSuccess && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                {couponSuccess}
              </p>
            )}

            <div className="p-3 rounded-lg bg-muted/40 border border-border/30 text-[10px] text-muted-foreground leading-relaxed">
              💡 <strong>Available Voucher Alert:</strong> Type <strong className="text-foreground font-mono bg-background px-1 py-0.5 rounded border border-border/80">SAVINGS20</strong> in the field above to activate a simulated 20% discount.
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Estimated Next Invoice */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Estimated Next Invoice
          </CardTitle>
          <CardDescription className="text-[11px]">
            Projected summary due on next billing renewal date: <strong>July 25, 2026</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-3">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground">Professional Plan Renewal Rate</span>
              <span className="font-semibold text-foreground font-mono">${baseRate.toFixed(2)}</span>
            </div>

            {appliedDiscount !== null && (
              <div className="flex justify-between items-center py-1 border-t border-dashed border-border/40 text-emerald-600 dark:text-emerald-400">
                <span className="font-medium">Promotional Discount ({appliedDiscount}%)</span>
                <span className="font-bold font-mono">- ${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-1 border-t border-dashed border-border/40">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Meta API Conversation Charges</span>
                <span className="text-[9px] text-muted-foreground/80 mt-0.5">Overage fees on 1,250 sessions</span>
              </div>
              <span className="font-semibold text-foreground font-mono">${overages.toFixed(2)}</span>
            </div>

            <div className="w-full h-px bg-border/40 my-2" />

            <div className="flex justify-between items-center py-2 text-sm font-bold">
              <span className="text-foreground">Estimated Total Due</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-base">
                ${estimatedTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
