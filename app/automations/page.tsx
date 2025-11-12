"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Pause, Mail, UserCheck, Receipt, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

const mockAutomations = [
  {
    id: 1,
    name: "Lead Follow-Up Sequence",
    description: "Automatically send 3 follow-up emails to new leads over 7 days",
    status: "Active",
    trigger: "New player added",
    icon: Mail,
    stats: { runs: 45, success: 42 },
  },
  {
    id: 2,
    name: "Signed Player Nurture",
    description: "Welcome sequence for players who have signed with a programme",
    status: "Active",
    trigger: "Status changed to Signed",
    icon: UserCheck,
    stats: { runs: 28, success: 28 },
  },
  {
    id: 3,
    name: "Invoice Reminder",
    description: "Send reminders 7 days before invoice due date and follow-ups for overdue",
    status: "Paused",
    trigger: "Invoice due date approaching",
    icon: Receipt,
    stats: { runs: 12, success: 10 },
  },
]

export default function AutomationsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
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
    <AppLayout user={user} title="Automations">
      <div className="gradient-primary mb-6 flex h-[72px] items-center rounded-2xl px-6 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-base text-white" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
            Set up automated workflows to streamline your player recruitment and communication.
          </p>
          <Button
            className="gap-2 bg-white text-blue-600 shadow-md hover:bg-blue-50"
            onClick={() => setDrawerOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Workflow Cards Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mockAutomations.map((automation, index) => (
          <Card
            key={automation.id}
            className="group cursor-pointer border-border/50 transition-all duration-200 hover:shadow-[0_4px_10px_rgba(10,71,177,0.12)] hover:-translate-y-1"
            style={{
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <CardHeader>
              <div className="mb-3 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 shadow-md">
                  <automation.icon className="h-6 w-6 text-white" />
                </div>
                <Badge
                  variant={automation.status === "Active" ? "default" : "secondary"}
                  className={
                    automation.status === "Active"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-600"
                  }
                >
                  {automation.status === "Active" ? (
                    <Play className="mr-1 h-3 w-3" />
                  ) : (
                    <Pause className="mr-1 h-3 w-3" />
                  )}
                  {automation.status}
                </Badge>
              </div>
              <CardTitle className="text-lg">{automation.name}</CardTitle>
              <CardDescription className="line-clamp-2">{automation.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Trigger */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-muted-foreground">Trigger:</span>
                  <span className="text-foreground">{automation.trigger}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">{automation.stats.runs}</div>
                    <div className="text-xs text-muted-foreground">Total Runs</div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{automation.stats.success}</div>
                    <div className="text-xs text-muted-foreground">Successful</div>
                  </div>
                </div>

                {/* Action */}
                <Button
                  variant="ghost"
                  className="w-full justify-between text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  View Workflow
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <Card className="mt-6 border-dashed border-2 bg-blue-50/50" style={{ borderColor: "#E0E4F0" }}>
        <CardHeader>
          <CardTitle className="text-center text-blue-900">More Automations Coming Soon</CardTitle>
          <CardDescription className="text-center">
            We're working on bringing you powerful automation tools including:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Pipeline stage transitions",
              "Birthday & milestone messages",
              "SMS follow-up sequences",
              "Team assignments",
              "Contract expiry alerts",
              "Performance tracking",
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-blue-700"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Placeholder Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Create Workflow</SheetTitle>
          </SheetHeader>
          <div className="mt-6 flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg">
              <Plus className="h-10 w-10 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Workflow Builder Coming Soon</h3>
            <p className="mb-6 text-sm text-muted-foreground">
              We're building a powerful visual workflow editor that will let you create custom automation sequences with
              drag-and-drop simplicity.
            </p>
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>
              Close
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </AppLayout>
  )
}
