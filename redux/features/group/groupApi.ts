import { baseApi } from "../../api/baseApi";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TGroupMember = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: string;
};

export type TGroup = {
    _id: string;
    name: string;
    creator: string | TGroupMember;
    members: TGroupMember[];
    inviteCode: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
};

type CommonResponse<T = null> = {
    success: boolean;
    message: string;
    data: T;
};

// ── API ────────────────────────────────────────────────────────────────────────

const groupApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // POST /groups
        createGroup: builder.mutation<CommonResponse<TGroup>, { name: string }>({
            query: (body) => ({
                url: "/groups",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Group"],
        }),

        // POST /groups/join
        joinGroup: builder.mutation<CommonResponse<TGroup>, { inviteCode: string }>({
            query: (body) => ({
                url: "/groups/join",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Group"],
        }),

        // POST /groups/leave
        leaveGroup: builder.mutation<CommonResponse, void>({
            query: () => ({
                url: "/groups/leave",
                method: "POST",
            }),
            invalidatesTags: ["Group"],
        }),

        // PATCH /groups
        updateGroup: builder.mutation<CommonResponse<TGroup>, { name: string }>({
            query: (body) => ({
                url: "/groups",
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Group"],
        }),

        // POST /groups/generate-code
        generateInviteCode: builder.mutation<CommonResponse<TGroup>, void>({
            query: () => ({
                url: "/groups/generate-code",
                method: "POST",
            }),
            invalidatesTags: ["Group"],
        }),

        // GET /groups/my-group
        getMyGroup: builder.query<CommonResponse<TGroup | null>, void>({
            query: () => ({
                url: "/groups/my-group",
                method: "GET",
            }),
            providesTags: ["Group"],
        }),

        // GET /groups/check-group
        checkGroupMembership: builder.query<CommonResponse<boolean>, void>({
            query: () => ({
                url: "/groups/check-group",
                method: "GET",
            }),
            providesTags: ["Group"],
        }),
    }),
});

export const { useCreateGroupMutation, useJoinGroupMutation, useLeaveGroupMutation, useUpdateGroupMutation, useGenerateInviteCodeMutation, useGetMyGroupQuery, useCheckGroupMembershipQuery } = groupApi;
