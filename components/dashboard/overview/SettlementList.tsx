"use client";

import React from "react";
import { fmtFull } from "@/lib/mockData";

interface Settlement {
    from: string;
    to: string;
    amount: number;
}

interface SettlementListProps {
    settlements: Settlement[];
}

export function SettlementList({ settlements }: SettlementListProps) {
    return (
        <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold mb-4 font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                <span>💸</span> Automated Settlements
            </h3>
            {settlements.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-6">
                    <span className="text-2xl mb-2">🎉</span>
                    <p className="text-sm">All room shares are completely settled!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {settlements.map((s, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-dashed border-primary/20 bg-primary/5 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="font-semibold text-destructive">{s.from}</span>
                                <span>owes</span>
                                <span className="font-semibold text-green-400">{s.to}</span>
                            </div>
                            <div className="text-xl font-bold text-primary font-mono text-center">{fmtFull(s.amount)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
