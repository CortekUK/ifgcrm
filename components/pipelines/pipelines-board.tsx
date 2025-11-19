"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Clock, Plus, Search } from 'lucide-react'
import { KanbanBoard } from "./kanban-board"
import { AddPipelineModal } from "./add-pipeline-modal"
import { CreateDealModal } from "./create-deal-modal" // Import CreateDealModal
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AddStageModal } from "./add-stage-modal" // Import Add Stage modal
import { DealDrawerEnhanced } from "./deal-drawer-enhanced"

function formatDateTime(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }) + " at " + date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

interface Pipeline {
  id: number
  name: string
  dealCount?: number
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
  dealsWon?: number // Added optional deals won metric
  conversionRate?: number // Added optional conversion rate metric
}

export function PipelinesBoard() {
  const searchParams = useSearchParams()
  const urlPipelineId = searchParams.get("pipelineId")
  const urlDealId = searchParams.get("dealId")

  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [selectedPipeline, setSelectedPipeline] = useState<string>(urlPipelineId || "")
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
  const [isAddPipelineModalOpen, setIsAddPipelineModalOpen] = useState(false)
  const [isFilterPopoverOpen, setIsFilterPopoverOpen] = useState(false)
  const [isCreateDealModalOpen, setIsCreateDealModalOpen] = useState(false) // Add state for create deal modal
  const [preSelectedStageId, setPreSelectedStageId] = useState<number | null>(null) // Add state for pre-selected stage
  const [isAddStageModalOpen, setIsAddStageModalOpen] = useState(false) // Add state for Add Stage modal

  const fetchPipelines = async () => {
    const res = await fetch("/api/pipelines")
    const data = await res.json()
    setPipelines(data)
    if (data.length > 0 && !selectedPipeline) {
      setSelectedPipeline(data[0].id.toString())
    }
  }

  useEffect(() => {
    fetchPipelines()
  }, [])

  useEffect(() => {
    if (urlPipelineId) {
      setSelectedPipeline(urlPipelineId)
    }
  }, [urlPipelineId])

  useEffect(() => {
    if (urlDealId && pipelineData) {
      // Find deal in the loaded pipeline data
      let foundDeal = null
      for (const stage of pipelineData.stages) {
        const deal = stage.deals.find((d) => d.id.toString() === urlDealId)
        if (deal) {
          foundDeal = deal
          break
        }
      }
      if (foundDeal) {
        setSelectedDeal(foundDeal)
        setIsDrawerOpen(true)
      }
    }
  }, [urlDealId, pipelineData])

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

  useEffect(() => {
    const handleDealCreated = (event: any) => {
      const newDeal = event.detail
      if (newDeal && pipelineData) {
        // Optimistically update state for mock data
        setPipelineData((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            stages: prev.stages.map((stage) => {
              if (stage.id === newDeal.stage_id) {
                return {
                  ...stage,
                  deals: [...stage.deals, newDeal],
                }
              }
              return stage
            }),
          }
        })
      } else if (selectedPipeline) {
        // Fallback to refetch
        fetch(`/api/pipelines/${selectedPipeline}/stages`)
          .then((res) => res.json())
          .then((data) => setPipelineData(data))
      }
    }

    window.addEventListener("dealCreated", handleDealCreated)
    return () => window.removeEventListener("dealCreated", handleDealCreated)
  }, [selectedPipeline, pipelineData])

  useEffect(() => {
    const handleStageCreated = () => {
      if (selectedPipeline) {
        fetch(`/api/pipelines/${selectedPipeline}/stages`)
          .then((res) => res.json())
          .then((data) => setPipelineData(data))
      }
    }

    window.addEventListener("stageCreated", handleStageCreated)
    return () => window.removeEventListener("stageCreated", handleStageCreated)
  }, [selectedPipeline])

  useEffect(() => {
    const handleStageDeleted = () => {
      if (selectedPipeline) {
        fetch(`/api/pipelines/${selectedPipeline}/stages`)
          .then((res) => res.json())
          .then((data) => setPipelineData(data))
      }
    }

    window.addEventListener("stageDeleted", handleStageDeleted)
    return () => window.removeEventListener("stageDeleted", handleStageDeleted)
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

  const handlePipelineCreated = () => {
    fetchPipelines()
  }

  const handleAddDeal = (stageId: number) => {
    // Add handler for opening deal modal with pre-selected stage
    setPreSelectedStageId(stageId)
    setIsCreateDealModalOpen(true)
  }

  const handleCloseDealModal = () => {
    // Add handler for closing deal modal
    setIsCreateDealModalOpen(false)
    setPreSelectedStageId(null)
  }

  const handleStageEdit = async (stageId: number, newName: string, newColor: string, newOrder: number) => {
    try {
      const response = await fetch(`/api/pipelines/${selectedPipeline}/stages/${stageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, color: newColor, order: newOrder }),
      })

      if (response.ok) {
        // Refresh pipeline data
        const data = await fetch(`/api/pipelines/${selectedPipeline}/stages`).then((res) => res.json())
        setPipelineData(data)
      }
    } catch (error) {
      console.error("Failed to update stage:", error)
    }
  }

  const handleDealCreated = (newDeal: any) => {
    if (pipelineData && newDeal.stage_id) {
      const updatedPipelineData = {
        ...pipelineData,
        stages: pipelineData.stages.map((stage) => {
          if (stage.id === newDeal.stage_id) {
            return {
              ...stage,
              deals: [...stage.deals, newDeal],
            }
          }
          return stage
        }),
      }
      setPipelineData(updatedPipelineData)
    }

    if (selectedPipeline) {
      fetch(`/api/pipelines/${selectedPipeline}/stages`)
        .then((res) => res.json())
        .then((data) => setPipelineData(data))
    }
  }

  const handleDealUpdatedInDrawer = (updatedDeal: Deal) => {
    if (pipelineData) {
      const updatedPipelineData = {
        ...pipelineData,
        stages: pipelineData.stages.map((stage) => ({
          ...stage,
          deals: stage.deals.map((d) => (d.id === updatedDeal.id ? { ...d, ...updatedDeal } : d)),
        })),
      }
      setPipelineData(updatedPipelineData)
    }

    // Refresh from server
    if (selectedPipeline) {
      fetch(`/api/pipelines/${selectedPipeline}/stages`)
        .then((res) => res.json())
        .then((data) => setPipelineData(data))
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
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 space-y-4 pb-4">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Popover open={isFilterPopoverOpen} onOpenChange={setIsFilterPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:bg-muted hover:border-primary transition-colors bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                  Add a filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3" align="start">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-foreground mb-3">Available Filters</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      setIsFilterPopoverOpen(false)
                    }}
                  >
                    Deal owner
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      setIsFilterPopoverOpen(false)
                    }}
                  >
                    Status
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      setIsFilterPopoverOpen(false)
                    }}
                  >
                    Tags
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      setIsFilterPopoverOpen(false)
                    }}
                  >
                    Recruiter
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Select value={selectedDealOwner} onValueChange={setSelectedDealOwner}>
              <SelectTrigger className="h-9 w-[140px] border-border hover:border-primary transition-colors">
                <SelectValue placeholder="All owners" />
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

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 w-[140px] border-border hover:border-primary transition-colors">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="in-pipeline">In Pipeline</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTags} onValueChange={setSelectedTags}>
              <SelectTrigger className="h-9 w-[120px] border-border hover:border-primary focus:border-primary transition-colors">
                <SelectValue placeholder="All tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tags</SelectItem>
                <SelectItem value="high-priority">High Priority</SelectItem>
                <SelectItem value="follow-up">Follow Up</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRecruiter} onValueChange={setSelectedRecruiter}>
              <SelectTrigger className="h-9 w-[140px] border-border hover:border-primary transition-colors">
                <SelectValue placeholder="All recruiters" />
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

            <div className="ml-auto flex items-center gap-2">
              <div className="relative w-[240px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search deals"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-10 border-border hover:border-primary focus:border-primary transition-colors"
                />
              </div>

              <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
                <SelectTrigger className="h-9 w-[260px] border-border hover:border-primary transition-colors font-medium">
                  <SelectValue placeholder="Select pipeline" />
                </SelectTrigger>
                <SelectContent className="w-[260px]">
                  <div className="px-2 pb-2 pt-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search pipelines..."
                        className="h-8 pl-8 text-sm border-border focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {pipelines.map((pipeline) => (
                      <SelectItem
                        key={pipeline.id}
                        value={pipeline.id.toString()}
                        className="cursor-pointer px-3 py-2.5"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[15px] font-medium text-foreground">{pipeline.name}</span>
                          {pipeline.dealCount !== undefined && (
                            <span className="text-[13px] text-muted-foreground ml-2">({pipeline.dealCount})</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                  <div className="my-1 mx-2">
                    <div className="h-px bg-border" />
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsAddPipelineModalOpen(true)
                    }}
                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-3 py-2.5 text-[15px] font-medium text-primary hover:bg-accent outline-none transition-colors"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add a pipeline
                  </button>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredAndSortedData && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-6 py-3 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Total players:</span>
                <span className="text-lg font-bold text-primary">{totalPlayers}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Total value:</span>
                <span className="text-lg font-bold text-success">£{totalValue.toLocaleString()}</span>
              </div>
              {filteredAndSortedData.dealsWon !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Deals won:</span>
                  <span className="text-lg font-bold text-primary">{filteredAndSortedData.dealsWon}</span>
                </div>
              )}
              {filteredAndSortedData.conversionRate !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Conversion rate:</span>
                  <span className="text-lg font-bold text-success">
                    {filteredAndSortedData.conversionRate.toFixed(1)}%
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last updated: {formatDateTime(new Date())}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-card transition-all duration-200 hover:bg-muted hover:shadow-md"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-gray-500">Loading pipeline...</div>
          </div>
        ) : filteredAndSortedData ? (
          filteredAndSortedData.stages.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center space-y-4">
                <div className="rounded-lg bg-muted/50 border border-border p-8 max-w-md mx-auto">
                  <p className="text-base font-medium text-foreground mb-2">No stages yet — create your first one</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add stages to organize your deals through the recruitment process.
                  </p>
                  <Button onClick={() => setIsAddStageModalOpen(true)} className="gradient-primary">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Stage
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <KanbanBoard
              pipelineData={filteredAndSortedData}
              onDealClick={handleDealClick}
              onDealMove={handleDealMove}
              onStageEdit={handleStageEdit}
              onAddDeal={handleAddDeal} // Pass onAddDeal prop to KanbanBoard
            />
          )
        ) : (
          <div className="flex h-64 items-center justify-center">
            <div className="text-gray-500">Select a pipeline to view deals</div>
          </div>
        )}
      </div>

      {selectedDeal && filteredAndSortedData && (
        <DealDrawerEnhanced
          deal={selectedDeal}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          stages={filteredAndSortedData.stages.map((s) => ({ id: s.id, name: s.name }))}
          pipelineId={Number.parseInt(selectedPipeline)}
          onDealUpdated={handleDealUpdatedInDrawer}
        />
      )}

      <AddPipelineModal
        open={isAddPipelineModalOpen}
        onClose={() => setIsAddPipelineModalOpen(false)}
        onSuccess={handlePipelineCreated}
      />

      <CreateDealModal // Add CreateDealModal with pre-selected stage
        open={isCreateDealModalOpen}
        onClose={handleCloseDealModal}
        preSelectedStageId={preSelectedStageId}
        onDealCreated={handleDealCreated} // Pass the optimistic update handler
      />

      {isAddStageModalOpen && selectedPipeline && (
        <AddStageModal
          open={isAddStageModalOpen}
          onClose={() => setIsAddStageModalOpen(false)}
          pipelineId={Number.parseInt(selectedPipeline)}
        />
      )}
    </div>
  )
}
