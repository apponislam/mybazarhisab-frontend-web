import { baseApi } from "@/redux/api/baseApi";
import { TUser } from "@/redux/features/auth/authSlice";

export type UserQueryParams = {
    page?: number;
    limit?: number;
    searchTerm?: string;
    role?: string;
    isActive?: boolean;
};

export type UserSubResourceQueryParams = {
    userId: string;
    page?: number;
    limit?: number;
};

export type UserMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};

export type UserSummaryStats = {
    totalReviews: number;
    totalActivities: number;
    totalProducts: number;
    totalBazarEntries: number;
    totalBills: number;
    totalBazarSpent: number;
    totalBillSpent: number;
    totalOverallSpent: number;
};

export type GroupStats = {
    totalMembers: number;
    totalBazarEntries: number;
    totalBills: number;
    totalBazarSpent: number;
    totalBillSpent: number;
    totalOverallSpent: number;
};

export type UserProfileSummaryResponse = {
    user: TUser;
    stats: UserSummaryStats;
    groupStats?: GroupStats;
};

type CommonResponse<T> = {
    success: boolean;
    message: string;
    data: T;
    meta?: UserMeta;
};

const userApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // 1. GET /users (Admin list users with search, role, status filters, pagination)
        getAllUsers: builder.query<CommonResponse<TUser[]>, UserQueryParams | void>({
            query: (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    if (params.page) queryParams.append("page", String(params.page));
                    if (params.limit) queryParams.append("limit", String(params.limit));
                    if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
                    if (params.role) queryParams.append("role", params.role);
                    if (params.isActive !== undefined) queryParams.append("isActive", String(params.isActive));
                }
                const queryString = queryParams.toString();
                return {
                    url: `/users${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                    credentials: "include",
                };
            },
            providesTags: ["User"],
        }),

        // 2. GET /users/:id (Admin get profile & full activity stats summary)
        getUserProfileAndSummary: builder.query<CommonResponse<UserProfileSummaryResponse>, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["User"],
        }),

        // 3. GET /users/:id/reviews (Admin get user reviews)
        getUserReviews: builder.query<CommonResponse<any[]>, UserSubResourceQueryParams>({
            query: ({ userId, page = 1, limit = 10 }) => ({
                url: `/users/${userId}/reviews?page=${page}&limit=${limit}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["User", "Review"],
        }),

        // 4. GET /users/:id/activities (Admin get user audit activities)
        getUserActivities: builder.query<CommonResponse<any[]>, UserSubResourceQueryParams>({
            query: ({ userId, page = 1, limit = 10 }) => ({
                url: `/users/${userId}/activities?page=${page}&limit=${limit}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["User", "Activity"],
        }),

        // 5. GET /users/:id/products (Admin get user products created)
        getUserProducts: builder.query<CommonResponse<any[]>, UserSubResourceQueryParams>({
            query: ({ userId, page = 1, limit = 10 }) => ({
                url: `/users/${userId}/products?page=${page}&limit=${limit}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["User", "Product"],
        }),

        // 6. GET /users/:id/bazar-entries (Admin get user bazar expense entries)
        getUserBazarEntries: builder.query<CommonResponse<any[]>, UserSubResourceQueryParams>({
            query: ({ userId, page = 1, limit = 10 }) => ({
                url: `/users/${userId}/bazar-entries?page=${page}&limit=${limit}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["User", "BazarEntry"],
        }),

        // 7. GET /users/:id/bills (Admin get user bills)
        getUserBills: builder.query<CommonResponse<any[]>, UserSubResourceQueryParams>({
            query: ({ userId, page = 1, limit = 10 }) => ({
                url: `/users/${userId}/bills?page=${page}&limit=${limit}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["User", "Bill"],
        }),

        // 8. PATCH /users/:id/status (Admin toggle user active/suspended state)
        updateUserStatus: builder.mutation<CommonResponse<TUser>, { id: string; isActive: boolean }>({
            query: ({ id, isActive }) => ({
                url: `/users/${id}/status`,
                method: "PATCH",
                body: { isActive },
                credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),

        // 9. PATCH /users/:id/role (Admin toggle role ADMIN vs USER)
        updateUserRole: builder.mutation<CommonResponse<TUser>, { id: string; role: "ADMIN" | "USER" }>({
            query: ({ id, role }) => ({
                url: `/users/${id}/role`,
                method: "PATCH",
                body: { role },
                credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),

        // 10. DELETE /users/:id (Admin delete user)
        deleteUser: builder.mutation<CommonResponse<{ message: string }>, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetUserProfileAndSummaryQuery,
    useGetUserReviewsQuery,
    useGetUserActivitiesQuery,
    useGetUserProductsQuery,
    useGetUserBazarEntriesQuery,
    useGetUserBillsQuery,
    useUpdateUserStatusMutation,
    useUpdateUserRoleMutation,
    useDeleteUserMutation,
} = userApi;
