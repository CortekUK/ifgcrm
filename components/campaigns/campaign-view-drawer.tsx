"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Eye, MousePointerClick, TrendingUp, Activity, BarChart3, Users } from "lucide-react"

interface Campaign {
  id: string
  name: string
  type: "email" | "sms"
  status: string
  sent: number
  open_rate: number
  response_rate: number
  click_rate?: number
  created_at: string
}

interface CampaignViewDrawerProps {
  campaign: Campaign | null
  open: boolean
  onClose: () => void
}

export function CampaignViewDrawer({ campaign, open, onClose }: CampaignViewDrawerProps) {
  if (!campaign) return null

  const stats = [
    {
      label: "Total Sent",
      value: campaign.sent.toLocaleString(),
      icon: campaign.type === "email" ? Mail : MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Open Rate",
      value: `${campaign.open_rate}%`,
      icon: Eye,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Click Rate",
      value: `${campaign.click_rate || 0}%`,
      icon: MousePointerClick,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Bounce Rate",
      value: "2.1%",
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ]

  const performanceData = [
    { programme: "Pro Academy", sent: 45, opened: 35, clicked: 23 },
    { programme: "Elite Training", sent: 38, opened: 28, clicked: 19 },
    { programme: "Youth Development", sent: 32, opened: 22, clicked: 14 },
  ]

  const topContacts = [
    { name: "John Smith", email: "john.smith@email.com", opens: 5, clicks: 3 },
    { name: "Sarah Johnson", email: "sarah.j@email.com", opens: 4, clicks: 2 },
    { name: "Mike Wilson", email: "mike.w@email.com", opens: 3, clicks: 2 },
  ]

  const logs = [
    { time: "2 hours ago", action: "Campaign sent to 138 players", type: "sent" },
    { time: "4 hours ago", action: "Campaign scheduled", type: "scheduled" },
    { time: "1 day ago", action: "Campaign created", type: "created" },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] my-4 overflow-hidden p-0 flex flex-col">
        <DialogHeader>
          <DialogTitle>{campaign.name}</DialogTitle>
          <div className="flex items-center gap-2 pt-2">
            <Badge variant="outline" className="capitalize">
              {campaign.type}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {campaign.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="analytics" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <Card key={stat.label} className="p-3 transition-all hover:shadow-md">
                  <div className={`mb-2 inline-flex rounded-lg p-2 ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </Card>
              ))}
            </div>

            <Card className="p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <BarChart3 className="h-4 w-4" />
                Open Rate Over Time
              </h3>
              <div className="space-y-2">
                {["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"].map((day, i) => (
                  <div key={day}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-gray-600">{day}</span>
                      <span className="font-medium text-gray-900">{[45, 52, 48, 50, 51][i]}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="gradient-primary h-full rounded-full transition-all"
                        style={{ width: `${[45, 52, 48, 50, 51][i]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Activity className="h-4 w-4" />
                Delivery Stats by Programme
              </h3>
              <div className="space-y-3">
                {performanceData.map((item) => (
                  <div key={item.programme} className="rounded-lg border border-gray-100 p-3">
                    <p className="mb-2 font-medium text-gray-900">{item.programme}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500">Sent</p>
                        <p className="font-semibold text-gray-900">{item.sent}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Opened</p>
                        <p className="font-semibold text-purple-600">{item.opened}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Clicked</p>
                        <p className="font-semibold text-green-600">{item.clicked}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4" />
                Top Engaged Contacts
              </h3>
              <div className="space-y-2">
                {topContacts.map((contact, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 p-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.email}</p>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <div className="text-center">
                        <p className="font-semibold text-purple-600">{contact.opens}</p>
                        <p className="text-gray-500">Opens</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-green-600">{contact.clicks}</p>
                        <p className="text-gray-500">Clicks</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card className="p-4">
              <h3 className="mb-2 text-sm font-semibold">Message Content</h3>
              <p className="text-sm text-gray-600">
                Hi [Player Name], we're excited to invite you to our upcoming showcase event...
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="mb-2 text-sm font-semibold">Subject Line</h3>
              <p className="text-sm text-gray-600">
                {campaign.type === "email" ? "You're Invited: IFG Showcase Event" : "Not applicable for SMS"}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-3">
            {logs.map((log, index) => (
              <div key={index} className="flex gap-3">
                <div className="relative">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  {index < logs.length - 1 && <div className="absolute left-4 top-8 h-full w-px bg-gray-200" />}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-gray-900">{log.action}</p>
                  <p className="text-xs text-gray-500">{log.time}</p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
