"use client";

import React from "react";
import { Search, ShoppingBag, Edit2, Trash2, ShieldCheck, User } from "lucide-react";
import { TBazarEntry } from "@/redux/features/bazar-entry/bazarEntryApi";

interface ExpensesTableProps {
    entries: TBazarEntry[];
    isLoading: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onEditExpense: (entry: TBazarEntry) => void;
    onDeleteExpense: (entry: TBazarEntry) => void;
}

export function ExpensesTable({
    entries,
    isLoading,
    searchTerm,
    onSearchChange,
    onEditExpense,
    onDeleteExpense,
}: ExpensesTableProps) {
    const AVATAR_COLORS = ["#c06010", "#8b6914", "#3d7a5c", "#5a4a8a", "#7a3d3d"];

    function avatarColor(id: string) {
        if (!id) return AVATAR_COLORS[0];
        return AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];
    }

    function initials(name: string) {
        if (!name) return "U";
        return name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    return (
        <div className="flex-1 flex flex-col gap-6 min-h-0 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
            {/* Search Toolbar */}
            <div className="flex items-center justify-between gap-4 shrink-0">
                <div className="relative w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search bazar expenses (Press Enter to search)…"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground focus:border-primary/60 transition-colors"
                    />
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-mono font-semibold">
                    <ShieldCheck className="w-4 h-4" /> Admin Live Sync
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto rounded-2xl border border-[rgba(232,160,32,0.1)]">
                <table className="w-full border-collapse text-left text-sm font-sans">
                    <thead className="bg-[#2e1a0a] text-muted-foreground font-mono text-xs border-b border-[rgba(232,160,32,0.1)] sticky top-0">
                        <tr>
                            <th className="p-4">Item Info & ID</th>
                            <th className="p-4">Buyer</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Price</th>
                            <th className="p-4 text-right">Qty</th>
                            <th className="p-4 text-right">Total</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(232,160,32,0.06)] bg-[#251508]">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                        <p className="text-xs font-mono">Loading bazar expenses catalog…</p>
                                    </div>
                                </td>
                            </tr>
                        ) : entries.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <ShoppingBag className="w-10 h-10 text-muted-foreground/40 mb-1" />
                                        <p className="text-sm font-semibold">No bazar expenses found</p>
                                        <p className="text-xs text-muted-foreground">Try clearing search or add a new expense.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            entries.map((e) => {
                                const totalPrice = e.price * e.quantity;
                                const userName = e.user?.name || "Group Member";
                                const userEmail = e.user?.email || "";
                                const productName = e.product?.name || "Bazar Item";

                                return (
                                    <tr key={e._id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="p-4 font-semibold">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                                    <ShoppingBag className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-foreground">{productName}</p>
                                                    {e.notes && <p className="text-[10px] text-muted-foreground font-normal italic">{e.notes}</p>}
                                                    <p className="text-[10px] text-muted-foreground font-mono select-all mt-0.5" title={e._id}>
                                                        ID: {e._id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center font-bold text-[9px] text-[#f5ede2] shrink-0"
                                                    style={{ background: avatarColor(e.user?._id || "") }}
                                                >
                                                    {e.user?.profileImage ? (
                                                        <img src={e.user.profileImage} alt={userName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        initials(userName)
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold">{userName}</p>
                                                    {userEmail && <p className="text-[10px] text-muted-foreground font-mono">{userEmail}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-muted-foreground font-mono text-xs">
                                            {new Date(e.date || e.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right font-mono">৳{e.price.toLocaleString()}</td>
                                        <td className="p-4 text-right font-mono text-xs">
                                            {e.quantity} {e.unit || "KG"}
                                        </td>
                                        <td className="p-4 text-right font-bold text-primary font-mono">
                                            ৳{totalPrice.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => onEditExpense(e)}
                                                    className="p-1.5 rounded-lg border border-border bg-[#1a0e07] hover:border-accent/50 text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                                                    title="Edit Expense"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => onDeleteExpense(e)}
                                                    className="p-1.5 rounded-lg border border-border bg-[#1a0e07] hover:border-destructive/50 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                                    title="Delete Expense"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
