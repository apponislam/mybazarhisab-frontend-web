"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { KeyRound, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useSetUserPasswordByAdminMutation } from "@/redux/features/auth/authApi";
import { TUser } from "@/redux/features/auth/authSlice";

interface AdminSetPasswordModalProps {
    user: TUser | null;
    onClose: () => void;
}

export function AdminSetPasswordModal({ user, onClose }: AdminSetPasswordModalProps) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [setUserPassword, { isLoading }] = useSetUserPasswordByAdminMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!password.trim()) {
            toast.error("Please enter a new password");
            return;
        }

        try {
            const res = await setUserPassword({ userId: user._id, password: password.trim() }).unwrap();
            toast.success(res.message || `Password updated for ${user.name}`);
            setPassword("");
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to update user password");
        }
    };

    return (
        <AnimatePresence>
            {user && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                                    <KeyRound className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground font-sans">Reset User Password</h3>
                                    <p className="text-xs text-muted-foreground font-mono">Set new password for {user.name}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-muted-foreground font-mono">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password…"
                                        required
                                        className="w-full bg-[#1a0e07] border border-border rounded-xl px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary/60 pr-10 font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <p className="text-[11px] text-muted-foreground font-mono">
                                The user will be notified of their new credentials via email.
                            </p>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-white/5 cursor-pointer">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer shadow-md">
                                    {isLoading ? "Updating…" : "Set New Password"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
