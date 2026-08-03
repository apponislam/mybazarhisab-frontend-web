import { baseApi } from "../../api/baseApi";
import { TUser } from "./authSlice";

type RefreshTokenResponse = {
    data: {
        refreshToken: string;
        accessToken: string;
        user: TUser;
    };
};

type ValidateReferralResponse = {
    success: boolean;
    message: string;
    data: {
        valid: boolean;
        referralCode: string;
        referrerName: string;
    };
};

type CommonResponse<T = null> = {
    success: boolean;
    message: string;
    data: T;
};

const authApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        login: builder.mutation<CommonResponse<{ user: TUser; accessToken: string }>, any>({
            query: (userInfo) => ({
                url: "/auth/login",
                method: "POST",
                body: userInfo,
            }),
        }),
        register: builder.mutation<CommonResponse<{ user: TUser; accessToken: string }>, any>({
            query: (userInfo) => ({
                url: "/auth/register",
                method: "POST",
                body: userInfo,
            }),
        }),
        refreshToken: builder.mutation<RefreshTokenResponse, void>({
            query: () => ({
                url: "/auth/refresh-token",
                method: "POST",
                credentials: "include",
            }),
        }),
        logout: builder.mutation<CommonResponse, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
                credentials: "include",
            }),
        }),
        validateReferralCode: builder.query<ValidateReferralResponse, string>({
            query: (code) => ({
                url: `/auth/referral/${code}`,
                method: "GET",
            }),
        }),
        // === Forgot password endpoints ===
        forgotPassword: builder.mutation<CommonResponse, { email: string }>({
            query: (body) => ({
                url: "/auth/forgot-password",
                method: "POST",
                body,
            }),
        }),
        verifyOtp: builder.mutation<CommonResponse<{ token: string }>, { email: string; otp: string }>({
            query: (body) => ({
                url: "/auth/verify-otp",
                method: "POST",
                body,
            }),
        }),
        resendOtp: builder.mutation<CommonResponse, { email: string }>({
            query: (body) => ({
                url: "/auth/resend-otp",
                method: "POST",
                body,
            }),
        }),
        resetPassword: builder.mutation<CommonResponse, { token?: string; newPassword: string }>({
            query: (body) => ({
                url: "/auth/reset-password",
                method: "POST",
                body,
            }),
        }),
        verifyEmail: builder.query<CommonResponse, { email: string; token?: string; otp?: string }>({
            query: ({ email, token, otp }) => ({
                url: `/auth/verify-email`,
                method: "GET",
                params: { email, token, otp },
            }),
        }),
        resendVerificationEmail: builder.mutation<CommonResponse, { email: string }>({
            query: (body) => ({
                url: "/auth/resend-verification",
                method: "POST",
                body,
            }),
        }),

        // === Profile & User Management ===
        getMe: builder.query<CommonResponse<TUser>, void>({
            query: () => ({
                url: "/auth/me",
                method: "GET",
                credentials: "include",
            }),
        }),
        updateProfile: builder.mutation<CommonResponse<TUser>, any>({
            query: (body) => ({
                url: "/auth/profile",
                method: "PATCH",
                body,
                credentials: "include",
            }),
        }),
        changePassword: builder.mutation<CommonResponse, { currentPassword: string; newPassword: string }>({
            query: (body) => ({
                url: "/auth/change-password",
                method: "POST",
                body,
                credentials: "include",
            }),
        }),
        updateEmail: builder.mutation<CommonResponse, { email: string; password?: string }>({
            query: (body) => ({
                url: "/auth/update-email",
                method: "POST",
                body,
                credentials: "include",
            }),
        }),
        verifyNewEmail: builder.query<CommonResponse, { email: string; token: string }>({
            query: ({ email, token }) => ({
                url: "/auth/verify-new-email",
                method: "GET",
                params: { email, token },
            }),
        }),
        resendEmailUpdate: builder.mutation<CommonResponse, { password?: string }>({
            query: (body) => ({
                url: "/auth/resend-email-update",
                method: "POST",
                body,
                credentials: "include",
            }),
        }),
        deleteAccount: builder.mutation<CommonResponse, void>({
            query: () => ({
                url: "/auth/me",
                method: "DELETE",
                credentials: "include",
            }),
        }),

        // === Admin Actions ===
        setUserPasswordByAdmin: builder.mutation<CommonResponse, { userId: string; password?: string }>({
            query: ({ userId, password }) => ({
                url: `/auth/set-password/${userId}`,
                method: "POST",
                body: { password },
                credentials: "include",
            }),
        }),
        deleteUserByAdmin: builder.mutation<CommonResponse, string>({
            query: (userId) => ({
                url: `/auth/${userId}`,
                method: "DELETE",
                credentials: "include",
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useRefreshTokenMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useResetPasswordMutation,
    useVerifyEmailQuery,
    useResendVerificationEmailMutation,
    useGetMeQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
    useUpdateEmailMutation,
    useVerifyNewEmailQuery,
    useResendEmailUpdateMutation,
    useDeleteAccountMutation,
    useSetUserPasswordByAdminMutation,
    useDeleteUserByAdminMutation,
    useValidateReferralCodeQuery,
} = authApi;
