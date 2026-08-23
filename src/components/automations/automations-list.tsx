"use client"

import * as React from "react"
import { 
  Search, 
  ChevronDown, 
  MoreVertical, 
  Play, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  GitBranch,
  Pencil,
  Loader2,
  UserCheck,
  MessageSquare,
  AlertCircle
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import dynamic from "next/dynamic"
import { WorkflowPreviewPanel } from "./workflow-preview-panel"
import { cn } from "@/lib/utils"
import { LoadingState } from "@/components/shared/loading-state"
import { 
  useAutomations, 
  useCreateAutomation, 
  useUpdateAutomation, 
  useDeleteAutomation, 
  useTriggerAutomation 
} from "@/hooks/use-automations"
import { Automation } from "@/types/automation.types"
import { Template } from "@/types/template.types"

const CreateAutomationModal = dynamic(
  () => import("./create-automation-modal").then((mod) => mod.CreateAutomationModal),
  { ssr: false }
)

const AUTOMATIONS_PER_PAGE = 5

export function AutomationsList() {
  // Real Backend React Query Hooks
  const { data: automations = [], isLoading, isError, error, refetch } = useAutomations()
  const createMutation = useCreateAutomation()
  const updateMutation = useUpdateAutomation()
  const deleteMutation = useDeleteAutomation()
  const triggerMutation = useTriggerAutomation()

  // Selected Automation for Preview Panel
  const [selectedAutoId, setSelectedAutoId] = React.useState<string | null>(null)

  // Tracking pending status toggles per automation ID
  const [togglingId, setTogglingId] = React.useState<string | null>(null)

  // Directory Search & Filters
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all")
  const [sortCriteria, setSortCriteria] = React.useState<string>("latest")

  // Modals Visibility & Edit state
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [automationToEdit, setAutomationToEdit] = React.useState<Automation | null>(null)

  // Confirmation Modals State
  const [deleteTarget, setDeleteTarget] = React.useState<Automation | null>(null)
  const [triggerTarget, setTriggerTarget] = React.useState<Automation | null>(null)

  // Pagination state
  const [autoPage, setAutoPage] = React.useState(1)

  // Set default selected automation when data loads
  React.useEffect(() => {
    if (automations.length > 0 && !selectedAutoId) {
      setSelectedAutoId(automations[0]._id)
    } else if (automations.length > 0 && selectedAutoId) {
      const exists = automations.some((a) => a._id === selectedAutoId)
      if (!exists) {
        setSelectedAutoId(automations[0]._id)
      }
    } else if (automations.length === 0) {
      setSelectedAutoId(null)
    }
  }, [automations, selectedAutoId])

  const selectedAuto = React.useMemo(() => {
    return automations.find((a) => a._id === selectedAutoId) || null
  }, [automations, selectedAutoId])

  // Open Create Modal
  const handleOpenCreate = () => {
    setAutomationToEdit(null)
    setIsModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (auto: Automation) => {
    setAutomationToEdit(auto)
    setIsModalOpen(true)
  }

  // Submit Create or Edit payload to backend
  const handleSubmitAutomation = async (payloadData: any) => {
    if (payloadData.id) {
      await updateMutation.mutateAsync({
        id: payloadData.id,
        payload: payloadData.payload,
      })
    } else {
      await createMutation.mutateAsync(payloadData)
    }
  }

  // Toggle ENABLE / DISABLE status with backend call & loading indicator
  const handleToggleStatus = async (e: React.MouseEvent, auto: Automation) => {
    e.stopPropagation()
    if (togglingId === auto._id) return

    const nextStatus = auto.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
    setTogglingId(auto._id)

    try {
      await updateMutation.mutateAsync({
        id: auto._id,
        payload: { status: nextStatus },
      })
    } finally {
      setTogglingId(null)
    }
  }

  // Confirm and execute delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget._id)
      setDeleteTarget(null)
    } catch {
      // Error handled by hook toast
    }
  }

  // Confirm and execute manual trigger
  const handleConfirmTrigger = async () => {
    if (!triggerTarget) return
    try {
      await triggerMutation.mutateAsync(triggerTarget._id)
      setTriggerTarget(null)
    } catch {
      // Error handled by hook toast
    }
  }

  // Filter Directory list
  const filteredAutomations = React.useMemo(() => {
    return automations
      .filter((a) => {
        const matchesQuery = a.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = selectedStatus === "all" || a.status === selectedStatus
        return matchesQuery && matchesStatus
      })
      .sort((a, b) => {
        if (sortCriteria === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }, [automations, searchQuery, selectedStatus, sortCriteria])

  // Paginated Directory lists
  const totalAutoPages = Math.ceil(filteredAutomations.length / AUTOMATIONS_PER_PAGE) || 1
  const paginatedAutomations = React.useMemo(() => {
    const start = (autoPage - 1) * AUTOMATIONS_PER_PAGE
    return filteredAutomations.slice(start, start + AUTOMATIONS_PER_PAGE)
  }, [filteredAutomations, autoPage])

  // Listen for "open-create-automation" event dispatched from header
  React.useEffect(() => {
    const handleOpenWizard = () => handleOpenCreate()
    window.addEventListener("open-create-automation", handleOpenWizard)
    return () => window.removeEventListener("open-create-automation", handleOpenWizard)
  }, [])

  // Auto-reset pagination on filter change
  React.useEffect(() => {
    setAutoPage(1)
  }, [searchQuery, selectedStatus, sortCriteria])

  return (
    <div className="space-y-6">
      {/* Search & Filters Bar */}
      <div className="p-5 border border-border/80 bg-card rounded-xl shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search query */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search automation by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-9 bg-background border border-border/80 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all font-sans"
            />
          </div>

          {/* Filter Status */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-36 pl-3 pr-8 h-9 bg-background border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 appearance-none cursor-pointer font-medium font-sans"
            >
              <option value="all">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Sort Criteria */}
        <div className="relative shrink-0 w-full md:w-40">
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            className="w-full pl-3 pr-8 h-9 bg-background border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 appearance-none cursor-pointer font-medium font-sans"
          >
            <option value="latest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Main Double-Column Layout */}
      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Automations Directory Cards */}
        <div className="md:col-span-7 space-y-4">
          {isLoading ? (
            <LoadingState rows={4} />
          ) : isError ? (
            <Card className="border-red-200 dark:border-red-900/30 bg-red-50/20">
              <CardContent className="py-12 px-4 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                <h4 className="text-xs font-bold text-foreground mb-1">Failed to load automations</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  {(error as any)?.message || "Network error occurred while contacting backend."}
                </p>
                <Button size="sm" onClick={() => refetch()} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs">
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : paginatedAutomations.length === 0 ? (
            /* Requirement 14: Proper Empty State */
            <Card className="border-border/80 shadow-xs">
              <CardContent className="py-16 px-4 flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
                <div className="p-4 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/20 mb-4 text-emerald-600 dark:text-emerald-400">
                  <GitBranch className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">No automations yet</h3>
                <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
                  Create an automation to automatically send WhatsApp messages when events occur.
                </p>
                <Button size="sm" onClick={handleOpenCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer border border-transparent">
                  Create Automation
                </Button>
              </CardContent>
            </Card>
          ) : (
            paginatedAutomations.map((item) => {
              const isSelected = selectedAutoId === item._id
              const template = typeof item.template === "object" ? (item.template as Template) : null
              const isItemActive = item.status === "ACTIVE"
              const isItemToggling = togglingId === item._id

              return (
                <Card 
                  key={item._id}
                  onClick={() => setSelectedAutoId(item._id)}
                  className={cn(
                    "hover:shadow-md transition-all border-border/80 cursor-pointer text-left relative overflow-hidden",
                    isSelected && "ring-1 ring-emerald-500 border-transparent bg-muted/10 dark:bg-accent/10"
                  )}
                >
                  <CardContent className="p-5 flex flex-col justify-between gap-4">
                    {/* Header Row */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-foreground text-xs md:text-sm leading-snug">
                            {item.name}
                          </h4>
                          <Badge
                            variant={isItemActive ? "success" : "secondary"}
                            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0"
                          >
                            {item.status}
                          </Badge>
                        </div>

                        <span className="text-[10px] text-muted-foreground font-mono uppercase font-semibold mt-1 flex items-center gap-1">
                          <UserCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          Trigger: Contact Created
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                        {/* Enable / Disable Switch Toggle */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleToggleStatus(e, item)}
                            disabled={isItemToggling}
                            className={cn(
                              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50",
                              isItemActive ? "bg-emerald-500" : "bg-muted-foreground/30"
                            )}
                            title={isItemActive ? "Click to disable automation" : "Click to enable automation"}
                          >
                            <span
                              className={cn(
                                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out flex items-center justify-center",
                                isItemActive ? "translate-x-4" : "translate-x-0"
                              )}
                            >
                              {isItemToggling && <Loader2 className="h-2.5 w-2.5 animate-spin text-emerald-700" />}
                            </span>
                          </button>
                        </div>

                        {/* Actions Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs" className="h-7 w-7 text-muted-foreground hover:bg-muted dark:hover:bg-accent rounded-md cursor-pointer">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-44" align="end">
                            <DropdownMenuItem onClick={() => setTriggerTarget(item)} className="cursor-pointer">
                              <Play className="mr-2 h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Run Now / Test
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEdit(item)} className="cursor-pointer">
                              <Pencil className="mr-2 h-3.5 w-3.5 text-muted-foreground" /> Edit Automation
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => setDeleteTarget(item)}
                              className="text-red-600 dark:text-red-400 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/20 dark:focus:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Template Breakdown & Metadata */}
                    <div className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2 text-xs font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          Template: <strong className="text-foreground font-mono">{template?.name || (typeof item.template === "string" ? item.template : "N/A")}</strong>
                        </span>

                        {template && (
                          <div className="flex items-center gap-1">
                            <Badge variant="outline" className="text-[9px] font-mono uppercase px-1 py-0">
                              {template.category}
                            </Badge>
                            <Badge variant="outline" className="text-[9px] font-mono uppercase px-1 py-0">
                              {template.language}
                            </Badge>
                            <Badge variant="success" className="text-[9px] font-mono uppercase px-1 py-0">
                              {template.status}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                        <div>
                          <span>Created: </span>
                          <strong className="font-semibold text-foreground">
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                          </strong>
                        </div>
                        <div>
                          <span>Updated: </span>
                          <strong className="font-semibold text-foreground">
                            {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "N/A"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}

          {/* Directory Pagination controls */}
          {filteredAutomations.length > 0 && (
            <div className="flex items-center justify-between gap-4 py-2 text-xs">
              <span className="text-muted-foreground">
                Showing <strong className="font-semibold text-foreground">{(autoPage - 1) * AUTOMATIONS_PER_PAGE + 1}</strong> to{" "}
                <strong className="font-semibold text-foreground">
                  {Math.min(autoPage * AUTOMATIONS_PER_PAGE, filteredAutomations.length)}
                </strong>{" "}
                of <strong className="font-semibold text-foreground">{filteredAutomations.length}</strong> automations
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={autoPage === 1}
                  onClick={() => setAutoPage((prev) => Math.max(prev - 1, 1))}
                  className="h-8 px-2.5 rounded-lg border-border/80 text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-0.5" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={autoPage === totalAutoPages}
                  onClick={() => setAutoPage((prev) => Math.min(prev + 1, totalAutoPages))}
                  className="h-8 px-2.5 rounded-lg border-border/80 text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  Next <ChevronRight className="h-4 w-4 ml-0.5" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visual Workflow & WhatsApp Template Previewer panel */}
        <div className="md:col-span-5">
          <WorkflowPreviewPanel automation={selectedAuto} />
        </div>
      </div>

      {/* Create / Edit Automation Modal */}
      <CreateAutomationModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        automationToEdit={automationToEdit}
        onSubmitAutomation={handleSubmitAutomation}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(deleteTarget)} onOpenChange={(val) => !val && setDeleteTarget(null)}>
        <DialogContent className="max-w-md p-6 md:rounded-xl border-border/80 text-left">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Delete Automation
            </DialogTitle>
            <DialogDescription className="text-xs pt-2">
              Are you sure you want to delete this automation? This action cannot be undone and automatic message triggers for this rule will stop immediately.
            </DialogDescription>
          </DialogHeader>

          {deleteTarget && (
            <div className="p-3 rounded-lg bg-muted/20 border border-border/60 text-xs space-y-1 my-2 font-sans">
              <span className="text-[10px] font-bold text-muted-foreground uppercase block">Automation Name</span>
              <strong className="text-foreground text-sm block">{deleteTarget.name}</strong>
            </div>
          )}

          <DialogFooter className="gap-2 pt-3 border-t border-border/60">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteMutation.isPending}
              className="rounded-lg text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              {deleteMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Trigger Confirmation Dialog */}
      <Dialog open={Boolean(triggerTarget)} onOpenChange={(val) => !val && setTriggerTarget(null)}>
        <DialogContent className="max-w-md p-6 md:rounded-xl border-border/80 text-left">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Play className="h-5 w-5" /> Execute Manual Automation Test
            </DialogTitle>
            <DialogDescription className="text-xs pt-2">
              This will trigger a manual execution of this automation via your connected WhatsApp Cloud API credentials and send the approved template message.
            </DialogDescription>
          </DialogHeader>

          {triggerTarget && (
            <div className="p-3 rounded-lg bg-muted/20 border border-border/60 text-xs space-y-1.5 my-2 font-sans">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Automation Name</span>
                <strong className="text-foreground text-sm block">{triggerTarget.name}</strong>
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Trigger Type</span>
                <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">MANUAL RUN (Test)</span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 pt-3 border-t border-border/60">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTriggerTarget(null)}
              disabled={triggerMutation.isPending}
              className="rounded-lg text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmTrigger}
              disabled={triggerMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              {triggerMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Run Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
