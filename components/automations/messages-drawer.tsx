"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle2, XCircle } from 'lucide-react'

interface MessagesDrawerProps {
  workflowName: string
  open: boolean
  onClose: () => void
}

const mockMessages = [
  { id: 1, playerName: "John Smith", email: "john@example.com", sentAt: "2 hours ago", status: "delivered" },
  { id: 2, playerName: "Emma Wilson", email: "emma@example.com", sentAt: "5 hours ago", status: "delivered" },
  { id: 3, playerName: "Michael Brown", email: "michael@example.com", sentAt: "1 day ago", status: "failed" },
  { id: 4, playerName: "Sarah Davis", email: "sarah@example.com", sentAt: "1 day ago", status: "delivered" },
  { id: 5, playerName: "James Taylor", email: "james@example.com", sentAt: "2 days ago", status: "delivered" },
]

export function MessagesDrawer({ workflowName, open, onClose }: MessagesDrawerProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] my-4 overflow-hidden p-0 flex flex-col">
        <DialogHeader className="border-b pb-4 mb-6">
          <DialogTitle className="text-lg font-bold text-gray-900">Messages Sent</DialogTitle>
          <p className="text-sm text-gray-600">{workflowName}</p>
        </DialogHeader>

        <div className="space-y-3">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{message.playerName}</p>
                <p className="text-xs text-gray-500">{message.email}</p>
                <p className="text-xs text-gray-500 mt-1">{message.sentAt}</p>
              </div>
              <div className="flex-shrink-0">
                {message.status === "delivered" ? (
                  <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Sent
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Failed
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
