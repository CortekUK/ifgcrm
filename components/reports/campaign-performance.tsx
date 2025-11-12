"use client"

import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function CampaignPerformance() {
  const campaigns = [
    {
      name: "Summer Recruitment 2025",
      type: "Email",
      sent: 847,
      openRate: "48.3%",
      clickRate: "22.1%",
      lastSent: "2 days ago",
    },
    {
      name: "Follow-up: Elite Programme",
      type: "Email",
      sent: 412,
      openRate: "51.2%",
      clickRate: "19.8%",
      lastSent: "5 days ago",
    },
    {
      name: "US College Scholarships",
      type: "Email",
      sent: 623,
      openRate: "44.7%",
      clickRate: "17.3%",
      lastSent: "1 week ago",
    },
    {
      name: "Trial Session Invitation",
      type: "SMS",
      sent: 234,
      openRate: "89.2%",
      clickRate: "31.4%",
      lastSent: "3 days ago",
    },
    {
      name: "Welcome: New Players 2025",
      type: "Email",
      sent: 156,
      openRate: "67.8%",
      clickRate: "28.9%",
      lastSent: "1 day ago",
    },
    {
      name: "Season Kick-off Announcement",
      type: "Email",
      sent: 1024,
      openRate: "39.1%",
      clickRate: "14.2%",
      lastSent: "2 weeks ago",
    },
  ]

  return (
    <Card className="mb-6 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Campaign performance</h2>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-3">
        <Select defaultValue="all-types">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Campaign type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-types">All types</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-status">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All status</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all-programmes">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Programme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-programmes">All programmes</SelectItem>
            <SelectItem value="elite">Elite Programme</SelectItem>
            <SelectItem value="us-college">US College</SelectItem>
            <SelectItem value="uk-academy">UK Academy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">Campaign</TableHead>
              <TableHead className="font-semibold text-gray-700">Type</TableHead>
              <TableHead className="font-semibold text-gray-700">Sent</TableHead>
              <TableHead className="font-semibold text-gray-700">Open rate</TableHead>
              <TableHead className="font-semibold text-gray-700">Click rate</TableHead>
              <TableHead className="font-semibold text-gray-700">Last sent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">{campaign.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={campaign.type === "Email" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}
                  >
                    {campaign.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-700">{campaign.sent.toLocaleString()}</TableCell>
                <TableCell className="text-gray-700">{campaign.openRate}</TableCell>
                <TableCell className="text-gray-700">{campaign.clickRate}</TableCell>
                <TableCell className="text-gray-600">{campaign.lastSent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
