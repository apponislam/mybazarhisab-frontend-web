import { baseApi } from "../../api/baseApi";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TDashboardMonthlyTrend = {
    label: string;
    bazarExpense: number;
    billExpense: number;
    totalExpense: number;
};

export type TProductPricePoint = {
    date: string;
    pricePerUnit: number;
    unit: string;
    notes?: string;
};

export type TMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};

type CommonResponse<T = null> = {
    success: boolean;
    message: string;
    data: T;
    meta?: TMeta;
};

export type MonthlyTrendParams = {
    view?: string; // "monthly" or default yearly
};

export type ProductPriceGrowthParams = {
    productId: string;
    page?: number;
    limit?: number;
};

export type StatementParams = {
    startDate?: string;
    endDate?: string;
    year?: string;
    format?: "html" | "pdf";
};

export type TAdminMonthlyAnalysisItem = {
    month: string;
    monthNumber: number;
    bazarEntriesCount: number;
    bazarExpense: number;
    billsCount: number;
    billExpense: number;
    totalExpense: number;
    usersRegistered: number;
    groupsCreated: number;
    productsCreated: number;
};

export type TAdminMonthlyAnalysisData = {
    year: number;
    analysis: TAdminMonthlyAnalysisItem[];
};

// ── API ────────────────────────────────────────────────────────────────────────

const dashboardApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // GET /dashboard/admin-stats (Admin)
        getAdminDashboardStats: builder.query<CommonResponse<any>, void>({
            query: () => ({
                url: "/dashboard/admin-stats",
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),

        // GET /dashboard/admin-monthly-analysis (Admin)
        getAdminMonthlyAnalysis: builder.query<CommonResponse<TAdminMonthlyAnalysisData>, { year?: number } | void>({
            query: (params) => ({
                url: "/dashboard/admin-monthly-analysis",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Dashboard"],
        }),

        // GET /dashboard/user-stats
        getUserDashboardStats: builder.query<CommonResponse<any>, void>({
            query: () => ({
                url: "/dashboard/user-stats",
                method: "GET",
            }),
            providesTags: ["Dashboard"],
        }),

        // GET /dashboard/monthly-trend
        getMonthlyExpenseTrend: builder.query<CommonResponse<TDashboardMonthlyTrend[]>, MonthlyTrendParams | void>({
            query: (params) => ({
                url: "/dashboard/monthly-trend",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Dashboard"],
        }),

        // GET /dashboard/product-price-growth/:productId
        getProductPriceGrowthTrend: builder.query<CommonResponse<TProductPricePoint[]>, ProductPriceGrowthParams>({
            query: ({ productId, ...params }) => ({
                url: `/dashboard/product-price-growth/${productId}`,
                method: "GET",
                params,
            }),
            providesTags: ["Dashboard"],
        }),
    }),
});

export const {
    useGetAdminDashboardStatsQuery,
    useGetAdminMonthlyAnalysisQuery,
    useGetUserDashboardStatsQuery,
    useGetMonthlyExpenseTrendQuery,
    useGetProductPriceGrowthTrendQuery,
} = dashboardApi;
