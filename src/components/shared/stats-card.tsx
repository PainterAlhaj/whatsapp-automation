"use client"

import * as React from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  iconBgClass?: string
  description?: string
  change?: string
  trend?: "up" | "down" | "neutral"
  className?: string
  titleClassName?: string
  valueClassName?: string
  descriptionClassName?: string
}

export function StatsCard({
  title,
  value,
  icon,
  iconBgClass,
  description,
  change,
  trend,
  className,
  titleClassName,
  valueClassName,
  descriptionClassName
}: StatsCardProps) {
  return (
    <Card className={cn("hover:-translate-y-0.5 hover:shadow-md cursor-default border-border/80 transition-all duration-200", className)}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className={cn("text-xs sm:text-sm font-medium text-muted-foreground", titleClassName)}>{title}</span>
          <div className={cn("p-1.5 sm:p-2 rounded-lg shrink-0", iconBgClass)}>
            {icon}
          </div>
        </div>
        <div className="mt-3 sm:mt-4 flex items-baseline justify-between gap-1">
          <span className={cn("text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground truncate", valueClassName)}>{value}</span>
          {change && (
            <Badge
              variant={trend === "up" ? "success" : trend === "down" ? "destructive" : "secondary"}
              className="gap-0.5 font-semibold shrink-0"
            >
              {trend === "up" && <ArrowUpRight className="h-3 w-3" />}
              {trend === "down" && <ArrowDownRight className="h-3 w-3" />}
              {change}
            </Badge>
          )}
        </div>
        {description && <p className={cn("mt-1 sm:mt-1.5 text-xs text-muted-foreground/90 font-normal", descriptionClassName)}>{description}</p>}
      </CardContent>
    </Card>
  )
}
