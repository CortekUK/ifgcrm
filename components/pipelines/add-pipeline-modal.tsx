"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface AddPipelineModalProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AddPipelineModal({ open, onClose, onSuccess }: AddPipelineModalProps) {
  const [newPipelineName, setNewPipelineName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/pipelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPipelineName }),
      })

      if (res.ok) {
        toast({ title: "Pipeline created successfully" })
        setNewPipelineName("")
        onClose()
        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast({ title: "Failed to create pipeline", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "An error occurred", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Add pipeline</DialogTitle>
          <DialogDescription>Create a new pipeline for managing deals</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pipeline-name">Pipeline name *</Label>
            <Input
              id="pipeline-name"
              value={newPipelineName}
              onChange={(e) => setNewPipelineName(e.target.value)}
              placeholder="e.g. US College Recruitment"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create pipeline"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
