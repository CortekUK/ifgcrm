import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownToLine, MessageSquare, Mail, FileText, UserPlus } from 'lucide-react'

export function PlayerInflows() {
  const inflows = [
    {
      name: "SMS",
      count: 72,
      icon: MessageSquare,
      color: "#10B981",
      percentage: 38,
      description: "Via text messages"
    },
    {
      name: "Email",
      count: 58,
      icon: Mail,
      color: "#3B82F6",
      percentage: 31,
      description: "Via email campaigns"
    },
    {
      name: "Forms",
      count: 36,
      icon: FileText,
      color: "#F59E0B",
      percentage: 19,
      description: "Via online forms"
    },
    {
      name: "Direct CRM",
      count: 21,
      icon: UserPlus,
      color: "#8B5CF6",
      percentage: 12,
      description: "Added manually"
    },
  ]

  const totalCount = inflows.reduce((sum, inflow) => sum + inflow.count, 0)
  const maxCount = Math.max(...inflows.map((i) => i.count))

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap" rel="stylesheet" />
      <Card className="overflow-hidden rounded-[14px] border border-[#E1E5EF] shadow-sm transition-all duration-200 hover:shadow-[0_2px_8px_rgba(10,71,177,0.1)]">
        <div className="h-3 bg-gradient-to-b from-[#EAF1FD] to-white" />
        <CardHeader>
          <div className="flex items-center gap-2">
            <ArrowDownToLine className="h-4 w-4 text-primary" />
            <CardTitle
              className="text-sm uppercase tracking-wide py-0.5"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 500,
                letterSpacing: "0.7px",
                color: "#0A47B1",
              }}
            >
              Player Inflows
            </CardTitle>
          </div>
          <CardDescription>How players are entering your portal</CardDescription>
          <div className="mt-2 text-xs text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{totalCount}</span> players this month
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {inflows.map((inflow) => {
              const Icon = inflow.icon
              return (
                <div key={inflow.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg shadow-sm"
                        style={{ backgroundColor: `${inflow.color}20` }}
                      >
                        <Icon
                          className="h-4 w-4"
                          style={{ color: inflow.color }}
                        />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-700">{inflow.name}</span>
                        <p className="text-xs text-gray-500">{inflow.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{inflow.count}</span>
                      <span className="ml-1 text-xs text-gray-500">({inflow.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 shadow-inner">
                    <div
                      className="h-full rounded-full shadow-sm transition-all duration-500 ease-out hover:brightness-110"
                      style={{
                        width: `${(inflow.count / maxCount) * 100}%`,
                        backgroundColor: inflow.color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Optional: Add a summary or trend indicator */}
          <div className="mt-6 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Most active channel:</span>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3 text-green-600" />
                <span className="font-semibold text-foreground">SMS (38%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}