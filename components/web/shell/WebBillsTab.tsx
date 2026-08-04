"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { BILL_META } from "@/lib/mockData";

interface WebBillsTabProps {
    billSearch: string;
    setBillSearch: (val: string) => void;
    billFilter: "month" | "all";
    setBillFilter: (val: "month" | "all") => void;
    setBillPage: (fn: (p: number) => number) => void;
    billsLoading: boolean;
    billsFetching: boolean;
    billsResponse: any;
    onDeleteClick: (id: string) => void;
}

export function WebBillsTab({
    billSearch,
    setBillSearch,
    billFilter,
    setBillFilter,
    setBillPage,
    billsLoading,
    billsFetching,
    billsResponse,
    onDeleteClick,
}: WebBillsTabProps) {
    return (
        <div className="flex-1 flex flex-col gap-6 min-h-0 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
            {/* Search & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 select-none">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={billSearch}
                        onChange={(e) => setBillSearch(e.target.value)}
                        placeholder="Search bills or titles..."
                        className="w-full pl-10 pr-4 py-2.5 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none"
                    />
                </div>

                <div className="flex gap-2 p-0.5 border border-border rounded-xl bg-[#1a0e07]">
                    {(["month", "all"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => {
                                setBillFilter(f);
                                setBillPage(() => 1);
                            }}
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

            {/* Grid layout */}
            <div className="flex-1 overflow-y-auto">
                {billsLoading || (billsFetching && (!billsResponse?.data || billsResponse.data.length === 0)) ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-1">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="rounded-2xl border border-border bg-[#1a0e07] p-5 flex flex-col justify-between gap-4 animate-pulse">
                                <div className="space-y-3">
                                    <div className="h-5 bg-[#2e1a0a] rounded-lg w-24" />
                                    <div className="h-5 bg-[#2e1a0a] rounded-md w-3/4" />
                                </div>
                                <div className="pt-3 border-t border-[rgba(232,160,32,0.06)] flex items-center justify-between">
                                    <div className="h-4 bg-[#2e1a0a] rounded-md w-20" />
                                    <div className="h-6 bg-[#2e1a0a] rounded-md w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : billsResponse?.data && billsResponse.data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-1">
                        {billsResponse.data
                            .filter((b: any) => {
                                const query = billSearch.toLowerCase();
                                const title = b.title || "";
                                const uName = b.user?.name || "";
                                const cat = b.category || "";
                                return title.toLowerCase().includes(query) || uName.toLowerCase().includes(query) || cat.toLowerCase().includes(query);
                            })
                            .map((b: any) => {
                                const meta = BILL_META[b.category as keyof typeof BILL_META] || { icon: "📄", label: b.category, color: "#e8a020" };
                                return (
                                    <div key={b._id} className="rounded-2xl border border-border bg-[#1a0e07] p-5 flex flex-col justify-between gap-4 relative overflow-hidden">
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono border" style={{ background: `${meta.color}15`, color: meta.color, borderColor: `${meta.color}30` }}>
                                                    {meta.icon} {meta.label}
                                                </span>
                                                <button onClick={() => onDeleteClick(b._id)} className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors cursor-pointer" title="Delete Bill">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <h4 className="text-base font-semibold text-foreground">{b.title}</h4>
                                            {b.notes && <p className="text-xs text-muted-foreground mt-1.5 italic font-sans">"{b.notes}"</p>}
                                        </div>

                                        <div className="pt-3 border-t border-[rgba(232,160,32,0.06)] flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] text-muted-foreground font-mono">Paid by: {b.user?.name || "User"}</p>
                                                <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{new Date(b.date).toLocaleDateString()}</p>
                                            </div>
                                            <p className="text-lg font-bold text-accent font-mono">৳{b.amount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                ) : (
                    <div className="p-16 text-center text-xs font-mono text-muted-foreground bg-[#1a0e07] border border-border/60 rounded-2xl">
                        No monthly bills found.
                    </div>
                )}
            </div>

            {/* Bills Pagination Footer */}
            {billsResponse?.meta && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs font-mono">
                    <span className="text-muted-foreground">
                        Showing Page <span className="text-primary font-bold">{billsResponse.meta.page}</span> of <span className="font-bold">{billsResponse.meta.totalPages || 1}</span> (Total {billsResponse.meta.total} bills)
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setBillPage((p) => Math.max(p - 1, 1))}
                            disabled={!billsResponse.meta.hasPrev}
                            className="px-3.5 py-1.5 rounded-xl border border-border bg-[#1a0e07] text-foreground hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            ← Prev
                        </button>
                        <button
                            onClick={() => setBillPage((p) => p + 1)}
                            disabled={!billsResponse.meta.hasNext}
                            className="px-3.5 py-1.5 rounded-xl border border-border bg-[#1a0e07] text-foreground hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
