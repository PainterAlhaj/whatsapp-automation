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
  ChevronDown,
  AlertCircle,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Phone,
  MessageSquareReply,
  Loader2,
  Info,
  CheckCircle2
} from "lucide-react";
import { useCreateTemplate } from "@/hooks/use-templates";
import { toast } from "@/components/ui/toast";
import { CreateTemplatePayload, TemplateButtonPayload } from "@/types/template.types";

export const TEMPLATE_CATEGORIES = [
  { id: "MARKETING", label: "Marketing" },
  { id: "UTILITY", label: "Utility" },
  { id: "AUTHENTICATION", label: "Authentication" },
];

export const TEMPLATE_LANGUAGES = [
  { id: "en_US", label: "English (US) - en_US" },
  { id: "en_GB", label: "English (UK) - en_GB" },
  { id: "es_ES", label: "Spanish (ES) - es_ES" },
  { id: "hi", label: "Hindi (HI) - hi" },
  { id: "pt_BR", label: "Portuguese (BR) - pt_BR" },
  { id: "fr_FR", label: "French (FR) - fr_FR" },
  { id: "de_DE", label: "German (DE) - de_DE" },
  { id: "id_ID", label: "Indonesian (ID) - id_ID" },
  { id: "ar", label: "Arabic - ar" },
];

export interface LocalButton {
  id: string;
  type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER";
  text: string;
  value: string;
}

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTemplate?: () => void;
}

