"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mail, Clock, AlertCircle, Eye, TrendingUp, TrendingDown } from 'lucide-react'
import { RunDetailDrawer } from "./run-detail-drawer"
import type { User } from "@supabase/supabase-js"

interface BatchRun {
  id: string
  workflowId: number
  workflowName: string
  workflowIcon: string
  workflowDescription: string
  totalRecipients: number
  successCount: number
  failedCount: number
  skippedCount: number
  trigger: string
  startedAt: string
  completedAt: string | null
  duration: string
  avgOpenRate: number | null
  avgClickRate: number | null
}

const mockRuns: BatchRun[] = [
  {
    id: "1",
    workflowId: 1,
    workflowName: "New Lead Follow-Up",
    workflowIcon: "mail",
    workflowDescription: "3-step email sequence over 7 days.",
    totalRecipients: 1247,
    successCount: 1198,
    failedCount: 49,
    skippedCount: 0,
    trigger: "New player added",
    startedAt: "2025-01-18T10:30:00Z",
    completedAt: "2025-01-18T10:35:23Z",
    duration: "5m 23s",
    avgOpenRate: 68.4,
    avgClickRate: 24.7,
  },
  {
    id: "2",
    workflowId: 2,
    workflowName: "Signed Player Welcome",
    workflowIcon: "user-check",
    workflowDescription: "Welcome sequence for new signees.",
    totalRecipients: 89,
    successCount: 87,
    failedCount: 2,
    skippedCount: 0,
    trigger: "Player status changed to Signed",
    startedAt: "2025-01-18T08:15:00Z",
    completedAt: "2025-01-18T08:16:45Z",
    duration: "1m 45s",
    avgOpenRate: 82.3,
    avgClickRate: 31.2,
  },
  {
    id: "3",
    workflowId: 3,
    workflowName: "Invoice Reminder",
    workflowIcon: "receipt",
    workflowDescription: "Reminds parents of overdue invoices.",
    totalRecipients: 342,
    successCount: 0,
    failedCount: 342,
    skippedCount: 0,
    trigger: "Invoice overdue by 7 days",
    startedAt: "2025-01-17T14:00:00Z",
    completedAt: "2025-01-17T14:02:15Z",
    duration: "2m 15s",
    avgOpenRate: null,
    avgClickRate: null,
  },
  {
    id: "4",
    workflowId: 1,
    workflowName: "New Lead Follow-Up",
    workflowIcon: "mail",
    workflowDescription: "3-step email sequence over 7 days.",
    totalRecipients: 892,
    successCount: 892,
    failedCount: 0,
    skippedCount: 0,
    trigger: "New player added",
    startedAt: "2025-01-16T11:00:00Z",
    completedAt: "2025-01-16T11:04:12Z",
    duration: "4m 12s",
    avgOpenRate: 71.2,
    avgClickRate: 28.1,
  },
]

interface RunHistoryContentProps {
  user: User
}

