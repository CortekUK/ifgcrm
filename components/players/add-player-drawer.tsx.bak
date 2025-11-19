"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface AddPlayerDrawerProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

interface Programme {
  id: number
  name: string
}

interface Recruiter {
  id: number
  name: string
}

const STATUS_OPTIONS = [
  { value: "contacted", label: "Contacted" },
  { value: "pipeline", label: "In Pipeline" },
  { value: "interview", label: "Interview" },
  { value: "signed", label: "Signed" },
]

const SUGGESTED_TAGS = [
  "High Priority",
  "Goalkeeper",
  "Midfielder",
  "Striker",
  "Defender",
  "Left Footed",
  "Right Footed",
  "International",
  "U18",
  "U21",
  "Scholarship",
]

export function AddPlayerDrawer({ open, onClose, onSuccess }: AddPlayerDrawerProps) {
  const [loading, setLoading] = useState(false)
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    programme: "",
    recruiter: "",
    status: "contacted",
    notes: "",
  })

  useEffect(() => {
    if (open) {
      fetchProgrammes()
      fetchRecruiters()
    }
  }, [open])

  const fetchProgrammes = async () => {
    const response = await fetch("/api/settings/programmes")
    const data = await response.json()
    setProgrammes(data)
  }

  const fetchRecruiters = async () => {
    const response = await fetch("/api/settings/recruiters")
    const data = await response.json()
    setRecruiters(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags,
        }),
      })

      if (response.ok) {
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          programme: "",
          recruiter: "",
          status: "contacted",
          notes: "",
        })
        setTags([])
        onSuccess()
      } else {
        alert("Failed to add player")
      }
    } catch (error) {
      console.error("Error adding player:", error)
      alert("An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag(tagInput)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add New Player
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
              Full Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Smith"
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john.smith@example.com"
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
              Phone *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 555 123 4567"
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="programme" className="text-sm font-semibold text-gray-700">
              Programme *
            </Label>
            <Select
              value={formData.programme}
              onValueChange={(value) => setFormData({ ...formData, programme: value })}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select programme" />
              </SelectTrigger>
              <SelectContent>
                {programmes.map((prog) => (
                  <SelectItem key={prog.id} value={prog.name}>
                    {prog.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recruiter" className="text-sm font-semibold text-gray-700">
              Recruiter *
            </Label>
            <Select
              value={formData.recruiter}
              onValueChange={(value) => setFormData({ ...formData, recruiter: value })}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select recruiter" />
              </SelectTrigger>
              <SelectContent>
                {recruiters.map((rec) => (
                  <SelectItem key={rec.id} value={rec.name}>
                    {rec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-semibold text-gray-700">
              Status
            </Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-semibold text-gray-700">
              Tags
            </Label>
            <div className="space-y-3">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Type a tag and press Enter"
                className="h-10"
              />

              {/* Current tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-700 border-blue-200 pl-2.5 pr-1.5 py-1 gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Suggested tags */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Suggested tags:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      onClick={() => addTag(tag)}
                    >
                      + {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional information about the player..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-10 bg-transparent">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
            >
              {loading ? "Adding..." : "Add Player"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
