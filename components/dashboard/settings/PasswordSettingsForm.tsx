"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";

export function PasswordSettingsForm() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Password reset successfully!");
        }, 1000);
    };

    return (
        <div className="bg-[#251508] border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-accent" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-foreground font-sans">Update Account Password</h3>
                    <p className="text-xs text-muted-foreground font-sans">Change your password regularly for security</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Current Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">New Password</label>
                    <input
                        type="password"
                        placeholder="Min. 8 characters"
                        required
                        className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Repeat New Password</label>
                    <input
                        type="password"
                        placeholder="Re-enter new password"
                        required
                        className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-accent text-accent-foreground font-bold text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                    {loading ? "Resetting…" : "Reset Password"}
                </button>
            </form>
        </div>
    );
}
