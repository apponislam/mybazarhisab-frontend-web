"use client";

import React from "react";
import { fmtFull } from "@/lib/mockData";

interface MemberSplit {
    user: { id: string; name: string };
    spent: number;
    balance: number;
}

interface MemberBalancesProps {
    memberSplits: MemberSplit[];
}

export function MemberBalances({ memberSplits }: MemberBalancesProps) {
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
        <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold mb-4 font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                <span>📊</span> Member Balances & Spending
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {memberSplits.map((s) => {
                    const isPositive = s.balance >= 0;
                    return (
                        <div key={s.user.id} className="p-4 rounded-2xl border border-[rgba(232,160,32,0.08)] bg-[#1a0e07] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner text-xs" style={{ background: avatarColor(s.user.id) }}>
                                    {initials(s.user.name)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold">{s.user.name}</h4>
                                    <p className="text-[10px] text-muted-foreground font-mono">Spent: {fmtFull(s.spent)}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-bold font-mono ${isPositive ? "text-green-400" : "text-destructive"}`}>
                                    {isPositive ? "+" : ""}{fmtFull(s.balance)}
                                </p>
                                <p className="text-[9px] text-muted-foreground">{isPositive ? "Owed" : "Owes"}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
