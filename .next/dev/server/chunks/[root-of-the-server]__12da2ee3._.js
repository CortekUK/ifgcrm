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
"[project]/app/api/invoices/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const programme = searchParams.get("programme");
    const search = searchParams.get("search");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "25");
    // Mock invoice data with 120 invoices
    const programmes = [
        "UK Academy",
        "Spain Academy",
        "USA Academy",
        "Brazil Academy"
    ];
    const statuses = [
        "draft",
        "sent",
        "paid",
        "overdue"
    ];
    const names = [
        "Daniel Perez",
        "Marcus Silva",
        "James Wilson",
        "Carlos Rodriguez",
        "Tom Anderson",
        "Luis Martinez",
        "David Thompson",
        "Miguel Santos",
        "Alex Johnson",
        "Roberto Garcia",
        "Chris Evans",
        "Fernando Lopez",
        "Ryan Murphy",
        "Diego Costa",
        "Matt Brown",
        "Pablo Hernandez",
        "Jake Williams",
        "Jorge Ramirez",
        "Ben Davis",
        "Antonio Gomez"
    ];
    const allInvoices = Array.from({
        length: 120
    }, (_, i)=>{
        const statusValue = statuses[i % 4];
        const daysOffset = statusValue === "overdue" ? -(i % 30 + 1) : statusValue === "paid" ? -(i % 20) : i % 30 + 1;
        return {
            id: 5000 + i,
            invoice_number: `INV-${5000 + i}`,
            player_name: names[i % names.length],
            programme: programmes[i % programmes.length],
            amount: 1000 + i % 10 * 250,
            currency: "GBP",
            status: statusValue,
            due_date: new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            payment_url: `https://pay.ifgcrm.com/inv/${5000 + i}`
        };
    });
    // Filter invoices
    let filteredInvoices = allInvoices;
    if (status && status !== "all") {
        filteredInvoices = filteredInvoices.filter((inv)=>inv.status === status);
    }
    if (programme && programme !== "all") {
        filteredInvoices = filteredInvoices.filter((inv)=>inv.programme === programme);
    }
    if (search) {
        const searchLower = search.toLowerCase();
        filteredInvoices = filteredInvoices.filter((inv)=>inv.player_name.toLowerCase().includes(searchLower) || inv.invoice_number.toLowerCase().includes(searchLower));
    }
    // Paginate
    const total = filteredInvoices.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        data: paginatedInvoices,
        total,
        page,
        pageSize
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__12da2ee3._.js.map