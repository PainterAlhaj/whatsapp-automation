"use client"

import * as React from "react"
import { 
  GitBranch, 
  Clock, 
  MessageSquare, 
  AlertCircle, 
  UserCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Phone,
  MessageSquareReply,
  Calendar,
  Layers,
  Sparkles,
  Info
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Automation } from "@/types/automation.types"
import { Template } from "@/types/template.types"
import { cn } from "@/lib/utils"

interface WorkflowPreviewPanelProps {
  automation: Automation | null
}

export function WorkflowPreviewPanel({ automation }: WorkflowPreviewPanelProps) {
  if (!automation) {
    return (
      <div className="h-[520px] border border-dashed border-border/85 rounded-xl flex flex-col items-center justify-center text-center p-6 bg-card">
        <div className="p-3 rounded-full bg-muted/50 border border-border/50 text-muted-foreground/80 mb-3">
          <GitBranch className="h-6 w-6" />
        </div>
        <h4 className="text-xs font-bold text-foreground mb-1">No automation selected</h4>
        <p className="text-[11px] text-muted-foreground max-w-[220px]">
          Select an automation rule from the list to display its trigger-action workflow sequence and WhatsApp template preview.
        </p>
      </div>
    )
  }

  const template = typeof automation.template === "object" ? (automation.template as Template) : null
  const isActive = automation.status === "ACTIVE"

  // Extract component blocks from template
  const headerComponent = template?.components?.find((c) => c.type === "HEADER")
  const bodyComponent = template?.components?.find((c) => c.type === "BODY")
  const footerComponent = template?.components?.find((c) => c.type === "FOOTER")
  const buttonsComponent = template?.components?.find((c) => c.type === "BUTTONS")

  const bodyText = bodyComponent?.text || ""
  const headerText = headerComponent?.text || ""
  const footerText = footerComponent?.text || ""
  const rawButtons = buttonsComponent?.buttons || []

  return (
    <div className="border border-border/80 rounded-xl p-5 bg-card flex flex-col justify-between min-h-[520px] shadow-xs relative text-left space-y-4">
      <div className="space-y-4">
        {/* Panel Header */}
        <div className="flex justify-between items-start pb-3 border-b border-border/60">
          <div>
            <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Automation Details & Preview
            </h4>
            <span className="text-[11px] font-semibold text-foreground block truncate max-w-[260px] mt-0.5" title={automation.name}>
              {automation.name}
            </span>
          </div>

          <Badge
            variant={isActive ? "success" : "secondary"}
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5"
          >
            {automation.status}
          </Badge>
        </div>

        {/* Behavior Helper Alert */}
        <div
          className={cn(
            "p-3 rounded-lg border text-xs flex items-start gap-2 leading-relaxed transition-all",
            isActive
              ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300"
              : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/30 text-amber-800 dark:text-amber-300"
          )}
        >
          {isActive ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          )}
          <div>
            <span className="font-bold block text-[11px]">
              {isActive ? "Automation Active" : "Automation Disabled"}
            </span>
            <span className="text-[11px]">
              {isActive
                ? "When enabled, this automation will automatically run whenever a new contact is created."
                : "This automation is currently disabled and will not run automatically."}
            </span>
          </div>
        </div>

        {/* Automation Metadata Grid */}
        <div className="p-3.5 rounded-lg bg-muted/20 border border-border/60 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">Trigger Event</span>
            <span className="font-bold text-foreground flex items-center gap-1 mt-0.5">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Contact Created
            </span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">
              Runs automatically when a new contact is created.
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">Selected Template</span>
            <span className="font-bold text-foreground font-mono text-[11px] truncate block mt-0.5" title={template?.name || "Unknown"}>
              {template?.name || (typeof automation.template === "string" ? automation.template : "N/A")}
            </span>
            {template && (
              <div className="flex items-center gap-1.5 mt-1">
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

          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">Created Date</span>
            <span className="font-medium text-foreground text-[11px] block mt-0.5">
              {automation.createdAt ? new Date(automation.createdAt).toLocaleString() : "N/A"}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase block">Last Updated</span>
            <span className="font-medium text-foreground text-[11px] block mt-0.5">
              {automation.updatedAt ? new Date(automation.updatedAt).toLocaleString() : "N/A"}
            </span>
          </div>
        </div>

        {/* WhatsApp Message Live Preview Box */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            WhatsApp Message Preview
          </span>

          <div className="bg-[#0b141a] rounded-xl p-3.5 border border-zinc-800 shadow-inner min-h-[180px] flex flex-col justify-end">
            <div className="bg-[#202c33] text-zinc-100 text-xs p-3 rounded-lg max-w-[95%] self-start shadow-md relative whitespace-pre-wrap leading-relaxed">
              {/* Header */}
              {headerText && (
                <p className="font-bold text-xs mb-2 text-zinc-100 border-b border-zinc-700/60 pb-1 font-sans">
                  {headerText}
                </p>
              )}

              {/* Body text */}
              <p className="font-sans text-[12px] font-normal leading-relaxed">
                {bodyText || <span className="text-zinc-500 italic">No template body text available</span>}
              </p>

              {/* Footer */}
              {footerText && (
                <p className="text-[10px] text-zinc-400 mt-2 pt-1 border-t border-zinc-700/40 font-sans">
                  {footerText}
                </p>
              )}

              {/* Timestamp & double checkmarks */}
              <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-zinc-400">
                <span>12:00 PM</span>
                <span className="text-emerald-400 font-bold">✓✓</span>
              </div>

              {/* WhatsApp Buttons */}
              {rawButtons.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-zinc-700/80 space-y-1.5">
                  {rawButtons.map((btn: any, idx: number) => {
                    const bType = btn.type || "BUTTON";
                    const bText = btn.text || "Button";

                    return (
                      <div
                        key={idx}
                        className="w-full py-1.5 px-3 bg-[#2a3942] hover:bg-[#34444e] transition-colors text-emerald-400 font-semibold text-[11px] rounded-md flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
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
          </div>
        </div>
      </div>

      {/* Footer Instructions Info */}
      <div className="pt-3 border-t border-border/40 text-[10px] text-muted-foreground flex items-center gap-1.5">
        <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <span>All WhatsApp sending is handled automatically by the backend server when events occur.</span>
      </div>
    </div>
  )
}
