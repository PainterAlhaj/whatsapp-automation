"use client";

import * as React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  ExternalLink,
  Phone,
  MessageSquareReply,
  Code2,
  Info,
  Calendar,
  Clock,
  Globe,
  Tag,
  Layers,
  Copy,
  Check
} from "lucide-react";
import { Template } from "@/types/template.types";
import { cn } from "@/lib/utils";

interface TemplatePreviewModalProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplatePreviewModal({ template, open, onOpenChange }: TemplatePreviewModalProps) {
  const [testValues, setTestValues] = React.useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = React.useState<"overview" | "developer">("overview");
  const [copiedJson, setCopiedJson] = React.useState(false);

  // Extract component blocks from backend structure
  const headerComponent = template?.components?.find((c) => c.type === "HEADER");
  const bodyComponent = template?.components?.find((c) => c.type === "BODY");
  const footerComponent = template?.components?.find((c) => c.type === "FOOTER");
  const buttonsComponent = template?.components?.find((c) => c.type === "BUTTONS");

  const bodyText = bodyComponent?.text || "";
  const headerText = headerComponent?.text || "";
  const footerText = footerComponent?.text || "";
  const rawButtons = buttonsComponent?.buttons || [];

  // Parse example body text array from component if available
  const metaExampleBody: string[] = React.useMemo(() => {
    if (!bodyComponent?.example) return [];
    const ex = bodyComponent.example as any;
    if (Array.isArray(ex.body_text) && Array.isArray(ex.body_text[0])) {
      return ex.body_text[0];
    }
    return [];
  }, [bodyComponent]);

  // Extract variables present in body text
  const variableIds = React.useMemo(() => {
    if (!bodyText) return [];
    const regex = /\{\{(\d+)\}\}/g;
    let match;
    const ids = new Set<number>();
    while ((match = regex.exec(bodyText)) !== null) {
      ids.add(parseInt(match[1]));
    }
    return Array.from(ids).sort((a, b) => a - b);
  }, [bodyText]);

  // Initialize test values with Meta examples or default fallback
  React.useEffect(() => {
    if (template) {
      const initial: Record<number, string> = {};
      variableIds.forEach((id, idx) => {
        const exampleFromMeta = metaExampleBody[idx];
        initial[id] = exampleFromMeta || `Sample ${id}`;
      });
      setTestValues(initial);
      setActiveTab("overview");
    }
  }, [template, variableIds, metaExampleBody]);

  if (!template) return null;

  const handleTestValueChange = (idx: number, val: string) => {
    setTestValues((prev) => ({
      ...prev,
      [idx]: val,
    }));
  };

