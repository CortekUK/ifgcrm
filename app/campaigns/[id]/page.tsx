"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Mail,
  MessageSquare,
  Eye,
  MousePointerClick,
  TrendingUp,
  Activity,
  BarChart3,
  Users,
  ArrowLeft,
  Edit,
  Copy,
  Trash2,
  Send,
  Pause,
  Play
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

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
  last_sent: string
}

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  useEffect(() => {
    if (params.id) {
      fetchCampaign(params.id as string)
    }
  }, [params.id])

  const fetchCampaign = async (id: string) => {
    try {
      const response = await fetch(`/api/campaigns/${id}`)
      const data = await response.json()
      setCampaign(data)
    } catch (error) {
      console.error("Failed to fetch campaign:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    // This could open an edit modal or navigate to edit page
    console.log("Edit campaign:", campaign?.id)
  }

  const handleDuplicate = () => {
    console.log("Duplicate campaign:", campaign?.id)
  }

  const handleDelete = async () => {
    if (campaign && confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
      console.log("Delete campaign:", campaign.id)
      // After deletion, navigate back to campaigns list
      router.push("/campaigns")
    }
  }

  const handleSend = () => {
    console.log("Send campaign:", campaign?.id)
  }

  const handlePause = () => {
    console.log("Pause campaign:", campaign?.id)
  }

  if (!user) return null

  if (loading) {
    return (
      <AppLayout user={user} title="Campaign Details">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading campaign...</p>
        </div>
      </AppLayout>
    )
  }

  if (!campaign) {
    return (
      <AppLayout user={user} title="Campaign Not Found">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="mb-4 text-muted-foreground">Campaign not found</p>
          <Button onClick={() => router.push("/campaigns")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
        </div>
      </AppLayout>
    )
  }

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
    { programme: "Oxford & Cambridge", sent: 45, opened: 35, clicked: 23 },
    { programme: "London Universities", sent: 38, opened: 28, clicked: 19 },
    { programme: "Russell Group", sent: 32, opened: 22, clicked: 14 },
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
    <AppLayout user={user} title={campaign.name}>
      {/* Header with navigation and actions */}
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => router.push("/campaigns")}
            className="hover:text-primary"
          >
            Campaigns
          </button>
          <span>/</span>
          <span className="text-foreground">{campaign.name}</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {campaign.type}
              </Badge>
              <Badge
                variant="outline"
                className={`capitalize ${
                  campaign.status === 'sent' ? 'border-green-500 text-green-600' :
                  campaign.status === 'scheduled' ? 'border-blue-500 text-blue-600' :
                  campaign.status === 'paused' ? 'border-yellow-500 text-yellow-600' :
                  'border-gray-500 text-gray-600'
                }`}
              >
                {campaign.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Last sent: {new Date(campaign.last_sent).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {campaign.status === 'draft' && (
              <Button onClick={handleSend} className="gap-2">
                <Send className="h-4 w-4" />
                Send Campaign
              </Button>
            )}
            {campaign.status === 'sent' && (
              <Button onClick={handlePause} variant="outline" className="gap-2">
                <Pause className="h-4 w-4" />
                Pause
              </Button>
            )}
            {campaign.status === 'paused' && (
              <Button onClick={handleSend} className="gap-2">
                <Play className="h-4 w-4" />
                Resume
              </Button>
            )}
            <Button onClick={handleEdit} variant="outline" className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button onClick={handleDuplicate} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              Duplicate
            </Button>
            <Button onClick={handleDelete} variant="outline" className="gap-2 text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4 transition-all hover:shadow-md">
            <div className={`mb-3 inline-flex rounded-lg p-2 ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <BarChart3 className="h-5 w-5" />
                Open Rate Over Time
              </h3>
              <div className="space-y-3">
                {["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"].map((day, i) => (
                  <div key={day}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{day}</span>
                      <span className="font-medium">{[45, 52, 48, 50, 51][i]}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="gradient-primary h-full rounded-full transition-all"
                        style={{ width: `${[45, 52, 48, 50, 51][i]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <Activity className="h-5 w-5" />
                Delivery Stats by University Group
              </h3>
              <div className="space-y-3">
                {performanceData.map((item) => (
                  <div key={item.programme} className="rounded-lg border p-3">
                    <p className="mb-2 font-medium">{item.programme}</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sent</p>
                        <p className="font-semibold">{item.sent}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Opened</p>
                        <p className="font-semibold text-purple-600">{item.opened}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Clicked</p>
                        <p className="font-semibold text-green-600">{item.clicked}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold">
              <Users className="h-5 w-5" />
              Top Engaged Contacts
            </h3>
            <div className="space-y-3">
              {topContacts.map((contact, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-purple-600">{contact.opens}</p>
                      <p className="text-muted-foreground">Opens</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-green-600">{contact.clicks}</p>
                      <p className="text-muted-foreground">Clicks</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-3 font-semibold">Subject Line</h3>
            <p className="text-muted-foreground">
              {campaign.type === "email" ? "You're Invited: IFG Showcase Event" : "Not applicable for SMS"}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="mb-3 font-semibold">Message Content</h3>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm">
                Hi [Player Name],<br/><br/>
                We're excited to invite you to our upcoming showcase event where you'll have the opportunity to demonstrate your skills and meet with our coaching staff.<br/><br/>
                Event Details:<br/>
                - Date: Saturday, March 15th, 2024<br/>
                - Time: 10:00 AM - 2:00 PM<br/>
                - Location: IFG Training Center<br/><br/>
                Please RSVP by clicking the link below.<br/><br/>
                Best regards,<br/>
                IFG Academy Team
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="recipients" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Recipients List</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Oxford University List</p>
                  <p className="text-sm text-muted-foreground">45 recipients</p>
                </div>
                <Badge>Active</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Cambridge University List</p>
                  <p className="text-sm text-muted-foreground">38 recipients</p>
                </div>
                <Badge>Active</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">London Universities List</p>
                  <p className="text-sm text-muted-foreground">32 recipients</p>
                </div>
                <Badge>Active</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Activity Timeline</h3>
            <div className="space-y-4">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    {index < logs.length - 1 && (
                      <div className="absolute left-5 top-10 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium">{log.action}</p>
                    <p className="text-sm text-muted-foreground">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  )
}