"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Mail, MessageSquare, MoreVertical, Edit, Copy, Trash2, Eye, Search } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

interface Template {
  id: string
  name: string
  type: "email" | "sms"
  category: string
  content: string
  htmlContent?: string
  thumbnail?: string
  updated_at: string
  usage_count: number
}

interface TemplateGalleryProps {
  onEdit: (template: Template | null) => void
  onPreview: (template: Template) => void
}

export function TemplateGallery({ onEdit, onPreview }: TemplateGalleryProps) {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("updated")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates")
      const data = await response.json()
      setTemplates(data.data || [])
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return

    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Template deleted",
          description: "The template has been deleted successfully.",
        })
        fetchTemplates()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template.",
        variant: "destructive",
      })
    }
  }

  const handleDuplicate = async (template: Template) => {
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...template,
          name: `${template.name} (Copy)`,
          id: undefined,
        }),
      })

      if (response.ok) {
        toast({
          title: "Template duplicated",
          description: "A copy of the template has been created.",
        })
        fetchTemplates()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate template.",
        variant: "destructive",
      })
    }
  }

  // Filter and sort templates
  const filteredTemplates = templates
    .filter((template) => {
      if (typeFilter !== "all" && template.type !== typeFilter) return false
      if (categoryFilter !== "all" && template.category !== categoryFilter) return false
      if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === "updated") return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "usage") return b.usage_count - a.usage_count
      return 0
    })

  if (loading) {
    return <div className="text-center py-12">Loading templates...</div>
  }

  return (
    <div className="space-y-4">
      {/* Filters toolbar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="invoice">Invoice</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently updated</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="usage">Most used</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Template gallery */}
      {filteredTemplates.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Looks quiet here</h3>
          <p className="mb-4 text-sm text-gray-600">Create your first template to speed up campaigns.</p>
          <Button className="gradient-primary text-white" onClick={() => onEdit(null as any)}>
            Create Template
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template, index) => (
            <Card
              key={template.id}
              className="group overflow-hidden transition-all hover:shadow-lg animate-in fade-in-0 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-blue-100">
                {template.type === "email" && template.thumbnail ? (
                  <img
                    src={template.thumbnail || "/placeholder.svg"}
                    alt={template.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    {template.type === "email" ? (
                      <Mail className="h-12 w-12 text-blue-400" />
                    ) : (
                      <MessageSquare className="h-12 w-12 text-green-400" />
                    )}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/20" />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="line-clamp-1 font-semibold text-gray-900">{template.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(template)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(template)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(template.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Badge
                  variant="secondary"
                  className={template.type === "email" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}
                >
                  {template.type === "email" ? "Email" : "SMS"}
                </Badge>

                <div className="mt-3 space-y-1 text-xs text-gray-500">
                  <div>Updated {formatDate(new Date(template.updated_at))}</div>
                  <div>Used {template.usage_count}x</div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => onPreview(template)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Preview
                  </Button>
                  <Button size="sm" className="gradient-primary flex-1 text-white">
                    Use Template
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
