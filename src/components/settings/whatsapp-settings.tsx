"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ShieldCheck, AlertCircle, PlusCircle, Trash2, ExternalLink } from "lucide-react";
import { useIntegration, useVerifyIntegration, useDeleteIntegration } from "@/hooks/use-integration";
import { LoadingState } from "@/components/shared/loading-state";
import Link from "next/link";

export function WhatsAppSettings() {
  const { data: integration, isLoading, isError, refetch } = useIntegration();
  const verifyMutation = useVerifyIntegration();
  const deleteMutation = useDeleteIntegration();

  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleVerify = () => {
    verifyMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to disconnect this Meta WhatsApp Cloud API integration?")) {
      deleteMutation.mutate();
    }
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "Not verified yet";
    try {
      return new Date(isoString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return isoString;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border/80 shadow-xs text-left font-sans">
        <CardContent className="p-6">
          <LoadingState rows={3} />
        </CardContent>
      </Card>
    );
  }

  if (!integration) {
    return (
      <Card className="border-border/80 shadow-xs text-left font-sans">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-foreground">WhatsApp Business API</CardTitle>
              <CardDescription className="text-[11px]">
                Meta Cloud API gateway integration status.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase font-bold border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5">
              Not Connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-2 space-y-4 text-xs">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-muted-foreground">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-foreground block text-xs">No Active Meta WhatsApp Integration</span>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                You have not connected a Meta WhatsApp Cloud API account yet. Connect your Phone Number ID and Access Token to start broadcasting campaigns and handling conversations.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/integrations">
              <Button className="h-9 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Connect Meta Integration
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isConnected = integration.status === "CONNECTED";

  return (
    <Card className="border-border/80 shadow-xs text-left font-sans">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-foreground">WhatsApp Business Profile</CardTitle>
            <CardDescription className="text-[11px]">
              Live Meta API Cloud settings and gateway connection metrics.
            </CardDescription>
          </div>
          <Badge
            className={`border-none font-bold text-[9px] px-2.5 py-1 select-none uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
              isConnected
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-red-500/10 text-red-700 dark:text-red-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
            />
            {integration.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-5 text-xs">
        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          {/* Registered Phone Number */}
          <div className="p-3.5 bg-muted/30 border border-border/40 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Registered Phone Number
            </span>
            <span className="text-sm font-bold text-foreground block font-mono">
              {integration.phoneNumber || "Not Specified"}
            </span>
          </div>

          {/* Provider */}
          <div className="p-3.5 bg-muted/30 border border-border/40 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Gateway Provider
            </span>
            <span className="text-sm font-bold text-foreground block">
              {integration.provider}
            </span>
          </div>

          {/* Business Account ID */}
          <div className="p-3.5 bg-muted/30 border border-border/40 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Business Account ID
            </span>
            <span className="text-xs font-mono font-semibold text-foreground block truncate">
              {integration.businessAccountId}
            </span>
          </div>

          {/* Phone Number ID */}
          <div className="p-3.5 bg-muted/30 border border-border/40 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Phone Number ID
            </span>
            <span className="text-xs font-mono font-semibold text-foreground block truncate">
              {integration.phoneNumberId}
            </span>
          </div>
        </div>

        {/* Last verified info */}
        <div className="flex gap-2.5 p-3 rounded-lg bg-emerald-500/[0.02] border border-emerald-500/20 text-muted-foreground text-[11px] leading-relaxed items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <div>
              <strong>Last Verified:</strong> {formatDate(integration.lastVerifiedAt)}
            </div>
          </div>
          <Link href="/integrations" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 text-[11px]">
            Manage <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        {/* Controls */}
        <div className="pt-2 flex flex-wrap gap-3">
          <Button
            onClick={handleVerify}
            disabled={verifyMutation.isPending}
            className="h-8 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${verifyMutation.isPending ? "animate-spin" : ""}`} />
            {verifyMutation.isPending ? "Verifying Meta API..." : "Verify & Reconnect Gateway"}
          </Button>

          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="h-8 px-3 text-xs font-semibold border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {deleteMutation.isPending ? "Disconnecting..." : "Disconnect Integration"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

