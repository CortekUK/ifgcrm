"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Edit, Trash2, Plus, Filter } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { PlayerDrawer } from "@/components/players/player-drawer"
import { GraduationCap } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface List {
  id: number
  name: string
  type: "static" | "smart"
  contactCount: number
  createdAt: string
  createdBy: string
  description?: string
}

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  programme: string
  recruiter: string
  status: string
}

interface ListDetailViewProps {
  list: List
  onBack: () => void
}

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase()
  if (statusLower.includes("pipeline")) return "bg-blue-100 text-blue-700 border-blue-200"
  if (statusLower.includes("contact")) return "bg-amber-100 text-amber-700 border-amber-200"
  if (statusLower.includes("sign")) return "bg-green-100 text-green-700 border-green-200"
  return "bg-gray-100 text-gray-700 border-gray-200"
}

export function ListDetailView({ list, onBack }: ListDetailViewProps) {
  const { toast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchListContacts()
  }, [list.id])

  const fetchListContacts = async () => {
    setIsLoading(true)
    const response = await fetch(`/api/lists/${list.id}/contacts`)
    const data = await response.json()
    setContacts(data)
    setIsLoading(false)
  }

  const handleExport = () => {
    window.location.href = `/api/lists/${list.id}/export`
    toast({
      title: "Export started",
      description: "Exporting list contacts to CSV",
    })
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${list.name}"?`)) return

    const response = await fetch(`/api/lists/${list.id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      toast({
        title: "List deleted",
        description: "The list has been removed",
      })
      onBack()
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(contacts.map((c) => c.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  const handleRemoveFromList = async () => {
    if (selectedRows.size === 0) return

    const response = await fetch("/api/lists/remove-contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listId: list.id.toString(),
        contactIds: Array.from(selectedRows),
      }),
    })

    if (response.ok) {
      toast({
        title: "Contacts removed",
        description: `${selectedRows.size} contacts removed from list`,
      })
      setSelectedRows(new Set())
      fetchListContacts()
    }
  }

  return (
    <>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2 mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Back to lists
        </Button>

        <Card className="p-6 bg-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{list.name}</h1>
                <Badge
                  className={
                    list.type === "smart"
                      ? "bg-purple-100 text-purple-700 border-purple-200"
                      : "bg-blue-100 text-blue-700 border-blue-200"
                  }
                >
                  {list.type}
                </Badge>
              </div>
              {list.description && <p className="text-gray-600">{list.description}</p>}
              <div className="flex gap-4 mt-3 text-sm text-gray-500">
                <span>{list.contactCount.toLocaleString()} contacts</span>
                <span>
                  Created{" "}
                  {new Date(list.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              {list.type === "smart" && (
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Edit filters
                </Button>
              )}
              {list.type === "static" && (
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add contacts
                </Button>
              )}
              <Button variant="outline" className="gap-2" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {selectedRows.size > 0 && list.type === "static" && (
        <Card className="mb-4 p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{selectedRows.size} contacts selected</span>
            <Button onClick={handleRemoveFromList} size="sm" variant="outline" className="gap-2">
              <Trash2 className="h-3.5 w-3.5" />
              Remove from list
            </Button>
          </div>
        </Card>
      )}

      <Card className="bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                {list.type === "static" && (
                  <TableHead className="w-12 pl-6">
                    <Checkbox
                      checked={selectedRows.size === contacts.length && contacts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Name
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Email
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Phone
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Programme
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Recruiter
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Loading contacts...
                  </TableCell>
                </TableRow>
              ) : contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No contacts in this list</p>
                      <p className="text-sm mt-1">Add contacts to get started.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact, index) => (
                  <TableRow
                    key={contact.id}
                    className={`cursor-pointer transition-colors hover:bg-[#F8FAFF] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"
                    }`}
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, color: "#1E1E1E" }}
                  >
                    {list.type === "static" && (
                      <TableCell className="pl-6" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedRows.has(contact.id)}
                          onCheckedChange={(checked) => handleSelectRow(contact.id, checked as boolean)}
                        />
                      </TableCell>
                    )}
                    <TableCell
                      className="font-medium"
                      onClick={() => {
                        setSelectedContact(contact)
                        setDrawerOpen(true)
                      }}
                    >
                      {contact.name}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setSelectedContact(contact)
                        setDrawerOpen(true)
                      }}
                    >
                      {contact.email}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setSelectedContact(contact)
                        setDrawerOpen(true)
                      }}
                    >
                      {contact.phone}
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setSelectedContact(contact)
                        setDrawerOpen(true)
                      }}
                    >
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 font-medium gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {contact.programme}
                      </Badge>
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setSelectedContact(contact)
                        setDrawerOpen(true)
                      }}
                    >
                      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                        {contact.recruiter}
                      </Badge>
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        setSelectedContact(contact)
                        setDrawerOpen(true)
                      }}
                    >
                      <Badge className={`${getStatusColor(contact.status)} border font-medium`}>
                        {contact.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedContact && (
        <PlayerDrawer
          player={selectedContact as any}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  )
}
