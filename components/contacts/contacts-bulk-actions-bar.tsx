"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ListPlus, ListMinus, Download, X } from 'lucide-react'

interface ContactsBulkActionsBarProps {
  selectedCount: number
  onAddToList: () => void
  onRemoveFromList: () => void
  onExportSelected: () => void
  onClearSelection: () => void
}

export function ContactsBulkActionsBar({
  selectedCount,
  onAddToList,
  onRemoveFromList,
  onExportSelected,
  onClearSelection,
}: ContactsBulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <Card className="mb-4 bg-blue-50/50 border-blue-200/60 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-900">
            {selectedCount} contact{selectedCount !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <Button
              onClick={onAddToList}
              size="sm"
              className="gap-1.5 h-9 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 shadow-sm"
            >
              <ListPlus className="h-3.5 w-3.5" />
              Add to list
            </Button>
            <Button
              onClick={onRemoveFromList}
              size="sm"
              className="gap-1.5 h-9 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 shadow-sm"
            >
              <ListMinus className="h-3.5 w-3.5" />
              Remove from list
            </Button>
            <Button
              onClick={onExportSelected}
              size="sm"
              className="gap-1.5 h-9 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
        <Button
          onClick={onClearSelection}
          variant="ghost"
          size="sm"
          className="h-9 text-gray-600 hover:text-gray-900 hover:bg-white/60"
        >
          <X className="h-4 w-4 mr-1" />
          Clear selection
        </Button>
      </div>
    </Card>
  )
}
