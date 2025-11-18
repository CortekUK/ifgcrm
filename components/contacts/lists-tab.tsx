"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ListModal } from "./list-modal"
import { ListDetailView } from "./list-detail-view"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'

interface List {
  id: number
  name: string
  type: "static" | "smart"
  contactCount: number
  createdAt: string
  createdBy: string
  lastExported?: string
}

export function ListsTab() {
  const router = useRouter()
  const { toast } = useToast()
  const [lists, setLists] = useState<List[]>([])
  const [selectedList, setSelectedList] = useState<List | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingList, setEditingList] = useState<{
    id: string
    name: string
    description?: string | null
    type: "STATIC" | "SMART"
  } | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    fetchLists()
  }, [])

  const fetchLists = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/lists")
      if (!response.ok) {
        console.error("[v0] Failed to fetch lists:", response.status)
        setLists([])
        return
      }
      const data = await response.json()
      setLists(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[v0] Error fetching lists:", error)
      setLists([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportList = async (listId: number) => {
    window.location.href = `/api/lists/${listId}/export`
    toast({
      title: "Export started",
      description: "Exporting list to CSV",
    })
  }

  const handleDeleteList = async (listId: number) => {
    if (!confirm("Are you sure you want to delete this list?")) return

    const response = await fetch(`/api/lists/${listId}`, {
      method: "DELETE",
    })

    if (response.ok) {
      toast({
        title: "List deleted",
        description: "The list has been removed",
      })
      fetchLists()
    }
  }

  const handleRowClick = (list: List) => {
    router.push(`/contacts?tab=contacts&listId=${list.id}`)
  }

  const handleBackToLists = () => {
    setSelectedList(null)
    fetchLists()
  }

  const handleEditList = (list: List) => {
    setEditingList({
      id: String(list.id),
      name: list.name,
      description: null,
      type: list.type.toUpperCase() as "STATIC" | "SMART",
    })
    setEditModalOpen(true)
  }

  if (selectedList) {
    return <ListDetailView list={selectedList} onBack={handleBackToLists} />
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Your Lists</h2>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Plus className="h-4 w-4" />
          Create List
        </Button>
      </div>

      <Card className="bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  List Name
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Type
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Contacts
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Created
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Last Exported
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Loading lists...
                  </TableCell>
                </TableRow>
              ) : lists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No lists yet</p>
                      <p className="text-sm mt-1">Create your first list to get started.</p>
                      <Button
                        onClick={() => setCreateModalOpen(true)}
                        className="mt-4 gap-2 bg-gradient-to-r from-blue-600 to-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                        Create List
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                lists.map((list, index) => (
                  <TableRow
                    key={list.id}
                    className={`cursor-pointer transition-colors hover:bg-[#F8FAFF] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"
                    }`}
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, color: "#1E1E1E" }}
                  >
                    <TableCell className="font-medium" onClick={() => handleRowClick(list)}>
                      {list.name}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(list)}>
                      <Badge
                        className={
                          list.type === "smart"
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                        }
                      >
                        {list.type}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(list)}>{list.contactCount.toLocaleString()}</TableCell>
                    <TableCell onClick={() => handleRowClick(list)}>
                      {new Date(list.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(list)}>
                      {list.lastExported
                        ? new Date(list.lastExported).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRowClick(list)}>View details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditList(list)}>
                            Rename / Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExportList(list.id)}>
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteList(list.id)} className="text-red-600">
                            Delete list
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
      </Card>

      <ListModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSaved={() => {
          setCreateModalOpen(false)
          fetchLists()
        }}
      />

      <ListModal
        open={editModalOpen}
        initialList={editingList}
        onClose={() => {
          setEditModalOpen(false)
          setEditingList(null)
        }}
        onSaved={() => {
          setEditModalOpen(false)
          setEditingList(null)
          fetchLists()
        }}
      />
    </>
  )
}
