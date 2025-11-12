"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import { useState, useEffect } from "react"
import { TemplateGallery } from "@/components/templates/template-gallery"
import { TemplatePreview } from "@/components/templates/template-preview"
import { EmailBuilder } from "@/components/templates/email-builder"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export default function TemplatesPage() {
  const [builderOpen, setBuilderOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const handleEdit = (template: any) => {
    setSelectedTemplate(template)
    setBuilderOpen(true)
  }

  const handlePreview = (template: any) => {
    setPreviewTemplate(template)
    setPreviewOpen(true)
  }

  const handleNewTemplate = () => {
    setSelectedTemplate(null)
    setBuilderOpen(true)
  }

  const handleSuccess = () => {
    setBuilderOpen(false)
    setSelectedTemplate(null)
    window.location.reload()
  }

  if (builderOpen) {
    return (
      <EmailBuilder
        template={selectedTemplate}
        onClose={() => {
          setBuilderOpen(false)
          setSelectedTemplate(null)
        }}
        onSuccess={handleSuccess}
      />
    )
  }

  if (!user) {
    return null
  }

  return (
    <AppLayout user={user} title="Templates">
      <div className="gradient-primary mb-6 flex h-[72px] items-center rounded-2xl px-6 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-base text-white" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
            Create, save, and reuse email and SMS templates for campaigns.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20">
              <Upload className="h-4 w-4" />
              Import HTML
            </Button>
            <Button className="gap-2 bg-white text-blue-600 shadow-md hover:bg-blue-50" onClick={handleNewTemplate}>
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          </div>
        </div>
      </div>
      {/* End of standardized banner */}

      <TemplateGallery onEdit={handleEdit} onPreview={handlePreview} />

      <TemplatePreview
        template={previewTemplate}
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false)
          setPreviewTemplate(null)
        }}
      />
    </AppLayout>
  )
}
