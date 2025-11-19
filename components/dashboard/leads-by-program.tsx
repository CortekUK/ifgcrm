import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export async function LeadsByProgram() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: programs } = await supabase
    .from("programs")
    .select(`
      id,
      name,
      color,
      leads (count)
    `)
    .eq("user_id", user.id)

  const chartData =
    programs?.map((program: any) => ({
      name: program.name,
      count: program.leads[0]?.count || 0,
      color: program.color,
    })) || []

  const maxCount = Math.max(...chartData.map((d) => d.count), 1)

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
            Students by University
          </CardTitle>
          <CardDescription>Distribution across UK universities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {chartData.length > 0 ? (
              chartData.map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{item.count} students</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 shadow-inner">
                    <div
                      className="h-full rounded-full shadow-sm transition-all duration-500 ease-out hover:brightness-110"
                      style={{
                        width: `${(item.count / maxCount) * 100}%`,
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
                <p className="mt-4 text-sm font-semibold text-gray-900">No universities yet</p>
                <p className="mt-1 text-xs text-gray-500">Add universities to start tracking students</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
