"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface ListModalProps {
  open: boolean
  initialList?: {
    id: string
    name: string
    description?: string | null
    type: "STATIC" | "SMART"
  } | null
  onClose: () => void
  onSaved: () => void
}

export function ListModal({ open, initialList, onClose, onSaved }: ListModalProps) {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"STATIC" | "SMART">("STATIC")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nameError, setNameError] = useState("")

  // Reset form when modal opens/closes or initialList changes
  useEffect(() => {
    if (open) {
      if (initialList) {
        setName(initialList.name)
        setDescription(initialList.description || "")
        setType(initialList.type)
      } else {
        setName("")
        setDescription("")
        setType("STATIC")
      }
      setNameError("")
    }
  }, [open, initialList])

  const handleSubmit = async () => {
    // Validate name
    if (!name.trim()) {
      setNameError("List name is required")
      return
    }

    setNameError("")
    setIsSubmitting(true)

    try {
      const url = initialList ? `/api/lists/${initialList.id}` : "/api/lists"
      const method = initialList ? "PUT" : "POST"

      const body: {
        name: string
        description?: string
        type: "STATIC" | "SMART"
        filtersJson?: Record<string, unknown>
      } = {
        name: name.trim(),
        description: description.trim() || undefined,
        type,
      }

      // For SMART lists, include placeholder filtersJson
      if (type === "SMART") {
        body.filtersJson = {}
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast({
          title: initialList ? "List updated" : "List created",
          description: `${name} has been ${initialList ? "updated" : "created"} successfully`,
        })
        onSaved()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || `Failed to ${initialList ? "update" : "create"} list`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${initialList ? "update" : "create"} list`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white shadow-xl">
        <DialogHeader className="border-b pb-5">
          <DialogTitle className="text-[26px] font-semibold tracking-tight text-gray-900">
            {initialList ? "Edit List" : "Create New List"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* List Name */}
          <div className="space-y-2">
            <Label htmlFor="list-name" className="text-[13px] font-medium text-gray-700 uppercase tracking-wide">
              List name
            </Label>
            <Input
              id="list-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (nameError) setNameError("")
              }}
              placeholder="e.g. Q1 2025 Prospects"
              className={`h-11 ${nameError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {nameError && <p className="text-sm text-red-600 mt-1">{nameError}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="list-description" className="text-[13px] font-medium text-gray-700 uppercase tracking-wide">
              Description (optional)
            </Label>
            <Textarea
              id="list-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this list for?"
              rows={3}
              className="resize-none"
            />
          </div>

          {/* List Type Toggle */}
          <div className="space-y-3">
            <Label className="text-[13px] font-medium text-gray-700 uppercase tracking-wide">List type</Label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setType("STATIC")}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all text-left ${
                  type === "STATIC"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="font-medium text-[15px] text-gray-900">Static</div>
                <div className="text-[13px] text-gray-500 mt-0.5">Manually add and remove contacts</div>
              </button>
              <button
                type="button"
                onClick={() => setType("SMART")}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all text-left ${
                  type === "SMART"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="font-medium text-[15px] text-gray-900">Smart</div>
                <div className="text-[13px] text-gray-500 mt-0.5">Auto-include contacts matching filters</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="px-6">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || isSubmitting}
            className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            {isSubmitting
              ? initialList
                ? "Updating..."
                : "Creating..."
              : initialList
              ? "Save List"
              : "Create List"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
