"use client";

import React from "react";
import { Search, Trash2, Eye, Edit2, Receipt, User, Calendar, ShieldCheck } from "lucide-react";
import { TBill, BillCategory } from "@/redux/features/bill/billApi";

interface BillsGridProps {
    bills: TBill[];
    isLoading: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onViewDetails?: (id: string) => void;
    onEditBill?: (bill: TBill) => void;
    onDeleteBill: (bill: TBill) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
    RENT: "#e8a020",
    TRAVEL: "#38bdf8",
    WIFI: "#818cf8",
    ELECTRICITY: "#facc15",
    GAS: "#fb923c",
    WATER: "#60a5fa",
    MAID: "#f472b6",
    MAINTENANCE: "#a78bfa",
    SUBSCRIPTION: "#c084fc",
    MOBILE: "#4ade80",
    OTHERS: "#94a3b8",
};

export function BillsGrid({ bills, isLoading, searchTerm, onSearchChange, onViewDetails, onEditBill, onDeleteBill }: BillsGridProps) {
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
                        placeholder="Search admin bills (Press Enter to search)…"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground focus:border-primary/60 transition-colors"
                    />
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-mono font-semibold">
                    <ShieldCheck className="w-4 h-4" /> Admin Live Sync
                </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <p className="text-xs font-mono">Fetching admin bills catalog…</p>
                    </div>
                ) : bills.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Receipt className="w-10 h-10 text-muted-foreground/40 mb-1" />
                        <p className="text-sm font-semibold">No bills found</p>
                        <p className="text-xs text-muted-foreground">Try clearing search or add a new bill.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-1">
                        {bills.map((b) => {
                            const catColor = CATEGORY_COLORS[b.category] || "#e8a020";
                            return (
                                <div key={b._id} className="rounded-2xl border border-border bg-[#1a0e07] p-5 flex flex-col justify-between gap-4 relative overflow-hidden group hover:border-primary/40 transition-all shadow-md">
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono border" style={{ background: `${catColor}15`, color: catColor, borderColor: `${catColor}30` }}>
                                                <Receipt className="w-3 h-3" /> {b.category}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                {onViewDetails && (
                                                    <button onClick={() => onViewDetails(b._id)} className="text-muted-foreground hover:text-primary p-1 rounded-md transition-colors cursor-pointer" title="View Details">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {onEditBill && (
                                                    <button onClick={() => onEditBill(b)} className="text-muted-foreground hover:text-accent p-1 rounded-md transition-colors cursor-pointer" title="Edit Bill">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button onClick={() => onDeleteBill(b)} className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors cursor-pointer" title="Delete Bill">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <h4 className="text-base font-semibold text-foreground">{b.title}</h4>
                                        {b.notes && <p className="text-xs text-muted-foreground mt-1.5 italic font-sans">"{b.notes}"</p>}
                                        <p className="text-[10px] text-muted-foreground font-mono select-all mt-2" title={b._id}>
                                            ID: {b._id}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-[rgba(232,160,32,0.06)] flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                                                <User className="w-3 h-3" /> {b.user?.name || "Group Biller"}
                                            </p>
                                            <p className="text-[9px] text-muted-foreground font-mono mt-0.5 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {new Date(b.date || b.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <p className="text-lg font-bold text-accent font-mono">৳{b.amount?.toLocaleString()}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
