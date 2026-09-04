"use client";

import * as React from "react";
import { Conversation, Message } from "@/types/chat.types";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  CheckCheck,
  MoreVertical,
  Phone,
  CheckCircle2,
  XCircle,
  Archive,
  Loader2,
  Lock,
  Send,
  MessageSquarePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  isLoadingMessages?: boolean;
  isSendingMessage?: boolean;
  onSendMessage: (text: string) => Promise<void> | void;
  onMarkRead?: () => void;
  onUpdateStatus?: (status: "OPEN" | "CLOSED", isArchived?: boolean) => void;
  onBackToList?: () => void; // Mobile back button handler
}

export function ChatWindow({
  conversation,
  messages,
  isLoadingMessages = false,
  isSendingMessage = false,
  onSendMessage,
  onMarkRead,
  onUpdateStatus,
  onBackToList,
}: ChatWindowProps) {
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const contact = conversation.contact;
  const displayName = React.useMemo(() => {
    if (contact?.firstName || contact?.lastName) {
      return `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
    }
    return contact?.phoneNumber || "Unknown Contact";
  }, [contact]);

  const initials = React.useMemo(() => {
    if (contact?.firstName && contact?.lastName) {
      return `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase();
    }
    if (contact?.firstName) {
      return contact.firstName.slice(0, 2).toUpperCase();
    }
    if (contact?.phoneNumber) {
      return contact.phoneNumber.slice(-2);
    }
    return "WA";
  }, [contact]);

  // Auto-scroll to bottom of message list
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  React.useEffect(() => {
    scrollToBottom("auto");
  }, [conversation.id, conversation._id]);

  React.useEffect(() => {
    scrollToBottom("smooth");
  }, [messages.length]);

  return (
    <div className="flex flex-col h-full bg-slate-50/70 dark:bg-slate-950/60 relative overflow-hidden min-w-0 border-l border-border/50">
      {/* Active Chat Header */}
      <div className="h-16 px-4 bg-background border-b border-border/80 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Back Button for Mobile View */}
          {onBackToList && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBackToList}
              className="md:hidden h-9 w-9 rounded-full shrink-0 text-muted-foreground hover:text-foreground"
              title="Back to conversations"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          {/* Contact Avatar & Info */}
          <Avatar className="h-10 w-10 border border-border/60 shrink-0">
            <AvatarFallback className="bg-emerald-600 text-white font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground truncate">{displayName}</h3>
              <Badge
                variant={conversation.status === "OPEN" ? "success" : "secondary"}
                className="text-[9px] px-1.5 py-0 uppercase font-semibold hidden sm:inline-flex"
              >
                {conversation.status}
              </Badge>
            </div>
            {contact?.phoneNumber && (
              <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                <Phone className="h-2.5 w-2.5" />
                {contact.phoneNumber}
              </span>
            )}
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Mark Read Action Button */}
          {conversation.unreadCount > 0 && onMarkRead && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkRead}
              className="h-8 gap-1.5 text-xs rounded-lg text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-semibold cursor-pointer"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mark Read</span>
            </Button>
          )}

          {/* Status & Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs">Manage Conversation</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {conversation.status !== "OPEN" && onUpdateStatus && (
                <DropdownMenuItem
                  onClick={() => onUpdateStatus("OPEN")}
                  className="gap-2 text-xs text-emerald-600 dark:text-emerald-400 cursor-pointer font-medium"
                >
                  <CheckCircle2 className="h-4 w-4" /> Re-open Conversation
                </DropdownMenuItem>
              )}

              {conversation.status !== "CLOSED" && onUpdateStatus && (
                <DropdownMenuItem
                  onClick={() => onUpdateStatus("CLOSED")}
                  className="gap-2 text-xs text-amber-600 dark:text-amber-400 cursor-pointer font-medium"
                >
                  <XCircle className="h-4 w-4" /> Close Conversation
                </DropdownMenuItem>
              )}

              {onUpdateStatus && (
                <DropdownMenuItem
                  onClick={() => onUpdateStatus((conversation.status as any) || "CLOSED", true)}
                  className="gap-2 text-xs text-muted-foreground cursor-pointer"
                >
                  <Archive className="h-4 w-4" /> Archive Chat
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
        {/* Encryption badge */}
        <div className="flex justify-center my-2">
          <div className="flex items-center gap-1.5 bg-amber-100/70 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/30 text-[11px] px-3 py-1 rounded-lg text-center max-w-md shadow-2xs font-medium">
            <Lock className="h-3 w-3 shrink-0" />
            <span>Messages are end-to-end encrypted & delivered via Meta WhatsApp API.</span>
          </div>
        </div>

        {isLoadingMessages ? (
          /* Loading indicator */
          <div className="h-48 flex items-center justify-center text-muted-foreground gap-2 text-xs">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
            <span>Loading chat history...</span>
          </div>
        ) : messages.length === 0 ? (
          /* Empty message history / Start Conversation banner */
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 shadow-2xs ring-4 ring-emerald-500/10">
              <MessageSquarePlus className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-foreground mb-1">
              Start Conversation with {displayName}
            </h4>
            <p className="text-xs text-muted-foreground max-w-xs mb-4">
              No message history for this contact yet. Send your first WhatsApp message below to initiate the chat!
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 text-[11px] font-semibold">
              <Send className="w-3.5 h-3.5" />
              <span>Ready to send outbound message</span>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id || msg._id} message={msg} />
          ))
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Chat Input */}
      <ChatInput
        onSendMessage={onSendMessage}
        isLoading={isSendingMessage}
        disabled={conversation.status === "CLOSED"}
      />
    </div>
  );
}
