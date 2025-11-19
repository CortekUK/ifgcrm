"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Settings, Workflow } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Pipeline {
  id: number
  name: string
  stageCount: number
  linkedProgrammes: string
}

interface Stage {
  id: number
  name: string
  order: number
  color: string
}

export function PipelinesPanel() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditStagesOpen, setIsEditStagesOpen] = useState(false)
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null)
  const [stages, setStages] = useState<Stage[]>([])
  const [newPipelineName, setNewPipelineName] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchPipelines()
  }, [])

  const fetchPipelines = async () => {
    const res = await fetch("/api/pipelines")
    const data = await res.json()
    setPipelines(data)
  }

  const fetchStages = async (pipelineId: number) => {
    const res = await fetch(`/api/pipelines/${pipelineId}/stages`)
    const data = await res.json()
    setStages(data)
  }

  const handleCreatePipeline = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/pipelines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newPipelineName }),
    })

    if (res.ok) {
      toast({ title: "Pipeline created successfully" })
      setIsCreateOpen(false)
      setNewPipelineName("")
      fetchPipelines()
    }
  }

  const handleEditStages = async (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline)
    await fetchStages(pipeline.id)
    setIsEditStagesOpen(true)
  }

  const handleAddStage = () => {
    const newStage: Stage = {
      id: Date.now(),
      name: "",
      order: stages.length + 1,
      color: "#3b82f6",
    }
    setStages([...stages, newStage])
  }

  const handleUpdateStage = (id: number, field: string, value: string | number) => {
    setStages(stages.map((stage) => (stage.id === id ? { ...stage, [field]: value } : stage)))
  }

  const handleSaveStages = async () => {
    if (!selectedPipeline) return

    const res = await fetch(`/api/pipelines/${selectedPipeline.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stages }),
    })

    if (res.ok) {
      toast({ title: "Stages updated successfully" })
      setIsEditStagesOpen(false)
      fetchPipelines()
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Pipelines</h2>
            <p className="mt-1 text-sm text-gray-500">Manage deal pipelines and their stages</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} size="sm" className="gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add pipeline
          </Button>
        </div>
      </div>

      {pipelines.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Workflow className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-sm font-medium text-gray-900">No pipelines yet</h3>
          <p className="mb-4 text-sm text-gray-500">Create your first pipeline to organize your deals.</p>
          <Button onClick={() => setIsCreateOpen(true)} size="sm" className="gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add pipeline
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Pipeline name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Linked programmes
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Stages
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {pipelines.map((pipeline, index) => (
                <tr
                  key={pipeline.id}
                  className={`transition-colors duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{pipeline.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {pipeline.linkedProgrammes || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{pipeline.stageCount}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditStages(pipeline)}
                      className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Edit stages
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="w-[440px] bg-gray-50 transition-transform duration-250 ease-in-out sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Add pipeline</SheetTitle>
            <SheetDescription>Create a new pipeline for managing deals</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleCreatePipeline} className="mt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pipeline-name">Pipeline name *</Label>
                <Input
                  id="pipeline-name"
                  value={newPipelineName}
                  onChange={(e) => setNewPipelineName(e.target.value)}
                  placeholder="e.g. US College Recruitment"
                  required
                  className="bg-white"
                />
              </div>
            </div>
            <SheetFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary">
                Create pipeline
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Sheet open={isEditStagesOpen} onOpenChange={setIsEditStagesOpen}>
        <SheetContent className="w-[440px] bg-gray-50 transition-transform duration-250 ease-in-out sm:max-w-none">
          <SheetHeader>
            <SheetTitle>Edit stages: {selectedPipeline?.name}</SheetTitle>
            <SheetDescription>Manage the stages for this pipeline</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              {stages.map((stage, index) => (
                <div key={stage.id} className="space-y-2 rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-sm font-medium text-gray-500">{index + 1}.</span>
                    <Input
                      value={stage.name}
                      onChange={(e) => handleUpdateStage(stage.id, "name", e.target.value)}
                      placeholder="Stage name"
                      className="flex-1"
                    />
                  </div>
                  <div className="ml-11 grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500">Color</Label>
                      <Input
                        type="color"
                        value={stage.color}
                        onChange={(e) => handleUpdateStage(stage.id, "color", e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Order</Label>
                      <Input
                        type="number"
                        value={stage.order}
                        onChange={(e) => handleUpdateStage(stage.id, "order", Number.parseInt(e.target.value))}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={handleAddStage} className="w-full border-dashed bg-white">
              <Plus className="mr-2 h-4 w-4" />
              Add stage
            </Button>
          </div>
          <SheetFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setIsEditStagesOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStages} className="gradient-primary">
              Save stages
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
