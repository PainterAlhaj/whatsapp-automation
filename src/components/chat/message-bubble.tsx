"use client";

import * as React from "react";
import { Message } from "@/types/chat.types";
import { Check, CheckCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutbound = message.direction === "OUTBOUND";

  // Format timestamp (e.g. "14:32" or "2:32 PM")
  const formattedTime = React.useMemo(() => {
    const rawDate = message.sentAt || message.createdAt;
    if (!rawDate) return "";
    try {
      const date = new Date(rawDate);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    } catch {
      return "";
    }
  }, [message.sentAt, message.createdAt]);

  // Render status ticks for outbound messages
  const renderStatusIcon = () => {
    if (!isOutbound) return null;

    switch (message.status) {
      case "SENT":
        return <Check className="w-3.5 h-3.5 text-white/80 dark:text-emerald-200 shrink-0" />;
      case "DELIVERED":
        return <CheckCheck className="w-3.5 h-3.5 text-white/80 dark:text-emerald-200 shrink-0" />;
      case "READ":
        return <CheckCheck className="w-3.5 h-3.5 text-cyan-200 dark:text-cyan-300 shrink-0 font-bold" />;
      case "FAILED":
        return <AlertCircle className="w-3.5 h-3.5 text-red-200 shrink-0" />;
      default:
        return <Check className="w-3.5 h-3.5 text-white/70 shrink-0" />;
    }
  };

  return (
    <div
      className={cn(
        "flex w-full my-1 px-1",
        isOutbound ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative max-w-[85%] sm:max-w-[70%] md:max-w-[60%] px-3.5 py-2 rounded-2xl shadow-2xs text-sm break-words whitespace-pre-wrap leading-relaxed",
          isOutbound
            ? "bg-emerald-600 text-white rounded-br-2xs dark:bg-emerald-700"
            : "bg-white text-foreground border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700/80 rounded-bl-2xs"
        )}
      >
        {/* Message Content */}
        <div className="pr-12">{message.content}</div>

        {/* Footer timestamp & status icon */}
        <div
          className={cn(
            "absolute bottom-1 right-2.5 flex items-center gap-1 text-[10px] select-none font-medium",
            isOutbound ? "text-emerald-100/90" : "text-muted-foreground"
          )}
        >
          <span>{formattedTime}</span>
          {renderStatusIcon()}
        </div>
      </div>
    </div>
  );
}
