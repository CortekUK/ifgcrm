"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Invoice {
  id: number
  invoice_number: string
  description: string
  amount: number
  currency: string
  status: "paid" | "unpaid" | "overdue"
  due_date: string
  payment_url: string
}

export function InvoicesTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/me/invoices")
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </Card>
    )
  }

  const getStatusBadge = (status: Invoice["status"]) => {
    const styles = {
      paid: "bg-green-100 text-green-800",
      unpaid: "bg-blue-100 text-blue-800",
      overdue: "bg-red-100 text-red-800",
    }
    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Your invoices</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-left text-sm font-medium text-gray-500">Invoice #</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-500">Description</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-500">Amount</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="pb-3 text-left text-sm font-medium text-gray-500">Due date</th>
              <th className="pb-3 text-right text-sm font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-gray-100">
                <td className="py-4 text-sm font-medium text-gray-900">{invoice.invoice_number}</td>
                <td className="py-4 text-sm text-gray-600">{invoice.description}</td>
                <td className="py-4 text-sm font-medium text-gray-900">
                  {formatCurrency(invoice.amount, invoice.currency)}
                </td>
                <td className="py-4">{getStatusBadge(invoice.status)}</td>
                <td className="py-4 text-sm text-gray-600">{formatDate(invoice.due_date)}</td>
                <td className="py-4 text-right">
                  {invoice.status === "paid" ? (
                    <span className="text-sm text-gray-400">Paid</span>
                  ) : (
                    <Button size="sm" asChild>
                      <a href={invoice.payment_url} target="_blank" rel="noopener noreferrer">
                        Pay
                      </a>
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
