import { baseApi } from "../../api/baseApi";

// ── Types ──────────────────────────────────────────────────────────────────────

export type ActivityType = "REGISTER" | "LOGIN" | "EMAIL_VERIFY" | "PASSWORD_RESET" | "PROFILE_UPDATE" | "PASSWORD_CHANGE" | "EMAIL_UPDATE" | "USER_DELETE" | "CREATE_PRODUCT" | "UPDATE_PRODUCT" | "DELETE_PRODUCT" | "MERGE_PRODUCTS" | "CREATE_BAZAR_ENTRY" | "UPDATE_BAZAR_ENTRY" | "DELETE_BAZAR_ENTRY" | "CREATE_GROUP" | "JOIN_GROUP" | "LEAVE_GROUP" | "UPDATE_GROUP" | "CREATE_BILL" | "UPDATE_BILL" | "DELETE_BILL";

export type TActivity = {
    _id: string;
    user: { _id: string; name: string; email: string; phone?: string; profileImage?: string };
    group?: { _id: string; name: string };
    action: ActivityType;
    details: string;
    metadata?: Record<string, any>;
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

export type ActivityQueryParams = {
    page?: number;
    limit?: number;
    action?: string;
    type?: string;
    userId?: string;
    groupId?: string;
    startDate?: string;
    endDate?: string;
};

export type ClearActivitiesParams = {
    userId?: string;
    groupId?: string;
    action?: string;
    type?: string;
};

// ── API ────────────────────────────────────────────────────────────────────────

const activityApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // GET /activities (Admin)
        getAllActivities: builder.query<CommonResponse<TActivity[]>, ActivityQueryParams | void>({
            query: (params) => ({
                url: "/activities",
                method: "GET",
                params: params || undefined,
            }),
            providesTags: ["Activity"],
        }),

        // DELETE /activities (Admin) — clear all
        clearActivities: builder.mutation<CommonResponse, ClearActivitiesParams | void>({
            query: (params) => ({
                url: "/activities",
                method: "DELETE",
                params: params || undefined,
            }),
            invalidatesTags: ["Activity"],
        }),

        // DELETE /activities/:id (Admin)
        deleteActivity: builder.mutation<CommonResponse, string>({
            query: (id) => ({
                url: `/activities/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Activity"],
        }),
    }),
});

export const { useGetAllActivitiesQuery, useClearActivitiesMutation, useDeleteActivityMutation } = activityApi;
