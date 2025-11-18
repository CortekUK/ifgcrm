"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface CreateListModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  list?: {
    id: number
    name: string
    description?: string
    type: "static" | "smart"
  } | null
}

export function CreateListModal({ open, onClose, onSuccess, list }: CreateListModalProps) {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"static" | "smart">("static")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (list) {
      setName(list.name)
      setDescription(list.description || "")
      setType(list.type)
    } else {
      setName("")
      setDescription("")
      setType("static")
    }
  }, [list, open])

  const handleSubmit = async () => {
    if (!name) return

    setIsSubmitting(true)
    try {
      const url = list ? `/api/lists/${list.id}` : "/api/lists"
      const method = list ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, type }),
      })

      if (response.ok) {
        toast({
          title: list ? "List updated" : "List created",
          description: `${name} has been ${list ? "updated" : "created"} successfully`,
        })
        setName("")
        setDescription("")
        setType("static")
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${list ? "update" : "create"} list`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{list ? "Edit List" : "Create New List"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>List Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q1 2025 Prospects"
              className="mt-2"
            />
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this list for?"
              className="mt-2"
              rows={3}
            />
          </div>
          <div>
            <Label>List Type</Label>
            <Select value={type} onValueChange={(value: "static" | "smart") => setType(value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static (manual selection)</SelectItem>
                <SelectItem value="smart">Smart (filter-based)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              {type === "static"
                ? "Manually add and remove contacts"
                : "Automatically include contacts matching specific filters"}
            </p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name || isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-blue-700"
          >
            {isSubmitting ? (list ? "Updating..." : "Creating...") : (list ? "Update List" : "Create List")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
