import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from 'lucide-react'

export function ProgrammeInterest() {
  const programmes = [
    { name: "Russell Group Universities", count: 52, color: "#002147", percentage: 28 },
    { name: "London Universities", count: 45, color: "#500778", percentage: 24 },
    { name: "Scottish Universities", count: 38, color: "#00325F", percentage: 20 },
    { name: "Red Brick Universities", count: 32, color: "#B01C2E", percentage: 17 },
    { name: "Other UK Institutions", count: 20, color: "#6B7280", percentage: 11 },
  ]

  const total = programmes.reduce((sum, p) => sum + p.count, 0)
  
  // Calculate pie chart segments
  let currentAngle = 0
  const segments = programmes.map((programme) => {
    const angle = (programme.count / total) * 360
    const segment = {
      ...programme,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    }
    currentAngle += angle
    return segment
  })

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap" rel="stylesheet" />
      <Card className="overflow-hidden rounded-[14px] border border-[#E1E5EF] shadow-sm transition-all duration-200 hover:shadow-[0_2px_8px_rgba(10,71,177,0.1)]">
        <div className="h-3 bg-gradient-to-b from-[#EAF1FD] to-white" />
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <CardTitle
              className="text-sm uppercase tracking-wide py-0.5"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 500,
                letterSpacing: "0.7px",
                color: "#0A47B1",
              }}
            >
              University Interest
            </CardTitle>
          </div>
          <CardDescription>Distribution of student interest across UK universities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-6">
            {/* Pie Chart */}
            <div className="relative h-48 w-48">
              <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                {segments.map((segment) => {
                  const startRad = (segment.startAngle * Math.PI) / 180
                  const endRad = (segment.endAngle * Math.PI) / 180
                  const largeArc = segment.endAngle - segment.startAngle > 180 ? 1 : 0
                  
                  const x1 = 100 + 90 * Math.cos(startRad)
                  const y1 = 100 + 90 * Math.sin(startRad)
                  const x2 = 100 + 90 * Math.cos(endRad)
                  const y2 = 100 + 90 * Math.sin(endRad)
                  
                  return (
                    <path
                      key={segment.name}
                      d={`M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={segment.color}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  )
                })}
                {/* Center circle */}
                <circle cx="100" cy="100" r="50" fill="white" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-gray-900">{total}</p>
                <p className="text-xs text-gray-500">Total Leads</p>
              </div>
            </div>
            
            {/* Legend */}
            <div className="grid w-full grid-cols-2 gap-3">
              {programmes.map((programme) => (
                <div key={programme.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: programme.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{programme.name}</p>
                    <p className="text-xs text-gray-500">{programme.count} ({programme.percentage}%)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
