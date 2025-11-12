import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/layout/app-layout"
import { PipelinesBoard } from "@/components/pipelines/pipelines-board"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function PipelinesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <AppLayout user={user} title="Pipelines">
      <div className="gradient-primary mb-6 flex h-[72px] items-center rounded-2xl px-6 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-base text-white" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
            Track deals through your recruitment stages.
          </p>
          <Button className="gap-2 bg-white text-blue-600 shadow-md hover:bg-blue-50 transition-all duration-200 hover:shadow-lg active:scale-95">
            <Plus className="h-4 w-4" />
            New Deal
          </Button>
        </div>
      </div>
      {/* </CHANGE> */}

      <PipelinesBoard />
    </AppLayout>
  )
}
