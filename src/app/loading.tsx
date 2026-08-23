import * as React from "react"
import { LoadingState } from "@/components/shared/loading-state"

export default function GlobalLoading() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full text-left font-sans">
      {/* Sleek skeleton placeholder for page header */}
      <div className="space-y-2.5 animate-pulse max-w-md">
        <div className="h-6 w-32 bg-muted/60 rounded-md" />
        <div className="h-4 w-72 bg-muted/40 rounded-md" />
      </div>
      
      {/* Skeleton block list loaders */}
      <LoadingState rows={3} />
    </div>
  )
}
