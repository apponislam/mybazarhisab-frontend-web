"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { MockBazarEntry } from "@/types";
import { fmtDate } from "@/lib/mockData";

interface ExpensesTableProps {
    entries: MockBazarEntry[];
    onDeleteExpense: (id: string) => void;
}

export function ExpensesTable({ entries, onDeleteExpense }: ExpensesTableProps) {
    const [expenseSearch, setExpenseSearch] = useState("");
    const [expenseFilter, setExpenseFilter] = useState<"month" | "all">("month");

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
        <div className="flex-1 flex flex-col gap-6 min-h-0 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between gap-4 shrink-0">
                <div className="relative w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={expenseSearch}
                        onChange={(e) => setExpenseSearch(e.target.value)}
                        placeholder="Search bazar items or buyers..."
                        className="w-full pl-10 pr-4 py-2.5 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground"
                    />
                </div>

                <div className="flex gap-2 p-0.5 border border-border rounded-xl bg-[#1a0e07]">
                    {(["month", "all"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setExpenseFilter(f)}
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
                        {entries
                            .filter((e) => {
                                const isThisMonth = (d: Date) => {
                                    const now = new Date();
                                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                                };
                                if (expenseFilter === "month" && !isThisMonth(e.date)) return false;
                                const query = expenseSearch.toLowerCase();
                                return (
                                    e.product.name.toLowerCase().includes(query) ||
                                    e.user.name.toLowerCase().includes(query) ||
                                    (e.notes && e.notes.toLowerCase().includes(query))
                                );
                            })
                            .map((e) => (
                                <tr key={e.id} className="hover:bg-primary/5 transition-colors">
                                    <td className="p-4 font-semibold flex items-center gap-2">
                                        <span className="text-xl">{e.product.emoji}</span>
                                        <div>
                                            <p>{e.product.name}</p>
                                            {e.notes && <p className="text-[10px] text-muted-foreground font-normal italic">{e.notes}</p>}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] text-[#f5ede2] shrink-0" style={{ background: avatarColor(e.user.id) }}>
                                                {initials(e.user.name)}
                                            </div>
                                            <span>{e.user.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-muted-foreground font-mono text-xs">{fmtDate(e.date)}</td>
                                    <td className="p-4 text-right font-mono">৳{e.price.toLocaleString()}</td>
                                    <td className="p-4 text-right font-mono text-xs">{e.quantity} {e.unit}</td>
                                    <td className="p-4 text-right font-bold text-primary font-mono">৳{(e.price * e.quantity).toLocaleString()}</td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => onDeleteExpense(e.id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
