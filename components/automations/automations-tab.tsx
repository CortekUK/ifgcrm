"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Mail, UserCheck, Receipt, ChevronRight, Zap, AlertCircle } from 'lucide-react'
import { useState, useEffect } from "react"
import { WorkflowDrawer } from "@/components/automations/workflow-drawer"

const automations = [
  {
    id: 1,
    name: "New Lead Follow-Up",
    description: "3-step email sequence over 7 days.",
    status: "Active",
    trigger: "Triggered when a new player is added.",
    icon: Mail,
    lastRun: "2 hours ago",
    nextMessage: "Tomorrow (Email 2 of 3)",
    messagesSent: 127,
    completed: 89,
    isRunning: false,
    hasError: false,
  },
  {
    id: 2,
    name: "Signed Player Welcome",
    description: "Welcome sequence for new signees.",
    status: "Active",
    trigger: "Triggered when player status changes to Signed.",
    icon: UserCheck,
    lastRun: "1 day ago",
    nextMessage: "Dec 15 (Email 1 of 2)",
    messagesSent: 64,
    completed: 58,
    isRunning: false,
    hasError: false,
  },
  {
    id: 3,
    name: "Invoice Reminder",
    description: "Reminders before and after due dates.",
    status: "Paused",
    trigger: "Triggered when invoice due date is within 3 days.",
    icon: Receipt,
    lastRun: "3 days ago",
    nextMessage: "Paused",
    messagesSent: 42,
    completed: 35,
    isRunning: false,
    hasError: false,
  },
]

export function AutomationsTab() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<typeof automations[0] | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [workflows, setWorkflows] = useState(automations)

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      setIsLoading(true)
      setHasError(false)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      setWorkflows(automations)
    } catch (error) {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewWorkflow = (automation: typeof automations[0]) => {
    setSelectedWorkflow(automation)
    setIsDrawerOpen(true)
  }

  const handleRetry = () => {
    fetchWorkflows()
  }

  return (
    <>
      {hasError && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 border-l-4 border-l-red-500">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-800">Couldn't load automations. Please try again.</p>
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
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_120px_140px_140px_80px_100px_60px] gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700 uppercase tracking-wide">
          <div>Workflow</div>
          <div>Trigger</div>
          <div>Status</div>
          <div>Last run</div>
          <div>Next message</div>
          <div className="text-right">Sent</div>
          <div className="text-right">Completed</div>
          <div className="text-center">Action</div>
        </div>

        {isLoading ? (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_1fr_120px_140px_140px_80px_100px_60px] gap-4 px-4 py-2.5 mx-2 my-1"
              >
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-lg bg-[#E5E7EB] animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 bg-[#E5E7EB] animate-pulse rounded" />
                    <div className="h-3 w-56 bg-[#E5E7EB] animate-pulse rounded" />
                  </div>
                </div>
                <div className="h-4 w-full bg-[#E5E7EB] animate-pulse rounded" />
                <div className="h-6 w-20 bg-[#E5E7EB] animate-pulse rounded-full" />
                <div className="h-4 w-24 bg-[#E5E7EB] animate-pulse rounded" />
                <div className="h-4 w-32 bg-[#E5E7EB] animate-pulse rounded" />
                <div className="h-4 w-12 bg-[#E5E7EB] animate-pulse rounded ml-auto" />
                <div className="h-4 w-12 bg-[#E5E7EB] animate-pulse rounded ml-auto" />
                <div className="h-8 w-8 bg-[#E5E7EB] animate-pulse rounded mx-auto" />
              </div>
            ))}
          </div>
        ) : workflows.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <div className="rounded-full bg-gray-100 p-4 mb-3">
              <Zap className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No automations available yet</h3>
            <p className="text-sm text-gray-600 max-w-md text-center">
              Your follow-up, welcome, and reminder sequences will appear here.
            </p>
          </div>
        ) : (
          <TooltipProvider>
            <div className="divide-y divide-gray-100">
              {workflows.map((automation) => (
                <div
                  key={automation.id}
                  className="grid grid-cols-[2fr_1fr_120px_140px_140px_80px_100px_60px] gap-4 px-4 py-2.5 hover:bg-gray-50 transition-colors items-center rounded-lg mx-2 my-1"
                >
                  <div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 relative">
                        <automation.icon className="h-3.5 w-3.5 text-white" />
                        {automation.isRunning && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 cursor-help">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Automation currently running</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold text-gray-900 leading-snug flex items-center gap-2">
                          {automation.name}
                          {automation.hasError && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 text-[10px] px-1.5 py-0 cursor-help">
                                  Error
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Last run encountered an error</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 leading-tight">{automation.description}</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">{automation.trigger}</div>

                  <div>
                    <Badge
                      variant={automation.status === "Active" ? "default" : "secondary"}
                      className={
                        automation.status === "Active"
                          ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-xs"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200 text-xs"
                      }
                    >
                      {automation.status}
                    </Badge>
                  </div>

                  <div className={`text-sm ${automation.hasError ? "text-red-600 font-medium" : "text-gray-700"}`}>
                    {automation.hasError ? "Failed" : automation.lastRun}
                  </div>

                  <div className="text-sm text-gray-700">{automation.nextMessage}</div>
                  <div className="text-sm text-gray-500 text-right">{automation.messagesSent}</div>
                  <div className="text-sm text-gray-500 text-right">{automation.completed}</div>

                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-blue-50"
                      onClick={() => handleViewWorkflow(automation)}
                    >
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TooltipProvider>
        )}
      </div>

      {selectedWorkflow && (
        <WorkflowDrawer
          workflow={selectedWorkflow}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </>
  )
}
