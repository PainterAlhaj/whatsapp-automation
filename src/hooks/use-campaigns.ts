import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { campaignService } from "@/services/campaign.service";
import {
  CampaignData,
  CreateCampaignPayload,
  UpdateCampaignPayload,
  CampaignQueryParams,
  GetAllCampaignsResponse,
  CampaignStatsData,
} from "@/types/campaign.types";

/**
 * Hook to fetch paginated, searched & filtered campaigns list
 */
export const useCampaigns = (params: CampaignQueryParams = {}) => {
  return useQuery<GetAllCampaignsResponse>({
    queryKey: ["campaigns", params],
    queryFn: () => campaignService.getAllCampaigns(params),
    placeholderData: keepPreviousData,
  });
};

/**
 * Hook to fetch single campaign details by ID
 */
export const useCampaign = (id: string | null) => {
  return useQuery<CampaignData>({
    queryKey: ["campaigns", id],
    queryFn: () => campaignService.getCampaignById(id!),
    enabled: Boolean(id),
  });
};

/**
 * Hook to create a new campaign
 */
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) => campaignService.createCampaign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

/**
 * Hook to update a campaign
 */
export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCampaignPayload }) =>
      campaignService.updateCampaign(id, payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ["campaigns", variables.id] });
      }
    },
  });
};

/**
 * Hook to delete a campaign
 */
export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => campaignService.deleteCampaign(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

/**
 * Hook to trigger campaign broadcast sending
 */
export const useSendCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => campaignService.sendCampaign(id),

    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["campaigns", id] });
        queryClient.invalidateQueries({ queryKey: ["campaigns", id, "stats"] });
      }
    },
  });
};

/**
 * Hook to fetch live campaign statistics with optional polling during PROCESSING status
 */
export const useCampaignStats = (id: string | null, isProcessing = false) => {
  return useQuery<CampaignStatsData>({
    queryKey: ["campaigns", id, "stats"],
    queryFn: () => campaignService.getCampaignStats(id!),
    enabled: Boolean(id),
    refetchInterval: isProcessing ? 3000 : false,
  });
};
