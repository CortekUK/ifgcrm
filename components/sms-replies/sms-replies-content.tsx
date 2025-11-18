"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, AlertCircle, Search, MoreVertical, CheckCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MatchReplyDrawer } from "@/components/dashboard/match-reply-drawer"
import { useToast } from "@/hooks/use-toast"

const demoReplies = [
  {
    id: '1',
    fromName: null,
    fromNumber: '+44 7700 900123',
    message: "Hi, I'm interested in the US College pathway. What are the next steps?",
    receivedAt: '2h ago',
    status: 'unmatched',
    playerName: null,
    playerId: null,
    programme: null,
  },
  {
    id: '2',
    fromName: 'Sarah Mensah',
    fromNumber: '+233 24 555 0198',
    message: 'Thanks for the info! When does the next recruitment camp start?',
    receivedAt: '5h ago',
    status: 'unmatched',
    playerName: 'Sarah Mensah',
    playerId: '102',
    programme: 'US College 2026',
  },
  {
    id: '3',
    fromName: null,
    fromNumber: '+44 7700 900456',
    message: "I've submitted my application. Can someone confirm it was received?",
    receivedAt: '1d ago',
    status: 'unmatched',
    playerName: null,
    playerId: null,
    programme: null,
  },
  {
    id: '4',
    fromName: 'David Boateng',
    fromNumber: '+233 20 555 0223',
    message: 'STOP',
    receivedAt: '1d ago',
    status: 'spam',
    playerName: 'David Boateng',
    playerId: '103',
    programme: 'European Academy',
  },
  {
    id: '5',
    fromName: 'Grace Owusu',
    fromNumber: '+233 27 555 0167',
    message: 'All good, really happy with the updates. Thanks!',
    receivedAt: '2d ago',
    status: 'matched',
    playerName: 'Grace Owusu',
    playerId: '104',
    programme: 'UK Programme',
  },
]

type StatusFilter = "unmatched" | "matched" | "spam"
type TimeRange = "7days" | "30days" | "all"

export function SmsRepliesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState<StatusFilter>(
    (searchParams.get("status") as StatusFilter) || "unmatched"
  )
  const [timeRange, setTimeRange] = useState<TimeRange>("30days")
  const [searchQuery, setSearchQuery] = useState("")
  const [messages, setMessages] = useState(demoReplies)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null)

  useEffect(() => {
    const status = searchParams.get("status") as StatusFilter | null
    if (status && status !== activeTab) {
      setActiveTab(status)
    }
  }, [searchParams])

  const handleTabChange = (tab: StatusFilter) => {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams.toString())
    params.set("status", tab)
    router.push(`/sms-replies?${params.toString()}`, { scroll: false })
  }

  const handleMatchSuccess = () => {
    setSelectedReplyId(null)
    // Refresh the list
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === selectedReplyId ? { ...msg, status: 'matched' as const } : msg
      )
    )
  }

  const handleMarkSpam = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === id ? { ...msg, status: 'spam' as const } : msg
        )
      )
      toast({
        title: "Marked as spam",
        description: "SMS reply has been marked as spam.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as spam.",
        variant: "destructive",
      })
    }
  }

  const handleRestore = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === id ? { ...msg, status: 'unmatched' as const } : msg
        )
      )
      toast({
        title: "Restored",
        description: "SMS reply has been restored to unmatched.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restore reply.",
        variant: "destructive",
      })
    }
  }

  const filteredMessages = messages.filter(message => {
    // Status filter
    if (message.status !== activeTab) return false

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const nameMatch = message.fromName?.toLowerCase().includes(query) || message.playerName?.toLowerCase().includes(query)
      const phoneMatch = message.fromNumber?.toLowerCase().includes(query)
      const messageMatch = message.message.toLowerCase().includes(query)
      return nameMatch || phoneMatch || messageMatch
    }

    return true
  })

  const getStatusBadge = (status: string) => {
    if (status === "spam") {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Spam</Badge>
    }
    if (status === "matched") {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Matched</Badge>
    }
    return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Unmatched</Badge>
  }

  const getEmptyStateMessage = () => {
    if (searchQuery.trim()) {
      return "No replies match your search."
    }
    switch (activeTab) {
      case "unmatched":
        return "No unmatched replies – you're all caught up."
      case "matched":
        return "No matched replies yet for this period."
      case "spam":
        return "No spam messages."
      default:
        return "No SMS replies found."
    }
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap" rel="stylesheet" />
      
      <div className="mb-6">
        <h1
          className="text-2xl font-bold uppercase"
          style={{ fontFamily: "'Oswald', sans-serif", color: "#0A47B1" }}
        >
          SMS Replies
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Review and match incoming SMS messages from players and parents.
        </p>
      </div>

      <Card className="mb-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex gap-1 p-2 border-b">
          <button
            onClick={() => handleTabChange("unmatched")}
            className={`px-6 py-2.5 rounded-lg text-[15px] font-medium transition-all ${
              activeTab === "unmatched"
                ? "bg-[#0A47B1] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px" }}
          >
            Unmatched
          </button>
          <button
            onClick={() => handleTabChange("matched")}
            className={`px-6 py-2.5 rounded-lg text-[15px] font-medium transition-all ${
              activeTab === "matched"
                ? "bg-[#0A47B1] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px" }}
          >
            Matched
          </button>
          <button
            onClick={() => handleTabChange("spam")}
            className={`px-6 py-2.5 rounded-lg text-[15px] font-medium transition-all ${
              activeTab === "spam"
                ? "bg-[#0A47B1] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: "0.5px" }}
          >
            Spam
          </button>
        </div>
      </Card>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by player name, phone number, or message text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full bg-gray-200" />
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <p className="mt-4 text-sm font-semibold text-gray-900">Couldn't load replies</p>
              <p className="mt-1 text-xs text-gray-500">Please check your connection and try again.</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setError(false)}
              >
                Retry
              </Button>
            </div>
          ) : filteredMessages.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Message</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">From</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Received</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredMessages.map((message) => (
                    <tr 
                      key={message.id}
                      onClick={() => setSelectedReplyId(message.id)}
                      className="transition-colors hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <p className="line-clamp-2 text-sm text-gray-700">{message.message}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{message.fromNumber}</p>
                        {message.status === "matched" && message.playerName && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            <span className="text-blue-600 hover:underline cursor-pointer">{message.playerName}</span>
                            {message.programme && ` • ${message.programme}`}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(message.status)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">{message.receivedAt}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {message.status === "unmatched" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedReplyId(message.id)
                                }}
                              >
                                Match
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleMarkSpam(message.id)}>
                                    Mark as spam
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </>
                          )}
                          {message.status === "matched" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Navigate to player profile
                              }}
                            >
                              View player
                            </Button>
                          )}
                          {message.status === "spam" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRestore(message.id)
                              }}
                            >
                              Restore
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                {activeTab === "unmatched" ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-900">{getEmptyStateMessage()}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <MatchReplyDrawer
        replyId={selectedReplyId}
        open={!!selectedReplyId}
        onClose={() => setSelectedReplyId(null)}
        onSuccess={handleMatchSuccess}
      />
    </>
  )
}
