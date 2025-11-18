import { redirect } from 'next/navigation'
import { createClient } from "@/lib/supabase/server"
import { AppLayout } from "@/components/layout/app-layout"
import { SmsRepliesContent } from "@/components/sms-replies/sms-replies-content"

export default async function SmsRepliesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <AppLayout user={user} title="SMS Replies">
      <SmsRepliesContent />
    </AppLayout>
  )
}
