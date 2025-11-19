"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Calendar, Trophy, ArrowRight } from "lucide-react"

interface MatchedPlayerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    player: {
        id: string
        name: string
        email: string
        phone?: string
        location?: string
        programme?: string
        status?: string
        avatar?: string
    } | null
    onCreateDeal: () => void
}

export function MatchedPlayerDialog({ open, onOpenChange, player, onCreateDeal }: MatchedPlayerDialogProps) {
    if (!player) return null

    return (
        <Dialog open={open} onOpenChange={onClose => onOpenChange(onClose)}>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden bg-white">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-semibold text-gray-900">Matched Player Profile</DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-500 mt-1">Review player details and take action</DialogDescription>
                </DialogHeader>

                <div className="p-6 pt-4 space-y-8">
                    {/* Profile Header */}
                    <div className="flex items-start gap-5">
                        <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback className="text-2xl font-medium bg-blue-50 text-blue-600">
                                {player.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 pt-1">
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="text-2xl font-bold text-gray-900 truncate">{player.name}</h3>
                                <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-100 px-3 py-1 text-xs font-medium rounded-full">
                                    Matched
                                </Badge>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2.5 text-sm text-gray-500">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    {player.email}
                                </div>
                                {player.phone && (
                                    <div className="flex items-center gap-2.5 text-sm text-gray-500">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        {player.phone}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                <Trophy className="h-4 w-4 text-blue-600" />
                                Program Interest
                            </div>
                            <p className="text-base text-gray-700 font-medium pl-6">{player.programme || "General Inquiry"}</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-gray-50/50 border border-gray-100 space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                <MapPin className="h-4 w-4 text-blue-600" />
                                Location
                            </div>
                            <p className="text-base text-gray-700 font-medium pl-6">{player.location || "London, UK"}</p>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-900">Recent Activity</h4>
                        <div className="text-sm text-gray-500 leading-relaxed border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
                            Matched via reply analysis. High intent detected for {player.programme || "program"}.
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-2 border-t bg-gray-50/50 flex items-center justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 px-6"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={onCreateDeal}
                        className="gap-2 bg-blue-600 text-white hover:bg-blue-700 shadow-sm px-6"
                    >
                        Create Deal
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
