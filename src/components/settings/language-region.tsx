"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Calendar, DollarSign } from "lucide-react"
import { initialRegionalSettings } from "@/lib/mock-data"

export function LanguageRegion() {
  const [regional, setRegional] = React.useState(initialRegionalSettings)
  const [isSaved, setIsSaved] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <Card className="border-border/80 shadow-xs text-left font-sans">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-sm font-bold text-foreground">Language & Regional Preferences</CardTitle>
        <CardDescription className="text-[11px]">
          Define localization configurations, number parsing styles, and currency signs.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid gap-4 sm:grid-cols-2">
            
            {/* Language */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Default Interface Language</label>
              <div className="relative">
                <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <select 
                  value={regional.language}
                  onChange={(e) => setRegional({ ...regional, language: e.target.value })}
                  className="w-full h-8 pl-8 pr-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all font-sans"
                >
                  <option value="en-US">English (United States)</option>
                  <option value="es-ES">Spanish (Spain)</option>
                  <option value="hi-IN">Hindi (India)</option>
                  <option value="fr-FR">French (France)</option>
                </select>
              </div>
            </div>

            {/* Date format */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Calendar Date Representation</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <select 
                  value={regional.dateFormat}
                  onChange={(e) => setRegional({ ...regional, dateFormat: e.target.value })}
                  className="w-full h-8 pl-8 pr-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all font-sans"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-06-30)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 30/06/2026)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 06/30/2026)</option>
                </select>
              </div>
            </div>

            {/* Currency selection */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Invoice Base Currency</label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <select 
                  value={regional.currency}
                  onChange={(e) => setRegional({ ...regional, currency: e.target.value })}
                  className="w-full h-8 pl-8 pr-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all font-sans"
                >
                  <option value="USD ($)">USD ($) - US Dollar</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                  <option value="GBP (£)">GBP (£) - British Pound</option>
                  <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                </select>
              </div>
            </div>

            {/* Time format */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground block mb-2">Display Clock Style</label>
              <div className="flex gap-4 items-center h-8">
                <div className="flex items-center gap-1.5">
                  <input 
                    type="radio" 
                    id="time12h" 
                    name="timeFormat"
                    checked={regional.timeFormat === "12h"}
                    onChange={() => setRegional({ ...regional, timeFormat: "12h" })}
                    className="focus:ring-emerald-500 text-emerald-600 cursor-pointer"
                  />
                  <label htmlFor="time12h" className="font-semibold text-foreground cursor-pointer select-none">12-Hour format (AM/PM)</label>
                </div>
                <div className="flex items-center gap-1.5">
                  <input 
                    type="radio" 
                    id="time24h" 
                    name="timeFormat"
                    checked={regional.timeFormat === "24h"}
                    onChange={() => setRegional({ ...regional, timeFormat: "24h" })}
                    className="focus:ring-emerald-500 text-emerald-600 cursor-pointer"
                  />
                  <label htmlFor="time24h" className="font-semibold text-foreground cursor-pointer select-none">24-Hour Military format</label>
                </div>
              </div>
            </div>

          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button 
              type="submit" 
              className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
            >
              Save Localization
            </Button>
            {isSaved && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                ✓ Locale updated!
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
