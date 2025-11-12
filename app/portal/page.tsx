import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PortalHeader } from "@/components/portal/portal-header"
import { PlayerSummary } from "@/components/portal/player-summary"
import { BalanceCard } from "@/components/portal/balance-card"
import { InvoicesTable } from "@/components/portal/invoices-table"
import { ChecklistSection } from "@/components/portal/checklist-section"

export default async function PlayerPortalPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalHeader user={user} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Your account</h1>

        <div className="space-y-8">
          <PlayerSummary />
          <BalanceCard />
          <InvoicesTable />
          <ChecklistSection />
        </div>
      </main>
    </div>
  )
}
