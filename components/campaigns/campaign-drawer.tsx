"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Save, Send, Upload, Code } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

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
}

export function CampaignDrawer({ campaign, open, onClose, onSuccess }: CampaignDrawerProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "email" as "email" | "sms",
    recipients: "all",
    content: "",
    htmlContent: "",
    thumbnail: "",
  })
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [contentMode, setContentMode] = useState<"visual" | "html">("visual")

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        type: campaign.type,
        recipients: campaign.recipients,
        content: campaign.content,
        htmlContent: campaign.htmlContent || "",
        thumbnail: campaign.thumbnail || "",
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
      })
      setScheduledDate(undefined)
    }
  }, [campaign])

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
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>{campaign ? "Edit Campaign" : "Generate Campaign"}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Summer Recruitment 2025"
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
                <SelectItem value="all">All Players</SelectItem>
                <SelectItem value="programme">By Programme</SelectItem>
                <SelectItem value="recruiter">By Recruiter</SelectItem>
                <SelectItem value="custom">Custom List</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Message Content *</Label>
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
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter your email message here..."
                    rows={10}
                    className="font-sans"
                  />
                </TabsContent>
                <TabsContent value="html" className="mt-3">
                  <Textarea
                    value={formData.htmlContent}
                    onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                    placeholder="<html><body>Enter your HTML here...</body></html>"
                    rows={10}
                    className="font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter your SMS message here (160 characters max)..."
                rows={6}
                maxLength={160}
                className="mt-2"
              />
            )}
            {formData.type === "sms" && (
              <p className="mt-1 text-xs text-gray-500">{formData.content.length} / 160 characters</p>
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
                  {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
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
      </SheetContent>
    </Sheet>
  )
}
