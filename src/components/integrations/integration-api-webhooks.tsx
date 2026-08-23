"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Eye, EyeOff, Copy, RefreshCw, ServerCrash, Check, Globe } from "lucide-react";
import { toast } from "@/components/ui/toast";

export function IntegrationApiWebhooks() {
  const [apiKey, setApiKey] = React.useState("wf_live_55a123f8e9cd40939a2be10c9d92e8");
  
  // Backend webhook URL endpoint from specification: /api/v1/webhook/meta
  const defaultWebhookUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1") + "/webhook/meta";
  const [webhookUrl, setWebhookUrl] = React.useState(defaultWebhookUrl);
  const webhookSecret = "whatsapp_secure_webhook_token_2026";

  const [isKeyVisible, setIsKeyVisible] = React.useState(false);
  const [isSecretVisible, setIsSecretVisible] = React.useState(false);
  const [isKeyCopied, setIsKeyCopied] = React.useState(false);
  const [isSecretCopied, setIsSecretCopied] = React.useState(false);
  const [isUrlCopied, setIsUrlCopied] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);

  // Event Selection List state matching Meta Webhook Event Processor
  const [events, setEvents] = React.useState({
    messageSent: true,
    messageDelivered: true,
    messageRead: true,
    webhookFailure: false
  });

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setIsKeyCopied(true);
    setTimeout(() => setIsKeyCopied(false), 2000);
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(webhookSecret);
    setIsSecretCopied(true);
    setTimeout(() => setIsSecretCopied(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setIsUrlCopied(true);
    setTimeout(() => setIsUrlCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    const confirmation = window.confirm(
      "Are you sure you want to regenerate this API Key? Existing client integrations using this token will fail immediately."
    );
    if (confirmation) {
      const generated = "wf_live_" + Array.from({length: 30}, () => Math.floor(Math.random()*16).toString(16)).join("");
      setApiKey(generated);
      toast.success("Successfully issued a new live API Key token.", "API Key Regenerated");
    }
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    toast.success("Webhook configuration updated successfully.", "Saved");
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 text-left font-sans text-xs">
      
      {/* API Keys Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">Outbound developer credentials</CardTitle>
          <CardDescription className="text-[11px]">
            Authenticate script requests and sync outbound WhatsApp sequences with private backends.
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
                  value={apiKey}
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
                {isKeyCopied ? <Check className="h-3.5 w-3.5 text-emerald-500 animate-pulse" /> : <Copy className="h-3.5 w-3.5" />}
                {isKeyCopied ? "Copied!" : "Copy"}
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

      {/* Webhooks Config Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">Inbound Event Webhooks (Backend Only)</CardTitle>
          <CardDescription className="text-[11px]">
            Meta Cloud Platform sends real-time conversational events (messages and status updates) to this backend callback endpoint.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <form onSubmit={handleSaveWebhook} className="space-y-4">
            
            {/* Meta Webhook Endpoint URL */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground flex items-center justify-between">
                <span>Meta Callback Endpoint URL</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">GET & POST /api/v1/webhook/meta</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input 
                    type="url" 
                    value={webhookUrl} 
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://yourdomain.com/api/v1/webhook/meta"
                    className="h-8 pl-8 text-xs font-mono focus-visible:ring-emerald-500/80" 
                    required
                  />
                </div>
                <Button 
                  type="button"
                  onClick={handleCopyUrl}
                  className="h-8 px-2.5 bg-background border border-border hover:bg-muted text-foreground rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0"
                >
                  {isUrlCopied ? <Check className="h-3.5 w-3.5 text-emerald-500 animate-pulse" /> : <Copy className="h-3.5 w-3.5" />}
                  {isUrlCopied ? "Copied!" : "Copy URL"}
                </Button>
              </div>
            </div>

            {/* Verify Token for Meta Handshake */}
            <div className="space-y-1.5">
              <label className="font-bold text-muted-foreground">Meta Webhook Verification Token (<code className="text-[9px] font-mono">hub.verify_token</code>)</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Key className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input 
                    type={isSecretVisible ? "text" : "password"} 
                    value={webhookSecret}
                    readOnly
                    className="h-8 pl-8 pr-10 text-xs font-mono bg-muted/20 focus-visible:ring-0 cursor-default select-all"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSecretVisible(!isSecretVisible)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer"
                  >
                    {isSecretVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <Button 
                  type="button"
                  onClick={handleCopySecret}
                  className="h-8 px-2.5 bg-background border border-border hover:bg-muted text-foreground rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 shrink-0"
                >
                  {isSecretCopied ? <Check className="h-3.5 w-3.5 text-emerald-500 animate-pulse" /> : <Copy className="h-3.5 w-3.5" />}
                  {isSecretCopied ? "Copied!" : "Copy Token"}
                </Button>
              </div>
            </div>

            {/* Event checkboxes selection */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <span className="font-bold text-muted-foreground block">Meta Webhook Ingestion Events</span>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={events.messageSent}
                    onChange={(e) => setEvents({ ...events, messageSent: e.target.checked })}
                    className="h-4 w-4 rounded border-border focus:ring-emerald-500 text-emerald-600 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-foreground block">message.sent</span>
                    <span className="text-[9px] text-muted-foreground block">Meta accepted template message broadcast.</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={events.messageDelivered}
                    onChange={(e) => setEvents({ ...events, messageDelivered: e.target.checked })}
                    className="h-4 w-4 rounded border-border focus:ring-emerald-500 text-emerald-600 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-foreground block">message.delivered</span>
                    <span className="text-[9px] text-muted-foreground block">Recipient handset confirmed delivery receipt.</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={events.messageRead}
                    onChange={(e) => setEvents({ ...events, messageRead: e.target.checked })}
                    className="h-4 w-4 rounded border-border focus:ring-emerald-500 text-emerald-600 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-foreground block">message.read</span>
                    <span className="text-[9px] text-muted-foreground block">Recipient opened chat window (blue ticks).</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={events.webhookFailure}
                    onChange={(e) => setEvents({ ...events, webhookFailure: e.target.checked })}
                    className="h-4 w-4 rounded border-border focus:ring-emerald-500 text-emerald-600 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-foreground block">webhook.failure</span>
                    <span className="text-[9px] text-muted-foreground block">Alert when delivery retries or payload fails.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button 
                type="submit" 
                className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
              >
                Save Endpoint Config
              </Button>
              {isSaved && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                  ✓ Saved successfully!
                </span>
              )}
            </div>

          </form>
        </CardContent>
      </Card>

    </div>
  );
}
