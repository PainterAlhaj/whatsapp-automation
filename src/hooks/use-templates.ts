import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { templateService } from "@/services/template.service";
import {
  Template,
  CreateTemplatePayload,
  UpdateTemplatePayload,
  GetTemplatesQueryParams,
  GetTemplatesResponse,
  SyncResultData,
} from "@/types/template.types";

/**
 * Hook to fetch paginated, searched & filtered templates list
 */
export const useTemplates = (params: GetTemplatesQueryParams = {}) => {
  return useQuery<GetTemplatesResponse>({
    queryKey: ["templates", params],
    queryFn: () => templateService.getAllTemplates(params),
    placeholderData: keepPreviousData,
  });
};

/**
 * Hook to fetch single template details by ID
 */
export const useTemplate = (id: string | null) => {
  return useQuery<Template>({
    queryKey: ["templates", id],
    queryFn: () => templateService.getTemplateById(id!),
    enabled: Boolean(id),
  });
};

/**
 * Hook to create a new template
 */
export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTemplatePayload) => templateService.createTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

/**
 * Hook to update a template
 */
export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTemplatePayload }) =>
      templateService.updateTemplate(id, payload),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ["templates", variables.id] });
      }
    },
  });
};

/**
 * Hook to delete a template
 */
export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => templateService.deleteTemplate(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

/**
 * Hook to sync templates from Meta Graph API
 */
export const useSyncTemplates = () => {
  const queryClient = useQueryClient();

  return useMutation<SyncResultData, Error, void>({
    mutationFn: () => templateService.syncTemplates(),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};
