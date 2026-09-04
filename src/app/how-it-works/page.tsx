"use client";

import * as React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Plug,
  Users,
  FileText,
  Send,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Copy,
  Check,
  Key,
  ShieldCheck,
  Globe,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Zap,
  Info,
  ChevronDown,
  Layers,
  PlayCircle
} from "lucide-react";

import { env } from "@/config/env";

interface StepItem {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  estimatedTime: string;
  actionText: string;
  actionHref: string;
  summary: string;
  details: {
    heading: string;
    points: { title: string; desc: string; note?: string }[];
    codeSnippet?: { title: string; code: string; language?: string };
    proTip?: string;
  };
}

const getStepsData = (): StepItem[] => {
  const apiUrl = env.apiBaseUrl;
  return [
    {
      id: 1,
      slug: "meta-integration",
      title: "1. Connect Meta WhatsApp Cloud API",
      subtitle: "Link your official WhatsApp Business account via Meta Developer Portal.",
      icon: Plug,
      badge: "Step 1 (Crucial)",
      estimatedTime: "5 mins",
      actionText: "Connect Meta",
      actionHref: "/integrations",
      summary: "Connect Meta Cloud API by retrieving your Phone Number ID, WABA ID, and Permanent System Access Token.",
      details: {
        heading: "Step-by-Step Meta Developer Portal Setup Guide",
        points: [
          {
            title: "Step A: Create Meta Developer App",
            desc: "Go to developers.facebook.com, click 'Create App', choose 'Business' app type, and enter your app name."
          },
          {
            title: "Step B: Add WhatsApp Product",
            desc: "Inside your app dashboard, click 'Set up' under the WhatsApp product section and choose or link your Meta Business Account."
          },
          {
            title: "Step C: Copy Cloud API Credentials",
            desc: "From WhatsApp > API Setup, copy your 'Phone Number ID' and 'WhatsApp Business Account ID' (WABA ID)."
          },
          {
            title: "Step D: Generate Permanent Access Token",
            desc: "Go to Meta Business Settings > Users > System Users. Create a System User with Admin privileges, assign your WhatsApp app, and generate a Never-Expiring Token with 'whatsapp_business_messaging' & 'whatsapp_business_management' permissions.",
            note: "Do not use a 24-hour temporary token in production!"
          },
          {
            title: "Step E: Configure Webhooks for Live Sync",
            desc: "In Meta Developer Portal > WhatsApp > Configuration, enter your WhatsFlow Webhook Callback URL and Verify Token to enable instant two-way real-time messaging."
          }
        ],
        codeSnippet: {
          title: "Your Webhook Configuration Endpoint",
          code: `Callback URL: ${apiUrl}/webhook/meta\nVerify Token: whatsapp_backend_2026_secure_token`,
          language: "text"
        },
        proTip: "Make sure your WhatsApp Business Phone number has completed Meta OTP verification before attempting to send live messages."
      }
    },
    {
      id: 2,
      slug: "contacts-import",
      title: "2. Import & Manage Contacts",
      subtitle: "Add single contacts or bulk import CSV files with international phone formatting.",
      icon: Users,
      badge: "Step 2",
      estimatedTime: "3 mins",
      actionText: "Manage Contacts",
      actionHref: "/contacts",
      summary: "Build your customer database with full country code support (+91, +1) and custom tagging.",
      details: {
        heading: "Contact List Management & Formatting Rules",
        points: [
          {
            title: "International Format (E.164)",
            desc: "All phone numbers must include country code without spaces or dashes (e.g. +919876543210 or +14155552671)."
          },
          {
            title: "CSV Bulk Import",
            desc: "Upload CSV or Excel spreadsheets with column headers: Name, Phone, Email, Tags, Custom Attributes."
          },
          {
            title: "Tagging & Segmentation",
            desc: "Assign tags like 'Lead', 'VIP Customer', 'Newsletter' to easily filter audiences during campaign creation."
          }
        ],
        codeSnippet: {
          title: "Sample CSV Upload Format",
          code: "Name,Phone,Email,Tags\nRahul Sharma,+919876543210,rahul@example.com,VIP\nSarah Jenkins,+14155552671,sarah@example.com,Lead",
          language: "csv"
        },
        proTip: "WhatsFlow automatically validates phone numbers upon entry to prevent delivery failures."
      }
    },
    {
      id: 3,
      slug: "templates-creation",
      title: "3. Create & Submit Message Templates",
      subtitle: "Design Meta-compliant WhatsApp templates with dynamic variables and action buttons.",
      icon: FileText,
      badge: "Step 3",
      estimatedTime: "4 mins",
      actionText: "Create Template",
      actionHref: "/templates",
      summary: "Submit Marketing, Utility, or Authentication templates to Meta for fast automated approval.",
      details: {
        heading: "Template Design & Meta Approval Process",
        points: [
          {
            title: "Select Category & Language",
            desc: "Choose between Marketing, Utility, or Authentication categories and pick your target language (e.g., English, Hindi)."
          },
          {
            title: "Add Header, Body & Variables",
            desc: "Construct your message body and insert dynamic variables like {{1}} for customer name or {{2}} for order ID."
          },
          {
            title: "Interactive Buttons",
            desc: "Attach Call-to-Action (CTA) website links, phone call buttons, or Quick Reply options."
          },
          {
            title: "Meta Automated Review",
            desc: "Once submitted, Meta's automated AI system reviews your template within 1 to 5 minutes. Status will update to 'APPROVED'."
          }
        ],
        proTip: "Avoid spam words or ALL CAPS in template body text to maintain a high Meta quality rating."
      }
    },
    {
      id: 4,
      slug: "campaigns-chat",
      title: "4. Launch Campaigns & Live 1-on-1 Chat",
      subtitle: "Send mass broadcast campaigns, trigger automated flows, and reply via Live Chat.",
      icon: Send,
      badge: "Step 4",
      estimatedTime: "Instant",
      actionText: "Go to Campaigns",
      actionHref: "/campaigns",
      summary: "Execute broadcasts to thousands of contacts, track delivery receipts, and converse in real-time.",
      details: {
        heading: "Campaign Broadcasts & Live Chat Execution",
        points: [
          {
            title: "Create Outbound Campaign",
            desc: "Select an approved template, choose your target contact tags or list, set delivery schedule, and launch."
          },
          {
            title: "Real-Time Delivery & Read Analytics",
            desc: "Monitor live metrics for Sent, Delivered, Read, Failed, and Link Clicks right from your Dashboard."
          },
          {
            title: "Live Chat Interface",
            desc: "When customers reply to your campaign, seamlessly converse with them using the unified two-way Live Chat."
          },
          {
            title: "Automated Triggers",
            desc: "Configure auto-responders and chatbot rules to reply instantly 24/7 when specific keywords are detected."
          }
        ],
        proTip: "Use Live Chat filters to prioritize unread customer inquiries and boost response times."
      }
    }
  ];
};

