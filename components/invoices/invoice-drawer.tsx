"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Copy, ExternalLink, Send, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface Invoice {
  id: number
  invoice_number: string
  player_name: string
  programme: string
  amount: number
  currency: string
  status: "draft" | "sent" | "paid" | "overdue"
  due_date: string
  issue_date?: string
  payment_url?: string
}

interface Payment {
  id: number
  amount: number
  date: string
  method: string
  status: string
}

interface InvoiceDrawerProps {
  invoice: Invoice
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function InvoiceDrawer({ invoice, open, onOpenChange, onUpdate }: InvoiceDrawerProps) {
  const [sending, setSending] = useState(false)
  const [marking, setMarking] = useState(false)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loadingPayments, setLoadingPayments] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (open) {
      fetchPayments()
    }
  }, [open, invoice.id])

  const fetchPayments = async () => {
    setLoadingPayments(true)
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/payments`)
      const data = await response.json()
      setPayments(data.payments || [])
    } catch (error) {
      console.error("Failed to fetch payments:", error)
    } finally {
      setLoadingPayments(false)
    }
  }

  const handleSendPaymentLink = async () => {
    setSending(true)
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/send-link`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Payment link sent",
          description: `Payment link sent to ${invoice.player_name}`,
        })
        onUpdate()
      } else {
        throw new Error("Failed to send payment link")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send payment link. Please try again.",
      })
    } finally {
      setSending(false)
    }
  }

  const handleMarkAsPaid = async () => {
    setMarking(true)
    try {
      const response = await fetch(`/api/invoices/${invoice.id}/mark-paid`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Invoice marked as paid",
          description: `Invoice ${invoice.invoice_number} has been marked as paid`,
        })
        onUpdate()
        onOpenChange(false)
      } else {
        throw new Error("Failed to mark as paid")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark invoice as paid. Please try again.",
      })
    } finally {
      setMarking(false)
    }
  }

  const copyPaymentUrl = () => {
    if (invoice.payment_url) {
      navigator.clipboard.writeText(invoice.payment_url)
      toast({
        title: "Copied",
        description: "Payment URL copied to clipboard",
      })
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { className: string; label: string }> = {
      paid: { className: "bg-green-500 text-white", label: "Paid" },
      sent: { className: "bg-blue-500 text-white", label: "Sent" },
      overdue: { className: "bg-red-500 text-white", label: "Overdue" },
      draft: { className: "bg-gray-400 text-white", label: "Draft" },
    }

    const config = configs[status] || configs.draft
    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] my-4 overflow-hidden p-0 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Invoice {invoice.invoice_number}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            {invoice.player_name} • {getStatusBadge(invoice.status)}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6 animate-fade-in">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Invoice Breakdown</h3>
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Player</span>
                  <span className="text-sm font-medium text-gray-900">{invoice.player_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Programme</span>
                  <span className="text-sm font-medium text-gray-900">{invoice.programme}</span>
                </div>
                {invoice.issue_date && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Issue Date</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(invoice.issue_date)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Due Date</span>
                  <span className="text-sm font-medium text-gray-900">{formatDate(invoice.due_date)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-gray-900">Total Amount</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(invoice.amount, invoice.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  {getStatusBadge(invoice.status)}
                </div>
              </div>
            </div>

            {/* Pay Now Button for Unpaid Invoices */}
            {invoice.status !== "paid" && invoice.payment_url && (
              <div>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all hover:from-blue-700 hover:to-blue-800"
                  onClick={() => window.open(invoice.payment_url, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Pay Now
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4 animate-fade-in">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Payment Timeline</h3>
              {loadingPayments ? (
                <div className="rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
                  Loading payments...
                </div>
              ) : payments.length === 0 ? (
                <div className="rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
                  No payments recorded yet
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="rounded-lg border border-gray-200 bg-white p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full bg-green-100 p-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {formatCurrency(payment.amount, invoice.currency)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {payment.method} • {formatDate(payment.date)}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-500 text-white">{payment.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-4 animate-fade-in">
            <div className="space-y-3">
              <Button
                onClick={handleSendPaymentLink}
                disabled={sending || invoice.status === "paid"}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 transition-all hover:from-blue-700 hover:to-blue-800"
                size="lg"
              >
                <Send className="mr-2 h-4 w-4" />
                {sending ? "Sending..." : "Send Payment Link"}
              </Button>

              {invoice.status !== "paid" && (
                <Button
                  variant="outline"
                  onClick={handleMarkAsPaid}
                  disabled={marking}
                  className="w-full border-green-300 bg-transparent text-green-700 transition-all hover:bg-green-50"
                  size="lg"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {marking ? "Updating..." : "Mark as Paid"}
                </Button>
              )}

              {invoice.payment_url && (
                <Button
                  variant="outline"
                  onClick={copyPaymentUrl}
                  className="w-full bg-transparent transition-all"
                  size="lg"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Payment Link
                </Button>
              )}

              <Separator className="my-4" />

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  router.push("/players")
                  onOpenChange(false)
                }}
              >
                View Player Profile
              </Button>
            </div>

            {invoice.payment_url && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="mb-2 text-xs font-medium text-gray-600">Payment URL</div>
                <code className="block truncate text-xs text-gray-700">{invoice.payment_url}</code>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
