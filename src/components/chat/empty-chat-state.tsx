"use client";

import * as React from "react";
import { MessageSquare, Lock, ShieldCheck } from "lucide-react";

export function EmptyChatState() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50/50 dark:bg-slate-950/40 text-center select-none border-l border-border/50">
      <div className="max-w-md flex flex-col items-center space-y-4">
        {/* Animated outer circle badge */}
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-2 shadow-xs ring-8 ring-emerald-500/10">
          <MessageSquare className="w-12 h-12" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Whats<span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Flow</span> Live Chat
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
          Send and receive WhatsApp Cloud API messages directly inside your dashboard. Select a conversation from the left sidebar to start responding to customers.
        </p>

        <div className="pt-6 flex items-center gap-2 text-xs font-medium text-muted-foreground/80 bg-background/80 dark:bg-slate-900/80 border border-border/60 px-4 py-2 rounded-full shadow-2xs">
          <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Meta WhatsApp Cloud API Certified</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ml-1" />
        </div>
      </div>
    </div>
  );
}
