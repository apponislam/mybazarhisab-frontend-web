import { baseApi } from "../../api/baseApi";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TFeedbackCategory = "BUG" | "FEATURE_REQUEST" | "UI_UX" | "GENERAL";
export type TFeedbackStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";

export type TFeedback = {
    _id: string;
    user: { _id: string; name: string; email: string; phone?: string; profileImage?: string };
    category: TFeedbackCategory;
    subject: string;
    message: string;
    status: TFeedbackStatus;
    adminNote?: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
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

export type CreateFeedbackPayload = {
    category: TFeedbackCategory;
    subject: string;
    message: string;
};

export type FeedbackQueryParams = {
    page?: number;
    limit?: number;
};

export type UpdateFeedbackStatusPayload = {
    id: string;
    status: TFeedbackStatus;
    adminNote?: string;
};

// ── API ────────────────────────────────────────────────────────────────────────

const feedbackApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // POST /feedbacks
        createFeedback: builder.mutation<CommonResponse<TFeedback>, CreateFeedbackPayload>({
            query: (body) => ({
                url: "/feedbacks",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Feedback"],
        }),

        // GET /feedbacks
        getAllFeedbacks: builder.query<CommonResponse<TFeedback[]>, FeedbackQueryParams | void>({
            query: (params) => ({
                url: "/feedbacks",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Feedback"],
        }),

        // PATCH /feedbacks/:id/status (Admin)
        updateFeedbackStatus: builder.mutation<CommonResponse<TFeedback>, UpdateFeedbackStatusPayload>({
            query: ({ id, ...body }) => ({
                url: `/feedbacks/${id}/status`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Feedback"],
        }),

        // DELETE /feedbacks/:id
        deleteFeedback: builder.mutation<CommonResponse, string>({
            query: (id) => ({
                url: `/feedbacks/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Feedback"],
        }),
    }),
});

export const { useCreateFeedbackMutation, useGetAllFeedbacksQuery, useUpdateFeedbackStatusMutation, useDeleteFeedbackMutation } = feedbackApi;