export function RunHistoryContent({ user }: RunHistoryContentProps) {
  const [runs, setRuns] = useState<BatchRun[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [selectedRun, setSelectedRun] = useState<BatchRun | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  const [workflowFilter, setWorkflowFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRangeFilter, setDateRangeFilter] = useState("30")

  useEffect(() => {
    fetchRuns()
  }, [workflowFilter, statusFilter, dateRangeFilter])

  const fetchRuns = async () => {
    try {
      setIsLoading(true)
      setHasError(false)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      let filteredRuns = [...mockRuns]
      
      if (workflowFilter !== "all") {
        filteredRuns = filteredRuns.filter(run => run.workflowId.toString() === workflowFilter)
      }
      
      if (statusFilter !== "all") {
        if (statusFilter === "succeeded") {
          filteredRuns = filteredRuns.filter(run => run.successCount > 0 && run.failedCount === 0)
        } else if (statusFilter === "failed") {
          filteredRuns = filteredRuns.filter(run => run.failedCount > 0)
        }
      }
      
      setRuns(filteredRuns)
    } catch (error) {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewRun = (run: BatchRun) => {
    setSelectedRun(run)
    setIsDrawerOpen(true)
  }

  const handleRetry = () => {
    fetchRuns()
  }

  const getSuccessRate = (run: BatchRun) => {
    return ((run.successCount / run.totalRecipients) * 100).toFixed(1)
  }

  const getStatusBadge = (run: BatchRun) => {
    const successRate = parseFloat(getSuccessRate(run))
    if (successRate === 100) {
      return { text: "All succeeded", class: "bg-green-100 text-green-700 border-green-200" }
    } else if (run.failedCount === run.totalRecipients) {
      return { text: "All failed", class: "bg-red-100 text-red-700 border-red-200" }
    } else if (successRate >= 95) {
      return { text: "Mostly succeeded", class: "bg-green-100 text-green-700 border-green-200" }
    } else {
      return { text: "Partial success", class: "bg-amber-100 text-amber-700 border-amber-200" }
    }
  }

  const formatTimestamp = (iso: string) => {
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Select value={workflowFilter} onValueChange={setWorkflowFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All workflows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All workflows</SelectItem>
              <SelectItem value="1">New Lead Follow-Up</SelectItem>
              <SelectItem value="2">Signed Player Welcome</SelectItem>
              <SelectItem value="3">Invoice Reminder</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="succeeded">Succeeded</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasError && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 border-l-4 border-l-red-500">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-800">We couldn't load run history. Please try again.</p>
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={handleRetry}
            className="text-red-600 hover:text-red-700 h-auto p-0"
          >
            Retry
          </Button>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-[2.5fr_1fr_140px_120px_120px_120px_80px] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700 uppercase tracking-wide">
          <div>Workflow</div>
          <div>Recipients</div>
          <div>Status</div>
          <div>Started</div>
          <div>Duration</div>
          <div>Engagement</div>
          <div className="text-center">Action</div>
        </div>

        {isLoading ? (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[2.5fr_1fr_140px_120px_120px_120px_80px] gap-4 px-4 py-3"
              >
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-[#E5E7EB] animate-pulse rounded" />
                  <div className="h-3 w-56 bg-[#E5E7EB] animate-pulse rounded" />
                </div>
                <div className="h-4 w-32 bg-[#E5E7EB] animate-pulse rounded" />
                <div className="h-6 w-28 bg-[#E5E7EB] animate-pulse rounded-full" />
                <div className="h-4 w-20 bg-[#E5E7EB] animate-pulse rounded" />
                <div className="h-4 w-16 bg-[#E5E7EB] animate-pulse rounded" />
                <div className="h-4 w-20 bg-[#E5E7EB] animate-pulse rounded" />
                <div className="h-8 w-8 bg-[#E5E7EB] animate-pulse rounded mx-auto" />
              </div>
            ))}
          </div>
        ) : runs.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="rounded-full bg-gray-100 p-4 mb-3">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No runs to show yet</h3>
            <p className="text-sm text-gray-600 max-w-md text-center">
              Once your automations start sending messages, you'll see each batch run listed here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {runs.map((run) => {
              const statusInfo = getStatusBadge(run)
              return (
                <div
                  key={run.id}
                  className="grid grid-cols-[2.5fr_1fr_140px_120px_120px_120px_80px] gap-4 px-4 py-3 hover:bg-gray-50 transition-colors items-center"
                >
                  {/* Workflow */}
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0">
                        <Mail className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 leading-snug">
                          {run.workflowName}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                          {run.workflowDescription}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recipients */}
                  <div>
                    <div className="text-base font-bold text-gray-900">
                      {run.totalRecipients.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      <span className="text-green-600 font-medium">{run.successCount.toLocaleString()}</span>
                      {run.failedCount > 0 && (
                        <>
                          {" • "}
                          <span className="text-red-600 font-medium">{run.failedCount.toLocaleString()} failed</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <Badge variant="outline" className={`text-xs ${statusInfo.class}`}>
                      {statusInfo.text}
                    </Badge>
                  </div>

                  {/* Started */}
                  <div className="text-sm text-gray-700">
                    {formatTimestamp(run.startedAt)}
                  </div>

                  {/* Duration */}
                  <div className="text-sm text-gray-500">{run.duration}</div>

                  {/* Engagement */}
                  <div>
                    {run.avgOpenRate !== null ? (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-xs text-gray-700">
                          <TrendingUp className="h-3 w-3 text-blue-600" />
                          <span className="font-medium">{run.avgOpenRate}%</span>
                          <span className="text-gray-500">opens</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-700">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="font-medium">{run.avgClickRate}%</span>
                          <span className="text-gray-500">clicks</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">No data</div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-blue-50"
                      onClick={() => handleViewRun(run)}
                    >
                      <Eye className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selectedRun && (
        <RunDetailDrawer
          run={selectedRun}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </>
  )
}
