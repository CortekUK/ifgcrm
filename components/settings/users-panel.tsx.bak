"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Users,
  Search,
  MoreVertical,
  Eye,
  UserCog,
  Mail,
  Ban,
  Trash2,
  UserCheck,
  Shield,
  Briefcase,
  DollarSign,
  BookOpen,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  name: string
  email: string
  role: "admin" | "manager" | "recruiter" | "finance" | "viewer"
  status: "active" | "invited" | "suspended"
  lastActive: string
  createdAt: string
  avatar?: string
  teams?: string[]
  recentActivity?: { action: string; timestamp: string }[]
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "Neema Ghanbarinia",
    email: "neemaghanbarinia@gmail.com",
    role: "admin",
    status: "active",
    lastActive: "2 hours ago",
    createdAt: "2025-01-15",
    teams: ["European Scouts", "Premier League"],
    recentActivity: [
      { action: "Updated player profile: John Smith", timestamp: "2 hours ago" },
      { action: "Sent campaign: Summer Recruitment", timestamp: "5 hours ago" },
    ],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@ifg.com",
    role: "manager",
    status: "active",
    lastActive: "1 day ago",
    createdAt: "2025-02-10",
    teams: ["Championship Scouts"],
    recentActivity: [
      { action: "Approved invoice #INV-2034", timestamp: "1 day ago" },
      { action: "Created new pipeline stage", timestamp: "2 days ago" },
    ],
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "m.chen@ifg.com",
    role: "recruiter",
    status: "active",
    lastActive: "3 hours ago",
    createdAt: "2025-03-05",
    teams: ["Asian Scouts"],
    recentActivity: [{ action: "Added 5 new players", timestamp: "3 hours ago" }],
  },
  {
    id: 4,
    name: "Emma Williams",
    email: "emma.w@ifg.com",
    role: "finance",
    status: "active",
    lastActive: "5 hours ago",
    createdAt: "2025-02-20",
    teams: ["Finance Team"],
    recentActivity: [{ action: "Processed payment #PAY-5032", timestamp: "5 hours ago" }],
  },
  {
    id: 5,
    name: "James Brown",
    email: "james.b@ifg.com",
    role: "viewer",
    status: "invited",
    lastActive: "Never",
    createdAt: "2025-11-08",
    teams: [],
    recentActivity: [],
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa.a@ifg.com",
    role: "recruiter",
    status: "suspended",
    lastActive: "2 weeks ago",
    createdAt: "2024-12-01",
    teams: ["South American Scouts"],
    recentActivity: [],
  },
]

