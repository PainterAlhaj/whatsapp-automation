"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Plus, RotateCw, Loader2 } from "lucide-react";
import { TemplatesStats } from "@/components/templates/templates-stats";
import { TemplatesList } from "@/components/templates/templates-list";
import { useSyncTemplates } from "@/hooks/use-templates";
import { useIntegration } from "@/hooks/use-integration";
import { toast } from "@/components/ui/toast";

export default function TemplatesPage() {
  const syncTemplatesMutation = useSyncTemplates();
  const { data: integrationData } = useIntegration();

  const isConnected = integrationData?.status === "CONNECTED";

  const triggerCreateTemplate = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-create-template"));
    }
  };

  const handleSyncTemplates = async () => {
    if (!isConnected) {
      toast.error(
        "WhatsApp Business API is not connected or verified. Please connect your Meta integration on the Integrations page first.",
        "Integration Required"
      );
      return;
    }

    try {
      const data = await syncTemplatesMutation.mutateAsync();
      const statsMsg = `Sync complete: ${data.totalFetched ?? 0} templates fetched (${data.created ?? 0} created, ${data.updated ?? 0} updated, ${data.deleted ?? 0} deleted)`;
      toast.success(statsMsg, "Templates Synced");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to sync templates from Meta.";
      toast.error(msg, "Sync Error");
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Templates"
        description="Design approved WhatsApp message templates, configure buttons, and handle variables."
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSyncTemplates}
            disabled={syncTemplatesMutation.isPending || !isConnected}
            title={isConnected ? "Sync templates from Meta Cloud API" : "Integration must be CONNECTED to sync templates"}
            className="border-border/80 gap-1.5 rounded-lg text-xs md:text-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncTemplatesMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <RotateCw className="h-4 w-4 text-muted-foreground" />
            )}
            Sync from Meta
          </Button>

          <Button 
            onClick={triggerCreateTemplate} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 rounded-lg text-xs md:text-sm font-semibold cursor-pointer border border-transparent"
          >
            <Plus className="h-4 w-4" /> New Template
          </Button>
        </div>
      </PageHeader>
      
      <div className="space-y-6">
        {/* Templates KPI Cards */}
        <TemplatesStats />

        {/* Core Interactive Message Templates Library */}
        <TemplatesList />
      </div>
    </DashboardLayout>
  );
}
