"use client";

import * as React from "react";
import { Conversation } from "@/types/chat.types";
import { ConversationItem } from "./conversation-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Search,
  MessageSquareX,
  MessageSquare,
  Plus,
  Loader2,
  Phone,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useContacts } from "@/hooks/use-contacts";
import { Contact } from "@/types/contact.types";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  onStartConversationWithContact?: (contactId: string, phone?: string) => Promise<void> | void;
  isLoading?: boolean;
  isStartingConversation?: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const statusTabs = [
  { id: "ALL", label: "All" },
  { id: "UNREAD", label: "Unread" },
  { id: "OPEN", label: "Open" },
  { id: "CLOSED", label: "Closed" },
];

export function ConversationList({
  conversations,
  activeId,
  onSelectConversation,
  onStartConversationWithContact,
  isLoading = false,
  isStartingConversation = false,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ConversationListProps) {
  // Start Chat Modal State
  const [isStartChatModalOpen, setIsStartChatModalOpen] = React.useState(false);
  const [contactSearchQuery, setContactSearchQuery] = React.useState("");
  const [debouncedContactSearch, setDebouncedContactSearch] = React.useState("");
  const [selectingContactId, setSelectingContactId] = React.useState<string | null>(null);

  // Debounce contact search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedContactSearch(contactSearchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [contactSearchQuery]);

  // Fetch contacts for "Start Chat" dialog
  const { data: contactsResponse, isLoading: isLoadingContacts } = useContacts({
    search: debouncedContactSearch.trim() || undefined,
    limit: 20,
  });

  const availableContacts = contactsResponse?.contacts || [];

  const handleSelectContactToStartChat = async (contact: Contact) => {
    if (!onStartConversationWithContact) return;
    try {
      setSelectingContactId(contact._id);
      await onStartConversationWithContact(contact._id, contact.phoneNumber);
      setIsStartChatModalOpen(false);
    } catch (err) {
      console.error("Failed to start chat with contact:", err);
    } finally {
      setSelectingContactId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border-r border-border/80 min-w-0">
      {/* Sidebar Top Header & Start Chat Button */}
      <div className="p-3 border-b border-border/80 flex items-center justify-between shrink-0 bg-muted/10 dark:bg-zinc-900/10">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Conversations</span>
        </h2>
        <Button
          size="sm"
          onClick={() => setIsStartChatModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold h-8 px-2.5 flex items-center gap-1 cursor-pointer shadow-2xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Start Chat</span>
        </Button>
      </div>

      {/* Search Header */}
      <div className="p-3 border-b border-border/80 space-y-2.5 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search name or phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-muted/40 dark:bg-slate-900 border-border/70 text-xs md:text-sm rounded-xl focus-visible:ring-emerald-500/80"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onStatusFilterChange(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer select-none",
                  isActive
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversations List Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          /* Loading Skeletons */
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl animate-pulse bg-muted/30"
            >
              <div className="w-11 h-11 rounded-full bg-muted-foreground/20 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
                <div className="h-3 bg-muted-foreground/15 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : conversations.length === 0 ? (
          /* Empty Filter State */
          <div className="h-64 flex flex-col items-center justify-center text-center p-4 text-muted-foreground space-y-3">
            <MessageSquareX className="h-10 w-10 text-muted-foreground/50 stroke-1" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">No conversations found</p>
              <p className="text-[11px] text-muted-foreground/80 max-w-[200px]">
                Click below to select a contact and start a new WhatsApp conversation.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsStartChatModalOpen(true)}
              className="h-8 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 text-xs font-semibold rounded-lg cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Start New Chat
            </Button>
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id || conv._id}
              conversation={conv}
              isSelected={(conv.id || conv._id) === activeId}
              onSelect={onSelectConversation}
            />
          ))
        )}
      </div>

      {/* Start Chat Modal Dialog */}
      <Dialog open={isStartChatModalOpen} onOpenChange={setIsStartChatModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-5 w-5 text-emerald-600" /> Start New Conversation
            </DialogTitle>
            <DialogDescription className="text-xs">
              Select a contact to open a live chat window and send WhatsApp messages.
            </DialogDescription>
          </DialogHeader>

          {/* Contact Search Bar inside modal */}
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contact by name or phone..."
              value={contactSearchQuery}
              onChange={(e) => setContactSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Contacts List inside modal */}
          <div className="max-h-72 overflow-y-auto divide-y divide-border/40 mt-3 border border-border/60 rounded-lg">
            {isLoadingContacts ? (
              <div className="p-6 flex items-center justify-center text-xs text-muted-foreground gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                <span>Loading contacts...</span>
              </div>
            ) : availableContacts.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">No contacts found</p>
                <p>Add new contacts in the Contacts section first.</p>
              </div>
            ) : (
              availableContacts.map((contact) => {
                const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Unnamed Contact";
                const initials = fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "C";
                const phoneDisplay = contact.countryCode ? `${contact.countryCode} ${contact.phoneNumber}` : contact.phoneNumber;
                const isSelectingThis = selectingContactId === contact._id;

                return (
                  <div
                    key={contact._id}
                    className="p-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/40 flex items-center justify-center font-bold text-xs shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-foreground truncate">{fullName}</h4>
                        <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                          <Phone className="h-2.5 w-2.5" /> {phoneDisplay}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      disabled={isSelectingThis || isStartingConversation}
                      onClick={() => handleSelectContactToStartChat(contact)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold h-7 px-3 cursor-pointer shrink-0 ml-2"
                    >
                      {isSelectingThis ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-3 w-3 mr-1" /> Chat
                        </>
                      )}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
