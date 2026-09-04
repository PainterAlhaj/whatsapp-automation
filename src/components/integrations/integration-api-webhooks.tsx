"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Key, Eye, EyeOff, Copy, Check, Globe } from "lucide-react";
import { IntegrationData } from "@/types/integration.types";

interface IntegrationApiWebhooksProps {
  integrationData?: IntegrationData | null;
}

export function IntegrationApiWebhooks({ integrationData }: IntegrationApiWebhooksProps) {
  // Backend webhook URL endpoint from specification: /api/v1/webhook/meta
  const webhookUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1") + "/webhook/meta";

  // Real or fallback webhook verification token
  const webhookSecret = "whatsapp_backend_2026_secure_token";

  const [isSecretVisible, setIsSecretVisible] = React.useState(false);
  const [isSecretCopied, setIsSecretCopied] = React.useState(false);
  const [isUrlCopied, setIsUrlCopied] = React.useState(false);

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

  // Supported Meta Webhook Ingestion Events (Read-only reference)
  const activeEvents = [
    { name: "messages", label: "Inbound Messages", desc: "User text, media & interactive button replies." },
    { name: "message.sent", label: "Message Sent", desc: "Meta accepted outbound template broadcast." },
    { name: "message.delivered", label: "Message Delivered", desc: "Handset confirmed message receipt." },
    { name: "message.read", label: "Message Read", desc: "Recipient opened chat thread (blue ticks)." },
  ];

  return (
    <div className="space-y-6 text-left font-sans text-xs">

      {/* Inbound Webhooks Config Card (Read-Only View) */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm font-bold text-foreground">Inbound Meta Webhook Configuration</CardTitle>
            <Badge variant="outline" className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
              Read-Only Callback Reference
            </Badge>
          </div>
          <CardDescription className="text-[11px]">
            Meta Cloud Platform sends real-time conversational events (messages and status updates) to this backend callback endpoint.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">

          {/* Meta Webhook Endpoint URL (Disabled / Read-Only Input) */}
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
                  readOnly
                  disabled
                  className="h-8 pl-8 text-xs font-mono bg-muted/40 text-muted-foreground cursor-not-allowed select-all border-border/80 opacity-100"
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

          {/* Verify Token for Meta Handshake (Read-Only) */}
          <div className="space-y-1.5">
            <label className="font-bold text-muted-foreground">Meta Webhook Verification Token (<code className="text-[9px] font-mono">hub.verify_token</code>)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type={isSecretVisible ? "text" : "password"}
                  value={webhookSecret}
                  readOnly
                  disabled
                  className="h-8 pl-8 pr-10 text-xs font-mono bg-muted/40 text-muted-foreground cursor-not-allowed select-all border-border/80 opacity-100"
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

          {/* Supported Meta Webhook Events (Read-only status list) */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <span className="font-bold text-muted-foreground block">Active Backend Event Handlers</span>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {activeEvents.map((evt) => (
                <div key={evt.name} className="p-2.5 rounded-lg bg-muted/30 border border-border/40 flex items-start gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-foreground text-xs">{evt.name}</span>
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">• Active</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block leading-tight">{evt.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>

    </div>
  );
}


