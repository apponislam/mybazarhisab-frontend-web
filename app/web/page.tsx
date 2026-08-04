"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { GroupStats } from "@/types";
import { makeMockStats } from "@/lib/mockData";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { currentUser, currentToken, logOut } from "@/redux/features/auth/authSlice";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { useCheckGroupMembershipQuery, useGetMyGroupQuery } from "@/redux/features/group/groupApi";

// Import new dedicated web/desktop components
import { WebLandingPage } from "@/components/web/WebLandingPage";
import { WebAuthForms } from "@/components/web/WebAuthForms";
import { WebGroupPicker } from "@/components/web/WebGroupPicker";
import { WebAppShell } from "@/components/web/WebAppShell";

export default function WebPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    const dispatch = useAppDispatch();
    const [logoutMutation] = useLogoutMutation();

    // Redux Authentication State
    const user = useAppSelector(currentUser);
    const token = useAppSelector(currentToken);
    const isLoggedIn = Boolean(user && token);

    const [showLanding, setShowLanding] = useState(true);
    const [groupStats, setGroupStats] = useState<GroupStats | null>(null);

    // Check group membership from backend (only when logged in)
    const {
        data: groupCheckData,
        isLoading: isCheckingGroup,
        refetch: refetchGroupCheck,
    } = useCheckGroupMembershipQuery(undefined, {
        skip: !isLoggedIn,
    });
    const hasGroup = groupCheckData?.data === true;

    // Fetch user's group details if member
    const { data: myGroupData } = useGetMyGroupQuery(undefined, {
        skip: !isLoggedIn || !hasGroup,
    });

    useEffect(() => {
        if (hasGroup) {
            const groupName = myGroupData?.data?.name || groupStats?.groupName || "My Bazar Group";
            setGroupStats(makeMockStats(groupName));
        }
    }, [hasGroup, myGroupData]);

    // Handle responsiveness dynamically with routing redirects
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                router.replace("/app");
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [router]);

    // Loading state while checking browser window width
    if (isMobile === null) {
        return (
            <div className="min-h-screen bg-[#1a0e07] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    // If mobile, show a loading screen during the redirection transition
    if (isMobile) {
        return (
            <div className="min-h-screen bg-[#1a0e07] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    // 1. Unauthenticated Login/Register/Landing Screen
    if (!isLoggedIn) {
        if (showLanding) {
            return (
                <AnimatePresence mode="wait">
                    <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="size-full">
                        <WebLandingPage onSignIn={() => setShowLanding(false)} />
                    </motion.div>
                </AnimatePresence>
            );
        }

        return (
            <AnimatePresence mode="wait">
                <motion.div key="auth-desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="size-full">
                    <WebAuthForms onLogin={() => {}} onBack={() => setShowLanding(true)} />
                </motion.div>
            </AnimatePresence>
        );
    }

    // Show loading spinner while checking group membership
    if (isCheckingGroup) {
        return (
            <div className="min-h-screen bg-[#1a0e07] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    // 2. Group Picker Screen (Join/Create) — shown when user has no group
    if (!hasGroup) {
        return (
            <AnimatePresence mode="wait">
                <motion.div key="group-desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="size-full">
                    <WebGroupPicker
                        onGroupReady={(s) => {
                            if (s) setGroupStats(s);
                            refetchGroupCheck();
                        }}
                        onLogout={() => {
                            setShowLanding(true);
                        }}
                    />
                </motion.div>
            </AnimatePresence>
        );
    }

    // 3. Authenticated Main Shell Routing (Responsive Dashboard vs Tab Shell)
    return (
        <AnimatePresence mode="wait">
            <motion.div key="app-desktop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="size-full">
                <WebAppShell
                    stats={groupStats || makeMockStats("My Bazar Group")}
                    onLogout={async () => {
                        try {
                            await logoutMutation().unwrap();
                        } catch (err) {
                            // ignore
                        }
                        dispatch(logOut());
                        setShowLanding(true); // Return to landing page on logout
                    }}
                />
            </motion.div>
        </AnimatePresence>
    );
}
