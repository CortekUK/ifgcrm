import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

export async function UnmatchedReplies() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: messages } = await supabase
    .from("sms_messages")
    .select(`
      *,
      leads (name, phone)
    `)
    .eq("user_id", user.id)
    .eq("is_matched", false)
    .eq("direction", "inbound")
    .order("created_at", { ascending: false })
    .limit(5)

  const formatTime = (date: string) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffInHours = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap" rel="stylesheet" />
      <Card className="overflow-hidden rounded-[14px] border border-[#E1E5EF] shadow-sm transition-all duration-200 hover:shadow-[0_2px_8px_rgba(10,71,177,0.1)]">
        <div className="h-3 bg-gradient-to-b from-[#EAF1FD] to-white" />
        <CardHeader>
          <CardTitle
            className="text-sm uppercase tracking-wide py-0.5"
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.7px",
              color: "#0A47B1",
            }}
          >
            Unmatched SMS Replies
          </CardTitle>
          <CardDescription>Recent messages awaiting response</CardDescription>
        </CardHeader>
        <CardContent>
          {messages && messages.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">From</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Message</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Received</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {messages.map((message: any) => (
                    <tr key={message.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{message.leads?.name || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{message.leads?.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="line-clamp-2 text-sm text-gray-700">{message.message}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">{formatTime(message.created_at)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                          Match
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-900">All caught up</p>
              <p className="mt-1 text-xs text-gray-500">No unmatched replies at the moment</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
