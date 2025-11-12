"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlayerDrawer } from "./player-drawer"
import { AddPlayerDrawer } from "./add-player-drawer"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Plus, GraduationCap, Upload, Download, Send, Tag, X } from "lucide-react"

interface Player {
  id: number
  name: string
  email: string
  phone: string
  programme: string
  recruiter: string
  status: string
  last_activity: string
  tags?: string[]
}

interface Programme {
  id: number
  name: string
}

interface Recruiter {
  id: number
  name: string
}

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase()
  if (statusLower.includes("pipeline") || statusLower.includes("in pipeline")) {
    return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 transition-colors"
  }
  if (statusLower.includes("contact")) {
    return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 transition-colors"
  }
  if (statusLower.includes("sign")) {
    return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 transition-colors"
  }
  if (statusLower.includes("interview")) {
    return "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 transition-colors"
  }
  return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 transition-colors"
}

const getTagColor = (tag: string) => {
  const colors = [
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-green-100 text-green-700 border-green-200",
    "bg-amber-100 text-amber-700 border-amber-200",
    "bg-pink-100 text-pink-700 border-pink-200",
    "bg-cyan-100 text-cyan-700 border-cyan-200",
  ]
  const index = tag.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[index % colors.length]
}

export function PlayersTable() {
  const [players, setPlayers] = useState<Player[]>([])
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [addDrawerOpen, setAddDrawerOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  const [search, setSearch] = useState("")
  const [selectedProgramme, setSelectedProgramme] = useState<string>("all")
  const [selectedRecruiter, setSelectedRecruiter] = useState<string>("all")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pageSize] = useState(25)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProgrammes()
    fetchRecruiters()
  }, [])

  useEffect(() => {
    fetchPlayers()
  }, [search, selectedProgramme, selectedRecruiter, selectedTag, selectedStatus, page])

  const fetchProgrammes = async () => {
    const response = await fetch("/api/settings/programmes")
    const data = await response.json()
    setProgrammes(data)
  }

  const fetchRecruiters = async () => {
    const response = await fetch("/api/settings/recruiters")
    const data = await response.json()
    setRecruiters(data)
  }

  const fetchPlayers = async () => {
    setIsLoading(true)
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(search && { search }),
      ...(selectedProgramme !== "all" && { programme: selectedProgramme }),
      ...(selectedRecruiter !== "all" && { recruiter: selectedRecruiter }),
      ...(selectedTag !== "all" && { tag: selectedTag }),
      ...(selectedStatus !== "all" && { status: selectedStatus }),
    })

    const response = await fetch(`/api/players?${params}`)
    const data = await response.json()
    setPlayers(data.data)
    setTotal(data.total)
    setIsLoading(false)
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedProgramme("all")
    setSelectedRecruiter("all")
    setSelectedTag("all")
    setSelectedStatus("all")
    setPage(1)
  }

  const handleRowClick = (player: Player) => {
    setSelectedPlayer(player)
    setDrawerOpen(true)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(players.map((p) => p.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  const handleBulkSendMessage = () => {
    console.log("[v0] Bulk send message to:", Array.from(selectedRows))
    alert(`Sending message to ${selectedRows.size} players`)
  }

  const handleBulkAddTag = () => {
    const tag = prompt("Enter tag name:")
    if (tag) {
      console.log("[v0] Adding tag", tag, "to:", Array.from(selectedRows))
      alert(`Adding tag "${tag}" to ${selectedRows.size} players`)
      setSelectedRows(new Set())
    }
  }

  const handleBulkRemoveTag = () => {
    const tag = prompt("Enter tag name to remove:")
    if (tag) {
      console.log("[v0] Removing tag", tag, "from:", Array.from(selectedRows))
      alert(`Removing tag "${tag}" from ${selectedRows.size} players`)
      setSelectedRows(new Set())
    }
  }

  const handleExportSelected = () => {
    console.log("[v0] Exporting players:", Array.from(selectedRows))
    alert(`Exporting ${selectedRows.size} players to CSV`)
  }

  const handleImportCSV = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".csv"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log("[v0] Importing CSV:", file.name)
        alert(`Importing players from ${file.name}`)
        fetchPlayers()
      }
    }
    input.click()
  }

  const handleExportAll = () => {
    console.log("[v0] Exporting all players")
    alert("Exporting all players to CSV")
  }

  const totalPages = Math.ceil(total / pageSize)
  const startRecord = (page - 1) * pageSize + 1
  const endRecord = Math.min(page * pageSize, total)

  const allTags = Array.from(new Set(players.flatMap((p) => p.tags || [])))

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500&display=swap" rel="stylesheet" />
      <Card
        className="mb-6 bg-[#f9fafc] p-6 border border-gray-200"
        style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="bg-white h-10"
              />
            </div>
            <div className="w-[180px]">
              <Select
                value={selectedTag}
                onValueChange={(value) => {
                  setSelectedTag(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="bg-white h-10 hover:border-[#0A47B1] transition-colors rounded-lg focus:ring-[#0A47B1]">
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px]">
              <Select
                value={selectedProgramme}
                onValueChange={(value) => {
                  setSelectedProgramme(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="bg-white h-10 hover:border-[#0A47B1] transition-colors rounded-lg focus:ring-[#0A47B1]">
                  <SelectValue placeholder="Programme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programmes</SelectItem>
                  {programmes.map((prog) => (
                    <SelectItem key={prog.id} value={prog.name}>
                      {prog.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px]">
              <Select
                value={selectedRecruiter}
                onValueChange={(value) => {
                  setSelectedRecruiter(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="bg-white h-10 hover:border-[#0A47B1] transition-colors rounded-lg focus:ring-[#0A47B1]">
                  <SelectValue placeholder="Recruiter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Recruiters</SelectItem>
                  {recruiters.map((rec) => (
                    <SelectItem key={rec.id} value={rec.name}>
                      {rec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px]">
              <Select
                value={selectedStatus}
                onValueChange={(value) => {
                  setSelectedStatus(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="bg-white h-10 hover:border-[#0A47B1] transition-colors rounded-lg focus:ring-[#0A47B1]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="pipeline">In Pipeline</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="signed">Signed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="bg-white h-10 hover:border-[#0A47B1] transition-colors rounded-lg"
            >
              Clear filters
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-between border-t pt-4">
            <div className="flex gap-2">
              <Button
                onClick={handleImportCSV}
                variant="outline"
                className="gap-2 bg-white hover:bg-gray-50 h-10 rounded-lg"
              >
                <Upload className="h-4 w-4" />
                Import CSV
              </Button>
              <Button
                onClick={handleExportAll}
                variant="outline"
                className="gap-2 bg-white hover:bg-gray-50 h-10 rounded-lg"
              >
                <Download className="h-4 w-4" />
                Export All
              </Button>
            </div>

            {selectedRows.size > 0 && (
              <div className="flex gap-2 items-center card-fade-in">
                <span className="text-sm font-medium text-gray-700">{selectedRows.size} selected</span>
                <Button
                  onClick={handleBulkSendMessage}
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-9 hover:bg-blue-50 hover:border-[#0A47B1] transition-colors bg-transparent rounded-lg"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Message
                </Button>
                <Button
                  onClick={handleBulkAddTag}
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-9 hover:bg-green-50 hover:border-green-400 transition-colors bg-transparent rounded-lg"
                >
                  <Tag className="h-3.5 w-3.5" />
                  Add Tag
                </Button>
                <Button
                  onClick={handleBulkRemoveTag}
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-9 hover:bg-red-50 hover:border-red-400 transition-colors bg-transparent rounded-lg"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove Tag
                </Button>
                <Button
                  onClick={handleExportSelected}
                  size="sm"
                  variant="outline"
                  className="gap-1.5 h-9 hover:bg-purple-50 hover:border-purple-400 transition-colors bg-transparent rounded-lg"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
              </div>
            )}

            <Button
              onClick={() => setAddDrawerOpen(true)}
              className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-10 shadow-md hover:scale-[1.03] transition-all active:scale-[0.97] rounded-lg"
            >
              <Plus className="h-4 w-4" />
              Add Player
            </Button>
          </div>
        </div>
      </Card>

      <Card className="bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-12 pl-6">
                  <Checkbox
                    checked={selectedRows.size === players.length && players.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Player
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Email
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Phone
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Programme
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Tags
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Recruiter
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Status
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Last Activity
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    Loading players...
                  </TableCell>
                </TableRow>
              ) : players.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No players found</p>
                      <p className="text-sm mt-1">Try changing your filters or add a new player.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                players.map((player, index) => (
                  <TableRow
                    key={player.id}
                    className={`cursor-pointer transition-colors hover:bg-[#F8FAFF] border-b border-[#E6E8F0] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"
                    } card-fade-in`}
                    style={{
                      animationDelay: `${index * 40}ms`,
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      color: "#1E1E1E",
                    }}
                  >
                    <TableCell className="pl-6" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedRows.has(player.id)}
                        onCheckedChange={(checked) => handleSelectRow(player.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell
                      className="font-medium"
                      style={{ color: "#1E1E1E" }}
                      onClick={() => handleRowClick(player)}
                    >
                      {player.name}
                    </TableCell>
                    <TableCell style={{ color: "#1E1E1E" }} onClick={() => handleRowClick(player)}>
                      {player.email}
                    </TableCell>
                    <TableCell style={{ color: "#1E1E1E" }} onClick={() => handleRowClick(player)}>
                      {player.phone}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(player)}>
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 font-medium gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {player.programme}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(player)}>
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {player.tags && player.tags.length > 0 ? (
                          player.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} className={`${getTagColor(tag)} border text-xs px-2 py-0.5 font-medium`}>
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">No tags</span>
                        )}
                        {player.tags && player.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            +{player.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(player)}>
                      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                        {player.recruiter}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(player)}>
                      <Badge className={`${getStatusColor(player.status)} border font-medium`}>{player.status}</Badge>
                    </TableCell>
                    <TableCell style={{ color: "#1E1E1E" }} onClick={() => handleRowClick(player)}>
                      {new Date(player.last_activity).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {players.length > 0 && (
          <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4">
            <div className="text-sm text-gray-600">
              Showing {startRecord} to {endRecord} of {total.toLocaleString()} players
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </div>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {selectedPlayer && (
        <PlayerDrawer player={selectedPlayer} open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}

      <AddPlayerDrawer
        open={addDrawerOpen}
        onClose={() => setAddDrawerOpen(false)}
        onSuccess={() => {
          fetchPlayers()
          setAddDrawerOpen(false)
        }}
      />
    </>
  )
}
