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
"[project]/app/api/templates/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// In-memory storage for templates (will persist during the session)
// In production, this would be stored in a database
let templatesStore = [
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
            {
                type: "text",
                value: "Welcome to the International Football Group!"
            },
            {
                type: "text",
                value: "We're excited to have you join our academy and start your football journey with us."
            },
            {
                type: "button",
                label: "Get Started",
                url: "https://example.com"
            }
        ],
        fromName: "IFG Academy",
        fromEmail: "academy@ifg.com",
        thumbnail: "/placeholder.svg?height=200&width=300",
        updated_at: new Date().toISOString(),
        usage_count: 5
    },
    {
        id: "template-2",
        name: "Training Schedule SMS",
        type: "sms",
        category: "announcement",
        content: "Hi {name}, your training session is scheduled for tomorrow at 4 PM. See you at the field!",
        updated_at: new Date().toISOString(),
        usage_count: 12
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
            {
                type: "text",
                value: "Payment Reminder"
            },
            {
                type: "text",
                value: "Your payment of £500 is due by the end of this month."
            },
            {
                type: "button",
                label: "Pay Now",
                url: "https://payment.example.com"
            }
        ],
        fromName: "IFG Billing",
        fromEmail: "billing@ifg.com",
        thumbnail: "/placeholder.svg?height=200&width=300",
        updated_at: new Date().toISOString(),
        usage_count: 8
    }
];
async function GET(request) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        data: templatesStore
    });
}
async function POST(request) {
    const body = await request.json();
    const newTemplate = {
        id: `template-${Date.now()}`,
        ...body,
        updated_at: new Date().toISOString(),
        usage_count: 0
    };
    templatesStore.push(newTemplate);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        data: newTemplate
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2f0c4871._.js.map