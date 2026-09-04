import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { chatService } from "@/services/chat.service";
import {
  ConversationQueryParams,
  CreateConversationPayload,
  GetConversationsResponse,
  GetMessagesQueryParams,
  GetMessagesResponse,
  SendOutboundMessagePayload,
  UpdateConversationPayload,
  Message,
  Conversation,
} from "@/types/chat.types";

/**
 * Hook to fetch paginated & filtered list of conversations with automated background polling
 */
export const useConversations = (params: ConversationQueryParams = {}) => {
  return useQuery<GetConversationsResponse>({
    queryKey: ["conversations", params],
    queryFn: () => chatService.getConversations(params),
    placeholderData: keepPreviousData,
    refetchInterval: 30000, // 30s backup fallback (primary updates driven by WebSockets)
  });
};

/**
 * Hook to create or retrieve a conversation for a contact
 */
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateConversationPayload) => chatService.createConversation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

/**
 * Hook to fetch details of a single conversation
 */
export const useConversation = (id: string | null) => {
  return useQuery<Conversation>({
    queryKey: ["conversations", "detail", id],
    queryFn: () => chatService.getConversationById(id!),
    enabled: Boolean(id),
  });
};

/**
 * Hook to fetch paginated message history for an active conversation with polling
 */
export const useMessages = (
  conversationId: string | null,
  params: GetMessagesQueryParams = { page: 1, limit: 50 }
) => {
  return useQuery<GetMessagesResponse>({
    queryKey: ["messages", conversationId, params],
    queryFn: () => chatService.getMessages(conversationId!, params),
    enabled: Boolean(conversationId),
    refetchInterval: 30000, // 30s backup fallback (primary updates driven by WebSockets)
  });
};

/**
 * Hook to mark a conversation as read (optimistically resets unreadCount to 0)
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => chatService.markAsRead(conversationId),
    onMutate: async (conversationId) => {
      await queryClient.cancelQueries({ queryKey: ["conversations"] });

      // Optimistically update conversation list cache
      queryClient.setQueriesData<GetConversationsResponse>(
        { queryKey: ["conversations"] },
        (old) => {
          if (!old || !old.data?.conversations) return old;
          return {
            ...old,
            data: {
              ...old.data,
              conversations: old.data.conversations.map((conv) =>
                conv.id === conversationId || conv._id === conversationId
                  ? { ...conv, unreadCount: 0 }
                  : conv
              ),
            },
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

/**
 * Hook to send an outbound message with Optimistic UI updates
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      payload,
    }: {
      conversationId: string;
      payload: SendOutboundMessagePayload;
    }) => chatService.sendMessage(conversationId, payload),

    onMutate: async ({ conversationId, payload }) => {
      // Cancel outgoing queries for messages of this conversation
      await queryClient.cancelQueries({ queryKey: ["messages", conversationId] });

      // Create optimistic message object
      const optimisticMsg: Message = {
        id: `optimistic-${Date.now()}`,
        conversationId,
        direction: "OUTBOUND",
        type: "TEXT",
        content: payload.text,
        status: "SENT",
        createdAt: new Date().toISOString(),
      };

      // Snapshot previous messages cache
      const previousMessages = queryClient.getQueriesData<GetMessagesResponse>({
        queryKey: ["messages", conversationId],
      });

      // Update message list query cache optimistically
      queryClient.setQueriesData<GetMessagesResponse>(
        { queryKey: ["messages", conversationId] },
        (old) => {
          if (!old) {
            return {
              success: true,
              data: [optimisticMsg],
            };
          }
          const existingList = Array.isArray(old.data) ? old.data : [];
          return {
            ...old,
            data: [...existingList, optimisticMsg],
          };
        }
      );

      return { previousMessages };
    },

    onError: (_err, { conversationId }, context) => {
      if (context?.previousMessages) {
        context.previousMessages.forEach(([key, value]) => {
          queryClient.setQueryData(key, value);
        });
      }
    },

    onSettled: (_data, _error, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

/**
 * Hook to update conversation status (OPEN/CLOSED) or archive state
 */
export const useUpdateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateConversationPayload;
    }) => chatService.updateConversation(id, payload),

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["conversations"] });

      queryClient.setQueriesData<GetConversationsResponse>(
        { queryKey: ["conversations"] },
        (old) => {
          if (!old || !old.data?.conversations) return old;
          return {
            ...old,
            data: {
              ...old.data,
              conversations: old.data.conversations.map((conv) =>
                conv.id === id || conv._id === id ? { ...conv, ...payload } : conv
              ),
            },
          };
        }
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};

/**
 * Hook to delete a conversation
 */
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => chatService.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    },
  });
};
