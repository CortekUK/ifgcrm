import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default async function PaymentDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Mock payment data - in production, fetch from database
  const payment = {
    id: params.id,
    payment_number: `PAY-${params.id}`,
    amount: 1200.0,
    method: "Stripe",
    programme: "UK Academy",
    player_name: "Daniel Perez",
    player_email: "daniel.perez@example.com",
    reference: "STRP-982347",
    invoice_number: "INV-5003",
    status: "Successful",
    date_received: "2025-11-11T14:32:00",
    collected_by: "Online portal",
    payout_status: "Included in next payout",
    recruiter: "Sarah Johnson",
    subtotal: 1200.0,
    processing_fee: 24.0,
    net_received: 1176.0,
  }

  const activities = [
    {
      id: 1,
      timestamp: "2025-11-11T14:32:00",
      description: "Payment confirmed via Stripe",
    },
    {
      id: 2,
      timestamp: "2025-11-11T14:35:00",
      description: "Receipt email sent to player",
    },
    {
      id: 3,
      timestamp: "2025-11-10T09:15:00",
      description: "Checkout session created",
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { className: string }> = {
      Successful: { className: "bg-green-100 text-green-700 border-green-200" },
      Pending: { className: "bg-amber-100 text-amber-700 border-amber-200" },
      Failed: { className: "bg-red-100 text-red-700 border-red-200" },
    }
    const config = configs[status] || configs.Pending
    return <Badge className={`${config.className} border px-3 py-1`}>{status}</Badge>
  }

  return (
    <AppLayout user={user} title={payment.payment_number}>
      {/* Header Section */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-1 text-2xl font-semibold text-gray-900">Payment #{payment.payment_number}</h1>
          <p className="text-sm text-gray-600">Received on {formatDate(payment.date_received)}</p>
        </div>
        <div className="flex items-center gap-3">{getStatusBadge(payment.status)}</div>
      </div>

      {/* Top Info Cards */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payment Summary Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Payment Summary</h2>
          </div>

          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <p className="mb-1 text-sm text-gray-600">Amount</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(payment.amount)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-xs text-gray-500">Method</p>
                <p className="text-sm font-medium text-gray-900">{payment.method}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">Programme</p>
                <p className="text-sm font-medium text-gray-900">{payment.programme}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-xs text-gray-500">Player</p>
                <p className="text-sm font-medium text-gray-900">{payment.player_name}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-500">Reference</p>
                <p className="text-sm font-medium text-gray-900">{payment.reference}</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="mb-1 text-xs text-gray-500">Allocated to invoice</p>
              <Link
                href={`/invoices/${payment.invoice_number}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {payment.invoice_number}
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Status Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Payment Status</h2>

          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <p className="mb-2 text-sm text-gray-600">Status</p>
              {getStatusBadge(payment.status)}
            </div>

            <div>
              <p className="mb-1 text-xs text-gray-500">Date received</p>
              <p className="text-sm font-medium text-gray-900">{formatDateTime(payment.date_received)}</p>
            </div>

            <div>
              <p className="mb-1 text-xs text-gray-500">Collected by</p>
              <p className="text-sm font-medium text-gray-900">{payment.collected_by}</p>
            </div>

            <div>
              <p className="mb-1 text-xs text-gray-500">Payout</p>
              <p className="text-sm font-medium text-gray-900">{payment.payout_status}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Player & Programme */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Player & Programme</h2>

          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 p-3">
              <p className="mb-1 text-xs text-gray-500">Player name</p>
              <p className="text-sm font-medium text-gray-900">{payment.player_name}</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <p className="mb-1 text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{payment.player_email}</p>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <p className="mb-1 text-xs text-gray-500">Programme</p>
              <Badge className="border-0 bg-gradient-to-r from-blue-500 to-purple-500 text-xs text-white">
                {payment.programme}
              </Badge>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <p className="mb-1 text-xs text-gray-500">Recruiter</p>
              <p className="text-sm font-medium text-gray-900">{payment.recruiter}</p>
            </div>
          </div>
        </div>

        {/* Notes & Activity */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Notes & Activity</h2>

          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="border-l-2 border-blue-500 py-1 pl-3">
                <p className="mb-0.5 text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                <p className="text-sm text-gray-900">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment Breakdown</h2>

        <div className="max-w-md space-y-3">
          <div className="flex items-center justify-between py-2">
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="text-sm font-medium text-gray-900">{formatCurrency(payment.subtotal)}</p>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 py-2">
            <p className="text-sm text-gray-600">Processing fee</p>
            <p className="text-sm font-medium text-gray-900">{formatCurrency(payment.processing_fee)}</p>
          </div>

          <div className="flex items-center justify-between py-2">
            <p className="text-sm font-semibold text-gray-900">Net received</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(payment.net_received)}</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 flex gap-2 sm:hidden">
        <Button size="sm" className="bg-blue-600 text-white shadow-lg hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
        <Button size="sm" variant="outline" className="border-red-300 bg-white text-red-600 shadow-lg hover:bg-red-50">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Refund
        </Button>
      </div>
    </AppLayout>
  )
}
