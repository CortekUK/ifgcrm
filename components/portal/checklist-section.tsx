"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, Circle } from "lucide-react"

interface ChecklistItem {
  id: number
  name: string
  status: "completed" | "missing"
  upload_enabled: boolean
}

export function ChecklistSection() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/me/checklist")
      .then((res) => res.json())
      .then((data) => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </Card>
    )
  }

  if (items.length === 0) return null

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Required documents</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              {item.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{item.status === "completed" ? "Completed" : "Missing"}</p>
              </div>
            </div>
            {item.upload_enabled && item.status !== "completed" && (
              <Button size="sm" variant="outline">
                Upload
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