export function CreateTemplateModal({ open, onOpenChange, onAddTemplate }: CreateTemplateModalProps) {
  // Section 1: Basic Information
  const [name, setName] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<"MARKETING" | "UTILITY" | "AUTHENTICATION">("UTILITY");
  const [language, setLanguage] = React.useState("en_US");

  // Section 2: Header
  const [headerType, setHeaderType] = React.useState<"NONE" | "TEXT">("NONE");
  const [headerText, setHeaderText] = React.useState("");

  // Section 3: Body
  const [body, setBody] = React.useState("");

  // Section 4: Footer
  const [footerText, setFooterText] = React.useState("");

  // Section 5: Buttons
  const [buttons, setButtons] = React.useState<LocalButton[]>([]);

  // Section 6: Variable Examples
  const [exampleValues, setExampleValues] = React.useState<Record<number, string>>({});

  // Feedback State
  const [submitError, setSubmitError] = React.useState("");

  const createTemplateMutation = useCreateTemplate();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Automatically detect {{1}}, {{2}}, etc. in body
  const activeVariableIds = React.useMemo(() => {
    const regex = /\{\{(\d+)\}\}/g;
    let match;
    const ids = new Set<number>();
    while ((match = regex.exec(body)) !== null) {
      ids.add(parseInt(match[1]));
    }
    return Array.from(ids).sort((a, b) => a - b);
  }, [body]);

  // Sync variable example fields when body variables change
  React.useEffect(() => {
    setExampleValues((prev) => {
      const updated: Record<number, string> = {};
      activeVariableIds.forEach((id) => {
        updated[id] = prev[id] !== undefined ? prev[id] : "";
      });
      return updated;
    });
  }, [activeVariableIds]);

  // Insert variable helper at cursor position
  const handleInsertVariable = () => {
    const nextVarIndex = activeVariableIds.length > 0
      ? Math.max(...activeVariableIds) + 1
      : 1;
    const tag = `{{${nextVarIndex}}}`;

    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);

      const newBody = before + tag + after;
      setBody(newBody);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + tag.length, start + tag.length);
      }, 50);
    } else {
      setBody((prev) => prev + tag);
    }
  };

  // Button management handlers
  const handleAddButton = (type: "QUICK_REPLY" | "URL" | "PHONE_NUMBER") => {
    const newBtn: LocalButton = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      text: "",
      value: "",
    };
    setButtons((prev) => [...prev, newBtn]);
  };

  const handleRemoveButton = (id: string) => {
    setButtons((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpdateButton = (id: string, field: "text" | "value" | "type", val: string) => {
    setButtons((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        if (field === "type") {
          return {
            ...b,
            type: val as LocalButton["type"],
            value: "",
          };
        }
        return { ...b, [field]: val };
      })
    );
  };

  // Format validation helpers
  const isNameValid = React.useMemo(() => {
    const trimmed = name.trim().toLowerCase();
    return trimmed.length > 0 && /^[a-z0-9_]+$/.test(trimmed);
  }, [name]);

  const isBodyValid = React.useMemo(() => {
    return body.trim().length > 0;
  }, [body]);

  const isExamplesValid = React.useMemo(() => {
    if (activeVariableIds.length === 0) return true;
    return activeVariableIds.every((id) => Boolean(exampleValues[id]?.trim()));
  }, [activeVariableIds, exampleValues]);

  const urlRegex = /^(https?:\/\/)?([\w.-]+)+[\w\-_~:/?#[\]@!$&'()*+,;=.]+$/i;
  const phoneRegex = /^\+?[1-9]\d{6,14}$/;

  const isButtonsValid = React.useMemo(() => {
    if (buttons.length === 0) return true;
    return buttons.every((btn) => {
      if (!btn.text.trim()) return false;
      if (btn.type === "URL") {
        return btn.value.trim().length > 0 && urlRegex.test(btn.value.trim());
      }
      if (btn.type === "PHONE_NUMBER") {
        return btn.value.trim().length > 0 && phoneRegex.test(btn.value.trim());
      }
      return true;
    });
  }, [buttons]);

  const isFormValid = React.useMemo(() => {
    return isNameValid && isBodyValid && isExamplesValid && isButtonsValid;
  }, [isNameValid, isBodyValid, isExamplesValid, isButtonsValid]);

  // Live variable replacement for preview
  const getInterpolatedBodyForPreview = () => {
    if (!body) return "";
    let text = body;
    activeVariableIds.forEach((id) => {
      const placeholder = `{{${id}}}`;
      const val = exampleValues[id]?.trim();
      const displayVal = val ? val : `{{${id}}}`;
      text = text.replace(new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"), displayVal);
    });
    return text;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const trimmedName = name.trim().toLowerCase();

    if (!trimmedName) {
      setSubmitError("Please enter a template name.");
      return;
    }
    if (!/^[a-z0-9_]+$/.test(trimmedName)) {
      setSubmitError("Template name can only contain lowercase letters, numbers, and underscores.");
      return;
    }
    if (!body.trim()) {
      setSubmitError("Please enter the message body.");
      return;
    }
    if (!isExamplesValid) {
      setSubmitError("Please provide example values for all body variables (e.g. {{1}}, {{2}}).");
      return;
    }
    if (!isButtonsValid) {
      setSubmitError("Please ensure all added buttons have valid text, URLs, or phone numbers.");
      return;
    }

    // Build backend payload
    const formattedButtons: TemplateButtonPayload[] = buttons.map((b) => {
      if (b.type === "URL") {
        return {
          type: "URL",
          text: b.text.trim(),
          value: b.value.trim(),
        };
      }
      if (b.type === "PHONE_NUMBER") {
        return {
          type: "PHONE_NUMBER",
          text: b.text.trim(),
          value: b.value.trim(),
        };
      }
      return {
        type: "QUICK_REPLY",
        text: b.text.trim(),
      };
    });

    const payload: CreateTemplatePayload = {
      name: trimmedName,
      category: selectedCategory,
      language,
      body: body.trim(),
      header: headerType === "TEXT" && headerText.trim() ? headerText.trim() : undefined,
      footer: footerText.trim() || undefined,
      buttons: formattedButtons,
    };

    if (activeVariableIds.length > 0) {
      const bodyExamplesList = activeVariableIds.map((id) => exampleValues[id]?.trim() || `Example ${id}`);
      payload.examples = {
        body: bodyExamplesList,
      };
    }

    try {
      await createTemplateMutation.mutateAsync(payload);
      toast.success(`Template "${trimmedName}" created & submitted to Meta!`, "Template Created");
      if (onAddTemplate) onAddTemplate();
      onOpenChange(false);

      // Reset form state
      setName("");
      setSelectedCategory("UTILITY");
      setLanguage("en_US");
      setHeaderType("NONE");
      setHeaderText("");
      setBody("");
      setFooterText("");
      setButtons([]);
      setExampleValues({});
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create template.";
      setSubmitError(msg);
      toast.error(msg, "Creation Error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-6 md:p-8 gap-6 md:rounded-2xl border-border/80">
        <DialogHeader className="text-left pb-2 border-b border-border/60">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Create WhatsApp Business Template
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Design and register official WhatsApp templates directly with Meta Cloud API.
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 border border-red-200/40 dark:border-red-800/30 text-left animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Multi-Section Form */}
          <form onSubmit={handleFormSubmit} className="lg:col-span-7 space-y-6 text-left">

            {/* SECTION 1: Basic Information */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-[10px] font-extrabold">1</span>
                  Basic Information
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. order_status_update"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Lowercase letters, numbers, and underscores only. (e.g. <code className="text-foreground">shipping_notification_v1</code>)
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as any)}
                        className="w-full rounded-lg border border-border/80 bg-background pl-3 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer font-sans font-medium"
                      >
                        {TEMPLATE_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-1">
                      Language <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full rounded-lg border border-border/80 bg-background pl-3 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer font-sans font-medium"
                      >
                        {TEMPLATE_LANGUAGES.map((l) => (
                          <option key={l.id} value={l.id}>{l.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Header */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-[10px] font-extrabold">2</span>
                Header (Optional)
              </h3>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Header Type</label>
                  <div className="relative">
                    <select
                      value={headerType}
                      onChange={(e) => setHeaderType(e.target.value as "NONE" | "TEXT")}
                      className="w-full rounded-lg border border-border/80 bg-background pl-3 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer font-medium"
                    >
                      <option value="NONE">None</option>
                      <option value="TEXT">Text</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {headerType === "TEXT" && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">Header Text</label>
                    <input
                      type="text"
                      placeholder="e.g. Order Update"
                      value={headerText}
                      onChange={(e) => setHeaderText(e.target.value)}
                      className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 3: Body */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-[10px] font-extrabold">3</span>
                  Message Body <span className="text-red-500">*</span>
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleInsertVariable}
                  className="h-7 px-2.5 bg-background text-[11px] font-semibold border-border/80 rounded-md cursor-pointer flex items-center gap-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                >
                  <Plus className="h-3 w-3" /> Add Variable
                </Button>
              </div>

              <div className="space-y-1.5">
                <textarea
                  ref={textareaRef}
                  placeholder="Hello {{1}}, your order {{2}} has been confirmed."
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full rounded-lg border border-border/80 bg-background px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono resize-none leading-relaxed"
                />
                <div className="flex justify-between items-center text-[11px] text-muted-foreground">
                  <span>Example: Hello &#123;&#123;1&#125;&#125;, your order &#123;&#123;2&#125;&#125; has been confirmed.</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {activeVariableIds.length} variable{activeVariableIds.length === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 4: Footer */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-[10px] font-extrabold">4</span>
                Footer (Optional)
              </h3>
              <input
                type="text"
                placeholder="e.g. Reply STOP to unsubscribe."
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* SECTION 5: Buttons */}
            <div className="p-4 rounded-xl bg-muted/20 border border-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-[10px] font-extrabold">5</span>
                  Interactive Buttons
                </h3>
                <div className="flex gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddButton("QUICK_REPLY")}
                    className="h-7 px-2 text-[10px] font-semibold border-border/80 rounded-md cursor-pointer"
                  >
                    + Quick Reply
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddButton("URL")}
                    className="h-7 px-2 text-[10px] font-semibold border-border/80 rounded-md cursor-pointer"
                  >
                    + URL
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddButton("PHONE_NUMBER")}
                    className="h-7 px-2 text-[10px] font-semibold border-border/80 rounded-md cursor-pointer"
                  >
                    + Phone
                  </Button>
                </div>
              </div>

              {buttons.length === 0 ? (
                <p className="text-[11px] text-muted-foreground italic py-1">No interactive buttons added yet.</p>
              ) : (
                <div className="space-y-3">
                  {buttons.map((btn, idx) => (
                    <div key={btn.id} className="p-3 rounded-lg bg-background border border-border/70 space-y-2 relative">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-muted-foreground font-mono">#{idx + 1}</span>
                          <select
                            value={btn.type}
                            onChange={(e) => handleUpdateButton(btn.id, "type", e.target.value)}
                            className="text-xs bg-muted/30 border border-border/60 rounded px-2 py-0.5 font-semibold focus:outline-none cursor-pointer"
                          >
                            <option value="QUICK_REPLY">Quick Reply</option>
                            <option value="URL">URL Button</option>
                            <option value="PHONE_NUMBER">Phone Number</option>
                          </select>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleRemoveButton(btn.id)}
                          className="h-6 w-6 text-muted-foreground hover:text-red-600 rounded cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">Button Text</label>
                          <input
                            type="text"
                            placeholder="e.g. Visit Website"
                            value={btn.text}
                            onChange={(e) => handleUpdateButton(btn.id, "text", e.target.value)}
                            className="w-full rounded border border-border/80 bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        {btn.type === "URL" && (
                          <div>
                            <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">URL</label>
                            <input
                              type="text"
                              placeholder="https://example.com"
                              value={btn.value}
                              onChange={(e) => handleUpdateButton(btn.id, "value", e.target.value)}
                              className="w-full rounded border border-border/80 bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                            />
                            {btn.value && !urlRegex.test(btn.value) && (
                              <span className="text-[9px] text-red-500 font-medium">Invalid URL format</span>
                            )}
                          </div>
                        )}

                        {btn.type === "PHONE_NUMBER" && (
                          <div>
                            <label className="text-[10px] font-semibold text-muted-foreground block mb-0.5">Phone Number</label>
                            <input
                              type="text"
                              placeholder="+911234567890"
                              value={btn.value}
                              onChange={(e) => handleUpdateButton(btn.id, "value", e.target.value)}
                              className="w-full rounded border border-border/80 bg-background px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                            />
                            {btn.value && !phoneRegex.test(btn.value) && (
                              <span className="text-[9px] text-red-500 font-medium">Invalid Phone format (e.g. +911234567890)</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 6: Variable Examples */}
            {activeVariableIds.length > 0 && (
              <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-extrabold">6</span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Variable Examples (Required by Meta)
                  </h3>
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Provide sample values for each variable tag. These are automatically formatted into <code className="text-emerald-700 dark:text-emerald-400 font-mono font-semibold">examples.body</code> for Meta approval.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  {activeVariableIds.map((id) => (
                    <div key={id} className="space-y-1">
                      <label className="text-[11px] font-bold text-foreground block">
                        Variable {id} Example <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={`e.g. ${id === 1 ? "John" : id === 2 ? "ORD123" : "Sample " + id}`}
                        value={exampleValues[id] || ""}
                        onChange={(e) =>
                          setExampleValues((prev) => ({
                            ...prev,
                            [id]: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-border/80 bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                disabled={!isFormValid || createTemplateMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createTemplateMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Create Template
              </Button>
            </div>
          </form>

          {/* Right Side: Live WhatsApp Preview */}
          <div className="lg:col-span-5 sticky top-4 bg-zinc-900 text-white border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between shadow-xl overflow-hidden min-h-[420px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live WhatsApp Preview
                </span>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px]">
                  Real-time
                </Badge>
              </div>

              {/* WhatsApp Header bar */}
              <div className="bg-emerald-800 text-white p-2.5 rounded-xl flex items-center gap-3 shadow-md">
                <div className="h-8 w-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-600">
                  WA
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-none">WhatsApp Business</h4>
                  <span className="text-[10px] text-emerald-200/80 font-medium">Official Template Preview</span>
                </div>
              </div>

              {/* Message Bubble Container */}
              <div className="bg-[#0b141a] rounded-xl p-3.5 min-h-[220px] flex flex-col justify-end border border-zinc-800/80">
                <div className="bg-[#202c33] text-zinc-100 text-xs p-3 rounded-lg max-w-[92%] self-start shadow-md relative whitespace-pre-wrap leading-relaxed">
                  {/* Header */}
                  {headerType === "TEXT" && headerText && (
                    <p className="font-bold text-xs mb-2 text-zinc-100 border-b border-zinc-700/60 pb-1">
                      {headerText}
                    </p>
                  )}

                  {/* Body with interpolated values */}
                  <p className="font-sans text-[12px] font-normal leading-relaxed">
                    {getInterpolatedBodyForPreview() || (
                      <span className="text-zinc-500 italic">Type template body text to see preview...</span>
                    )}
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

                  {/* WhatsApp Buttons inside bubble footer */}
                  {buttons.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-zinc-700/80 space-y-1.5">
                      {buttons.map((btn) => (
                        <div
                          key={btn.id}
                          className="w-full py-1.5 px-3 bg-[#2a3942] hover:bg-[#34444e] transition-colors text-emerald-400 font-semibold text-[11px] rounded-md flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          {btn.type === "URL" && <ExternalLink className="h-3 w-3" />}
                          {btn.type === "PHONE_NUMBER" && <Phone className="h-3 w-3" />}
                          {btn.type === "QUICK_REPLY" && <MessageSquareReply className="h-3 w-3" />}
                          <span>{btn.text || "Button Label"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 text-[10px] text-zinc-400 flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Generates exact backend Cloud API payload automatically without manual JSON.</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
