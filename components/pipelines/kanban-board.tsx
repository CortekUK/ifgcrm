"use client"

import type React from "react"

import { useState } from "react"
import { DealCard } from "./deal-card"
import { useToast } from "@/hooks/use-toast"
import { Inbox, MoreVertical, Plus, Edit, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DeleteStageDialog } from "./delete-stage-dialog"

interface Deal {
  id: number
  player_name: string
  programme: string
  recruiter: string
  last_activity: string
  deal_value: number
}

interface Stage {
  id: number
  name: string
  deals: Deal[]
  order: number
}

interface PipelineData {
  id: number
  name: string
  stages: Stage[]
}

interface KanbanBoardProps {
  pipelineData: PipelineData
  onDealClick: (deal: Deal) => void
  onDealMove: (dealId: number, newStageId: number) => void
  onStageEdit: (stageId: number, newName: string, newColor: string, newOrder: number) => void
  onAddDeal?: (stageId: number) => void
}

const STAGE_COLORS: Record<string, string> = {
  Scheduled: "#a855f7",
  "Zoom Scheduled": "#a855f7",
  "Reschedule Zoom": "#10b981",
  "Follow Up": "#facc15",
  "Collecting Documents": "#fb923c",
  Applied: "#f43f5e",
  "Conditional Offer": "#f97316",
  "Dormant Lead": "#1d4ed8",
  "Initial Lead": "#14b8a6",
  "In Contact": "#38bdf8",
  "Zoom Completed": "#a855f7",
  "Application Sent": "#10b981",
  Accepted: "#6b7280",
}

