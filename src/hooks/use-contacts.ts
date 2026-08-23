import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { contactService } from "@/services/contact.service";
import {
  Contact,
  CreateContactPayload,
  UpdateContactPayload,
  GetContactsQueryParams,
  GetContactsResponse,
} from "@/types/contact.types";

/**
 * Hook to fetch paginated & filtered contacts list
 */
export const useContacts = (params: GetContactsQueryParams = {}) => {
  return useQuery<GetContactsResponse>({
    queryKey: ["contacts", params],
    queryFn: () => contactService.getAllContacts(params),
    placeholderData: keepPreviousData,
  });
};

/**
 * Hook to fetch single contact details by ID
 */
export const useContact = (id: string | null) => {
  return useQuery<Contact>({
    queryKey: ["contacts", id],
    queryFn: () => contactService.getContactById(id!),
    enabled: Boolean(id),
  });
};

/**
 * Hook to create a new contact
 */
export const useCreateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateContactPayload) => contactService.createContact(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

/**
 * Hook to update a contact with Optimistic Updates
 */
export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateContactPayload }) =>
      contactService.updateContact(id, payload),

    // Optimistic Update Implementation
    onMutate: async ({ id, payload }) => {
      // Cancel outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ["contacts"] });

      // Snapshot previous contact detail cache if present
      const previousContact = queryClient.getQueryData<Contact>(["contacts", id]);

      // Optimistically update single contact detail query
      if (previousContact) {
        queryClient.setQueryData<Contact>(["contacts", id], {
          ...previousContact,
          ...payload,
          updatedAt: new Date().toISOString(),
        });
      }

      // Return context with snapshotted values for rollback
      return { previousContact };
    },

    onError: (_err, { id }, context) => {
      if (context?.previousContact) {
        queryClient.setQueryData(["contacts", id], context.previousContact);
      }
    },

    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["contacts", id] });
      }
    },
  });
};

/**
 * Hook to delete a contact with Optimistic Updates
 */
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactService.deleteContact(id),

    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["contacts"] });

      // Snapshot queries matching "contacts"
      const queries = queryClient.getQueriesData<GetContactsResponse>({ queryKey: ["contacts"] });

      // Optimistically remove from list in cache
      queries.forEach(([queryKey, oldData]) => {
        if (oldData && oldData.contacts) {
          queryClient.setQueryData<GetContactsResponse>(queryKey, {
            ...oldData,
            contacts: oldData.contacts.filter((c) => c._id !== deletedId),
            pagination: {
              ...oldData.pagination,
              total: Math.max(0, oldData.pagination.total - 1),
            },
          });
        }
      });

      return { queries };
    },

    onError: (_err, _deletedId, context) => {
      if (context?.queries) {
        context.queries.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

/**
 * Hook to import contacts from CSV
 */
export const useImportContacts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => contactService.importContacts(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

/**
 * Hook to export contacts to CSV
 */
export const useExportContacts = () => {
  return useMutation({
    mutationFn: () => contactService.exportContacts(),
  });
};
