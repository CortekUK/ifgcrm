"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, ThumbsUp, ThumbsDown, Sparkles, TrendingUp, TrendingDown, Users, MessageSquare, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  fromNumber: string
  message: string
  playerName: string | null
  programme: string | null
  intent?: string
}

interface AiIntentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  messages: Message[]
}

export function AiIntentDialog({ open, onOpenChange, messages }: AiIntentDialogProps) {
  const { toast } = useToast()
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{
    positive: Message[]
    negative: Message[]
    neutral: Message[]
  } | null>(null)

  const handleAnalyze = async () => {
    setAnalyzing(true)
    setProgress(0)

    // Simulate AI analysis with progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500))

    // Mock AI analysis results
    const analyzed = {
      positive: messages.filter(m => m.intent === 'positive'),
      negative: messages.filter(m => m.intent === 'negative'),
      neutral: messages.filter(m => m.intent === 'neutral' || !m.intent),
    }

    clearInterval(progressInterval)
    setProgress(100)
    setResults(analyzed)
    setAnalyzing(false)

    toast({
      title: "AI Analysis Complete",
      description: `Analyzed ${messages.length} messages and categorized by intent.`,
    })
  }

  useEffect(() => {
    if (open) {
      setResults(null)
      setProgress(0)
    }
  }, [open])

  const getIntentStats = () => {
    if (!results) return { positive: 0, negative: 0, neutral: 0 }

    const total = messages.length
    return {
      positive: Math.round((results.positive.length / total) * 100),
      negative: Math.round((results.negative.length / total) * 100),
      neutral: Math.round((results.neutral.length / total) * 100),
    }
  }

  const stats = getIntentStats()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Intent Analysis
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </DialogTitle>
          <DialogDescription>
            Use AI to analyze matched messages and categorize them by intent (positive/negative).
            This helps identify prospects who are interested vs those who want to opt-out.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {!results && !analyzing && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
              <p className="text-sm text-gray-600 mb-4">
                {messages.length} matched messages will be analyzed for intent
              </p>
              <Button onClick={handleAnalyze} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Start AI Analysis
              </Button>
            </div>
          )}

          {analyzing && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 animate-pulse">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analyzing Messages...</h3>
              <p className="text-sm text-gray-600 mb-4">
                AI is processing {messages.length} messages
              </p>
              <Progress value={progress} className="w-full max-w-xs mx-auto mb-2" />
              <p className="text-xs text-gray-500">{progress}% complete</p>
            </div>
          )}

          {results && (
            <div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-900">Positive Intent</p>
                      <p className="text-2xl font-bold text-green-700">{results.positive.length}</p>
                      <p className="text-xs text-green-600">{stats.positive}% of total</p>
                    </div>
                    <ThumbsUp className="h-8 w-8 text-green-600" />
                  </div>
                </Card>

                <Card className="p-4 bg-red-50 border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-900">Negative Intent</p>
                      <p className="text-2xl font-bold text-red-700">{results.negative.length}</p>
                      <p className="text-xs text-red-600">{stats.negative}% of total</p>
                    </div>
                    <ThumbsDown className="h-8 w-8 text-red-600" />
                  </div>
                </Card>

                <Card className="p-4 bg-gray-50 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Neutral/Unclear</p>
                      <p className="text-2xl font-bold text-gray-700">{results.neutral.length}</p>
                      <p className="text-xs text-gray-600">{stats.neutral}% of total</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-gray-600" />
                  </div>
                </Card>
              </div>

              <Tabs defaultValue="positive" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="positive" className="gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    Positive ({results.positive.length})
                  </TabsTrigger>
                  <TabsTrigger value="negative" className="gap-1">
                    <ThumbsDown className="h-3.5 w-3.5" />
                    Negative ({results.negative.length})
                  </TabsTrigger>
                  <TabsTrigger value="neutral" className="gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Neutral ({results.neutral.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="positive" className="mt-4 space-y-2 max-h-[250px] overflow-y-auto">
                  {results.positive.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No messages with positive intent</p>
                  ) : (
                    results.positive.map((msg) => (
                      <Card key={msg.id} className="p-3 bg-green-50 border-green-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-900">
                              {msg.playerName || msg.fromNumber}
                            </p>
                            <p className="text-xs text-green-700 mt-1">{msg.message}</p>
                            {msg.programme && (
                              <Badge className="mt-1 text-xs" variant="outline">
                                {msg.programme}
                              </Badge>
                            )}
                          </div>
                          <ThumbsUp className="h-4 w-4 text-green-600 ml-2 flex-shrink-0" />
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="negative" className="mt-4 space-y-2 max-h-[250px] overflow-y-auto">
                  {results.negative.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No messages with negative intent</p>
                  ) : (
                    results.negative.map((msg) => (
                      <Card key={msg.id} className="p-3 bg-red-50 border-red-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-red-900">
                              {msg.playerName || msg.fromNumber}
                            </p>
                            <p className="text-xs text-red-700 mt-1">{msg.message}</p>
                            {msg.programme && (
                              <Badge className="mt-1 text-xs" variant="outline">
                                {msg.programme}
                              </Badge>
                            )}
                          </div>
                          <ThumbsDown className="h-4 w-4 text-red-600 ml-2 flex-shrink-0" />
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="neutral" className="mt-4 space-y-2 max-h-[250px] overflow-y-auto">
                  {results.neutral.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No messages with neutral intent</p>
                  ) : (
                    results.neutral.map((msg) => (
                      <Card key={msg.id} className="p-3 bg-gray-50 border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {msg.playerName || msg.fromNumber}
                            </p>
                            <p className="text-xs text-gray-700 mt-1">{msg.message}</p>
                            {msg.programme && (
                              <Badge className="mt-1 text-xs" variant="outline">
                                {msg.programme}
                              </Badge>
                            )}
                          </div>
                          <MessageSquare className="h-4 w-4 text-gray-600 ml-2 flex-shrink-0" />
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 font-medium mb-1">Recommended Actions:</p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Follow up with {results.positive.length} positive intent contacts immediately</li>
                  <li>• Remove {results.negative.length} negative intent contacts from future campaigns</li>
                  <li>• Send clarification messages to {results.neutral.length} neutral contacts</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {results && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Actions Applied",
                  description: "Contact lists have been updated based on AI analysis.",
                })
                onOpenChange(false)
              }}
              className="gap-2"
            >
              Apply Recommendations
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}