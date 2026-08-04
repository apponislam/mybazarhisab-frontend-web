"use client";

import React, { useState } from "react";
import { User } from "lucide-react";
import { toast } from "sonner";

export function ProfileSettingsForm() {
    const [name, setName] = useState("Ahmed Hassan");
    const [email, setEmail] = useState("ahmed@email.com");
    const [phone, setPhone] = useState("+880 1712-345678");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Profile details updated successfully!");
        }, 1000);
    };

    return (
        <div className="bg-[#251508] border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-foreground font-sans">Edit Profile Details</h3>
                    <p className="text-xs text-muted-foreground font-sans">Update your contact information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Phone Number</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground font-mono"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-accent transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                    {loading ? "Saving Changes…" : "Save Profile Changes"}
                </button>
            </form>
        </div>
    );
}
