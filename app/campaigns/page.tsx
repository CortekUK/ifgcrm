"use client"
import { AppLayout } from "@/components/layout/app-layout"
import { CampaignsSummary } from "@/components/campaigns/campaigns-summary"
import { CampaignsTable } from "@/components/campaigns/campaigns-table"
import { Button } from "@/components/ui/button"
import { Plus, BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"
import { CampaignDialog } from "@/components/campaigns/campaign-dialog"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export default function CampaignsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [preselectedTemplate, setPreselectedTemplate] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Check if there's a template selected from the templates page
    const templateData = sessionStorage.getItem('selectedTemplate')
    if (templateData) {
      const template = JSON.parse(templateData)
      setPreselectedTemplate(template)
      setDialogOpen(true)
      sessionStorage.removeItem('selectedTemplate') // Clear it after using
    }
  }, [])

  if (!user) {
    return null
  }

  return (
    <AppLayout user={user} title="Campaigns">
      <div className="gradient-primary mb-6 flex h-[72px] items-center rounded-2xl px-6 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-base text-white" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
            Manage your email and SMS campaigns for player outreach.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20">
              <BarChart3 className="h-4 w-4" />
              View Reports
            </Button>
            <Button
              className="gap-2 bg-white text-blue-600 shadow-md hover:bg-blue-50"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Generate Campaign
            </Button>
          </div>
        </div>
      </div>
      {/* End of standardized banner */}

      <CampaignsSummary />
      <CampaignsTable onGenerateCampaign={() => setDialogOpen(true)} />

      <CampaignDialog
        campaign={null}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setPreselectedTemplate(null)
        }}
        onSuccess={() => {
          setPreselectedTemplate(null)
        }}
        preselectedTemplate={preselectedTemplate}
      />
    </AppLayout>
  )
}
