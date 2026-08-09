"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { WebAuthForms } from "@/components/web/WebAuthForms";
import { AuthForms } from "@/components/app/screens/AuthForms";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";

export default function LoginPage() {
    const router = useRouter();
    const user = useAppSelector(currentUser);
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/dashboard";

    useEffect(() => {
        if (user) {
            router.replace(redirectUrl);
        }
    }, [user, router, redirectUrl]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleLoginSuccess = () => {
        router.push(redirectUrl);
    };

    const handleBackHome = () => {
        router.push("/");
    };

    if (isMobile === null) {
        return (
            <div className="min-h-screen bg-[#1a0e07] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    if (isMobile) {
        return <AuthForms onLogin={handleLoginSuccess} />;
    }

    return <WebAuthForms onLogin={handleLoginSuccess} onBack={handleBackHome} />;
}
