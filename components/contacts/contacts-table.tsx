"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, ListPlus, ListMinus, Download } from 'lucide-react'

interface ContactDto {
  id: string
  name: string
  email: string
  phone: string
  programme: {
    id: string
    name: string
  } | null
  recruiter: {
    id: string
    full_name: string
  } | null
  tags: string[]
  lists: Array<{ id: string; name: string }>
  status: string
  created_at: string
}

interface ContactsTableProps {
  contacts: ContactDto[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onRowClick: (contact: ContactDto) => void
  onRowAction?: (action: "view" | "addToList" | "removeFromList" | "export", contact: ContactDto) => void
}

export function ContactsTable({
  contacts,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onRowClick,
  onRowAction,
}: ContactsTableProps) {
  const allSelected = contacts.length > 0 && selectedIds.length === contacts.length

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower.includes("pipeline") || statusLower.includes("in pipeline")) {
      return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"
    }
    if (statusLower.includes("contact")) {
      return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"
    }
    if (statusLower.includes("sign")) {
      return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
    }
    if (statusLower.includes("interview")) {
      return "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200"
    }
    return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
  }

  const getTagColor = (tag: string) => {
    const colors = [
      "bg-blue-100 text-blue-700 border-blue-200",
      "bg-purple-100 text-purple-700 border-purple-200",
      "bg-green-100 text-green-700 border-green-200",
      "bg-amber-100 text-amber-700 border-amber-200",
      "bg-pink-100 text-pink-700 border-pink-200",
      "bg-cyan-100 text-cyan-700 border-cyan-200",
    ]
    const index = tag.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[index % colors.length]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const handleRowClick = (e: React.MouseEvent, contact: ContactDto) => {
    // Don't trigger row click if clicking checkbox or actions menu
    const target = e.target as HTMLElement
    if (
      target.closest('[role="checkbox"]') ||
      target.closest('button[role="combobox"]') ||
      target.closest('[role="menu"]')
    ) {
      return
    }
    onRowClick(contact)
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-12 pl-6">
              <Checkbox checked={allSelected} onCheckedChange={onToggleSelectAll} />
            </TableHead>
            <TableHead className="font-semibold text-gray-700">Name</TableHead>
            <TableHead className="font-semibold text-gray-700">Email</TableHead>
            <TableHead className="font-semibold text-gray-700">Phone</TableHead>
            <TableHead className="font-semibold text-gray-700">Programme</TableHead>
            <TableHead className="font-semibold text-gray-700">Tags</TableHead>
            <TableHead className="font-semibold text-gray-700">Lists</TableHead>
            <TableHead className="font-semibold text-gray-700">Recruiter</TableHead>
            <TableHead className="font-semibold text-gray-700">Date Created</TableHead>
            <TableHead className="font-semibold text-gray-700">Status</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="h-32 text-center text-gray-500">
                No contacts found
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact, index) => (
              <TableRow
                key={contact.id}
                className={`group cursor-pointer transition-colors hover:bg-blue-50/50 ${
                  index % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"
                }`}
                onClick={(e) => handleRowClick(e, contact)}
              >
                <TableCell className="pl-6" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(contact.id)}
                    onCheckedChange={() => onToggleSelect(contact.id)}
                  />
                </TableCell>
                <TableCell className="font-medium text-gray-900">{contact.name}</TableCell>
                <TableCell className="text-gray-700">{contact.email}</TableCell>
                <TableCell className="text-gray-700">{contact.phone}</TableCell>
                <TableCell>
                  {contact.programme ? (
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                      {contact.programme.name}
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap max-w-[180px]">
                    {contact.tags && contact.tags.length > 0 ? (
                      <>
                        {contact.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} className={`${getTagColor(tag)} border text-xs px-2 py-0.5`}>
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            +{contact.tags.length - 3}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap max-w-[180px]">
                    {contact.lists && contact.lists.length > 0 ? (
                      <>
                        {contact.lists.slice(0, 3).map((list, i) => (
                          <Badge key={i} variant="outline" className="text-xs px-2 py-0.5 bg-gray-50">
                            {list.name}
                          </Badge>
                        ))}
                        {contact.lists.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5 font-medium">
                            +{contact.lists.length - 3} more
                          </Badge>
                        )}
                      </>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {contact.recruiter ? (
                    <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                      {contact.recruiter.full_name}
                    </Badge>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell className="text-gray-700">{formatDate(contact.created_at)}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusBadge(contact.status)} border transition-colors`}>
                    {contact.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onRowAction?.("view", contact)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View contact
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRowAction?.("addToList", contact)}>
                        <ListPlus className="mr-2 h-4 w-4" />
                        Add to list
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRowAction?.("removeFromList", contact)}>
                        <ListMinus className="mr-2 h-4 w-4" />
                        Remove from list
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRowAction?.("export", contact)}>
                        <Download className="mr-2 h-4 w-4" />
                        Export contact
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
