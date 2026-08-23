"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog"
import { CreditCard, Trash2, Plus } from "lucide-react"
import { paymentMethodsData, PaymentMethodItem } from "@/lib/mock-data"

export function PaymentMethods() {
  const [cards, setCards] = React.useState<PaymentMethodItem[]>(paymentMethodsData)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  // Form states
  const [cardBrand, setCardBrand] = React.useState<"Visa" | "MasterCard" | "AmericanExpress">("Visa")
  const [cardNumber, setCardNumber] = React.useState("")
  const [expiry, setExpiry] = React.useState("")
  const [cvv, setCvv] = React.useState("")
  const [isDefault, setIsDefault] = React.useState(false)

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Extract last 4 digits
    const cleanedNum = cardNumber.replace(/\D/g, "")
    const last4 = cleanedNum.slice(-4) || "9988"
    
    const newCard: PaymentMethodItem = {
      id: `pm_${Date.now()}`,
      brand: cardBrand,
      last4,
      expiry: expiry || "12/30",
      isDefault
    }

    let updatedCards = [...cards]
    if (isDefault) {
      // Clear other default badges
      updatedCards = updatedCards.map(c => ({ ...c, isDefault: false }))
    }
    
    setCards([...updatedCards, newCard])
    setIsModalOpen(false)
    
    // Reset Form
    setCardNumber("")
    setExpiry("")
    setCvv("")
    setIsDefault(false)
  }

  const handleDeleteCard = (id: string) => {
    const cardToDelete = cards.find(c => c.id === id)
    if (cardToDelete?.isDefault && cards.length > 1) {
      alert("Please designate another card as default before deleting your primary payment method.")
      return
    }
    setCards(cards.filter(c => c.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setCards(cards.map(c => ({
      ...c,
      isDefault: c.id === id
    })))
  }

  return (
    <div className="space-y-4 text-left font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Saved Payment Methods</h3>
          <span className="text-[10px] text-muted-foreground block mt-0.5">
            Cards used for subscription billing and Meta conversational messaging.
          </span>
        </div>

        {/* Add card dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-8 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer gap-1">
              <Plus className="h-3.5 w-3.5" /> Add Card
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <form onSubmit={handleAddCard}>
              <DialogHeader>
                <DialogTitle className="text-sm font-bold">Add Credit or Debit Card</DialogTitle>
                <DialogDescription className="text-[10px] text-muted-foreground">
                  Your payments are encrypted and secured via Stripe integration.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 my-4 text-xs">
                {/* Brand selection */}
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Card Brand</label>
                  <select 
                    value={cardBrand}
                    onChange={(e) => setCardBrand(e.target.value as "Visa" | "MasterCard" | "AmericanExpress")}
                    className="w-full h-8 px-2 bg-background border border-border rounded-lg text-xs focus:outline-none"
                  >
                    <option value="Visa">Visa</option>
                    <option value="MasterCard">MasterCard</option>
                    <option value="AmericanExpress">American Express</option>
                  </select>
                </div>

                {/* Card number */}
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Card Number</label>
                  <Input 
                    type="text" 
                    placeholder="4111 2222 3333 4444" 
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="h-8 text-xs placeholder:text-muted-foreground/50"
                  />
                </div>

                {/* Grid for Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Expiry Date</label>
                    <Input 
                      type="text" 
                      placeholder="MM/YY" 
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="h-8 text-xs placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Security CVV</label>
                    <Input 
                      type="password" 
                      placeholder="***" 
                      maxLength={4}
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="h-8 text-xs placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

                {/* Make default checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="isDefaultCheck" 
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded border-border focus:ring-emerald-500 text-emerald-600 cursor-pointer"
                  />
                  <label htmlFor="isDefaultCheck" className="font-medium text-[11px] text-muted-foreground cursor-pointer select-none">
                    Designate as default payment card
                  </label>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer border border-transparent"
                >
                  Save Card
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Credit cards render cards list */}
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.length === 0 ? (
          <div className="sm:col-span-2 border border-dashed border-border/80 rounded-xl p-8 text-center text-muted-foreground italic text-xs">
            {"No payment methods stored yet. Click 'Add Card' to register a billing card."}
          </div>
        ) : (
          cards.map((card) => (
            <Card 
              key={card.id} 
              className={`border-border/80 shadow-xs hover:border-emerald-500/50 transition-colors cursor-default ${
                card.isDefault && "border-emerald-500/50 bg-emerald-500/[0.01]"
              }`}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted/60 border border-border/30 rounded-lg shrink-0">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-foreground">{card.brand} ending in {card.last4}</span>
                      {card.isDefault && (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 border-none font-semibold text-[8px] px-1 py-0 select-none">
                          Default
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">Expires {card.expiry}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!card.isDefault && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSetDefault(card.id)}
                      className="h-7 px-1.5 text-[9px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer rounded-md"
                    >
                      Make Default
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteCard(card.id)}
                    className="h-7 px-1.5 text-muted-foreground hover:text-red-600 cursor-pointer rounded-md"
                    title="Remove Card"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
