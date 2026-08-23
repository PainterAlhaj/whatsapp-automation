"use client"

import * as React from "react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { trendData, campaignPerformanceData } from "@/lib/mock-data"

export function AnalyticsCharts() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="h-[380px] animate-pulse bg-muted/20" />
        <Card className="h-[380px] animate-pulse bg-muted/20" />
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {/* Messages Sent Trend Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Messages Sent Trend</CardTitle>
          <CardDescription>Volume of automated messages sent over the last 7 days.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/50" />
              <XAxis 
                dataKey="date" 
                stroke="currentColor" 
                className="text-muted-foreground/80 font-medium" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="currentColor" 
                className="text-muted-foreground/80 font-medium" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "var(--foreground)" }}
                labelStyle={{ fontWeight: "bold", color: "var(--muted-foreground)" }}
              />
              <Area 
                type="monotone" 
                dataKey="messages" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorMessages)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaign Efficiency Grouped Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Comparison between sent and delivered messages for recent broadcasts.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={campaignPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/50" />
              <XAxis 
                dataKey="name" 
                stroke="currentColor" 
                className="text-muted-foreground/80 font-medium" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="currentColor" 
                className="text-muted-foreground/80 font-medium" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "var(--foreground)" }}
                labelStyle={{ fontWeight: "bold", color: "var(--muted-foreground)" }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "var(--muted-foreground)"
                }}
              />
              <Bar dataKey="Sent" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={32} />
              <Bar dataKey="Delivered" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
