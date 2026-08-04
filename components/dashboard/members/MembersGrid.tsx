"use client";

import React from "react";
import { Users } from "lucide-react";
import { MOCK_USERS } from "@/lib/mockData";

export function MembersGrid() {
    const AVATAR_COLORS = ["#c06010", "#8b6914", "#3d7a5c", "#5a4a8a", "#7a3d3d"];

    function avatarColor(id: string) {
        return AVATAR_COLORS[id.charCodeAt(1) % AVATAR_COLORS.length];
    }

    function initials(name: string) {
        return name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    return (
        <div className="flex-1 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-6">
            <h3 className="text-base font-bold font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Group Members & Roommate Accounts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {MOCK_USERS.map((u) => (
                    <div key={u.id} className="p-5 rounded-2xl bg-[#1a0e07] border border-border flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md" style={{ background: avatarColor(u.id) }}>
                            {initials(u.name)}
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">{u.name}</h4>
                            <p className="text-xs text-muted-foreground font-mono">{u.email}</p>
                            <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-mono">
                                Active Member
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
