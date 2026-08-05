"use client";

import React, { useState } from "react";
import { Lock, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";

export function PasswordSettingsForm() {
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            toast.error("Please fill in all password fields");
            return;
        }

        if (newPassword !== repeatPassword) {
            toast.error("New password and confirmation password do not match");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        try {
            await changePassword({
                currentPassword,
                newPassword,
            }).unwrap();

            toast.success("Account password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setRepeatPassword("");
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to change password");
        }
    };

    return (
        <div className="bg-[#251508] border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-6 font-sans">
            <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-accent" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-foreground">Update Account Password</h3>
                    <p className="text-xs text-muted-foreground">Ensure your account uses a strong password</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground focus:border-accent/60 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        required
                        className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground focus:border-accent/60 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Repeat New Password</label>
                    <input
                        type="password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                        className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground focus:border-accent/60 transition-colors"
                    />
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-3 bg-accent text-accent-foreground font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-md disabled:opacity-50 mt-2">
                    {isLoading ? "Updating Password…" : "Update Password"}
                </button>
            </form>
        </div>
    );
}
