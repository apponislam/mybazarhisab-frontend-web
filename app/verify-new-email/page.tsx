"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyNewEmailQuery } from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function VerifyNewEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";

    const { data, error } = useVerifyNewEmailQuery(
        { email, token },
        { skip: !email || !token }
    );

    useEffect(() => {
        if (!token || !email) {
            toast.error("Invalid verification link.");
            router.replace("/login");
            return;
        }

        if (data?.success) {
            toast.success(data.message || "New email verified successfully!");
            router.replace("/login");
        } else if (error) {
            const errMsg = (error as any)?.data?.message || "Email update verification failed.";
            toast.error(errMsg);
            router.replace("/login");
        }
    }, [data, error, token, email, router]);

    return (
        <div className="min-h-screen bg-[#120a05] text-slate-100 flex flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm font-medium text-slate-300 font-mono">Confirming new email address...</p>
            </div>
        </div>
    );
}

export default function VerifyNewEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#120a05] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            }
        >
            <VerifyNewEmailContent />
        </Suspense>
    );
}
