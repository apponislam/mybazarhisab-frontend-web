"use client";

import React from "react";
import { MockBazarEntry } from "@/types";
import { fmtDate } from "@/lib/mockData";

interface RecentActivityFeedProps {
    entries: MockBazarEntry[];
}

export function RecentActivityFeed({ entries }: RecentActivityFeedProps) {
    return (
        <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col">
            <h3 className="text-base font-bold mb-4 font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                <span>🛒</span> Recent Logs
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {entries.slice(0, 6).map((e) => (
                    <div key={e.id} className="p-3 rounded-xl bg-[#1a0e07] border border-[rgba(232,160,32,0.06)] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-lg">{e.product.emoji}</span>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold truncate text-[#f5ede2]">{e.product.name}</p>
                                <p className="text-[10px] text-muted-foreground font-mono">
                                    {e.user.name} • {fmtDate(e.date)}
                                </p>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-xs font-bold text-primary font-mono">৳{(e.price * e.quantity).toLocaleString()}</p>
                            <p className="text-[9px] text-muted-foreground font-mono">{e.quantity} {e.unit}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
