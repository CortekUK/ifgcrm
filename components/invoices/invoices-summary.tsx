"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, AlertTriangle, CheckCircle2 } from "lucide-react"

interface SummaryData {
  outstanding_balance: number
  overdue_count: number
  paid_this_month: number
  currency: string
}

export function InvoicesSummary() {
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSummary()
  }, [])

  const fetchSummary = async () => {
    try {
      const response = await fetch("/api/invoices/summary")
      const data = await response.json()
      setSummary(data)
    } catch (error) {
      console.error("Failed to fetch summary:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!summary) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: summary.currency,
    }).format(amount)
  }

  const currentMonth = new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" })

  return (
    <div className="mb-6 grid gap-4 animate-fade-in-up md:grid-cols-3">
      {/* Outstanding Balance Card */}
      <Card className="overflow-hidden border-blue-200 bg-[#eff6ff] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm font-medium text-gray-600">Outstanding Balance</CardTitle>
              <div className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(summary.outstanding_balance)}</div>
              <p className="mt-1 text-xs text-gray-500">as of {currentMonth}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overdue Invoices Card */}
      <Card className="overflow-hidden border-red-200 bg-[#fef2f2] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm font-medium text-gray-600">Overdue Invoices</CardTitle>
              <div className="mt-2 text-3xl font-bold text-red-600">{summary.overdue_count}</div>
              <p className="mt-1 text-xs text-gray-500">require attention</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Paid This Month Card */}
      <Card className="overflow-hidden border-green-200 bg-[#ecfdf5] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm font-medium text-gray-600">Paid This Month</CardTitle>
              <div className="mt-2 text-3xl font-bold text-green-600">{formatCurrency(summary.paid_this_month)}</div>
              <p className="mt-1 text-xs text-gray-500">successfully collected</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
