"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Upload, Code } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Template {
  id?: string
  name: string
  type: "email" | "sms"
  category: string
  content: string
  htmlContent?: string
  thumbnail?: string
}

interface TemplateDrawerProps {
  template: Template | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function TemplateDrawer({ template, open, onClose, onSuccess }: TemplateDrawerProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "email" as "email" | "sms",
    category: "newsletter",
    content: "",
    htmlContent: "",
    thumbnail: "",
  })
  const [contentMode, setContentMode] = useState<"visual" | "html">("visual")

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        type: template.type,
        category: template.category,
        content: template.content,
        htmlContent: template.htmlContent || "",
        thumbnail: template.thumbnail || "",
      })
    } else {
      setFormData({
        name: "",
        type: "email",
        category: "newsletter",
        content: "",
        htmlContent: "",
        thumbnail: "",
      })
    }
  }, [template])

  const handleSave = async () => {
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
      const url = template?.id ? `/api/templates/${template.id}` : "/api/templates"
      const method = template?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Template saved",
          description: `Your template has been ${template ? "updated" : "created"} successfully.`,
        })
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
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
      <DialogContent className="max-w-2xl max-h-[90vh] my-4 overflow-hidden p-0 flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle>{template ? "Edit Template" : "New Template"}</DialogTitle>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto px-6 py-4 space-y-4">
          <div>
            <Label htmlFor="name">Template Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Welcome Email Template"
            />
          </div>

          <div>
            <Label>Template Type *</Label>
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

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === "email" && (
            <div>
              <Label htmlFor="thumbnail">Thumbnail (Optional)</Label>
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
            <Label>Content *</Label>
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
                    placeholder="Enter your email template content here..."
                    rows={12}
                    className="font-sans"
                  />
                </TabsContent>
                <TabsContent value="html" className="mt-3">
                  <Textarea
                    value={formData.htmlContent}
                    onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                    placeholder="<html><body>Enter your HTML template here...</body></html>"
                    rows={12}
                    className="font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="mt-2">
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter your SMS template here (160 characters max)..."
                  rows={8}
                  maxLength={160}
                />
                <p className="mt-1 text-xs text-gray-500">{formData.content.length} / 160 characters</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Cancel
            </Button>
            <Button className="gradient-primary flex-1 text-white" onClick={handleSave} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              Save Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
