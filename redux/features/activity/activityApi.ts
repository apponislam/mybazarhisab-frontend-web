import { baseApi } from "@/redux/api/baseApi";

export type TActivityUser = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
};

export type TActivityGroup = {
    _id: string;
    name: string;
    creator?: string;
};

export type TActivity = {
    _id: string;
    user?: TActivityUser | string;
    group?: TActivityGroup | string;
    action: string;
    details: string;
    metadata?: Record<string, any>;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};

export type ActivityQueryParams = {
    page?: number;
    limit?: number;
    type?: string;
    action?: string;
    userId?: string;
    groupId?: string;
    startDate?: string;
    endDate?: string;
};

export type ActivityMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};

type CommonResponse<T> = {
    success: boolean;
    message: string;
    data: T;
    meta?: ActivityMeta;
};

const activityApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // GET /activities (Admin)
        getAllActivities: builder.query<CommonResponse<TActivity[]>, ActivityQueryParams | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    if (params.page) queryParams.append("page", String(params.page));
                    if (params.limit) queryParams.append("limit", String(params.limit));
                    if (params.type) queryParams.append("type", params.type);
                    if (params.action) queryParams.append("action", params.action);
                    if (params.userId) queryParams.append("userId", params.userId);
                    if (params.groupId) queryParams.append("groupId", params.groupId);
                    if (params.startDate) queryParams.append("startDate", params.startDate);
                    if (params.endDate) queryParams.append("endDate", params.endDate);
                }
                const queryString = queryParams.toString();
                return {
                    url: `/activities${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["Activity"],
        }),

        // DELETE /activities/:id (Admin)
        deleteActivity: builder.mutation<CommonResponse<TActivity>, string>({
            query: (id) => ({
                url: `/activities/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Activity"],
        }),

        // DELETE /activities (Admin - Clear activities with optional filters)
        clearActivities: builder.mutation<CommonResponse<{ message: string; count: number }>, ActivityQueryParams | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    if (params.type) queryParams.append("type", params.type);
                    if (params.action) queryParams.append("action", params.action);
                    if (params.userId) queryParams.append("userId", params.userId);
                    if (params.groupId) queryParams.append("groupId", params.groupId);
                    if (params.startDate) queryParams.append("startDate", params.startDate);
                    if (params.endDate) queryParams.append("endDate", params.endDate);
                }
                const queryString = queryParams.toString();
                return {
                    url: `/activities${queryString ? `?${queryString}` : ""}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["Activity"],
        }),
    }),
});

export const {
    useGetAllActivitiesQuery,
    useDeleteActivityMutation,
    useClearActivitiesMutation,
} = activityApi;
