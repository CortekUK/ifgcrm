"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Clock, Plus, Search } from "lucide-react"
import { KanbanBoard } from "./kanban-board"
import { PlayerDrawer } from "@/components/players/player-drawer"
import { format } from "date-fns"

interface Pipeline {
  id: number
  name: string
}

interface Recruiter {
  id: number
  name: string
}

interface Deal {
  id: number
  player_name: string
  email: string
  phone: string
  programme: string
  recruiter: string
  status: string
  last_activity: string
  deal_value: number
}

interface Stage {
  id: number
  name: string
  deals: Deal[]
}

interface PipelineData {
  id: number
  name: string
  stages: Stage[]
}

export function PipelinesBoard() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [selectedPipeline, setSelectedPipeline] = useState<string>("")
  const [selectedRecruiter, setSelectedRecruiter] = useState<string>("all")
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null })
  const [sortBy, setSortBy] = useState<string>("newest")
  const [pipelineData, setPipelineData] = useState<PipelineData | null>(null)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDealOwner, setSelectedDealOwner] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedTags, setSelectedTags] = useState<string>("all")

  useEffect(() => {
    fetch("/api/pipelines")
      .then((res) => res.json())
      .then((data) => {
        setPipelines(data)
        if (data.length > 0) {
          setSelectedPipeline(data[0].id.toString())
        }
      })
  }, [])

  useEffect(() => {
    fetch("/api/settings/recruiters")
      .then((res) => res.json())
      .then((data) => setRecruiters(data))
  }, [])

  useEffect(() => {
    if (selectedPipeline) {
      setLoading(true)
      fetch(`/api/pipelines/${selectedPipeline}/stages`)
        .then((res) => res.json())
        .then((data) => {
          setPipelineData(data)
          setLoading(false)
        })
    }
  }, [selectedPipeline])

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal)
    setIsDrawerOpen(true)
  }

  const handleDealMove = async (dealId: number, newStageId: number) => {
    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stage_id: newStageId }),
      })

      if (response.ok) {
        if (selectedPipeline) {
          const data = await fetch(`/api/pipelines/${selectedPipeline}/stages`).then((res) => res.json())
          setPipelineData(data)
        }
      }
    } catch (error) {
      console.error("Failed to update deal:", error)
    }
  }

  const filteredAndSortedData = pipelineData
    ? {
        ...pipelineData,
        stages: pipelineData.stages.map((stage) => {
          let filteredDeals = stage.deals

          if (searchQuery) {
            filteredDeals = filteredDeals.filter((deal) =>
              deal.player_name.toLowerCase().includes(searchQuery.toLowerCase()),
            )
          }

          if (selectedRecruiter !== "all") {
            filteredDeals = filteredDeals.filter(
              (deal) => deal.recruiter === recruiters.find((r) => r.id.toString() === selectedRecruiter)?.name,
            )
          }

          if (dateRange.from || dateRange.to) {
            filteredDeals = filteredDeals.filter((deal) => {
              const dealDate = new Date(deal.last_activity)
              if (dateRange.from && dealDate < dateRange.from) return false
              if (dateRange.to && dealDate > dateRange.to) return false
              return true
            })
          }

          const sortedDeals = [...filteredDeals].sort((a, b) => {
            if (sortBy === "newest") {
              return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
            } else if (sortBy === "value") {
              return (b.deal_value || 0) - (a.deal_value || 0)
            } else if (sortBy === "recruiter") {
              return a.recruiter.localeCompare(b.recruiter)
            }
            return 0
          })

          return {
            ...stage,
            deals: sortedDeals,
          }
        }),
      }
    : null

  const totalPlayers = filteredAndSortedData
    ? filteredAndSortedData.stages.reduce((sum, stage) => sum + stage.deals.length, 0)
    : 0

  const totalValue = filteredAndSortedData
    ? filteredAndSortedData.stages.reduce(
        (sum, stage) => sum + stage.deals.reduce((stageSum, deal) => stageSum + (deal.deal_value || 0), 0),
        0,
      )
    : 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-gray-700 hover:bg-gray-50 hover:border-blue-500 transition-colors bg-transparent"
        >
          <Plus className="h-4 w-4" />
          Add a filter
        </Button>

        <div className="flex-1 min-w-[160px]">
          <Select value={selectedDealOwner} onValueChange={setSelectedDealOwner}>
            <SelectTrigger className="h-9 border-gray-300 hover:border-blue-500 transition-colors">
              <SelectValue placeholder="Deal Owners" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All owners</SelectItem>
              {recruiters.map((recruiter) => (
                <SelectItem key={recruiter.id} value={recruiter.id.toString()}>
                  {recruiter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-9 border-gray-300 hover:border-blue-500 transition-colors">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="in-pipeline">In Pipeline</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="signed">Signed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <Select value={selectedTags} onValueChange={setSelectedTags}>
            <SelectTrigger className="h-9 border-gray-300 hover:border-blue-500 transition-colors">
              <SelectValue placeholder="Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tags</SelectItem>
              <SelectItem value="high-priority">High Priority</SelectItem>
              <SelectItem value="follow-up">Follow Up</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[160px]">
          <Select value={selectedRecruiter} onValueChange={setSelectedRecruiter}>
            <SelectTrigger className="h-9 border-gray-300 hover:border-blue-500 transition-colors">
              <SelectValue placeholder="Recruiter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All recruiters</SelectItem>
              {recruiters.map((recruiter) => (
                <SelectItem key={recruiter.id} value={recruiter.id.toString()}>
                  {recruiter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search deals"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-10 border-gray-300 hover:border-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[180px]">
          <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
            <SelectTrigger className="h-9 border-gray-300 hover:border-blue-500 transition-colors">
              <SelectValue placeholder="Programme" />
            </SelectTrigger>
            <SelectContent>
              {pipelines.map((pipeline) => (
                <SelectItem key={pipeline.id} value={pipeline.id.toString()}>
                  {pipeline.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedData && (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/30 px-6 py-3 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Total players:</span>
              <span className="text-lg font-bold text-blue-600">{totalPlayers}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Total value:</span>
              <span className="text-lg font-bold text-green-600">£{totalValue.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last updated: {format(new Date(), "MMM d, yyyy 'at' h:mm a")}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-white transition-all duration-200 hover:bg-gray-50 hover:shadow-md"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-gray-500">Loading pipeline...</div>
        </div>
      ) : filteredAndSortedData ? (
        <KanbanBoard pipelineData={filteredAndSortedData} onDealClick={handleDealClick} onDealMove={handleDealMove} />
      ) : (
        <div className="flex h-64 items-center justify-center">
          <div className="text-gray-500">Select a pipeline to view deals</div>
        </div>
      )}

      {selectedDeal && (
        <PlayerDrawer
          player={{
            id: selectedDeal.id,
            name: selectedDeal.player_name,
            email: selectedDeal.email,
            phone: selectedDeal.phone,
            programme: selectedDeal.programme,
            recruiter: selectedDeal.recruiter,
            status: selectedDeal.status,
            last_activity: selectedDeal.last_activity,
          }}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  )
}
