"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { MockBill } from "@/types";
import { BILL_META, fmtDate } from "@/lib/mockData";

interface BillsGridProps {
    bills: MockBill[];
    onDeleteBill: (id: string) => void;
}

export function BillsGrid({ bills, onDeleteBill }: BillsGridProps) {
    const [billSearch, setBillSearch] = useState("");
    const [billFilter, setBillFilter] = useState<"month" | "all">("month");

    return (
        <div className="flex-1 flex flex-col gap-6 min-h-0 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between gap-4 shrink-0">
                <div className="relative w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={billSearch}
                        onChange={(e) => setBillSearch(e.target.value)}
                        placeholder="Search bills or titles..."
                        className="w-full pl-10 pr-4 py-2.5 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground"
                    />
                </div>

                <div className="flex gap-2 p-0.5 border border-border rounded-xl bg-[#1a0e07]">
                    {(["month", "all"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setBillFilter(f)}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            style={{
                                background: billFilter === f ? "#e8a020" : "transparent",
                                color: billFilter === f ? "#1a0e07" : "#a08060",
                            }}
                        >
                            {f === "month" ? "This Month" : "All Time"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-1">
                    {bills
                        .filter((b) => {
                            const isThisMonth = (d: Date) => {
                                const now = new Date();
                                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                            };
                            if (billFilter === "month" && !isThisMonth(b.date)) return false;
                            const query = billSearch.toLowerCase();
                            return (
                                b.title.toLowerCase().includes(query) ||
                                b.user.name.toLowerCase().includes(query) ||
                                b.category.toLowerCase().includes(query)
                            );
                        })
                        .map((b) => {
                            const meta = BILL_META[b.category];
                            return (
                                <div key={b.id} className="rounded-2xl border border-border bg-[#1a0e07] p-5 flex flex-col justify-between gap-4 relative overflow-hidden">
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono border" style={{ background: `${meta.color}15`, color: meta.color, borderColor: `${meta.color}30` }}>
                                                {meta.icon} {meta.label}
                                            </span>
                                            <button onClick={() => onDeleteBill(b.id)} className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors cursor-pointer">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <h4 className="text-base font-semibold text-foreground">{b.title}</h4>
                                        {b.notes && <p className="text-xs text-muted-foreground mt-1.5 italic font-sans">"{b.notes}"</p>}
                                    </div>

                                    <div className="pt-3 border-t border-[rgba(232,160,32,0.06)] flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-mono">Paid by: {b.user.name}</p>
                                            <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{fmtDate(b.date)}</p>
                                        </div>
                                        <p className="text-lg font-bold text-accent font-mono">৳{b.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
