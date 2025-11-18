"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { ContactsTab } from "./contacts-tab"
import { ListsTab } from "./lists-tab"

export function ContactsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState<"contacts" | "lists">(
    (searchParams.get("tab") as "contacts" | "lists") || "contacts"
  )

  useEffect(() => {
    const tab = searchParams.get("tab") as "contacts" | "lists" | null
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (tab: "contacts" | "lists") => {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", tab)
    // Remove listId when switching to Lists tab
    if (tab === "lists") {
      params.delete("listId")
    }
    router.push(`/contacts?${params.toString()}`)
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500&display=swap" rel="stylesheet" />
      
      <Card className="mb-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex gap-1 p-2 border-b">
          <button
            onClick={() => handleTabChange("contacts")}
            className={`px-6 py-2.5 rounded-lg text-[15px] font-medium transition-all ${
              activeTab === "contacts"
                ? "bg-[#0A47B1] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px" }}
          >
            Contacts
          </button>
          <button
            onClick={() => handleTabChange("lists")}
            className={`px-6 py-2.5 rounded-lg text-[15px] font-medium transition-all ${
              activeTab === "lists"
                ? "bg-[#0A47B1] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px" }}
          >
            Lists
          </button>
        </div>
      </Card>

      {activeTab === "contacts" ? <ContactsTab /> : <ListsTab />}
    </>
  )
}
