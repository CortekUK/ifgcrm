"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface BalanceData {
  total_programme_cost: number
  paid_so_far: number
  amount_due: number
  currency: string
}

export function BalanceCard() {
  const [balance, setBalance] = useState<BalanceData | null>(null)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetch("/api/me/balance"), fetch("/api/me/invoices")])
      .then(([balanceRes, invoicesRes]) => Promise.all([balanceRes.json(), invoicesRes.json()]))
      .then(([balanceData, invoicesData]) => {
        setBalance(balanceData)
        const unpaidInvoice = invoicesData.find((inv: any) => inv.status === "unpaid" || inv.status === "overdue")
        if (unpaidInvoice) {
          setPaymentUrl(unpaidInvoice.payment_url)
        }
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

  if (!balance) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: balance.currency,
    }).format(amount)
  }

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900">Your balance</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <p className="text-sm text-gray-500">Total programme cost</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(balance.total_programme_cost)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Paid so far</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">{formatCurrency(balance.paid_so_far)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Amount due</p>
          <p className="mt-1 text-2xl font-semibold text-orange-600">{formatCurrency(balance.amount_due)}</p>
        </div>
      </div>
      {balance.amount_due > 0 && paymentUrl && (
        <div className="mt-6">
          <Button asChild className="w-full sm:w-auto">
            <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
              Pay now
            </a>
          </Button>
        </div>
      )}
    </Card>
  )
}
