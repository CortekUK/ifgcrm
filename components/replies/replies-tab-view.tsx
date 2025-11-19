"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SmsRepliesContent } from "../sms-replies/sms-replies-content"
import { EmailRepliesContent } from "./email-replies-content"
import { Mail, MessageSquare } from "lucide-react"

export function RepliesTabView() {
  const [activeTab, setActiveTab] = useState("email-replies")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full max-w-[400px] grid-cols-2">
        <TabsTrigger value="email-replies" className="gap-2">
          <Mail className="h-4 w-4" />
          Email Replies
        </TabsTrigger>
        <TabsTrigger value="sms-replies" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          SMS Replies
        </TabsTrigger>
      </TabsList>

      <TabsContent value="email-replies" className="mt-4">
        <EmailRepliesContent />
      </TabsContent>

      <TabsContent value="sms-replies" className="mt-4">
        <SmsRepliesContent />
      </TabsContent>
    </Tabs>
  )
}