"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Mail, UserCheck, Receipt, ChevronRight, Zap, AlertCircle } from 'lucide-react'
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { WorkflowDrawer } from "@/components/automations/workflow-drawer"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { AutomationsTab } from "@/components/automations/automations-tab"
import { RunHistoryTab } from "@/components/automations/run-history-tab"

const automations = [
  {
    id: 1,
    name: "New Lead Follow-Up",
    description: "3-step email sequence over 7 days.",
    status: "Active",
    trigger: "Triggered when a new player is added.",
    icon: Mail,
    lastRun: "2 hours ago",
    nextMessage: "Tomorrow (Email 2 of 3)",
    messagesSent: 127,
    completed: 89,
    isRunning: true,
    hasError: false,
  },
  {
    id: 2,
    name: "Signed Player Welcome",
    description: "Welcome sequence for new signees.",
    status: "Active",
    trigger: "Triggered when player status changes to Signed.",
    icon: UserCheck,
    lastRun: "1 day ago",
    nextMessage: "Dec 15 (Email 1 of 2)",
    messagesSent: 64,
    completed: 58,
    isRunning: false,
    hasError: false,
  },
  {
    id: 3,
    name: "Invoice Reminder",
    description: "Reminders before and after due dates.",
    status: "Paused",
    trigger: "Triggered when invoice due date is within 3 days.",
    icon: Receipt,
    lastRun: "3 days ago",
    nextMessage: "Paused",
    messagesSent: 42,
    completed: 35,
    isRunning: false,
    hasError: false,
  },
]

export default function AutomationsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<"automations" | "history">("automations")

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
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500&display=swap" rel="stylesheet" />
      
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Automations</h1>
        <p className="text-sm text-gray-600">
          Lightweight sequences that run follow-ups, welcomes and reminders automatically.
        </p>
      </div>

      <Card className="mb-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex gap-1 p-2 border-b">
          <button
            onClick={() => setActiveTab("automations")}
            className={`px-6 py-2.5 rounded-lg text-[15px] font-medium transition-all ${
              activeTab === "automations"
                ? "bg-[#0A47B1] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px" }}
          >
            Automations
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2.5 rounded-lg text-[15px] font-medium transition-all ${
              activeTab === "history"
                ? "bg-[#0A47B1] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px" }}
          >
            Run History
          </button>
        </div>
      </Card>

      {activeTab === "automations" ? (
        <AutomationsTab />
      ) : (
        <RunHistoryTab user={user} />
      )}
    </AppLayout>
  )
}