const faqItems = [
  {
    question: "Why is Meta Cloud API integration mandatory?",
    answer: "WhatsFlow uses Meta's official Cloud API infrastructure for maximum throughput, official green-tick verification support, zero account ban risks, and instant delivery speeds."
  },
  {
    question: "How long does Meta take to approve WhatsApp templates?",
    answer: "Most standard marketing and utility templates are approved automatically by Meta AI within 1 to 5 minutes. Complex templates may take up to 24 hours."
  },
  {
    question: "Where do I find my System User Access Token in Meta?",
    answer: "Log into Meta Business Manager (business.facebook.com), navigate to Business Settings > Users > System Users. Add a system user, assign your WhatsApp app with full permissions, and click 'Generate New Token'."
  },
  {
    question: "Can I import contacts without country codes?",
    answer: "No. Meta Cloud API requires exact E.164 phone formatting (including country code like +91 for India or +1 for US) to accurately route messages globally."
  },
  {
    question: "How does the Webhook sync incoming messages to Live Chat?",
    answer: "When a user replies on WhatsApp, Meta sends an encrypted payload to your configured Webhook callback URL. WhatsFlow instantly decodes it and displays it in your Live Chat panel via real-time WebSockets."
  }
];

export default function HowItWorksPage() {
  const stepsData = React.useMemo(() => getStepsData(), []);
  const [activeStepId, setActiveStepId] = React.useState<number>(1);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0);

  const currentStep = stepsData.find(s => s.id === activeStepId) || stepsData[0];

  const handleCopyText = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <DashboardLayout>
      {/* Page Header with Breadcrumbs */}
      <PageHeader
        title="How It Works & Setup Guide"
        description="Step-by-step master guide to set up Meta WhatsApp Cloud API, import contacts, submit templates, and launch broadcast campaigns."
      >
        <div className="flex items-center gap-2">
          <Link href="/integrations">
            <Button
              size="sm"
              className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer border-none flex items-center gap-1.5 shadow-xs"
            >
              <Plug className="h-4 w-4" />
              Connect Meta API
            </Button>
          </Link>
          <Link href="/chat">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 rounded-lg text-xs font-semibold border-border/80 text-foreground hover:bg-muted/40 cursor-pointer gap-1.5"
            >
              <MessageSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Open Live Chat
            </Button>
          </Link>
        </div>
      </PageHeader>

      {/* Main Content Area */}
      <div className="space-y-8 font-sans text-xs pb-12">

        {/* Top Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900/90 via-slate-900 to-zinc-950 p-6 md:p-8 text-white border border-emerald-500/20 shadow-xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>WhatsFlow Complete Workflow Guide</span>
              </div>
              <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-white">
                4 Simple Steps to Automate WhatsApp Messaging
              </h2>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                Follow this quick visual checklist to connect Meta WhatsApp Cloud API, import contacts, submit templates, and launch broadcast campaigns.
              </p>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-400">100%</div>
                <div className="text-[11px] text-slate-400">Meta API Compliant</div>
              </div>
              <Badge variant="outline" className="border-emerald-400/40 text-emerald-300 bg-emerald-950/40 px-3 py-1 text-xs">
                Official Cloud API
              </Badge>
            </div>
          </div>

          {/* Quick Steps Horizontal Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 pt-6 border-t border-white/10">
            {stepsData.map((step) => {
              const IconComp = step.icon;
              const isActive = step.id === activeStepId;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepId(step.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-200 text-left cursor-pointer ${isActive
                    ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/50"
                    : "bg-white/5 hover:bg-white/10 text-slate-300"
                    }`}
                >
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-white/20 text-white" : "bg-white/10 text-emerald-400"
                    }`}>
                    <IconComp className="h-4 w-4" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-[10px] font-bold uppercase opacity-80">{step.badge}</div>
                    <div className="text-xs font-semibold truncate">{step.title.split(". ")[1]}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step-by-Step Detailed View Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Step Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-foreground px-1 flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Onboarding Steps
            </h3>
            <div className="space-y-2">
              {stepsData.map((step) => {
                const IconComp = step.icon;
                const isActive = step.id === activeStepId;
                return (
                  <div
                    key={step.id}
                    onClick={() => setActiveStepId(step.id)}
                    className={`group relative flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${isActive
                      ? "bg-card border-emerald-500 shadow-md ring-1 ring-emerald-500/20"
                      : "bg-card/60 hover:bg-card border-border/80 hover:border-border"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${isActive
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-muted text-muted-foreground group-hover:text-foreground"
                        }`}>
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {step.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground line-clamp-1">
                          {step.subtitle}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isActive ? "text-emerald-600 dark:text-emerald-400 translate-x-1" : "text-muted-foreground/60"
                      }`} />
                  </div>
                );
              })}
            </div>

            {/* Support Box */}
            <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl mt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-xs text-foreground">Need Setup Help?</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Our technical support team can assist you with Meta Business Verification and Webhook integration.
                  </p>
                  <a
                    href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
                  >
                    Meta Official Docs <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Active Step Detailed View */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border border-border/80 shadow-xs overflow-hidden rounded-2xl">
              <CardHeader className="bg-muted/30 dark:bg-muted/10 border-b border-border p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-xs">
                      {currentStep.id}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px]">
                          {currentStep.badge}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Zap className="h-3 w-3 text-amber-500" /> Est: {currentStep.estimatedTime}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold text-foreground mt-1">
                        {currentStep.title}
                      </CardTitle>
                    </div>
                  </div>

                  <Link href={currentStep.actionHref}>
                    <Button
                      size="sm"
                      className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs cursor-pointer shadow-xs gap-1.5"
                    >
                      <span>{currentStep.actionText}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <CardDescription className="text-xs text-muted-foreground pt-2">
                  {currentStep.summary}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6">

                {/* Step Details & Points */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    {currentStep.details.heading}
                  </h4>

                  <div className="grid gap-3">
                    {currentStep.details.points.map((pt, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-muted/20 border border-border/60 space-y-1">
                        <div className="font-semibold text-xs text-foreground flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-bold">
                            {i + 1}
                          </span>
                          {pt.title}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-7">
                          {pt.desc}
                        </p>
                        {pt.note && (
                          <div className="ml-7 mt-1.5 text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200 dark:border-amber-900/50 flex items-center gap-1.5">
                            <Info className="h-3.5 w-3.5 shrink-0" />
                            <span>{pt.note}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional Code Snippet or Webhook URL Copy Box */}
                {currentStep.details.codeSnippet && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>{currentStep.details.codeSnippet.title}</span>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleCopyText(currentStep.details.codeSnippet!.code, "snippet")}
                        className="h-7 px-2 text-[11px] text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 gap-1 cursor-pointer"
                      >
                        {copiedKey === "snippet" ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" /> Copy Snippet
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
                      {currentStep.details.codeSnippet.code}
                    </pre>
                  </div>
                )}

                {/* Pro Tip Box */}
                {currentStep.details.proTip && (
                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300">Pro Tip for Production: </span>
                      <span className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed">
                        {currentStep.details.proTip}
                      </span>
                    </div>
                  </div>
                )}

                {/* Bottom Step Switcher Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={activeStepId === 1}
                    onClick={() => setActiveStepId(prev => Math.max(1, prev - 1))}
                    className="h-8 px-3 text-xs font-semibold cursor-pointer"
                  >
                    Previous Step
                  </Button>

                  <div className="text-xs font-medium text-muted-foreground">
                    Step {activeStepId} of {stepsData.length}
                  </div>

                  <Button
                    size="sm"
                    disabled={activeStepId === stepsData.length}
                    onClick={() => setActiveStepId(prev => Math.min(stepsData.length, prev + 1))}
                    className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Next Step
                  </Button>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>

        {/* Visual Roadmap Section */}
        <Card className="border border-border/80 shadow-xs p-6 rounded-2xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Complete Architecture & Data Flow Roadmap
            </h3>
            <p className="text-xs text-muted-foreground">
              How data flows seamlessly between Meta Cloud API, WhatsFlow SaaS backend, contacts database, and your live chat interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2 text-center relative">
              <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto font-bold text-xs">
                1
              </div>
              <div className="font-semibold text-xs text-foreground">Meta Cloud API Sync</div>
              <p className="text-[11px] text-muted-foreground">Phone Number ID, WABA ID & Access Token verification.</p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2 text-center relative">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto font-bold text-xs">
                2
              </div>
              <div className="font-semibold text-xs text-foreground">Contacts Import</div>
              <p className="text-[11px] text-muted-foreground">Import E.164 formatted customer numbers with custom tags.</p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2 text-center relative">
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto font-bold text-xs">
                3
              </div>
              <div className="font-semibold text-xs text-foreground">Template Approval</div>
              <p className="text-[11px] text-muted-foreground">Design HSM message templates and submit for Meta approval.</p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2 text-center relative">
              <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto font-bold text-xs">
                4
              </div>
              <div className="font-semibold text-xs text-foreground">Campaigns & Live Chat</div>
              <p className="text-[11px] text-muted-foreground">Execute high-speed broadcasts & reply to incoming webhooks instantly.</p>
            </div>
          </div>
        </Card>

        {/* Frequently Asked Questions (FAQ) Section */}
        <Card className="border border-border/80 shadow-xs p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Frequently Asked Questions (FAQ)
              </h3>
              <p className="text-xs text-muted-foreground">
                Answers to common questions regarding Meta Cloud API setup, token validity, and messaging limits.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-border/80 overflow-hidden bg-card transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left font-semibold text-xs text-foreground hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Q:</span>
                      {item.question}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180 text-emerald-600" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-3 bg-muted/10">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Bottom Call to Action Footer Card */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold text-white">Ready to Connect Your WhatsApp Channel?</h3>
            <p className="text-xs text-emerald-100 max-w-xl">
              Start sending interactive WhatsApp message templates and manage customer conversations with WhatsFlow SaaS now.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/integrations">
              <Button
                size="sm"
                className="h-9 px-5 bg-white text-emerald-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md cursor-pointer border-none"
              >
                Go to Integrations
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
