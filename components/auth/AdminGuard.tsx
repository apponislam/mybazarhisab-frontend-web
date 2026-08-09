"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { currentUser, currentToken } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const user = useAppSelector(currentUser);
    const token = useAppSelector(currentToken);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!token || !user) {
            toast.error("Please log in to access the admin dashboard.");
            router.replace("/login?redirect=/dashboard");
            return;
        }

        if (user.role !== "ADMIN") {
            toast.error("Access Denied. Only administrators can access the dashboard.");
            router.replace("/web");
            return;
        }

        setIsAuthorized(true);
    }, [user, token, router]);

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-[#1a0e07] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
