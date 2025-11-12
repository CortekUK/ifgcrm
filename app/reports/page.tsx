"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { ReportsSummary } from "@/components/reports/reports-summary"
import { CampaignPerformance } from "@/components/reports/campaign-performance"
import { EngagementOverview } from "@/components/reports/engagement-overview"
import { PipelineActivity } from "@/components/reports/pipeline-activity"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export default function ReportsPage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  if (!user) {
    return null
  }

  return (
    <AppLayout user={user} title="Reports">
      <div className="gradient-primary mb-6 flex h-[72px] items-center rounded-2xl px-6 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <p className="text-base text-white" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
          View analytics and performance across campaigns and player activity.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-end">
        <div className="flex items-center gap-3">
          {/* Date range picker */}
          <Select defaultValue="this-month">
            <SelectTrigger className="w-[160px] bg-white">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This week</SelectItem>
              <SelectItem value="this-month">This month</SelectItem>
              <SelectItem value="last-month">Last month</SelectItem>
              <SelectItem value="this-quarter">This quarter</SelectItem>
              <SelectItem value="this-year">This year</SelectItem>
            </SelectContent>
          </Select>

          {/* Download CSV button */}
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>
      </div>

      {/* Summary metrics row */}
      <ReportsSummary />

      {/* Campaign performance panel */}
      <CampaignPerformance />

      {/* Engagement overview section */}
      <EngagementOverview />

      {/* Pipeline activity panel */}
      <PipelineActivity />
    </AppLayout>
  )
}
