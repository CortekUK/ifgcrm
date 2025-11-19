"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Save, Send, Upload, Code, FolderOpen, FileText, Edit3, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { Card } from "@/components/ui/card"

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

interface CampaignDrawerProps {
  campaign: Campaign | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
  preselectedTemplate?: any
}

export function CampaignDrawer({ campaign, open, onClose, onSuccess, preselectedTemplate }: CampaignDrawerProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
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
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [isEditingTemplate, setIsEditingTemplate] = useState(false)

  useEffect(() => {
    if (open) {
      fetchPlayerGroups()
      fetchTemplates()
    }
  }, [open])

  const fetchPlayerGroups = async () => {
    try {
      const response = await fetch("/api/player-groups")
      const data = await response.json()
      setPlayerGroups(data.data)
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
  }, [campaign])

  // Handle preselected template
  useEffect(() => {
    if (preselectedTemplate && open) {
      setSelectedTemplate(preselectedTemplate.id)
      setFormData({
        name: `Campaign - ${preselectedTemplate.name}`,
        type: preselectedTemplate.type,
        recipients: "all",
        content: preselectedTemplate.content || "",
        htmlContent: preselectedTemplate.htmlContent || "",
        thumbnail: preselectedTemplate.thumbnail || "",
        subject: preselectedTemplate.subject || "",
        fromName: preselectedTemplate.fromName || "The International Football Group",
        fromEmail: preselectedTemplate.fromEmail || "info@theinternationalfootballgroup.com",
      })
      setIsEditingTemplate(false)
    }
  }, [preselectedTemplate, open])

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setFormData({
        ...formData,
        name: formData.name || `Campaign - ${template.name}`,
        type: template.type,
        content: template.content || "",
        htmlContent: template.htmlContent || "",
        thumbnail: template.thumbnail || "",
        subject: template.subject || "",
        fromName: template.fromName || formData.fromName,
        fromEmail: template.fromEmail || formData.fromEmail,
      })
      setShowTemplateSelector(false)
      setIsEditingTemplate(false)
      toast({
        title: "Template applied",
        description: `"${template.name}" template has been applied to your campaign.`,
      })
    }
  }

  const handleClearTemplate = () => {
    setSelectedTemplate(null)
    setIsEditingTemplate(false)
    setFormData({
      ...formData,
      content: "",
      htmlContent: "",
      thumbnail: "",
      subject: "",
    })
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
    if (!formData.name || (!formData.content && !formData.htmlContent)) {
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] my-4 overflow-hidden p-0 flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle>{campaign ? "Edit Campaign" : "Generate Campaign"}</DialogTitle>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto px-6 py-4 space-y-4">
          <div>
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Champions League Talent Scout 2025"
            />
          </div>

          <div>
            <Label>Type *</Label>
            <div className="mt-2 flex gap-2">
              <Button
                type="button"
                variant={formData.type === "email" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setFormData({ ...formData, type: "email" })}
              >
                Email
              </Button>
              <Button
                type="button"
                variant={formData.type === "sms" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setFormData({ ...formData, type: "sms" })}
              >
                SMS
              </Button>
            </div>
          </div>

          {formData.type === "email" && (
            <div>
              <Label htmlFor="thumbnail">Campaign Thumbnail</Label>
              <div className="mt-2 flex items-center gap-3">
                {formData.thumbnail && (
                  <img
                    src={formData.thumbnail || "/placeholder.svg"}
                    alt="Thumbnail"
                    className="h-20 w-28 rounded border object-cover"
                  />
                )}
                <label htmlFor="thumbnail-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 hover:border-blue-500">
                    <Upload className="h-4 w-4" />
                    <span className="text-sm">Upload Image</span>
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

          <div>
            <Label htmlFor="recipients">Recipients *</Label>
            <Select
              value={formData.recipients}
              onValueChange={(value) => setFormData({ ...formData, recipients: value })}
            >
              <SelectTrigger>
                <SelectValue />
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
                    <SelectLabel className="flex items-center gap-1">
                      <FolderOpen className="h-3 w-3" />
                      Player Groups
                    </SelectLabel>
                    {playerGroups.map((group) => (
                      <SelectItem key={group.id} value={`group-${group.id}`}>
                        <span>{group.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({group.playerCount} players)
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
          </div>

          {formData.type === "email" && (
            <div>
              <Label htmlFor="subject">Email Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Important Update from IFG Academy"
                className="mt-2"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Message Content *</Label>
              <div className="flex gap-2">
                {selectedTemplate && (
                  <div className="flex items-center gap-2 rounded-md bg-blue-50 px-2 py-1">
                    <FileText className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-blue-600">
                      {templates.find(t => t.id === selectedTemplate)?.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-blue-100"
                      onClick={handleClearTemplate}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {selectedTemplate ? "Change Template" : "Use Template"}
                </Button>
                {selectedTemplate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingTemplate(!isEditingTemplate)}
                    className="gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    {isEditingTemplate ? "Done Editing" : "Edit"}
                  </Button>
                )}
              </div>
            </div>

            {/* Template Selector */}
            {showTemplateSelector && (
              <Card className="mb-3 p-3">
                <div className="mb-2 text-sm font-medium">Choose a template:</div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {templates
                    .filter(t => t.type === formData.type)
                    .map((template) => (
                      <div
                        key={template.id}
                        className="flex items-center justify-between rounded-lg border p-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium">{template.name}</div>
                            <div className="text-xs text-gray-500">{template.category}</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Select
                        </Button>
                      </div>
                    ))}
                  {templates.filter(t => t.type === formData.type).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No {formData.type} templates available
                    </p>
                  )}
                </div>
              </Card>
            )}

            {formData.type === "email" ? (
              <Tabs value={contentMode} onValueChange={(v) => setContentMode(v as "visual" | "html")} className="mt-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="visual">Visual Editor</TabsTrigger>
                  <TabsTrigger value="html">
                    <Code className="mr-2 h-4 w-4" />
                    HTML
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="visual" className="mt-3">
                  {isEditingTemplate && selectedTemplate && (
                    <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-xs text-yellow-700">
                        You're editing the template content. Changes won't affect the original template.
                      </p>
                    </div>
                  )}
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter your email message here..."
                    rows={10}
                    className="font-sans"
                    disabled={!isEditingTemplate && selectedTemplate !== null}
                  />
                </TabsContent>
                <TabsContent value="html" className="mt-3">
                  {isEditingTemplate && selectedTemplate && (
                    <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-xs text-yellow-700">
                        You're editing the template HTML. Changes won't affect the original template.
                      </p>
                    </div>
                  )}
                  <Textarea
                    value={formData.htmlContent}
                    onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                    placeholder="<html><body>Enter your HTML here...</body></html>"
                    rows={10}
                    className="font-mono text-sm"
                    disabled={!isEditingTemplate && selectedTemplate !== null}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div>
                {isEditingTemplate && selectedTemplate && (
                  <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-xs text-yellow-700">
                      You're editing the template content. Changes won't affect the original template.
                    </p>
                  </div>
                )}
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter your SMS message here (160 characters max)..."
                  rows={6}
                  maxLength={160}
                  className="mt-2"
                  disabled={!isEditingTemplate && selectedTemplate !== null}
                />
                {formData.type === "sms" && (
                  <p className="mt-1 text-xs text-gray-500">{formData.content.length} / 160 characters</p>
                )}
              </div>
            )}
          </div>

          <div>
            <Label>Schedule (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "mt-2 w-full justify-start text-left font-normal",
                    !scheduledDate && "text-muted-foreground",
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
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleSaveDraft} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button className="gradient-primary flex-1 text-white" onClick={handleSendNow} disabled={loading}>
              <Send className="mr-2 h-4 w-4" />
              Send Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
