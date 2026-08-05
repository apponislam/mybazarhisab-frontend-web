import { baseApi } from "../../api/baseApi";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TReview = {
    _id: string;
    user: { _id: string; name: string; email: string; phone?: string; profileImage?: string };
    rating: number;
    comment: string;
    isPublic: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};

export type TReviewSummary = {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Record<string, number>;
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

export type CreateReviewPayload = {
    rating: number;
    comment: string;
};

export type ReviewQueryParams = {
    page?: number;
    limit?: number;
};

export type TMyReviewResponse = {
    hasReviewed: boolean;
    canReview: boolean;
    review: TReview | null;
};

// ── API ────────────────────────────────────────────────────────────────────────

const reviewApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // POST /reviews
        createReview: builder.mutation<CommonResponse<TReview>, CreateReviewPayload>({
            query: (body) => ({
                url: "/reviews",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Review"],
        }),

        // GET /reviews/me (Authenticated user review)
        getMyReview: builder.query<CommonResponse<TMyReviewResponse>, void>({
            query: () => ({
                url: "/reviews/me",
                method: "GET",
            }),
            providesTags: ["Review"],
        }),

        // GET /reviews/summary (Public)
        getReviewSummaryStats: builder.query<CommonResponse<TReviewSummary>, void>({
            query: () => ({
                url: "/reviews/summary",
                method: "GET",
            }),
            providesTags: ["Review"],
        }),

        // GET /reviews (Public with optional auth)
        getAllReviews: builder.query<CommonResponse<TReview[]>, ReviewQueryParams | void>({
            query: (params) => ({
                url: "/reviews",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Review"],
        }),

        // PATCH /reviews/:id/toggle-public (Admin)
        toggleReviewVisibility: builder.mutation<CommonResponse<TReview>, string>({
            query: (id) => ({
                url: `/reviews/${id}/toggle-public`,
                method: "PATCH",
            }),
            invalidatesTags: ["Review"],
        }),

        // DELETE /reviews/:id
        deleteReview: builder.mutation<CommonResponse, string>({
            query: (id) => ({
                url: `/reviews/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Review"],
        }),
    }),
});

export const {
    useCreateReviewMutation,
    useGetMyReviewQuery,
    useGetReviewSummaryStatsQuery,
    useGetAllReviewsQuery,
    useToggleReviewVisibilityMutation,
    useDeleteReviewMutation,
} = reviewApi;