  // Generates live preview text replacing variable tags with user inputs / examples
  const getDynamicPreviewText = () => {
    let text = bodyText;
    variableIds.forEach((id) => {
      const placeholder = `{{${id}}}`;
      const val = testValues[id]?.trim() || `{{${id}}}`;
      text = text.replace(new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"), val);
    });
    return text;
  };

  const renderStatusBadge = (status: Template["status"]) => {
    let colorClasses = "";
    switch (status) {
      case "APPROVED":
        colorClasses = "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800";
        break;
      case "PENDING":
      case "IN_APPEAL":
        colorClasses = "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800";
        break;
      case "REJECTED":
        colorClasses = "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800";
        break;
      case "PAUSED":
        colorClasses = "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800";
        break;
      case "DISABLED":
        colorClasses = "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
        break;
      default:
        colorClasses = "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
        break;
    }

    return (
      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider", colorClasses)}>
        {status}
      </span>
    );
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(template.components || [], null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-6 md:p-8 gap-6 md:rounded-2xl border-border/80">
        <DialogHeader className="text-left pb-3 border-b border-border/60 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <DialogTitle className="text-lg md:text-xl font-bold text-foreground font-mono truncate max-w-[360px]" title={template.name}>
                {template.name}
              </DialogTitle>
              {renderStatusBadge(template.status)}
            </div>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              WhatsApp Business Platform template details and live sandbox preview.
            </DialogDescription>
          </div>

          {/* View Tab Switcher */}
          <div className="flex items-center border border-border/80 rounded-lg p-0.5 bg-muted/40 shrink-0">
            <Button
              variant={activeTab === "overview" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("overview")}
              className="h-7 px-3 text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" /> Overview
            </Button>
            <Button
              variant={activeTab === "developer" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("developer")}
              className="h-7 px-3 text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5"
            >
              <Code2 className="h-3.5 w-3.5" /> Developer View
            </Button>
          </div>
        </DialogHeader>

        {activeTab === "overview" ? (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Side: Metadata Sections & Buttons */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* SECTION 1: Basic Information */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Info className="h-4 w-4" /> Basic Information
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Template Name</span>
                    <span className="font-semibold text-foreground font-mono text-[11px] truncate block" title={template.name}>
                      {template.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Meta Template ID</span>
                    <span className="font-semibold text-foreground font-mono text-[11px] truncate block" title={template.metaTemplateId || "N/A"}>
                      {template.metaTemplateId || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Category</span>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase font-bold mt-0.5">
                      {template.category}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Language</span>
                    <span className="font-semibold text-foreground uppercase">{template.language}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Quality Score</span>
                    <span className="font-semibold text-foreground font-mono">{template.qualityScore || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Status</span>
                    <div className="mt-0.5">{renderStatusBadge(template.status)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Created At</span>
                    <span className="font-semibold text-foreground font-sans">
                      {template.createdAt ? new Date(template.createdAt).toLocaleString() : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Updated At</span>
                    <span className="font-semibold text-foreground font-sans">
                      {template.updatedAt ? new Date(template.updatedAt).toLocaleString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Sync Information */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Sync Information
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Synced At</span>
                    <span className="font-semibold text-foreground font-sans">
                      {template.syncedAt ? new Date(template.syncedAt).toLocaleString() : "Not synced"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Deleted On Meta</span>
                    <Badge variant={template.isDeletedOnMeta ? "destructive" : "outline"} className="text-[10px] font-mono mt-0.5">
                      {template.isDeletedOnMeta ? "YES" : "NO"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">Rejection Reason</span>
                    <span className="font-semibold text-red-600 dark:text-red-400 text-[11px] block truncate" title={template.rejectionReason || "None"}>
                      {template.rejectionReason || "None"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Variable Tester (if variables exist) */}
              {variableIds.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> Live Variable Tester
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Type test values to render live variable replacements in the preview.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    {variableIds.map((id) => (
                      <div key={id} className="space-y-1">
                        <label className="text-[11px] font-bold text-foreground block">
                          {"{{"}{id}{"}}"} Value
                        </label>
                        <input
                          type="text"
                          value={testValues[id] || ""}
                          onChange={(e) => handleTestValueChange(id, e.target.value)}
                          className="w-full rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 4: Buttons Breakdown */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Layers className="h-4 w-4" /> Configured Buttons ({rawButtons.length})
                </h4>

                {rawButtons.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No buttons configured for this template.</p>
                ) : (
                  <div className="space-y-2">
                    {rawButtons.map((btn: any, idx: number) => {
                      const btnType = btn.type || "BUTTON";
                      const btnText = btn.text || "";
                      const btnVal = btn.url || btn.phone_number || btn.value || "";

                      return (
                        <div key={idx} className="p-2.5 rounded-lg bg-background border border-border/70 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <Badge variant="outline" className="font-mono text-[10px] uppercase font-bold">
                              {btnType}
                            </Badge>
                            <span className="font-semibold text-foreground">{btnText}</span>
                          </div>
                          {btnVal && (
                            <span className="font-mono text-[11px] text-muted-foreground truncate max-w-[200px]" title={btnVal}>
                              {btnVal}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: SECTION 3: WhatsApp Preview */}
            <div className="lg:col-span-5 sticky top-4 bg-zinc-900 text-white border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl overflow-hidden min-h-[420px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    SECTION 3: WhatsApp Preview
                  </span>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px]">
                    {template.language}
                  </Badge>
                </div>

                {/* WhatsApp Header bar */}
                <div className="bg-emerald-800 text-white p-2.5 rounded-xl flex items-center gap-3 shadow-md">
                  <div className="h-8 w-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-600">
                    WA
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-none">WhatsApp Business</h4>
                    <span className="text-[10px] text-emerald-200/80 font-medium">Message Preview</span>
                  </div>
                </div>

                {/* Message Bubble Container */}
                <div className="bg-[#0b141a] rounded-xl p-3.5 min-h-[220px] flex flex-col justify-end border border-zinc-800/80">
                  <div className="bg-[#202c33] text-zinc-100 text-xs p-3 rounded-lg max-w-[92%] self-start shadow-md relative whitespace-pre-wrap leading-relaxed">
                    {/* Header */}
                    {headerText && (
                      <p className="font-bold text-xs mb-2 text-zinc-100 border-b border-zinc-700/60 pb-1 font-sans">
                        {headerText}
                      </p>
                    )}

                    {/* Body with live interpolated text */}
                    <p className="font-sans text-[12px] font-normal leading-relaxed">
                      {getDynamicPreviewText() || <span className="text-zinc-500 italic">No body text</span>}
                    </p>

                    {/* Footer */}
                    {footerText && (
                      <p className="text-[10px] text-zinc-400 mt-2 pt-1 border-t border-zinc-700/40 font-sans">
                        {footerText}
                      </p>
                    )}

                    {/* Timestamp & ticks */}
                    <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-zinc-400">
                      <span>12:00 PM</span>
                      <span className="text-emerald-400 font-bold">✓✓</span>
                    </div>

                    {/* Rendered WhatsApp Buttons */}
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

              <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
                <span>Category: <strong className="text-zinc-200 uppercase font-mono">{template.category}</strong></span>
                <span>Meta ID: <strong className="text-zinc-200 font-mono">{template.metaTemplateId || "N/A"}</strong></span>
              </div>
            </div>
          </div>
        ) : (
          /* SECTION 5: Developer View */
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/60">
              <div>
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  SECTION 5: Developer View - Meta Component Tree
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Read-only formatted JSON representation of <code className="text-foreground font-mono">template.components</code> returned by backend.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyJson}
                className="h-8 px-3 text-xs font-semibold border-border/80 rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                {copiedJson ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" /> Copy JSON
                  </>
                )}
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 text-zinc-100 border border-zinc-800 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed shadow-inner">
              <pre>{JSON.stringify(template.components || [], null, 2)}</pre>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
