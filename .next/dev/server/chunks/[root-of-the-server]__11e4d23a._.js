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
"[project]/app/api/player-groups/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// Mock data storage for player groups
let mockGroups = [
    {
        id: "1",
        name: "High Priority Prospects",
        description: "Top talent players for immediate recruitment",
        playerIds: [
            1,
            3,
            5,
            7,
            9,
            11,
            13,
            15
        ],
        color: "#3B82F6",
        createdAt: new Date("2024-01-15").toISOString(),
        updatedAt: new Date("2024-01-15").toISOString(),
        playerCount: 8
    },
    {
        id: "2",
        name: "US College 2026 Candidates",
        description: "Players targeted for US College 2026 programme",
        playerIds: [
            2,
            4,
            6,
            8,
            10,
            12,
            14,
            16,
            18,
            20
        ],
        color: "#10B981",
        createdAt: new Date("2024-01-20").toISOString(),
        updatedAt: new Date("2024-01-20").toISOString(),
        playerCount: 10
    },
    {
        id: "3",
        name: "Goalkeepers",
        description: "All goalkeeper positions",
        playerIds: [
            5,
            10,
            15,
            20,
            25,
            30
        ],
        color: "#F59E0B",
        createdAt: new Date("2024-01-22").toISOString(),
        updatedAt: new Date("2024-01-22").toISOString(),
        playerCount: 6
    },
    {
        id: "4",
        name: "International Players",
        description: "Players from international markets",
        playerIds: [
            3,
            6,
            9,
            12,
            15,
            18,
            21,
            24,
            27,
            30
        ],
        color: "#8B5CF6",
        createdAt: new Date("2024-01-25").toISOString(),
        updatedAt: new Date("2024-01-25").toISOString(),
        playerCount: 10
    }
];
async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    let filtered = mockGroups;
    if (search) {
        filtered = filtered.filter((group)=>group.name.toLowerCase().includes(search.toLowerCase()) || group.description.toLowerCase().includes(search.toLowerCase()));
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        data: filtered,
        total: filtered.length
    });
}
async function POST(request) {
    try {
        const body = await request.json();
        const { name, description, playerIds, color } = body;
        if (!name) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Group name is required"
            }, {
                status: 400
            });
        }
        const newGroup = {
            id: String(mockGroups.length + 1),
            name,
            description: description || "",
            playerIds: playerIds || [],
            color: color || "#3B82F6",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            playerCount: (playerIds || []).length
        };
        mockGroups.push(newGroup);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(newGroup, {
            status: 201
        });
    } catch (error) {
        console.error("Error creating group:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create group"
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const body = await request.json();
        const { id, name, description, playerIds, color } = body;
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Group ID is required"
            }, {
                status: 400
            });
        }
        const groupIndex = mockGroups.findIndex((g)=>g.id === id);
        if (groupIndex === -1) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Group not found"
            }, {
                status: 404
            });
        }
        mockGroups[groupIndex] = {
            ...mockGroups[groupIndex],
            name: name || mockGroups[groupIndex].name,
            description: description !== undefined ? description : mockGroups[groupIndex].description,
            playerIds: playerIds !== undefined ? playerIds : mockGroups[groupIndex].playerIds,
            color: color || mockGroups[groupIndex].color,
            updatedAt: new Date().toISOString(),
            playerCount: playerIds ? playerIds.length : mockGroups[groupIndex].playerCount
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(mockGroups[groupIndex]);
    } catch (error) {
        console.error("Error updating group:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to update group"
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Group ID is required"
            }, {
                status: 400
            });
        }
        const groupIndex = mockGroups.findIndex((g)=>g.id === id);
        if (groupIndex === -1) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Group not found"
            }, {
                status: 404
            });
        }
        mockGroups.splice(groupIndex, 1);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        console.error("Error deleting group:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to delete group"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__11e4d23a._.js.map