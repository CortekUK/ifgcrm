"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Mail,
  Phone,
  ExternalLink,
  GraduationCap,
  UserCircle2,
  Send,
  Calendar,
  MessageSquare,
  FileText,
  DollarSign,
  Clock,
  CheckCircle2,
  Plus,
  Edit,
  X,
  Check,
} from "lucide-react"
import Link from "next/link"

interface Player {
  id: number | string
  name: string
  email: string
  phone: string
  programme: string
  program_id?: string
  recruiter: string
  recruiter_id?: string
  status: string
  last_activity: string
}

interface Invoice {
  id: number
  invoice_number: string
  amount: number
  status: string
  due_date: string
}

interface Activity {
  id: number
  action: string
  timestamp: string
  description: string
}

interface PlayerDrawerProps {
  player: Player
  open: boolean
  onClose: () => void
}

const getStatusBadgeClass = (status: string) => {
  const statusLower = status.toLowerCase()
  if (statusLower.includes("pipeline") || statusLower.includes("in pipeline")) {
    return "bg-blue-100 text-blue-700 border-blue-200"
  }
  if (statusLower.includes("contact")) {
    return "bg-amber-100 text-amber-700 border-amber-200"
  }
  if (statusLower.includes("sign")) {
    return "bg-green-100 text-green-700 border-green-200"
  }
  if (statusLower.includes("interview")) {
    return "bg-purple-100 text-purple-700 border-purple-200"
  }
  return "bg-gray-100 text-gray-700 border-gray-200"
}

