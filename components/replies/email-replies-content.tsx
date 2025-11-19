"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, AlertCircle, Search, MoreVertical, CheckCircle, Reply, Clock, User, Tag, Brain, Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { findContactByPhoneOrEmail } from "@/lib/mock-data/contacts"
import { AiIntentDialog } from "../sms-replies/ai-intent-dialog"
import { MatchedPlayerDialog } from "./matched-player-dialog"
import { CreateDealModal } from "../pipelines/create-deal-modal"
import { useRouter } from "next/navigation"

// Generate demo email replies with proper matching logic
const generateDemoEmailReplies = () => {
  const emails = [
    {
      id: '1',
      fromEmail: 'john.smith@example.com', // John Smith - MATCHED
      subject: 'Re: US College Pathway Information',
      preview: "Thank you for the detailed information about the US College pathway. I have a few questions about the scholarship opportunities...",
      message: "Thank you for the detailed information about the US College pathway. I have a few questions about the scholarship opportunities and the application timeline. Could we schedule a call to discuss?",
      receivedAt: '2h ago',
      tags: ['prospect', 'high-priority'],
      hasAttachment: true,
      intent: 'positive',
    },
    {
      id: '2',
      fromEmail: 'emma.j@parent.com', // Emma Johnson - MATCHED
      subject: 'Re: Training Schedule Update',
      preview: "I received the updated training schedule. Just wanted to confirm that Emma will be attending all sessions...",
      message: "I received the updated training schedule. Just wanted to confirm that Emma will be attending all sessions. We're very excited about the program!",
      receivedAt: '5h ago',
      tags: ['parent', 'confirmed'],
      hasAttachment: false,
      intent: 'positive',
    },
    {
      id: '3',
      fromEmail: 'mchen@outlook.com', // Michael Chen - MATCHED
      subject: 'Re: Document Requirements',
      preview: "I've attached all the required documents as requested. Please let me know if you need anything else...",
      message: "I've attached all the required documents as requested. Please let me know if you need anything else for the application process. Looking forward to hearing back from you.",
      receivedAt: '1d ago',
      tags: ['documents', 'pending-review'],
      hasAttachment: true,
      intent: 'positive',
    },
    {
      id: '4',
      fromEmail: 'sophie.w@gmail.com', // Sophie Williams - MATCHED
      subject: 'Re: Payment Confirmation',
      preview: "Payment has been processed successfully. Thank you for the prompt response...",
      message: "Payment has been processed successfully. Thank you for the prompt response. We're looking forward to starting the program next month.",
      receivedAt: '2d ago',
      tags: ['payment', 'confirmed'],
      hasAttachment: true,
      intent: 'positive',
    },
    {
      id: '5',
      fromEmail: 'grace.owusu@gmail.com', // Grace Owusu - MATCHED
      subject: 'Re: Programme Enrollment',
      preview: "I'm sorry, but I've decided not to continue with the programme...",
      message: "I'm sorry, but I've decided not to continue with the programme. Please remove me from your mailing list. Thank you for your understanding.",
      receivedAt: '2d ago',
      tags: ['opt-out'],
      hasAttachment: false,
      intent: 'negative',
    },
    {
      id: '6',
      fromEmail: 'unknown.player@email.com', // Unknown - UNMATCHED
      subject: 'Question about tryouts',
      preview: "Hi, I wanted to know more about the upcoming tryouts schedule and requirements...",
      message: "Hi, I wanted to know more about the upcoming tryouts schedule and requirements. I'm particularly interested in the goalkeeper position. What should I prepare?",
      receivedAt: '3d ago',
      tags: ['new-inquiry'],
      hasAttachment: false,
      intent: 'positive',
    },
    {
      id: '7',
      fromEmail: 'newprospect@gmail.com', // Unknown - UNMATCHED
      subject: 'Interested in your program',
      preview: "I saw your advertisement and would like to learn more about the football academy...",
      message: "I saw your advertisement and would like to learn more about the football academy programs you offer. Could you send me more details?",
      receivedAt: '4d ago',
      tags: ['new-inquiry'],
      hasAttachment: false,
      intent: 'positive',
    },
    {
      id: '8',
      fromEmail: 'noreply@spam.com', // Spam - UNMATCHED
      subject: "You've won a prize!",
      preview: "Congratulations! You've been selected...",
      message: "Spam message content. UNSUBSCRIBE here.",
      receivedAt: '1d ago',
      tags: [],
      hasAttachment: false,
      intent: 'neutral',
    },
  ]

  // Apply matching logic based on contacts database
  return emails.map(email => {
    const contact = findContactByPhoneOrEmail(email.fromEmail)

    // Check for spam keywords
    const isSpam = email.message.toLowerCase().includes('unsubscribe') ||
      email.message.toLowerCase().includes('spam') ||
      email.subject.toLowerCase().includes('prize')

    return {
      ...email,
      fromName: contact?.name || null,
      status: isSpam ? 'spam' : (contact ? 'matched' : 'unmatched'),
      playerName: contact?.name || null,
      playerId: contact?.id || null,
      programme: contact?.programme || null,
    }
  })
}

