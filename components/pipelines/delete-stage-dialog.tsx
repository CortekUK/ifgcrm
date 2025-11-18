"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"

interface Stage {
  id: number
  name: string
  deals: any[]
  order: number
}

interface DeleteStageDialogProps {
  stage: Stage | null
  availableStages: Stage[]
  open: boolean
  onClose: () => void
  onConfirm: (stage: Stage, targetStageId?: number) => void
}

export function DeleteStageDialog({ stage, availableStages, open, onClose, onConfirm }: DeleteStageDialogProps) {
  const [selectedTargetStage, setSelectedTargetStage] = useState<string>("")
  const [isDeleting, setIsDeleting] = useState(false)

  if (!stage) return null

  const hasDeals = stage.deals.length > 0
  const dealCount = stage.deals.length

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      if (hasDeals && selectedTargetStage) {
        await onConfirm(stage, Number.parseInt(selectedTargetStage))
      } else {
        await onConfirm(stage)
      }
      onClose()
      setSelectedTargetStage("")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      onClose()
      setSelectedTargetStage("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Stage
          </DialogTitle>
          <DialogDescription>
            {hasDeals
              ? `This stage contains ${dealCount} deal${dealCount > 1 ? "s" : ""}. Please select where to move ${dealCount > 1 ? "them" : "it"} before deleting.`
              : "Are you sure you want to delete this stage? This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-muted/50 p-3 border border-border">
            <p className="text-sm font-medium text-foreground">Stage to delete:</p>
            <p className="text-sm text-muted-foreground mt-1">{stage.name}</p>
          </div>

          {hasDeals && availableStages.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="target-stage">Move deals to</Label>
              <Select value={selectedTargetStage} onValueChange={setSelectedTargetStage}>
                <SelectTrigger id="target-stage">
                  <SelectValue placeholder="Select a stage" />
                </SelectTrigger>
                <SelectContent>
                  {availableStages.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.name} ({s.deals.length} deals)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!selectedTargetStage && (
                <p className="text-xs text-muted-foreground">You must select a target stage to move the deals to.</p>
              )}
            </div>
          )}

          {hasDeals && availableStages.length === 0 && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
              <p className="text-sm text-destructive">
                Cannot delete this stage. There are no other stages to move the deals to. Please create another stage
                first.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting || (hasDeals && (!selectedTargetStage || availableStages.length === 0))}
          >
            {isDeleting ? "Deleting..." : "Delete Stage"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
