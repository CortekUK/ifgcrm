"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Clock, Tag, Zap, ChevronRight, AlertCircle, AlertTriangle } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { StepDetailsDrawer } from "./step-details-drawer"
import { MessagesDrawer } from "./messages-drawer"

interface WorkflowStep {
  id: number
  type: "email" | "wait" | "tag"
  title: string
  subtitle: string
  icon: React.ElementType
}

interface WorkflowDrawerProps {
  workflow: {
    id: number
    name: string
    description: string
    status: string
    trigger: string
    icon: React.ElementType
    isRunning?: boolean
    hasError?: boolean
  }
  open: boolean
  onClose: () => void
}

const workflowSteps: Record<number, WorkflowStep[]> = {
  1: [
    { id: 1, type: "email", title: "Send Email: Welcome to IFG", subtitle: "Immediately", icon: Mail },
    { id: 2, type: "wait", title: "Wait", subtitle: "2 days", icon: Clock },
    { id: 3, type: "email", title: "Send Email: Programme Details", subtitle: "After wait", icon: Mail },
    { id: 4, type: "wait", title: "Wait", subtitle: "5 days", icon: Clock },
    { id: 5, type: "email", title: "Send Email: Next Steps", subtitle: "After wait", icon: Mail },
  ],
  2: [
    { id: 1, type: "email", title: "Send Email: Congratulations", subtitle: "Immediately", icon: Mail },
    { id: 2, type: "tag", title: "Apply Tag: Signed Player", subtitle: "After email", icon: Tag },
  ],
  3: [
    { id: 1, type: "email", title: "Send Email: Invoice Due Soon", subtitle: "3 days before due date", icon: Mail },
    { id: 2, type: "wait", title: "Wait", subtitle: "Until due date", icon: Clock },
    { id: 3, type: "email", title: "Send Email: Invoice Overdue", subtitle: "1 day after due date", icon: Mail },
  ],
}

