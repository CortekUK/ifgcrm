import { redirect } from 'next/navigation'
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/layout/app-layout"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { UnmatchedReplies } from "@/components/dashboard/unmatched-replies"
import { LeadsByProgram } from "@/components/dashboard/leads-by-program"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { LeadSourcesBreakdown } from "@/components/dashboard/lead-sources-breakdown"
import { ProgrammeInterest } from "@/components/dashboard/programme-interest"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Send } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <AppLayout user={user} title="Dashboard">
      <div className="gradient-primary mb-6 flex h-[72px] items-center rounded-2xl px-6 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-base text-white" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
            Welcome back! Manage recruitment performance at a glance.
          </p>
          <div className="flex gap-3">
            <Link href="/players?new=true">
              <Button className="btn-press gap-2 bg-white text-blue-600 shadow-md hover:bg-blue-50">
                <PlusCircle className="h-4 w-4" />
                New Lead
              </Button>
            </Link>
            <Link href="/campaigns">
              <Button
                variant="outline"
                className="btn-press gap-2 border-white/30 bg-white/10 text-white shadow-md backdrop-blur-sm hover:bg-white/20"
              >
                <Send className="h-4 w-4" />
                Send Campaign
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <StatsCards />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UnmatchedReplies />
        <LeadsByProgram />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LeadSourcesBreakdown />
        <ProgrammeInterest />
      </div>

      <div className="mt-8 mb-16">
        <RecentActivity />
      </div>
    </AppLayout>
  )
}
