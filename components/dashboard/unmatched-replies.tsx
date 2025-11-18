"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare, ArrowRight, CheckCircle } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { MatchReplyDrawer } from "./match-reply-drawer"

const demoReplies = [
  {
    id: '1',
    phoneNumber: '+44 7700 900123',
    messageText: "Hi, I'm interested in the US College pathway. What are the next steps?",
    receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'unmatched',
    player: null,
  },
  {
    id: '2',
    phoneNumber: '+233 24 555 0198',
    messageText: 'Thanks for the info! When does the next recruitment camp start?',
    receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'unmatched',
    player: {
      id: 'sarah-123',
      name: 'Sarah Mensah',
      programmeName: 'US College Soccer',
    },
  },
  {
    id: '3',
    phoneNumber: '+44 7700 900456',
    messageText: "I've submitted my application. Can someone confirm it was received?",
    receivedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'unmatched',
    player: null,
  },
]

interface Player {
  id: string
  name: string
  programmeName: string | null
}

interface SmsReply {
  id: string
  phoneNumber: string
  messageText: string
  receivedAt: string
  status: string
  player: Player | null
}

export function UnmatchedReplies() {
  const router = useRouter()
  const [messages, setMessages] = useState<SmsReply[]>([])
  const [unmatchedCount, setUnmatchedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null)

  useEffect(() => {
    fetchReplies()
  }, [])

  const fetchReplies = async () => {
    setLoading(true)
    try {
      // Fetch replies list
      const repliesResponse = await fetch('/api/sms-replies?status=unmatched&limit=4')
      
      // Fetch count
      const countResponse = await fetch('/api/sms-replies?status=unmatched&countOnly=true')
      
      if (repliesResponse.ok && countResponse.ok) {
        const repliesData = await repliesResponse.json()
        const countData = await countResponse.json()
        
        // Use API data if available, otherwise fall back to demo data
        if (repliesData && repliesData.length > 0) {
          setMessages(repliesData)
          setUnmatchedCount(countData.count || repliesData.length)
        } else {
          // Use demo data as fallback
          setMessages(demoReplies)
          setUnmatchedCount(demoReplies.length)
        }
      } else {
        // API error - use demo data
        setMessages(demoReplies)
        setUnmatchedCount(demoReplies.length)
      }
    } catch (error) {
      console.error('[v0] Error fetching SMS replies:', error)
      // Use demo data on error
      setMessages(demoReplies)
      setUnmatchedCount(demoReplies.length)
    } finally {
      setLoading(false)
    }
  }

  const handleMatchSuccess = () => {
    setSelectedReplyId(null)
    // Refetch to get updated data
    fetchReplies()
  }

  const handleMatchClick = (replyId: string) => {
    // Navigate to SMS replies page with the reply ID to open drawer
    router.push(`/sms-replies?replyId=${replyId}`)
  }

  const formatTime = (isoDate: string) => {
    const now = new Date()
    const messageDate = new Date(isoDate)
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const truncateMessage = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <>
      <Card className="overflow-hidden rounded-[14px] border border-[#E1E5EF] shadow-sm transition-all duration-200 hover:shadow-[0_2px_8px_rgba(10,71,177,0.1)]">
        <div className="h-3 bg-gradient-to-b from-[#EAF1FD] to-white" />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle
                  className="text-sm uppercase tracking-wide py-0.5"
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.7px",
                    color: "#0A47B1",
                  }}
                >
                  Unmatched SMS Replies
                </CardTitle>
                {unmatchedCount > 0 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 font-medium">
                    {unmatchedCount} to review
                  </Badge>
                )}
              </div>
              <CardDescription className="mt-1 text-sm text-gray-600">
                Recent messages awaiting response.
              </CardDescription>
            </div>
            <Link href="/sms-replies?status=unmatched">
              <Button size="sm" className="gap-2">
                Review Replies
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-16 w-full bg-gray-200" />
                </div>
              ))}
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {message.player?.name || "Unknown number"}
                      </p>
                      <span className="text-xs text-gray-500">•</span>
                      <p className="text-xs text-gray-500">{message.phoneNumber}</p>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {truncateMessage(message.messageText)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatTime(message.receivedAt)}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    onClick={() => handleMatchClick(message.id)}
                  >
                    Match
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-900">No unmatched replies — you're all caught up.</p>
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
