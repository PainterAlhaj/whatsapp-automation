"use client";

import * as React from "react";
import { 
  Search, 
  ChevronDown, 
  MoreVertical, 
  Eye, 
  Send,
  Trash2, 
  Megaphone,
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { CreateCampaignModal } from "./create-campaign-modal";
import { CampaignDetailsDrawer } from "./campaign-details-drawer";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/shared/loading-state";
import { useCampaigns, useDeleteCampaign, useSendCampaign } from "@/hooks/use-campaigns";
import { CampaignData, CampaignQueryParams, CampaignStatus } from "@/types/campaign.types";
import { toast } from "@/components/ui/toast";

const ITEMS_PER_PAGE = 5;

export function CampaignsList() {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [selectedDateFilter, setSelectedDateFilter] = React.useState<string>("all");
  const [sortCriteria, setSortCriteria] = React.useState<string>("newest");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Modal / Drawer / Confirmation States
  const [selectedCampaignId, setSelectedCampaignId] = React.useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [campaignToDelete, setCampaignToDelete] = React.useState<CampaignData | null>(null);
  const [campaignToSend, setCampaignToSend] = React.useState<CampaignData | null>(null);

  // Debounce search query input (300ms)
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Construct Query Params for Backend API
  const queryParams: CampaignQueryParams = React.useMemo(() => {
    let sortField: CampaignQueryParams["sort"] = "createdAt";
    let sortOrder: CampaignQueryParams["order"] = "desc";

    if (sortCriteria === "name-asc") {
      sortField = "name";
      sortOrder = "asc";
    } else if (sortCriteria === "name-desc") {
      sortField = "name";
      sortOrder = "desc";
    } else if (sortCriteria === "audience-desc") {
      sortField = "totalRecipients";
      sortOrder = "desc";
    } else if (sortCriteria === "oldest") {
      sortField = "createdAt";
      sortOrder = "asc";
    }

    let statusFilter: CampaignStatus | undefined = undefined;
    if (selectedStatus !== "all") {
      statusFilter = selectedStatus.toUpperCase() as CampaignStatus;
    }

    return {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: debouncedSearch.trim() || undefined,
      status: statusFilter,
      sort: sortField,
      order: sortOrder,
    };
  }, [currentPage, debouncedSearch, selectedStatus, sortCriteria]);

  // React Query Fetch Data
  const { data: response, isLoading, isError, error, isFetching, refetch } = useCampaigns(queryParams);

  const campaignsList = response?.campaigns || [];
  const pagination = response?.pagination || {
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 1,
  };

  // React Query Mutations
  const deleteCampaignMutation = useDeleteCampaign();
  const sendCampaignMutation = useSendCampaign();

  // Delete Campaign Handler
  const confirmDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    try {
      await deleteCampaignMutation.mutateAsync(campaignToDelete._id);
      toast.success(`Campaign "${campaignToDelete.name}" deleted successfully.`, "Deleted");
      if (selectedCampaignId === campaignToDelete._id) {
        setSelectedCampaignId(null);
      }
      setCampaignToDelete(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete campaign.";
      toast.error(msg, "Delete Error");
    }
  };

  // Send Campaign Handler
  const confirmSendCampaign = async () => {
    if (!campaignToSend) return;
    try {
      await sendCampaignMutation.mutateAsync(campaignToSend._id);
      toast.success(`Broadcast campaign "${campaignToSend.name}" sent successfully.`, "Dispatched");
      setCampaignToSend(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send campaign.";
      toast.error(msg, "Send Error");
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedStatus("all");
    setSelectedDateFilter("all");
    setSortCriteria("newest");
    setCurrentPage(1);
  };

  // Expose Trigger for Page Header Broadcast button
  React.useEffect(() => {
    const handleOpenCreateCampaign = () => setIsCreateModalOpen(true);
    window.addEventListener("open-create-campaign", handleOpenCreateCampaign);
    return () => window.removeEventListener("open-create-campaign", handleOpenCreateCampaign);
  }, []);

  const getStatusBadgeVariant = (status: CampaignStatus) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "PROCESSING":
        return "success";
      case "SCHEDULED":
        return "secondary";
      case "FAILED":
      case "CANCELLED":
        return "destructive";
      case "DRAFT":
      default:
        return "secondary";
    }
  };

  return (
    <Card className="border-border/80 shadow-xs relative">
      {/* Search & Filter Bar */}
      <div className="p-5 border-b border-border/60 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-muted/10 dark:bg-zinc-900/10">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 h-9 bg-background border border-border/80 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all font-sans"
            />
            {isFetching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground animate-spin" />
            )}
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
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="w-full sm:w-36 pl-3 pr-8 h-9 bg-background border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 appearance-none cursor-pointer font-medium font-sans"
            >
              <option value="all">All Dates</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Sort Options */}
        <div className="relative">
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            className="w-full sm:w-44 pl-3 pr-8 h-9 bg-background border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 appearance-none cursor-pointer font-medium font-sans"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Campaign Name (A-Z)</option>
            <option value="name-desc">Campaign Name (Z-A)</option>
            <option value="audience-desc">Audience Size (Max)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Error Alert State */}
      {isError && (
        <div className="m-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs flex items-center justify-between border border-red-200/30 dark:border-red-800/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error instanceof Error ? error.message : "Failed to load campaigns from backend."}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="h-7 text-[11px] font-semibold cursor-pointer">
            Retry
          </Button>
        </div>
      )}

      {/* Campaigns Directory Table */}
      <div className="overflow-x-auto min-h-[300px]">
        {isLoading ? (
          <div className="p-6">
            <LoadingState rows={5} />
          </div>
        ) : campaignsList.length === 0 ? (
          /* Empty State */
          <div className="py-20 px-4 flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
            <div className="p-4 rounded-full bg-muted/40 border border-border/60 mb-4 text-muted-foreground">
              <Megaphone className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">No campaigns found</h3>
            <p className="text-xs text-muted-foreground max-w-xs mb-6">
              There are no broadcast configurations matching the filters or search query.
            </p>
            <Button size="sm" onClick={handleClearFilters} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer">
              Reset Filters
            </Button>
          </div>
        ) : (
          <table className="w-full min-w-[750px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase bg-muted/5 tracking-wider">
                <th className="py-3.5 px-5">Campaign Name</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Target Size</th>
                <th className="py-3.5 px-5">Messages Sent</th>
                <th className="py-3.5 px-5">Delivery Success</th>
                <th className="py-3.5 px-5">Scheduled/Date</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {campaignsList.map((cmp) => {
                const deliveryRate = cmp.sentCount > 0 ? Math.round((cmp.deliveredCount / cmp.sentCount) * 100) : 0;
                const formattedDate = cmp.scheduledAt
                  ? new Date(cmp.scheduledAt).toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })
                  : cmp.createdAt
                  ? new Date(cmp.createdAt).toLocaleDateString()
                  : "N/A";

                return (
                  <tr 
                    key={cmp._id}
                    onClick={() => setSelectedCampaignId(cmp._id)}
                    className={cn(
                      "hover:bg-muted/10 dark:hover:bg-accent/10 transition-colors cursor-pointer",
                      selectedCampaignId === cmp._id && "bg-muted/20 dark:bg-accent/20"
                    )}
                  >
                    <td className="py-4 px-5 font-semibold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-100/30 dark:border-blue-800/10 flex items-center justify-center font-bold text-xs">
                          {cmp.name.split(" ").map(n => n[0]?.toUpperCase() || "").slice(0, 2).join("") || "C"}
                        </div>
                        <div>
                          <span>{cmp.name}</span>
                          {cmp.description && (
                            <span className="block text-[10px] text-muted-foreground font-normal truncate max-w-xs">
                              {cmp.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <Badge variant={getStatusBadgeVariant(cmp.status)}>
                        {cmp.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-5 text-muted-foreground font-semibold">
                      {(cmp.totalRecipients || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-5 text-muted-foreground font-mono">
                      {(cmp.sentCount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-5">
                      {cmp.status === "SCHEDULED" || cmp.status === "DRAFT" ? (
                        <span className="text-muted-foreground">--</span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">{deliveryRate}%</span>
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden shrink-0 hidden sm:block">
                            <div className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full" style={{ width: `${deliveryRate}%` }} />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-5 text-muted-foreground">{formattedDate}</td>
                    <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted dark:hover:bg-accent rounded-lg cursor-pointer">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-44" align="end">
                          <DropdownMenuItem onClick={() => setSelectedCampaignId(cmp._id)} className="cursor-pointer">
                            <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" /> View Details
                          </DropdownMenuItem>
                          {(cmp.status === "DRAFT" || cmp.status === "SCHEDULED") && (
                            <DropdownMenuItem onClick={() => setCampaignToSend(cmp)} className="cursor-pointer text-emerald-600 dark:text-emerald-400">
                              <Send className="mr-2 h-3.5 w-3.5" /> Send Broadcast
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setCampaignToDelete(cmp)}
                            className="text-red-600 dark:text-red-400 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/20 dark:focus:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {pagination.total > 0 && (
        <div className="p-4 border-t border-border/60 flex items-center justify-between gap-4 bg-muted/5 dark:bg-zinc-900/5 text-xs">
          <span className="text-[11px] sm:text-xs text-muted-foreground">
            Showing <strong className="font-semibold text-foreground">{(pagination.page - 1) * pagination.limit + 1}</strong> to{" "}
            <strong className="font-semibold text-foreground">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </strong>{" "}
            of <strong className="font-semibold text-foreground">{pagination.total}</strong> campaigns
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

      {/* Create Modal Mount */}
      <CreateCampaignModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
      />

      {/* Details Slide-out Drawer */}
      <CampaignDetailsDrawer 
        campaignId={selectedCampaignId} 
        onClose={() => setSelectedCampaignId(null)} 
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={!!campaignToDelete} onOpenChange={(open) => { if (!open) setCampaignToDelete(null); }}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Delete Campaign
            </DialogTitle>
            <DialogDescription className="pt-2 text-xs leading-relaxed">
              Are you sure you want to delete campaign <strong className="text-foreground">{campaignToDelete?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2.5 pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCampaignToDelete(null)}
              className="rounded-lg text-xs font-semibold cursor-pointer border-border/80"
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={confirmDeleteCampaign}
              disabled={deleteCampaignMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            >
              {deleteCampaignMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Delete Campaign
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Confirmation Modal */}
      <Dialog open={!!campaignToSend} onOpenChange={(open) => { if (!open) setCampaignToSend(null); }}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <Send className="h-5 w-5" /> Send Campaign Broadcast
            </DialogTitle>
            <DialogDescription className="pt-2 text-xs leading-relaxed">
              Are you sure you want to send campaign <strong className="text-foreground">{campaignToSend?.name}</strong> to <strong className="text-foreground">{campaignToSend?.totalRecipients}</strong> recipient contacts now?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2.5 pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCampaignToSend(null)}
              className="rounded-lg text-xs font-semibold cursor-pointer border-border/80"
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={confirmSendCampaign}
              disabled={sendCampaignMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            >
              {sendCampaignMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {sendCampaignMutation.isPending ? "Sending Broadcast..." : "Send Now"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
