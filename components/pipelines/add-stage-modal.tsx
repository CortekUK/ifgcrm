"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ListOrdered, Palette, Hash } from "lucide-react"

interface AddStageModalProps {
  open: boolean
  onClose: () => void
}

interface Pipeline {
  id: number
  name: string
}

interface Stage {
  id: number
  name: string
  order: number
}

const COLOR_PALETTE = [
  { name: "Teal", value: "bg-teal-500", hex: "#14b8a6" },
  { name: "Sky Blue", value: "bg-sky-500", hex: "#0ea5e9" },
  { name: "Purple", value: "bg-purple-500", hex: "#a855f7" },
  { name: "Green", value: "bg-green-500", hex: "#22c55e" },
  { name: "Orange", value: "bg-orange-500", hex: "#f97316" },
  { name: "Pink", value: "bg-pink-500", hex: "#ec4899" },
  { name: "Indigo", value: "bg-indigo-500", hex: "#6366f1" },
  { name: "Yellow", value: "bg-yellow-500", hex: "#eab308" },
]

export function AddStageModal({ open, onClose }: AddStageModalProps) {
  const [loading, setLoading] = useState(false)
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [selectedPipeline, setSelectedPipeline] = useState<string>("")

  const [formData, setFormData] = useState({
    name: "",
    color: "",
    order: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    pipeline: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      fetchPipelines()
    }
  }, [open])

  useEffect(() => {
    if (selectedPipeline) {
      fetchStages(selectedPipeline)
    }
  }, [selectedPipeline])

  const fetchPipelines = async () => {
    try {
      const response = await fetch("/api/pipelines")
      const data = await response.json()
      setPipelines(data)
      if (data.length > 0) {
        setSelectedPipeline(data[0].id.toString())
      }
    } catch (error) {
      console.error("Failed to fetch pipelines:", error)
    }
  }

  const fetchStages = async (pipelineId: string) => {
    try {
      const response = await fetch(`/api/pipelines/${pipelineId}/stages?stagesOnly=true`)
      const data = await response.json()
      setStages(data || [])

      // Auto-assign next color in sequence if not selected
      if (!formData.color && data && data.length > 0) {
        const nextColorIndex = data.length % COLOR_PALETTE.length
        setFormData((prev) => ({ ...prev, color: COLOR_PALETTE[nextColorIndex].hex }))
      }

      // Set default order to last position
      if (data && data.length > 0 && !formData.order) {
        setFormData((prev) => ({ ...prev, order: (data.length + 1).toString() }))
      } else if (!formData.order) {
        setFormData((prev) => ({ ...prev, order: "1" }))
      }
    } catch (error) {
      console.error("Failed to fetch stages:", error)
    }
  }

  const validate = () => {
    const newErrors = {
      name: "",
      pipeline: "",
    }

    if (!formData.name.trim()) {
      newErrors.name = "Stage name is required"
    }

    if (!selectedPipeline) {
      newErrors.pipeline = "Pipeline is required"
    }

    setErrors(newErrors)
    return !newErrors.name && !newErrors.pipeline
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/stages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pipeline_id: selectedPipeline,
          name: formData.name.trim(),
          color: formData.color || COLOR_PALETTE[0].hex,
          order: formData.order ? Number.parseInt(formData.order) : stages.length + 1,
        }),
      })

      if (response.ok) {
        toast({
          title: "Stage added successfully",
          description: `${formData.name} has been added to the pipeline.`,
        })

        // Reset form
        setFormData({
          name: "",
          color: "",
          order: "",
        })

        // Trigger refresh of pipeline data
        window.dispatchEvent(new CustomEvent("stageCreated"))

        onClose()
      } else {
        const error = await response.json()
        toast({
          title: "Failed to add stage",
          description: error.error || "Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding stage:", error)
      toast({
        title: "Failed to add stage",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: "",
      color: "",
      order: "",
    })
    setErrors({ name: "", pipeline: "" })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">Add New Stage</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Add a new stage to your recruitment pipeline
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Pipeline Selection */}
          <div className="space-y-2">
            <Label htmlFor="pipeline" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <ListOrdered className="h-4 w-4 text-blue-600" />
              Pipeline <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select pipeline" />
              </SelectTrigger>
              <SelectContent>
                {pipelines.map((pipeline) => (
                  <SelectItem key={pipeline.id} value={pipeline.id.toString()}>
                    {pipeline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pipeline && <p className="text-xs text-red-600 mt-1">{errors.pipeline}</p>}
          </div>

          {/* Stage Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <ListOrdered className="h-4 w-4 text-purple-600" />
              Stage Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Initial Contact, Interview Scheduled"
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }))
                setErrors((prev) => ({ ...prev, name: "" }))
              }}
              className={
                errors.name ? "border-red-500 focus:ring-red-500" : "focus:border-blue-500 focus:ring-blue-500"
              }
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label htmlFor="color" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Palette className="h-4 w-4 text-pink-600" />
              Color (optional)
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, color: color.hex }))}
                  className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                    formData.color === color.hex
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-6 h-6 rounded ${color.value}`} />
                  <span className="text-xs font-medium">{color.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {formData.color ? "Selected color will be used for this stage" : "A color will be auto-assigned"}
            </p>
          </div>

          {/* Order Position */}
          <div className="space-y-2">
            <Label htmlFor="order" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Hash className="h-4 w-4 text-green-600" />
              Order Position (optional)
            </Label>
            <Input
              id="order"
              type="number"
              min="1"
              max={stages.length + 1}
              placeholder={`Position (1-${stages.length + 1})`}
              value={formData.order}
              onChange={(e) => setFormData((prev) => ({ ...prev, order: e.target.value }))}
              className="focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">Leave empty to add at the end. Current stages: {stages.length}</p>
          </div>

          <DialogFooter className="gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="hover:bg-gray-100 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Stage"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
