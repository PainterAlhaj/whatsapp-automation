"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Laptop, AlignLeft, AlignRight } from "lucide-react"
import { initialAppearancePreferences } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function AppearanceSettings() {
  const [appearance, setAppearance] = React.useState(initialAppearancePreferences)
  const [isSaved, setIsSaved] = React.useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const themes: { name: "light" | "dark" | "system"; label: string; icon: React.ReactNode }[] = [
    { name: "light", label: "Light Mode", icon: <Sun className="h-4 w-4" /> },
    { name: "dark", label: "Dark Mode", icon: <Moon className="h-4 w-4" /> },
    { name: "system", label: "System Default", icon: <Laptop className="h-4 w-4" /> }
  ]

  return (
    <div className="space-y-6 text-left font-sans text-xs">
      
      {/* Theme Cards */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">Theme Selection</CardTitle>
          <CardDescription className="text-[11px]">
            Adjust the dashboard lighting environment to fit your viewing preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="grid gap-3 sm:grid-cols-3 pt-2">
            {themes.map((t) => {
              const isActive = appearance.theme === t.name
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => {
                    setAppearance({ ...appearance, theme: t.name })
                    alert(`Switching visual profile simulation to: ${t.label}.`)
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3.5 rounded-xl border border-border/80 text-left hover:bg-muted/40 transition-colors focus:outline-none cursor-pointer",
                    isActive && "border-emerald-500 bg-emerald-500/[0.02] ring-1 ring-emerald-500/30"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg bg-muted text-muted-foreground",
                    isActive && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  )}>
                    {t.icon}
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">{t.label}</span>
                    <span className="text-[9px] text-muted-foreground block mt-0.5">Custom styling</span>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Sidebar placement & List Compact Modes */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">Layout Preferences</CardTitle>
          <CardDescription className="text-[11px]">
            Structure sidebar positions and grid spacings for optimal readability.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-4">
          
          {/* Sidebar Alignment */}
          <div className="flex items-center justify-between py-2 border-b border-border/40">
            <div className="space-y-0.5 pr-4">
              <span className="font-semibold text-foreground block">Sidebar Alignment</span>
              <span className="text-[10px] text-muted-foreground block">Position the sidebar navigation menu.</span>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                variant={appearance.sidebarPosition === "left" ? "default" : "outline"}
                size="sm"
                onClick={() => setAppearance({ ...appearance, sidebarPosition: "left" })}
                className={cn(
                  "h-8 px-2.5 rounded-lg text-xs font-semibold cursor-pointer gap-1",
                  appearance.sidebarPosition === "left" && "bg-emerald-600 hover:bg-emerald-700 text-white"
                )}
              >
                <AlignLeft className="h-3.5 w-3.5" /> Left
              </Button>
              <Button
                variant={appearance.sidebarPosition === "right" ? "default" : "outline"}
                size="sm"
                onClick={() => setAppearance({ ...appearance, sidebarPosition: "right" })}
                className={cn(
                  "h-8 px-2.5 rounded-lg text-xs font-semibold cursor-pointer gap-1",
                  appearance.sidebarPosition === "right" && "bg-emerald-600 hover:bg-emerald-700 text-white"
                )}
              >
                Right <AlignRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Compact Density Mode */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5 pr-4">
              <span className="font-semibold text-foreground block">Compact List Mode</span>
              <span className="text-[10px] text-muted-foreground block">Reduce table spacing and component margins for high density monitors.</span>
            </div>
            <input 
              type="checkbox"
              checked={appearance.compactMode}
              onChange={(e) => setAppearance({ ...appearance, compactMode: e.target.checked })}
              className="h-4 w-4 rounded border-border focus:ring-emerald-500 text-emerald-600 cursor-pointer shrink-0"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button 
              onClick={handleSave}
              className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
            >
              Save Layout
            </Button>
            {isSaved && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                ✓ Layout saved!
              </span>
            )}
          </div>

        </CardContent>
      </Card>

    </div>
  )
}
