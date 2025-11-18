"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from 'lucide-react'

interface BulkListModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (listId: string) => void
  action: "add" | "remove"
  lists: Array<{ id: number; name: string }>
}

export function BulkListModal({ open, onClose, onSubmit, action, lists }: BulkListModalProps) {
  const [selectedList, setSelectedList] = useState<string>("")
  const [newListName, setNewListName] = useState("")
  const [showCreateNew, setShowCreateNew] = useState(false)

  const handleSubmit = async () => {
    if (showCreateNew && newListName) {
      const response = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newListName, type: "static" }),
      })
      const newList = await response.json()
      onSubmit(newList.id.toString())
    } else if (selectedList) {
      onSubmit(selectedList)
    }
    setSelectedList("")
    setNewListName("")
    setShowCreateNew(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{action === "add" ? "Add to List" : "Remove from List"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!showCreateNew ? (
            <>
              <div>
                <Label>Select list</Label>
                <Select value={selectedList} onValueChange={setSelectedList}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a list" />
                  </SelectTrigger>
                  <SelectContent>
                    {lists.map((list) => (
                      <SelectItem key={list.id} value={list.id.toString()}>
                        {list.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {action === "add" && (
                <Button
                  variant="outline"
                  onClick={() => setShowCreateNew(true)}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create new list
                </Button>
              )}
            </>
          ) : (
            <div>
              <Label>New list name</Label>
              <Input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter list name"
                className="mt-2"
              />
              <Button
                variant="ghost"
                onClick={() => setShowCreateNew(false)}
                className="mt-2 text-sm"
              >
                Choose existing list instead
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedList && !newListName}
            className="bg-gradient-to-r from-blue-600 to-blue-700"
          >
            {action === "add" ? "Add to list" : "Remove from list"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
