import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/layout/app-layout"
import { PaymentsSummary } from "@/components/payments/payments-summary"
import { PaymentsTable } from "@/components/payments/payments-table"
import { PaymentSourcesBreakdown } from "@/components/payments/payment-sources-breakdown"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"

export default async function PaymentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <AppLayout user={user} title="Payments">
      <div className="gradient-primary mb-6 flex h-[72px] items-center rounded-2xl px-6 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-base text-white" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
            View and manage all received and pending payments.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2 border-white/30 bg-white/10 text-white shadow-md backdrop-blur-sm hover:bg-white/20"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="gap-2 bg-white text-blue-600 shadow-md hover:bg-blue-50">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <PaymentsSummary />

      {/* Payments Table */}
      <PaymentsTable />

      {/* Payment Sources Breakdown */}
      <div className="mt-6">
        <PaymentSourcesBreakdown />
      </div>
    </AppLayout>
  )
}
