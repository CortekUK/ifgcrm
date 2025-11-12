"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Clock, RefreshCcw } from "lucide-react"

export function PaymentsSummary() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount)
  }

  return (
    <div className="mb-6 grid gap-4 animate-fade-in-up md:grid-cols-3">
      {/* Total Payments Received Card */}
      <Card className="overflow-hidden border-green-200 bg-[#ecfdf5] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm font-medium text-gray-600">Total Payments Received</CardTitle>
              <div className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(68500)}</div>
              <p className="mt-1 text-xs text-gray-500">last 30 days</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Pending Transfers Card */}
      <Card className="overflow-hidden border-yellow-200 bg-[#fefce8] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Transfers</CardTitle>
              <div className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(6200)}</div>
              <p className="mt-1 text-xs text-gray-500">awaiting processing</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Refunds Issued Card */}
      <Card className="overflow-hidden border-red-200 bg-[#fef2f2] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <RefreshCcw className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-sm font-medium text-gray-600">Refunds Issued</CardTitle>
              <div className="mt-2 text-3xl font-bold text-red-600">{formatCurrency(1250)}</div>
              <p className="mt-1 text-xs text-gray-500">processed this month</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
