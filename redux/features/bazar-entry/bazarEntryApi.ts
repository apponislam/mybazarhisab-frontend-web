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
        // POST /bazar-entry
        createBazarEntry: builder.mutation<CommonResponse<TBazarEntry>, CreateBazarEntryPayload>({
            query: (body) => ({
                url: "/bazar-entry",
                method: "POST",
                body,
            }),
            invalidatesTags: ["BazarEntry", "BazarEntryStats"],
        }),

        // POST /bazar-entry/bulk
        createBulkBazarEntries: builder.mutation<
            CommonResponse<{ count: number; entries: TBazarEntry[] }>,
            { entries: CreateBazarEntryPayload[] }
        >({
            query: (body) => ({
                url: "/bazar-entry/bulk",
                method: "POST",
                body,
            }),
            invalidatesTags: ["BazarEntry", "BazarEntryStats"],
        }),

        // GET /bazar-entry
        getAllBazarEntries: builder.query<CommonResponse<TBazarEntry[]>, BazarEntryQueryParams | void>({
            query: (params) => ({
                url: "/bazar-entry",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["BazarEntry"],
        }),

        // GET /bazar-entry/stats
        getBazarEntryStats: builder.query<
            CommonResponse<{ totalEntries: number; totalAmount: number }>,
            BazarEntryStatsParams | void
        >({
            query: (params) => ({
                url: "/bazar-entry/stats",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["BazarEntryStats"],
        }),

        // GET /bazar-entry/:id
        getBazarEntryById: builder.query<CommonResponse<TBazarEntry>, string>({
            query: (id) => ({
                url: `/bazar-entry/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "BazarEntry", id }],
        }),

        // PATCH /bazar-entry/:id
        updateBazarEntry: builder.mutation<CommonResponse<TBazarEntry>, { id: string; data: Partial<CreateBazarEntryPayload> }>({
            query: ({ id, data }) => ({
                url: `/bazar-entry/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["BazarEntry", "BazarEntryStats"],
        }),

        // DELETE /bazar-entry/:id
        deleteBazarEntry: builder.mutation<CommonResponse<TBazarEntry>, string>({
            query: (id) => ({
                url: `/bazar-entry/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["BazarEntry", "BazarEntryStats"],
        }),

        // ── Admin Routes ───────────────────────────────────────────────────────

        // GET /bazar-entry/admin
        getAllBazarEntriesByAdmin: builder.query<CommonResponse<TBazarEntry[]>, BazarEntryAdminQueryParams | void>({
            query: (params) => ({
                url: "/bazar-entry/admin",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["BazarEntry"],
        }),

        // GET /bazar-entry/admin/:id
        getBazarEntryByIdByAdmin: builder.query<CommonResponse<TBazarEntry>, string>({
            query: (id) => ({
                url: `/bazar-entry/admin/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "BazarEntry", id }],
        }),
    }),
});

export const {
    useCreateBazarEntryMutation,
    useCreateBulkBazarEntriesMutation,
    useGetAllBazarEntriesQuery,
    useGetBazarEntryStatsQuery,
    useGetBazarEntryByIdQuery,
    useUpdateBazarEntryMutation,
    useDeleteBazarEntryMutation,
    useGetAllBazarEntriesByAdminQuery,
    useGetBazarEntryByIdByAdminQuery,
} = bazarEntryApi;
