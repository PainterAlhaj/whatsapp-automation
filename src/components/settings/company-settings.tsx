"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Briefcase, Mail, Globe, MapPin, Clock } from "lucide-react"
import { initialCompanySettings } from "@/lib/mock-data"

export function CompanySettings() {
  const [company, setCompany] = React.useState(initialCompanySettings)
  const [isSaved, setIsSaved] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <Card className="border-border/80 shadow-xs text-left font-sans">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-sm font-bold text-foreground">Workspace & Company Profile</CardTitle>
        <CardDescription className="text-[11px]">
          Configure default metadata parameters for automated outbound business context.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Company Name */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Company Name</label>
              <div className="relative">
                <Briefcase className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  type="text" 
                  value={company.companyName} 
                  onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
                  className="h-8 pl-8 text-xs focus-visible:ring-emerald-500/80" 
                  required
                />
              </div>
            </div>

            {/* Business Email */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Business Invoice Email</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  type="email" 
                  value={company.businessEmail} 
                  onChange={(e) => setCompany({ ...company, businessEmail: e.target.value })}
                  className="h-8 pl-8 text-xs focus-visible:ring-emerald-500/80" 
                  required
                />
              </div>
            </div>

            {/* Website */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Business Website</label>
              <div className="relative">
                <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  type="url" 
                  value={company.website} 
                  onChange={(e) => setCompany({ ...company, website: e.target.value })}
                  className="h-8 pl-8 text-xs focus-visible:ring-emerald-500/80" 
                  required
                />
              </div>
            </div>

            {/* Timezone */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Workspace Time Zone</label>
              <div className="relative">
                <Clock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <select 
                  value={company.timeZone}
                  onChange={(e) => setCompany({ ...company, timeZone: e.target.value })}
                  className="w-full h-8 pl-8 pr-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all font-sans"
                >
                  <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                  <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                  <option value="UTC+0 (London)">UTC+0 (London)</option>
                  <option value="UTC+5:30 (Kolkata)">UTC+5:30 (Kolkata)</option>
                </select>
              </div>
            </div>

            {/* Country */}
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Operating Country</label>
              <div className="relative">
                <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <select 
                  value={company.country}
                  onChange={(e) => setCompany({ ...company, country: e.target.value })}
                  className="w-full h-8 pl-8 pr-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all font-sans"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="India">India</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button 
              type="submit" 
              className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
            >
              Save Workspace
            </Button>
            {isSaved && (
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                ✓ Workspace updated successfully!
              </span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
