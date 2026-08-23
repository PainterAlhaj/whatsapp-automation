"use client";

import * as React from "react";
import { 
  Sheet, 
  SheetContent 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  Play, 
  Clock, 
  FileText,
  Pause,
  Send,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { useCampaign, useCampaignStats, useSendCampaign } from "@/hooks/use-campaigns";
import { CampaignStatus } from "@/types/campaign.types";
import { toast } from "@/components/ui/toast";

interface CampaignDetailsDrawerProps {
  campaignId: string | null;
  onClose: () => void;
}

export function CampaignDetailsDrawer({ campaignId, onClose }: CampaignDetailsDrawerProps) {
  const { data: campaign, isLoading: isLoadingCampaign } = useCampaign(campaignId);
  const isProcessing = campaign?.status === "PROCESSING";
  const { data: stats, isLoading: isLoadingStats } = useCampaignStats(campaignId, isProcessing);
  const sendCampaignMutation = useSendCampaign();

  // Metrics calculation
  const totalRecipients = stats?.totalRecipients ?? campaign?.totalRecipients ?? 0;
  const sentCount = stats?.sentCount ?? campaign?.sentCount ?? 0;
  const deliveredCount = stats?.deliveredCount ?? campaign?.deliveredCount ?? 0;
  const readCount = stats?.readCount ?? campaign?.readCount ?? 0;
  const failedCount = stats?.failedCount ?? campaign?.failedCount ?? 0;

  const deliveredPercent = sentCount > 0 ? Math.round((deliveredCount / sentCount) * 100) : 0;
  const readPercent = sentCount > 0 ? Math.round((readCount / sentCount) * 100) : 0;
  const replyPercent = sentCount > 0 ? Math.round((readCount / sentCount) * 0.15) : 0;

  const templateName = typeof campaign?.template === "object" && campaign.template !== null
    ? campaign.template.name
    : String(campaign?.template || "N/A");

  const getStatusBadgeVariant = (status?: CampaignStatus) => {
    switch (status) {
      case "COMPLETED":
      case "PROCESSING":
        return "success";
      case "SCHEDULED":
        return "secondary";
      case "FAILED":
      case "CANCELLED":
        return "destructive";
      case "DRAFT":
      default:
        return "secondary";
    }
  };

  const handleSendNow = async () => {
    if (!campaignId) return;
    try {
      await sendCampaignMutation.mutateAsync(campaignId);
      toast.success("Broadcast campaign sent successfully.", "Dispatched");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send campaign.";
      toast.error(msg, "Send Error");
    }
  };

  return (
    <Sheet open={!!campaignId} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="right" className="sm:max-w-md p-5 flex flex-col justify-between overflow-y-auto" showCloseButton={true}>
        {isLoadingCampaign ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <Loader2 className="h-6 w-6 text-emerald-600 animate-spin" />
            <span className="text-xs text-muted-foreground">Loading campaign details...</span>
          </div>
        ) : campaign ? (
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3 text-left pb-4 border-b border-border/60">
                <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-100/30 dark:border-blue-800/10 flex items-center justify-center font-bold text-sm shrink-0">
                  {campaign.name.split(" ").map((n) => n[0]?.toUpperCase() || "").slice(0, 2).join("") || "C"}
                </div>
                <div className="truncate">
                  <h3 className="text-base font-bold text-foreground leading-snug truncate" title={campaign.name}>
                    {campaign.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant={getStatusBadgeVariant(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono truncate">{templateName}</span>
                  </div>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-2 gap-4 text-left border-b border-border/60 pb-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Target Audience</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{totalRecipients} contacts</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Scheduled / Date</span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">
                      {campaign.scheduledAt
                        ? new Date(campaign.scheduledAt).toLocaleDateString()
                        : campaign.createdAt
                        ? new Date(campaign.createdAt).toLocaleDateString()
                        : "Active Now"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="text-left space-y-4 border-b border-border/60 pb-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground">Performance Metrics</h4>
                  {isLoadingStats && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                </div>
                
                {/* Visual Progress Bar Stack */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-foreground">
                      <span className="text-muted-foreground text-[11px]">Delivered Rate ({deliveredCount})</span>
                      <span>{deliveredPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full" style={{ width: `${deliveredPercent}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-foreground">
                      <span className="text-muted-foreground text-[11px]">Read Rate ({readCount})</span>
                      <span>{readPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: `${readPercent}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-foreground">
                      <span className="text-muted-foreground text-[11px]">Estimated Reply Rate</span>
                      <span>{replyPercent}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 dark:bg-purple-500 rounded-full" style={{ width: `${replyPercent}%` }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                    <span className="text-[10px] text-muted-foreground font-semibold block">Total Sent</span>
                    <span className="text-lg font-bold text-foreground">{sentCount}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/20 border border-border/50">
                    <span className="text-[10px] text-muted-foreground font-semibold block">Failed</span>
                    <span className="text-lg font-bold text-foreground">{failedCount}</span>
                  </div>
                </div>
              </div>

              {/* Template / Description */}
              <div className="text-left space-y-2 border-b border-border/60 pb-5">
                <span className="text-xs font-bold text-foreground block">Template / Description</span>
                <div className="p-3 bg-muted/30 dark:bg-zinc-900/30 border border-border/50 rounded-lg text-xs text-muted-foreground font-mono whitespace-pre-wrap leading-relaxed">
                  {campaign.description || `Template: ${templateName}`}
                </div>
              </div>

              {/* Execution Timeline */}
              <div className="text-left space-y-3">
                <span className="text-xs font-bold text-foreground block">Execution Timeline</span>
                <div className="relative border-l border-border pl-4 ml-2.5 space-y-4 pt-1">
                  <div className="relative">
                    <div className="absolute -left-[22px] top-0.5 p-1 rounded-full bg-background border border-border text-muted-foreground">
                      <FileText className="h-2.5 w-2.5 text-blue-500" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-foreground block">Campaign Configured</span>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {new Date(campaign.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {campaign.scheduledAt && (
                    <div className="relative">
                      <div className="absolute -left-[22px] top-0.5 p-1 rounded-full bg-background border border-border text-muted-foreground">
                        <Clock className="h-2.5 w-2.5 text-purple-500" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-foreground block">Scheduled Execution</span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {new Date(campaign.scheduledAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {campaign.status === "PROCESSING" && (
                    <div className="relative">
                      <div className="absolute -left-[22px] top-0.5 p-1 rounded-full bg-background border border-border text-muted-foreground">
                        <Play className="h-2.5 w-2.5 text-emerald-500 animate-pulse" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-foreground block">Broadcasting Messages...</span>
                        <span className="text-[10px] text-muted-foreground font-medium">In Progress</span>
                      </div>
                    </div>
                  )}

                  {campaign.status === "COMPLETED" && (
                    <div className="relative">
                      <div className="absolute -left-[22px] top-0.5 p-1 rounded-full bg-background border border-border text-muted-foreground">
                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-foreground block">Broadcast Completed</span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {new Date(campaign.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-4 border-t border-border/60 space-y-2">
              {(campaign.status === "DRAFT" || campaign.status === "SCHEDULED") && (
                <Button 
                  onClick={handleSendNow} 
                  disabled={sendCampaignMutation.isPending}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {sendCampaignMutation.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  {sendCampaignMutation.isPending ? "Sending Broadcast..." : "Send Broadcast Now"}
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={onClose} 
                className="w-full rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close View
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-xs text-muted-foreground">
            Campaign details not found.
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
