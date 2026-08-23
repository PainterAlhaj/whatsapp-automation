"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Laptop, Smartphone, Ban } from "lucide-react"
import { mockActiveSessions, ActiveSessionItem } from "@/lib/mock-data"

export function SecuritySettings() {
  const [sessions, setSessions] = React.useState<ActiveSessionItem[]>(mockActiveSessions)
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [twoFactor, setTwoFactor] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password fields do not match.")
      return
    }
    setIsSaved(true)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleLogoutAll = () => {
    // Keep active now only
    setSessions(sessions.filter(s => s.activeNow))
    alert("Terminated all secondary sessions successfully.")
  }

  const handleTerminateSession = (id: string) => {
    const session = sessions.find(s => s.id === id)
    if (session?.activeNow) {
      alert("Cannot terminate your current active dashboard session.")
      return
    }
    setSessions(sessions.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6 text-left font-sans text-xs">
      
      {/* Change Password Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">Change Account Password</CardTitle>
          <CardDescription className="text-[11px]">
            Ensure a strong, unique value to guard your Meta API automation pipelines.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Current Password</label>
              <Input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-8 text-xs focus-visible:ring-emerald-500/80" 
                required
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">New Password</label>
                <Input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-8 text-xs focus-visible:ring-emerald-500/80" 
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Confirm New Password</label>
                <Input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-8 text-xs focus-visible:ring-emerald-500/80" 
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button 
                type="submit" 
                className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none"
              >
                Update Password
              </Button>
              {isSaved && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold animate-pulse">
                  ✓ Password updated!
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Two Factor Authentication Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">Two-Factor Authentication (2FA)</CardTitle>
          <CardDescription className="text-[11px]">
            Require verification codes on phone logins alongside account passwords.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="flex items-center justify-between py-1.5">
            <div className="space-y-0.5 pr-4">
              <span className="font-semibold text-foreground block">Authenticator App Verification</span>
              <span className="text-[10px] text-muted-foreground block leading-relaxed">
                Use applications like Google Authenticator or 1Password to generate time-based OTP codes.
              </span>
            </div>
            <input 
              type="checkbox" 
              checked={twoFactor}
              onChange={(e) => {
                setTwoFactor(e.target.checked)
                alert(e.target.checked ? "Enabling 2FA simulation setup code." : "Disabling 2FA security validation.")
              }}
              className="h-4 w-4 rounded border-border focus:ring-emerald-500 text-emerald-600 cursor-pointer shrink-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Active sessions list */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-foreground">Active Browser Sessions</CardTitle>
              <CardDescription className="text-[11px]">
                Authorized desktop browsers and mobile devices currently logged into this workspace.
              </CardDescription>
            </div>
            <Button 
              onClick={handleLogoutAll}
              className="h-7 px-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-semibold cursor-pointer border-none flex items-center gap-1 shrink-0"
            >
              <Ban className="h-3 w-3" /> Terminate Others
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0 divide-y divide-border/40">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted/60 border border-border/30 rounded-lg shrink-0">
                  {session.device.toLowerCase().includes("mac") || session.device.toLowerCase().includes("chrome") ? (
                    <Laptop className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{session.device}</span>
                    {session.activeNow && (
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 border-none font-bold text-[8px] px-1 py-0 select-none">
                        Active Now
                      </Badge>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    {session.location} • {session.ip}
                  </span>
                </div>
              </div>

              {!session.activeNow && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleTerminateSession(session.id)}
                  className="h-7 px-2 text-[10px] text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer rounded-lg border-none"
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  )
}
