"use client";

import * as React from "react";
import { Send, Loader2, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (text: string) => Promise<void> | void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, isLoading = false, disabled = false }: ChatInputProps) {
  const [text, setText] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading || disabled) return;
    setText("");
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    await onSendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // Auto-grow height up to 120px
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  };

  return (
    <div className="p-3 bg-background border-t border-border/80 flex items-end gap-2 shrink-0">
      {/* Decorative emoji button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        className="h-10 w-10 text-muted-foreground hover:text-foreground shrink-0 rounded-full"
        title="Emoji"
      >
        <Smile className="h-5 w-5" />
      </Button>

      {/* Auto-growing Textarea */}
      <div className="flex-1 min-w-0 relative flex items-center">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          disabled={disabled || isLoading}
          onChange={handleTextareaInput}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
          className={cn(
            "w-full resize-none rounded-2xl border border-input bg-muted/30 dark:bg-slate-900 px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 scrollbar-none transition-all duration-150 max-h-[120px]",
            "min-h-[42px]"
          )}
        />
      </div>

      {/* Send Button */}
      <Button
        type="button"
        onClick={handleSend}
        disabled={!text.trim() || isLoading || disabled}
        className="h-10 w-10 shrink-0 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed p-0 flex items-center justify-center cursor-pointer"
        title="Send Message"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4 ml-0.5" />
        )}
      </Button>
    </div>
  );
}
