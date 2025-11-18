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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, User, GraduationCap, ListOrdered, UserCircle2, DollarSign, FileText } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreateDealModalProps {
  open: boolean
  onClose: () => void
  preSelectedStageId?: number | null
  onDealCreated?: (deal: any) => void // Add callback for optimistic update
}

interface Player {
  id: number
  name: string
  email: string
}

interface Programme {
  id: number
  name: string
}

interface Stage {
  id: number
  name: string
}

interface Recruiter {
  id: number
  name: string
}

export function CreateDealModal({ open, onClose, preSelectedStageId, onDealCreated }: CreateDealModalProps) {
  const [loading, setLoading] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [playerOpen, setPlayerOpen] = useState(false)

  const [formData, setFormData] = useState({
    player_id: "",
    player_name: "",
    programme_id: "",
    stage_id: "",
    recruiter_id: "",
    deal_value: "",
    notes: "",
  })

  const [errors, setErrors] = useState({
    player_name: "",
    programme_id: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      fetchPlayers()
      fetchProgrammes()
      fetchRecruiters()
    }
  }, [open])

  useEffect(() => {
    if (formData.programme_id) {
      fetchStages(formData.programme_id)
    }
  }, [formData.programme_id])

  useEffect(() => {
    if (preSelectedStageId && stages.length > 0) {
      const stageExists = stages.find((s) => s.id === preSelectedStageId)
      if (stageExists) {
        setFormData((prev) => ({ ...prev, stage_id: preSelectedStageId.toString() }))
      }
    }
  }, [preSelectedStageId, stages])

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players")
      const data = await response.json()
      setPlayers(data.data || [])
    } catch (error) {
      console.error("Failed to fetch players:", error)
    }
  }

  const fetchProgrammes = async () => {
    try {
      const response = await fetch("/api/settings/programmes")
      const data = await response.json()
      setProgrammes(data || [])
    } catch (error) {
      console.error("Failed to fetch programmes:", error)
    }
  }

  const fetchStages = async (programmeId: string) => {
    try {
      const response = await fetch(`/api/pipelines/${programmeId}/stages?stagesOnly=true`)
      const data = await response.json()
      setStages(data || [])
      // Auto-select first stage if none selected
      if (data && data.length > 0 && !formData.stage_id) {
        setFormData((prev) => ({ ...prev, stage_id: data[0].id.toString() }))
      }
    } catch (error) {
      console.error("Failed to fetch stages:", error)
    }
  }

  const fetchRecruiters = async () => {
    try {
      const response = await fetch("/api/settings/recruiters")
      const data = await response.json()
      setRecruiters(data || [])
    } catch (error) {
      console.error("Failed to fetch recruiters:", error)
    }
  }

  const validate = () => {
    const newErrors = {
      player_name: "",
      programme_id: "",
    }

    if (!formData.player_name) {
      newErrors.player_name = "Player name is required"
    }

    if (!formData.programme_id) {
      newErrors.programme_id = "Programme is required"
    }

    setErrors(newErrors)
    return !newErrors.player_name && !newErrors.programme_id
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_id: formData.player_id || null,
          player_name: formData.player_name,
          pipeline_id: formData.programme_id,
          stage_id: formData.stage_id,
          recruiter_id: formData.recruiter_id,
          value: formData.deal_value ? Number.parseFloat(formData.deal_value) : null,
          notes: formData.notes,
        }),
      })

      if (response.ok) {
        const newDeal = await response.json()

        toast({
          title: "Deal created",
          description: `${formData.player_name} has been added to the pipeline.`,
        })

        // Reset form
        setFormData({
          player_id: "",
          player_name: "",
          programme_id: "",
          stage_id: "",
          recruiter_id: "",
          deal_value: "",
          notes: "",
        })

        if (onDealCreated) {
          onDealCreated(newDeal)
        }

        onClose()
      } else {
        const error = await response.json()
        toast({
          title: "Failed to create deal",
          description: error.error || "Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error creating deal:", error)
      toast({
        title: "Failed to create deal",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      player_id: "",
      player_name: "",
      programme_id: "",
      stage_id: "",
      recruiter_id: "",
      deal_value: "",
      notes: "",
    })
    setErrors({ player_name: "", programme_id: "" })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">Create New Deal</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Add a new player to your recruitment pipeline
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Player Name - Autocomplete */}
          <div className="space-y-2">
            <Label htmlFor="player_name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Player Name <span className="text-red-500">*</span>
            </Label>
            <Popover open={playerOpen} onOpenChange={setPlayerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={playerOpen}
                  className={cn(
                    "w-full justify-between",
                    !formData.player_name && "text-muted-foreground",
                    errors.player_name && "border-red-500 focus:ring-red-500",
                  )}
                >
                  {formData.player_name || "Select or type player name..."}
                  <Check className={cn("ml-2 h-4 w-4", formData.player_name ? "opacity-100" : "opacity-0")} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[460px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search players..."
                    value={formData.player_name}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, player_name: value, player_id: "" }))
                      setErrors((prev) => ({ ...prev, player_name: "" }))
                    }}
                  />
                  <CommandList>
                    <CommandEmpty>No player found. Keep typing to add new player.</CommandEmpty>
                    <CommandGroup>
                      {players.map((player) => (
                        <CommandItem
                          key={player.id}
                          value={player.name}
                          onSelect={() => {
                            setFormData((prev) => ({
                              ...prev,
                              player_id: player.id.toString(),
                              player_name: player.name,
                            }))
                            setErrors((prev) => ({ ...prev, player_name: "" }))
                            setPlayerOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.player_id === player.id.toString() ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <div>
                            <div className="font-medium">{player.name}</div>
                            <div className="text-xs text-gray-500">{player.email}</div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.player_name && <p className="text-xs text-red-600 mt-1">{errors.player_name}</p>}
          </div>

          {/* Programme */}
          <div className="space-y-2">
            <Label htmlFor="programme" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-purple-600" />
              Programme <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.programme_id}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, programme_id: value, stage_id: "" }))
                setErrors((prev) => ({ ...prev, programme_id: "" }))
              }}
            >
              <SelectTrigger className={cn("w-full", errors.programme_id && "border-red-500 focus:ring-red-500")}>
                <SelectValue placeholder="Select programme" />
              </SelectTrigger>
              <SelectContent>
                {programmes.map((programme) => (
                  <SelectItem key={programme.id} value={programme.id.toString()}>
                    {programme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.programme_id && <p className="text-xs text-red-600 mt-1">{errors.programme_id}</p>}
          </div>

          {/* Stage */}
          <div className="space-y-2">
            <Label htmlFor="stage" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <ListOrdered className="h-4 w-4 text-green-600" />
              Stage
            </Label>
            <Select
              value={formData.stage_id}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, stage_id: value }))}
              disabled={!formData.programme_id}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={formData.programme_id ? "Select stage" : "Select programme first"} />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id.toString()}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Assigned Recruiter */}
          <div className="space-y-2">
            <Label htmlFor="recruiter" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <UserCircle2 className="h-4 w-4 text-blue-600" />
              Assigned Recruiter
            </Label>
            <Select
              value={formData.recruiter_id}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, recruiter_id: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select recruiter" />
              </SelectTrigger>
              <SelectContent>
                {recruiters.map((recruiter) => (
                  <SelectItem key={recruiter.id} value={recruiter.id.toString()}>
                    {recruiter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Deal Value */}
          <div className="space-y-2">
            <Label htmlFor="deal_value" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Deal Value (£)
            </Label>
            <Input
              id="deal_value"
              type="number"
              placeholder="0.00"
              value={formData.deal_value}
              onChange={(e) => setFormData((prev) => ({ ...prev, deal_value: e.target.value }))}
              className="focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-600" />
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              className="resize-none focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
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
                "Create Deal"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
