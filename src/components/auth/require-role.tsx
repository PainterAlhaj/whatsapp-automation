"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { ShieldAlert } from "lucide-react";

interface RequireRoleProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

/**
 * Role-Based Access Control (RBAC) component wrapper.
 * Restricts rendering to authorized roles.
 */
export function RequireRole({
  children,
  allowedRoles,
  fallback,
}: RequireRoleProps) {
  const { user } = useAuth();

  // Normalize roles to lowercase for flexible checks
  const userRole = user?.role?.toLowerCase() || "";
  const isAuthorized = allowedRoles
    .map((r) => r.toLowerCase())
    .includes(userRole);

  if (!isAuthorized) {
    if (fallback !== undefined) {
      return <>{fallback}</>;
    }

    // Default premium access denied fallback block
    return (
      <div className="border border-border/80 bg-card rounded-xl p-8 text-center flex flex-col items-center justify-center shadow-xs">
        <div className="p-3.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-4 animate-bounce">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h4 className="font-bold text-sm text-foreground mb-1">Access Restrained</h4>
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
          Your account role (<span className="font-semibold text-foreground">{user?.role || "Guest"}</span>) does not possess permission rights to access this workspace resource.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