export function KanbanBoard({ pipelineData, onDealClick, onDealMove, onStageEdit, onAddDeal }: KanbanBoardProps) {
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null)
  const [draggedFromStageId, setDraggedFromStageId] = useState<number | null>(null)
  const [dragOverStageId, setDragOverStageId] = useState<number | null>(null)
  const [dragOverWonZone, setDragOverWonZone] = useState(false)
  const [dragOverLostZone, setDragOverLostZone] = useState(false)
  const { toast } = useToast()
  const [editingStage, setEditingStage] = useState<Stage | null>(null)
  const [isStageDrawerOpen, setIsStageDrawerOpen] = useState(false)
  const [deleteDialogStage, setDeleteDialogStage] = useState<Stage | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>("")

  const handleDragStart = (deal: Deal, stageId: number) => {
    setDraggedDeal(deal)
    setDraggedFromStageId(stageId)
  }

  const handleDragOver = (e: React.DragEvent, stageId: number) => {
    e.preventDefault()
    setDragOverStageId(stageId)
  }

  const handleDragLeave = () => {
    setDragOverStageId(null)
  }

  const handleDrop = async (e: React.DragEvent, targetStageId: number) => {
    e.preventDefault()
    setDragOverStageId(null)

    if (draggedDeal && draggedFromStageId !== targetStageId) {
      const targetStage = pipelineData.stages.find((s) => s.id === targetStageId)
      await onDealMove(draggedDeal.id, targetStageId)
      toast({
        title: "Stage updated",
        description: `Moved to ${targetStage?.name || "new stage"}`,
      })
    }

    setDraggedDeal(null)
    setDraggedFromStageId(null)
  }

  const handleStageEdit = (stage: Stage) => {
    setEditingStage(stage)
    setSelectedColor(STAGE_COLORS[stage.name] || "#6b7280")
    setIsStageDrawerOpen(true)
  }

  const handleSaveStageChanges = () => {
    if (editingStage) {
      const newName = document.getElementById("stage-name") as HTMLInputElement
      const newOrder = document.getElementById("stage-order") as HTMLInputElement
      onStageEdit(editingStage.id, newName.value, selectedColor, Number.parseInt(newOrder.value))
      setIsStageDrawerOpen(false)
    }
  }

  const handleStageDelete = async (stage: Stage, targetStageId?: number) => {
    try {
      if (stage.deals.length > 0 && targetStageId) {
        await fetch(`/api/pipelines/${pipelineData.id}/stages/${stage.id}/move-deals`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toStageId: targetStageId }),
        })
      }

      const response = await fetch(`/api/pipelines/${pipelineData.id}/stages/${stage.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Stage deleted",
          description: `${stage.name} has been removed from the pipeline.`,
        })

        window.dispatchEvent(new Event("stageDeleted"))
      }
    } catch (error) {
      console.error("Failed to delete stage:", error)
      toast({
        title: "Error",
        description: "Failed to delete stage. Please try again.",
        variant: "destructive",
      })
    }
  }

  const PRESET_COLORS = [
    "#14b8a6", // teal
    "#38bdf8", // sky
    "#a855f7", // purple
    "#10b981", // emerald
    "#fb923c", // orange
    "#f43f5e", // rose
    "#facc15", // yellow
    "#6b7280", // gray
  ]

  const handleWonZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverWonZone(true)
  }

  const handleWonZoneDragLeave = () => {
    setDragOverWonZone(false)
  }

  const handleWonZoneDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverWonZone(false)

    const dealId = e.dataTransfer.getData("dealId")
    if (!dealId || !draggedDeal) return

    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "won",
          closedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Deal marked as Won",
          description: `${draggedDeal.player_name}'s deal has been marked as won.`,
        })

        // Refresh the pipeline data to remove the deal
        window.dispatchEvent(new Event("dealCreated"))
      }
    } catch (error) {
      console.error("Failed to mark deal as won:", error)
      toast({
        title: "Error",
        description: "Failed to mark deal as won. Please try again.",
        variant: "destructive",
      })
    }

    setDraggedDeal(null)
    setDraggedFromStageId(null)
  }

  const handleLostZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverLostZone(true)
  }

  const handleLostZoneDragLeave = () => {
    setDragOverLostZone(false)
  }

  const handleLostZoneDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverLostZone(false)

    const dealId = e.dataTransfer.getData("dealId")
    if (!dealId || !draggedDeal) return

    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "lost",
          closedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Deal marked as Lost",
          description: `${draggedDeal.player_name}'s deal has been marked as lost.`,
        })

        // Refresh the pipeline data to remove the deal
        window.dispatchEvent(new Event("dealCreated"))
      }
    } catch (error) {
      console.error("Failed to mark deal as lost:", error)
      toast({
        title: "Error",
        description: "Failed to mark deal as lost. Please try again.",
        variant: "destructive",
      })
    }

    setDraggedDeal(null)
    setDraggedFromStageId(null)
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&display=swap" rel="stylesheet" />

      <div className="h-full overflow-x-auto overflow-y-hidden rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 flex gap-4">
          {/* Won Drop Zone */}
          <div
            className={`won-zone flex-1 rounded-lg border-2 border-dashed p-6 text-center transition-all ${
              dragOverWonZone
                ? "border-green-500 bg-green-50 scale-[1.02]"
                : "border-green-300 bg-green-50/50 hover:bg-green-50"
            }`}
            onDragOver={handleWonZoneDragOver}
            onDragLeave={handleWonZoneDragLeave}
            onDrop={handleWonZoneDrop}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm font-medium text-green-700">
                {dragOverWonZone ? "Drop to mark as Won" : "Drag a deal here to mark as Won"}
              </div>
              <div className="text-xs text-green-600">The deal will be closed and removed from the board</div>
            </div>
          </div>

          {/* Lost Drop Zone */}
          <div
            className={`lost-zone flex-1 rounded-lg border-2 border-dashed p-6 text-center transition-all ${
              dragOverLostZone
                ? "border-red-500 bg-red-50 scale-[1.02]"
                : "border-red-300 bg-red-50/50 hover:bg-red-50"
            }`}
            onDragOver={handleLostZoneDragOver}
            onDragLeave={handleLostZoneDragLeave}
            onDrop={handleLostZoneDrop}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm font-medium text-red-700">
                {dragOverLostZone ? "Drop to mark as Lost" : "Drag a deal here to mark as Lost"}
              </div>
              <div className="text-xs text-red-600">The deal will be closed and removed from the board</div>
            </div>
          </div>
        </div>

        <div className="inline-flex gap-4 pb-2 animate-fade-in-up">
          {pipelineData.stages.map((stage, index) => {
            const stageColor = STAGE_COLORS[stage.name] || "#6b7280"
            const isHovered = dragOverStageId === stage.id

            const stageTotal = stage.deals.reduce((sum, deal) => sum + (deal.deal_value || 0), 0)

            return (
              <div
                key={stage.id}
                className={`flex w-80 flex-shrink-0 flex-col rounded-lg bg-card ${
                  isHovered ? "ring-2 ring-primary ring-opacity-50" : ""
                } transition-all duration-200`}
                style={{
                  animationDelay: `${index * 80}ms`,
                  borderLeft: index > 0 ? "1px solid #E6E8F0" : "none",
                }}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div
                  className="px-4 rounded-t-lg border-b border-white/20"
                  style={{ backgroundColor: stageColor, paddingTop: "15px", paddingBottom: "12px" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-white text-sm"
                      style={{
                        fontFamily: "Oswald, sans-serif",
                        fontWeight: 500,
                        letterSpacing: "0.7px",
                        color: "#FFFFFF",
                      }}
                    >
                      {stage.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      {onAddDeal && (
                        <button
                          onClick={() => onAddDeal(stage.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-white/90 hover:bg-white/20 transition-colors"
                          title="Add deal to this stage"
                        >
                          <Plus className="h-3 w-3" />
                          Add deal
                        </button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex h-6 w-6 items-center justify-center rounded hover:bg-white/20 transition-colors">
                            <MoreVertical className="h-4 w-4 text-white" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStageEdit(stage)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Stage
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteDialogStage(stage)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Stage
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="space-y-0.5 text-xs text-white/90">
                    <div>{stage.deals.length} deals</div>
                    <div className="font-semibold">£{stageTotal.toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex-1 space-y-3 p-4 pt-3 overflow-y-auto max-h-[600px]">
                  {stage.deals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      stageName={stage.name}
                      onClick={() => onDealClick(deal)}
                      onDragStart={() => handleDragStart(deal, stage.id)}
                    />
                  ))}
                  {stage.deals.length === 0 && (
                    <div className="flex h-32 flex-col items-center justify-center text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-2">
                        <Inbox className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">No deals in this stage yet</p>
                      {onAddDeal && (
                        <button
                          onClick={() => onAddDeal(stage.id)}
                          className="text-sm text-primary hover:text-primary/80 hover:underline font-medium flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Add deal
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Dialog open={isStageDrawerOpen} onOpenChange={setIsStageDrawerOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] my-4 overflow-hidden p-0 flex flex-col">
          <div className="px-8 pt-8 pb-5 border-b border-border">
            <DialogHeader>
              <DialogTitle className="text-[26px] font-semibold tracking-tight leading-tight">Edit Stage</DialogTitle>
              <p className="text-[15px] text-muted-foreground mt-2 leading-relaxed">Customise your pipeline stage</p>
            </DialogHeader>
          </div>
          {editingStage && (
            <div className="px-8 py-8 space-y-8 overflow-y-auto max-h-[calc(100vh-180px)]">
              {/* Stage Name Section */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="stage-name" className="text-[15px] font-semibold text-foreground">
                    Stage Name
                  </Label>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Give this stage a descriptive name
                  </p>
                </div>
                <Input
                  id="stage-name"
                  defaultValue={editingStage.name}
                  placeholder="e.g. Initial Contact"
                  className="h-12 text-[15px] bg-background"
                />
              </div>

              {/* Stage Color Section */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-[15px] font-semibold text-foreground">Stage Colour</Label>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Choose a colour to represent this stage
                  </p>
                </div>

                <div className="space-y-4 bg-muted/30 rounded-lg p-5">
                  {/* Preset Colors */}
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Preset Colours
                    </p>
                    <div className="grid grid-cols-8 gap-2.5">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`h-11 w-11 rounded-lg border-2 transition-all hover:scale-105 active:scale-95 ${
                            selectedColor === color
                              ? "border-primary ring-4 ring-primary/20 shadow-lg"
                              : "border-border hover:border-border/60"
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Custom Color Picker */}
                  <div className="space-y-3 pt-3 border-t border-border/50">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Custom Colour
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="color"
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                          className="h-12 w-20 cursor-pointer rounded-lg border-2 border-border"
                          title="Pick a custom colour"
                        />
                      </div>
                      <Input
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        placeholder="#000000"
                        className="h-12 flex-1 font-mono text-[13px] bg-background"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Display Order Section */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="stage-order" className="text-[15px] font-semibold text-foreground">
                    Display Order
                  </Label>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Position of this stage in the pipeline (left to right)
                  </p>
                </div>
                <Input
                  id="stage-order"
                  type="number"
                  min="1"
                  defaultValue={editingStage.order}
                  placeholder="1"
                  className="h-12 text-[15px] bg-background"
                />
              </div>
            </div>
          )}

          <div className="px-8 py-6 border-t border-border bg-muted/20">
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 h-12 text-[15px] font-medium shadow-sm gradient-primary"
                onClick={handleSaveStageChanges}
              >
                Save Changes
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 h-12 text-[15px] font-medium bg-background"
                onClick={() => setIsStageDrawerOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteStageDialog
        stage={deleteDialogStage}
        availableStages={pipelineData.stages.filter((s) => s.id !== deleteDialogStage?.id)}
        open={!!deleteDialogStage}
        onClose={() => setDeleteDialogStage(null)}
        onConfirm={handleStageDelete}
      />
    </>
  )
}
