"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ConversationList } from "@/components/chat/conversation-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { EmptyChatState } from "@/components/chat/empty-chat-state";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useUpdateConversation,
  useCreateConversation,
} from "@/hooks/use-chat";
import { Conversation } from "@/types/chat.types";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const contactIdParam = searchParams.get("contactId");
  const phoneParam = searchParams.get("phone");
  const searchParam = searchParams.get("search");

  const initialSearch = searchParam || phoneParam || "";

  const [searchTerm, setSearchTerm] = React.useState(initialSearch);
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(null);
  
  // Mobile Stack View Navigation ("LIST" or "CHAT")
  const [mobileView, setMobileView] = React.useState<"LIST" | "CHAT">("LIST");

  const autoCreateHandledRef = React.useRef<string | null>(null);

  // Sync search param from URL if redirected from Contacts page
  React.useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
    }
  }, [initialSearch]);

  // Fetch Conversations list with active search and status filter
  const { data: conversationsData, isLoading: isLoadingConversations } = useConversations({
    search: searchTerm,
    status: statusFilter,
  });

  const conversations = React.useMemo(() => {
    return conversationsData?.data?.conversations || [];
  }, [conversationsData]);

  // Mutations
  const createConversationMutation = useCreateConversation();
  const sendMessageMutation = useSendMessage();
  const markReadMutation = useMarkAsRead();
  const updateConversationMutation = useUpdateConversation();

  // Auto-select matching conversation OR auto-create if no conversation exists yet for this contact
  React.useEffect(() => {
    const queryKey = `${contactIdParam || ""}-${phoneParam || ""}-${searchParam || ""}`;
    if (!contactIdParam && !phoneParam && !searchParam) return;
    if (autoCreateHandledRef.current === queryKey && selectedConversation) return;

    // 1. Try to find match in loaded conversations list
    const match = conversations.find(
      (c) =>
        (contactIdParam && (c.contact?._id === contactIdParam || c.contact?.id === contactIdParam)) ||
        (phoneParam && c.contact?.phoneNumber?.includes(phoneParam)) ||
        (searchParam && (
          c.contact?.phoneNumber?.includes(searchParam) ||
          `${c.contact?.firstName || ""} ${c.contact?.lastName || ""}`
            .toLowerCase()
            .includes(searchParam.toLowerCase())
        ))
    );

    if (match) {
      setSelectedConversation(match);
      setMobileView("CHAT");
      autoCreateHandledRef.current = queryKey;
      return;
    }

    // 2. If conversations finished loading but contact conversation doesn't exist yet: auto-create/retrieve it!
    if (!isLoadingConversations && (contactIdParam || phoneParam || searchParam) && autoCreateHandledRef.current !== queryKey) {
      autoCreateHandledRef.current = queryKey;
      createConversationMutation
        .mutateAsync({
          contactId: contactIdParam || undefined,
          phone: phoneParam || searchParam || undefined,
        })
        .then((newConv) => {
          if (newConv) {
            setSelectedConversation(newConv);
            setMobileView("CHAT");
          }
        })
        .catch((err) => {
          console.error("Auto-create conversation failed:", err);
        });
    }
  }, [contactIdParam, phoneParam, searchParam, conversations, isLoadingConversations, selectedConversation]);

  // Active selected conversation ID
  const selectedId = React.useMemo(() => {
    return selectedConversation ? selectedConversation.id || selectedConversation._id || null : null;
  }, [selectedConversation]);

  // Fetch active conversation messages
  const { data: messagesData, isLoading: isLoadingMessages } = useMessages(selectedId);
  const messages = React.useMemo(() => {
    return Array.isArray(messagesData?.data) ? messagesData.data : [];
  }, [messagesData]);

  // Keep selectedConversation updated when list refetches
  React.useEffect(() => {
    if (selectedId && conversations.length > 0) {
      const match = conversations.find((c) => (c.id || c._id) === selectedId);
      if (match) {
        setSelectedConversation(match);
      }
    }
  }, [conversations, selectedId]);

  // Handlers
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMobileView("CHAT");

    // Automatically mark as read if unread messages exist
    const id = conversation.id || conversation._id;
    if (id && conversation.unreadCount > 0) {
      markReadMutation.mutate(id);
    }
  };

  const handleStartConversationWithContact = async (contactId: string, phone?: string) => {
    try {
      const conv = await createConversationMutation.mutateAsync({ contactId, phone });
      if (conv) {
        setSelectedConversation(conv);
        setMobileView("CHAT");
      }
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedId) return;
    try {
      await sendMessageMutation.mutateAsync({
        conversationId: selectedId,
        payload: { text },
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleMarkRead = () => {
    if (selectedId) {
      markReadMutation.mutate(selectedId);
    }
  };

  const handleUpdateStatus = (status: "OPEN" | "CLOSED", isArchived = false) => {
    if (!selectedId) return;
    updateConversationMutation.mutate({
      id: selectedId,
      payload: { status, isArchived },
    });
  };

  return (
    <div className="h-[calc(100vh-5rem)] -m-6 md:-m-8 flex overflow-hidden bg-background">
      {/* Left Column: Conversation Sidebar List */}
      <div
        className={cn(
          "w-full md:w-80 lg:w-96 shrink-0 h-full transition-all duration-200",
          mobileView === "CHAT" ? "hidden md:block" : "block"
        )}
      >
        <ConversationList
          conversations={conversations}
          activeId={selectedId}
          onSelectConversation={handleSelectConversation}
          onStartConversationWithContact={handleStartConversationWithContact}
          isLoading={isLoadingConversations}
          isStartingConversation={createConversationMutation.isPending}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      {/* Right Column: Active Chat Panel or Empty Placeholder */}
      <div
        className={cn(
          "flex-1 h-full min-w-0 transition-all duration-200",
          mobileView === "LIST" ? "hidden md:block" : "block"
        )}
      >
        {createConversationMutation.isPending && !selectedConversation ? (
          <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50/50 dark:bg-slate-950/40 text-center border-l border-border/50 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-xs font-semibold text-foreground">Initiating Live Chat Session...</p>
          </div>
        ) : selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            isLoadingMessages={isLoadingMessages}
            isSendingMessage={sendMessageMutation.isPending}
            onSendMessage={handleSendMessage}
            onMarkRead={handleMarkRead}
            onUpdateStatus={handleUpdateStatus}
            onBackToList={() => setMobileView("LIST")}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <DashboardLayout>
      <React.Suspense fallback={<div className="p-8 text-center text-xs">Loading Live Chat...</div>}>
        <ChatPageContent />
      </React.Suspense>
    </DashboardLayout>
  );
}
