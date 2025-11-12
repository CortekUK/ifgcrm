"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, ChevronLeft, ChevronRight } from "lucide-react"

interface Payment {
  id: string
  player: string
  programme: string
  amount: number
  method: "Stripe" | "Bank" | "Manual"
  status: "Successful" | "Pending" | "Failed"
  date: string
}

const mockPayments: Payment[] = [
  {
    id: "PAY-1024",
    player: "Daniel Perez",
    programme: "UK Academy",
    amount: 1200,
    method: "Stripe",
    status: "Successful",
    date: "11 Nov 2025",
  },
  {
    id: "PAY-1025",
    player: "Marcus Silva",
    programme: "Spain Academy",
    amount: 950,
    method: "Bank",
    status: "Pending",
    date: "10 Nov 2025",
  },
  {
    id: "PAY-1026",
    player: "Emma Rodriguez",
    programme: "USA Academy",
    amount: 1100,
    method: "Stripe",
    status: "Successful",
    date: "09 Nov 2025",
  },
  {
    id: "PAY-1027",
    player: "Luis Martinez",
    programme: "Brazil Academy",
    amount: 800,
    method: "Manual",
    status: "Failed",
    date: "08 Nov 2025",
  },
  {
    id: "PAY-1028",
    player: "Sophie Chen",
    programme: "UK Academy",
    amount: 1350,
    method: "Stripe",
    status: "Successful",
    date: "07 Nov 2025",
  },
  {
    id: "PAY-1029",
    player: "Alex Thompson",
    programme: "USA Academy",
    amount: 1450,
    method: "Bank",
    status: "Successful",
    date: "06 Nov 2025",
  },
]

export function PaymentsTable() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.player.toLowerCase().includes(search.toLowerCase()) ||
      payment.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  const totalPages = Math.ceil(filteredPayments.length / pageSize)
  const paginatedPayments = filteredPayments.slice((page - 1) * pageSize, page * pageSize)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount)
  }

  const getStatusBadge = (status: Payment["status"]) => {
    const configs: Record<Payment["status"], { className: string }> = {
      Successful: { className: "bg-green-500 text-white hover:bg-green-600" },
      Pending: { className: "bg-yellow-500 text-white hover:bg-yellow-600" },
      Failed: { className: "bg-red-500 text-white hover:bg-red-600" },
    }
    return <Badge className={configs[status].className}>{status}</Badge>
  }

  const getMethodBadge = (method: Payment["method"]) => {
    const configs: Record<Payment["method"], { className: string }> = {
      Stripe: { className: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
      Bank: { className: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
      Manual: { className: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
    }
    return (
      <Badge variant="outline" className={configs[method].className}>
        {method}
      </Badge>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-[150px] bg-white transition-colors hover:border-blue-500">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Successful">Successful</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="h-11 w-[150px] bg-white transition-colors hover:border-blue-500">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="Stripe">Stripe</SelectItem>
              <SelectItem value="Bank">Bank</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Search by player or payment ID..."
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
              <TableHead className="font-semibold text-gray-700">Payment ID</TableHead>
              <TableHead className="font-semibold text-gray-700">Player</TableHead>
              <TableHead className="font-semibold text-gray-700">Programme</TableHead>
              <TableHead className="text-right font-semibold text-gray-700">Amount</TableHead>
              <TableHead className="font-semibold text-gray-700">Method</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700">Date Received</TableHead>
              <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-gray-500">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              paginatedPayments.map((payment, index) => (
                <TableRow
                  key={payment.id}
                  className={`group cursor-pointer transition-all duration-200 ${
                    payment.status === "Failed"
                      ? "bg-[#fef2f2] hover:bg-red-50"
                      : index % 2 === 0
                        ? "bg-white hover:bg-blue-50/50"
                        : "bg-[#f9fafb] hover:bg-blue-50/50"
                  }`}
                >
                  <TableCell className="font-medium text-gray-900">{payment.id}</TableCell>
                  <TableCell className="text-gray-700">{payment.player}</TableCell>
                  <TableCell className="text-gray-700">{payment.programme}</TableCell>
                  <TableCell className="text-right font-bold text-gray-900">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{getMethodBadge(payment.method)}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-gray-700">{payment.date}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-blue-600 transition-all hover:bg-blue-50 hover:text-blue-700 hover:underline"
                      onClick={() => (window.location.href = `/payments/${payment.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
        <div className="text-sm text-gray-500">
          Showing {paginatedPayments.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(page * pageSize, filteredPayments.length)} of {filteredPayments.length} payments
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
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
  )
}
