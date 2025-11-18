import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from 'lucide-react'

export function LeadSourcesBreakdown() {
  const sources = [
    { name: "Google Ads", count: 64, color: "#4285F4", percentage: 34 },
    { name: "Instagram", count: 52, color: "#E4405F", percentage: 28 },
    { name: "Email", count: 43, color: "#10B981", percentage: 23 },
    { name: "Referral", count: 28, color: "#F59E0B", percentage: 15 },
  ]

  const maxCount = Math.max(...sources.map((s) => s.count))

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap" rel="stylesheet" />
      <Card className="overflow-hidden rounded-[14px] border border-[#E1E5EF] shadow-sm transition-all duration-200 hover:shadow-[0_2px_8px_rgba(10,71,177,0.1)]">
        <div className="h-3 bg-gradient-to-b from-[#EAF1FD] to-white" />
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <CardTitle
              className="text-sm uppercase tracking-wide py-0.5"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 500,
                letterSpacing: "0.7px",
                color: "#0A47B1",
              }}
            >
              Lead Sources Breakdown
            </CardTitle>
          </div>
          <CardDescription>Where your leads are coming from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {sources.map((source) => (
              <div key={source.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: source.color }} />
                    <span className="text-sm font-semibold text-gray-700">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{source.count}</span>
                    <span className="text-xs text-gray-500">({source.percentage}%)</span>
                  </div>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 shadow-inner">
                  <div
                    className="h-full rounded-full shadow-sm transition-all duration-500 ease-out hover:brightness-110"
                    style={{
                      width: `${(source.count / maxCount) * 100}%`,
                      backgroundColor: source.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
