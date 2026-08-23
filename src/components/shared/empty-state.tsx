"use client"

import * as React from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("border border-dashed border-border/80 rounded-xl p-12 text-center flex flex-col items-center justify-center bg-card shadow-xs font-sans text-xs", className)}>
      <div className="p-3.5 rounded-full bg-muted border border-border/30 mb-4 text-muted-foreground">
        {icon || <AlertCircle className="h-7 w-7" />}
      </div>
      <h3 className="font-bold text-sm text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mb-5 leading-relaxed font-normal">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          size="sm"
          onClick={onAction}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
