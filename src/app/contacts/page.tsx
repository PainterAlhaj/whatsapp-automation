"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { UserPlus, Upload, Download, Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { ContactsStats } from "@/components/contacts/contacts-stats";
import { ContactsList } from "@/components/contacts/contacts-list";
import { useImportContacts, useExportContacts } from "@/hooks/use-contacts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ImportResultData } from "@/types/contact.types";

export default function ContactsPage() {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [importResult, setImportResult] = React.useState<ImportResultData | null>(null);
  const [importError, setImportError] = React.useState("");

  const importMutation = useImportContacts();
  const exportMutation = useExportContacts();

  const triggerAddContact = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-add-contact"));
    }
  };

  const handleOpenImportModal = () => {
    setSelectedFile(null);
    setImportResult(null);
    setImportError("");
    setIsImportModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
        setImportError("Only CSV files are allowed.");
        return;
      }
      setSelectedFile(file);
      setImportError("");
    }
  };

  const handleExecuteImport = async () => {
    if (!selectedFile) {
      setImportError("Please select a valid CSV file.");
      return;
    }

    try {
      setImportError("");
      const response = await importMutation.mutateAsync(selectedFile);
      setImportResult(response.data);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Failed to import contacts.");
    }
  };

  const handleExportCSV = async () => {
    try {
      await exportMutation.mutateAsync();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to export contacts.");
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Contacts"
        description="Manage your audiences, import contacts, segment lists, and view custom properties."
      >
        <Button
          variant="outline"
          disabled={exportMutation.isPending}
          onClick={handleExportCSV}
          className="gap-1.5 rounded-lg text-xs md:text-sm font-semibold cursor-pointer border-border/80"
        >
          {exportMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export CSV
        </Button>

        <Button
          variant="outline"
          onClick={handleOpenImportModal}
          className="gap-1.5 rounded-lg text-xs md:text-sm font-semibold cursor-pointer border-border/80"
        >
          <Upload className="h-4 w-4" /> Import CSV
        </Button>

        <Button
          onClick={triggerAddContact}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 rounded-lg text-xs md:text-sm font-semibold cursor-pointer border border-transparent"
        >
          <UserPlus className="h-4 w-4" /> Add Contact
        </Button>
      </PageHeader>
      
      <div className="space-y-6">
        {/* Contact Statistics cards */}
        <ContactsStats />

        {/* Core Interactive Contacts list directory */}
        <ContactsList />
      </div>

      {/* CSV Import Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Contacts via CSV</DialogTitle>
            <DialogDescription>
              Upload a `.csv` file containing firstName, phoneNumber, email, tags, and notes columns.
            </DialogDescription>
          </DialogHeader>

          {importError && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5 border border-red-200/30 dark:border-red-800/20">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{importError}</span>
            </div>
          )}

          {importResult ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/40 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2 font-bold text-sm mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Import Complete
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Total Rows: <strong>{importResult.totalRows}</strong></div>
                  <div>Imported: <strong className="text-emerald-600 dark:text-emerald-400">{importResult.imported}</strong></div>
                  <div>Duplicates Skipped: <strong>{importResult.duplicates}</strong></div>
                  <div>Failed: <strong className="text-red-500">{importResult.failed}</strong></div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => setIsImportModalOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border/80 hover:border-emerald-500/80 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-muted/5 hover:bg-muted/15"
              >
                <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-xs font-semibold text-foreground">
                  {selectedFile ? selectedFile.name : "Click to select a CSV file"}
                </span>
                <span className="text-[11px] text-muted-foreground mt-1">Max size: 5MB</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsImportModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={!selectedFile || importMutation.isPending}
                  onClick={handleExecuteImport}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                >
                  {importMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Upload & Import
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
