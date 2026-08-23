"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cleanStatus = status.trim().toLowerCase()
  
  let variantClass = "bg-muted text-muted-foreground border-none"
  
  if (
    [
      "active", 
      "success", 
      "approved", 
      "connected", 
      "delivered", 
      "replied", 
      "enabled", 
      "open", 
      "read", 
      "success outcome"
    ].includes(cleanStatus) || 
    cleanStatus.startsWith("success")
  ) {
    variantClass = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-none"
  } else if (
    [
      "warning", 
      "pending", 
      "scheduled", 
      "draft", 
      "connecting"
    ].includes(cleanStatus) || 
    cleanStatus.startsWith("warning")
  ) {
    variantClass = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-none"
  } else if (
    [
      "failed", 
      "error", 
      "disconnected", 
      "disabled", 
      "rejected", 
      "deleted"
    ].includes(cleanStatus) || 
    cleanStatus.startsWith("fail") || 
    cleanStatus.startsWith("error")
  ) {
    variantClass = "bg-red-500/10 text-red-700 dark:text-red-400 border-none"
  } else if (
    [
      "info", 
      "running", 
      "paused"
    ].includes(cleanStatus)
  ) {
    variantClass = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-none"
  }

  return (
    <Badge className={cn("font-bold text-[9px] px-1.5 py-0 uppercase select-none tracking-wider", variantClass, className)}>
      {status}
    </Badge>
  )
}
