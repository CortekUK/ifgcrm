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
"[project]/app/api/players/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// Mock data with UK Colleges
const ukColleges = [
    "University of Oxford",
    "University of Cambridge",
    "Imperial College London",
    "UCL",
    "University of Manchester",
    "King's College London",
    "University of Edinburgh",
    "University of Bristol"
];
const mockPlayers = Array.from({
    length: 138
}, (_, i)=>({
        id: i + 1,
        name: `Player ${i + 1}`,
        email: `player${i + 1}@example.com`,
        phone: `+44 7${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 900000) + 100000)}`,
        programme: ukColleges[i % ukColleges.length],
        recruiter: [
            "Chris",
            "Sarah",
            "Mike",
            "Emma"
        ][i % 4],
        status: [
            "In pipeline",
            "Contacted",
            "Interview",
            "Signed"
        ][i % 4],
        last_activity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        tags: [
            [
                "High Priority",
                "Striker"
            ],
            [
                "Goalkeeper",
                "International"
            ],
            [
                "Midfielder",
                "U18",
                "Left Footed"
            ],
            [
                "Defender",
                "Scholarship"
            ],
            [
                "High Priority",
                "U21"
            ],
            []
        ][i % 6]
    }));
async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const programme = searchParams.get("programme") || "";
    const recruiter = searchParams.get("recruiter") || "";
    const tag = searchParams.get("tag") || "";
    const status = searchParams.get("status") || "";
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "25");
    // Filter players
    let filtered = mockPlayers;
    if (search) {
        filtered = filtered.filter((p)=>p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()));
    }
    if (programme) {
        filtered = filtered.filter((p)=>p.programme === programme);
    }
    if (recruiter) {
        filtered = filtered.filter((p)=>p.recruiter === recruiter);
    }
    if (tag) {
        filtered = filtered.filter((p)=>p.tags && p.tags.includes(tag));
    }
    if (status) {
        filtered = filtered.filter((p)=>p.status.toLowerCase().includes(status.toLowerCase()));
    }
    // Paginate
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedPlayers = filtered.slice(start, end);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        data: paginatedPlayers,
        total: filtered.length,
        page,
        pageSize
    });
}
async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, phone, programme, recruiter, status, tags } = body;
        if (!name || !email || !phone || !programme || !recruiter) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required fields"
            }, {
                status: 400
            });
        }
        const newPlayer = {
            id: mockPlayers.length + 1,
            name,
            email,
            phone,
            programme,
            recruiter,
            status: status || "Contacted",
            last_activity: new Date().toISOString(),
            tags: tags || []
        };
        mockPlayers.push(newPlayer);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(newPlayer, {
            status: 201
        });
    } catch (error) {
        console.error("Error creating player:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create player"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ef63e80._.js.map