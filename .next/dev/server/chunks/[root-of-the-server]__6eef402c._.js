module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/campaigns/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// Mock data for single campaign
const campaignData = {
    id: "1",
    name: "Spring Showcase Event Invitation",
    type: "email",
    status: "sent",
    sent: 138,
    open_rate: 58,
    click_rate: 24,
    response_rate: 18,
    bounce_rate: 2.1,
    created_at: "2024-01-15T10:00:00Z",
    last_sent: "2024-01-16T14:30:00Z",
    thumbnail: "/placeholder.svg",
    subject: "You're Invited: IFG Showcase Event",
    content: `Hi [Player Name],

We're excited to invite you to our upcoming showcase event where you'll have the opportunity to demonstrate your skills and meet with our coaching staff.

Event Details:
- Date: Saturday, March 15th, 2024
- Time: 10:00 AM - 2:00 PM
- Location: IFG Training Center

Please RSVP by clicking the link below.

Best regards,
IFG Academy Team`,
    lists: [
        {
            id: "1",
            name: "Oxford University List",
            recipients: 45
        },
        {
            id: "2",
            name: "Cambridge University List",
            recipients: 38
        },
        {
            id: "3",
            name: "London Universities List",
            recipients: 32
        }
    ]
};
async function GET(request, { params }) {
    const { id } = await params;
    // For demo purposes, return the same campaign data with the requested ID
    const campaign = {
        ...campaignData,
        id: id
    };
    // Simulate different statuses for different IDs
    if (id === "2") {
        campaign.status = "draft";
        campaign.name = "Summer Training Camp Announcement";
    } else if (id === "3") {
        campaign.status = "scheduled";
        campaign.name = "Player Registration Reminder";
    } else if (id === "4") {
        campaign.status = "paused";
        campaign.name = "Tournament Invitation";
    }
    // Add some delay to simulate API call
    await new Promise((resolve)=>setTimeout(resolve, 300));
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(campaign);
}
async function PUT(request, { params }) {
    const { id } = await params;
    const body = await request.json();
    // In a real app, this would update the campaign in the database
    console.log("Updating campaign:", id, body);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        message: "Campaign updated successfully",
        data: {
            ...campaignData,
            ...body,
            id
        }
    });
}
async function DELETE(request, { params }) {
    const { id } = await params;
    // In a real app, this would delete the campaign from the database
    console.log("Deleting campaign:", id);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        message: "Campaign deleted successfully"
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6eef402c._.js.map