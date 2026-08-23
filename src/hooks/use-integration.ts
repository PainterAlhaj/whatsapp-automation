import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { integrationService } from "@/services/integration.service";
import { ConnectIntegrationRequest, UpdateIntegrationRequest, IntegrationData } from "@/types/integration.types";
import { toast } from "@/components/ui/toast";

export const INTEGRATION_QUERY_KEY = ["integration"];

/**
 * Hook to fetch current user's Meta WhatsApp Cloud API integration details
 * GET /integrations
 */
export const useIntegration = () => {
  return useQuery<IntegrationData | null>({
    queryKey: INTEGRATION_QUERY_KEY,
    queryFn: () => integrationService.getIntegration(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to connect new Meta WhatsApp Cloud API integration
 * POST /integrations/connect
 */
export const useConnectIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ConnectIntegrationRequest) => integrationService.connectIntegration(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Integration connected successfully!", "Connected");
      queryClient.invalidateQueries({ queryKey: INTEGRATION_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to connect Meta integration.", "Connection Error");
    },
  });
};

/**
 * Hook to execute real-time Meta Graph API credentials verification
 * GET /integrations/verify
 */
export const useVerifyIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => integrationService.verifyIntegration(),
    onSuccess: (res) => {
      const displayStr = res.data.verifiedName
        ? `${res.data.verifiedName} (${res.data.displayPhoneNumber || res.data.phoneNumberId})`
        : res.data.phoneNumberId;
      toast.success(`Verified Meta credentials as ${displayStr}`, "Verification Success");
      queryClient.invalidateQueries({ queryKey: INTEGRATION_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.message || "Meta verification failed. Please check your credentials.", "Verification Failed");
    },
  });
};

/**
 * Hook to update existing integration credentials or phone details
 * PATCH /integrations
 */
export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateIntegrationRequest) => integrationService.updateIntegration(payload),
    onSuccess: (res) => {
      toast.success(res.message || "Credentials updated. Please verify connection to activate.", "Updated");
      queryClient.invalidateQueries({ queryKey: INTEGRATION_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update integration details.", "Update Error");
    },
  });
};

/**
 * Hook to delete/disconnect Meta integration
 * DELETE /integrations
 */
export const useDeleteIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => integrationService.deleteIntegration(),
    onSuccess: (res) => {
      toast.success(res.message || "Integration disconnected successfully.", "Disconnected");
      queryClient.invalidateQueries({ queryKey: INTEGRATION_QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to disconnect integration.", "Error");
    },
  });
};
