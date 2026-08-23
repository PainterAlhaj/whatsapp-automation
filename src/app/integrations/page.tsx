"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { 
  ToggleLeft, 
  ToggleRight, 
  PlugZap,
  Plus,
  Loader2,
  Trash2
} from "lucide-react";
import { 
  initialIntegrationsData, 
  IntegrationItem 
} from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Integrations sub-components
import { IntegrationCards } from "@/components/integrations/integration-cards";
import { IntegrationApiWebhooks } from "@/components/integrations/integration-api-webhooks";
import { IntegrationActivity } from "@/components/integrations/integration-activity";
import { ConnectIntegrationModal } from "@/components/integrations/connect-integration-modal";
import { EmptyState } from "@/components/shared/empty-state";

// Real Backend Integration Hooks
import { 
  useIntegration, 
  useVerifyIntegration, 
  useDeleteIntegration 
} from "@/hooks/use-integration";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = React.useState<IntegrationItem[]>(initialIntegrationsData);
  const [isEmptyState, setIsEmptyState] = React.useState(false);

  // Modal open states
  const [isConnectModalOpen, setIsConnectModalOpen] = React.useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = React.useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);

  // React Query Hooks for real Meta Cloud API integration
  const { data: integrationData, isLoading: isLoadingIntegration, refetch } = useIntegration();
  const verifyMutation = useVerifyIntegration();
  const deleteMutation = useDeleteIntegration();

  // Handle Disconnect/Delete confirmation action
  const confirmDeleteIntegration = async () => {
    try {
      await deleteMutation.mutateAsync();
      setIsDeleteConfirmOpen(false);
    } catch {
      // Toast handles error message
    }
  };

  // Quick reset helper to connect all default integrations
  const handleResetDemoState = () => {
    setIntegrations(initialIntegrationsData);
    setIsEmptyState(false);
  };

  // Clear all integrations to simulate a total empty workspace
  const handleSimulateEmptyState = () => {
    setIntegrations(prev => prev.map(i => ({ ...i, status: "disconnected" })));
    setIsEmptyState(true);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="App Integrations"
        description="Sync WhatsApp Cloud API, Meta Developer Console, CRM sequences, and private webhook endpoints."
      >
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => setIsConnectModalOpen(true)}
            className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Connect Meta WhatsApp
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={isEmptyState ? handleResetDemoState : handleSimulateEmptyState}
            className="h-8 px-2.5 rounded-lg text-xs font-semibold border-border/80 text-foreground hover:bg-muted/40 cursor-pointer gap-1.5"
          >
            {isEmptyState ? (
              <>
                <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                <span>Restore Active Demo</span>
              </>
            ) : (
              <>
                <ToggleRight className="h-4 w-4 text-emerald-500" />
                <span>Simulate Empty State</span>
              </>
            )}
          </Button>
        </div>
      </PageHeader>

      {isEmptyState ? (
        /* Workspace Empty State */
        <EmptyState
          title="No Active Channel Connections"
          description="Your WhatsApp Business channel and payment systems are currently offline. Connect your first SaaS integration to initiate outbound templates and synchronize user database profiles."
          icon={<PlugZap className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />}
          actionLabel="Connect Meta WhatsApp"
          onAction={() => setIsConnectModalOpen(true)}
          className="p-16 text-center"
        />
      ) : (
        /* Regular Active Workspace Grid Layout */
        <div className="space-y-8 font-sans text-xs">
          
          {/* Main packages listing */}
          <div>
            <IntegrationCards 
              integrations={integrations} 
              setIntegrations={setIntegrations} 
              integrationData={integrationData}
              isLoadingIntegration={isLoadingIntegration}
              onOpenConnectModal={() => setIsConnectModalOpen(true)}
              onOpenUpdateModal={() => setIsUpdateModalOpen(true)}
              onVerifyConnection={() => verifyMutation.mutate()}
              onDeleteIntegration={() => setIsDeleteConfirmOpen(true)}
              isVerifying={verifyMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          </div>

          {/* Credentials and Timeline activity columns */}
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Developer Keys & Endpoints */}
            <div className="md:col-span-2">
              <IntegrationApiWebhooks />
            </div>

            {/* Audit log logs */}
            <div>
              <IntegrationActivity integrationData={integrationData} />
            </div>

          </div>

        </div>
      )}

      {/* Connect Integration Modal */}
      <ConnectIntegrationModal
        open={isConnectModalOpen}
        onOpenChange={setIsConnectModalOpen}
        existingIntegration={null}
      />

      {/* Update Credentials Modal */}
      <ConnectIntegrationModal
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        existingIntegration={integrationData}
      />

      {/* Delete/Disconnect Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="max-w-md p-6 font-sans text-xs">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> Disconnect Integration
            </DialogTitle>
            <DialogDescription className="pt-2 text-xs leading-relaxed">
              Are you sure you want to disconnect Meta WhatsApp Cloud API? Disconnecting will stop template syncing and active campaign broadcasts until re-connected.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2.5 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="h-8 px-3 rounded-lg text-xs font-semibold cursor-pointer border-border/80"
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={confirmDeleteIntegration}
              disabled={deleteMutation.isPending}
              className="h-8 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none flex items-center gap-1.5"
            >
              {deleteMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Disconnect Integration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
