"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Check,
  Activity,
  Edit,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { IntegrationItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { IntegrationData } from "@/types/integration.types";

interface IntegrationCardsProps {
  integrations: IntegrationItem[];
  setIntegrations: React.Dispatch<React.SetStateAction<IntegrationItem[]>>;
  integrationData?: IntegrationData | null;
  isLoadingIntegration?: boolean;
  onOpenConnectModal?: () => void;
  onOpenUpdateModal?: () => void;
  onVerifyConnection?: () => void;
  onDeleteIntegration?: () => void;
  isVerifying?: boolean;
  isDeleting?: boolean;
}

export function IntegrationCards({ 
  integrations, 
  integrationData,
  onOpenConnectModal,
  onOpenUpdateModal,
  onVerifyConnection,
  onDeleteIntegration,
  isVerifying,
  isDeleting,
}: IntegrationCardsProps) {

  // Get Lucide Icon for logo representation
  const getLogoIcon = (id: string) => {
    switch (id) {
      case "int_whatsapp":
        return <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case "int_meta":
        return <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  // Merge real WhatsApp & Facebook Meta backend status into integrations list
  const mergedIntegrations = React.useMemo(() => {
    return integrations.map(item => {
      if (item.id === "int_whatsapp" || item.id === "int_meta") {
        if (integrationData && integrationData.status === "CONNECTED") {
          return { ...item, status: "connected" as const };
        } else {
          return { ...item, status: "disconnected" as const };
        }
      }
      return item;
    });
  }, [integrations, integrationData]);

  // Count connected items
  const connectedCount = mergedIntegrations.filter(i => i.status === "connected").length;

  return (
    <div className="space-y-6 text-left font-sans text-xs">
      
      {/* Connected Summary Header */}
      {connectedCount > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Active Dynamic Connections</span>
          <div className="grid gap-4 sm:grid-cols-2">
            {mergedIntegrations
              .filter(i => i.status === "connected")
              .map((item) => (
                <Card key={item.id} className="border-emerald-500/30 bg-emerald-500/[0.01] hover:bg-emerald-500/[0.02] shadow-xs transition-all">
                  <CardContent className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-background border border-border/80 shrink-0">
                        {getLogoIcon(item.id)}
                      </div>
                      <div>
                        <span className="font-bold text-foreground block">{item.name}</span>
                        <span className="text-[9px] text-muted-foreground capitalize block">Core Meta API • Connected</span>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 border-none font-bold text-[8px] px-1.5 py-0 select-none uppercase tracking-wider flex items-center gap-1 shrink-0">
                      <Check className="h-2 w-2" /> Connected
                    </Badge>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Integrations Cards List */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
          Meta WhatsApp SaaS Integrations
        </span>

        <div className="grid gap-5 sm:grid-cols-2">
          {mergedIntegrations.map((item) => {
            const isConnected = item.status === "connected";
            const realStatus = integrationData && integrationData.status === "CONNECTED" ? "CONNECTED" : "DISCONNECTED";

            return (
              <Card 
                key={item.id} 
                className={cn(
                  "flex flex-col justify-between border-border/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden",
                  isConnected && "border-emerald-500/30"
                )}
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-2.5 rounded-xl bg-muted/60 border border-border/30 shrink-0">
                      {getLogoIcon(item.id)}
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-none font-bold text-[8px] px-1.5 py-0 select-none uppercase tracking-wider">
                      Core Dynamic API
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-xs text-foreground block">{item.name}</span>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Display Real WhatsApp & Facebook Meta Backend Details if available */}
                  {integrationData && integrationData.status === "CONNECTED" && (
                    <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 space-y-1 text-[10px] font-mono">
                      {item.id === "int_whatsapp" ? (
                        <>
                          <div className="flex justify-between items-center text-foreground">
                            <span className="font-semibold text-muted-foreground">Phone Number:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{integrationData.phoneNumber}</span>
                          </div>
                          <div className="flex justify-between items-center text-muted-foreground">
                            <span>WABA ID:</span>
                            <span className="truncate max-w-[140px]">{integrationData.businessAccountId}</span>
                          </div>
                          <div className="flex justify-between items-center text-muted-foreground">
                            <span>Phone ID:</span>
                            <span className="truncate max-w-[140px]">{integrationData.phoneNumberId}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between items-center text-foreground">
                            <span className="font-semibold text-muted-foreground">Meta WABA Account:</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">{integrationData.businessAccountId}</span>
                          </div>
                          <div className="flex justify-between items-center text-muted-foreground">
                            <span>Linked Phone ID:</span>
                            <span className="truncate max-w-[140px]">{integrationData.phoneNumberId}</span>
                          </div>
                          <div className="flex justify-between items-center text-muted-foreground">
                            <span>API Provider:</span>
                            <span className="font-semibold text-foreground">{integrationData.provider || "WHATSAPP_CLOUD"}</span>
                          </div>
                        </>
                      )}
                      {integrationData.lastVerifiedAt && (
                        <div className="flex justify-between items-center text-[9px] text-muted-foreground pt-1 border-t border-border/30">
                          <span>Last Verified:</span>
                          <span>{new Date(integrationData.lastVerifiedAt).toLocaleTimeString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions Footer Bar */}
                <div className="p-4 pt-0 border-t border-border/30 flex flex-wrap items-center justify-between gap-2 mt-2">
                  <span className="text-[9px] text-muted-foreground">
                    Status:{" "}
                    <strong
                      className={cn(
                        realStatus === "CONNECTED"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-500"
                      )}
                    >
                      {realStatus}
                    </strong>
                  </span>

                  {/* Button Controls */}
                  <div className="flex items-center gap-1.5">
                    {integrationData && integrationData.status === "CONNECTED" ? (
                      <>
                        {/* Verify Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={onVerifyConnection}
                          disabled={isVerifying}
                          className="h-7 px-2.5 text-[10px] font-semibold border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer flex items-center gap-1"
                          title="Verify connection with Meta Graph API"
                        >
                          {isVerifying ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <ShieldCheck className="h-3 w-3" />
                          )}
                          Verify
                        </Button>

                        {/* Edit Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={onOpenUpdateModal}
                          className="h-7 px-2 text-[10px] font-semibold border-border text-foreground hover:bg-muted cursor-pointer"
                          title="Edit Credentials"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>

                        {/* Disconnect Button */}
                        <Button
                          size="sm"
                          onClick={onDeleteIntegration}
                          disabled={isDeleting}
                          className="h-7 px-2.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border-none bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                        >
                          {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Disconnect"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={onOpenConnectModal}
                        className="h-7 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-all border-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
}


