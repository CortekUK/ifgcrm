import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/layout/app-layout"
import { InvoicesTable } from "@/components/invoices/invoices-table"
import { InvoicesSummary } from "@/components/invoices/invoices-summary"
import { PaymentInsights } from "@/components/invoices/payment-insights"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"

export default async function InvoicesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <AppLayout user={user} title="Invoices">
      <div className="gradient-primary mb-6 flex h-[72px] items-center rounded-2xl px-6 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-base text-white" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
            Manage payments and track outstanding balances.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2 border-white/30 bg-white/10 text-white shadow-md backdrop-blur-sm hover:bg-white/20"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button className="gap-2 bg-white text-blue-600 shadow-md hover:bg-blue-50">
              <Plus className="h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </div>
      </div>
      {/* End of standardized banner */}

      <InvoicesSummary />
      <InvoicesTable />

      <div className="mt-6">
        <PaymentInsights />
      </div>
    </AppLayout>
  )
}
