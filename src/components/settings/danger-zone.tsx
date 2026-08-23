"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from "@/components/ui/dialog"
import { AlertOctagon, ShieldAlert } from "lucide-react"

export function DangerZone() {
  const [deleteType, setDeleteType] = React.useState<"workspace" | "account" | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [confirmText, setConfirmText] = React.useState("")

  const openConfirmation = (type: "workspace" | "account") => {
    setDeleteType(type)
    setConfirmText("")
    setIsModalOpen(true)
  }

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const targetString = deleteType === "workspace" ? "DELETE WORKSPACE" : "DELETE ACCOUNT"
    
    if (confirmText !== targetString) {
      alert(`Invalid text confirmation. Please type "${targetString}" exactly.`)
      return
    }

    alert(`Simulating deletion action. Your ${deleteType} files have been queued for termination.`)
    setIsModalOpen(false)
    setConfirmText("")
  }

  return (
    <div className="space-y-6 text-left font-sans text-xs">
      
      {/* Danger zone header card */}
      <Card className="border-red-500/30 dark:border-red-900/50 bg-red-500/[0.01] shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <AlertOctagon className="h-4 w-4 shrink-0" />
            Critical Actions Workspace
          </CardTitle>
          <CardDescription className="text-[11px] text-red-500/80">
            Deleting workspace assets or user profiles is permanent. Proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0 divide-y divide-red-200/20 dark:divide-red-950/20">
          
          {/* Delete Workspace */}
          <div className="flex items-center justify-between py-4 first:pt-0">
            <div className="space-y-0.5 pr-4">
              <span className="font-semibold text-foreground block">Delete Workspace Data</span>
              <span className="text-[10px] text-muted-foreground block leading-relaxed max-w-md">
                Deletes all contacts, automations, custom templates, and analytics logs associated with this company profile. Can not be undone.
              </span>
            </div>
            <Button
              onClick={() => openConfirmation("workspace")}
              className="h-8 px-3 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer border-none shrink-0"
            >
              Delete Workspace
            </Button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between py-4 last:pb-0">
            <div className="space-y-0.5 pr-4">
              <span className="font-semibold text-foreground block">Close Owner Account</span>
              <span className="text-[10px] text-muted-foreground block leading-relaxed max-w-md">
                Permanently deletes your administrator profile, login settings, billing integration links, and subscription tiers.
              </span>
            </div>
            <Button
              onClick={() => openConfirmation("account")}
              className="h-8 px-3 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer border-none shrink-0"
            >
              Close Account
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <form onSubmit={handleDeleteSubmit}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4" />
                Confirm Critical Deletion
              </DialogTitle>
              <DialogDescription className="text-[10px] text-muted-foreground leading-relaxed mt-1">
                You are about to delete your {deleteType === "workspace" ? "company workspace database" : "administrator login profile"}. 
                This action is permanent and completely irreversible.
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 space-y-3">
              <p className="text-[11px] font-semibold text-foreground">
                To confirm, type <strong className="text-red-500 font-mono bg-muted px-1.5 py-0.5 rounded border border-border/80">
                  {deleteType === "workspace" ? "DELETE WORKSPACE" : "DELETE ACCOUNT"}
                </strong> in the field below:
              </p>
              <Input 
                type="text" 
                placeholder="Type here..." 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="h-8 text-xs focus-visible:ring-red-500/80" 
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="h-8 text-xs font-semibold rounded-lg cursor-pointer"
              >
                Keep Active
              </Button>
              <Button 
                type="submit" 
                className="h-8 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer border border-transparent"
              >
                Delete Permanently
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
