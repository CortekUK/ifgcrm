"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Check, AlertTriangle, Phone, MessageSquare, Clock } from 'lucide-react'

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
  const [reply, setReply] = useState<typeof demoReplies[0] | null>(null)
  const [suggestedPlayers, setSuggestedPlayers] = useState<typeof demoPlayers>([])
  const [searchResults, setSearchResults] = useState<typeof demoPlayers>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (replyId && open) {
      fetchReplyDetails()
    } else {
      // Reset state when drawer closes
      setReply(null)
      setSuggestedPlayers([])
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
        
        // Find suggested matches
        const suggestions: typeof demoPlayers = []
        const normalizedPhone = foundReply.fromNumber.replace(/\D/g, '')
        const lastFourDigits = normalizedPhone.slice(-4)
        
        // 1. Exact phone match
        const exactMatch = demoPlayers.find(p => 
          p.phone.replace(/\D/g, '') === normalizedPhone
        )
        if (exactMatch) suggestions.push(exactMatch)
        
        // 2. Partial phone match (last 4 digits)
        const partialMatches = demoPlayers.filter(p => {
          const playerPhone = p.phone.replace(/\D/g, '')
          return playerPhone.slice(-4) === lastFourDigits && !suggestions.find(s => s.id === p.id)
        })
        suggestions.push(...partialMatches.slice(0, 2))
        
        // 3. Players from same programme (simulated - using "US College 2026" as recent campaign target)
        const sameProgramme = demoPlayers.filter(p => 
          p.programme === 'US College 2026' && !suggestions.find(s => s.id === p.id)
        )
        suggestions.push(...sameProgramme.slice(0, 2))
        
        setSuggestedPlayers(suggestions.slice(0, 5))
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

  const selectedPlayer = [...suggestedPlayers, ...searchResults].find(p => p.id === selectedPlayerId)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="border-b pb-4 mb-6">
          <SheetTitle className="text-2xl font-bold text-gray-900">Match SMS Reply</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full bg-gray-200" />
            <Skeleton className="h-48 w-full bg-gray-200" />
          </div>
        ) : reply ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="h-4 w-4" />
                <span className="font-medium">{reply.fromNumber}</span>
              </div>
              
              <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                      {reply.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                <span>Received {reply.receivedAt}</span>
              </div>
            </div>

            {suggestedPlayers.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  Suggested Players
                  <Badge variant="secondary" className="text-xs">
                    {suggestedPlayers.length}
                  </Badge>
                </h3>
                <ScrollArea className="h-[200px] rounded-lg border border-gray-200 bg-white">
                  <div className="p-2 space-y-1">
                    {suggestedPlayers.map((player) => (
                      <div
                        key={player.id}
                        onClick={() => setSelectedPlayerId(player.id)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedPlayerId === player.id
                            ? 'bg-blue-50 border-2 border-blue-500'
                            : 'hover:bg-gray-50 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{player.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {player.phone} • {player.programme}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {player.status}
                            </Badge>
                          </div>
                        </div>
                        {selectedPlayerId === player.id && (
                          <Check className="h-5 w-5 text-blue-600 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Search for player</h3>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by name, phone, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <>
                  {searchResults.length > 0 ? (
                    <ScrollArea className="h-[200px] rounded-lg border border-gray-200 bg-white">
                      <div className="p-2 space-y-1">
                        {searchResults.map((player) => (
                          <div
                            key={player.id}
                            onClick={() => setSelectedPlayerId(player.id)}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                              selectedPlayerId === player.id
                                ? 'bg-blue-50 border-2 border-blue-500'
                                : 'hover:bg-gray-50 border-2 border-transparent'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900">{player.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {player.email}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {player.phone} • {player.programme}
                              </p>
                            </div>
                            {selectedPlayerId === player.id && (
                              <Check className="h-5 w-5 text-blue-600 flex-shrink-0 ml-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                      <p className="text-sm text-gray-500">No players found matching "{searchQuery}"</p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t">
              <Button
                onClick={handleLinkToPlayer}
                disabled={!selectedPlayerId || submitting}
                size="lg"
                className="w-full"
              >
                {submitting ? "Linking..." : selectedPlayer ? `Link to ${selectedPlayer.name}` : "Link to Player"}
              </Button>
              <Button
                variant="outline"
                onClick={handleMarkSpam}
                disabled={submitting}
                size="lg"
                className="w-full gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <AlertTriangle className="h-4 w-4" />
                Mark as spam
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
