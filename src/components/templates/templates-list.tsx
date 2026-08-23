"use client";

import * as React from "react";
import { 
  Search, 
  ChevronDown, 
  MoreVertical, 
  Eye, 
  Trash2, 
  Grid, 
  List, 
  ChevronLeft, 
  ChevronRight,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Loader2,
  Calendar,
  ShieldCheck,
  Globe,
  Tag
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/shared/loading-state";
import { useTemplates, useDeleteTemplate, useTemplate } from "@/hooks/use-templates";
import { Template, GetTemplatesQueryParams } from "@/types/template.types";
import { toast } from "@/components/ui/toast";

const CreateTemplateModal = dynamic(
  () => import("./create-template-modal").then((mod) => mod.CreateTemplateModal),
  { ssr: false }
);
const TemplatePreviewModal = dynamic(
  () => import("./template-preview-modal").then((mod) => mod.TemplatePreviewModal),
  { ssr: false }
);

const ITEMS_PER_PAGE = 6;

export function TemplatesList() {
  // Grid vs List View toggle
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [sortCriteria, setSortCriteria] = React.useState<string>("newest");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Debounce search query input (300ms)
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Modal / Sandbox States
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState(false);

  // Delete Confirmation Dialog State
  const [templateToDelete, setTemplateToDelete] = React.useState<Template | null>(null);

  // Construct Query Params for API
  const queryParams: GetTemplatesQueryParams = React.useMemo(() => {
    let sortField: GetTemplatesQueryParams["sort"] = "createdAt";
    let sortOrder: GetTemplatesQueryParams["order"] = "desc";

    if (sortCriteria === "oldest") {
      sortField = "createdAt";
      sortOrder = "asc";
    } else if (sortCriteria === "name-asc") {
      sortField = "name";
      sortOrder = "asc";
    } else if (sortCriteria === "name-desc") {
      sortField = "name";
      sortOrder = "desc";
    }

    return {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: debouncedSearch.trim() || undefined,
      category: selectedCategory === "all" ? undefined : (selectedCategory as any),
      status: selectedStatus === "all" ? undefined : (selectedStatus as any),
      sort: sortField,
      order: sortOrder,
    };
  }, [currentPage, debouncedSearch, selectedCategory, selectedStatus, sortCriteria]);

  // Fetch Templates via React Query
  const { data: response, isLoading, isError, error, isFetching, refetch } = useTemplates(queryParams);

  const templatesList = response?.templates || [];
  const pagination = response?.pagination || {
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 1,
  };

  // Fetch detailed template for preview modal
  const { data: singleTemplateDetails } = useTemplate(selectedTemplateId);
  const selectedTemplate = templatesList.find((t) => t._id === selectedTemplateId) || singleTemplateDetails || null;

  // React Query Mutations
  const deleteTemplateMutation = useDeleteTemplate();

  // Delete Confirmation Handler
  const confirmDeleteTemplate = async () => {
    if (!templateToDelete) return;
    try {
      await deleteTemplateMutation.mutateAsync(templateToDelete._id);
      toast.success(`Template "${templateToDelete.name}" deleted successfully.`, "Deleted");
      if (selectedTemplateId === templateToDelete._id) {
        setSelectedTemplateId(null);
      }
      setTemplateToDelete(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete template.";
      toast.error(msg, "Delete Error");
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSortCriteria("newest");
    setCurrentPage(1);
  };

  // Expose Trigger for Page Header CTA button
  React.useEffect(() => {
    const handleOpenCreateTemplate = () => setIsCreateModalOpen(true);
    window.addEventListener("open-create-template", handleOpenCreateTemplate);
    return () => window.removeEventListener("open-create-template", handleOpenCreateTemplate);
  }, []);

  // Colored Badges requirement:
  // APPROVED -> Green
  // PENDING -> Yellow
  // REJECTED -> Red
  // PAUSED -> Orange
  // DISABLED -> Gray
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

  const renderQualityScoreBadge = (score?: string | null) => {
    if (!score) return <span className="text-muted-foreground text-xs">N/A</span>;

    let dotColor = "bg-gray-400";
    if (score === "GREEN") dotColor = "bg-emerald-500";
    if (score === "YELLOW") dotColor = "bg-yellow-500";
    if (score === "RED") dotColor = "bg-red-500";

    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-foreground">
        <span className={cn("h-2 w-2 rounded-full", dotColor)}></span>
        {score}
      </span>
    );
  };

  const getTemplateBodyText = (tpl: Template): string => {
    const bodyComp = tpl.components?.find((c) => c.type === "BODY");
    return bodyComp?.text || "";
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Controls */}
      <div className="p-5 border border-border/80 bg-card rounded-xl shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by template name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 h-9 bg-background border border-border/80 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all font-sans"
            />
            {isFetching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground animate-spin" />
            )}
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-44 pl-3 pr-8 h-9 bg-background border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 appearance-none cursor-pointer font-medium font-sans"
            >
              <option value="all">All Categories</option>
              <option value="MARKETING">Marketing</option>
              <option value="UTILITY">Utility</option>
              <option value="AUTHENTICATION">Authentication</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-36 pl-3 pr-8 h-9 bg-background border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 appearance-none cursor-pointer font-medium font-sans"
            >
              <option value="all">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
              <option value="PAUSED">Paused</option>
              <option value="DISABLED">Disabled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* View Mode & Sort options */}
        <div className="flex items-center gap-3 justify-between">
          <div className="relative shrink-0">
            <select
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
              className="pl-3 pr-8 h-9 bg-background border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 appearance-none cursor-pointer font-medium font-sans w-36"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Grid/List toggles */}
          <div className="flex items-center border border-border/80 rounded-lg p-0.5 bg-muted/40 shrink-0">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 rounded-md p-0 cursor-pointer"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 rounded-md p-0 cursor-pointer"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Error Alert State */}
      {isError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs flex items-center justify-between border border-red-200/30 dark:border-red-800/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error instanceof Error ? error.message : "Failed to load templates from backend server."}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="h-7 text-[11px] font-semibold cursor-pointer">
            Retry
          </Button>
        </div>
      )}

      {/* Main Library List Display */}
      {isLoading ? (
        <div className="p-2">
          <LoadingState rows={6} rowHeightClass="h-28" />
        </div>
      ) : templatesList.length === 0 ? (
        /* Empty State */
        <Card className="border-border/80 shadow-xs">
          <div className="py-20 px-4 flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
            <div className="p-4 rounded-full bg-muted/40 border border-border/60 mb-4 text-muted-foreground">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">No templates found</h3>
            <p className="text-xs text-muted-foreground max-w-xs mb-6">
              No matching WhatsApp templates found. Adjust filters or sync latest templates from Meta.
            </p>
            <Button size="sm" onClick={handleClearFilters} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer">
              Reset Filters
            </Button>
          </div>
        </Card>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templatesList.map((tpl) => {
            const bodyText = getTemplateBodyText(tpl);
            return (
              <Card key={tpl._id} className="hover:-translate-y-0.5 hover:shadow-md transition-all border-border/80 flex flex-col justify-between min-h-[250px]">
                <CardContent className="p-5 flex flex-col justify-between h-full text-left">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div className="truncate">
                        <h4 className="font-bold text-foreground text-sm truncate" title={tpl.name}>
                          {tpl.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-muted-foreground font-mono uppercase font-bold bg-muted/60 px-1.5 py-0.5 rounded">
                            {tpl.category}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                            {tpl.language}
                          </span>
                        </div>
                      </div>
                      {renderStatusBadge(tpl.status)}
                    </div>

                    {/* Body preview block */}
                    <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40 text-[11px] text-muted-foreground line-clamp-3 min-h-[58px] leading-relaxed font-mono whitespace-pre-wrap mb-4 select-none">
                      {bodyText || <span className="italic opacity-60">No body text content</span>}
                    </div>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-border/50 text-[11px] text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[10px]">
                        <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" /> Quality:
                      </span>
                      {renderQualityScoreBadge(tpl.qualityScore)}
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span>Created: <strong>{tpl.createdAt ? new Date(tpl.createdAt).toLocaleDateString() : "N/A"}</strong></span>
                      <span>Updated: <strong>{tpl.updatedAt ? new Date(tpl.updatedAt).toLocaleDateString() : "N/A"}</strong></span>
                    </div>

                    <div className="flex justify-end gap-1.5 pt-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedTemplateId(tpl._id);
                          setIsPreviewModalOpen(true);
                        }}
                        className="h-7 text-xs font-semibold text-foreground border-border/80 hover:bg-muted rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" /> Details
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-muted-foreground hover:bg-muted rounded-lg cursor-pointer">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40" align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedTemplateId(tpl._id);
                            setIsPreviewModalOpen(true);
                          }} className="cursor-pointer">
                            <Sparkles className="mr-2 h-3.5 w-3.5 text-muted-foreground" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setTemplateToDelete(tpl)}
                            className="text-red-600 dark:text-red-400 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/20 dark:focus:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Template
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Dense List Table View */
        <Card className="border-border/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase bg-muted/5 tracking-wider">
                  <th className="py-3 px-4">Template Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Language</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Quality Score</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4">Updated Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs">
                {templatesList.map((tpl) => (
                  <tr 
                    key={tpl._id}
                    onClick={() => {
                      setSelectedTemplateId(tpl._id);
                      setIsPreviewModalOpen(true);
                    }}
                    className={cn(
                      "hover:bg-muted/10 dark:hover:bg-accent/10 transition-colors cursor-pointer",
                      selectedTemplateId === tpl._id && "bg-muted/20 dark:bg-accent/20"
                    )}
                  >
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/30 dark:border-emerald-800/10 flex items-center justify-center font-bold text-xs shrink-0">
                          {tpl.name.split("_").map((n) => n[0]?.toUpperCase() || "").slice(0, 2).join("") || "T"}
                        </div>
                        <span className="font-mono text-xs truncate max-w-[180px]" title={tpl.name}>{tpl.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-mono uppercase text-[11px]">{tpl.category}</td>
                    <td className="py-3.5 px-4 text-muted-foreground uppercase font-semibold text-[11px]">{tpl.language}</td>
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(tpl.status)}
                    </td>
                    <td className="py-3.5 px-4">
                      {renderQualityScoreBadge(tpl.qualityScore)}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-sans">
                      {tpl.createdAt ? new Date(tpl.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-sans">
                      {tpl.updatedAt ? new Date(tpl.updatedAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted rounded-lg cursor-pointer">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40" align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedTemplateId(tpl._id);
                            setIsPreviewModalOpen(true);
                          }} className="cursor-pointer">
                            <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setTemplateToDelete(tpl)}
                            className="text-red-600 dark:text-red-400 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/20 dark:focus:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination Footer */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between gap-4 py-2 text-xs">
          <span className="text-muted-foreground">
            Showing <strong className="font-semibold text-foreground">{(pagination.page - 1) * pagination.limit + 1}</strong> to{" "}
            <strong className="font-semibold text-foreground">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </strong>{" "}
            of <strong className="font-semibold text-foreground">{pagination.total}</strong> templates
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="h-8 px-2.5 rounded-lg border-border/80 text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-0.5" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
              className="h-8 px-2.5 rounded-lg border-border/80 text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="h-4 w-4 ml-0.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Create Template Dialog modal */}
      <CreateTemplateModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {/* Template Details & Sandbox modal */}
      <TemplatePreviewModal
        template={selectedTemplate}
        open={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={!!templateToDelete} onOpenChange={(open) => { if (!open) setTemplateToDelete(null); }}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Delete Template
            </DialogTitle>
            <DialogDescription className="pt-2 text-xs leading-relaxed">
              Are you sure you want to delete template <strong className="text-foreground">{templateToDelete?.name}</strong>? This action will remove the record.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2.5 pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setTemplateToDelete(null)}
              className="rounded-lg text-xs font-semibold cursor-pointer border-border/80"
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={confirmDeleteTemplate}
              disabled={deleteTemplateMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            >
              {deleteTemplateMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Delete Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
