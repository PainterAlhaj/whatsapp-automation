"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  const pathname = usePathname()
  
  // Split paths and filter empty segments
  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border/80 mb-6">
      <div className="space-y-1.5">
        {/* Breadcrumbs */}
        {pathSegments.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground/90 mb-1" aria-label="Breadcrumb">
            <Link 
              href="/dashboard" 
              className="hover:text-foreground flex items-center gap-1 transition-colors duration-150"
            >
              <Home className="h-3.5 w-3.5" />
            </Link>
            {pathSegments.map((segment, idx) => {
              const href = `/${pathSegments.slice(0, idx + 1).join("/")}`
              const isLast = idx === pathSegments.length - 1
              
              // Handle formatting (e.g. camelCase or hyphens)
              const formattedName = segment
                .split("-")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")

              return (
                <React.Fragment key={segment}>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                  {isLast ? (
                    <span className="font-medium text-foreground">{formattedName}</span>
                  ) : (
                    <Link
                      href={href}
                      className="hover:text-foreground transition-colors duration-150"
                    >
                      {formattedName}
                    </Link>
                  )}
                </React.Fragment>
              )
            })}
          </nav>
        )}

        {/* Title & Description */}
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl">{description}</p>
        )}
      </div>

      {/* Action Slot */}
      {children && (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center mt-2 sm:mt-0">
          {children}
        </div>
      )}
    </div>
  )
}
