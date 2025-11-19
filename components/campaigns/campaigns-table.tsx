"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Mail,
  MessageSquare,
  Eye,
  Edit,
  Copy,
  Trash2,
  MoreVertical,
  Search,
  Send,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react"
import { CampaignDialog } from "./campaign-dialog"
import { CampaignPreviewModal } from "./campaign-preview-modal"

interface Campaign {
  id: string
  name: string
  type: "email" | "sms"
  status: "draft" | "scheduled" | "sent" | "paused"
  sent: number
  open_rate: number
  click_rate: number
  last_sent: string
  thumbnail?: string
  content?: string
  created_at: string
}

interface CampaignsTableProps {
  onGenerateCampaign: () => void
}

export function CampaignsTable({ onGenerateCampaign }: CampaignsTableProps) {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchCampaigns()
  }, [searchQuery, typeFilter, statusFilter])

  const fetchCampaigns = async () => {
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        type: typeFilter,
        status: statusFilter,
      })
      const response = await fetch(`/api/campaigns?${params}`)
      const data = await response.json()
      setCampaigns(data.data || [])
    } catch (error) {
      console.error("Failed to fetch campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(campaigns.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCampaigns = campaigns.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-muted text-muted-foreground border-border",
      scheduled: "bg-primary/10 text-primary border-primary/20",
      sent: "bg-success/10 text-success border-success/20",
      paused: "bg-warning/10 text-warning border-warning/20",
    }
    return styles[status as keyof typeof styles] || styles.draft
  }

  const handleView = (campaign: Campaign) => {
    router.push(`/campaigns/${campaign.id}`)
  }

  const handleEdit = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setDrawerOpen(true)
  }

  const handleDuplicate = async (campaign: Campaign) => {
    console.log("Duplicate campaign:", campaign.id)
  }

  const handleDelete = async (campaign: Campaign) => {
    if (confirm(`Are you sure you want to delete "${campaign.name}"?`)) {
      console.log("Delete campaign:", campaign.id)
    }
  }

  return (
    <>
      <Card className="bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search campaign name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Thumbnail
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Campaign Name
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Type
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Sent
                </th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Open Rate
                </th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Click Rate
                </th>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Last Sent
                </th>
                <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted-foreground">
                    Loading campaigns...
                  </td>
                </tr>
              ) : paginatedCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="rounded-full bg-muted p-3">
                        <Send className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-foreground">No campaigns yet</p>
                      <p className="text-sm text-muted-foreground">Create your first campaign to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCampaigns.map((campaign, index) => (
                  <tr
                    key={campaign.id}
                    className="border-b border-border/60 transition-colors hover:bg-primary/5"
                    style={{ height: "58px" }}
                  >
                    <td className="py-3">
                      <button
                        onClick={() => setPreviewCampaign(campaign)}
                        className="group relative h-12 w-16 overflow-hidden rounded border border-border bg-muted transition-all hover:border-primary hover:shadow-md"
                      >
                        {campaign.thumbnail ? (
                          <img
                            src={campaign.thumbnail || "/placeholder.svg"}
                            alt={campaign.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                          </div>
                        )}
                      </button>
                    </td>
                    <td className="py-3">
                      <span
                        className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                        style={{ cursor: "pointer" }}
                        onClick={() => router.push(`/campaigns/${campaign.id}`)}
                      >
                        {campaign.name}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        {campaign.type === "email" ? (
                          <Mail className="h-4 w-4 text-purple-600" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        )}
                        <span className="text-sm capitalize text-muted-foreground">{campaign.type}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className={`capitalize ${getStatusBadge(campaign.status)}`}>
                        {campaign.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right text-sm text-foreground">{campaign.sent.toLocaleString()}</td>
                    <td className="py-3 text-right text-sm font-medium text-foreground">{campaign.open_rate}%</td>
                    <td className="py-3 text-right text-sm font-medium text-foreground">{campaign.click_rate}%</td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {new Date(campaign.last_sent).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleView(campaign)} className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(campaign)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(campaign)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(campaign)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && campaigns.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, campaigns.length)} of {campaigns.length}{" "}
              campaigns
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="h-8 w-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <CampaignDialog
        campaign={selectedCampaign}
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false)
          setSelectedCampaign(null)
        }}
        onSuccess={fetchCampaigns}
      />

      <CampaignPreviewModal
        campaign={previewCampaign}
        open={!!previewCampaign}
        onClose={() => setPreviewCampaign(null)}
      />
    </>
  )
}
