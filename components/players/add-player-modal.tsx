"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface AddPlayerModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddPlayerModal({ open, onClose, onSuccess }: AddPlayerModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    programme: "",
    recruiter: "",
    status: "Contacted",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Player added",
          description: `${formData.name} has been added to the database.`,
        })
        onSuccess()
        onClose()
        setFormData({
          name: "",
          email: "",
          phone: "",
          programme: "",
          recruiter: "",
          status: "Contacted",
        })
      } else {
        throw new Error("Failed to add player")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add player. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Player</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+44 7700 900000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="programme">Programme</Label>
              <Select
                value={formData.programme}
                onValueChange={(value) => setFormData({ ...formData, programme: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select programme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Elite Development">Elite Development</SelectItem>
                  <SelectItem value="Academy Prep">Academy Prep</SelectItem>
                  <SelectItem value="Professional Pathway">Professional Pathway</SelectItem>
                  <SelectItem value="Scholarship Program">Scholarship Program</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recruiter">Recruiter</Label>
              <Select
                value={formData.recruiter}
                onValueChange={(value) => setFormData({ ...formData, recruiter: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recruiter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="James Wilson">James Wilson</SelectItem>
                  <SelectItem value="Sarah Chen">Sarah Chen</SelectItem>
                  <SelectItem value="Michael Rodriguez">Michael Rodriguez</SelectItem>
                  <SelectItem value="Emma Thompson">Emma Thompson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="In Pipeline">In Pipeline</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Adding..." : "Add Player"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
