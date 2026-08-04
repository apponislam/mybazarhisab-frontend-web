"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { avatarColor, initials } from "./WebUtils";

interface WebExpensesTabProps {
    expenseSearch: string;
    setExpenseSearch: (val: string) => void;
    expenseFilter: "month" | "all";
    setExpenseFilter: (val: "month" | "all") => void;
    setExpensePage: (fn: (p: number) => number) => void;
    bazarEntriesLoading: boolean;
    bazarEntriesFetching: boolean;
    bazarEntriesResponse: any;
    onDeleteClick: (id: string) => void;
}

export function WebExpensesTab({ expenseSearch, setExpenseSearch, expenseFilter, setExpenseFilter, setExpensePage, bazarEntriesLoading, bazarEntriesFetching, bazarEntriesResponse, onDeleteClick }: WebExpensesTabProps) {
    return (
        <div className="flex-1 flex flex-col gap-6 min-h-0 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
            {/* Search & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 select-none">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" value={expenseSearch} onChange={(e) => setExpenseSearch(e.target.value)} placeholder="Search bazar items or buyers..." className="w-full pl-10 pr-4 py-2.5 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none" />
                </div>

                <div className="flex gap-2 p-0.5 border border-border rounded-xl bg-[#1a0e07]">
                    {(["month", "all"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => {
                                setExpenseFilter(f);
                                setExpensePage(() => 1);
                            }}
                            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                            style={{
                                background: expenseFilter === f ? "#e8a020" : "transparent",
                                color: expenseFilter === f ? "#1a0e07" : "#a08060",
                            }}
                        >
                            {f === "month" ? "This Month" : "All Time"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Feed */}
            <div className="flex-1 overflow-auto rounded-2xl border border-[rgba(232,160,32,0.1)]">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-[#2e1a0a] text-muted-foreground font-mono text-xs border-b border-[rgba(232,160,32,0.1)] sticky top-0">
                        <tr>
                            <th className="p-4">Item</th>
                            <th className="p-4">Buyer</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Price</th>
                            <th className="p-4 text-right">Qty</th>
                            <th className="p-4 text-right">Total</th>
                            <th className="p-4 text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(232,160,32,0.06)] bg-[#251508]">
                        {bazarEntriesLoading || (bazarEntriesFetching && (!bazarEntriesResponse?.data || bazarEntriesResponse.data.length === 0)) ? (
                            [1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="p-4">
                                        <div className="h-4 bg-[#2e1a0a] rounded-md w-32" />
                                    </td>
                                    <td className="p-4">
                                        <div className="h-4 bg-[#2e1a0a] rounded-md w-24" />
                                    </td>
                                    <td className="p-4">
                                        <div className="h-4 bg-[#2e1a0a] rounded-md w-20" />
                                    </td>
                                    <td className="p-4">
                                        <div className="h-4 bg-[#2e1a0a] rounded-md w-16 ml-auto" />
                                    </td>
                                    <td className="p-4">
                                        <div className="h-4 bg-[#2e1a0a] rounded-md w-12 ml-auto" />
                                    </td>
                                    <td className="p-4">
                                        <div className="h-4 bg-[#2e1a0a] rounded-md w-16 ml-auto" />
                                    </td>
                                    <td className="p-4">
                                        <div className="h-4 bg-[#2e1a0a] rounded-md w-6 mx-auto" />
                                    </td>
                                </tr>
                            ))
                        ) : bazarEntriesResponse?.data && bazarEntriesResponse.data.length > 0 ? (
                            bazarEntriesResponse.data
                                .filter((e: any) => {
                                    const query = expenseSearch.toLowerCase();
                                    const pName = e.product?.name || "";
                                    const uName = e.user?.name || "";
                                    const notes = e.notes || "";
                                    return pName.toLowerCase().includes(query) || uName.toLowerCase().includes(query) || notes.toLowerCase().includes(query);
                                })
                                .map((e: any) => (
                                    <tr key={e._id} className="hover:bg-primary/5 transition-colors">
                                        <td className="p-4 font-semibold flex items-center gap-2">
                                            <span className="text-xl">{e.product?.emoji || "🛒"}</span>
                                            <div>
                                                <p>{e.name || e.product?.name || "Bazar Item"}</p>
                                                {e.notes && <p className="text-[10px] text-muted-foreground font-normal italic">{e.notes}</p>}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] text-[#f5ede2] shrink-0" style={{ background: avatarColor(e.user?._id || "u") }}>
                                                    {initials(e.user?.name || "U")}
                                                </div>
                                                <span>{e.user?.name || "User"}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-muted-foreground font-mono text-xs">{new Date(e.date).toLocaleDateString()}</td>
                                        <td className="p-4 text-right font-mono">৳{e.price.toLocaleString()}</td>
                                        <td className="p-4 text-right font-mono text-xs">
                                            {e.quantity} {e.unit}
                                        </td>
                                        <td className="p-4 text-right font-bold text-primary font-mono">৳{(e.price * e.quantity).toLocaleString()}</td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => onDeleteClick(e._id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer" title="Delete Expense">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-xs font-mono text-muted-foreground">
                                    No bazar entries found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Expenses Pagination Footer */}
            {bazarEntriesResponse?.meta && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs font-mono">
                    <span className="text-muted-foreground">
                        Showing Page <span className="text-primary font-bold">{bazarEntriesResponse.meta.page}</span> of <span className="font-bold">{bazarEntriesResponse.meta.totalPages || 1}</span> (Total {bazarEntriesResponse.meta.total} entries)
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setExpensePage((p) => Math.max(p - 1, 1))}
                            disabled={!bazarEntriesResponse.meta.hasPrev}
                            className="px-3.5 py-1.5 rounded-xl border border-border bg-[#1a0e07] text-foreground hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            ← Prev
                        </button>
                        <button
                            onClick={() => setExpensePage((p) => p + 1)}
                            disabled={!bazarEntriesResponse.meta.hasNext}
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
