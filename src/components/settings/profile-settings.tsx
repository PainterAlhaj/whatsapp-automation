"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User as UserIcon, Mail, Shield, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

export function ProfileSettings() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Card className="border-border/80 shadow-xs text-left font-sans">
        <CardContent className="p-6 text-center text-xs text-muted-foreground">
          No authenticated user session found.
        </CardContent>
      </Card>
    );
  }

  const initials = ((user.firstName?.[0] || "") + (user.lastName?.[0] || "")).toUpperCase() || user.email.slice(0, 2).toUpperCase();
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "Never";
    try {
      return new Date(isoString).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <Card className="border-border/80 shadow-xs text-left font-sans">
      <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-foreground">User Profile Details</CardTitle>
          <CardDescription className="text-[11px]">
            Live authenticated user account information retrieved from backend API.
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
          Read-Only Session Profile
        </Badge>
      </CardHeader>
      <CardContent className="p-5 pt-0 space-y-6 text-xs">
        {/* User Avatar & Name Banner */}
        <div className="flex items-center gap-4 py-2 border-b border-border/60">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 text-xl shrink-0">
            {initials}
          </div>
          <div className="space-y-0.5">
            <span className="font-bold text-sm text-foreground block">{fullName}</span>
            <span className="text-xs text-muted-foreground block">{user.email}</span>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="secondary" className="text-[10px] capitalize font-semibold">
                Role: {user.role}
              </Badge>
              <Badge
                variant={user.status === "active" ? "success" : "destructive"}
                className="text-[10px] capitalize font-semibold"
              >
                Status: {user.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Read-Only Profile Fields Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* First Name */}
          <div className="space-y-1">
            <label className="font-bold text-muted-foreground">First Name</label>
            <div className="relative">
              <UserIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                readOnly
                value={user.firstName}
                className="h-8 pl-8 text-xs bg-muted/40 cursor-not-allowed focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="space-y-1">
            <label className="font-bold text-muted-foreground">Last Name</label>
            <div className="relative">
              <UserIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                readOnly
                value={user.lastName}
                className="h-8 pl-8 text-xs bg-muted/40 cursor-not-allowed focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="font-bold text-muted-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="email"
                readOnly
                value={user.email}
                className="h-8 pl-8 text-xs bg-muted/40 cursor-not-allowed focus-visible:ring-0"
              />
            </div>
          </div>

          {/* System Role */}
          <div className="space-y-1">
            <label className="font-bold text-muted-foreground">System Role</label>
            <div className="relative">
              <Shield className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                readOnly
                value={user.role}
                className="h-8 pl-8 text-xs bg-muted/40 cursor-not-allowed focus-visible:ring-0 capitalize"
              />
            </div>
          </div>

          {/* Account Created At */}
          <div className="space-y-1">
            <label className="font-bold text-muted-foreground">Account Created</label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                readOnly
                value={formatDate(user.createdAt)}
                className="h-8 pl-8 text-xs bg-muted/40 cursor-not-allowed focus-visible:ring-0"
              />
            </div>
          </div>

          {/* Last Login At */}
          <div className="space-y-1">
            <label className="font-bold text-muted-foreground">Last Login</label>
            <div className="relative">
              <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                readOnly
                value={formatDate(user.lastLoginAt)}
                className="h-8 pl-8 text-xs bg-muted/40 cursor-not-allowed focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Account Verification & Status Badges */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-2">
            {user.isEmailVerified ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-amber-500 shrink-0" />
            )}
            <div>
              <span className="font-bold text-foreground block text-xs">Email Verification Status</span>
              <span className="text-[11px] text-muted-foreground">
                {user.isEmailVerified ? "Email address verified." : "Email address pending verification."}
              </span>
            </div>
          </div>
          <Badge variant={user.isEmailVerified ? "success" : "warning"} className="self-start sm:self-center font-semibold">
            {user.isEmailVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