const demoEmailReplies = generateDemoEmailReplies()

type StatusFilter = "matched" | "unmatched" | "spam"
type TimeRange = "7days" | "30days" | "all"

export function EmailRepliesContent() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<StatusFilter>("matched")
  const [showAiDialog, setShowAiDialog] = useState(false)
  const [timeRange, setTimeRange] = useState<TimeRange>("30days")
  const [searchQuery, setSearchQuery] = useState("")
  const [emails, setEmails] = useState(demoEmailReplies)
  const [loading, setLoading] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)
  const [showPlayerDialog, setShowPlayerDialog] = useState(false)
  const [showCreateDealModal, setShowCreateDealModal] = useState(false)
  const router = useRouter()

  const filteredEmails = emails.filter((email) => {
    const matchesTab = email.status === activeTab
    const matchesSearch =
      searchQuery === "" ||
      email.fromName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.fromEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  const handleMarkAsSpam = (emailId: string) => {
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, status: 'spam' as StatusFilter } : email
    ))
    toast({
      title: "Marked as spam",
      description: "The email has been marked as spam.",
    })
  }

  const handleArchive = (emailId: string) => {
    // Remove from current view by filtering it out
    setEmails(prev => prev.filter(email => email.id !== emailId))
    toast({
      title: "Email archived",
      description: "The email has been archived.",
    })
  }

  const handleReply = (email: any) => {
    toast({
      title: "Reply composer",
      description: `Opening reply to ${email.fromName}...`,
    })
  }

  const getStatusBadge = (status: string) => {
    if (status === "spam") {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Spam</Badge>
    }
    if (status === "matched") {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Matched</Badge>
    }
    return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Unmatched</Badge>
  }

  const handlePlayerClick = (email: any) => {
    if (email.status === 'matched') {
      setSelectedPlayer({
        id: email.playerId || '1',
        name: email.playerName || email.fromName,
        email: email.fromEmail,
        programme: email.programme,
        // Mock data for other fields
        phone: "+44 7700 900000",
        location: "London, UK",
        avatar: undefined
      })
      setShowPlayerDialog(true)
    }
  }

  const handleCreateDeal = () => {
    if (selectedPlayer) {
      setShowPlayerDialog(false)
      // Redirect to pipelines page with player details
      const params = new URLSearchParams({
        action: 'create_deal',
        playerId: selectedPlayer.id,
        playerName: selectedPlayer.name,
        playerEmail: selectedPlayer.email || '',
        playerPhone: selectedPlayer.phone || ''
      })
      router.push(`/pipelines?${params.toString()}`)
    }
  }

  const onDealCreated = (deal: any) => {
    toast({
      title: "Deal Created",
      description: "Redirecting to pipeline...",
    })
    // Navigate to pipelines page with deep link
    router.push(`/pipelines?pipelineId=${deal.pipeline_id}&dealId=${deal.id}`)
  }

  return (
    <>
      <Card className="mb-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex gap-1 p-2 border-b">
          <button
            onClick={() => setActiveTab("matched")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "matched"
              ? "bg-[#0A47B1] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            Matched
          </button>
          <button
            onClick={() => setActiveTab("unmatched")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "unmatched"
              ? "bg-[#0A47B1] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            Unmatched
          </button>
          <button
            onClick={() => setActiveTab("spam")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "spam"
              ? "bg-[#0A47B1] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
              }`}
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
            placeholder="Search by sender, subject, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {activeTab === "matched" && filteredEmails.length > 0 && (
          <Button
            onClick={() => setShowAiDialog(true)}
            className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Brain className="h-4 w-4" />
            AI Intent Analysis
            <Sparkles className="h-3 w-3" />
          </Button>
        )}
      </div>


      <div className="space-y-3">
        {loading ? (
          <Card className="p-8">
            <div className="text-center text-gray-500">Loading email replies...</div>
          </Card>
        ) : filteredEmails.length === 0 ? (
          <Card className="p-8">
            <div className="text-center">
              <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">
                {searchQuery.trim()
                  ? "No emails match your search."
                  : `No ${activeTab} email replies.`
                }
              </p>
            </div>
          </Card>
        ) : (
          filteredEmails.map((email) => (
            <Card key={email.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {email.fromName ? email.fromName.split(' ').map(n => n[0]).join('') : '?'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h4
                            className={`font-medium text-gray-900 ${email.status === 'matched' ? 'cursor-pointer hover:text-blue-600 hover:underline' : ''}`}
                            onClick={() => handlePlayerClick(email)}
                          >
                            {email.fromName || 'Unknown Sender'}
                            {email.status === 'matched' && email.programme && (
                              <span className="ml-2 text-xs font-normal text-gray-500">
                                • {email.programme}
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-500">{email.fromEmail}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {email.status === 'matched' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs px-2.5 bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePlayerClick(email)
                              }}
                            >
                              View Player
                            </Button>
                          )}
                          {getStatusBadge(email.status)}
                          <span className="text-xs text-gray-500">{email.receivedAt}</span>
                        </div>
                      </div>

                      <h3 className="text-sm mb-1 font-medium">
                        {email.subject}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {email.preview}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        {email.status === "matched" && email.intent && (
                          <>
                            {email.intent === 'positive' ? (
                              <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                Positive Intent
                              </Badge>
                            ) : email.intent === 'negative' ? (
                              <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                Negative Intent
                              </Badge>
                            ) : null}
                          </>
                        )}
                        {email.programme && (
                          <Badge variant="outline" className="text-xs">
                            {email.programme}
                          </Badge>
                        )}
                        {email.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="h-2.5 w-2.5 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {email.hasAttachment && (
                          <Badge variant="outline" className="text-xs">
                            📎 Attachment
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleReply(email)}>
                        <Reply className="mr-2 h-4 w-4" />
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchive(email.id)}>
                        <Clock className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                      {email.status !== 'spam' && (
                        <DropdownMenuItem
                          onClick={() => handleMarkAsSpam(email.id)}
                          className="text-red-600"
                        >
                          <AlertCircle className="mr-2 h-4 w-4" />
                          Mark as Spam
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {showAiDialog && (
        <AiIntentDialog
          open={showAiDialog}
          onOpenChange={setShowAiDialog}
          messages={filteredEmails.filter(e => e.status === 'matched').map(e => ({
            id: e.id,
            fromNumber: e.fromEmail,
            message: e.message,
            playerName: e.playerName,
            programme: e.programme,
            intent: e.intent,
          }))}
        />
      )}

      <MatchedPlayerDialog
        open={showPlayerDialog}
        onOpenChange={setShowPlayerDialog}
        player={selectedPlayer}
        onCreateDeal={handleCreateDeal}
      />
    </>
  )
}