"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MessageSquare, 
  Table, 
  Mail, 
  Hash, 
  Zap, 
  ShoppingBag, 
  ShoppingCart, 
  Target, 
  Cloud, 
  CreditCard,
  Check,
  Activity,
  RefreshCw,
  Edit,
  Trash2,
  AlertTriangle,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { IntegrationItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { EmptyState } from "../shared/empty-state";
import { IntegrationData } from "@/types/integration.types";

interface IntegrationCardsProps {
  integrations: IntegrationItem[];
  setIntegrations: React.Dispatch<React.SetStateAction<IntegrationItem[]>>;
  integrationData?: IntegrationData | null;
  isLoadingIntegration?: boolean;
  onOpenConnectModal?: () => void;
  onOpenUpdateModal?: () => void;
  onVerifyConnection?: () => void;
  onDeleteIntegration?: () => void;
  isVerifying?: boolean;
  isDeleting?: boolean;
}

export function IntegrationCards({ 
  integrations, 
  setIntegrations,
  integrationData,
  isLoadingIntegration,
  onOpenConnectModal,
  onOpenUpdateModal,
  onVerifyConnection,
  onDeleteIntegration,
  isVerifying,
  isDeleting,
}: IntegrationCardsProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("all");

  // Toggle mock status for non-WhatsApp channels
  const handleToggleConnection = (id: string) => {
    if (id === "int_whatsapp" || id === "int_meta") {
      if (integrationData) {
        onDeleteIntegration?.();
      } else {
        onOpenConnectModal?.();
      }
      return;
    }

    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === "connected" ? "disconnected" : "connected";
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  // Get Lucide Icon for logo representation
  const getLogoIcon = (id: string) => {
    switch (id) {
      case "int_whatsapp":
        return <MessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case "int_meta":
        return <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case "int_gsheets":
        return <Table className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case "int_gmail":
        return <Mail className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case "int_slack":
        return <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case "int_zapier":
        return <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case "int_shopify":
        return <ShoppingBag className="h-5 w-5 text-lime-600 dark:text-lime-400" />;
      case "int_woocommerce":
        return <ShoppingCart className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      case "int_hubspot":
        return <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case "int_salesforce":
        return <Cloud className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case "int_stripe":
        return <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
      case "int_razorpay":
        return <CreditCard className="h-5 w-5 text-sky-600 dark:text-sky-400" />;
      default:
        return <Zap className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const categories = [
    { id: "all", label: "All Packages" },
    { id: "messaging", label: "Messaging" },
    { id: "crm", label: "CRM" },
    { id: "ecommerce", label: "E-commerce" },
    { id: "payments", label: "Payments" },
    { id: "productivity", label: "Productivity" },
    { id: "marketing", label: "Marketing" }
  ];

  // Merge real WhatsApp backend status into integrations list
  const mergedIntegrations = React.useMemo(() => {
    return integrations.map(item => {
      if (item.id === "int_whatsapp" || item.id === "int_meta") {
        if (integrationData) {
          const statusLower = integrationData.status.toLowerCase() as "connected" | "disconnected";
          return { ...item, status: statusLower };
        } else {
          return { ...item, status: "disconnected" as const };
        }
      }
      return item;
    });
  }, [integrations, integrationData]);

  // Filter calculation
  const filteredIntegrations = React.useMemo(() => {
    return mergedIntegrations.filter(item => {
      const matchCategory = activeCategory === "all" || item.category === activeCategory;
      const matchSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [mergedIntegrations, activeCategory, searchQuery]);

  // Count connected items
  const connectedCount = mergedIntegrations.filter(i => i.status === "connected").length;

  return (
    <div className="space-y-6 text-left font-sans text-xs">
      
      {/* 1. Header Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold transition-all focus:outline-none cursor-pointer border border-transparent",
                activeCategory === cat.id 
                  ? "bg-emerald-600 text-white shadow-sm" 
                  : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:max-w-xs shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 h-8 text-xs focus-visible:ring-emerald-500/80"
          />
        </div>
      </div>

      {/* 2. Connected Integrations (Quick Grid) */}
      {activeCategory === "all" && !searchQuery && connectedCount > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Currently Connected Channels</span>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mergedIntegrations
              .filter(i => i.status === "connected")
              .map((item) => (
                <Card key={item.id} className="border-emerald-500/30 bg-emerald-500/[0.01] hover:bg-emerald-500/[0.02] shadow-xs transition-all">
                  <CardContent className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-background border border-border/80 shrink-0">
                        {getLogoIcon(item.id)}
                      </div>
                      <div>
                        <span className="font-bold text-foreground block">{item.name}</span>
                        <span className="text-[9px] text-muted-foreground capitalize block">{item.category}</span>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 border-none font-bold text-[8px] px-1.5 py-0 select-none uppercase tracking-wider flex items-center gap-1 shrink-0">
                      <Check className="h-2 w-2" /> Connected
                    </Badge>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* 3. Integrations Cards List */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
          {activeCategory === "all" ? "Featured Packages" : `${activeCategory} Integrations`}
        </span>

        {filteredIntegrations.length === 0 ? (
          /* Empty state for category/search matches */
          <EmptyState
            title="No integrations found"
            description="No software packages match your current search string or category criteria. Try resetting your search filters."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredIntegrations.map((item) => {
              const isWhatsAppCard = item.id === "int_whatsapp" || item.id === "int_meta";
              const isConnected = item.status === "connected";
              const realStatus = isWhatsAppCard && integrationData ? integrationData.status : item.status.toUpperCase();

              return (
                <Card 
                  key={item.id} 
                  className={cn(
                    "flex flex-col justify-between border-border/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden",
                    isConnected && "border-emerald-500/20"
                  )}
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-2.5 rounded-xl bg-muted/60 border border-border/30 shrink-0">
                        {getLogoIcon(item.id)}
                      </div>
                      <Badge className="bg-muted text-muted-foreground border-none font-bold text-[8px] px-1.5 py-0 select-none uppercase tracking-wider">
                        {item.category}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <span className="font-bold text-xs text-foreground block">{item.name}</span>
                      <p className="text-[10px] text-muted-foreground leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>

                    {/* Display Real WhatsApp Backend Details if available */}
                    {isWhatsAppCard && integrationData && (
                      <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 space-y-1 text-[10px] font-mono">
                        <div className="flex justify-between items-center text-foreground">
                          <span className="font-semibold text-muted-foreground">Phone:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{integrationData.phoneNumber}</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>WABA ID:</span>
                          <span className="truncate max-w-[120px]">{integrationData.businessAccountId}</span>
                        </div>
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span>Phone ID:</span>
                          <span className="truncate max-w-[120px]">{integrationData.phoneNumberId}</span>
                        </div>
                        {integrationData.lastVerifiedAt && (
                          <div className="flex justify-between items-center text-[9px] text-muted-foreground pt-1 border-t border-border/30">
                            <span>Last Verified:</span>
                            <span>{new Date(integrationData.lastVerifiedAt).toLocaleTimeString()}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Footer Bar */}
                  <div className="p-4 pt-0 border-t border-border/30 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[9px] text-muted-foreground">
                      Status:{" "}
                      <strong
                        className={cn(
                          realStatus === "CONNECTED" || realStatus === "CONNECTED"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : realStatus === "EXPIRED"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground"
                        )}
                      >
                        {realStatus}
                      </strong>
                    </span>

                    {/* Button Controls */}
                    {isWhatsAppCard ? (
                      <div className="flex items-center gap-1.5">
                        {integrationData ? (
                          <>
                            {/* Verify Button */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={onVerifyConnection}
                              disabled={isVerifying}
                              className="h-7 px-2.5 text-[10px] font-semibold border-emerald-500/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer flex items-center gap-1"
                              title="Verify connection with Meta Graph API"
                            >
                              {isVerifying ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <ShieldCheck className="h-3 w-3" />
                              )}
                              Verify
                            </Button>

                            {/* Edit Button */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={onOpenUpdateModal}
                              className="h-7 px-2 text-[10px] font-semibold border-border text-foreground hover:bg-muted cursor-pointer"
                              title="Edit Credentials"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>

                            {/* Disconnect Button */}
                            <Button
                              size="sm"
                              onClick={onDeleteIntegration}
                              disabled={isDeleting}
                              className="h-7 px-2.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border-none bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                            >
                              {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Disconnect"}
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={onOpenConnectModal}
                            className="h-7 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-all border-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleToggleConnection(item.id)}
                        className={cn(
                          "h-7 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-all border-none",
                          isConnected 
                            ? "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20" 
                            : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        )}
                      >
                        {isConnected ? "Disconnect" : "Connect"}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