export function WorkflowDrawer({ workflow, open, onClose }: WorkflowDrawerProps) {
  const [isActive, setIsActive] = useState(workflow.status === "Active")
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null)
  const [isStepDrawerOpen, setIsStepDrawerOpen] = useState(false)
  const [isMessagesDrawerOpen, setIsMessagesDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [recentlyUpdatedStepId, setRecentlyUpdatedStepId] = useState<number | null>(null)

  useEffect(() => {
    if (open) {
      fetchWorkflowData()
    }
  }, [open, workflow.id])

  const fetchWorkflowData = async () => {
    try {
      setIsLoading(true)
      setHasError(false)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600))
      setSteps(workflowSteps[workflow.id] || [])
    } catch (error) {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStepClick = (step: WorkflowStep) => {
    setSelectedStep(step)
    setIsStepDrawerOpen(true)
  }

  const handleRetry = () => {
    fetchWorkflowData()
  }

  const handleRetryWorkflow = () => {
    // Simulate workflow retry
    console.log("[v0] Retrying workflow:", workflow.id)
  }

  const handleStepUpdated = () => {
    if (selectedStep) {
      setRecentlyUpdatedStepId(selectedStep.id)
      // Clear the highlight after 3 seconds
      setTimeout(() => {
        setRecentlyUpdatedStepId(null)
      }, 3000)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] my-4 overflow-hidden p-0 flex flex-col">
          <DialogHeader className="border-b pb-4 mb-5">
            {isLoading ? (
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#E5E7EB] animate-pulse flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-5 w-48 bg-[#E5E7EB] animate-pulse rounded" />
                  <div className="h-4 w-64 bg-[#E5E7EB] animate-pulse rounded" />
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <workflow.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-lg font-bold text-gray-900">{workflow.name}</DialogTitle>
                  <p className="text-sm text-gray-600 mt-0.5">{workflow.description}</p>
                </div>
              </div>
            )}
          </DialogHeader>

          {!isLoading && !hasError && workflow.hasError && (
            <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 border-l-4 border-l-red-500">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">This workflow encountered an error during the last run.</p>
              </div>
              <Button
                size="sm"
                onClick={handleRetryWorkflow}
                className="bg-blue-600 hover:bg-blue-700 text-white h-8 text-xs flex-shrink-0"
              >
                Retry
              </Button>
            </div>
          )}

          {hasError ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-red-100 p-3 mb-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Something went wrong</h3>
              <p className="text-sm text-gray-600 mb-4">We couldn't load this workflow.</p>
              <Button
                variant="link"
                size="sm"
                onClick={handleRetry}
                className="text-blue-600 hover:text-blue-700"
              >
                Retry
              </Button>
            </div>
          ) : isLoading ? (
            <div className="space-y-5">
              <div className="h-14 w-full bg-[#E5E7EB] animate-pulse rounded-lg" />
              <div className="space-y-2">
                <div className="h-16 w-full bg-[#E5E7EB] animate-pulse rounded-lg" />
              </div>
              <div className="space-y-3">
                <div className="h-10 w-32 bg-[#E5E7EB] animate-pulse rounded-lg" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 w-full bg-[#E5E7EB] animate-pulse rounded-lg" />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50">
                <Label htmlFor="status-toggle" className="text-sm font-medium text-gray-900">
                  Workflow Status
                </Label>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className={
                      isActive
                        ? "bg-green-100 text-green-700 border-green-200 text-xs"
                        : "bg-gray-100 text-gray-600 border-gray-200 text-xs"
                    }
                  >
                    {isActive ? "Active" : "Paused"}
                  </Badge>
                  <Switch
                    id="status-toggle"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>
              </div>

              <div>
                <div className="bg-gray-50 px-3 py-2 rounded-t-lg border border-b-0 border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Trigger</h3>
                </div>
                <div className="flex items-start gap-3 px-3 py-2.5 rounded-b-lg border border-gray-200 bg-white">
                  <Zap className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{workflow.trigger}</p>
                </div>
              </div>

              <div>
                <div className="bg-gray-50 px-3 py-2 mb-3 rounded-lg border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Steps</h3>
                </div>
                <div className="space-y-0 divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                  {steps.map((step, index) => {
                    const isStepRunning = workflow.isRunning && index === 0
                    const isStepFailed = workflow.hasError && index === 0
                    const isRecentlyUpdated = step.id === recentlyUpdatedStepId
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => handleStepClick(step)}
                        className={`w-full flex items-center gap-3 px-3 py-3 bg-white hover:bg-gray-50 transition-all duration-150 text-left ${
                          isRecentlyUpdated ? "bg-blue-50 animate-pulse" : ""
                        }`}
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center relative">
                          <span className="text-xs font-bold text-blue-700">{index + 1}</span>
                          {isStepRunning && !isStepFailed && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                          )}
                        </div>
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            isStepFailed
                              ? "bg-red-50"
                              : step.type === "email"
                              ? "bg-blue-50"
                              : step.type === "wait"
                              ? "bg-amber-50"
                              : "bg-purple-50"
                          }`}
                        >
                          {isStepFailed ? (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          ) : (
                            <step.icon
                              className={`h-4 w-4 ${
                                step.type === "email"
                                  ? "text-blue-600"
                                  : step.type === "wait"
                                  ? "text-amber-600"
                                  : "text-purple-600"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{step.title}</p>
                          <p className={`text-xs mt-0.5 ${isStepFailed ? "text-red-600" : isRecentlyUpdated ? "text-blue-600" : "text-gray-500"}`}>
                            {isStepFailed
                              ? "Failed — tap Retry to run again"
                              : isStepRunning
                              ? "In progress..."
                              : isRecentlyUpdated
                              ? "Updated just now"
                              : step.subtitle}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </button>
                    )
                  })}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-sm"
                onClick={() => setIsMessagesDrawerOpen(true)}
              >
                Run History
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Step Details Drawer */}
      {selectedStep && (
        <StepDetailsDrawer
          workflowId={workflow.id}
          step={selectedStep}
          open={isStepDrawerOpen}
          onClose={() => setIsStepDrawerOpen(false)}
          onStepUpdated={handleStepUpdated}
        />
      )}

      {/* Messages History Drawer */}
      <MessagesDrawer
        workflowName={workflow.name}
        open={isMessagesDrawerOpen}
        onClose={() => setIsMessagesDrawerOpen(false)}
      />
    </>
  )
}