const getInvoiceStatusBadge = (status: string) => {
  const statusLower = status.toLowerCase()
  if (statusLower === "paid") return "bg-green-100 text-green-700 border-green-200"
  if (statusLower === "overdue") return "bg-red-100 text-red-700 border-red-200"
  if (statusLower === "sent") return "bg-blue-100 text-blue-700 border-blue-200"
  return "bg-gray-100 text-gray-700 border-gray-200"
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function PlayerDrawer({ player, open, onClose }: PlayerDrawerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(player.name)
  const [editedEmail, setEditedEmail] = useState(player.email)
  const [editedPhone, setEditedPhone] = useState(player.phone)
  const [editedProgramId, setEditedProgramId] = useState(player.program_id || "")
  const [editedRecruiterId, setEditedRecruiterId] = useState(player.recruiter_id || "")
  const [isSaving, setIsSaving] = useState(false)

  const [programmes, setProgrammes] = useState<Array<{ id: string; name: string }>>([])
  const [recruiters, setRecruiters] = useState<Array<{ id: string; full_name: string }>>([])
  const [loadingDropdowns, setLoadingDropdowns] = useState(false)

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loadingInvoices, setLoadingInvoices] = useState(false)
  const [loadingActivities, setLoadingActivities] = useState(false)
  const [nextFollowUp, setNextFollowUp] = useState("")

  const { toast } = useToast()

  useEffect(() => {
    setEditedName(player.name)
    setEditedEmail(player.email)
    setEditedPhone(player.phone)
    setEditedProgramId(player.program_id || "")
    setEditedRecruiterId(player.recruiter_id || "")
    setIsEditing(false)
  }, [player])

  useEffect(() => {
    if (open) {
      fetchInvoices()
      fetchActivities()
      fetchDropdowns()
    }
  }, [open, player.id])

  const fetchDropdowns = async () => {
    setLoadingDropdowns(true)
    try {
      const [progResponse, recResponse] = await Promise.all([
        fetch("/api/settings/programmes"),
        fetch("/api/settings/recruiters"),
      ])
      const progData = await progResponse.json()
      const recData = await recResponse.json()
      setProgrammes(Array.isArray(progData) ? progData : [])
      setRecruiters(Array.isArray(recData) ? recData : [])
    } catch (error) {
      console.error("[v0] Error loading dropdowns:", error)
    }
    setLoadingDropdowns(false)
  }

  const fetchInvoices = async () => {
    setLoadingInvoices(true)
    const response = await fetch(`/api/invoices?player_id=${player.id}`)
    const result = await response.json()
    setInvoices(Array.isArray(result) ? result : result.data || [])
    setLoadingInvoices(false)
  }

  const fetchActivities = async () => {
    setLoadingActivities(true)
    const response = await fetch(`/api/players/${player.id}/activity`)
    const result = await response.json()
    setActivities(Array.isArray(result) ? result : result.data || [])
    setLoadingActivities(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/players/${player.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editedName,
          email: editedEmail,
          phone: editedPhone,
          program_id: editedProgramId,
          recruiter_id: editedRecruiterId,
        }),
      })

      if (!response.ok) throw new Error("Failed to update player")

      const updatedPlayer = await response.json()

      toast({
        title: "Player updated",
        description: "Player information has been saved successfully.",
      })

      setIsEditing(false)

      window.dispatchEvent(new CustomEvent("player-updated", { detail: updatedPlayer }))
    } catch (error) {
      console.error("[v0] Error updating player:", error)
      toast({
        title: "Error",
        description: "Failed to update player information.",
        variant: "destructive",
      })
    }
    setIsSaving(false)
  }

  const handleCancel = () => {
    setEditedName(player.name)
    setEditedEmail(player.email)
    setEditedPhone(player.phone)
    setEditedProgramId(player.program_id || "")
    setEditedRecruiterId(player.recruiter_id || "")
    setIsEditing(false)
  }

  const handleSendPaymentLink = async (invoiceId: number) => {
    await fetch(`/api/invoices/${invoiceId}/send-link`, {
      method: "POST",
    })
    alert("Payment link sent!")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] my-4 overflow-hidden p-0 flex flex-col">
        <DialogHeader className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-8 pt-10 pb-7">
          <div className="absolute right-8 top-10 flex items-center gap-2">
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-10 px-5 font-semibold hover:bg-accent transition-all duration-200 rounded-lg text-[14px] shadow-sm border-2"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="h-10 px-5 font-semibold hover:bg-accent bg-transparent transition-all duration-200 rounded-lg text-[14px] border-2"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-10 px-5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 rounded-lg text-[14px] shadow-sm"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            )}
          </div>

          <div className="flex items-start gap-6 pr-28">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-xl shadow-blue-500/25 ring-4 ring-blue-100/50">
              {getInitials(player.name)}
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <DialogTitle className="text-[28px] font-bold tracking-tight text-foreground mb-3.5 leading-tight">
                {player.name}
              </DialogTitle>
              <div className="flex items-center gap-3 mb-3.5">
                <Badge
                  className={`${getStatusBadgeClass(player.status)} border-2 text-[13px] font-semibold px-3.5 py-1.5 rounded-full`}
                >
                  {player.status}
                </Badge>
              </div>
              <p className="text-[15px] text-muted-foreground leading-relaxed font-medium">
                Recruiter: <span className="font-semibold text-foreground">{player.recruiter}</span>
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-8 pt-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1.5 rounded-xl h-12">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md rounded-lg font-semibold text-[15px] transition-all duration-200"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="invoices"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md rounded-lg font-semibold text-[15px] transition-all duration-200"
              >
                Invoices
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md rounded-lg font-semibold text-[15px] transition-all duration-200"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 pb-10">
              <div className="space-y-5">
                <div className="rounded-2xl border-2 border-border bg-card p-6 hover:shadow-md hover:border-muted-foreground/20 transition-all duration-200">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center flex-shrink-0">
                      <UserCircle2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Label
                        htmlFor="name"
                        className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider mb-3 block"
                      >
                        Name
                      </Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="h-12 text-[16px] font-semibold border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                        />
                      ) : (
                        <p className="font-bold text-foreground text-[18px] leading-relaxed">{player.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="rounded-2xl border-2 border-border bg-card p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 ring-2 ring-blue-100">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Label
                          htmlFor="email"
                          className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider mb-3 block"
                        >
                          Email
                        </Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            className="h-12 text-[15px] border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                          />
                        ) : (
                          <p className="font-semibold text-foreground text-[15px] leading-relaxed truncate">
                            {player.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border-2 border-border bg-card p-6 hover:shadow-md hover:border-green-200 transition-all duration-200">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0 ring-2 ring-green-100">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Label
                          htmlFor="phone"
                          className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider mb-3 block"
                        >
                          Phone
                        </Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={editedPhone}
                            onChange={(e) => setEditedPhone(e.target.value)}
                            className="h-12 text-[15px] border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg"
                          />
                        ) : (
                          <p className="font-semibold text-foreground text-[15px] leading-relaxed">{player.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="rounded-2xl border-2 border-border bg-card p-6 hover:shadow-md hover:border-purple-200 transition-all duration-200">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 ring-2 ring-purple-100">
                        <GraduationCap className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Label
                          htmlFor="programme"
                          className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider mb-3 block"
                        >
                          Programme
                        </Label>
                        {isEditing ? (
                          <Select value={editedProgramId} onValueChange={setEditedProgramId}>
                            <SelectTrigger className="h-12 text-[15px] border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg">
                              <SelectValue placeholder="Select programme" />
                            </SelectTrigger>
                            <SelectContent>
                              {programmes.map((prog) => (
                                <SelectItem key={prog.id} value={prog.id}>
                                  {prog.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 text-[13px] font-bold px-4 py-2 rounded-lg shadow-md">
                            {player.programme}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border-2 border-border bg-card p-6 hover:shadow-md hover:border-muted-foreground/20 transition-all duration-200">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center flex-shrink-0">
                        <UserCircle2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Label
                          htmlFor="recruiter"
                          className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider mb-3 block"
                        >
                          Recruiter
                        </Label>
                        {isEditing ? (
                          <Select value={editedRecruiterId} onValueChange={setEditedRecruiterId}>
                            <SelectTrigger className="h-12 text-[15px] border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg">
                              <SelectValue placeholder="Select recruiter" />
                            </SelectTrigger>
                            <SelectContent>
                              {recruiters.map((rec) => (
                                <SelectItem key={rec.id} value={rec.id}>
                                  {rec.full_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="font-semibold text-foreground text-[15px] leading-relaxed">
                            {player.recruiter}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-border bg-card p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 ring-2 ring-blue-100">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[16px] font-bold text-foreground mb-3 uppercase tracking-wide">
                        Last Contacted
                      </p>
                      <div className="flex items-center gap-3 text-[15px] text-muted-foreground">
                        <span className="font-semibold">2 days ago</span>
                        <span className="text-border">•</span>
                        <Badge variant="outline" className="text-[13px] font-semibold px-3 py-1 rounded-lg border-2">
                          Email
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-border bg-card p-6 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 ring-2 ring-amber-100">
                      <Calendar className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <Label
                        htmlFor="next-followup"
                        className="text-[16px] font-bold text-foreground mb-4 block uppercase tracking-wide"
                      >
                        Next Follow-Up
                      </Label>
                      <Input
                        id="next-followup"
                        type="date"
                        value={nextFollowUp}
                        onChange={(e) => setNextFollowUp(e.target.value)}
                        className="h-12 text-[15px] focus:border-primary focus:ring-2 focus:ring-primary/20 border-2 rounded-lg font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-200 text-[16px] font-bold rounded-xl">
                  <Send className="mr-2.5 h-5 w-5" />
                  Send Message
                </Button>
                <Link href="/pipelines" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-14 border-2 hover:bg-accent hover:border-primary/50 transition-all duration-200 text-[16px] font-bold rounded-xl bg-transparent shadow-sm hover:shadow-md"
                  >
                    View in Pipeline
                    <ExternalLink className="ml-2.5 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="invoices" className="pb-10">
              <div className="flex justify-end mb-8">
                <Button
                  variant="outline"
                  size="default"
                  className="h-11 px-6 font-semibold hover:bg-accent transition-all duration-200 bg-transparent border-2 rounded-lg shadow-sm hover:shadow-md"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Invoice
                </Button>
              </div>

              {loadingInvoices ? (
                <div className="text-center py-20 text-muted-foreground">
                  <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary border-t-transparent mx-auto mb-5"></div>
                  <p className="text-[15px] font-semibold">Loading invoices...</p>
                </div>
              ) : invoices.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border-2 border-border">
                  <FileText className="h-16 w-16 text-muted-foreground/40 mx-auto mb-5" />
                  <p className="text-foreground font-bold text-[18px] mb-2">No invoices found</p>
                  <p className="text-muted-foreground text-[15px] font-medium">
                    Create your first invoice to get started
                  </p>
                </div>
              ) : (
                <div className="bg-card rounded-2xl border-2 border-border overflow-hidden shadow-md">
                  <table className="w-full text-[15px]">
                    <thead className="bg-muted/50 border-b-2 border-border">
                      <tr>
                        <th className="text-left py-5 px-6 font-bold text-foreground">Invoice #</th>
                        <th className="text-left py-5 px-6 font-bold text-foreground">Date</th>
                        <th className="text-right py-5 px-6 font-bold text-foreground">Amount</th>
                        <th className="text-center py-5 px-6 font-bold text-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-border">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-muted/30 transition-colors duration-150">
                          <td className="py-5 px-6">
                            <button className="text-primary hover:underline font-bold">{invoice.invoice_number}</button>
                          </td>
                          <td className="py-5 px-6 text-muted-foreground font-semibold">
                            {new Date(invoice.due_date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-5 px-6 text-right font-bold text-foreground text-[16px]">
                            £{invoice.amount.toLocaleString()}
                          </td>
                          <td className="py-5 px-6 text-center">
                            <Badge
                              className={`${getInvoiceStatusBadge(invoice.status)} border-2 text-[13px] font-bold px-4 py-1.5 rounded-full`}
                            >
                              {invoice.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="pb-10">
              {loadingActivities ? (
                <div className="text-center py-20 text-muted-foreground">
                  <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary border-t-transparent mx-auto mb-5"></div>
                  <p className="text-[15px] font-semibold">Loading activity...</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-2xl border-2 border-border">
                  <MessageSquare className="h-16 w-16 text-muted-foreground/40 mx-auto mb-5" />
                  <p className="text-foreground font-bold text-[18px] mb-2">No recent activity yet</p>
                  <p className="text-muted-foreground text-[15px] font-medium">
                    Activity will appear here as you interact
                  </p>
                </div>
              ) : (
                <div className="space-y-0 relative pl-12">
                  <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20"></div>

                  {activities.map((activity) => (
                    <div key={activity.id} className="relative pb-8 last:pb-0">
                      <div className="absolute left-[-25px] top-2 w-12 h-12 rounded-xl bg-background border-3 border-primary flex items-center justify-center shadow-md">
                        {activity.action.toLowerCase().includes("email") ? (
                          <Mail className="h-5 w-5 text-blue-600" />
                        ) : activity.action.toLowerCase().includes("zoom") ||
                          activity.action.toLowerCase().includes("call") ? (
                          <MessageSquare className="h-5 w-5 text-green-600" />
                        ) : activity.action.toLowerCase().includes("invoice") ||
                          activity.action.toLowerCase().includes("paid") ? (
                          <DollarSign className="h-5 w-5 text-amber-600" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>

                      <div className="bg-card rounded-2xl border-2 border-border p-6 hover:shadow-md hover:border-muted-foreground/20 transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <p className="font-bold text-[16px] text-foreground leading-relaxed">{activity.action}</p>
                          <p className="text-[13px] text-muted-foreground flex-shrink-0 ml-4 font-bold uppercase tracking-wide">
                            {new Date(activity.timestamp).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <p className="text-[15px] text-muted-foreground leading-relaxed font-medium">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
