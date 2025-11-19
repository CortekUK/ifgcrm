"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

interface Template {
  id: string
  name: string
  type: "email" | "sms"
  category: string
  content: string
  htmlContent?: string
  thumbnail?: string
}

interface TemplatePreviewProps {
  template: Template | null
  open: boolean
  onClose: () => void
}

export function TemplatePreview({ template, open, onClose }: TemplatePreviewProps) {
  const router = useRouter()

  if (!template) return null

  const handleUseInCampaign = () => {
    router.push(`/campaigns?templateId=${template.id}`)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] my-4 overflow-hidden p-0 flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b">
          <DialogHeader>
            <div className="space-y-2">
              <DialogTitle>{template.name}</DialogTitle>
            <Badge
              variant="secondary"
              className={template.type === "email" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}
            >
              {template.type === "email" ? "Email" : "SMS"}
            </Badge>
            </div>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto px-6 py-4 space-y-4">
          {/* Preview content */}
          <div className="rounded-lg border bg-gray-50 p-6">
            {template.type === "email" && template.htmlContent ? (
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: template.htmlContent }} />
            ) : (
              <div className="whitespace-pre-wrap text-sm text-gray-700">{template.content}</div>
            )}
          </div>

          {/* Action button */}
          <Button className="gradient-primary w-full text-white" onClick={handleUseInCampaign}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Use in Campaign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
