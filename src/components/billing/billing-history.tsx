"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { invoicesData } from "@/lib/mock-data"

const ITEMS_PER_PAGE = 3

export function BillingHistory() {
  const [currentPage, setCurrentPage] = React.useState(1)

  const totalPages = Math.ceil(invoicesData.length / ITEMS_PER_PAGE)
  const paginatedInvoices = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return invoicesData.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage])

  const handleDownloadInvoice = (id: string) => {
    alert(`Downloading invoice receipt document: ${id}.pdf. Mock file download sequence completed.`)
  }

  return (
    <Card className="border-border/80 shadow-xs text-left overflow-hidden font-sans">
      <div className="p-5 border-b border-border/50 bg-muted/5 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-foreground">Invoices & Billing History</h3>
          <span className="text-[10px] text-muted-foreground block mt-0.5">
            View receipts and invoice records issued to your account.
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border/50 text-[10px] font-bold text-muted-foreground uppercase bg-muted/10 tracking-wider">
              <th className="py-3 px-5">Invoice ID</th>
              <th className="py-3 px-5">Billing Date</th>
              <th className="py-3 px-5 text-center">Amount</th>
              <th className="py-3 px-5 text-center">Status</th>
              <th className="py-3 px-5 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {paginatedInvoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground italic">
                  No billing history logs found.
                </td>
              </tr>
            ) : (
              paginatedInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-muted/10 dark:hover:bg-accent/10 transition-colors">
                  <td className="py-3 px-5 font-semibold text-foreground flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    {invoice.id}
                  </td>
                  <td className="py-3 px-5 text-muted-foreground">{invoice.date}</td>
                  <td className="py-3 px-5 text-center font-semibold text-foreground font-mono">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-5 text-center">
                    <Badge 
                      variant={invoice.status === "paid" ? "success" : "secondary"}
                      className="text-[9px] font-semibold uppercase"
                    >
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      className="h-7 px-2 rounded-lg text-xs font-semibold cursor-pointer text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                    >
                      <Download className="h-3 w-3 mr-1" /> PDF
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {invoicesData.length > 0 && (
        <div className="flex items-center justify-between p-4 border-t border-border/40 text-xs">
          <span className="text-muted-foreground">
            Showing <strong className="font-semibold text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{" "}
            <strong className="font-semibold text-foreground">
              {Math.min(currentPage * ITEMS_PER_PAGE, invoicesData.length)}
            </strong>{" "}
            of <strong className="font-semibold text-foreground">{invoicesData.length}</strong> invoices
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="h-8 px-2.5 rounded-lg border-border/80 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-0.5" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="h-8 px-2.5 rounded-lg border-border/80 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              Next <ChevronRight className="h-4 w-4 ml-0.5" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
