import { baseApi } from "../../api/baseApi";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TContact = {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
    isReplied: boolean;
    replyMessage?: string;
    repliedBy?: string;
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

export type SubmitContactPayload = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

export type ContactQueryParams = {
    page?: number;
    limit?: number;
};

// ── API ────────────────────────────────────────────────────────────────────────

const contactApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // POST /contacts (Public)
        submitMessage: builder.mutation<CommonResponse<TContact>, SubmitContactPayload>({
            query: (body) => ({
                url: "/contacts",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Contact"],
        }),

        // GET /contacts (Admin)
        getAllMessages: builder.query<CommonResponse<TContact[]>, ContactQueryParams | void>({
            query: (params) => ({
                url: "/contacts",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Contact"],
        }),

        // GET /contacts/:id (Admin)
        getMessageById: builder.query<CommonResponse<TContact>, string>({
            query: (id) => ({
                url: `/contacts/${id}`,
                method: "GET",
            }),
            providesTags: (_result, _error, id) => [{ type: "Contact", id }],
        }),

        // PATCH /contacts/:id/reply (Admin)
        replyToMessage: builder.mutation<CommonResponse<TContact>, { id: string; replyMessage: string }>({
            query: ({ id, replyMessage }) => ({
                url: `/contacts/${id}/reply`,
                method: "PATCH",
                body: { replyMessage },
            }),
            invalidatesTags: ["Contact"],
        }),

        // DELETE /contacts/:id (Admin)
        deleteMessage: builder.mutation<CommonResponse, string>({
            query: (id) => ({
                url: `/contacts/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Contact"],
        }),
    }),
});

export const { useSubmitMessageMutation, useGetAllMessagesQuery, useGetMessageByIdQuery, useReplyToMessageMutation, useDeleteMessageMutation } = contactApi;
