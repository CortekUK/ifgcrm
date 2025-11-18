import { redirect } from 'next/navigation'
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/layout/app-layout"
import { RunHistoryContent } from "@/components/automations/run-history-content"

export default async function RunHistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <AppLayout user={user} title="Run History">
      <RunHistoryContent user={user} />
    </AppLayout>
  )
}
