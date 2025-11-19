"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Programme {
  id: number
  name: string
  pipelineId: number | null
  pipelineName: string | null
  active: boolean
}

interface Pipeline {
  id: number
  name: string
}

export function ProgrammesPanel() {
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingProgramme, setEditingProgramme] = useState<Programme | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    pipelineId: "none",
    active: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchProgrammes()
    fetchPipelines()
  }, [])

  const fetchProgrammes = async () => {
    const res = await fetch("/api/settings/programmes")
    const data = await res.json()
    setProgrammes(data)
  }

  const fetchPipelines = async () => {
    const res = await fetch("/api/pipelines")
    const data = await res.json()
    setPipelines(data)
  }

  const handleEdit = (programme: Programme) => {
    setEditingProgramme(programme)
    setFormData({
      name: programme.name,
      pipelineId: programme.pipelineId ? programme.pipelineId.toString() : "none",
      active: programme.active,
    })
    setIsDrawerOpen(true)
  }

  const handleAdd = () => {
    setEditingProgramme(null)
    setFormData({ name: "", pipelineId: "none", active: true })
    setIsDrawerOpen(true)
  }

  const handleToggleActive = async (programme: Programme) => {
    const res = await fetch(`/api/settings/programmes/${programme.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !programme.active }),
    })

    if (res.ok) {
      toast({ title: `Programme ${!programme.active ? "activated" : "deactivated"}` })
      fetchProgrammes()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editingProgramme ? `/api/settings/programmes/${editingProgramme.id}` : "/api/settings/programmes"
    const method = editingProgramme ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        pipelineId: formData.pipelineId === "none" ? null : Number.parseInt(formData.pipelineId),
        active: formData.active,
      }),
    })

    if (res.ok) {
      toast({ title: editingProgramme ? "Programme updated" : "Programme created" })
      setIsDrawerOpen(false)
      setFormData({ name: "", pipelineId: "none", active: true })
      setEditingProgramme(null)
      fetchProgrammes()
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Programmes</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage active recruitment programmes and link them to pipelines
            </p>
          </div>
          <Button onClick={handleAdd} size="sm" className="gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add programme
          </Button>
        </div>
      </div>

      {programmes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <GraduationCap className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-sm font-medium text-foreground">No programmes yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">Create your first one to start assigning players.</p>
          <Button onClick={handleAdd} size="sm" className="gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add programme
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border shadow-sm">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Programme name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Linked pipeline
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Active
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {programmes.map((programme, index) => (
                <tr
                  key={programme.id}
                  onMouseEnter={() => setHoveredRow(programme.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`transition-all duration-200 ${
                    index % 2 === 0 ? "bg-card" : "bg-muted/30"
                  } hover:bg-muted`}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-foreground">{programme.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                    {programme.pipelineName || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Switch
                      checked={programme.active}
                      onCheckedChange={() => handleToggleActive(programme)}
                      className="transition-all duration-200"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(programme)}
                      className={`transition-opacity duration-200 ${
                        hoveredRow === programme.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] my-4 flex flex-col overflow-hidden p-0">
          <div className="px-6 pt-6 pb-4 border-b">
            <DialogHeader>
              <DialogTitle>{editingProgramme ? "Edit programme" : "Add programme"}</DialogTitle>
              <DialogDescription>
                {editingProgramme
                  ? "Update the programme details below"
                  : "Create a new programme for managing player recruitment"}
              </DialogDescription>
            </DialogHeader>
          </div>
          <form id="programme-form" onSubmit={handleSubmit} className="overflow-y-auto px-6 py-4 flex-1">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Programme name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. US College 2026"
                  required
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pipeline">Linked pipeline</Label>
                <Select
                  value={formData.pipelineId}
                  onValueChange={(value) => setFormData({ ...formData, pipelineId: value })}
                >
                  <SelectTrigger id="pipeline" className="bg-background">
                    <SelectValue placeholder="Select a pipeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {pipelines.map((pipeline) => (
                      <SelectItem key={pipeline.id} value={pipeline.id.toString()}>
                        {pipeline.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
                <div>
                  <Label htmlFor="active" className="font-medium">
                    Active
                  </Label>
                  <p className="text-xs text-muted-foreground">Make this programme available for assignment</p>
                </div>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  className="transition-all duration-150"
                />
              </div>
            </div>
          </form>
          <div className="px-6 py-4 border-t">
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" form="programme-form" className="gradient-primary">
                {editingProgramme ? "Save changes" : "Save programme"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
