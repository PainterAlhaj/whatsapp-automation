"use client";

import * as React from "react";
import { Conversation } from "@/types/chat.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected?: boolean;
  onSelect: (conversation: Conversation) => void;
}

export function ConversationItem({
  conversation,
  isSelected = false,
  onSelect,
}: ConversationItemProps) {
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

  const formattedTime = React.useMemo(() => {
    if (!conversation.lastMessageAt) return "";
    try {
      const date = new Date(conversation.lastMessageAt);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      if (isToday) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
      }
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  }, [conversation.lastMessageAt]);

  const statusVariant = React.useMemo(() => {
    if (conversation.status === "OPEN") return "success";
    if (conversation.status === "CLOSED") return "secondary";
    return "default";
  }, [conversation.status]);

  return (
    <div
      onClick={() => onSelect(conversation)}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 border border-transparent select-none group",
        isSelected
          ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40"
          : "hover:bg-muted/50 dark:hover:bg-slate-900/60"
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <Avatar className="h-11 w-11 border border-border/60">
          <AvatarFallback className="bg-emerald-600 text-white font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>

        {conversation.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white shadow-xs">
            {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
          </span>
        )}
      </div>

      {/* Main Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <h4
            className={cn(
              "text-sm font-semibold truncate transition-colors",
              isSelected
                ? "text-emerald-950 dark:text-emerald-300 font-bold"
                : "text-foreground group-hover:text-foreground"
            )}
          >
            {displayName}
          </h4>
          {formattedTime && (
            <span
              className={cn(
                "text-[11px] shrink-0 font-medium",
                conversation.unreadCount > 0
                  ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "text-muted-foreground"
              )}
            >
              {formattedTime}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground truncate max-w-[180px]">
            {conversation.lastMessage || "No messages yet"}
          </p>

          <Badge
            variant={statusVariant as any}
            className="text-[9px] px-1.5 py-0 uppercase tracking-wider shrink-0 font-semibold"
          >
            {conversation.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}
