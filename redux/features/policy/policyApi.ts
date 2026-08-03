import { baseApi } from "../../api/baseApi";

// ── Types ──────────────────────────────────────────────────────────────────────

export type TPolicyType = "terms" | "privacy";

export type TPolicy = {
    _id: string;
    title: string;
    type: TPolicyType;
    content: string;
    version?: string;
    isPublished: boolean;
    updatedBy?: string;
    createdAt: string;
    updatedAt: string;
};

type CommonResponse<T = null> = {
    success: boolean;
    message: string;
    data: T;
};

export type UpsertPolicyPayload = {
    title: string;
    content: string;
    version?: string;
    isPublished?: boolean;
};

// ── API ────────────────────────────────────────────────────────────────────────

const policyApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // GET /policies (Public)
        getAllPolicies: builder.query<CommonResponse<TPolicy[]>, void>({
            query: () => ({
                url: "/policies",
                method: "GET",
            }),
            providesTags: ["Policy"],
        }),

        // GET /policies/:type (Public)
        getPolicyByType: builder.query<CommonResponse<TPolicy>, TPolicyType>({
            query: (type) => ({
                url: `/policies/${type}`,
                method: "GET",
            }),
            providesTags: (_result, _error, type) => [{ type: "Policy", id: type }],
        }),

        // PUT /policies/:type (Admin)
        upsertPolicy: builder.mutation<CommonResponse<TPolicy>, { type: TPolicyType; data: UpsertPolicyPayload }>({
            query: ({ type, data }) => ({
                url: `/policies/${type}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Policy"],
        }),
    }),
});

export const { useGetAllPoliciesQuery, useGetPolicyByTypeQuery, useUpsertPolicyMutation } = policyApi;
