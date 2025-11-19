"use client"

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
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Users, UserPlus, UserMinus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PlayerGroup {
  id: string
  name: string
  description: string
  playerIds: number[]
  color: string
  createdAt: string
  updatedAt: string
  playerCount: number
}

interface Player {
  id: number
  name: string
  email: string
  programme: string
  status: string
}

interface ManagePlayersDialogProps {
  group: PlayerGroup
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ManagePlayersDialog({ group, open, onOpenChange, onSuccess }: ManagePlayersDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlayers, setSelectedPlayers] = useState<Set<number>>(new Set())
  const [activeTab, setActiveTab] = useState("add")

  useEffect(() => {
    if (open) {
      fetchAllPlayers()
      setSelectedPlayers(new Set())
      setSearchTerm("")
      setActiveTab("add")
    }
  }, [open])

  const fetchAllPlayers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/players?pageSize=200")
      const data = await response.json()
      setAllPlayers(data.data)
    } catch (error) {
      console.error("Error fetching players:", error)
      toast({
        title: "Error",
        description: "Failed to fetch players",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePlayer = (playerId: number) => {
    const newSelection = new Set(selectedPlayers)
    if (newSelection.has(playerId)) {
      newSelection.delete(playerId)
    } else {
      newSelection.add(playerId)
    }
    setSelectedPlayers(newSelection)
  }

  const handleSelectAll = (players: Player[]) => {
    const newSelection = new Set(selectedPlayers)
    players.forEach((player) => {
      newSelection.add(player.id)
    })
    setSelectedPlayers(newSelection)
  }

  const handleDeselectAll = () => {
    setSelectedPlayers(new Set())
  }

  const handleSave = async () => {
    if (selectedPlayers.size === 0) {
      toast({
        title: "No players selected",
        description: "Please select at least one player",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const action = activeTab === "add" ? "add" : "remove"
      const response = await fetch(`/api/player-groups/${group.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          playerIds: Array.from(selectedPlayers),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Players ${action === "add" ? "added to" : "removed from"} group successfully`,
        })
        onSuccess()
        onOpenChange(false)
      } else {
        throw new Error(`Failed to ${action} players`)
      }
    } catch (error) {
      console.error(`Error ${activeTab}ing players:`, error)
      toast({
        title: "Error",
        description: `Failed to ${activeTab} players`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = allPlayers.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "add") {
      // Show players not in the group
      return matchesSearch && !group.playerIds.includes(player.id)
    } else {
      // Show players in the group
      return matchesSearch && group.playerIds.includes(player.id)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Players in "{group.name}"</DialogTitle>
          <DialogDescription>
            Add or remove players from this group. Currently {group.playerCount} players.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Players
            </TabsTrigger>
            <TabsTrigger value="remove">
              <UserMinus className="mr-2 h-4 w-4" />
              Remove Players
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAll(filteredPlayers)}
                  disabled={loading}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAll}
                  disabled={loading}
                >
                  Clear
                </Button>
              </div>
            </div>

            <TabsContent value="add" className="mt-0">
              <Label className="text-sm text-muted-foreground mb-2 block">
                Select players to add to the group ({filteredPlayers.length} available)
              </Label>
            </TabsContent>

            <TabsContent value="remove" className="mt-0">
              <Label className="text-sm text-muted-foreground mb-2 block">
                Select players to remove from the group ({filteredPlayers.length} in group)
              </Label>
            </TabsContent>

            <ScrollArea className="h-[300px] border rounded-lg p-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading players...
                </div>
              ) : filteredPlayers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {activeTab === "add"
                    ? "No players available to add"
                    : "No players in this group"}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center space-x-3 p-2 rounded hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`player-${player.id}`}
                        checked={selectedPlayers.has(player.id)}
                        onCheckedChange={() => handleTogglePlayer(player.id)}
                      />
                      <label
                        htmlFor={`player-${player.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {player.email} • {player.programme}
                        </div>
                      </label>
                      <Badge variant="outline">{player.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {selectedPlayers.size} player{selectedPlayers.size !== 1 ? "s" : ""} selected
              </div>
            </div>
          </div>
        </Tabs>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || selectedPlayers.size === 0}
          >
            {loading
              ? "Processing..."
              : activeTab === "add"
                ? `Add ${selectedPlayers.size} Player${selectedPlayers.size !== 1 ? "s" : ""}`
                : `Remove ${selectedPlayers.size} Player${selectedPlayers.size !== 1 ? "s" : ""}`
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}