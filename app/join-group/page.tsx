"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useJoinGroupMutation } from "@/redux/features/group/groupApi";
import { toast } from "sonner";
import { Users, Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

function JoinGroupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code") || "";
    const user = useAppSelector(currentUser);
    const [joinGroup] = useJoinGroupMutation();

    const [status, setStatus] = useState<"checking" | "joining" | "success" | "error">("checking");
    const [errorMessage, setErrorMessage] = useState("");
    const [groupName, setGroupName] = useState("");
    const hasAttemptedRef = useRef(false);

    useEffect(() => {
        if (!code) {
            setStatus("error");
            setErrorMessage("No invitation code provided in the link.");
            return;
        }

        if (!user) {
            // Redirect unauthenticated user to login with return redirect target
            const redirectTarget = `/join-group?code=${encodeURIComponent(code)}`;
            router.replace(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
            return;
        }

        // Prevent double execution in React Strict Mode
        if (hasAttemptedRef.current) return;
        hasAttemptedRef.current = true;

        const handleJoin = async () => {
            setStatus("joining");
            try {
                const res = await joinGroup({ inviteCode: code }).unwrap();
                if (res.success) {
                    setStatus("success");
                    setGroupName(res.data?.name || "the group");
                    toast.success(res.message || "Successfully joined group!");
                    setTimeout(() => {
                        router.replace("/dashboard");
                    }, 2000);
                } else {
                    setStatus("error");
                    setErrorMessage(res.message || "Failed to join group.");
                }
            } catch (err: any) {
                setStatus("error");
                const errMsg = err?.data?.message || err?.message || "Invalid or expired invitation code.";
                setErrorMessage(errMsg);
                toast.error(errMsg);
            }
        };

        handleJoin();
    }, [code, user, joinGroup, router]);

    return (
        <div className="min-h-screen bg-[#120a05] text-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#1e130c] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mb-6">
                        <Users className="w-8 h-8 text-primary" />
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
                        Group Invitation
                    </h1>

                    {status === "checking" && (
                        <div className="flex flex-col items-center py-6">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                            <p className="text-sm text-slate-400">Validating invitation link...</p>
                        </div>
                    )}

                    {status === "joining" && (
                        <div className="flex flex-col items-center py-6">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                            <p className="text-sm text-slate-300">Joining group with code <span className="font-mono text-primary font-semibold">{code}</span>...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center py-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-semibold text-emerald-400 mb-1">
                                Successfully Joined!
                            </h2>
                            <p className="text-sm text-slate-300 mb-6">
                                You are now a member of <span className="text-white font-medium">{groupName}</span>. Redirecting to your dashboard...
                            </p>
                            <Link
                                href="/dashboard"
                                className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
                            >
                                Go to Dashboard <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center py-4 w-full">
                            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-semibold text-rose-400 mb-1">
                                Unable to Join Group
                            </h2>
                            <p className="text-sm text-slate-400 mb-6">
                                {errorMessage}
                            </p>

                            <div className="flex flex-col w-full gap-3">
                                <Link
                                    href="/dashboard"
                                    className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition text-center"
                                >
                                    Go to Dashboard
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function JoinGroupPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#120a05] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            }
        >
            <JoinGroupContent />
        </Suspense>
    );
}
