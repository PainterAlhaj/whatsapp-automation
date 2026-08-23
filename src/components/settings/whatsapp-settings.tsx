"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, ShieldCheck } from "lucide-react"
import { initialWhatsAppSettings } from "@/lib/mock-data"

export function WhatsAppSettings() {
  const [waSettings] = React.useState(initialWhatsAppSettings)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleReconnect = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      alert("Successfully re-established Meta API Gateway session channels.")
    }, 1500)
  }

  return (
    <Card className="border-border/80 shadow-xs text-left font-sans">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-foreground">WhatsApp Business Profile</CardTitle>
            <CardDescription className="text-[11px]">
              Meta API Cloud settings and telephone gateway connections.
            </CardDescription>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 border-none font-bold text-[9px] px-2 py-0.5 select-none uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {waSettings.connectionStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-5 text-xs">
        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          {/* Connected number */}
          <div className="p-3 bg-muted/30 border border-border/40 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Registered Phone Number</span>
            <span className="text-sm font-bold text-foreground block font-mono">{waSettings.connectedNumber}</span>
          </div>

          {/* Business Display Name */}
          <div className="p-3 bg-muted/30 border border-border/40 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Meta Display Identifier</span>
            <span className="text-sm font-bold text-foreground block">{waSettings.businessDisplayName}</span>
          </div>
        </div>

        {/* Info box */}
        <div className="flex gap-2.5 p-3 rounded-lg bg-emerald-500/[0.02] border border-emerald-500/20 text-muted-foreground text-[11px] leading-relaxed">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong>Meta Developer Verification Complete:</strong> Your display identifier is vetted and verified by Meta Cloud services. Template limits are set to 100,000 unique destination numbers daily.
          </div>
        </div>

        {/* Controls */}
        <div className="pt-2 flex gap-3">
          <Button 
            onClick={handleReconnect}
            disabled={isRefreshing}
            className="h-8 px-3 text-xs font-semibold bg-background border border-border hover:bg-muted text-foreground rounded-lg cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing && "animate-spin text-emerald-500"}`} /> 
            {isRefreshing ? "Refreshing API..." : "Reconnect Gateway"}
          </Button>
          <Button 
            variant="outline"
            onClick={() => alert("Redirecting to Meta Developer Console permissions wizard.")}
            className="h-8 px-3 text-xs font-semibold border-border/80 text-foreground hover:bg-muted/30 rounded-lg cursor-pointer"
          >
            Meta Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
