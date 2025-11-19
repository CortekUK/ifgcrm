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
"[project]/lib/supabase/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient,
    "createServerClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://cujprjusexjzuapydiuf.supabase.co";
    const supabaseKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anByanVzZXhqenVhcHlkaXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDg1MTQsImV4cCI6MjA3ODE4NDUxNH0.TTRG0g8vh3-IpQ3YkJxFoLlQEa5IfAAkJIUrJa1XogA") || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anByanVzZXhqenVhcHlkaXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDg1MTQsImV4cCI6MjA3ODE4NDUxNH0.TTRG0g8vh3-IpQ3YkJxFoLlQEa5IfAAkJIUrJa1XogA";
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(supabaseUrl, supabaseKey, {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The "setAll" method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
;
}),
"[project]/app/api/contacts/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "50");
        const search = searchParams.get("search");
        const programmeId = searchParams.get("programmeId");
        const tag = searchParams.get("tag");
        const recruiterId = searchParams.get("recruiterId");
        const country = searchParams.get("country");
        const status = searchParams.get("status");
        const listId = searchParams.get("listId");
        let query = supabase.from("leads").select(`
        id,
        name,
        email,
        phone,
        status,
        notes,
        created_at,
        program:programs!program_id(id, name),
        recruiter:profiles!user_id(id, full_name)
      `, {
            count: "exact"
        });
        if (search) {
            query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
        }
        if (programmeId && programmeId !== "all") {
            query = query.eq("program_id", programmeId);
        }
        if (recruiterId && recruiterId !== "all") {
            query = query.eq("user_id", recruiterId);
        }
        if (status && status !== "all") {
            query = query.eq("status", status);
        }
        if (country && country !== "all") {
            // This filter will be applied when country column exists
            query = query.eq("country", country);
        }
        const offset = (page - 1) * pageSize;
        query = query.range(offset, offset + pageSize - 1).order("created_at", {
            ascending: false
        });
        const { data, error, count } = await query;
        if (error) {
            console.error("[v0] Error querying leads:", error);
            throw error;
        }
        let filteredData = data || [];
        if (listId && listId !== "all") {
            try {
                const { data: memberships } = await supabase.from("list_memberships").select("lead_id").eq("list_id", listId);
                if (memberships) {
                    const memberLeadIds = new Set(memberships.map((m)=>m.lead_id));
                    filteredData = filteredData.filter((lead)=>memberLeadIds.has(lead.id));
                }
            } catch (listError) {
                // Lists table might not exist yet, continue without filtering
                console.log("[v0] Lists table not available yet, skipping list filter");
            }
        }
        let listMembershipsMap = {};
        if (filteredData.length > 0) {
            try {
                const leadIds = filteredData.map((lead)=>lead.id);
                const { data: memberships } = await supabase.from("list_memberships").select(`
            lead_id,
            list:lists(id, name)
          `).in("lead_id", leadIds);
                if (memberships) {
                    memberships.forEach((membership)=>{
                        if (!listMembershipsMap[membership.lead_id]) {
                            listMembershipsMap[membership.lead_id] = [];
                        }
                        if (membership.list) {
                            listMembershipsMap[membership.lead_id].push({
                                id: membership.list.id,
                                name: membership.list.name
                            });
                        }
                    });
                }
            } catch (listError) {
                // Lists table might not exist yet, continue without list data
                console.log("[v0] Lists table not available yet, skipping list memberships");
            }
        }
        const contacts = filteredData.map((lead)=>({
                id: lead.id,
                name: lead.name,
                email: lead.email,
                phone: lead.phone || null,
                programme: lead.program ? {
                    id: lead.program.id,
                    name: lead.program.name
                } : null,
                recruiter: lead.recruiter ? {
                    id: lead.recruiter.id,
                    name: lead.recruiter.full_name
                } : null,
                tags: [],
                lists: listMembershipsMap[lead.id] || [],
                country: null,
                status: lead.status || null,
                createdAt: lead.created_at
            }));
        const totalCount = listId && listId !== "all" ? contacts.length : count || 0;
        const totalPages = Math.ceil(totalCount / pageSize);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: contacts,
            pagination: {
                page,
                pageSize,
                total: totalCount,
                totalPages
            }
        });
    } catch (error) {
        console.error("[v0] Error fetching contacts:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to load contacts"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8d7e0a08._.js.map