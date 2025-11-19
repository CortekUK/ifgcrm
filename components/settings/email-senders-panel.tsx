"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, AlertCircle, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EmailSender {
  id: number
  displayName: string
  fromEmail: string
  verified: boolean
  isDefault: boolean
}

export function EmailSendersPanel() {
  const [senders, setSenders] = useState<EmailSender[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [formData, setFormData] = useState({
    displayName: "",
    fromEmail: "",
    verified: false,
    isDefault: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchSenders()
  }, [])

  const fetchSenders = async () => {
    const res = await fetch("/api/settings/senders")
    const data = await res.json()
    setSenders(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/settings/senders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      toast({ title: "Sender identity created successfully" })
      setIsDrawerOpen(false)
      setFormData({ displayName: "", fromEmail: "", verified: false, isDefault: false })
      fetchSenders()
    }
  }

  return (
    <div>
      <div className="mb-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Email senders</h2>
            <p className="mt-1 text-sm text-gray-500">Manage sender identities for outbound campaigns</p>
          </div>
          <Button onClick={() => setIsDrawerOpen(true)} size="sm" className="gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add sender
          </Button>
        </div>
      </div>

      <Alert className="mb-6 border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          Verification required before sending emails. Check your DNS settings.
        </AlertDescription>
      </Alert>

      {senders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Mail className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-sm font-medium text-gray-900">No sender identities yet</h3>
          <p className="mb-4 text-sm text-gray-500">Add your first sender to start sending campaigns.</p>
          <Button onClick={() => setIsDrawerOpen(true)} size="sm" className="gradient-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add sender
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Display name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  From email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Verified
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {senders.map((sender, index) => (
                <tr
                  key={sender.id}
                  className={`transition-colors duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100`}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {sender.displayName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">{sender.fromEmail}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Badge variant={sender.verified ? "default" : "secondary"} className="bg-green-100 text-green-800">
                      {sender.verified ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {sender.isDefault && (
                      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                        Default
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] my-4 overflow-hidden p-0 flex flex-col">
          <DialogHeader>
            <DialogTitle>Add sender</DialogTitle>
            <DialogDescription>Add a new email identity for outbound campaigns</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display name *</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="e.g. Nathan Bibby"
                  required
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From email *</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={formData.fromEmail}
                  onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                  placeholder="e.g. nathan@macclesfieldfc.com"
                  required
                  className="bg-white"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <Label htmlFor="verified" className="font-medium">
                    Verified
                  </Label>
                  <p className="text-xs text-gray-500">DNS verification complete</p>
                </div>
                <Switch
                  id="verified"
                  checked={formData.verified}
                  onCheckedChange={(checked) => setFormData({ ...formData, verified: checked })}
                  className="transition-all duration-150"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div>
                  <Label htmlFor="isDefault" className="font-medium">
                    Default for notifications
                  </Label>
                  <p className="text-xs text-gray-500">Use this sender by default</p>
                </div>
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                  className="transition-all duration-150"
                />
              </div>
              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-xs text-blue-900">
                  Verification required before sending emails
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary">
                Add sender
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
