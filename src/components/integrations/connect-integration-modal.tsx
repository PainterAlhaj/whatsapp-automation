"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Key, 
  MessageSquare, 
  Building2, 
  Phone, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Loader2, 
  HelpCircle 
} from "lucide-react";
import { useConnectIntegration, useUpdateIntegration } from "@/hooks/use-integration";
import { IntegrationData, ConnectIntegrationRequest, UpdateIntegrationRequest } from "@/types/integration.types";

interface ConnectIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingIntegration?: IntegrationData | null;
}

export function ConnectIntegrationModal({
  open,
  onOpenChange,
  existingIntegration,
}: ConnectIntegrationModalProps) {
  const isEditing = Boolean(existingIntegration);

  const [businessAccountId, setBusinessAccountId] = React.useState("");
  const [phoneNumberId, setPhoneNumberId] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [accessToken, setAccessToken] = React.useState("");
  const [appId, setAppId] = React.useState("");
  const [appSecret, setAppSecret] = React.useState("");
  const [webhookVerifyToken, setWebhookVerifyToken] = React.useState("");

  const [showToken, setShowToken] = React.useState(false);
  const [showSecret, setShowSecret] = React.useState(false);

  const connectMutation = useConnectIntegration();
  const updateMutation = useUpdateIntegration();

  const isPending = connectMutation.isPending || updateMutation.isPending;

  // Pre-fill form values when editing existing integration
  React.useEffect(() => {
    if (existingIntegration && open) {
      setBusinessAccountId(existingIntegration.businessAccountId || "");
      setPhoneNumberId(existingIntegration.phoneNumberId || "");
      setPhoneNumber(existingIntegration.phoneNumber || "");
      setAccessToken(""); // Never exposed from backend
      setAppId("");
      setAppSecret("");
      setWebhookVerifyToken("");
    } else if (!existingIntegration && open) {
      setBusinessAccountId("");
      setPhoneNumberId("");
      setPhoneNumber("");
      setAccessToken("");
      setAppId("");
      setAppSecret("");
      setWebhookVerifyToken("");
    }
  }, [existingIntegration, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!businessAccountId.trim() || !phoneNumberId.trim() || !phoneNumber.trim()) {
      return;
    }

    if (!isEditing && !accessToken.trim()) {
      return;
    }

    try {
      if (isEditing) {
        const payload: UpdateIntegrationRequest = {};
        if (businessAccountId.trim()) payload.businessAccountId = businessAccountId.trim();
        if (phoneNumberId.trim()) payload.phoneNumberId = phoneNumberId.trim();
        if (phoneNumber.trim()) payload.phoneNumber = phoneNumber.trim();
        if (accessToken.trim()) payload.accessToken = accessToken.trim();
        if (appId.trim()) payload.appId = appId.trim();
        if (appSecret.trim()) payload.appSecret = appSecret.trim();
        if (webhookVerifyToken.trim()) payload.webhookVerifyToken = webhookVerifyToken.trim();

        await updateMutation.mutateAsync(payload);
      } else {
        const payload: ConnectIntegrationRequest = {
          businessAccountId: businessAccountId.trim(),
          phoneNumberId: phoneNumberId.trim(),
          phoneNumber: phoneNumber.trim(),
          accessToken: accessToken.trim(),
          appId: appId.trim() || undefined,
          appSecret: appSecret.trim() || undefined,
          webhookVerifyToken: webhookVerifyToken.trim() || undefined,
        };

        await connectMutation.mutateAsync(payload);
      }

      onOpenChange(false);
    } catch {
      // Error handles in mutation onError toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-6 font-sans text-xs max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3 border-b border-border/60">
          <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            {isEditing ? "Update Meta WhatsApp Integration" : "Connect Meta WhatsApp Cloud API"}
          </DialogTitle>
          <DialogDescription className="text-[11px] text-muted-foreground">
            {isEditing
              ? "Update your Meta Cloud API account configuration. Updating credentials resets connection status until re-verified."
              : "Enter your Meta Developer account credentials to connect your WhatsApp Business Account to WhatsFlow."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Business Account ID */}
          <div className="space-y-1">
            <label className="font-bold text-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              WhatsApp Business Account ID (WABA ID) <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g. 100234567890123"
              value={businessAccountId}
              onChange={(e) => setBusinessAccountId(e.target.value)}
              className="h-8 text-xs font-mono"
              required
            />
            <span className="text-[10px] text-muted-foreground block">
              Found in Meta Business Settings &gt; WhatsApp Accounts.
            </span>
          </div>

          {/* Phone Number ID & Phone Number */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="font-bold text-foreground flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-muted-foreground" />
                Phone Number ID <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. 109876543210987"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                className="h-8 text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                Registered Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="e.g. +15550192834"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>
          </div>

          {/* Permanent Access Token */}
          <div className="space-y-1">
            <label className="font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Meta System User Access Token {!isEditing && <span className="text-red-500">*</span>}
              </span>
              {isEditing && <span className="text-[10px] text-muted-foreground font-normal">(Leave blank to keep unchanged)</span>}
            </label>
            <div className="relative">
              <Input
                type={showToken ? "text" : "password"}
                placeholder={isEditing ? "••••••••••••••••••••••••••••••••" : "EAAGm0PX4ZC0BA..."}
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="h-8 pr-10 text-xs font-mono"
                required={!isEditing}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            <span className="text-[10px] text-muted-foreground block">
              Permanent system user access token with <code className="font-mono text-[9px] bg-muted px-1 rounded">whatsapp_business_messaging</code> permissions.
            </span>
          </div>

          {/* Optional Developer Fields: App ID & App Secret */}
          <div className="pt-2 border-t border-border/40 space-y-3">
            <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[11px]">
              <HelpCircle className="h-3.5 w-3.5" /> Optional Meta App Security Credentials
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Meta App ID</label>
                <Input
                  type="text"
                  placeholder="e.g. 123456789012345"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Meta App Secret</label>
                <div className="relative">
                  <Input
                    type={showSecret ? "text" : "password"}
                    placeholder="e.g. a1b2c3d4e5f6..."
                    value={appSecret}
                    onChange={(e) => setAppSecret(e.target.value)}
                    className="h-8 pr-10 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showSecret ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Webhook Verification Token</label>
              <Input
                type="text"
                placeholder="e.g. whatsapp_secure_webhook_token_2026"
                value={webhookVerifyToken}
                onChange={(e) => setWebhookVerifyToken(e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 px-3 rounded-lg text-xs font-semibold cursor-pointer border-border/80"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none flex items-center gap-1.5"
              disabled={isPending}
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEditing ? "Save & Disconnect for Verification" : "Connect Integration"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
