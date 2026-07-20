import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logOut, setUser, TUser } from "../features/auth/authSlice";

interface RefreshTokenResponse {
    data: {
        accessToken: string;
        user: TUser;
    };
}

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState)?.auth?.token;
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    console.log(result);

    const url = typeof args === "string" ? args : args?.url;
    const isPublicRoute = url ? url.includes("/auth/admin-login") || url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/forgot-password") || url.includes("/auth/reset-password") || url.includes("/auth/verify-email") : false;

    if ((result?.error?.status === 401 || result?.error?.status === 403) && !isPublicRoute) {
        // console.log("Access token expired. Attempting refresh...");

        const refreshResult = await baseQuery({ url: "/auth/refresh-token", method: "POST", credentials: "include" }, api, extraOptions);

        // console.log(refreshResult);

        if (refreshResult.data && typeof refreshResult.data === "object" && "data" in refreshResult.data) {
            const backendData = (refreshResult.data as RefreshTokenResponse).data;
            const user = backendData.user;
            const accessToken = backendData.accessToken;
            if (user && accessToken) {
                api.dispatch(setUser({ user, token: accessToken }));

                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logOut());
                return { error: { status: 401, data: "Session expired" } };
            }
        } else {
            api.dispatch(logOut());
            return { error: { status: 401, data: "Session expired" } };
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["User", "BoostPack", "Settings", "IdentityVerification", "Category", "Dashboard", "Order", "Activity", "Dispute", "Payment", "Report"],
    endpoints: () => ({}),
});
