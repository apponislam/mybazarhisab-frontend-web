import { baseApi } from "../../api/baseApi";

// ── Types ──────────────────────────────────────────────────────────────────────

export type BazarUnit = "KG" | "PIECE" | "GM";

export type TProduct = {
    _id: string;
    name: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};

export type TBazarEntryUser = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
};

export type TBazarEntryGroup = {
    _id: string;
    name: string;
    creator: string;
};

export type TBazarEntry = {
    _id: string;
    product: TProduct;
    price: number;
    quantity: number;
    unit?: BazarUnit;
    date: string;
    notes?: string;
    user: TBazarEntryUser;
    group?: TBazarEntryGroup;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};

export type TMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalCost?: number;
    hasNext: boolean;
    hasPrev: boolean;
};

type CommonResponse<T = null> = {
    success: boolean;
    message: string;
    data: T;
    meta?: TMeta;
};

// ── Query Param Types ──────────────────────────────────────────────────────────

export type BazarEntryQueryParams = {
    filter?: string;
    searchTerm?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
};

export type BazarEntryAdminQueryParams = BazarEntryQueryParams & {
    searchTerm?: string;
};

export type BazarEntryStatsParams = {
    filter?: string;
    startDate?: string;
    endDate?: string;
};

export type CreateBazarEntryPayload = {
    productId?: string;
    name: string;
    price: number;
    quantity?: number;
    unit?: BazarUnit;
    notes?: string;
    date?: string;
};

// ── API ────────────────────────────────────────────────────────────────────────

const bazarEntryApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // POST /bazar-entries
        createBazarEntry: builder.mutation<CommonResponse<TBazarEntry>, CreateBazarEntryPayload>({
            query: (body) => ({
                url: "/bazar-entries",
                method: "POST",
                body,
            }),
            invalidatesTags: ["BazarEntry", "BazarEntryStats"],
        }),

        // POST /bazar-entries/bulk
        createBulkBazarEntries: builder.mutation<CommonResponse<{ count: number; entries: TBazarEntry[] }>, { entries: CreateBazarEntryPayload[] }>({
            query: (body) => ({
                url: "/bazar-entries/bulk",
                method: "POST",
                body,
            }),
            invalidatesTags: ["BazarEntry", "BazarEntryStats"],
        }),

        // GET /bazar-entries
        getAllBazarEntries: builder.query<CommonResponse<TBazarEntry[]>, BazarEntryQueryParams | void>({
            query: (params) => ({
                url: "/bazar-entries",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["BazarEntry"],
        }),

        // GET /bazar-entries/stats
        getBazarEntryStats: builder.query<CommonResponse<{ totalEntries: number; totalAmount: number }>, BazarEntryStatsParams | void>({
            query: (params) => ({
                url: "/bazar-entries/stats",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["BazarEntryStats"],
        }),

        // GET /bazar-entries/:id
        getBazarEntryById: builder.query<CommonResponse<TBazarEntry>, string>({
            query: (id) => ({
                url: `/bazar-entries/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "BazarEntry", id }],
        }),

        // PATCH /bazar-entries/:id
        updateBazarEntry: builder.mutation<CommonResponse<TBazarEntry>, { id: string; data: Partial<CreateBazarEntryPayload> }>({
            query: ({ id, data }) => ({
                url: `/bazar-entries/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["BazarEntry", "BazarEntryStats"],
        }),

        // DELETE /bazar-entries/:id
        deleteBazarEntry: builder.mutation<CommonResponse<TBazarEntry>, string>({
            query: (id) => ({
                url: `/bazar-entries/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["BazarEntry", "BazarEntryStats"],
        }),

        // ── Admin Routes ───────────────────────────────────────────────────────

        // GET /bazar-entries/admin
        getAllBazarEntriesByAdmin: builder.query<CommonResponse<TBazarEntry[]>, BazarEntryAdminQueryParams | void>({
            query: (params) => ({
                url: "/bazar-entries/admin",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["BazarEntry"],
        }),

        // GET /bazar-entries/admin/:id
        getBazarEntryByIdByAdmin: builder.query<CommonResponse<TBazarEntry>, string>({
            query: (id) => ({
                url: `/bazar-entries/admin/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "BazarEntry", id }],
        }),
    }),
});

export const { useCreateBazarEntryMutation, useCreateBulkBazarEntriesMutation, useGetAllBazarEntriesQuery, useGetBazarEntryStatsQuery, useGetBazarEntryByIdQuery, useUpdateBazarEntryMutation, useDeleteBazarEntryMutation, useGetAllBazarEntriesByAdminQuery, useGetBazarEntryByIdByAdminQuery } =
    bazarEntryApi;
