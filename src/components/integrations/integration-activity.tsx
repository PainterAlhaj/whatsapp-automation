"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cable, ShieldCheck, Link2Off } from "lucide-react";
import { IntegrationData } from "@/types/integration.types";

interface IntegrationActivityProps {
  integrationData?: IntegrationData | null;
}

export function IntegrationActivity({ integrationData }: IntegrationActivityProps) {
  const activityList = React.useMemo(() => {
    const list = [];
    if (integrationData) {
      if (integrationData.lastVerifiedAt) {
        list.push({
          id: "act_real_verify",
          integrationName: "WhatsApp Business Platform",
          action: "Verified Meta Graph API credentials & permissions",
          time: new Date(integrationData.lastVerifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        });
      }
      if (integrationData.createdAt) {
        list.push({
          id: "act_real_connect",
          integrationName: "Meta Business Suite",
          action: `Authorized credentials for Phone ID: ${integrationData.phoneNumberId}`,
          time: new Date(integrationData.createdAt).toLocaleDateString(),
          icon: <Cable className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
        });
      }
    }
    return list;
  }, [integrationData]);

  return (
    <Card className="border-border/80 shadow-xs text-left font-sans text-xs">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-sm font-bold text-foreground">Recent Connection Activity</CardTitle>
        <CardDescription className="text-[11px]">
          Audit log of Meta Cloud API authorizations and connection verifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        {activityList.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground space-y-1">
            <Link2Off className="h-5 w-5 mx-auto text-muted-foreground/60 mb-2" />
            <span className="font-semibold block text-[11px]">No Active Meta Connection</span>
            <p className="text-[10px] text-muted-foreground">Connect your Meta WhatsApp Cloud API credentials to start logging connection events.</p>
          </div>
        ) : (
          <div className="relative pl-6 border-l border-border/80 space-y-5 py-2">
            {activityList.map((act) => (
              <div key={act.id} className="relative">
                {/* Left timeline dot icon */}
                <div className="absolute -left-[35px] top-0.5 p-1 bg-background border border-border rounded-full flex items-center justify-center">
                  {act.icon}
                </div>

                {/* Text */}
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-foreground block">{act.integrationName}</span>
                    <span className="text-[9px] text-muted-foreground font-mono shrink-0">{act.time}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">{act.action}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

