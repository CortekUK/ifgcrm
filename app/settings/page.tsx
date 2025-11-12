import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { SettingsContent } from "@/components/settings/settings-content"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <AppLayout user={user} title="Settings">
      <div className="gradient-primary mb-6 flex h-[72px] items-center rounded-2xl px-6 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <p className="text-base text-white" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
          Manage programmes, pipelines, email identities, and team members
        </p>
      </div>
      {/* </CHANGE> */}

      <SettingsContent />
    </AppLayout>
  )
}
