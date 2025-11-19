"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Save, Send, Upload, Code, FolderOpen, FileText, Edit3, X, Mail, MessageSquare, Sparkles, ChevronRight, Users } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

function formatDate(date: Date | undefined): string {
  if (!date) return "Pick a date"
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

interface Campaign {
  id: string
  name: string
  type: "email" | "sms"
  recipients: string
  content: string
  htmlContent?: string
  thumbnail?: string
  scheduled_date?: string
}

interface CampaignDialogProps {
  campaign: Campaign | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
  preselectedTemplate?: any
}

export function CampaignDialog({ campaign, open, onClose, onSuccess, preselectedTemplate }: CampaignDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    type: "email" as "email" | "sms",
    recipients: "all",
    content: "",
    htmlContent: "",
    thumbnail: "",
    subject: "",
    fromName: "The International Football Group",
    fromEmail: "info@theinternationalfootballgroup.com",
  })
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [contentMode, setContentMode] = useState<"visual" | "html">("visual")
  const [playerGroups, setPlayerGroups] = useState<Array<{ id: string; name: string; playerCount: number }>>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isEditingTemplate, setIsEditingTemplate] = useState(false)

  useEffect(() => {
    if (open) {
      fetchPlayerGroups()
      fetchTemplates()
      setCurrentStep(1)
    }
  }, [open])

  const fetchPlayerGroups = async () => {
    try {
      const response = await fetch("/api/player-groups")
      const data = await response.json()
      setPlayerGroups(data.data || [])
    } catch (error) {
      console.error("Error fetching player groups:", error)
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates")
      const data = await response.json()
      setTemplates(data.data || [])
    } catch (error) {
      console.error("Error fetching templates:", error)
    }
  }

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        type: campaign.type,
        recipients: campaign.recipients,
        content: campaign.content,
        htmlContent: campaign.htmlContent || "",
        thumbnail: campaign.thumbnail || "",
        subject: "",
        fromName: "The International Football Group",
        fromEmail: "info@theinternationalfootballgroup.com",
      })
      if (campaign.scheduled_date) {
        setScheduledDate(new Date(campaign.scheduled_date))
      }
    } else {
      // Reset form when dialog opens
      if (!preselectedTemplate) {
        setFormData({
          name: "",
          type: "email",
          recipients: "all",
          content: "",
          htmlContent: "",
          thumbnail: "",
          subject: "",
          fromName: "The International Football Group",
          fromEmail: "info@theinternationalfootballgroup.com",
        })
        setScheduledDate(undefined)
        setSelectedTemplate(null)
        setIsEditingTemplate(false)
      }
    }
  }, [campaign, open])

  // Handle preselected template
  useEffect(() => {
    if (preselectedTemplate && open) {
      handleTemplateSelect(preselectedTemplate.id, preselectedTemplate)
    }
  }, [preselectedTemplate, open])

  const handleTemplateSelect = (templateId: string, template?: any) => {
    const tmpl = template || templates.find(t => t.id === templateId)
    if (tmpl) {
      setSelectedTemplate(templateId)
      setFormData({
        ...formData,
        name: formData.name || `Campaign - ${tmpl.name}`,
        type: tmpl.type,
        content: tmpl.content || "",
        htmlContent: tmpl.htmlContent || "",
        thumbnail: tmpl.thumbnail || "",
        subject: tmpl.subject || "",
        fromName: tmpl.fromName || formData.fromName,
        fromEmail: tmpl.fromEmail || formData.fromEmail,
      })
      setIsEditingTemplate(false)
      // Move to next step after template selection
      if (currentStep === 1) {
        setCurrentStep(2)
      }
    }
  }

  const handleSaveDraft = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/campaigns", {
        method: campaign ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: "draft",
          scheduled_date: scheduledDate?.toISOString(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Campaign saved",
          description: "Your campaign has been saved as a draft.",
        })
        onSuccess()
        onClose()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendNow = async () => {
    if (!formData.name || !formData.subject || (!formData.content && !formData.htmlContent)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/campaigns/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Campaign sent!",
          description: `Your ${formData.type} campaign has been sent successfully.`,
        })
        onSuccess()
        onClose()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, thumbnail: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const filteredTemplates = templates.filter(t => t.type === formData.type)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] my-4 overflow-hidden p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            {campaign ? "Edit Campaign" : "Create New Campaign"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Build and send targeted campaigns to your players
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="px-6 py-3 border-b bg-gray-50/50">
          <div className="flex items-center justify-between gap-2">
            {[
              { step: 1, label: "Choose Type", icon: Mail },
              { step: 2, label: "Select Template", icon: FileText },
              { step: 3, label: "Customize Content", icon: Edit3 },
              { step: 4, label: "Configure & Send", icon: Send }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => setCurrentStep(item.step)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all w-full",
                    currentStep === item.step
                      ? "bg-blue-100 text-blue-700"
                      : currentStep > item.step
                      ? "text-green-600 cursor-pointer hover:bg-green-50"
                      : "text-gray-400 cursor-not-allowed opacity-60"
                  )}
                  disabled={currentStep < item.step}
                >
                  <div className={cn(
                    "flex items-center justify-center min-w-[28px] h-7 rounded-full text-xs font-semibold",
                    currentStep === item.step
                      ? "bg-blue-600 text-white"
                      : currentStep > item.step
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  )}>
                    {currentStep > item.step ? "✓" : item.step}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium whitespace-nowrap">{item.label}</span>
                </button>
                {index < 3 && (
                  <ChevronRight className="mx-1 h-4 w-4 text-gray-300 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(85vh - 200px)" }}>
          <div className="py-4">
            {/* Step 1: Campaign Type */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">Campaign Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={cn(
                        "cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-blue-300",
                        formData.type === "email"
                          ? "border-blue-500 bg-blue-50/50"
                          : "border-gray-200 hover:bg-gray-50"
                      )}
                      onClick={() => setFormData({ ...formData, type: "email" })}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">Email Campaign</h4>
                          <p className="text-xs text-gray-600">
                            Rich HTML emails with images and formatting
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-green-300",
                        formData.type === "sms"
                          ? "border-green-500 bg-green-50/50"
                          : "border-gray-200 hover:bg-gray-50"
                      )}
                      onClick={() => setFormData({ ...formData, type: "sms" })}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                          <MessageSquare className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">SMS Campaign</h4>
                          <p className="text-xs text-gray-600">
                            Quick text messages to players' phones
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="campaign-name" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Campaign Name *
                  </Label>
                  <Input
                    id="campaign-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Spring 2025 Recruitment Drive"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Give your campaign a memorable name for easy identification
                  </p>
                </div>

                <div>
                  <Label htmlFor="recipients" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Target Audience *
                  </Label>
                  <Select
                    value={formData.recipients}
                    onValueChange={(value) => setFormData({ ...formData, recipients: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>General</SelectLabel>
                        <SelectItem value="all">All Players</SelectItem>
                        <SelectItem value="programme">By Programme</SelectItem>
                        <SelectItem value="recruiter">By Recruiter</SelectItem>
                        <SelectItem value="custom">Custom List</SelectItem>
                      </SelectGroup>
                      {playerGroups.length > 0 && (
                        <SelectGroup>
                          <SelectLabel>Player Groups</SelectLabel>
                          {playerGroups.map((group) => (
                            <SelectItem key={group.id} value={`group-${group.id}`}>
                              {group.name} ({group.playerCount})
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Template Selection */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">Choose a Template</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Start with a pre-designed template or create from scratch
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(null)
                      setFormData({
                        ...formData,
                        content: "",
                        htmlContent: "",
                        thumbnail: "",
                        subject: "",
                      })
                      setCurrentStep(3)
                    }}
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Start from Scratch
                  </Button>
                </div>

                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <FileText className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                    <h3 className="text-sm font-semibold mb-1">No {formData.type} templates available</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Create your first {formData.type} template or start from scratch
                    </p>
                    <Button size="sm" onClick={() => setCurrentStep(3)}>
                      Create from Scratch
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={cn(
                          "cursor-pointer rounded-lg border-2 overflow-hidden transition-all hover:shadow-md",
                          selectedTemplate === template.id
                            ? "border-blue-500 bg-blue-50/30"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 relative">
                          {template.thumbnail ? (
                            <img
                              src={template.thumbnail}
                              alt={template.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <FileText className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          {selectedTemplate === template.id && (
                            <div className="absolute top-2 right-2">
                              <div className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                ✓ Selected
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <h4 className="text-xs font-semibold truncate">{template.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {template.category} • {template.usage_count}x
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Content Customization */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700">Customize Your Message</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {selectedTemplate
                        ? `Using: ${templates.find(t => t.id === selectedTemplate)?.name}`
                        : "Create your campaign content"
                      }
                    </p>
                  </div>
                  {selectedTemplate && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingTemplate(!isEditingTemplate)}
                    >
                      {isEditingTemplate ? "Lock" : "Edit"}
                    </Button>
                  )}
                </div>

                {formData.type === "email" && (
                  <div>
                    <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 mb-2 block">
                      Email Subject *
                    </Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g., Important Update from IFG Academy"
                      className="w-full"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Message Content *
                  </Label>
                  {formData.type === "email" ? (
                    <Tabs value={contentMode} onValueChange={(v) => setContentMode(v as "visual" | "html")}>
                      <TabsList className="mb-3">
                        <TabsTrigger value="visual">Visual Editor</TabsTrigger>
                        <TabsTrigger value="html">
                          <Code className="mr-2 h-4 w-4" />
                          HTML Editor
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="visual">
                        <Textarea
                          value={formData.content}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          placeholder="Write your email message here..."
                          rows={12}
                          className="font-sans text-base"
                          disabled={selectedTemplate !== null && !isEditingTemplate}
                        />
                      </TabsContent>
                      <TabsContent value="html">
                        <Textarea
                          value={formData.htmlContent}
                          onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                          placeholder="<html><body>Enter your HTML here...</body></html>"
                          rows={12}
                          className="font-mono text-sm"
                          disabled={selectedTemplate !== null && !isEditingTemplate}
                        />
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div>
                      <Textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Enter your SMS message here..."
                        rows={6}
                        maxLength={160}
                        className="text-base"
                        disabled={selectedTemplate !== null && !isEditingTemplate}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        {formData.content.length} / 160 characters
                      </p>
                    </div>
                  )}
                </div>

                {formData.type === "email" && (
                  <div>
                    <Label className="text-base font-medium mb-2 block">
                      Campaign Thumbnail (Optional)
                    </Label>
                    <div className="flex items-center gap-4">
                      {formData.thumbnail && (
                        <img
                          src={formData.thumbnail}
                          alt="Thumbnail"
                          className="h-24 w-32 rounded border object-cover"
                        />
                      )}
                      <label htmlFor="thumbnail-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 hover:border-blue-500 transition-colors">
                          <Upload className="h-5 w-5 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">
                            {formData.thumbnail ? "Change Image" : "Upload Image"}
                          </span>
                        </div>
                        <input
                          id="thumbnail-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailUpload}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Configure & Send */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Review & Send</h3>

                  <div className="rounded-lg border bg-gray-50/50 p-4 space-y-2.5">
                    <div className="flex justify-between py-1.5">
                      <span className="text-xs text-gray-500">Campaign Name:</span>
                      <span className="text-xs font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-xs text-gray-500">Type:</span>
                      <Badge variant={formData.type === "email" ? "default" : "secondary"} className="text-xs h-5">
                        {formData.type === "email" ? "Email" : "SMS"}
                      </Badge>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-xs text-gray-500">Recipients:</span>
                      <span className="text-xs font-medium capitalize">{formData.recipients.replace("-", " ")}</span>
                    </div>
                    {formData.type === "email" && formData.subject && (
                      <div className="flex justify-between py-1.5">
                        <span className="text-xs text-gray-500">Subject:</span>
                        <span className="text-xs font-medium truncate max-w-[200px]">{formData.subject}</span>
                      </div>
                    )}
                    {selectedTemplate && (
                      <div className="flex justify-between py-1.5">
                        <span className="text-xs text-gray-500">Template:</span>
                        <span className="text-xs font-medium">
                          {templates.find(t => t.id === selectedTemplate)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Schedule Delivery (Optional)
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !scheduledDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(scheduledDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={scheduledDate} onSelect={setScheduledDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to send immediately
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={loading}
              >
                ← Back
              </Button>
            )}

            {currentStep < 4 ? (
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={
                  (currentStep === 1 && !formData.name) ||
                  (currentStep === 3 && formData.type === "email" && !formData.subject)
                }
              >
                Continue →
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={loading}
                >
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  Save Draft
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSendNow}
                  disabled={loading}
                >
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  {scheduledDate ? "Schedule" : "Send Now"}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}