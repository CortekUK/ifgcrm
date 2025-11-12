"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare } from "lucide-react"

interface Campaign {
  id: string
  name: string
  type: "email" | "sms"
  status: string
  content?: string
  htmlContent?: string
  thumbnail?: string
}

interface CampaignPreviewModalProps {
  campaign: Campaign | null
  open: boolean
  onClose: () => void
}

export function CampaignPreviewModal({ campaign, open, onClose }: CampaignPreviewModalProps) {
  if (!campaign) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {campaign.type === "email" ? (
              <Mail className="h-5 w-5 text-purple-600" />
            ) : (
              <MessageSquare className="h-5 w-5 text-green-600" />
            )}
            {campaign.name}
          </DialogTitle>
          <div className="flex items-center gap-2 pt-2">
            <Badge variant="outline" className="capitalize">
              {campaign.type}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {campaign.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {campaign.thumbnail && (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <img src={campaign.thumbnail || "/placeholder.svg"} alt={campaign.name} className="w-full h-auto" />
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Preview Content</h3>
            {campaign.type === "email" && campaign.htmlContent ? (
              <div
                className="prose prose-sm max-w-none rounded bg-white p-4"
                dangerouslySetInnerHTML={{ __html: campaign.htmlContent }}
              />
            ) : (
              <div className="rounded bg-white p-4 text-sm text-gray-700 whitespace-pre-wrap">
                {campaign.content || "No content available"}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
