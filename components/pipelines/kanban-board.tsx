"use client"

import type React from "react"

import { useState } from "react"
import { DealCard } from "./deal-card"
import { useToast } from "@/hooks/use-toast"
import { Inbox, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

export function KanbanBoard({ pipelineData, onDealClick, onDealMove, onStageEdit }: KanbanBoardProps) {
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null)
  const [draggedFromStageId, setDraggedFromStageId] = useState<number | null>(null)
  const [dragOverStageId, setDragOverStageId] = useState<number | null>(null)
  const { toast } = useToast()
  const [editingStage, setEditingStage] = useState<Stage | null>(null)
  const [isStageDrawerOpen, setIsStageDrawerOpen] = useState(false)

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
    setIsStageDrawerOpen(true)
  }

  const handleSaveStageChanges = () => {
    if (editingStage) {
      const newName = document.getElementById("stage-name") as HTMLInputElement
      const newColor = document.getElementById("stage-color") as HTMLInputElement
      const newOrder = document.getElementById("stage-order") as HTMLInputElement
      onStageEdit(editingStage.id, newName.value, newColor.value, Number.parseInt(newOrder.value))
      setIsStageDrawerOpen(false)
    }
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600&display=swap" rel="stylesheet" />

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div
          className="inline-flex gap-4 pb-2 animate-fade-in-up"
          style={{ minWidth: "100%", scrollSnapType: "x mandatory" }}
        >
          {pipelineData.stages.map((stage, index) => {
            const stageColor = STAGE_COLORS[stage.name] || "#6b7280"
            const isHovered = dragOverStageId === stage.id

            const stageTotal = stage.deals.reduce((sum, deal) => sum + (deal.deal_value || 0), 0)

            return (
              <div
                key={stage.id}
                className={`flex w-80 flex-shrink-0 flex-col rounded-lg bg-white ${
                  isHovered ? "ring-2 ring-blue-400 ring-opacity-50" : ""
                } transition-all duration-200`}
                style={{
                  scrollSnapAlign: "start",
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
                    <button
                      onClick={() => handleStageEdit(stage)}
                      className="flex h-6 w-6 items-center justify-center rounded hover:bg-white/20 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <div className="space-y-0.5 text-xs text-white/90">
                    <div>{stage.deals.length} deals</div>
                    <div className="font-semibold">£{stageTotal.toLocaleString()}</div>
                  </div>
                </div>
                {/* </CHANGE> */}

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
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-2">
                        <Inbox className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-400">No deals in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <Sheet open={isStageDrawerOpen} onOpenChange={setIsStageDrawerOpen}>
        <SheetContent className="w-[440px] sm:max-w-[440px]">
          <SheetHeader>
            <SheetTitle>Edit Stage</SheetTitle>
          </SheetHeader>
          {editingStage && (
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="stage-name">Stage Name</Label>
                <Input id="stage-name" defaultValue={editingStage.name} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="stage-color">Stage Color</Label>
                <div className="mt-1.5 flex gap-2">
                  <Input
                    id="stage-color"
                    type="color"
                    defaultValue={STAGE_COLORS[editingStage.name] || "#6b7280"}
                    className="h-10 w-20"
                  />
                  <Input defaultValue={STAGE_COLORS[editingStage.name] || "#6b7280"} className="flex-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="stage-order">Display Order</Label>
                <Input id="stage-order" type="number" defaultValue={editingStage.order} className="mt-1.5" />
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 gradient-primary" onClick={handleSaveStageChanges}>
                  Save Changes
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsStageDrawerOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
