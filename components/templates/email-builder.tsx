"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  Save,
  Eye,
  Undo,
  Redo,
  ChevronDown,
  ImageIcon,
  Type,
  Mouse,
  Space,
  Video,
  Share2,
  Minus,
  Code,
  Edit2,
  ChevronUp,
  Trash2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { generateHtmlFromBlocks } from "@/lib/generate-html-from-blocks"

type Block =
  | { type: "image"; src: string; alt: string }
  | { type: "text"; value: string }
  | { type: "button"; label: string; url: string }
  | { type: "spacer" }
  | { type: "video"; url: string }
  | { type: "social"; links: { platform: string; url: string }[] }
  | { type: "divider" }
  | { type: "html"; code: string }

interface EmailBuilderProps {
  template: any
  onClose: () => void
  onSuccess: () => void
}

export function EmailBuilder({ template, onClose, onSuccess }: EmailBuilderProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editorMode, setEditorMode] = useState<"content" | "settings">("content")
  const [htmlMode, setHtmlMode] = useState(false)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(null)
  const [hoveredBlockIndex, setHoveredBlockIndex] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    preheader: "",
    fromName: "The International Football Group",
    fromEmail: "info@theinternationalfootballgroup.com",
    replyTo: true,
    recipients: "all",
    html: "",
    thumbnail: "",
  })

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || "",
        subject: template.subject || "",
        preheader: template.preheader || "",
        fromName: template.fromName || "The International Football Group",
        fromEmail: template.fromEmail || "info@theinternationalfootballgroup.com",
        replyTo: true,
        recipients: "all",
        html: template.htmlContent || template.html || "",
        thumbnail: template.thumbnail || "",
      })
      setBlocks(template.blocks || [])
    }
  }, [template])

  const handleSave = async (action: "draft" | "exit") => {
    if (!formData.name || !formData.subject) {
      toast({
        title: "Validation Error",
        description: "Please fill in the template name and subject line.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Generate HTML from blocks
      const generatedHtml = generateHtmlFromBlocks(blocks, {
        fromName: formData.fromName,
        fromEmail: formData.fromEmail,
      })

      // Collect template data
      const templateData = {
        name: formData.name,
        subject: formData.subject,
        preheader: formData.preheader,
        fromName: formData.fromName,
        fromEmail: formData.fromEmail,
        recipientPreview: formData.recipients,
        blocks: blocks,
        html: generatedHtml,
        htmlContent: generatedHtml,
        type: "email",
        category: "newsletter",
        content: formData.subject,
        thumbnail: formData.thumbnail,
      }

      // Determine API endpoint and method
      const url = template?.id ? `/api/templates/${template.id}` : "/api/templates"
      const method = template?.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      })

      if (response.ok) {
        // Show appropriate toast message
        if (action === "draft") {
          toast({
            title: "Template saved",
            description: "Your template has been saved successfully.",
          })
        } else {
          toast({
            title: "Template saved",
            description: "Your template has been saved and you're being redirected.",
          })
          // Navigate back to templates page
          setTimeout(() => {
            router.push("/templates")
          }, 500)
        }
      } else {
        throw new Error("Failed to save")
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

  const addBlock = (blockType: string) => {
    let newBlock: Block

    switch (blockType) {
      case "Image":
        newBlock = { type: "image", src: "/placeholder.svg?height=300&width=600", alt: "" }
        break
      case "Text":
        newBlock = { type: "text", value: "Your text here..." }
        break
      case "Button":
        newBlock = { type: "button", label: "Call to action", url: "#" }
        break
      case "Spacer":
        newBlock = { type: "spacer" }
        break
      case "Video":
        newBlock = { type: "video", url: "" }
        break
      case "Social":
        newBlock = { type: "social", links: [] }
        break
      case "Divider":
        newBlock = { type: "divider" }
        break
      case "HTML":
        newBlock = { type: "html", code: "<p>Your HTML</p>" }
        break
      default:
        return
    }

    setBlocks([...blocks, newBlock])
    toast({
      title: "Block added",
      description: `${blockType} block added to canvas`,
    })
  }

  const moveBlockUp = (index: number) => {
    if (index === 0) return
    const newBlocks = [...blocks]
    ;[newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]]
    setBlocks(newBlocks)
  }

  const moveBlockDown = (index: number) => {
    if (index === blocks.length - 1) return
    const newBlocks = [...blocks]
    ;[newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]]
    setBlocks(newBlocks)
  }

  const deleteBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index))
    setEditingBlockIndex(null)
  }

  const updateBlock = (index: number, updatedBlock: Block) => {
    const newBlocks = [...blocks]
    newBlocks[index] = updatedBlock
    setBlocks(newBlocks)
  }

  const renderBlock = (block: Block, index: number) => {
    const isHovered = hoveredBlockIndex === index
    const isEditing = editingBlockIndex === index

    return (
      <div
        key={index}
        className="group relative"
        onMouseEnter={() => setHoveredBlockIndex(index)}
        onMouseLeave={() => setHoveredBlockIndex(null)}
      >
        {/* Block content */}
        <div className={cn("relative", isEditing && "ring-2 ring-blue-500 ring-offset-2")}>
          {block.type === "image" && (
            <div className="overflow-hidden rounded-lg">
              <img src={block.src || "/placeholder.svg"} alt={block.alt} className="h-auto w-full" />
            </div>
          )}
          {block.type === "text" && (
            <div className="prose max-w-none">
              <p className="text-gray-700">{block.value}</p>
            </div>
          )}
          {block.type === "button" && (
            <div className="text-center">
              <a
                href={block.url}
                className="inline-block rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white transition-all hover:from-blue-700 hover:to-blue-800"
              >
                {block.label}
              </a>
            </div>
          )}
          {block.type === "spacer" && <div className="h-8" />}
          {block.type === "divider" && <div className="my-6 h-px bg-gray-200" />}
          {block.type === "html" && (
            <div className="rounded bg-gray-50 p-4">
              <div dangerouslySetInnerHTML={{ __html: block.code }} />
            </div>
          )}
        </div>

        {/* Hover actions */}
        {isHovered && !isEditing && (
          <div className="absolute right-2 top-2 flex gap-1 rounded-lg bg-white p-1 shadow-lg">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditingBlockIndex(index)}>
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={() => moveBlockUp(index)}
              disabled={index === 0}
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={() => moveBlockDown(index)}
              disabled={index === blocks.length - 1}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => deleteBlock(index)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* Inline editor */}
        {isEditing && (
          <div className="mt-2 rounded-lg border bg-white p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold">Edit {block.type}</h4>
              <Button size="sm" variant="ghost" onClick={() => setEditingBlockIndex(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {block.type === "image" && (
                <>
                  <div>
                    <Label className="text-xs">Image URL</Label>
                    <Input
                      value={block.src}
                      onChange={(e) => updateBlock(index, { ...block, src: e.target.value })}
                      placeholder="https://..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Alt Text</Label>
                    <Input
                      value={block.alt}
                      onChange={(e) => updateBlock(index, { ...block, alt: e.target.value })}
                      placeholder="Describe the image"
                      className="mt-1"
                    />
                  </div>
                </>
              )}
              {block.type === "text" && (
                <div>
                  <Label className="text-xs">Content</Label>
                  <Textarea
                    value={block.value}
                    onChange={(e) => updateBlock(index, { ...block, value: e.target.value })}
                    placeholder="Enter your text..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
              )}
              {block.type === "button" && (
                <>
                  <div>
                    <Label className="text-xs">Button Label</Label>
                    <Input
                      value={block.label}
                      onChange={(e) => updateBlock(index, { ...block, label: e.target.value })}
                      placeholder="Click here"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Link URL</Label>
                    <Input
                      value={block.url}
                      onChange={(e) => updateBlock(index, { ...block, url: e.target.value })}
                      placeholder="https://..."
                      className="mt-1"
                    />
                  </div>
                </>
              )}
              {block.type === "html" && (
                <div>
                  <Label className="text-xs">HTML Code</Label>
                  <Textarea
                    value={block.code}
                    onChange={(e) => updateBlock(index, { ...block, code: e.target.value })}
                    placeholder="<p>Your HTML</p>"
                    className="mt-1 font-mono text-xs"
                    rows={6}
                  />
                </div>
              )}
            </div>
            <Button size="sm" className="mt-3 w-full" onClick={() => setEditingBlockIndex(null)}>
              Done
            </Button>
          </div>
        )}
      </div>
    )
  }

  const blockTypes = [
    { icon: ImageIcon, label: "Image" },
    { icon: Type, label: "Text" },
    { icon: Mouse, label: "Button" },
    { icon: Space, label: "Spacer" },
    { icon: Video, label: "Video" },
    { icon: Share2, label: "Social" },
    { icon: Minus, label: "Divider" },
    { icon: Code, label: "HTML" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
      {/* Top toolbar */}
      <div className="gradient-primary flex items-center justify-between border-b px-6 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
            <X className="h-4 w-4" />
          </Button>
          <div className="text-white">
            <div className="text-sm font-medium">{template ? "Edit Template" : "New Email Template"}</div>
            <div className="text-xs text-blue-100">{formData.name || "Untitled Template"}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Redo className="h-4 w-4" />
          </Button>
          <div className="mx-2 h-6 w-px bg-white/30" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSave("draft")}
            className="text-white hover:bg-white/10"
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            size="sm"
            className="bg-white text-blue-600 shadow-md hover:bg-blue-50"
            onClick={() => handleSave("exit")}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save & Exit"}
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Form & Settings */}
        <div className="w-[420px] overflow-y-auto border-r bg-white p-6">
          <div className="space-y-5">
            <div>
              <Label htmlFor="template-name" className="text-sm font-medium text-gray-700">
                Template Name *
              </Label>
              <Input
                id="template-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., 2025/2026 Newsletter"
                className="mt-1.5"
              />
            </div>

            <div className="h-px bg-gray-200" />

            <div>
              <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                Subject Line *
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., 2025/2026 Newsletter – IFG Macclesfield FC"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="preheader" className="text-sm font-medium text-gray-700">
                Preheader
              </Label>
              <Input
                id="preheader"
                value={formData.preheader}
                onChange={(e) => setFormData({ ...formData, preheader: e.target.value })}
                placeholder="Join us for 2026!"
                className="mt-1.5"
              />
              <p className="mt-1 text-xs text-gray-500">
                If this field is left blank the first line of your email will display.
              </p>
            </div>

            <div className="h-px bg-gray-200" />

            <div>
              <Label htmlFor="from-name" className="text-sm font-medium text-gray-700">
                From Name *
              </Label>
              <Input
                id="from-name"
                value={formData.fromName}
                onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="from-email" className="text-sm font-medium text-gray-700">
                From Email *
              </Label>
              <Input
                id="from-email"
                type="email"
                value={formData.fromEmail}
                onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                className="mt-1.5"
              />
              <div className="mt-2 flex items-center gap-2">
                <Checkbox
                  id="reply-to"
                  checked={formData.replyTo}
                  onCheckedChange={(checked) => setFormData({ ...formData, replyTo: checked as boolean })}
                />
                <Label htmlFor="reply-to" className="cursor-pointer text-sm font-normal text-gray-600">
                  Use this email as my reply-to address
                </Label>
              </div>
            </div>

            <div className="h-px bg-gray-200" />

            <div>
              <Label className="text-sm font-medium text-gray-700">Recipient Preview</Label>
              <p className="mb-2 text-xs text-gray-500">
                Select the recipients you would like to receive this campaign.
              </p>
              <Select
                value={formData.recipients}
                onValueChange={(value) => setFormData({ ...formData, recipients: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ALL CONTACTS - EVERYONE</SelectItem>
                  <SelectItem value="programme">By Programme</SelectItem>
                  <SelectItem value="recruiter">By Recruiter</SelectItem>
                  <SelectItem value="status">By Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-px bg-gray-200" />

            <div>
              <Label className="text-sm font-medium text-gray-700">Thumbnail Preview</Label>
              <div className="mt-2 aspect-video overflow-hidden rounded-lg border bg-gray-50">
                {formData.thumbnail ? (
                  <img
                    src={formData.thumbnail || "/placeholder.svg"}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <div className="text-center">
                      <ImageIcon className="mx-auto mb-2 h-12 w-12" />
                      <p className="text-xs">Add content to see preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="gradient-primary flex-1 text-white"
                onClick={() => handleSave("exit")}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save & Exit"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right panel - Content Builder */}
        <div className="flex flex-1 flex-col overflow-hidden bg-gray-100">
          {/* Content toolbar */}
          <div className="flex items-center justify-between border-b bg-white px-4 py-2">
            <Tabs value={editorMode} onValueChange={(v) => setEditorMode(v as any)} className="w-auto">
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="settings">Global Settings</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHtmlMode(!htmlMode)}
              className={cn("gap-2", htmlMode && "bg-blue-50 text-blue-600")}
            >
              <Code className="h-4 w-4" />
              {htmlMode ? "Visual Editor" : "HTML"}
            </Button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Blocks sidebar */}
            {editorMode === "content" && !htmlMode && (
              <div className="w-64 overflow-y-auto border-r bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Blocks</h3>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-1">
                  {blockTypes.map((block) => (
                    <button
                      key={block.label}
                      onClick={() => addBlock(block.label)}
                      className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left text-sm transition-colors hover:border-blue-200 hover:bg-blue-50"
                    >
                      <block.icon className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-700">{block.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold text-gray-900">Saved Modules</h3>
                  <p className="text-xs text-gray-500">Save frequently used blocks to reuse later.</p>
                </div>
              </div>
            )}

            {/* Canvas area */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mx-auto max-w-[600px]">
                {!htmlMode && (formData.subject || formData.preheader) && (
                  <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm">
                    {formData.subject && (
                      <div className="mb-1">
                        <span className="text-xs font-medium text-gray-500">Subject: </span>
                        <span className="text-sm text-gray-700">{formData.subject}</span>
                      </div>
                    )}
                    {formData.preheader && (
                      <div>
                        <span className="text-xs font-medium text-gray-500">Preheader: </span>
                        <span className="text-sm text-gray-600">{formData.preheader}</span>
                      </div>
                    )}
                  </div>
                )}

                {htmlMode ? (
                  <div className="min-h-[600px] rounded-lg border bg-white p-4">
                    <Textarea
                      value={formData.html}
                      onChange={(e) => setFormData({ ...formData, html: e.target.value })}
                      placeholder="<html><body>Enter your HTML template here...</body></html>"
                      className="min-h-[560px] font-mono text-sm"
                    />
                  </div>
                ) : (
                  <div className="min-h-[600px] rounded-lg border bg-white shadow-sm">
                    {/* Email canvas */}
                    <div className="p-8">
                      <div className="mb-6 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800">
                          <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">THE INTERNATIONAL</h1>
                        <h2 className="text-xl font-semibold text-gray-900">FOOTBALL GROUP</h2>
                      </div>

                      <div className="space-y-4">
                        {blocks.length > 0 ? (
                          blocks.map((block, index) => <div key={index}>{renderBlock(block, index)}</div>)
                        ) : (
                          <div className="py-12 text-center text-gray-400">
                            <ImageIcon className="mx-auto mb-3 h-12 w-12" />
                            <p className="text-sm">Click blocks on the left to start building your email</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-8 border-t pt-6 text-center text-xs text-gray-500">
                        {formData.fromName || "The International Football Group"} |{" "}
                        {formData.fromEmail || "info@theinternationalfootballgroup.com"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
