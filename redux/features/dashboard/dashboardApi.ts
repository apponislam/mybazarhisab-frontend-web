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
    year?: number;
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

        // GET /dashboard/group-calendar
        getGroupCalendar: builder.query<CommonResponse<TGroupCalendarData>, GroupCalendarParams>({
            query: (params) => ({
                url: "/dashboard/group-calendar",
                method: "GET",
                params,
            }),
            providesTags: ["Dashboard"],
        }),
    }),
});

export type TGroupCalendarDay = {
    date: string;
    day: number;
    dayOfWeek: string;
    expense: number;
    bill: number;
    total: number;
};

export type TGroupCalendarSummary = {
    totalExpense: number;
    totalBill: number;
    grandTotal: number;
};

export type TGroupCalendarData = {
    year: number;
    month: number;
    monthName: string;
    daysInMonth: number;
    summary: TGroupCalendarSummary;
    days: TGroupCalendarDay[];
};

export type GroupCalendarParams = {
    year: number;
    month: number;
};

export const {
    useGetAdminDashboardStatsQuery,
    useGetAdminMonthlyAnalysisQuery,
    useGetUserDashboardStatsQuery,
    useGetMonthlyExpenseTrendQuery,
    useGetProductPriceGrowthTrendQuery,
    useGetGroupCalendarQuery,
} = dashboardApi;
