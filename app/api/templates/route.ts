import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for templates (will persist during the session)
// In production, this would be stored in a database
let templatesStore: any[] = [
  {
    id: "template-1",
    name: "Welcome Email Template",
    type: "email",
    category: "newsletter",
    subject: "Welcome to IFG Football Academy",
    preheader: "Start your football journey with us!",
    content: "Dear Player,\n\nWelcome to the International Football Group! We're excited to have you join our academy.\n\nBest regards,\nIFG Team",
    htmlContent: "<h2>Welcome to IFG!</h2><p>We're thrilled to have you on board.</p>",
    blocks: [
      { type: "text", value: "Welcome to the International Football Group!" },
      { type: "text", value: "We're excited to have you join our academy and start your football journey with us." },
      { type: "button", label: "Get Started", url: "https://example.com" }
    ],
    fromName: "IFG Academy",
    fromEmail: "academy@ifg.com",
    thumbnail: "/placeholder.svg?height=200&width=300",
    updated_at: new Date().toISOString(),
    usage_count: 5,
  },
  {
    id: "template-2",
    name: "Training Schedule SMS",
    type: "sms",
    category: "announcement",
    content: "Hi {name}, your training session is scheduled for tomorrow at 4 PM. See you at the field!",
    updated_at: new Date().toISOString(),
    usage_count: 12,
  },
  {
    id: "template-3",
    name: "Payment Reminder Email",
    type: "email",
    category: "invoice",
    subject: "Payment Reminder - IFG Academy",
    preheader: "Your payment is due soon",
    content: "Dear Parent,\n\nThis is a friendly reminder that your payment is due.\n\nThank you,\nIFG Team",
    htmlContent: "<h3>Payment Reminder</h3><p>Your payment of £500 is due by the end of this month.</p>",
    blocks: [
      { type: "text", value: "Payment Reminder" },
      { type: "text", value: "Your payment of £500 is due by the end of this month." },
      { type: "button", label: "Pay Now", url: "https://payment.example.com" }
    ],
    fromName: "IFG Billing",
    fromEmail: "billing@ifg.com",
    thumbnail: "/placeholder.svg?height=200&width=300",
    updated_at: new Date().toISOString(),
    usage_count: 8,
  }
]

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: templatesStore })
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const newTemplate = {
    id: `template-${Date.now()}`,
    ...body,
    updated_at: new Date().toISOString(),
    usage_count: 0,
  }

  templatesStore.push(newTemplate)

  return NextResponse.json({ data: newTemplate })
}
