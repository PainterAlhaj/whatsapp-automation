"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  sentMessagesChartData, 
  deliveryFailedChartData, 
  contactGrowthChartData, 
  categoryDistributionData 
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function AnalyticsCharts() {
  // Tooltip tracking states
  const [activeLineIdx, setActiveLineIdx] = React.useState<number | null>(null)
  const [activeBarIdx, setActiveBarIdx] = React.useState<number | null>(null)
  const [activeGrowthIdx, setActiveGrowthIdx] = React.useState<number | null>(null)
  const [activeDonutIdx, setActiveDonutIdx] = React.useState<number | null>(null)

  // 1. Line Chart Calculations (Messages Sent Over Time)
  const maxLineVal = Math.max(...sentMessagesChartData.map(d => d.value))
  const linePoints = sentMessagesChartData.map((d, i) => {
    const x = 30 + i * 55
    const y = 110 - (d.value / maxLineVal) * 75
    return { x, y, val: d.value, label: d.label }
  })
  const linePathD = linePoints.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
  }, "")
  
  // Area fill path definition under the line
  const areaPathD = linePoints.length > 0 
    ? `${linePathD} L ${linePoints[linePoints.length - 1].x} 110 L ${linePoints[0].x} 110 Z`
    : ""

  // 2. Bar Chart Calculations (Delivery vs Failed)
  const maxBarVal = Math.max(...deliveryFailedChartData.map(d => d.value + (d.secondaryValue || 0)))

  // 3. Contact Growth Area Chart
  const maxGrowthVal = Math.max(...contactGrowthChartData.map(d => d.value))
  const growthPoints = contactGrowthChartData.map((d, i) => {
    const x = 30 + i * 110
    const y = 110 - (d.value / maxGrowthVal) * 75
    return { x, y, val: d.value, label: d.label }
  })
  const growthPathD = growthPoints.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
  }, "")
  const growthAreaD = growthPoints.length > 0
    ? `${growthPathD} L ${growthPoints[growthPoints.length - 1].x} 110 L ${growthPoints[0].x} 110 Z`
    : ""

  // 4. Donut Chart Calculations (r=40, C=251.2)
  const donutRadius = 38
  const donutCircumference = 2 * Math.PI * donutRadius // ~238.76
  const colors = [
    "stroke-emerald-500", // Promotions
    "stroke-blue-500",    // Utility
    "stroke-purple-500",  // Welcome
    "stroke-amber-500"    // Custom
  ]
  const textColors = [
    "text-emerald-500",
    "text-blue-500",
    "text-purple-500",
    "text-amber-500"
  ]
  const donutBgs = [
    "bg-emerald-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-amber-500"
  ]

  let accumulatedPercent = 0

  return (
    <div className="grid gap-6 md:grid-cols-12">
      {/* Messages Sent Over Time (Line Area Chart) */}
      <Card className="md:col-span-6 border-border/80 shadow-xs text-left">
        <CardHeader className="p-5 pb-2">
          <CardTitle className="text-sm font-bold text-foreground">Messages Sent Over Time</CardTitle>
          <CardDescription className="text-[11px]">Weekly message broadcast trigger volumes</CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="relative h-[160px] w-full mt-2">
            <svg viewBox="0 0 400 130" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Y Guidelines */}
              <line x1="20" y1="35" x2="380" y2="35" className="stroke-border/40 dark:stroke-zinc-800/40 stroke-1" strokeDasharray="3 3" />
              <line x1="20" y1="72" x2="380" y2="72" className="stroke-border/40 dark:stroke-zinc-800/40 stroke-1" strokeDasharray="3 3" />
              <line x1="20" y1="110" x2="380" y2="110" className="stroke-border/60 dark:stroke-zinc-800/60 stroke-1" />

              {/* Gradient Area under line */}
              <path d={areaPathD} fill="url(#lineGrad)" className="transition-all duration-300" />

              {/* Line Curve path */}
              <path d={linePathD} fill="none" className="stroke-emerald-500 dark:stroke-emerald-400 stroke-2.5 transition-all duration-300" />

              {/* Data points dots */}
              {linePoints.map((pt, idx) => (
                <g key={idx} className="cursor-pointer" 
                   onMouseEnter={() => setActiveLineIdx(idx)}
                   onMouseLeave={() => setActiveLineIdx(null)}>
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r={activeLineIdx === idx ? 5 : 3.5} 
                    className="fill-background stroke-emerald-500 dark:stroke-emerald-400 stroke-2 transition-all"
                  />
                  {/* Invisible larger hover catcher */}
                  <circle cx={pt.x} cy={pt.y} r={12} className="fill-transparent" />
                </g>
              ))}

              {/* X Labels */}
              {linePoints.map((pt, idx) => (
                <text key={idx} x={pt.x} y={125} textAnchor="middle" className="fill-muted-foreground text-[9px] font-medium font-sans">
                  {pt.label}
                </text>
              ))}
            </svg>

            {/* Float Tooltip */}
            {activeLineIdx !== null && (
              <div className="absolute p-2 rounded-lg bg-zinc-950 text-white text-[10px] shadow-md border border-zinc-800 pointer-events-none -translate-x-1/2 -translate-y-full flex flex-col items-center"
                   style={{ left: `${(linePoints[activeLineIdx].x / 400) * 100}%`, top: `${(linePoints[activeLineIdx].y / 130) * 100}%` }}>
                <span className="font-bold">{linePoints[activeLineIdx].val.toLocaleString()} sends</span>
                <span className="text-zinc-400 text-[8px]">{linePoints[activeLineIdx].label}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delivery vs Failed Bar Chart */}
      <Card className="md:col-span-6 border-border/80 shadow-xs text-left">
        <CardHeader className="p-5 pb-2">
          <CardTitle className="text-sm font-bold text-foreground">Delivery vs Failed Rate</CardTitle>
          <CardDescription className="text-[11px]">Meta API status results breakdown</CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="relative h-[160px] w-full mt-2">
            <svg viewBox="0 0 400 130" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="20" y1="35" x2="380" y2="35" className="stroke-border/40 dark:stroke-zinc-800/40 stroke-1" strokeDasharray="3 3" />
              <line x1="20" y1="72" x2="380" y2="72" className="stroke-border/40 dark:stroke-zinc-800/40 stroke-1" strokeDasharray="3 3" />
              <line x1="20" y1="110" x2="380" y2="110" className="stroke-border/60 dark:stroke-zinc-800/60 stroke-1" />

              {deliveryFailedChartData.map((d, i) => {
                const x = 32 + i * 53
                const deliveredHeight = (d.value / maxBarVal) * 75
                const failedHeight = ((d.secondaryValue || 0) / maxBarVal) * 75
                
                return (
                  <g key={i} className="cursor-pointer"
                     onMouseEnter={() => setActiveBarIdx(i)}
                     onMouseLeave={() => setActiveBarIdx(null)}>
                    {/* Delivered Bar (Emerald) */}
                    <rect 
                      x={x} 
                      y={110 - deliveredHeight} 
                      width={12} 
                      height={deliveredHeight} 
                      rx={1}
                      className="fill-emerald-500 hover:fill-emerald-600 transition-all"
                    />
                    {/* Failed Bar (Red) */}
                    <rect 
                      x={x + 14} 
                      y={110 - failedHeight} 
                      width={12} 
                      height={failedHeight} 
                      rx={1}
                      className="fill-red-500 hover:fill-red-600 transition-all"
                    />
                    {/* Label */}
                    <text x={x + 13} y={125} textAnchor="middle" className="fill-muted-foreground text-[9px] font-medium font-sans">
                      {d.label}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Float Tooltip */}
            {activeBarIdx !== null && (
              <div className="absolute p-2 rounded-lg bg-zinc-950 text-white text-[10px] shadow-md border border-zinc-800 pointer-events-none -translate-y-full flex flex-col gap-0.5"
                   style={{ left: `${((32 + activeBarIdx * 53 + 13) / 400) * 100}%`, top: `35%` }}>
                <span className="font-bold border-b border-zinc-800 pb-1 block text-left">
                  {deliveryFailedChartData[activeBarIdx].label} Metrics
                </span>
                <span className="text-emerald-400 flex justify-between gap-3 text-[9px]">
                  Delivered: <strong>{deliveryFailedChartData[activeBarIdx].value}</strong>
                </span>
                <span className="text-red-400 flex justify-between gap-3 text-[9px]">
                  Failed: <strong>{deliveryFailedChartData[activeBarIdx].secondaryValue}</strong>
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Growth Area Chart */}
      <Card className="md:col-span-6 border-border/80 shadow-xs text-left">
        <CardHeader className="p-5 pb-2">
          <CardTitle className="text-sm font-bold text-foreground">Contact Growth Rate</CardTitle>
          <CardDescription className="text-[11px]">Accumulated directory subscribers</CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="relative h-[160px] w-full mt-2">
            <svg viewBox="0 0 400 130" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Guidelines */}
              <line x1="20" y1="35" x2="380" y2="35" className="stroke-border/40 dark:stroke-zinc-800/40 stroke-1" strokeDasharray="3 3" />
              <line x1="20" y1="72" x2="380" y2="72" className="stroke-border/40 dark:stroke-zinc-800/40 stroke-1" strokeDasharray="3 3" />
              <line x1="20" y1="110" x2="380" y2="110" className="stroke-border/60 dark:stroke-zinc-800/60 stroke-1" />

              {/* Growth Area fill */}
              <path d={growthAreaD} fill="url(#growthGrad)" className="transition-all duration-300" />

              {/* Growth Path Line */}
              <path d={growthPathD} fill="none" className="stroke-blue-500 dark:stroke-blue-400 stroke-2.5 transition-all duration-300" />

              {/* Points */}
              {growthPoints.map((pt, idx) => (
                <g key={idx} className="cursor-pointer"
                   onMouseEnter={() => setActiveGrowthIdx(idx)}
                   onMouseLeave={() => setActiveGrowthIdx(null)}>
                  <circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r={activeGrowthIdx === idx ? 5 : 3.5} 
                    className="fill-background stroke-blue-500 dark:stroke-blue-400 stroke-2 transition-all"
                  />
                  <circle cx={pt.x} cy={pt.y} r={12} className="fill-transparent" />
                </g>
              ))}

              {/* Labels */}
              {growthPoints.map((pt, idx) => (
                <text key={idx} x={pt.x} y={125} textAnchor="middle" className="fill-muted-foreground text-[9px] font-medium font-sans">
                  {pt.label}
                </text>
              ))}
            </svg>

            {/* Float Tooltip */}
            {activeGrowthIdx !== null && (
              <div className="absolute p-2 rounded-lg bg-zinc-950 text-white text-[10px] shadow-md border border-zinc-800 pointer-events-none -translate-x-1/2 -translate-y-full flex flex-col items-center"
                   style={{ left: `${(growthPoints[activeGrowthIdx].x / 400) * 100}%`, top: `${(growthPoints[activeGrowthIdx].y / 130) * 100}%` }}>
                <span className="font-bold">{growthPoints[activeGrowthIdx].val.toLocaleString()} contacts</span>
                <span className="text-zinc-400 text-[8px]">{growthPoints[activeGrowthIdx].label}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Message Distribution by Category Donut Chart */}
      <Card className="md:col-span-6 border-border/80 shadow-xs text-left">
        <CardHeader className="p-5 pb-2">
          <CardTitle className="text-sm font-bold text-foreground">Category Share Distribution</CardTitle>
          <CardDescription className="text-[11px]">Message composition ratios by Meta category</CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-4">
            {/* Donut SVG Circle */}
            <div className="relative w-28 h-28 shrink-0 select-none">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle 
                  cx="50" 
                  cy="50" 
                  r={donutRadius} 
                  fill="transparent" 
                  className="stroke-border/40 dark:stroke-zinc-800/40 stroke-7" 
                />
                
                {categoryDistributionData.map((item, idx) => {
                  const percentage = item.value / 100
                  const strokeLength = percentage * donutCircumference
                  const dashOffset = -(accumulatedPercent * donutCircumference)
                  accumulatedPercent += percentage

                  return (
                    <circle
                      key={idx}
                      cx="50"
                      cy="50"
                      r={donutRadius}
                      fill="transparent"
                      className={cn("stroke-7 transition-all duration-300", colors[idx])}
                      strokeDasharray={`${strokeLength} ${donutCircumference}`}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      onMouseEnter={() => setActiveDonutIdx(idx)}
                      onMouseLeave={() => setActiveDonutIdx(null)}
                      style={{ cursor: "pointer" }}
                    />
                  )
                })}
              </svg>

              {/* Center Labels */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-bold text-foreground leading-none">
                  {activeDonutIdx !== null ? `${categoryDistributionData[activeDonutIdx].value}%` : "28.4K"}
                </span>
                <span className="text-[8px] text-muted-foreground mt-0.5">
                  {activeDonutIdx !== null ? categoryDistributionData[activeDonutIdx].label.split(" ")[0] : "Sent"}
                </span>
              </div>
            </div>

            {/* Donut Legends list */}
            <div className="flex-1 space-y-2 w-full">
              {categoryDistributionData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", donutBgs[idx])} />
                    <span className="text-muted-foreground truncate max-w-[130px]" title={item.label}>
                      {item.label}
                    </span>
                  </div>
                  <strong className={cn("font-semibold shrink-0 ml-2", textColors[idx])}>
                    {item.value}%
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
