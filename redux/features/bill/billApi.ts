import { baseApi } from "../../api/baseApi";

// ── Types ──────────────────────────────────────────────────────────────────────

export type BillCategory = "RENT" | "TRAVEL" | "WIFI" | "ELECTRICITY" | "GAS" | "WATER" | "MAID" | "MAINTENANCE" | "SUBSCRIPTION" | "MOBILE" | "MEDICAL" | "EDUCATION" | "SHOPPING" | "ENTERTAINMENT" | "LAUNDRY" | "LOAN_EMI" | "SALON_GROOMING" | "GIFTS_FESTIVALS" | "UTILITIES" | "OTHERS";

export type TBillUser = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
};

export type TBillGroup = {
    _id: string;
    name: string;
    creator: string;
};

export type TBill = {
    _id: string;
    user: TBillUser;
    group?: TBillGroup;
    category: BillCategory;
    title: string;
    amount: number;
    date: string;
    notes?: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};

export type TBillMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalAmount?: number;
    hasNext: boolean;
    hasPrev: boolean;
};

type CommonResponse<T = null> = {
    success: boolean;
    message: string;
    data: T;
    meta?: TBillMeta;
};

// ── Query Param Types ──────────────────────────────────────────────────────────

export type BillQueryParams = {
    category?: BillCategory;
    filter?: string;
    searchTerm?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
};

export type BillAdminQueryParams = BillQueryParams & {
    searchTerm?: string;
};

export type BillStatsParams = {
    category?: BillCategory;
    filter?: string;
    startDate?: string;
    endDate?: string;
};

export type CreateBillPayload = {
    category: BillCategory;
    title: string;
    amount: number;
    date?: string;
    notes?: string;
};

// ── API ────────────────────────────────────────────────────────────────────────

const billApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // POST /bills
        createBill: builder.mutation<CommonResponse<TBill>, CreateBillPayload>({
            query: (body) => ({
                url: "/bills",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Bill", "BillStats"],
        }),

        // POST /bills/bulk
        createBulkBills: builder.mutation<CommonResponse<{ count: number; bills: TBill[] }>, { bills: CreateBillPayload[] }>({
            query: (body) => ({
                url: "/bills/bulk",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Bill", "BillStats"],
        }),

        // GET /bills
        getAllBills: builder.query<CommonResponse<TBill[]>, BillQueryParams | void>({
            query: (params) => ({
                url: "/bills",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Bill"],
        }),

        // GET /bills/stats
        getBillStats: builder.query<CommonResponse<{ totalEntries: number; totalAmount: number }>, BillStatsParams | void>({
            query: (params) => ({
                url: "/bills/stats",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["BillStats"],
        }),

        // GET /bills/:id
        getBillById: builder.query<CommonResponse<TBill>, string>({
            query: (id) => ({
                url: `/bills/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Bill", id }],
        }),

        // PATCH /bills/:id
        updateBill: builder.mutation<CommonResponse<TBill>, { id: string; data: Partial<CreateBillPayload> }>({
            query: ({ id, data }) => ({
                url: `/bills/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Bill", "BillStats"],
        }),

        // DELETE /bills/:id
        deleteBill: builder.mutation<CommonResponse<TBill>, string>({
            query: (id) => ({
                url: `/bills/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Bill", "BillStats"],
        }),

        // ── Admin Routes ───────────────────────────────────────────────────────

        // GET /bills/admin
        getAllBillsByAdmin: builder.query<CommonResponse<TBill[]>, BillAdminQueryParams | void>({
            query: (params) => ({
                url: "/bills/admin",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Bill"],
        }),

        // GET /bills/admin/:id
        getBillByIdByAdmin: builder.query<CommonResponse<TBill>, string>({
            query: (id) => ({
                url: `/bills/admin/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Bill", id }],
        }),
    }),
});

export const { useCreateBillMutation, useCreateBulkBillsMutation, useGetAllBillsQuery, useGetBillStatsQuery, useGetBillByIdQuery, useUpdateBillMutation, useDeleteBillMutation, useGetAllBillsByAdminQuery, useGetBillByIdByAdminQuery } = billApi;
