import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/layout/app-layout"
import { PlayersTable } from "@/components/players/players-table"
import { PlayersSummary } from "@/components/players/players-summary"

export default async function PlayersPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <AppLayout user={user} title="Players">
      <div className="gradient-primary mb-6 flex h-[72px] items-center rounded-2xl px-6 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <p className="text-base text-white" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
          Manage your player database and recruitment pipeline.
        </p>
      </div>
      {/* </CHANGE> */}

      <PlayersSummary />
      <PlayersTable />
    </AppLayout>
  )
}
