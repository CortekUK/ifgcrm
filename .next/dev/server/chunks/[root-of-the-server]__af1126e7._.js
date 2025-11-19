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
"[project]/app/api/pipelines/[id]/stages/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET(request, { params }) {
    const { id } = await params;
    // Mock pipeline data with stages and deals
    const mockData = {
        1: {
            id: 1,
            name: "US College Recruitment",
            dealsWon: 8,
            conversionRate: 53.3,
            stages: [
                {
                    id: 1,
                    name: "Initial Lead",
                    order: 1,
                    deals: [
                        {
                            id: 9001,
                            player_name: "Maribel Santos",
                            email: "maribel.santos@email.com",
                            phone: "+1 (555) 123-4567",
                            programme: "US College 2026",
                            recruiter: "Chris",
                            status: "In Pipeline",
                            last_activity: "2025-11-06T10:00:00Z",
                            deal_value: 15000
                        },
                        {
                            id: 9002,
                            player_name: "James Wilson",
                            email: "james.wilson@email.com",
                            phone: "+1 (555) 234-5678",
                            programme: "US College 2026",
                            recruiter: "Sarah",
                            status: "In Pipeline",
                            last_activity: "2025-11-07T14:30:00Z",
                            deal_value: 18000
                        },
                        {
                            id: 9003,
                            player_name: "Emma Rodriguez",
                            email: "emma.rodriguez@email.com",
                            phone: "+1 (555) 345-6789",
                            programme: "US College 2026",
                            recruiter: "Chris",
                            status: "In Pipeline",
                            last_activity: "2025-11-05T09:15:00Z",
                            deal_value: 12000
                        }
                    ]
                },
                {
                    id: 2,
                    name: "In Contact",
                    order: 2,
                    deals: [
                        {
                            id: 9020,
                            player_name: "David Lee",
                            email: "david.lee@email.com",
                            phone: "+1 (555) 111-2222",
                            programme: "US College 2027",
                            recruiter: "Mike",
                            status: "In Pipeline",
                            last_activity: "2025-11-08T09:00:00Z",
                            deal_value: 14000
                        },
                        {
                            id: 9021,
                            player_name: "Sophie Turner",
                            email: "sophie.turner@email.com",
                            phone: "+1 (555) 222-3333",
                            programme: "US College 2026",
                            recruiter: "Emma",
                            status: "In Pipeline",
                            last_activity: "2025-11-07T15:30:00Z",
                            deal_value: 16000
                        }
                    ]
                },
                {
                    id: 3,
                    name: "Zoom Scheduled",
                    order: 3,
                    deals: [
                        {
                            id: 9004,
                            player_name: "Lucas Brown",
                            email: "lucas.brown@email.com",
                            phone: "+1 (555) 456-7890",
                            programme: "US College 2026",
                            recruiter: "Mike",
                            status: "Interview",
                            last_activity: "2025-11-08T11:00:00Z",
                            deal_value: 20000
                        },
                        {
                            id: 9005,
                            player_name: "Sophia Chen",
                            email: "sophia.chen@email.com",
                            phone: "+1 (555) 567-8901",
                            programme: "US College 2026",
                            recruiter: "Emma",
                            status: "Interview",
                            last_activity: "2025-11-07T16:45:00Z",
                            deal_value: 22000
                        }
                    ]
                },
                {
                    id: 4,
                    name: "Reschedule Zoom",
                    order: 4,
                    deals: [
                        {
                            id: 9022,
                            player_name: "Ryan Cooper",
                            email: "ryan.cooper@email.com",
                            phone: "+1 (555) 333-4444",
                            programme: "US College 2026",
                            recruiter: "Sarah",
                            status: "Interview",
                            last_activity: "2025-11-06T10:30:00Z",
                            deal_value: 19000
                        }
                    ]
                },
                {
                    id: 5,
                    name: "Follow Up",
                    order: 5,
                    deals: [
                        {
                            id: 9023,
                            player_name: "Emily Watson",
                            email: "emily.watson@email.com",
                            phone: "+1 (555) 444-5555",
                            programme: "US College 2027",
                            recruiter: "Chris",
                            status: "Contacted",
                            last_activity: "2025-11-05T14:00:00Z",
                            deal_value: 17000
                        },
                        {
                            id: 9024,
                            player_name: "Michael Zhang",
                            email: "michael.zhang@email.com",
                            phone: "+1 (555) 555-6666",
                            programme: "US College 2026",
                            recruiter: "Mike",
                            status: "Contacted",
                            last_activity: "2025-11-04T11:30:00Z",
                            deal_value: 18000
                        }
                    ]
                },
                {
                    id: 6,
                    name: "Collecting Documents",
                    order: 6,
                    deals: [
                        {
                            id: 9006,
                            player_name: "Oliver Taylor",
                            email: "oliver.taylor@email.com",
                            phone: "+1 (555) 678-9012",
                            programme: "US College 2026",
                            recruiter: "Chris",
                            status: "Contacted",
                            last_activity: "2025-11-06T13:20:00Z",
                            deal_value: 16000
                        }
                    ]
                },
                {
                    id: 7,
                    name: "Applied",
                    order: 7,
                    deals: [
                        {
                            id: 9007,
                            player_name: "Ava Martinez",
                            email: "ava.martinez@email.com",
                            phone: "+1 (555) 789-0123",
                            programme: "US College 2026",
                            recruiter: "Sarah",
                            status: "Contacted",
                            last_activity: "2025-11-05T10:30:00Z",
                            deal_value: 17000
                        },
                        {
                            id: 9008,
                            player_name: "Noah Anderson",
                            email: "noah.anderson@email.com",
                            phone: "+1 (555) 890-1234",
                            programme: "US College 2026",
                            recruiter: "Mike",
                            status: "Contacted",
                            last_activity: "2025-11-04T15:00:00Z",
                            deal_value: 19000
                        }
                    ]
                },
                {
                    id: 8,
                    name: "Conditional Offer",
                    order: 8,
                    deals: [
                        {
                            id: 9025,
                            player_name: "Hannah Mitchell",
                            email: "hannah.mitchell@email.com",
                            phone: "+1 (555) 666-7777",
                            programme: "US College 2026",
                            recruiter: "Emma",
                            status: "Signed",
                            last_activity: "2025-11-03T16:00:00Z",
                            deal_value: 23000
                        }
                    ]
                },
                {
                    id: 9,
                    name: "Dormant Lead",
                    order: 9,
                    deals: [
                        {
                            id: 9026,
                            player_name: "Alex Roberts",
                            email: "alex.roberts@email.com",
                            phone: "+1 (555) 777-8888",
                            programme: "US College 2027",
                            recruiter: "Chris",
                            status: "In Pipeline",
                            last_activity: "2025-10-28T10:00:00Z",
                            deal_value: 0
                        }
                    ]
                }
            ]
        },
        2: {
            id: 2,
            name: "European Pathway",
            dealsWon: 2,
            conversionRate: 50.0,
            stages: [
                {
                    id: 11,
                    name: "Initial contact",
                    order: 1,
                    deals: [
                        {
                            id: 9010,
                            player_name: "Jack Williams",
                            email: "jack.williams@email.com",
                            phone: "+1 (555) 012-3456",
                            programme: "European Academy",
                            recruiter: "Chris",
                            status: "In Pipeline",
                            last_activity: "2025-11-07T09:00:00Z",
                            deal_value: 13000
                        }
                    ]
                },
                {
                    id: 12,
                    name: "Trial scheduled",
                    order: 2,
                    deals: []
                },
                {
                    id: 13,
                    name: "Trial completed",
                    order: 3,
                    deals: [
                        {
                            id: 9011,
                            player_name: "Mia Davies",
                            email: "mia.davies@email.com",
                            phone: "+1 (555) 112-3456",
                            programme: "European Academy",
                            recruiter: "Sarah",
                            status: "Contacted",
                            last_activity: "2025-11-06T14:00:00Z",
                            deal_value: 14000
                        }
                    ]
                },
                {
                    id: 14,
                    name: "Offered",
                    order: 4,
                    deals: []
                }
            ]
        },
        3: {
            id: 3,
            name: "UK Academy Pipeline",
            dealsWon: 1,
            conversionRate: 33.3,
            stages: [
                {
                    id: 21,
                    name: "Inquiry",
                    order: 1,
                    deals: [
                        {
                            id: 9012,
                            player_name: "Ethan Johnson",
                            email: "ethan.johnson@email.com",
                            phone: "+1 (555) 212-3456",
                            programme: "UK Programme",
                            recruiter: "Mike",
                            status: "In Pipeline",
                            last_activity: "2025-11-08T10:00:00Z",
                            deal_value: 11000
                        }
                    ]
                },
                {
                    id: 22,
                    name: "Information sent",
                    order: 2,
                    deals: [
                        {
                            id: 9013,
                            player_name: "Charlotte Smith",
                            email: "charlotte.smith@email.com",
                            phone: "+1 (555) 312-3456",
                            programme: "UK Programme",
                            recruiter: "Emma",
                            status: "In Pipeline",
                            last_activity: "2025-11-07T11:30:00Z",
                            deal_value: 10000
                        }
                    ]
                },
                {
                    id: 23,
                    name: "Enrolled",
                    order: 3,
                    deals: []
                }
            ]
        }
    };
    const pipelineData = mockData[Number.parseInt(id)];
    if (!pipelineData) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Pipeline not found"
        }, {
            status: 404
        });
    }
    const url = new URL(request.url);
    const stagesOnly = url.searchParams.get("stagesOnly") === "true";
    if (stagesOnly) {
        // Return only stages without deals for Settings page
        const stages = pipelineData.stages.map(({ deals, ...stage })=>stage);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(stages);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(pipelineData);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__af1126e7._.js.map