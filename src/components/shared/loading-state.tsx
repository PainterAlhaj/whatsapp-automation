"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface LoadingStateProps {
  rows?: number
  className?: string
  rowHeightClass?: string
}

export function LoadingState({ rows = 4, className, rowHeightClass = "h-16" }: LoadingStateProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, idx) => (
        <div 
          key={idx} 
          className={cn("w-full bg-muted/40 animate-pulse border border-border rounded-xl", rowHeightClass)} 
        />
      ))}
    </div>
  )
}
