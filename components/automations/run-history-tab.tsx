"use client"

import { RunHistoryContent } from "./run-history-content"
import type { User } from "@supabase/supabase-js"

interface RunHistoryTabProps {
  user: User
}

export function RunHistoryTab({ user }: RunHistoryTabProps) {
  return <RunHistoryContent user={user} />
}
