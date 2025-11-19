"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Check, AlertTriangle, Phone, MessageSquare, Clock, ArrowRight } from 'lucide-react'

import { MatchedPlayerDialog } from "@/components/replies/matched-player-dialog"

const demoReplies = [
  {
    id: '1',
    fromName: null,
    fromNumber: '+44 7700 900123',
    message: "Hi, I'm interested in the US College pathway. What are the next steps?",
    receivedAt: '2h ago',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'unmatched',
  },
  {
    id: '2',
    fromName: 'Sarah Mensah',
    fromNumber: '+233 24 555 0198',
    message: 'Thanks for the info! When does the next recruitment camp start?',
    receivedAt: '5h ago',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'unmatched',
  },
  {
    id: '3',
    fromName: null,
    fromNumber: '+44 7700 900456',
    message: "I've submitted my application. Can someone confirm it was received?",
    receivedAt: '1d ago',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'unmatched',
  },
]

const demoPlayers = [
  { id: '101', name: 'Sarah Mensah', email: 'sarah.m@example.com', phone: '+233 24 555 0198', programme: 'US College 2026', status: 'In pipeline' },
  { id: '102', name: 'David Osei', email: 'david.o@example.com', phone: '+233 20 123 4567', programme: 'US College 2026', status: 'Contacted' },
  { id: '103', name: 'Grace Owusu', email: 'grace.o@example.com', phone: '+233 27 555 0167', programme: 'European Academy', status: 'Interview' },
  { id: '104', name: 'Kwame Asante', email: 'kwame.a@example.com', phone: '+44 7700 900123', programme: 'US College 2027', status: 'Contacted' },
  { id: '105', name: 'Akua Boateng', email: 'akua.b@example.com', phone: '+233 50 789 0123', programme: 'US College 2026', status: 'In pipeline' },
  { id: '106', name: 'Kofi Adjei', email: 'kofi.a@example.com', phone: '+44 7700 900456', programme: 'UK Programme', status: 'Signed' },
]

interface MatchReplyDrawerProps {
  replyId: string | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function MatchReplyDrawer({ replyId, open, onClose, onSuccess }: MatchReplyDrawerProps) {
  const router = useRouter()
  const [reply, setReply] = useState<typeof demoReplies[0] | null>(null)
  const [searchResults, setSearchResults] = useState<typeof demoPlayers>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [viewingPlayer, setViewingPlayer] = useState<typeof demoPlayers[0] | null>(null)
  const [showPlayerDialog, setShowPlayerDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (replyId && open) {
      fetchReplyDetails()
    } else {
      // Reset state when drawer closes
      setReply(null)
      setSearchResults([])
      setSearchQuery("")
      setSelectedPlayerId(null)
    }
  }, [replyId, open])

  const fetchReplyDetails = async () => {
    if (!replyId) return

    setLoading(true)
    try {
      // Find the reply in demo data
      const foundReply = demoReplies.find(r => r.id === replyId)
      if (foundReply) {
        setReply(foundReply)
      }
    } catch (error) {
      console.error("[v0] Error fetching reply details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const normalizedQuery = query.toLowerCase()
    const results = demoPlayers.filter(player =>
      player.name.toLowerCase().includes(normalizedQuery) ||
      player.email.toLowerCase().includes(normalizedQuery) ||
      player.phone.includes(query) ||
      player.id.includes(query)
    )
    setSearchResults(results)
  }

  const handleViewPlayer = (e: React.MouseEvent, player: typeof demoPlayers[0]) => {
    e.stopPropagation()
    setViewingPlayer(player)
    setShowPlayerDialog(true)
  }

  const handleCreateDealFromDialog = () => {
    if (viewingPlayer) {
      const params = new URLSearchParams({
        action: 'create_deal',
        playerId: viewingPlayer.id,
        playerName: viewingPlayer.name,
        playerEmail: viewingPlayer.email,
        playerPhone: viewingPlayer.phone
      })
      router.push(`/pipelines?${params.toString()}`)
      setShowPlayerDialog(false)
      onClose()
    }
  }

  const handleLinkToPlayer = async () => {
    if (!replyId || !selectedPlayerId) return

    setSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      toast({
        title: "Reply matched",
        description: "SMS reply has been linked to the player.",
      })

      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to match reply. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleMarkSpam = async () => {
    if (!replyId) return

    setSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))

      toast({
        title: "Marked as spam",
        description: "SMS reply has been marked as spam.",
      })

      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as spam. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateDeal = () => {
    if (!selectedPlayerId) return

    const player = demoPlayers.find(p => p.id === selectedPlayerId)
    if (player) {
      const params = new URLSearchParams({
        action: 'create_deal',
        playerId: player.id,
        playerName: player.name,
        playerEmail: player.email,
        playerPhone: player.phone
      })
      router.push(`/pipelines?${params.toString()}`)
      onClose()
    }
  }

  const selectedPlayer = searchResults.find(p => p.id === selectedPlayerId)

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden bg-white">
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-semibold text-gray-900">Match SMS Reply</DialogTitle>
            </div>
            <p className="text-sm text-gray-500 mt-1">Link this message to an existing player profile</p>
          </DialogHeader>

          {loading ? (
            <div className="p-6 space-y-6">
              <Skeleton className="h-32 w-full bg-gray-100 rounded-xl" />
              <Skeleton className="h-64 w-full bg-gray-100 rounded-xl" />
            </div>
          ) : reply ? (
            <div className="flex-1 overflow-y-auto max-h-[60vh]">
              <div className="p-6 pt-4 space-y-6">
                {/* Message Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                      <Phone className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">{reply.fromNumber}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{reply.receivedAt}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 relative">
                    <div className="absolute -left-1.5 top-4 w-3 h-3 bg-gray-50 border-l border-t border-gray-100 transform -rotate-45"></div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {reply.message}
                    </p>
                  </div>
                </div>

                {/* Search Section */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search for a player to link..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-9 h-9 text-sm bg-white"
                      autoFocus
                    />
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Search Results</h3>
                        <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                          {searchResults.length} found
                        </span>
                      </div>

                      {searchResults.map((player) => (
                        <div
                          key={player.id}
                          onClick={() => setSelectedPlayerId(player.id)}
                          className={`group relative flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${selectedPlayerId === player.id
                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                            }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-gray-900">{player.name}</span>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                                {player.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span>{player.phone}</span>
                              <span className="w-0.5 h-0.5 rounded-full bg-gray-300"></span>
                              <span>{player.programme}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-3 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={(e) => handleViewPlayer(e, player)}
                            >
                              View
                            </Button>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${selectedPlayerId === player.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 group-hover:border-blue-400'
                              }`}>
                              {selectedPlayerId === player.id && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchQuery && searchResults.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No players found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          <div className="p-6 pt-4 border-t bg-gray-50/50 flex items-center justify-between gap-3">
            <button
              onClick={handleMarkSpam}
              disabled={submitting}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors px-2"
            >
              Mark as spam
            </button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
              >
                Cancel
              </Button>
              {selectedPlayerId ? (
                <Button
                  onClick={handleCreateDeal}
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Create Deal
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleLinkToPlayer}
                  disabled={!selectedPlayerId || submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  {submitting ? "Linking..." : "Link to Player"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MatchedPlayerDialog
        open={showPlayerDialog}
        onOpenChange={setShowPlayerDialog}
        player={viewingPlayer}
        onCreateDeal={handleCreateDealFromDialog}
      />
    </>
  )
}
