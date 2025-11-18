"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { PipelinesBoard } from "@/components/pipelines/pipelines-board"
import { Button } from "@/components/ui/button"
import { Plus, ListTree } from "lucide-react"
import { CreateDealModal } from "@/components/pipelines/create-deal-modal"
import { AddStageModal } from "@/components/pipelines/add-stage-modal"
import { createClient } from "@/lib/supabase/client"

export default function PipelinesPage() {
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isAddStageModalOpen, setIsAddStageModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        router.push("/auth/login")
      } else {
        setUser(user)

        supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUserRole(profile.role)
            }
          })
      }
    })
  }, [router])

  if (!user) {
    return null
  }

  const canAddStage = userRole === "admin" || userRole === "manager"

  return (
    <AppLayout user={user} title="Pipelines">
      <div className="flex flex-col h-full max-w-full overflow-hidden">
        <div className="flex-shrink-0">
          <div className="gradient-primary mb-6 flex h-[72px] items-center rounded-2xl px-6 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
            <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-base text-white" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
                Track deals through your recruitment stages.
              </p>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="gap-2 bg-white text-primary shadow-md hover:bg-muted transition-all duration-200 hover:shadow-lg active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  New Deal
                </Button>
                {canAddStage && (
                  <Button
                    onClick={() => setIsAddStageModalOpen(true)}
                    className="gap-2 bg-white text-primary shadow-md hover:bg-muted transition-all duration-200 hover:shadow-lg active:scale-95"
                  >
                    <ListTree className="h-4 w-4" />
                    Add Stage
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          <PipelinesBoard />
        </div>
      </div>

      <CreateDealModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      {canAddStage && <AddStageModal open={isAddStageModalOpen} onClose={() => setIsAddStageModalOpen(false)} />}
    </AppLayout>
  )
}
