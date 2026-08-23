"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Key, Eye, EyeOff, Copy, RefreshCw, ServerCrash, Check } from "lucide-react"
import { initialApiWebhookSettings } from "@/lib/mock-data"

export function ApiWebhooks() {
  const [apiSettings, setApiSettings] = React.useState(initialApiWebhookSettings)
  const [isKeyVisible, setIsKeyVisible] = React.useState(false)
  const [isCopied, setIsCopied] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiSettings.apiKey)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleRegenerateKey = () => {
    const confirmation = window.confirm(
      "Are you sure you want to regenerate this API Key? Any existing applications or active scripts using the current key will be disconnected immediately."
    )
    if (confirmation) {
      const generated = "wf_live_" + Array.from({length: 30}, () => Math.floor(Math.random()*16).toString(16)).join("")
      setApiSettings({ ...apiSettings, apiKey: generated })
      alert("Successfully issued a new live API Key token.")
    }
  }

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="space-y-6 text-left font-sans text-xs">
      
      {/* API Key Panel */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">API Credentials</CardTitle>
          <CardDescription className="text-[11px]">
            Authenticate external software and custom integrations with the outbound messaging queue.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">
          <div className="space-y-1.5">
            <label className="font-bold text-muted-foreground">Active Private API Key</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  type={isKeyVisible ? "text" : "password"} 
                  value={apiSettings.apiKey}
                  readOnly
                  className="h-8 pl-8 pr-10 text-xs font-mono bg-muted/20 focus-visible:ring-0 cursor-default select-all"
                />
                <button
                  type="button"
                  onClick={() => setIsKeyVisible(!isKeyVisible)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
                  title={isKeyVisible ? "Hide key" : "Show key"}
                >
                  {isKeyVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>

              <Button 
                onClick={handleCopyKey}
                className="h-8 px-2.5 bg-background border border-border hover:bg-muted text-foreground rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0"
              >
                {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500 animate-pulse" /> : <Copy className="h-3.5 w-3.5" />}
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="pt-1">
            <Button 
              onClick={handleRegenerateKey}
              className="h-8 px-3 text-xs font-semibold bg-background border border-border hover:bg-muted text-foreground rounded-lg cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" /> Regenerate API Key
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration Panel */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">Inbound Message Webhooks</CardTitle>
          <CardDescription className="text-[11px]">
            Forward conversation reads, contact subscriptions, and custom replies to your server.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <form onSubmit={handleSaveWebhook} className="space-y-4">
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Webhook Destination URL</label>
              <div className="relative">
                <ServerCrash className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  type="url" 
                  value={apiSettings.webhookUrl} 
                  onChange={(e) => setApiSettings({ ...apiSettings, webhookUrl: e.target.value })}
                  placeholder="https://yourdomain.com/webhooks/whatsapp"
                  className="h-8 pl-8 text-xs focus-visible:ring-emerald-500/80" 
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button 
                type="submit" 
                className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
              >
                Save Endpoint
              </Button>
              {isSaved && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                  ✓ Webhook saved!
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

    </div>
  )
}
