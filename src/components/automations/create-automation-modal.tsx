"use client"

import * as React from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  UserPlus, 
  Send,
  AlertCircle, 
  CheckCircle2, 
  ChevronDown,
  Loader2,
  ExternalLink,
  Phone,
  MessageSquareReply,
  Sparkles,
  MessageSquare
} from "lucide-react"
import { Automation, CreateAutomationPayload, UpdateAutomationPayload } from "@/types/automation.types"
import { Template } from "@/types/template.types"
import { useTemplates } from "@/hooks/use-templates"

interface CreateAutomationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  automationToEdit?: Automation | null
  onSubmitAutomation: (payload: CreateAutomationPayload | { id: string; payload: UpdateAutomationPayload }) => Promise<void>
  isSubmitting?: boolean
}

export function CreateAutomationModal({
  open,
  onOpenChange,
  automationToEdit = null,
  onSubmitAutomation,
  isSubmitting = false,
}: CreateAutomationModalProps) {
  const isEditing = Boolean(automationToEdit)

  // Form State
  const [name, setName] = React.useState("")
  const [trigger, setTrigger] = React.useState<"CONTACT_CREATED">("CONTACT_CREATED")
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("")
  const [status, setStatus] = React.useState<"ACTIVE" | "INACTIVE">("ACTIVE")
  const [error, setError] = React.useState("")

  // Fetch approved templates from backend API
  const { data: templatesData, isLoading: isLoadingTemplates } = useTemplates({ limit: 100 })

  // Filter ONLY APPROVED and non-deleted templates
  const approvedTemplates = React.useMemo(() => {
    if (!templatesData?.templates) return []
    return templatesData.templates.filter(
      (t: Template) => t.status === "APPROVED" && t.isDeletedOnMeta !== true
    )
  }, [templatesData])

  // Populate form values when modal opens or editing item changes
  React.useEffect(() => {
    if (open) {
      setError("")
      if (automationToEdit) {
        setName(automationToEdit.name || "")
        setTrigger(automationToEdit.trigger || "CONTACT_CREATED")
        setStatus(automationToEdit.status || "ACTIVE")

        const existingTplId = typeof automationToEdit.template === "object"
          ? (automationToEdit.template as Template)._id
          : automationToEdit.template
        setSelectedTemplateId(existingTplId || "")
      } else {
        setName("")
        setTrigger("CONTACT_CREATED")
        setStatus("ACTIVE")
        setSelectedTemplateId(approvedTemplates.length > 0 ? approvedTemplates[0]._id : "")
      }
    }
  }, [open, automationToEdit, approvedTemplates])

  // Set default selected template if none selected yet
  React.useEffect(() => {
    if (open && !selectedTemplateId && approvedTemplates.length > 0 && !automationToEdit) {
      setSelectedTemplateId(approvedTemplates[0]._id)
    }
  }, [open, selectedTemplateId, approvedTemplates, automationToEdit])

  // Selected template object for live preview
  const selectedTemplate = React.useMemo(() => {
    return approvedTemplates.find((t) => t._id === selectedTemplateId) || null
  }, [approvedTemplates, selectedTemplateId])

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Please enter a clear automation name.")
      return
    }

    if (!selectedTemplateId) {
      setError("Please select an approved WhatsApp template.")
      return
    }

    try {
      if (isEditing && automationToEdit) {
        await onSubmitAutomation({
          id: automationToEdit._id,
          payload: {
            name: name.trim(),
            trigger: "CONTACT_CREATED",
            template: selectedTemplateId,
            status,
          },
        })
      } else {
        await onSubmitAutomation({
          name: name.trim(),
          trigger: "CONTACT_CREATED",
          template: selectedTemplateId,
          status,
        })
      }
      onOpenChange(false)
    } catch (err: any) {
      setError(err?.message || "Failed to save automation.")
    }
  }

  // Component breakdown for preview
  const headerComponent = selectedTemplate?.components?.find((c) => c.type === "HEADER")
  const bodyComponent = selectedTemplate?.components?.find((c) => c.type === "BODY")
  const footerComponent = selectedTemplate?.components?.find((c) => c.type === "FOOTER")
  const buttonsComponent = selectedTemplate?.components?.find((c) => c.type === "BUTTONS")

  const headerText = headerComponent?.text || ""
  const bodyText = bodyComponent?.text || ""
  const footerText = footerComponent?.text || ""
  const rawButtons = buttonsComponent?.buttons || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-6 gap-6 md:rounded-xl border-border/80">
        <DialogHeader className="text-left pb-3 border-b border-border/60">
          <div className="flex justify-between items-center mr-6">
            <DialogTitle>{isEditing ? "Edit Automation" : "Create Automation"}</DialogTitle>
            <Badge variant={status === "ACTIVE" ? "success" : "secondary"} className="px-2 py-0.5 font-semibold text-[10px]">
              {status}
            </Badge>
          </div>
          <DialogDescription className="text-xs">
            Connect an event trigger to a Meta-approved WhatsApp template.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5 border border-red-200/30 dark:border-red-800/20 text-left">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div className="grid md:grid-cols-12 gap-6 items-start">
            {/* Left Side: Form Inputs */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Field 1: Automation Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  Automation Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Welcome New Contact"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                  required
                />
              </div>

              {/* Field 2: Trigger */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  Trigger Event <span className="text-red-500">*</span>
                </label>
                <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500 text-white shrink-0">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Contact Created</h4>
                    <p className="text-[10px] text-muted-foreground">
                      Automatically runs whenever a new contact is added to the system.
                    </p>
                  </div>
                </div>
              </div>

              {/* Field 3: WhatsApp Template Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  Approved WhatsApp Template <span className="text-red-500">*</span>
                </label>

                {isLoadingTemplates ? (
                  <div className="p-3 rounded-lg border border-border/80 bg-muted/20 text-xs text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    <span>Loading Meta-approved templates...</span>
                  </div>
                ) : approvedTemplates.length === 0 ? (
                  <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 text-xs space-y-1">
                    <span className="font-bold block">No approved templates found</span>
                    <p className="text-[11px]">
                      Only Meta-approved templates can be used in automations. Please sync or create an approved template first.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => setSelectedTemplateId(e.target.value)}
                      className="w-full rounded-lg border border-border/80 bg-background pl-3 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer font-medium font-mono"
                      required
                    >
                      {approvedTemplates.map((tpl) => (
                        <option key={tpl._id} value={tpl._id}>
                          {tpl.name} ({tpl.category} • {tpl.language})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Field 4: Automation Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  Initial Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus("ACTIVE")}
                    className={`p-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      status === "ACTIVE"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "border-border/80 hover:bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    ACTIVE (Enabled)
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus("INACTIVE")}
                    className={`p-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      status === "INACTIVE"
                        ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "border-border/80 hover:bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    INACTIVE (Disabled)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Side: Selected Template Preview */}
            <div className="md:col-span-5 space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                Template Preview
              </span>

              {selectedTemplate ? (
                <div className="bg-[#0b141a] rounded-xl p-3 border border-zinc-800 shadow-sm min-h-[260px] flex flex-col justify-between">
                  <div className="bg-[#202c33] text-zinc-100 text-xs p-3 rounded-lg max-w-[98%] self-start shadow-md relative whitespace-pre-wrap leading-relaxed">
                    {headerText && (
                      <p className="font-bold text-xs mb-2 text-zinc-100 border-b border-zinc-700/60 pb-1 font-sans">
                        {headerText}
                      </p>
                    )}

                    <p className="font-sans text-[11px] font-normal leading-relaxed">
                      {bodyText || <span className="text-zinc-500 italic">No body text</span>}
                    </p>

                    {footerText && (
                      <p className="text-[10px] text-zinc-400 mt-2 pt-1 border-t border-zinc-700/40 font-sans">
                        {footerText}
                      </p>
                    )}

                    <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-zinc-400">
                      <span>12:00 PM</span>
                      <span className="text-emerald-400 font-bold">✓✓</span>
                    </div>

                    {rawButtons.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-zinc-700/80 space-y-1">
                        {rawButtons.map((btn: any, idx: number) => {
                          const bType = btn.type || "BUTTON";
                          const bText = btn.text || "Button";

                          return (
                            <div
                              key={idx}
                              className="w-full py-1 px-2.5 bg-[#2a3942] text-emerald-400 font-semibold text-[10px] rounded flex items-center justify-center gap-1"
                            >
                              {bType === "URL" && <ExternalLink className="h-3 w-3" />}
                              {bType === "PHONE_NUMBER" && <Phone className="h-3 w-3" />}
                              {bType === "QUICK_REPLY" && <MessageSquareReply className="h-3 w-3" />}
                              <span>{bText}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 mt-2 border-t border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
                    <span>Category: <strong className="text-zinc-200 uppercase font-mono">{selectedTemplate.category}</strong></span>
                    <span>Lang: <strong className="text-zinc-200 uppercase font-mono">{selectedTemplate.language}</strong></span>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-dashed border-border/80 bg-muted/10 text-center text-xs text-muted-foreground italic">
                  Select a template to view message preview
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex justify-end gap-2.5 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || approvedTemplates.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEditing ? "Update Automation" : "Create Automation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
