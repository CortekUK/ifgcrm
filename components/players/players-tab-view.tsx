"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayersTable } from "./players-table"
import { PlayersSummary } from "./players-summary"
import { PlayerGroupsTable } from "../player-groups/player-groups-table"
import { PlayerGroupsSummary } from "../player-groups/player-groups-summary"
import { Users, FolderOpen } from "lucide-react"

export function PlayersTabView() {
  const [activeTab, setActiveTab] = useState("all-players")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full max-w-[400px] grid-cols-2">
        <TabsTrigger value="all-players" className="gap-2">
          <Users className="h-4 w-4" />
          All Players
        </TabsTrigger>
        <TabsTrigger value="player-groups" className="gap-2">
          <FolderOpen className="h-4 w-4" />
          Player Groups
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all-players" className="space-y-4 mt-4">
        <PlayersSummary />
        <PlayersTable />
      </TabsContent>

      <TabsContent value="player-groups" className="space-y-4 mt-4">
        <PlayerGroupsSummary />
        <PlayerGroupsTable />
      </TabsContent>
    </Tabs>
  )
}