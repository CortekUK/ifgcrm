"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Search, MoreHorizontal, Edit, Trash2, Users, Copy } from "lucide-react"
import { CreateGroupDialog } from "./create-group-dialog"
import { EditGroupDialog } from "./edit-group-dialog"
import { ManagePlayersDialog } from "./manage-players-dialog"
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

export function PlayerGroupsTable() {
  const { toast } = useToast()
  const [groups, setGroups] = useState<PlayerGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editGroup, setEditGroup] = useState<PlayerGroup | null>(null)
  const [manageGroup, setManageGroup] = useState<PlayerGroup | null>(null)

  useEffect(() => {
    fetchGroups()
  }, [search])

  const fetchGroups = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)

      const response = await fetch(`/api/player-groups?${params}`)
      const data = await response.json()
      setGroups(data.data)
    } catch (error) {
      console.error("Error fetching groups:", error)
      toast({
        title: "Error",
        description: "Failed to fetch player groups",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGroup = async (id: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return

    try {
      const response = await fetch(`/api/player-groups?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Group deleted successfully",
        })
        fetchGroups()
      } else {
        throw new Error("Failed to delete group")
      }
    } catch (error) {
      console.error("Error deleting group:", error)
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive",
      })
    }
  }

  const handleDuplicateGroup = async (group: PlayerGroup) => {
    try {
      const response = await fetch("/api/player-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${group.name} (Copy)`,
          description: group.description,
          playerIds: group.playerIds,
          color: group.color,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Group duplicated successfully",
        })
        fetchGroups()
      } else {
        throw new Error("Failed to duplicate group")
      }
    } catch (error) {
      console.error("Error duplicating group:", error)
      toast({
        title: "Error",
        description: "Failed to duplicate group",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Player Groups</CardTitle>
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Group
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Group Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Players</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading groups...
                    </TableCell>
                  </TableRow>
                ) : groups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No groups found. Create your first group to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  groups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: group.color }}
                          />
                          {group.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {group.description || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {group.playerCount} players
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(group.createdAt)}</TableCell>
                      <TableCell>{formatDate(group.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setManageGroup(group)}
                            >
                              <Users className="mr-2 h-4 w-4" />
                              Manage Players
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setEditGroup(group)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Group
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicateGroup(group)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteGroup(group.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CreateGroupDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => {
          setCreateOpen(false)
          fetchGroups()
        }}
      />

      {editGroup && (
        <EditGroupDialog
          group={editGroup}
          open={!!editGroup}
          onOpenChange={(open) => !open && setEditGroup(null)}
          onSuccess={() => {
            setEditGroup(null)
            fetchGroups()
          }}
        />
      )}

      {manageGroup && (
        <ManagePlayersDialog
          group={manageGroup}
          open={!!manageGroup}
          onOpenChange={(open) => !open && setManageGroup(null)}
          onSuccess={() => {
            fetchGroups()
          }}
        />
      )}
    </>
  )
}