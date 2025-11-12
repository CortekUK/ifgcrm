"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ProgrammesPanel } from "./programmes-panel"
import { PipelinesPanel } from "./pipelines-panel"
import { EmailSendersPanel } from "./email-senders-panel"
import { UsersPanel } from "./users-panel"
import { GraduationCap, Puzzle, Mail, Users } from "lucide-react"

type SettingsTab = "programmes" | "pipelines" | "senders" | "users"

export function SettingsContent() {
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get("tab") as SettingsTab) || "programmes"
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab)

  useEffect(() => {
    const tabParam = searchParams.get("tab") as SettingsTab
    if (tabParam && ["programmes", "pipelines", "senders", "users"].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const tabs = [
    { id: "programmes" as const, label: "Programmes", icon: GraduationCap },
    { id: "pipelines" as const, label: "Pipelines", icon: Puzzle },
    { id: "senders" as const, label: "Email senders", icon: Mail },
    { id: "users" as const, label: "Users & roles", icon: Users },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <nav className="flex flex-row gap-2 rounded-lg bg-gray-50 p-2 lg:flex-col">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-700 hover:bg-blue-50 hover:text-gray-900"
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {activeTab === "programmes" && <ProgrammesPanel />}
        {activeTab === "pipelines" && <PipelinesPanel />}
        {activeTab === "senders" && <EmailSendersPanel />}
        {activeTab === "users" && <UsersPanel />}
      </div>
    </div>
  )
}
