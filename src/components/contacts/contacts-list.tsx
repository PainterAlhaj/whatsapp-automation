"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  MoreVertical,
  Eye,
  Send,
  Trash2,
  MessageSquare,
  Calendar,
  Phone,
  CheckCircle2,
  AlertCircle,
  Tag,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  ArrowRight,
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
  DialogDescription
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent
} from "@/components/ui/sheet";
import { groupsList } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/shared/loading-state";
import {
  useContacts,
  useContact,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
} from "@/hooks/use-contacts";
import { Contact, GetContactsQueryParams } from "@/types/contact.types";
import { getAllCountries, validatePhoneForCountry } from "@/lib/phone-utils";
import type { CountryCode } from "libphonenumber-js";

const ITEMS_PER_PAGE = 8;

export function ContactsList() {
  const router = useRouter();

  // Search & Filter Local State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedGroup, setSelectedGroup] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [sortCriteria, setSortCriteria] = React.useState<string>("name-asc");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Delete Confirmation Modal State
  const [contactToDelete, setContactToDelete] = React.useState<Contact | null>(null);

  // Debounce search query input (300ms)
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Construct Query Params for API
  const queryParams: GetContactsQueryParams = React.useMemo(() => {
    let sortField: GetContactsQueryParams["sort"] = "firstName";
    let sortOrder: GetContactsQueryParams["order"] = "asc";

    if (sortCriteria === "name-desc") {
      sortField = "firstName";
      sortOrder = "desc";
    } else if (sortCriteria === "created-desc") {
      sortField = "createdAt";
      sortOrder = "desc";
    } else if (sortCriteria === "created-asc") {
      sortField = "createdAt";
      sortOrder = "asc";
    }

    return {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: debouncedSearch.trim() || undefined,
      status: selectedStatus === "all" ? undefined : (selectedStatus as "active" | "blocked" | "unsubscribed"),
      sort: sortField,
      order: sortOrder,
    };
  }, [currentPage, debouncedSearch, selectedStatus, sortCriteria]);

  // React Query Hook for Data Fetching
  const { data: contactsResponse, isLoading, isError, error, isFetching } = useContacts(queryParams);

  const contactsList = contactsResponse?.contacts || [];
  const pagination = contactsResponse?.pagination || {
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 1,
  };

  // Dynamically derive unique Groups / Tags from fetched database contacts + defaults
  const dynamicGroupsList = React.useMemo(() => {
    const set = new Set<string>(groupsList);
    contactsList.forEach((c) => {
      c.groups?.forEach((g) => { if (g) set.add(g); });
      c.tags?.forEach((t) => { if (t) set.add(t); });
    });
    return Array.from(set);
  }, [contactsList]);

  // React Query Mutations
  const createContactMutation = useCreateContact();
  const updateContactMutation = useUpdateContact();
  const deleteContactMutation = useDeleteContact();

  // Drawer / Modal State
  const [selectedContactId, setSelectedContactId] = React.useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // Fetch detailed contact when drawer opens
  const { data: contactDetails } = useContact(selectedContactId);
  const selectedContact = contactsList.find((c) => c._id === selectedContactId) || contactDetails;

  // Add Contact Form State
  const countries = React.useMemo(() => getAllCountries(), []);
  const [newContactFirstName, setNewContactFirstName] = React.useState("");
  const [newContactLastName, setNewContactLastName] = React.useState("");
  const [newContactCountry, setNewContactCountry] = React.useState<CountryCode>("IN");
  const [newContactPhone, setNewContactPhone] = React.useState("");
  const [newContactGroup, setNewContactGroup] = React.useState(groupsList[0]);
  const [newContactNotes, setNewContactNotes] = React.useState("");
  const [formError, setFormError] = React.useState("");

  const selectedCountryObj = React.useMemo(() => {
    return (
      countries.find((c) => c.code === newContactCountry) ||
      countries.find((c) => c.code === "IN") ||
      countries[0]
    );
  }, [countries, newContactCountry]);

  const isPhoneValid = React.useMemo(() => {
    if (!newContactPhone.trim()) return null;
    return validatePhoneForCountry(newContactPhone, newContactCountry);
  }, [newContactPhone, newContactCountry]);

  // Edit Notes inside Drawer State
  const [drawerNotes, setDrawerNotes] = React.useState("");
  const [isNotesSaved, setIsNotesSaved] = React.useState(false);

  // Synchronize drawer notes when active contact changes
  React.useEffect(() => {
    if (selectedContact) {
      setDrawerNotes(selectedContact.notes || "");
      setIsNotesSaved(false);
    }
  }, [selectedContactId, selectedContact]);

  // Save notes handler with optimistic update
  const handleSaveNotes = async () => {
    if (!selectedContactId) return;
    try {
      await updateContactMutation.mutateAsync({
        id: selectedContactId,
        payload: { notes: drawerNotes },
      });
      setIsNotesSaved(true);
      setTimeout(() => setIsNotesSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save notes:", err);
    }
  };

  // Add Contact submit handler
  const handleAddContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newContactFirstName.trim()) {
      setFormError("First name is required.");
      return;
    }
    const cleanPhoneDigits = newContactPhone.replace(/\D/g, "");
    if (!cleanPhoneDigits) {
      setFormError("Phone number is required.");
      return;
    }

    // Country-wise validation using libphonenumber-js
    const isValid = validatePhoneForCountry(newContactPhone, newContactCountry);
    if (!isValid) {
      setFormError(
        `Invalid phone number format for ${selectedCountryObj?.name || newContactCountry} (${selectedCountryObj?.callingCode}).`
      );
      return;
    }

    try {
      await createContactMutation.mutateAsync({
        firstName: newContactFirstName.trim(),
        lastName: newContactLastName.trim() || undefined,
        phoneNumber: cleanPhoneDigits,
        countryCode: selectedCountryObj?.callingCode || "+91",
        tags: [newContactGroup],
        notes: newContactNotes.trim() || undefined,
        status: "active",
        source: "manual",
      });

      setIsAddModalOpen(false);
      setNewContactFirstName("");
      setNewContactLastName("");
      setNewContactPhone("");
      setNewContactCountry("IN");
      setNewContactGroup(groupsList[0]);
      setNewContactNotes("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create contact.");
    }
  };

  // Navigate to Live Chat for selected contact
  const handleSendMessageToContact = (contact: Contact) => {
    const contactId = contact._id || "";
    const phone = contact.phoneNumber || "";
    const query = phone || contact.firstName || "";
    router.push(`/chat?contactId=${encodeURIComponent(contactId)}&phone=${encodeURIComponent(phone)}&search=${encodeURIComponent(query)}`);
  };

  // Confirm and Delete Contact handler
  const handleConfirmDeleteContact = async () => {
    if (!contactToDelete?._id) return;
    try {
      await deleteContactMutation.mutateAsync(contactToDelete._id);
      if (selectedContactId === contactToDelete._id) {
        setSelectedContactId(null);
      }
      setContactToDelete(null);
    } catch (err) {
      console.error("Failed to delete contact:", err);
    }
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedGroup("all");
    setSelectedStatus("all");
    setSortCriteria("name-asc");
    setCurrentPage(1);
  };

  // Filter local group client-side if selected group isn't supported server-side directly
  const filteredContacts = React.useMemo(() => {
    if (selectedGroup === "all") return contactsList;
    return contactsList.filter(
      (c) =>
        c.groups?.includes(selectedGroup) ||
        c.tags?.includes(selectedGroup)
    );
  }, [contactsList, selectedGroup]);

  // Expose Trigger for Parent Header Button
  React.useEffect(() => {
    const handleOpenAddContactModal = () => setIsAddModalOpen(true);
    window.addEventListener("open-add-contact", handleOpenAddContactModal);
    return () => window.removeEventListener("open-add-contact", handleOpenAddContactModal);
  }, []);

  return (
    <Card className="border-border/80 shadow-xs relative">
      {/* Top Search & Filter Bar */}
      <div className="p-5 border-b border-border/60 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-muted/10 dark:bg-zinc-900/10">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contacts or phones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 h-9 bg-background border border-border/80 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/80 transition-all"
            />
            {isFetching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground animate-spin" />
            )}
          </div>

          {/* Group Filter */}
          <div className="relative">
            <select
              value={selectedGroup}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-44 pl-3 pr-8 h-9 bg-background border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 appearance-none cursor-pointer font-medium"
            >
              <option value="all">All Groups</option>
              {dynamicGroupsList.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
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
              className="w-full sm:w-36 pl-3 pr-8 h-9 bg-background border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 appearance-none cursor-pointer font-medium"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Sort Options */}
        <div className="relative">
          <select
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            className="w-full sm:w-40 pl-3 pr-8 h-9 bg-background border border-border/80 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/80 appearance-none cursor-pointer font-medium"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="created-desc">Newest Created</option>
            <option value="created-asc">Oldest Created</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Error Alert State */}
      {isError && (
        <div className="p-4 m-5 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs flex items-center justify-between border border-red-200/30 dark:border-red-800/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error instanceof Error ? error.message : "Failed to load contacts from server."}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => window.location.reload()} className="h-7 text-[11px]">
            Retry
          </Button>
        </div>
      )}

      {/* Main Table Layout */}
      <div className="overflow-x-auto min-h-[300px]">
        {isLoading ? (
          <div className="p-6">
            <LoadingState rows={8} />
          </div>
        ) : filteredContacts.length === 0 ? (
          /* Empty State */
          <div className="py-20 px-4 flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-muted/40 border border-border/60 mb-4 text-muted-foreground">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">No contacts found</h3>
            <p className="text-xs text-muted-foreground max-w-xs mb-6">
              {"We couldn't find any contact records matching your search terms or filters."}
            </p>
            <Button size="sm" onClick={handleClearFilters} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer">
              Reset Filters
            </Button>
          </div>
        ) : (
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50 text-[11px] font-bold text-muted-foreground uppercase bg-muted/5 tracking-wider">
                <th className="py-3 px-5">Name</th>
                <th className="py-3 px-5">Phone Number</th>
                <th className="py-3 px-5">Segment Group</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Last Activity</th>
                <th className="py-3 px-5">Created Date</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {filteredContacts.map((contact) => {
                const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Unnamed Contact";
                const initials = fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "C";
                const groupBadge = contact.groups?.[0] || contact.tags?.[0] || "General";
                const phoneDisplay = contact.countryCode ? `${contact.countryCode} ${contact.phoneNumber}` : contact.phoneNumber;
                const formattedCreated = contact.createdAt ? new Date(contact.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "N/A";
                const formattedLastActivity = contact.lastMessageAt ? new Date(contact.lastMessageAt).toLocaleDateString("en-US", { month: "short", day: "2-digit" }) : "No recent activity";

                return (
                  <tr
                    key={contact._id}
                    className={cn(
                      "hover:bg-muted/10 dark:hover:bg-accent/10 transition-colors cursor-pointer",
                      selectedContactId === contact._id && "bg-muted/20 dark:bg-accent/20"
                    )}
                    onClick={() => setSelectedContactId(contact._id)}
                  >
                    <td className="py-3.5 px-5 font-semibold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/30 dark:border-emerald-800/10 flex items-center justify-center font-bold text-xs shrink-0">
                          {initials}
                        </div>
                        <span>{fullName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-muted-foreground font-mono">{phoneDisplay}</td>
                    <td className="py-3.5 px-5">
                      <Badge variant="outline" className="border-border/80 text-[10px] font-medium bg-muted/20 text-foreground">
                        {groupBadge}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-5">
                      <Badge variant={contact.status === "active" ? "success" : "secondary"}>
                        {contact.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-5 text-muted-foreground">{formattedLastActivity}</td>
                    <td className="py-3.5 px-5 text-muted-foreground">{formattedCreated}</td>
                    <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted dark:hover:bg-accent rounded-lg cursor-pointer">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40" align="end">
                          <DropdownMenuItem onClick={() => setSelectedContactId(contact._id)} className="cursor-pointer">
                            <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendMessageToContact(contact)} className="cursor-pointer">
                            <Send className="mr-2 h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 font-semibold" /> Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setContactToDelete(contact)}
                            className="text-red-600 dark:text-red-400 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/20 dark:focus:text-red-400 cursor-pointer font-medium"
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
        <div className="p-4 border-t border-border/60 flex items-center justify-between gap-4 bg-muted/5 dark:bg-zinc-900/5">
          <span className="text-[11px] sm:text-xs text-muted-foreground">
            Showing <strong className="font-semibold text-foreground">{(pagination.page - 1) * pagination.limit + 1}</strong> to{" "}
            <strong className="font-semibold text-foreground">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </strong>{" "}
            of <strong className="font-semibold text-foreground">{pagination.total}</strong> contacts
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

      {/* Add Contact Dialog Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>Enter connection details below.</DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="mb-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5 border border-red-200/30 dark:border-red-800/20 text-left animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleAddContactSubmit} className="space-y-4 text-left">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground block">First Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alice"
                  value={newContactFirstName}
                  onChange={(e) => setNewContactFirstName(e.target.value)}
                  className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground block">Last Name</label>
                <input
                  type="text"
                  placeholder="e.g. Smith"
                  value={newContactLastName}
                  onChange={(e) => setNewContactLastName(e.target.value)}
                  className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                WhatsApp Phone Number
              </label>
              <div className="grid grid-cols-12 gap-2 items-center">
                {/* Field 1: Country Code Dropdown */}
                <div className="col-span-5 relative">
                  <select
                    value={newContactCountry}
                    onChange={(e) => setNewContactCountry(e.target.value as CountryCode)}
                    className="w-full rounded-lg border border-border/80 bg-background pl-2.5 pr-7 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer font-medium truncate"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.callingCode})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                </div>

                {/* Field 2: Mobile Number Input */}
                <div className="col-span-7 relative flex items-center">
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={newContactPhone}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/[^\d\s-]/g, "");
                      setNewContactPhone(sanitized);
                    }}
                    className={cn(
                      "w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 font-mono pr-8 transition-colors",
                      isPhoneValid === true && "border-emerald-500/80 focus:ring-emerald-500/80",
                      isPhoneValid === false && "border-red-500/80 focus:ring-red-500/80"
                    )}
                  />
                  {isPhoneValid === true && (
                    <CheckCircle2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 pointer-events-none" />
                  )}
                  {isPhoneValid === false && (
                    <AlertCircle className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500 shrink-0 pointer-events-none" />
                  )}
                </div>
              </div>

              {/* Country & Validation Helper */}
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <span className="text-muted-foreground">
                  Country: <strong className="font-semibold text-foreground">{selectedCountryObj.name}</strong> ({selectedCountryObj.callingCode})
                </span>
                {isPhoneValid === true && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    Valid number
                  </span>
                )}
                {isPhoneValid === false && (
                  <span className="text-red-500 font-medium">
                    Invalid for {selectedCountryObj.name}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground block">Segment Group</label>
              <div className="relative">
                <select
                  value={newContactGroup}
                  onChange={(e) => setNewContactGroup(e.target.value)}
                  className="w-full rounded-lg border border-border/80 bg-background pl-3 pr-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
                >
                  {dynamicGroupsList.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground block">Notes (Optional)</label>
              <textarea
                placeholder="e.g. Needs pricing tier follow up."
                rows={3}
                value={newContactNotes}
                onChange={(e) => setNewContactNotes(e.target.value)}
                className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-normal"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)} className="rounded-lg text-xs font-semibold cursor-pointer border-border/80">
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={createContactMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer border border-transparent flex items-center gap-1.5"
              >
                {createContactMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Save Contact
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!contactToDelete} onOpenChange={(open) => !open && setContactToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Delete Contact
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {contactToDelete?.firstName} {contactToDelete?.lastName}
              </strong>{" "}
              ({contactToDelete?.phoneNumber})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2.5 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setContactToDelete(null)}
              className="rounded-lg text-xs font-semibold cursor-pointer border-border/80"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={deleteContactMutation.isPending}
              onClick={handleConfirmDeleteContact}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
            >
              {deleteContactMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Delete Contact
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Details Sheet Drawer slide-out */}
      <Sheet open={!!selectedContact} onOpenChange={(open) => { if (!open) setSelectedContactId(null); }}>
        <SheetContent side="right" className="sm:max-w-md p-5 flex flex-col justify-between overflow-y-auto" showCloseButton={true}>
          {selectedContact && (
            <div className="flex flex-col h-full justify-between">
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-5">
                  <div className="flex items-center gap-3 text-left">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100/30 dark:border-emerald-800/10 flex items-center justify-center font-bold text-sm">
                      {`${selectedContact.firstName?.[0] || ""}${selectedContact.lastName?.[0] || ""}`.toUpperCase() || "C"}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground leading-snug">
                        {`${selectedContact.firstName || ""} ${selectedContact.lastName || ""}`.trim()}
                      </h3>
                      <Badge variant={selectedContact.status === "active" ? "success" : "secondary"} className="mt-1">
                        {selectedContact.status}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleSendMessageToContact(selectedContact)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold gap-1.5 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" /> Chat
                  </Button>
                </div>

                {/* Details Info Fields */}
                <div className="space-y-4 text-left border-b border-border/60 pb-5 mb-5">
                  <div className="flex items-center gap-3 text-xs">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground min-w-24">WhatsApp:</span>
                    <span className="font-mono text-foreground font-semibold">
                      {selectedContact.countryCode ? `${selectedContact.countryCode} ` : ""}{selectedContact.phoneNumber}
                    </span>
                  </div>
                  {selectedContact.email && (
                    <div className="flex items-center gap-3 text-xs">
                      <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground min-w-24">Email:</span>
                      <span className="text-foreground font-medium">{selectedContact.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs">
                    <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground min-w-24">Segment / Tags:</span>
                    <Badge variant="outline" className="border-border/80 font-medium text-foreground">
                      {selectedContact.tags?.join(", ") || selectedContact.groups?.join(", ") || "General"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground min-w-24">Created Date:</span>
                    <span className="text-foreground font-semibold">
                      {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground min-w-24">Source:</span>
                    <span className="text-foreground font-semibold uppercase">{selectedContact.source || "manual"}</span>
                  </div>
                </div>

                {/* Notes Section with Editable Panel */}
                <div className="text-left border-b border-border/60 pb-5 mb-5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-foreground">Interaction Notes</span>
                    {isNotesSaved && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="h-3 w-3" /> Saved
                      </span>
                    )}
                  </div>
                  <textarea
                    value={drawerNotes}
                    onChange={(e) => setDrawerNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-normal"
                    placeholder="Enter comments about this client..."
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={updateContactMutation.isPending}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer border border-transparent py-1.5 flex items-center justify-center gap-1.5"
                  >
                    {updateContactMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                    Update Notes
                  </Button>
                </div>

                {/* Activity History Logs */}
                <div className="text-left space-y-3">
                  <span className="text-xs font-bold text-foreground block">Event History</span>
                  <div className="relative border-l border-border pl-4 ml-2.5 space-y-4 pt-1">
                    <div className="relative">
                      <div className="absolute -left-[22px] top-0.5 p-1 rounded-full bg-background border border-border text-muted-foreground">
                        <Shield className="h-2.5 w-2.5 text-emerald-600" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-foreground block">
                          Contact created via {selectedContact.source || "manual"}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString() : "Recently"}
                        </span>
                      </div>
                    </div>
                    {selectedContact.lastMessageAt && (
                      <div className="relative">
                        <div className="absolute -left-[22px] top-0.5 p-1 rounded-full bg-background border border-border text-muted-foreground">
                          <MessageSquare className="h-2.5 w-2.5 text-blue-500" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-bold text-foreground block">Last message activity</span>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {new Date(selectedContact.lastMessageAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer footer actions */}
              <div className="mt-8 pt-4 border-t border-border/60 flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setContactToDelete(selectedContact)}
                  className="flex-1 rounded-lg text-xs font-semibold cursor-pointer border-red-200 text-red-600 dark:border-red-900 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedContactId(null)}
                  className="flex-1 rounded-lg text-xs font-semibold cursor-pointer border-border/80"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </Card>
  );
}
