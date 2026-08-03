import { baseApi } from "../../api/baseApi";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TFaq = {
    _id: string;
    question: string;
    answer: string;
    category?: string;
    orderIndex?: number;
    isPublished?: boolean;
    isDeleted?: boolean;
    createdAt: string;
    updatedAt: string;
};

type CommonResponse<T = null> = {
    success: boolean;
    message: string;
    data: T;
};

export type CreateFaqPayload = {
    question: string;
    answer: string;
    category?: string;
    orderIndex?: number;
    isPublished?: boolean;
};

export type FaqQueryParams = {
    category?: string;
};

// ── API ────────────────────────────────────────────────────────────────────────

const faqApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // GET /faqs (Public with optional auth)
        getAllFaqs: builder.query<CommonResponse<TFaq[]>, FaqQueryParams | void>({
            query: (params) => ({
                url: "/faqs",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Faq"],
        }),

        // POST /faqs (Admin)
        createFaq: builder.mutation<CommonResponse<TFaq>, CreateFaqPayload>({
            query: (body) => ({
                url: "/faqs",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Faq"],
        }),

        // PATCH /faqs/:id (Admin)
        updateFaq: builder.mutation<CommonResponse<TFaq>, { id: string; data: Partial<CreateFaqPayload> }>({
            query: ({ id, data }) => ({
                url: `/faqs/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Faq"],
        }),

        // DELETE /faqs/:id (Admin)
        deleteFaq: builder.mutation<CommonResponse, string>({
            query: (id) => ({
                url: `/faqs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Faq"],
        }),
    }),
});

export const { useGetAllFaqsQuery, useCreateFaqMutation, useUpdateFaqMutation, useDeleteFaqMutation } = faqApi;
