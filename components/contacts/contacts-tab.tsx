"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlayerDrawer } from "@/components/players/player-drawer"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, GraduationCap, Download, Tag, X, ListPlus, ListMinus } from 'lucide-react'
import { BulkListModal } from "./bulk-list-modal"
import { ContactsBulkActionsBar } from "./contacts-bulk-actions-bar"
import { useToast } from "@/hooks/use-toast"

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  programme: string
  recruiter: string
  status: string
  date_created: string
  tags?: string[]
  lists?: string[]
  country?: string
}

interface Programme {
  id: number
  name: string
}

interface Recruiter {
  id: number
  name: string
}

interface List {
  id: number
  name: string
}

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase()
  if (statusLower.includes("pipeline") || statusLower.includes("in pipeline")) {
    return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 transition-colors"
  }
  if (statusLower.includes("contact")) {
    return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 transition-colors"
  }
  if (statusLower.includes("sign")) {
    return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 transition-colors"
  }
  if (statusLower.includes("interview")) {
    return "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 transition-colors"
  }
  return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 transition-colors"
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

export function ContactsTab() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [programmes, setProgrammes] = useState<Programme[]>([])
  const [recruiters, setRecruiters] = useState<Recruiter[]>([])
  const [lists, setLists] = useState<List[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [bulkListModalOpen, setBulkListModalOpen] = useState(false)
  const [bulkListAction, setBulkListAction] = useState<"add" | "remove">("add")

  const [search, setSearch] = useState("")
  const [selectedProgramme, setSelectedProgramme] = useState<string>("all")
  const [selectedRecruiter, setSelectedRecruiter] = useState<string>("all")
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedList, setSelectedList] = useState<string>("all")
  const [selectedCountry, setSelectedCountry] = useState<string>("all")

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pageSize] = useState(25)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProgrammes()
    fetchRecruiters()
    fetchLists()
  }, [])

  useEffect(() => {
    const listIdFromUrl = searchParams.get("listId")
    if (listIdFromUrl) {
      setSelectedList(listIdFromUrl)
    } else {
      setSelectedList("all")
    }
  }, [searchParams])

  useEffect(() => {
    fetchContacts()
  }, [search, selectedProgramme, selectedRecruiter, selectedTag, selectedStatus, selectedList, selectedCountry, page])

  const fetchProgrammes = async () => {
    const response = await fetch("/api/settings/programmes")
    const data = await response.json()
    setProgrammes(data)
  }

  const fetchRecruiters = async () => {
    const response = await fetch("/api/settings/recruiters")
    const data = await response.json()
    setRecruiters(data)
  }

  const fetchLists = async () => {
    try {
      const response = await fetch("/api/lists")
      if (!response.ok) {
        console.log("[v0] Lists table not available yet")
        setLists([])
        return
      }
      const data = await response.json()
      setLists(Array.isArray(data) ? data : [])
    } catch (error) {
      console.log("[v0] Error fetching lists:", error)
      setLists([])
    }
  }

  const fetchContacts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search }),
        ...(selectedProgramme !== "all" && { programme: selectedProgramme }),
        ...(selectedRecruiter !== "all" && { recruiter: selectedRecruiter }),
        ...(selectedTag !== "all" && { tag: selectedTag }),
        ...(selectedStatus !== "all" && { status: selectedStatus }),
        ...(selectedList !== "all" && { listId: selectedList }),
        ...(selectedCountry !== "all" && { country: selectedCountry }),
      })

      const response = await fetch(`/api/contacts?${params}`)
      if (!response.ok) {
        console.log("[v0] Error fetching contacts:", response.statusText)
        setContacts([])
        setTotal(0)
        setIsLoading(false)
        return
      }
      const data = await response.json()
      setContacts(Array.isArray(data.data) ? data.data : [])
      setTotal(data.total || 0)
    } catch (error) {
      console.log("[v0] Error fetching contacts:", error)
      setContacts([])
      setTotal(0)
    }
    setIsLoading(false)
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedProgramme("all")
    setSelectedRecruiter("all")
    setSelectedTag("all")
    setSelectedStatus("all")
    setSelectedList("all")
    setSelectedCountry("all")
    setPage(1)
  }

  const handleRowClick = (contact: Contact) => {
    setSelectedContact(contact)
    setDrawerOpen(true)
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

  const handleBulkAddToList = () => {
    setBulkListAction("add")
    setBulkListModalOpen(true)
  }

  const handleBulkRemoveFromList = () => {
    setBulkListAction("remove")
    setBulkListModalOpen(true)
  }

  const handleBulkListSubmit = async (listId: string) => {
    try {
      const endpoint = bulkListAction === "add" ? "/api/lists/add-contacts" : "/api/lists/remove-contacts"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listId,
          contactIds: Array.from(selectedRows),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `${selectedRows.size} contacts ${bulkListAction === "add" ? "added to" : "removed from"} list`,
        })
        setSelectedRows(new Set())
        fetchContacts()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update list",
        variant: "destructive",
      })
    }
  }

  const handleExportSelected = async () => {
    const ids = Array.from(selectedRows).join(",")
    window.location.href = `/api/contacts/export?ids=${ids}`
    toast({
      title: "Export started",
      description: `Exporting ${selectedRows.size} contacts to CSV`,
    })
  }

  const totalPages = Math.ceil(total / pageSize)
  const startRecord = (page - 1) * pageSize + 1
  const endRecord = Math.min(page * pageSize, total)

  const allTags = Array.from(new Set(contacts.flatMap((c) => c.tags || [])))
  const allCountries = Array.from(new Set(contacts.map((c) => c.country).filter(Boolean)))

  const handleListFilterChange = (value: string) => {
    setSelectedList(value)
    setPage(1)
    
    // Update URL with new listId parameter
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", "contacts")
    
    if (value === "all") {
      params.delete("listId")
    } else {
      params.set("listId", value)
    }
    
    router.push(`/contacts?${params.toString()}`)
  }

  return (
    <>
      <Card
        className="mb-6 bg-[#f9fafc] p-6 border border-gray-200"
        style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}
      >
        <div className="flex flex-col gap-4">
          {/* Search input on its own row */}
          <div className="w-full">
            <Input
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="bg-white h-10"
            />
          </div>

          {/* All filter dropdowns in a single row */}
          <div className="flex flex-wrap gap-3 items-center">
            <Select
              value={selectedProgramme}
              onValueChange={(value) => {
                setSelectedProgramme(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="bg-white h-10 w-[170px]">
                <SelectValue placeholder="Programme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programmes</SelectItem>
                {programmes.map((prog) => (
                  <SelectItem key={prog.id} value={prog.name}>
                    {prog.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setSelectedTag(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="bg-white h-10 w-[140px]">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedRecruiter}
              onValueChange={(value) => {
                setSelectedRecruiter(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="bg-white h-10 w-[160px]">
                <SelectValue placeholder="Recruiter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Recruiters</SelectItem>
                {recruiters.map((rec) => (
                  <SelectItem key={rec.id} value={rec.name}>
                    {rec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedCountry}
              onValueChange={(value) => {
                setSelectedCountry(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="bg-white h-10 w-[150px]">
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {allCountries.map((country) => (
                  <SelectItem key={country} value={country!}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedStatus}
              onValueChange={(value) => {
                setSelectedStatus(value)
                setPage(1)
              }}
            >
              <SelectTrigger className="bg-white h-10 w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="pipeline">In Pipeline</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedList}
              onValueChange={handleListFilterChange}
            >
              <SelectTrigger className="bg-white h-10 w-[140px]">
                <SelectValue placeholder="List" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lists</SelectItem>
                {lists.map((list) => (
                  <SelectItem key={list.id} value={list.id.toString()}>
                    {list.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters} className="bg-white h-10 px-5">
              Clear filters
            </Button>
          </div>
        </div>
      </Card>

      <ContactsBulkActionsBar
        selectedCount={selectedRows.size}
        onAddToList={handleBulkAddToList}
        onRemoveFromList={handleBulkRemoveFromList}
        onExportSelected={handleExportSelected}
        onClearSelection={() => setSelectedRows(new Set())}
      />

      <Card className="bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-12 pl-6">
                  <Checkbox
                    checked={selectedRows.size === contacts.length && contacts.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
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
                  Tags
                </TableHead>
                <TableHead
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 500,
                    letterSpacing: "0.6px",
                    color: "#0A47B1",
                  }}
                >
                  Lists
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
                  Date Created
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
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    Loading contacts...
                  </TableCell>
                </TableRow>
              ) : contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium">No contacts found</p>
                      <p className="text-sm mt-1">Try changing your filters.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact, index) => (
                  <TableRow
                    key={contact.id}
                    className={`cursor-pointer transition-colors hover:bg-[#F8FAFF] border-b border-[#E6E8F0] ${
                      index % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"
                    }`}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      color: "#1E1E1E",
                    }}
                  >
                    <TableCell className="pl-6" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedRows.has(contact.id)}
                        onCheckedChange={(checked) => handleSelectRow(contact.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium" onClick={() => handleRowClick(contact)}>
                      {contact.name}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(contact)}>{contact.email}</TableCell>
                    <TableCell onClick={() => handleRowClick(contact)}>{contact.phone}</TableCell>
                    <TableCell onClick={() => handleRowClick(contact)}>
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 font-medium gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5" />
                        {contact.programme}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(contact)}>
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {contact.tags && contact.tags.length > 0 ? (
                          contact.tags.slice(0, 2).map((tag, i) => (
                            <Badge key={i} className={`${getTagColor(tag)} border text-xs px-2 py-0.5`}>
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">–</span>
                        )}
                        {contact.tags && contact.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5">
                            +{contact.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(contact)}>
                      <div className="flex gap-1 flex-wrap max-w-[150px]">
                        {contact.lists && contact.lists.length > 0 ? (
                          <>
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                              {contact.lists[0]}
                            </Badge>
                            {contact.lists.length > 1 && (
                              <Badge variant="outline" className="text-xs px-2 py-0.5">
                                +{contact.lists.length - 1}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">–</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(contact)}>
                      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                        {contact.recruiter}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(contact)}>
                      {new Date(contact.date_created).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(contact)}>
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

        {contacts.length > 0 && (
          <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4">
            <div className="text-sm text-gray-600">
              Showing {startRecord} to {endRecord} of {total.toLocaleString()} contacts
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </div>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {selectedContact && (
        <PlayerDrawer
          player={selectedContact as any}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}

      <BulkListModal
        open={bulkListModalOpen}
        onClose={() => setBulkListModalOpen(false)}
        onSubmit={handleBulkListSubmit}
        action={bulkListAction}
        lists={lists}
      />
    </>
  )
}
