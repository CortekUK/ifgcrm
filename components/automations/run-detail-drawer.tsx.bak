"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Mail, TrendingUp, Users, CheckCircle2, XCircle, Clock } from 'lucide-react'

interface BatchRun {
  workflowName: string
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

interface RunDetailDrawerProps {
  run: BatchRun
  open: boolean
  onClose: () => void
}

export function RunDetailDrawer({ run, open, onClose }: RunDetailDrawerProps) {
  const getSuccessRate = () => {
    return ((run.successCount / run.totalRecipients) * 100).toFixed(1)
  }

  const getStatusBadge = () => {
    const successRate = parseFloat(getSuccessRate())
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
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const statusInfo = getStatusBadge()

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader className="border-b pb-4 mb-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-lg font-bold text-gray-900 mb-1">
                  {run.workflowName}
                </SheetTitle>
                <p className="text-sm text-gray-600">
                  Batch run • {run.totalRecipients.toLocaleString()} contacts
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 ml-4">
              <Badge variant="outline" className={`text-xs ${statusInfo.class}`}>
                {statusInfo.text}
              </Badge>
              <span className="text-xs text-gray-500">{formatTimestamp(run.startedAt)}</span>
            </div>
          </div>
        </SheetHeader>

        <div className="mb-6">
          <div className="bg-gray-50 px-3 py-2 rounded-t-lg border border-b-0 border-gray-200">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Batch Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-4 py-4 rounded-b-lg border border-gray-200 bg-white">
            <div>
              <div className="text-xs text-gray-500 mb-1">Trigger</div>
              <div className="text-sm font-medium text-gray-900">{run.trigger}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Recipients</div>
              <div className="text-sm font-medium text-gray-900">{run.totalRecipients.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Started at</div>
              <div className="text-sm font-medium text-gray-900">{formatTimestamp(run.startedAt)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Completed at</div>
              <div className="text-sm font-medium text-gray-900">
                {run.completedAt ? formatTimestamp(run.completedAt) : "Still running"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Duration</div>
              <div className="text-sm font-medium text-gray-900">{run.duration}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Success Rate</div>
              <div className="text-sm font-medium text-gray-900">{getSuccessRate()}%</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 px-3 py-2 rounded-t-lg border border-b-0 border-gray-200">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Delivery Statistics</h3>
          </div>
          <div className="rounded-b-lg border border-gray-200 bg-white divide-y divide-gray-100">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Succeeded</span>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-gray-900">{run.successCount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{((run.successCount / run.totalRecipients) * 100).toFixed(1)}%</div>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Failed</span>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-gray-900">{run.failedCount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{((run.failedCount / run.totalRecipients) * 100).toFixed(1)}%</div>
              </div>
            </div>
            {run.skippedCount > 0 && (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Skipped</span>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold text-gray-900">{run.skippedCount.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{((run.skippedCount / run.totalRecipients) * 100).toFixed(1)}%</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {run.avgOpenRate !== null && (
          <div>
            <div className="bg-gray-50 px-3 py-2 rounded-t-lg border border-b-0 border-gray-200">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Engagement Metrics</h3>
            </div>
            <div className="rounded-b-lg border border-gray-200 bg-white divide-y divide-gray-100">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Average Open Rate</span>
                </div>
                <div className="text-base font-bold text-gray-900">{run.avgOpenRate}%</div>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">Average Click Rate</span>
                </div>
                <div className="text-base font-bold text-gray-900">{run.avgClickRate}%</div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
