"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, AlertTriangle, Cpu } from "lucide-react"
import { initialNotificationPreferences } from "@/lib/mock-data"

export function NotificationPreferences() {
  const [prefs, setPrefs] = React.useState(initialNotificationPreferences)
  const [isSaved, setIsSaved] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <Card className="border-border/80 shadow-xs text-left font-sans">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-sm font-bold text-foreground">Notification Preferences</CardTitle>
        <CardDescription className="text-[11px]">
          Configure notification channels for campaigns and billing events.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="divide-y divide-border/40">
            {/* Email Notifications */}
            <div className="flex items-center justify-between py-3 first:pt-0">
              <div className="flex gap-3 items-center">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block">Email Invoices & Reports</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">Receive receipts and billing history lists via email.</span>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={prefs.emailNotifications}
                onChange={(e) => setPrefs({ ...prefs, emailNotifications: e.target.checked })}
                className="h-4 w-4 rounded border-border focus:ring-emerald-500 text-emerald-600 cursor-pointer"
              />
            </div>

            {/* WhatsApp Notifications */}
            <div className="flex items-center justify-between py-3">
              <div className="flex gap-3 items-center">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 shrink-0">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block">WhatsApp Notification Webhooks</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">Alert administrative numbers on critical events.</span>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={prefs.whatsappNotifications}
                onChange={(e) => setPrefs({ ...prefs, whatsappNotifications: e.target.checked })}
                className="h-4 w-4 rounded border-border focus:ring-emerald-500 text-emerald-600 cursor-pointer"
              />
            </div>

            {/* Campaign Alerts */}
            <div className="flex items-center justify-between py-3">
              <div className="flex gap-3 items-center">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-600 shrink-0">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block">Campaign Execution Finished</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">Notify when bulk recipient broadcasts conclude execution.</span>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={prefs.campaignAlerts}
                onChange={(e) => setPrefs({ ...prefs, campaignAlerts: e.target.checked })}
                className="h-4 w-4 rounded border-border focus:ring-emerald-500 text-emerald-600 cursor-pointer"
              />
            </div>

            {/* System Updates */}
            <div className="flex items-center justify-between py-3 last:pb-0">
              <div className="flex gap-3 items-center">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 shrink-0">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block">System Feature Releases</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">Receive digests on platform beta feature tools.</span>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={prefs.systemUpdates}
                onChange={(e) => setPrefs({ ...prefs, systemUpdates: e.target.checked })}
                className="h-4 w-4 rounded border-border focus:ring-emerald-500 text-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <Button 
              type="submit" 
              className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
            >
              Save Preferences
            </Button>
            {isSaved && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                ✓ Preferences updated!
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
