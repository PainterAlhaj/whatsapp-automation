import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { automationService } from "@/services/automation.service";
import {
  Automation,
  CreateAutomationPayload,
  UpdateAutomationPayload,
} from "@/types/automation.types";
import { toast } from "@/components/ui/toast";

export const AUTOMATIONS_QUERY_KEY = ["automations"];

/**
 * Hook to fetch all automations from backend
 */
export const useAutomations = () => {
  return useQuery<Automation[]>({
    queryKey: AUTOMATIONS_QUERY_KEY,
    queryFn: () => automationService.getAllAutomations(),
  });
};

/**
 * Hook to fetch single automation by ID
 */
export const useAutomation = (id: string | null) => {
  return useQuery<Automation>({
    queryKey: ["automations", id],
    queryFn: () => automationService.getAutomationById(id!),
    enabled: Boolean(id),
  });
};

/**
 * Hook to create a new automation
 */
export const useCreateAutomation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAutomationPayload) => automationService.createAutomation(payload),
    onSuccess: (data) => {
      toast.success(`Automation "${data.name}" created successfully.`, "Created");
      queryClient.invalidateQueries({ queryKey: AUTOMATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create automation.", "Creation Error");
    },
  });
};

/**
 * Hook to update an existing automation
 */
export const useUpdateAutomation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAutomationPayload }) =>
      automationService.updateAutomation(id, payload),
    onSuccess: (data, variables) => {
      if (variables.payload.status) {
        const isNowActive = variables.payload.status === "ACTIVE";
        toast.success(
          `Automation status changed to ${isNowActive ? "ACTIVE" : "INACTIVE"}.`,
          isNowActive ? "Automation Enabled" : "Automation Disabled"
        );
      } else {
        toast.success(`Automation "${data.name}" updated successfully.`, "Updated");
      }
      queryClient.invalidateQueries({ queryKey: AUTOMATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ["automations", variables.id] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update automation.", "Update Error");
    },
  });
};

/**
 * Hook to delete an automation
 */
export const useDeleteAutomation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => automationService.deleteAutomation(id),
    onSuccess: () => {
      toast.success("Automation deleted successfully.", "Deleted");
      queryClient.invalidateQueries({ queryKey: AUTOMATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete automation.", "Delete Error");
    },
  });
};

/**
 * Hook to manually trigger an automation
 */
export const useTriggerAutomation = () => {
  return useMutation({
    mutationFn: (id: string) => automationService.triggerAutomation(id),
    onSuccess: (res) => {
      toast.success(res.message || "Automation triggered successfully.", "Triggered");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to trigger automation.", "Trigger Error");
    },
  });
};
