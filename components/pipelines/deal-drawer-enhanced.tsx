"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Mail,
  Phone,
  ExternalLink,
  GraduationCap,
  UserCircle2,
  Send,
  Calendar,
  Clock,
  Edit,
  X,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Deal {
  id: number
  player_name: string
  email: string
  phone: string
  programme: string
  recruiter: string
  status: string
  last_activity: string
  stage_id?: number
  stage_name?: string
  next_follow_up?: string
  program_id?: number
  recruiter_id?: number
  deal_value?: number
  notes?: string
}

interface Stage {
  id: number
  name: string
}

interface Recruiter {
  id: number
  name: string
  full_name?: string
}

interface DealDrawerEnhancedProps {
  deal: Deal | null
  open: boolean
  onClose: () => void
  stages: Stage[]
  pipelineId: number
  onDealUpdated?: (updatedDeal: Deal) => void
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function DealDrawerEnhanced({
  deal,
  open,
  onClose,
  stages,
  pipelineId,
  onDealUpdated,
}: DealDrawerEnhancedProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedRecruiter, setEditedRecruiter] = useState<number | null>(null)
  const [editedDealValue, setEditedDealValue] = useState<string>("")
  const [editedNotes, setEditedNotes] = useState<string>("")
  const [currentStageId, setCurrentStageId] = useState<number | null>(null)
  const [nextFollowUp, setNextFollowUp] = useState("")
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [savingStage, setSavingStage] = useState(false)
  const [savingFollowUp, setSavingFollowUp] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (deal && open) {
      setEditedRecruiter(deal.recruiter_id || null)
      setEditedDealValue(deal.deal_value?.toString() || "")
      setEditedNotes(deal.notes || "")
      setCurrentStageId(deal.stage_id || null)
      setNextFollowUp(deal.next_follow_up || "")
      fetchRecruiters()
    }
  }, [deal, open])

  const fetchRecruiters = async () => {
    const res = await fetch("/api/settings/recruiters")
    const data = await res.json()
    setRecruiters(Array.isArray(data) ? data : data.data || [])
  }

  const handleStageChange = async (newStageId: string) => {
    if (!deal || savingStage) return

    setSavingStage(true)
    const stageIdNum = Number.parseInt(newStageId)

    try {
      const response = await fetch(`/api/deals/${deal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage_id: stageIdNum }),
      })

      if (response.ok) {
        setCurrentStageId(stageIdNum)
        const newStageName = stages.find((s) => s.id === stageIdNum)?.name || ""

        toast({
          title: "Stage updated",
          description: `Deal moved to ${newStageName}`,
        })

        if (onDealUpdated) {
          onDealUpdated({ ...deal, stage_id: stageIdNum, stage_name: newStageName })
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to update stage",
          variant: "destructive",
        })
        setCurrentStageId(deal.stage_id || null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stage",
        variant: "destructive",
      })
      setCurrentStageId(deal.stage_id || null)
    } finally {
      setSavingStage(false)
    }
  }

  const handleFollowUpChange = async (date: string) => {
    if (!deal || savingFollowUp) return

    setNextFollowUp(date)
    setSavingFollowUp(true)

    try {
      const response = await fetch(`/api/deals/${deal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ next_follow_up: date }),
      })

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to save follow-up date",
          variant: "destructive",
        })
        setNextFollowUp(deal.next_follow_up || "")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save follow-up date",
        variant: "destructive",
      })
      setNextFollowUp(deal.next_follow_up || "")
    } finally {
      setSavingFollowUp(false)
    }
  }

  const handleSave = async () => {
    if (!deal) return

    try {
      const response = await fetch(`/api/deals/${deal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiter_id: editedRecruiter,
          deal_value: editedDealValue ? Number.parseFloat(editedDealValue) : undefined,
          notes: editedNotes,
        }),
      })

      if (response.ok) {
        const recruiterName =
          recruiters.find((r) => r.id === editedRecruiter)?.full_name ||
          recruiters.find((r) => r.id === editedRecruiter)?.name ||
          deal.recruiter

        toast({
          title: "Deal updated",
          description: "Changes saved successfully",
        })
        setIsEditMode(false)

        if (onDealUpdated) {
          onDealUpdated({
            ...deal,
            recruiter_id: editedRecruiter || deal.recruiter_id,
            recruiter: recruiterName,
            deal_value: editedDealValue ? Number.parseFloat(editedDealValue) : deal.deal_value,
            notes: editedNotes,
          })
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to save changes",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setEditedRecruiter(deal?.recruiter_id || null)
    setEditedDealValue(deal?.deal_value?.toString() || "")
    setEditedNotes(deal?.notes || "")
    setIsEditMode(false)
  }

  if (!deal) return null

  const currentStageName = stages.find((s) => s.id === currentStageId)?.name || deal.stage_name || "Unknown Stage"

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[440px] sm:max-w-[440px] overflow-y-auto bg-gray-50 shadow-[-4px_0_12px_rgba(0,0,0,0.08)] transition-all duration-250 ease-in-out">
        <SheetHeader className="border-b pb-4 bg-white -mx-6 -mt-6 px-6 pt-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
              {getInitials(deal.player_name)}
            </div>

            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl font-semibold text-gray-900 mb-2">{deal.player_name}</SheetTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 border font-medium transition-all duration-200">
                  {currentStageName}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">Recruiter: {deal.recruiter}</p>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 transition-all duration-200"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 transition-all duration-200"
            >
              Invoices
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 transition-all duration-200"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-gray-700">Change Stage</Label>
              </div>
              {!isEditMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white mb-4">
              <Select value={currentStageId?.toString() || ""} onValueChange={handleStageChange} disabled={savingStage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id.toString()}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {savingStage && <p className="text-xs text-gray-500 mt-2">Saving...</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow duration-200">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900 text-sm truncate">{deal.email}</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow duration-200">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="font-medium text-gray-900 text-sm">{deal.phone}</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow duration-200">
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">Programme</p>
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 text-xs">
                      {deal.programme}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow duration-200">
                <div className="flex items-start gap-3">
                  <UserCircle2 className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">Recruiter</p>
                    {isEditMode ? (
                      <Select
                        value={editedRecruiter?.toString() || ""}
                        onValueChange={(value) => setEditedRecruiter(Number.parseInt(value))}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select recruiter" />
                        </SelectTrigger>
                        <SelectContent>
                          {recruiters.map((rec) => (
                            <SelectItem key={rec.id} value={rec.id.toString()}>
                              {rec.full_name || rec.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium text-gray-900 text-sm">{deal.recruiter}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <Label htmlFor="deal-value" className="text-sm font-medium text-gray-900 mb-2 block">
                    Deal Value
                  </Label>
                  {isEditMode ? (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                      <Input
                        id="deal-value"
                        type="number"
                        value={editedDealValue}
                        onChange={(e) => setEditedDealValue(e.target.value)}
                        placeholder="0"
                        className="pl-8"
                      />
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-green-600">£{deal.deal_value?.toLocaleString() || "0"}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditMode && (
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-900 mb-2 block">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="Add notes about this deal..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            )}

            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">Last Contacted</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>2 days ago</span>
                    <span className="text-gray-400">•</span>
                    <Badge variant="outline" className="text-xs">
                      Email
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <Label htmlFor="next-followup" className="text-sm font-medium text-gray-900 mb-2 block">
                    Next Follow-Up
                  </Label>
                  <Input
                    id="next-followup"
                    type="date"
                    value={nextFollowUp}
                    onChange={(e) => handleFollowUpChange(e.target.value)}
                    className="focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                    disabled={savingFollowUp}
                  />
                  {savingFollowUp && <p className="text-xs text-gray-500 mt-1">Saving...</p>}
                </div>
              </div>
            </div>

            {isEditMode && (
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}

            {!isEditMode && (
              <div className="space-y-3 pt-2">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
                  size="lg"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                <Link href="/pipelines" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-2 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700 transition-all duration-200 bg-transparent"
                    size="lg"
                  >
                    View in Pipeline
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="invoices" className="animate-fade-in">
            <p className="text-sm text-gray-500">Invoices tab content coming soon...</p>
          </TabsContent>

          <TabsContent value="activity" className="animate-fade-in">
            <p className="text-sm text-gray-500">Activity tab content coming soon...</p>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
