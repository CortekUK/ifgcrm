"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PaymentSourcesBreakdown() {
  const sources = [
    { name: "Stripe", percentage: 55, amount: 37675, color: "bg-gradient-to-r from-[#0A47B1] to-[#1739C0]" },
    { name: "Bank", percentage: 30, amount: 20550, color: "bg-gradient-to-r from-[#2E6AF1] to-[#0A47B1]" },
    { name: "Manual", percentage: 15, amount: 10275, color: "bg-gradient-to-r from-[#6B9EFF] to-[#2E6AF1]" },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount)
  }

  return (
    <Card className="overflow-hidden border border-gray-200 bg-white shadow-sm">
      <CardHeader className="border-b border-gray-200 bg-gray-50/50">
        <CardTitle className="text-lg font-semibold text-gray-900">Payment Sources Breakdown</CardTitle>
        <p className="text-sm text-gray-500">Distribution of payment methods used</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {sources.map((source) => (
            <div key={source.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{source.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">{formatCurrency(source.amount)}</span>
                  <span className="font-bold text-gray-900">{source.percentage}%</span>
                </div>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${source.color} transition-all duration-500 ease-out`}
                  style={{ width: `${source.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Total Payments</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(68500)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
