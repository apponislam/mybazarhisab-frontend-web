import { baseApi } from "../../api/baseApi";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TNotificationType = "BAZAR" | "BILL" | "GROUP" | "SYSTEM";

export type TNotificationSender = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
};

export type TNotification = {
    _id: string;
    sender: TNotificationSender;
    group: { _id: string; name: string };
    title: string;
    message: string;
    type: TNotificationType;
    isRead: boolean;
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

export type NotificationQueryParams = {
    page?: number;
    limit?: number;
};

// ── API ────────────────────────────────────────────────────────────────────────

const notificationApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // GET /notifications
        getMyNotifications: builder.query<CommonResponse<TNotification[]>, NotificationQueryParams | void>({
            query: (params) => ({
                url: "/notifications",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Notification"],
        }),

        // GET /notifications/unread-count
        getUnreadCount: builder.query<CommonResponse<{ count: number }>, void>({
            query: () => ({
                url: "/notifications/unread-count",
                method: "GET",
            }),
            providesTags: ["Notification"],
        }),

        // PATCH /notifications/read-all
        markAllAsRead: builder.mutation<CommonResponse, void>({
            query: () => ({
                url: "/notifications/read-all",
                method: "PATCH",
            }),
            invalidatesTags: ["Notification"],
        }),

        // PATCH /notifications/:id/read
        markAsRead: builder.mutation<CommonResponse<TNotification>, string>({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notification"],
        }),

        // DELETE /notifications
        deleteAllNotifications: builder.mutation<CommonResponse, void>({
            query: () => ({
                url: "/notifications",
                method: "DELETE",
            }),
            invalidatesTags: ["Notification"],
        }),

        // DELETE /notifications/:id
        deleteNotification: builder.mutation<CommonResponse, string>({
            query: (id) => ({
                url: `/notifications/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notification"],
        }),
    }),
});

export const { useGetMyNotificationsQuery, useGetUnreadCountQuery, useMarkAllAsReadMutation, useMarkAsReadMutation, useDeleteAllNotificationsMutation, useDeleteNotificationMutation } = notificationApi;
