"use client"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, ArrowRight, FileText, ActivityIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

function formatDateTime(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) + " at " + date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function formatDateTimeShort(date: Date): string {
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

interface Deal {
  id: number
  player_name: string
  programme: string
  recruiter: string
  last_activity: string
}

interface Activity {
  id: number
  type: string
  description: string
  timestamp: string
}

interface DealDrawerProps {
  deal: Deal | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DealDrawer({ deal, open, onOpenChange }: DealDrawerProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (deal && open) {
      setLoading(true)
      // Fetch activity for the player
      fetch(`/api/players/${deal.id}/activity`)
        .then((res) => res.json())
        .then((data) => {
          setActivities(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [deal, open])

  const handleMoveToNextStage = async () => {
    if (!deal) return

    try {
      const response = await fetch(`/api/deals/${deal.id}/next-stage`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Stage updated",
          description: "Player moved to next stage",
        })
        onOpenChange(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move player to next stage",
        variant: "destructive",
      })
    }
  }

  if (!deal) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[440px] overflow-y-auto transition-transform duration-250">
        <SheetHeader>
          <SheetTitle className="text-2xl">{deal.player_name}</SheetTitle>
          <SheetDescription>Pipeline deal details</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-6">
            {/* Deal Info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Programme</label>
                <p className="mt-1 text-sm text-gray-900">{deal.programme}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Recruiter</label>
                <div className="mt-1">
                  <Badge variant="secondary">{deal.recruiter}</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Last Activity</label>
                <p className="mt-1 text-sm text-gray-900">{formatDateTime(new Date(deal.last_activity))}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Contact</label>
                <p className="mt-1 text-sm text-gray-900">player@example.com</p>
                <p className="mt-0.5 text-sm text-gray-900">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleMoveToNextStage}
                className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                Move to Next Stage
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full gap-2 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <a href="/players" className="flex items-center justify-center">
                  View Full Profile
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notes yet</h3>
              <p className="text-sm text-gray-500 text-center">Add notes about this player's recruitment journey</p>
              <Button variant="outline" className="mt-4 bg-transparent">
                Add Note
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ActivityIcon className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              {loading ? (
                <div className="text-sm text-gray-500">Loading activity...</div>
              ) : activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="border-l-2 border-blue-200 pl-4 py-2">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDateTimeShort(new Date(activity.timestamp))}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-700">{activity.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
                    <ActivityIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
