import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { PrimaryButton } from "@/components/app/ui/Shared";
import { toast } from "sonner";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import WebInputField from "./WebInputField";

interface WebLoginScreenProps {
    onLogin: () => void;
    onBack?: () => void;
    onRegister: () => void;
    onForgot: () => void;
}

export default function WebLoginScreen({ onLogin, onBack, onRegister, onForgot }: WebLoginScreenProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const [loginMutation] = useLoginMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginMutation({ email, password }).unwrap();
            const userData = res?.data?.user;
            const token = res?.data?.accessToken;

            if (userData && token) {
                dispatch(setUser({ user: userData, token }));
            }
            toast.success(res?.message || "Login successful!");
            onLogin();
        } catch (err: any) {
            const errorMessage = err?.data?.message || err?.message || "Login failed. Please check your credentials.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:gap-6">
            {/* Back link */}
            {onBack && (
                <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-semibold cursor-pointer mb-1 sm:mb-2 self-start">
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Back to Home
                </button>
            )}

            {/* Logo & Title */}
            <div className="flex flex-col gap-1 sm:gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-4">
                    <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-contain" />
                    <span className="text-sm sm:text-base font-bold" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        My Bazar <span className="text-primary">Hisab</span>
                    </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Welcome back
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Enter your credentials to sign in
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
                <WebInputField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required icon={<Mail className="w-4 h-4" />} />

                <WebInputField
                    label="Password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    icon={<Lock className="w-4 h-4" />}
                    rightElement={
                        <button type="button" tabIndex={-1} onClick={() => setShowPw((v) => !v)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    }
                />

                <div className="flex justify-end -mt-1">
                    <button type="button" onClick={onForgot} className="text-primary text-xs hover:underline cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Forgot password?
                    </button>
                </div>

                <div className="pt-1 sm:pt-2">
                    <PrimaryButton loading={loading} label="Sign In" loadingLabel="Signing in…" />
                </div>
            </form>

            <div className="flex items-center gap-3 my-1.5 sm:my-2 select-none">
                <div className="flex-1 h-px bg-border" />
                <span className="text-muted-foreground text-[10px] uppercase tracking-widest font-mono">New Here?</span>
                <div className="flex-1 h-px bg-border" />
            </div>

            <button type="button" onClick={onRegister} className="w-full py-2.5 sm:py-3.5 rounded-xl border border-border text-foreground text-sm font-semibold hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Create an Account
            </button>
        </motion.div>
    );
}
