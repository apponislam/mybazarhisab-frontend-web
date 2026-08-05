import { baseApi } from "../../api/baseApi";

// ── Types ──────────────────────────────────────────────────────────────────────

export type VisitorPlatform = "WEB" | "ANDROID" | "IOS" | "APP";

type CommonResponse<T = null> = {
    success: boolean;
    message: string;
    data: T;
};

type PaginatedResponse<T = any> = {
    success: boolean;
    message: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    data: T;
};

export type TrackVisitPayload = {
    path?: string;
    platform?: VisitorPlatform;
    userId?: string;
};

export type VisitorStatsParams = {
    days?: number;
};

// ── API ────────────────────────────────────────────────────────────────────────

const visitorApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // POST /visitors/track (Public)
        trackVisit: builder.mutation<CommonResponse, TrackVisitPayload | void>({
            query: (body) => ({
                url: "/visitors/track",
                method: "POST",
                body: body || {},
            }),
        }),

        // GET /visitors/stats (Admin)
        getVisitorStats: builder.query<CommonResponse<any>, VisitorStatsParams | void>({
            query: (params) => ({
                url: "/visitors/stats",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Visitor"],
        }),

        // GET /visitors/all (Admin)
        getAllVisitors: builder.query<PaginatedResponse<any>, Record<string, any> | void>({
            query: (params) => ({
                url: "/visitors/all",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Visitor"],
        }),
    }),
});

export const { useTrackVisitMutation, useGetVisitorStatsQuery, useGetAllVisitorsQuery } = visitorApi;
