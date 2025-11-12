"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { InvoiceDrawer } from "./invoice-drawer"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Invoice {
  id: number
  invoice_number: string
  player_name: string
  programme: string
  amount: number
  currency: string
  status: "draft" | "sent" | "paid" | "overdue"
  due_date: string
  payment_url?: string
}

interface Programme {
  id: number
  name: string
}

export function InvoicesTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Filters
  const [status, setStatus] = useState("all")
  const [programme, setProgramme] = useState("all")
  const [search, setSearch] = useState("")
  const [dateRange, setDateRange] = useState("this_month")

  // Pagination
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pageSize] = useState(25)

  useEffect(() => {
    fetchProgrammes()
  }, [])

  useEffect(() => {
    fetchInvoices()
  }, [status, programme, search, dateRange, page])

  const fetchProgrammes = async () => {
    try {
      const response = await fetch("/api/settings/programmes")
      const data = await response.json()
      setProgrammes(data.data || [])
    } catch (error) {
      console.error("Failed to fetch programmes:", error)
    }
  }

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      })
      if (status !== "all") params.append("status", status)
      if (programme !== "all") params.append("programme", programme)
      if (search) params.append("search", search)
      if (dateRange !== "all") params.append("dateRange", dateRange)

      const response = await fetch(`/api/invoices?${params}`)
      const data = await response.json()
      setInvoices(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error("Failed to fetch invoices:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRowClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setDrawerOpen(true)
  }

  const handleInvoiceUpdate = () => {
    fetchInvoices()
  }

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { className: string; label: string }> = {
      paid: { className: "bg-green-500 text-white hover:bg-green-600 transition-colors", label: "Paid" },
      sent: { className: "bg-blue-500 text-white hover:bg-blue-600 transition-colors", label: "Sent" },
      overdue: {
        className: "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.3)] transition-all",
        label: "Overdue",
      },
      draft: { className: "bg-gray-400 text-white hover:bg-gray-500 transition-colors", label: "Draft" },
    }

    const config = configs[status] || configs.draft
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const totalOutstanding = invoices.filter((inv) => inv.status !== "paid").reduce((sum, inv) => sum + inv.amount, 0)

  const totalPages = Math.ceil(total / pageSize)

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Filter Bar */}
        <div className="border border-gray-200 bg-gray-50/50 p-4">
          <div className="flex flex-wrap gap-3">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11 w-[150px] bg-white transition-colors hover:border-blue-500">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={programme} onValueChange={setProgramme}>
              <SelectTrigger className="h-11 w-[180px] bg-white transition-colors hover:border-blue-500">
                <SelectValue placeholder="Programme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programmes</SelectItem>
                {programmes.map((prog) => (
                  <SelectItem key={prog.id} value={prog.name}>
                    {prog.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="h-11 w-[160px] bg-white transition-colors hover:border-blue-500">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="last_month">Last Month</SelectItem>
                <SelectItem value="this_quarter">This Quarter</SelectItem>
                <SelectItem value="this_year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Search player name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 max-w-xs flex-1 bg-white transition-colors hover:border-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Invoice #</TableHead>
                <TableHead className="font-semibold text-gray-700">Player</TableHead>
                <TableHead className="font-semibold text-gray-700">Programme</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Amount</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Due Date</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                    Loading invoices...
                  </TableCell>
                </TableRow>
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice, index) => (
                  <TableRow
                    key={invoice.id}
                    className={`group cursor-pointer transition-all duration-200 ${
                      invoice.status === "overdue"
                        ? "bg-[#fef2f2] hover:bg-red-50"
                        : index % 2 === 0
                          ? "bg-white hover:bg-blue-50/50"
                          : "bg-[#f9fafb] hover:bg-blue-50/50"
                    }`}
                    onClick={() => handleRowClick(invoice)}
                  >
                    <TableCell className="font-medium text-gray-900">{invoice.invoice_number}</TableCell>
                    <TableCell className="text-gray-700">{invoice.player_name}</TableCell>
                    <TableCell className="text-gray-700">{invoice.programme}</TableCell>
                    <TableCell className="text-right font-bold text-gray-900">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-gray-700">{formatDate(invoice.due_date)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 transition-all hover:bg-blue-50 hover:text-blue-700 hover:underline group-hover:gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(invoice)
                        }}
                      >
                        <span className="opacity-0 transition-opacity group-hover:opacity-100">👁️</span>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer with Total Outstanding */}
        {invoices.length > 0 && (
          <div className="border-t-2 border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Total Outstanding</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(totalOutstanding, invoices[0]?.currency || "GBP")}
              </span>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
          <div className="text-sm text-gray-500">
            Showing {invoices.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, total)} of{" "}
            {total} invoices
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {selectedInvoice && (
        <InvoiceDrawer
          invoice={selectedInvoice}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onUpdate={handleInvoiceUpdate}
        />
      )}
    </>
  )
}