export function UsersPanel() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ type: string; title: string; description: string } | null>(null)

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "recruiter" as User["role"],
  })

  const { toast } = useToast()

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: User["role"]) => {
    const styles = {
      admin: { className: "bg-destructive/10 text-destructive border-destructive/20", icon: Shield },
      manager: { className: "bg-purple-100 text-purple-700 border-purple-200", icon: UserCog },
      recruiter: { className: "bg-primary/10 text-primary border-primary/20", icon: Briefcase },
      finance: { className: "bg-success/10 text-success border-success/20", icon: DollarSign },
      viewer: { className: "bg-muted text-muted-foreground border-border", icon: BookOpen },
    }
    return styles[role]
  }

  const getStatusBadge = (status: User["status"]) => {
    const styles = {
      active: "bg-success/10 text-success border-success/20",
      invited: "bg-primary/10 text-primary border-primary/20",
      suspended: "bg-destructive/10 text-destructive border-destructive/20",
    }
    return styles[status]
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Actions
  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setViewDrawerOpen(true)
  }

  const handleChangeRole = (user: User) => {
    setSelectedUser(user)
    setChangeRoleModalOpen(true)
  }

  const handleResendInvite = (user: User) => {
    toast({ title: "Invitation resent", description: `Invitation email sent to ${user.email}` })
  }

  const handleToggleSuspend = (user: User) => {
    const isSuspended = user.status === "suspended"
    setSelectedUser(user)
    setConfirmAction({
      type: isSuspended ? "restore" : "suspend",
      title: isSuspended ? "Restore user access?" : "Suspend user access?",
      description: isSuspended
        ? `${user.name} will be able to log in and access the system again.`
        : `${user.name} will be unable to log in or access the system.`,
    })
    setConfirmModalOpen(true)
  }

  const handleRemoveUser = (user: User) => {
    setSelectedUser(user)
    setConfirmAction({
      type: "remove",
      title: "Remove user permanently?",
      description: `${user.name} will be permanently removed from your team. This action cannot be undone.`,
    })
    setConfirmModalOpen(true)
  }

  const confirmActionHandler = () => {
    if (!selectedUser || !confirmAction) return

    if (confirmAction.type === "remove") {
      setUsers(users.filter((u) => u.id !== selectedUser.id))
      toast({ title: "User removed", description: `${selectedUser.name} has been removed from your team.` })
    } else if (confirmAction.type === "suspend") {
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, status: "suspended" as const } : u)))
      toast({ title: "User suspended", description: `${selectedUser.name} has been suspended.` })
    } else if (confirmAction.type === "restore") {
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, status: "active" as const } : u)))
      toast({ title: "User restored", description: `${selectedUser.name} has been restored.` })
    }

    setConfirmModalOpen(false)
    setSelectedUser(null)
    setConfirmAction(null)
  }

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      status: "invited",
      lastActive: "Never",
      createdAt: new Date().toISOString().split("T")[0],
      teams: [],
      recentActivity: [],
    }
    setUsers([...users, newUser])
    toast({ title: "Invitation sent", description: `Invitation email sent to ${inviteForm.email}` })
    setInviteModalOpen(false)
    setInviteForm({ name: "", email: "", role: "recruiter" })
  }

  const handleSaveRoleChange = () => {
    if (!selectedUser) return
    // Role change logic would go here
    toast({ title: "Role updated", description: `${selectedUser.name}'s role has been updated.` })
    setChangeRoleModalOpen(false)
    setSelectedUser(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Users & roles</h2>
        </div>
        <Button onClick={() => setInviteModalOpen(true)} size="sm" className="gradient-primary gap-2">
          <Plus className="h-4 w-4" />
          Invite user
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name or email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="recruiter">Recruiter</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="invited">Invited</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-sm font-medium text-foreground">
            {users.length === 0 ? "No team members yet" : "No users found"}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {users.length === 0
              ? "Invite your first team member to collaborate."
              : "Try adjusting your search or filters."}
          </p>
          {users.length === 0 && (
            <Button onClick={() => setInviteModalOpen(true)} size="sm" className="gradient-primary gap-2">
              <Plus className="h-4 w-4" />
              Invite user
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="pb-3 pl-4 pt-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Name
                </th>
                <th className="pb-3 pt-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Email
                </th>
                <th className="pb-3 pt-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Role
                </th>
                <th className="pb-3 pt-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
                <th className="pb-3 pt-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Last Active
                </th>
                <th className="pb-3 pr-4 pt-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                const roleBadge = getRoleBadge(user.role)
                const RoleIcon = roleBadge.icon
                return (
                  <tr
                    key={user.id}
                    className={`border-b border-border/60 transition-colors hover:bg-primary/5 ${
                      index % 2 === 0 ? "bg-card" : "bg-muted/30"
                    }`}
                    style={{ height: "58px" }}
                  >
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{user.email}</td>
                    <td className="py-3">
                      <Badge variant="outline" className={`gap-1 capitalize ${roleBadge.className}`}>
                        <RoleIcon className="h-3 w-3" />
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className={`capitalize ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{user.lastActive}</td>
                    <td className="py-3 pr-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeRole(user)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Change role
                          </DropdownMenuItem>
                          {user.status === "invited" && (
                            <DropdownMenuItem onClick={() => handleResendInvite(user)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Resend invite
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleSuspend(user)}>
                            {user.status === "suspended" ? (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Restore
                              </>
                            ) : (
                              <>
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRemoveUser(user)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Invite User Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite user</DialogTitle>
            <DialogDescription>Send an invitation to join your team</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInviteUser}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-name">Full name *</Label>
                <Input
                  id="invite-name"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  placeholder="e.g. John Smith"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email *</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role *</Label>
                <Select
                  value={inviteForm.role}
                  onValueChange={(value) => setInviteForm({ ...inviteForm, role: value as User["role"] })}
                >
                  <SelectTrigger id="invite-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gradient-primary">
                Send invite
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Role Modal */}
      <Dialog open={changeRoleModalOpen} onOpenChange={setChangeRoleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change role</DialogTitle>
            <DialogDescription>Update {selectedUser?.name}'s role and permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="change-role">Role</Label>
              <Select defaultValue={selectedUser?.role}>
                <SelectTrigger id="change-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setChangeRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="gradient-primary" onClick={handleSaveRoleChange}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Action Modal */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmAction?.title}</DialogTitle>
            <DialogDescription>{confirmAction?.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className={
                confirmAction?.type === "remove"
                  ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  : "gradient-primary"
              }
              onClick={confirmActionHandler}
            >
              {confirmAction?.type === "remove" ? "Remove" : confirmAction?.type === "suspend" ? "Suspend" : "Restore"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Drawer */}
      <Sheet open={viewDrawerOpen} onOpenChange={setViewDrawerOpen}>
        <SheetContent className="w-[440px] overflow-y-auto bg-muted/30 sm:max-w-none">
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
                  {selectedUser && getInitials(selectedUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <SheetTitle>{selectedUser?.name}</SheetTitle>
                {selectedUser && (
                  <Badge
                    variant="outline"
                    className={`mt-1 gap-1 capitalize ${getRoleBadge(selectedUser.role).className}`}
                  >
                    {selectedUser.role}
                  </Badge>
                )}
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6">
            {/* Basic Info */}
            <div className="rounded-lg bg-card p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Account Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground">{selectedUser?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  {selectedUser && (
                    <Badge variant="outline" className={`mt-1 capitalize ${getStatusBadge(selectedUser.status)}`}>
                      {selectedUser.status}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Active</p>
                  <p className="text-sm text-foreground">{selectedUser?.lastActive}</p>
                </div>
              </div>
            </div>

            {/* Teams/Permissions */}
            <div className="rounded-lg bg-card p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Teams & Permissions</h3>
              {selectedUser?.teams && selectedUser.teams.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedUser.teams.map((team) => (
                    <Badge key={team} variant="secondary" className="bg-primary/10 text-primary">
                      {team}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No teams assigned</p>
              )}
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg bg-card p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Recent Activity</h3>
              {selectedUser?.recentActivity && selectedUser.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {selectedUser.recentActivity.map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-2 border-t border-border pt-4">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                setViewDrawerOpen(false)
                if (selectedUser) handleChangeRole(selectedUser)
              }}
            >
              Change role
            </Button>
            <Button
              variant="outline"
              className={
                selectedUser?.status === "suspended"
                  ? ""
                  : "border-destructive/20 text-destructive hover:bg-destructive/10"
              }
              onClick={() => {
                setViewDrawerOpen(false)
                if (selectedUser) handleToggleSuspend(selectedUser)
              }}
            >
              {selectedUser?.status === "suspended" ? "Restore" : "Suspend"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
