"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title?: string;
  message: string;
}

type Listener = (toasts: ToastMessage[]) => void;

let toasts: ToastMessage[] = [];
const listeners: Set<Listener> = new Set();

const notify = () => {
  listeners.forEach((listener) => listener([...toasts]));
};

export const toast = {
  success(message: string, title?: string) {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, type: "success", title, message }];
    notify();
    setTimeout(() => toast.dismiss(id), 4000);
  },
  error(message: string, title?: string) {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, type: "error", title, message }];
    notify();
    setTimeout(() => toast.dismiss(id), 5000);
  },
  info(message: string, title?: string) {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, type: "info", title, message }];
    notify();
    setTimeout(() => toast.dismiss(id), 4000);
  },
  dismiss(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
};

export function Toaster() {
  const [currentToasts, setCurrentToasts] = React.useState<ToastMessage[]>([]);

  React.useEffect(() => {
    listeners.add(setCurrentToasts);
    return () => {
      listeners.delete(setCurrentToasts);
    };
  }, []);

  if (currentToasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {currentToasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all transform animate-in slide-in-from-bottom-5 duration-200 text-xs font-sans",
            t.type === "success" &&
              "bg-emerald-950/90 text-emerald-100 border-emerald-800/80 dark:bg-emerald-950 dark:border-emerald-700/80 shadow-emerald-900/20",
            t.type === "error" &&
              "bg-red-950/90 text-red-100 border-red-800/80 dark:bg-red-950 dark:border-red-700/80 shadow-red-900/20",
            t.type === "info" &&
              "bg-zinc-900/90 text-zinc-100 border-zinc-700/80 dark:bg-zinc-900 dark:border-zinc-700/80"
          )}
        >
          {t.type === "success" && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />}
          {t.type === "error" && <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />}
          {t.type === "info" && <Info className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />}

          <div className="flex-1 text-left space-y-0.5">
            {t.title && <h5 className="font-bold text-xs leading-tight">{t.title}</h5>}
            <p className="opacity-90 leading-relaxed text-[11px] font-normal">{t.message}</p>
          </div>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-muted-foreground hover:text-foreground opacity-70 hover:opacity-100 p-0.5 rounded cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
