"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Loader2 } from 'lucide-react'

interface StepDetailsDrawerProps {
  workflowId: number
  step: {
    id: number
    type: "email" | "wait" | "tag"
    title: string
    subtitle: string
    icon: React.ElementType
  }
  open: boolean
  onClose: () => void
  onStepUpdated?: () => void
}

const emailStepData = {
  subject: "Welcome to IFG - Your Pathway to Success",
  body: `Hi {{player_name}},

Welcome to The International Football Group! We're excited to help you take the next step in your football career.

Over the coming days, we'll share more information about our programmes and how we can support your journey.

Best regards,
The IFG Team`,
  fromName: "The International Football Group",
  replyTo: "admin@ifgcrm.com",
}

const waitStepData = {
  value: 2,
  unit: "days" as "minutes" | "hours" | "days",
}

export function StepDetailsDrawer({ workflowId, step, open, onClose, onStepUpdated }: StepDetailsDrawerProps) {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [subject, setSubject] = useState(emailStepData.subject)
  const [body, setBody] = useState(emailStepData.body)
  const [fromName, setFromName] = useState(emailStepData.fromName)
  const [replyTo, setReplyTo] = useState(emailStepData.replyTo)
  const [subjectError, setSubjectError] = useState("")

  const [waitValue, setWaitValue] = useState(waitStepData.value)
  const [waitUnit, setWaitUnit] = useState(waitStepData.unit)
  const [waitError, setWaitError] = useState("")

  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (open) {
      setError(null)
      setSubjectError("")
      setWaitError("")
      setHasChanges(false)
      
      // Reset to initial values
      if (step.type === "email") {
        setSubject(emailStepData.subject)
        setBody(emailStepData.body)
        setFromName(emailStepData.fromName)
        setReplyTo(emailStepData.replyTo)
      } else if (step.type === "wait") {
        setWaitValue(waitStepData.value)
        setWaitUnit(waitStepData.unit)
      }
    }
  }, [open, step.type])

  useEffect(() => {
    if (step.type === "email") {
      const changed =
        subject !== emailStepData.subject ||
        body !== emailStepData.body ||
        fromName !== emailStepData.fromName ||
        replyTo !== emailStepData.replyTo
      setHasChanges(changed)
    }
  }, [subject, body, fromName, replyTo, step.type])

  useEffect(() => {
    if (step.type === "wait") {
      const changed =
        waitValue !== waitStepData.value ||
        waitUnit !== waitStepData.unit
      setHasChanges(changed)
    }
  }, [waitValue, waitUnit, step.type])

  const insertToken = (token: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newBody = body.substring(0, start) + token + body.substring(end)
    
    setBody(newBody)
    
    // Set cursor position after inserted token
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + token.length, start + token.length)
    }, 0)
  }

  const handleSaveEmail = async () => {
    // Validate subject
    if (!subject.trim()) {
      setSubjectError("Subject line is required.")
      return
    }
    
    setSubjectError("")
    setIsSaving(true)
    setError(null)

    try {
      // Call API to update step
      const response = await fetch(`/api/automations/${workflowId}/steps/${step.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          body: body.trim(),
          fromName: fromName.trim() || emailStepData.fromName,
          replyTo: replyTo.trim() || emailStepData.replyTo,
        }),
      })

      if (!response.ok) {
        if (response.status === 403) {
          setError("You don't have permission to edit this step. Contact your CRM admin.")
          setIsSaving(false)
          return
        }
        throw new Error("Failed to save")
      }

      // Success
      toast({
        title: "Email step updated",
        description: "Your changes have been saved.",
      })
      
      onStepUpdated?.()
      onClose()
    } catch (err) {
      setError("We couldn't save your changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveWait = async () => {
    // Validate wait value
    if (waitValue <= 0) {
      setWaitError("Wait time must be greater than zero.")
      return
    }

    setWaitError("")
    setIsSaving(true)
    setError(null)

    try {
      // Call API to update step
      const response = await fetch(`/api/automations/${workflowId}/steps/${step.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          waitValue,
          waitUnit,
        }),
      })

      if (!response.ok) {
        if (response.status === 403) {
          setError("You don't have permission to edit this step. Contact your CRM admin.")
          setIsSaving(false)
          return
        }
        throw new Error("Failed to save")
      }

      // Success
      toast({
        title: "Wait step updated",
        description: "Your changes have been saved.",
      })
      
      onStepUpdated?.()
      onClose()
    } catch (err) {
      setError("We couldn't save your changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] my-4 overflow-hidden p-0 flex flex-col">
        <DialogHeader className="border-b pb-5 mb-6">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                step.type === "email"
                  ? "bg-blue-50"
                  : step.type === "wait"
                  ? "bg-amber-50"
                  : "bg-purple-50"
              }`}
            >
              <step.icon
                className={`h-5 w-5 ${
                  step.type === "email"
                    ? "text-blue-600"
                    : step.type === "wait"
                    ? "text-amber-600"
                    : "text-purple-600"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-bold text-gray-900">{step.title}</DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                {step.type === "email"
                  ? "Sends when this step is reached in the workflow."
                  : step.type === "wait"
                  ? "Delays the next step in the workflow."
                  : "Applies a tag when this step executes."}
              </p>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {step.type === "email" && (
            <>
              <div>
                <Label htmlFor="subject" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Subject Line <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject"
                  className={subjectError ? "border-red-500" : ""}
                  disabled={isSaving}
                />
                {subjectError && (
                  <p className="text-xs text-red-600 mt-1">{subjectError}</p>
                )}
              </div>

              <div>
                <Label htmlFor="body" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Email Body <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  ref={textareaRef}
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter email body..."
                  rows={10}
                  className="font-mono text-sm resize-none"
                  disabled={isSaving}
                />
                <p className="text-xs text-gray-500 mt-2">
                  You can use dynamic fields like {"{{player_name}}"}, {"{{programme}}"}, {"{{recruiter_name}}"}.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => insertToken("{{player_name}}")}
                    className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors"
                    disabled={isSaving}
                  >
                    {"{{player_name}}"}
                  </button>
                  <button
                    type="button"
                    onClick={() => insertToken("{{programme}}")}
                    className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors"
                    disabled={isSaving}
                  >
                    {"{{programme}}"}
                  </button>
                  <button
                    type="button"
                    onClick={() => insertToken("{{recruiter_name}}")}
                    className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors"
                    disabled={isSaving}
                  >
                    {"{{recruiter_name}}"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromName" className="text-sm font-medium text-gray-700 mb-2 block">
                    From name <span className="text-gray-400">(optional)</span>
                  </Label>
                  <Input
                    id="fromName"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    placeholder={emailStepData.fromName}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <Label htmlFor="replyTo" className="text-sm font-medium text-gray-700 mb-2 block">
                    Reply-to email <span className="text-gray-400">(optional)</span>
                  </Label>
                  <Input
                    id="replyTo"
                    type="email"
                    value={replyTo}
                    onChange={(e) => setReplyTo(e.target.value)}
                    placeholder={emailStepData.replyTo}
                    disabled={isSaving}
                  />
                </div>
              </div>
            </>
          )}

          {step.type === "wait" && (
            <div>
              <Label htmlFor="waitValue" className="text-sm font-semibold text-gray-900 mb-2 block">
                Wait before the next step
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="waitValue"
                  type="number"
                  min="1"
                  value={waitValue}
                  onChange={(e) => setWaitValue(parseInt(e.target.value) || 0)}
                  className={`w-24 ${waitError ? "border-red-500" : ""}`}
                  disabled={isSaving}
                />
                <Select value={waitUnit} onValueChange={(value: any) => setWaitUnit(value)} disabled={isSaving}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">minutes</SelectItem>
                    <SelectItem value="hours">hours</SelectItem>
                    <SelectItem value="days">days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {waitError && (
                <p className="text-xs text-red-600 mt-1">{waitError}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Changing this will only affect future runs, not messages already scheduled.
              </p>
            </div>
          )}

          {step.type === "tag" && (
            <div>
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Tag Details</h3>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                  Signed Player
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                This tag will be automatically applied to the player when this step executes.
              </p>
            </div>
          )}
        </div>

        {(step.type === "email" || step.type === "wait") && (
          <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t">
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={step.type === "email" ? handleSaveEmail : handleSaveWait}
              disabled={!hasChanges || isSaving || !!error}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
