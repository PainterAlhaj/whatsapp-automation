"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
  ChevronDown, 
  AlertCircle, 
  Sparkles, 
  MessageSquare, 
  Loader2, 
  Users,
  ExternalLink,
  Phone,
  MessageSquareReply,
  ArrowRight,
  Search,
  ShieldCheck,
  Globe,
  Tag,
  CheckCircle2
} from "lucide-react";
import { useTemplates } from "@/hooks/use-templates";
import { useContacts } from "@/hooks/use-contacts";
import { useCreateCampaign, useSendCampaign } from "@/hooks/use-campaigns";
import { Template } from "@/types/template.types";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCampaignModal({ open, onOpenChange }: CreateCampaignModalProps) {
  const router = useRouter();

  // Fetch only APPROVED templates from backend API
  const { data: templatesRes, isLoading: isLoadingTemplates, isError: isTemplatesError } = useTemplates({ 
    status: "APPROVED",
    limit: 100 
  });
  const { data: contactsRes, isLoading: isLoadingContacts } = useContacts({ limit: 100 });

  const rawTemplatesList = templatesRes?.templates || [];
  const contactsList = contactsRes?.contacts || [];

  // Filter strictly for APPROVED templates
  const approvedTemplates = React.useMemo(() => {
    return rawTemplatesList.filter((t) => t.status === "APPROVED");
  }, [rawTemplatesList]);

  // Form State
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("");
  const [selectedContactIds, setSelectedContactIds] = React.useState<string[]>([]);
  const [paramValues, setParamValues] = React.useState<Record<number, string>>({});
  const [scheduleDateTime, setScheduleDateTime] = React.useState("");
  const [isScheduled, setIsScheduled] = React.useState(false);
  const [error, setError] = React.useState("");

  // Template Search Filter inside dropdown
  const [templateSearchTerm, setTemplateSearchTerm] = React.useState("");

  // Mutations
  const createCampaignMutation = useCreateCampaign();
  const sendCampaignMutation = useSendCampaign();

  // Auto-select first APPROVED template when data loads
  React.useEffect(() => {
    if (approvedTemplates.length > 0) {
      if (!selectedTemplateId || !approvedTemplates.some((t) => t._id === selectedTemplateId)) {
        setSelectedTemplateId(approvedTemplates[0]._id);
      }
    } else {
      setSelectedTemplateId("");
    }
  }, [approvedTemplates, selectedTemplateId]);

  // Auto-select all contacts by default
  React.useEffect(() => {
    if (contactsList.length > 0 && selectedContactIds.length === 0) {
      setSelectedContactIds(contactsList.map((c) => c._id));
    }
  }, [contactsList, selectedContactIds]);

  const selectedTemplate: Template | undefined = React.useMemo(() => {
    return approvedTemplates.find((t) => t._id === selectedTemplateId);
  }, [approvedTemplates, selectedTemplateId]);

  // Filter templates list by template search query
  const filteredApprovedTemplates = React.useMemo(() => {
    if (!templateSearchTerm.trim()) return approvedTemplates;
    const term = templateSearchTerm.toLowerCase();
    return approvedTemplates.filter(
      (t) =>
        t.name.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term) ||
        t.language.toLowerCase().includes(term)
    );
  }, [approvedTemplates, templateSearchTerm]);

  // Extract component blocks dynamically from selectedTemplate.components
  const headerComponent = selectedTemplate?.components?.find((c) => c.type === "HEADER");
  const bodyComponent = selectedTemplate?.components?.find((c) => c.type === "BODY");
  const footerComponent = selectedTemplate?.components?.find((c) => c.type === "FOOTER");
  const buttonsComponent = selectedTemplate?.components?.find((c) => c.type === "BUTTONS");

  const headerText = headerComponent?.text || "";
  const bodyText = bodyComponent?.text || "";
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

  // Extract variables present in body text (e.g. {{1}}, {{2}})
  const activeVariableIds = React.useMemo(() => {
    if (!bodyText) return [];
    const regex = /\{\{(\d+)\}\}/g;
    let match;
    const ids = new Set<number>();
    while ((match = regex.exec(bodyText)) !== null) {
      ids.add(parseInt(match[1]));
    }
    return Array.from(ids).sort((a, b) => a - b);
  }, [bodyText]);

  // Sync parameter input states when template changes
  React.useEffect(() => {
    const initial: Record<number, string> = {};
    activeVariableIds.forEach((id, idx) => {
      initial[id] = metaExampleBody[idx] || "";
    });
    setParamValues(initial);
  }, [selectedTemplateId, activeVariableIds, metaExampleBody]);

  const handleParamChange = (id: number, val: string) => {
    setParamValues((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  // Component-Based Live WhatsApp Preview Generator
  const getInterpolatedBodyForPreview = () => {
    if (!bodyText) return "";
    let text = bodyText;
    activeVariableIds.forEach((id, idx) => {
      const placeholder = `{{${id}}}`;
      const enteredVal = paramValues[id]?.trim();
      const metaExampleVal = metaExampleBody[idx];
      const displayVal = enteredVal ? enteredVal : metaExampleVal ? metaExampleVal : `{{${id}}}`;
      text = text.replace(new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"), displayVal);
    });
    return text;
  };

  const handleGoToTemplates = () => {
    onOpenChange(false);
    router.push("/templates");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter a campaign name.");
      return;
    }

    if (!selectedTemplateId) {
      setError("Please select an approved message template.");
      return;
    }

    const contactsToTarget = selectedContactIds.length > 0 
      ? selectedContactIds 
      : contactsList.map((c) => c._id);

    if (contactsToTarget.length === 0) {
      setError("At least one target contact is required. Please add contacts first.");
      return;
    }

    if (isScheduled && !scheduleDateTime) {
      setError("Please pick a schedule date & time.");
      return;
    }

    try {
      const scheduledAtIso = isScheduled && scheduleDateTime 
        ? new Date(scheduleDateTime).toISOString() 
        : null;

      const created = await createCampaignMutation.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
        template: selectedTemplateId,
        contacts: contactsToTarget,
        scheduledAt: scheduledAtIso,
      });

      // If Send Now requested, dispatch campaign immediately
      if (!isScheduled && created && created._id) {
        try {
          await sendCampaignMutation.mutateAsync(created._id);
          toast.success(`Campaign "${created.name}" created & broadcast sent!`, "Dispatched");
        } catch {
          toast.success(`Campaign "${created.name}" created as draft.`, "Created");
        }
      } else {
        toast.success(`Campaign "${created.name}" scheduled successfully.`, "Scheduled");
      }

      onOpenChange(false);

      // Reset Form
      setName("");
      setDescription("");
      setScheduleDateTime("");
      setIsScheduled(false);
      setError("");
      setParamValues({});
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create campaign.";
      setError(msg);
    }
  };

  const isSubmitting = createCampaignMutation.isPending || sendCampaignMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-6 md:p-8 gap-6 md:rounded-2xl border-border/80">
        <DialogHeader className="text-left pb-2 border-b border-border/60">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Create Broadcast Campaign
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Target contact audiences with Meta-approved WhatsApp Cloud API templates.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 border border-red-200/40 dark:border-red-800/30 text-left animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Check for Empty Approved Templates State */}
        {!isLoadingTemplates && approvedTemplates.length === 0 ? (
          <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20 border border-border/80 rounded-2xl">
            <div className="p-4 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <MessageSquare className="h-8 w-8" />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="text-base font-bold text-foreground">No Approved Templates Available</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Create a template and wait until Meta approves it (<span className="text-emerald-600 dark:text-emerald-400 font-semibold">APPROVED</span>) before creating a broadcast campaign.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleGoToTemplates}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold px-5 py-2.5 cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <span>Go to Templates</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Side: Campaign Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5 text-left">
              
              {/* Campaign Basic Info */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-[10px] font-extrabold">1</span>
                  Campaign Details
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Campaign Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Summer Promo Broadcast"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Description (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Promotional offer sent to active leads"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Template Selection */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-[10px] font-extrabold">2</span>
                  Approved Message Template <span className="text-red-500">*</span>
                </h4>

                <div className="space-y-3">
                  {/* Template Search Filter Input */}
                  {approvedTemplates.length > 5 && (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search approved templates..."
                        value={templateSearchTerm}
                        onChange={(e) => setTemplateSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-background border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  )}

                  {/* Dropdown Select */}
                  <div className="relative">
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => setSelectedTemplateId(e.target.value)}
                      disabled={isLoadingTemplates || approvedTemplates.length === 0}
                      className="w-full rounded-lg border border-border/80 bg-background pl-3 pr-8 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer font-medium"
                    >
                      {isLoadingTemplates ? (
                        <option value="">Loading approved templates...</option>
                      ) : filteredApprovedTemplates.length === 0 ? (
                        <option value="">No matching approved templates</option>
                      ) : (
                        filteredApprovedTemplates.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name} ({t.category} - {t.language})
                          </option>
                        ))
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>

                  {/* Selected Template Info Card */}
                  {selectedTemplate && (
                    <div className="p-3 rounded-lg bg-background border border-border/70 text-xs space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground font-mono">{selectedTemplate.name}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 uppercase tracking-wider">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> {selectedTemplate.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase block">Category</span>
                          <span className="font-semibold text-foreground uppercase">{selectedTemplate.category}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase block">Language</span>
                          <span className="font-semibold text-foreground uppercase">{selectedTemplate.language}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase block">Quality Score</span>
                          <span className="font-semibold text-foreground font-mono">{selectedTemplate.qualityScore || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Variables / Parameters Inputs */}
              {activeVariableIds.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Dynamic Parameters
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Customize parameter replacement values for your message preview.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    {activeVariableIds.map((id) => (
                      <div key={id} className="space-y-1">
                        <label className="text-[11px] font-bold text-foreground block">
                          Parameter {"{{"}{id}{"}}"}
                        </label>
                        <input
                          type="text"
                          placeholder={`Value for {{${id}}}`}
                          value={paramValues[id] || ""}
                          onChange={(e) => handleParamChange(id, e.target.value)}
                          className="w-full rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Contacts Summary */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Users className="h-4 w-4" /> Audience Contacts
                  </h4>
                  <span className="text-xs font-bold text-foreground font-mono">
                    {isLoadingContacts ? "Loading..." : `${contactsList.length} Contacts`}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Broadcast will be sent to all active contacts in your audience database.
                </p>
              </div>

              {/* Schedule Options */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-foreground block">Schedule Broadcast</label>
                    <span className="text-[10px] text-muted-foreground">Specify a future date & time for automated dispatch</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="h-4 w-4 rounded border-border bg-background text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                {isScheduled && (
                  <input
                    type="datetime-local"
                    value={scheduleDateTime}
                    onChange={(e) => setScheduleDateTime(e.target.value)}
                    className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                )}
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="rounded-lg text-xs font-semibold cursor-pointer border-border/80"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !selectedTemplateId}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {isScheduled ? "Schedule Campaign" : "Send Campaign Now"}
                </Button>
              </div>
            </form>

            {/* Right Side: Component-Based WhatsApp Preview */}
            <div className="lg:col-span-5 sticky top-4 bg-zinc-900 text-white border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl overflow-hidden min-h-[420px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    WhatsApp Live Preview
                  </span>
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px]">
                    {selectedTemplate?.language || "en_US"}
                  </Badge>
                </div>

                {/* WhatsApp Header bar */}
                <div className="bg-emerald-800 text-white p-2.5 rounded-xl flex items-center gap-3 shadow-md">
                  <div className="h-8 w-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-600">
                    WA
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-none">WhatsApp Business</h4>
                    <span className="text-[10px] text-emerald-200/80 font-medium">Broadcast Message Preview</span>
                  </div>
                </div>

                {/* Component-Based Chat Bubble */}
                <div className="bg-[#0b141a] rounded-xl p-3.5 min-h-[240px] flex flex-col justify-end border border-zinc-800/80">
                  {selectedTemplate ? (
                    <div className="bg-[#202c33] text-zinc-100 text-xs p-3 rounded-lg max-w-[92%] self-start shadow-md relative whitespace-pre-wrap leading-relaxed text-left">
                      {/* HEADER component */}
                      {headerText && (
                        <p className="font-bold text-xs mb-2 text-zinc-100 border-b border-zinc-700/60 pb-1 font-sans">
                          {headerText}
                        </p>
                      )}

                      {/* BODY component dynamically rendered with parameter replacements */}
                      <p className="font-sans text-[12px] font-normal leading-relaxed">
                        {getInterpolatedBodyForPreview() || (
                          <span className="text-zinc-500 italic">No template body text content available.</span>
                        )}
                      </p>

                      {/* FOOTER component */}
                      {footerText && (
                        <p className="text-[10px] text-zinc-400 mt-2 pt-1 border-t border-zinc-700/40 font-sans">
                          {footerText}
                        </p>
                      )}

                      {/* Timestamp & double ticks */}
                      <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-zinc-400">
                        <span>12:00 PM</span>
                        <span className="text-emerald-400 font-bold">✓✓</span>
                      </div>

                      {/* BUTTONS component dynamically rendered */}
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
                  ) : (
                    <div className="py-12 text-center text-zinc-500 text-xs italic">
                      Select an approved template to view live preview...
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
                <span>Renders from <strong className="text-emerald-400 font-mono">template.components</strong></span>
                <span>Category: <strong className="text-zinc-200 uppercase font-mono">{selectedTemplate?.category || "N/A"}</strong></span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
