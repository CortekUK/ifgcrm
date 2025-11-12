"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
} from "lucide-react"
import Link from "next/link"

interface Player {
  id: number
  name: string
  email: string
  phone: string
  programme: string
  recruiter: string
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
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loadingInvoices, setLoadingInvoices] = useState(false)
  const [loadingActivities, setLoadingActivities] = useState(false)
  const [nextFollowUp, setNextFollowUp] = useState("")

  useEffect(() => {
    if (open) {
      fetchInvoices()
      fetchActivities()
    }
  }, [open, player.id])

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

  const handleSendPaymentLink = async (invoiceId: number) => {
    await fetch(`/api/invoices/${invoiceId}/send-link`, {
      method: "POST",
    })
    alert("Payment link sent!")
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[440px] sm:max-w-[440px] overflow-y-auto bg-gray-50 shadow-[-4px_0_12px_rgba(0,0,0,0.08)] transition-all duration-250 ease-in-out">
        <SheetHeader className="border-b pb-4 bg-white -mx-6 -mt-6 px-6 pt-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md">
              {getInitials(player.name)}
            </div>

            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl font-semibold text-gray-900 mb-2">{player.name}</SheetTitle>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  className={`${getStatusBadgeClass(player.status)} border font-medium transition-all duration-200`}
                >
                  {player.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">Recruiter: {player.recruiter}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow duration-200">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900 text-sm truncate">{player.email}</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow duration-200">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="font-medium text-gray-900 text-sm">{player.phone}</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow duration-200">
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">Programme</p>
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 text-xs">
                      {player.programme}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow duration-200">
                <div className="flex items-start gap-3">
                  <UserCircle2 className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-1">Recruiter</p>
                    <p className="font-medium text-gray-900 text-sm">{player.recruiter}</p>
                  </div>
                </div>
              </div>
            </div>

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
                    onChange={(e) => setNextFollowUp(e.target.value)}
                    className="focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

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
          </TabsContent>

          <TabsContent value="invoices" className="animate-fade-in">
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-blue-50 transition-colors duration-200 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Invoice
              </Button>
            </div>

            {loadingInvoices ? (
              <div className="text-center py-12 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                Loading invoices...
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No invoices found</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Invoice #</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:underline font-medium">
                            {invoice.invoice_number}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(invoice.due_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-gray-900">
                          ${invoice.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={`${getInvoiceStatusBadge(invoice.status)} border text-xs`}>
                            {invoice.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                  <button className="text-sm text-blue-600 hover:underline font-medium">
                    View full invoice history
                  </button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="animate-fade-in">
            {loadingActivities ? (
              <div className="text-center py-12 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                Loading activity...
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No recent activity yet</p>
                <p className="text-sm text-gray-400 mt-1">Activity will appear here as you interact</p>
              </div>
            ) : (
              <div className="space-y-0 relative pl-8">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200"></div>

                {activities.map((activity, index) => (
                  <div key={activity.id} className="relative pb-8 last:pb-0">
                    <div className="absolute left-[-31px] top-0 w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center shadow-sm">
                      {activity.action.toLowerCase().includes("email") ? (
                        <Mail className="h-4 w-4 text-blue-600" />
                      ) : activity.action.toLowerCase().includes("zoom") ||
                        activity.action.toLowerCase().includes("call") ? (
                        <MessageSquare className="h-4 w-4 text-green-600" />
                      ) : activity.action.toLowerCase().includes("invoice") ||
                        activity.action.toLowerCase().includes("paid") ? (
                        <DollarSign className="h-4 w-4 text-amber-600" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      )}
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow duration-200">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-sm text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {new Date(activity.timestamp).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
