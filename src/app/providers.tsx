"use client";

import * as React from "react";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/lib/auth/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";

import { SocketProvider } from "@/providers/socket-provider";

import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <SocketProvider>
            <ProtectedRoute>
              {children}
            </ProtectedRoute>
            <Toaster />
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

