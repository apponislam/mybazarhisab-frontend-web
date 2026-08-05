"use client";

import React from "react";
import { Filter, Calendar, Trash2, Search, RotateCcw } from "lucide-react";
import { ActivityQueryParams } from "@/redux/features/activity/activityApi";

interface ActivityFilterToolbarProps {
    filters: ActivityQueryParams;
    onFilterChange: (newFilters: Partial<ActivityQueryParams>) => void;
    onResetFilters: () => void;
    onOpenClearModal: () => void;
}

export function ActivityFilterToolbar({ filters, onFilterChange, onResetFilters, onOpenClearModal }: ActivityFilterToolbarProps) {
    const CATEGORIES = [
        { id: "", label: "All Categories" },
        { id: "AUTH", label: "🔐 Auth & Account" },
        { id: "PRODUCT", label: "🛒 Product Catalog" },
        { id: "BAZAR", label: "🥦 Bazar Expenses" },
        { id: "BILL", label: "💡 Rent & Bills" },
        { id: "GROUP", label: "👥 User Groups" },
    ];

    const hasActiveFilters = Boolean(filters.type || filters.action || filters.userId || filters.groupId || filters.startDate || filters.endDate);

    return (
        <div className="bg-[#251508] border border-border rounded-3xl p-5 shadow-xl flex flex-col gap-4 font-sans shrink-0">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Category Select Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {CATEGORIES.map((cat) => {
                        const active = (filters.type || "") === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onFilterChange({ type: cat.id || undefined, page: 1 })}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                                    active ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20" : "bg-[#1a0e07] text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                                }`}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {hasActiveFilters && (
                        <button onClick={onResetFilters} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-[#1a0e07] text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer">
                            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                        </button>
                    )}

                    <button onClick={onOpenClearModal} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-bold hover:bg-destructive/25 transition-all cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" /> Clear Audit Logs
                    </button>
                </div>
            </div>

            {/* Inputs Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-border/60">
                {/* Specific Action Search */}
                <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        value={filters.action || ""}
                        onChange={(e) => onFilterChange({ action: e.target.value || undefined, page: 1 })}
                        placeholder="Filter by action (e.g. LOGIN, CREATE)…"
                        className="w-full pl-8 pr-3 py-2 bg-[#1a0e07] border border-border rounded-xl text-xs outline-none text-foreground focus:border-primary/60 transition-colors"
                    />
                </div>

                {/* Start Date */}
                <div className="relative flex items-center">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 text-muted-foreground pointer-events-none" />
                    <input type="date" value={filters.startDate || ""} onChange={(e) => onFilterChange({ startDate: e.target.value || undefined, page: 1 })} className="w-full pl-8 pr-3 py-2 bg-[#1a0e07] border border-border rounded-xl text-xs outline-none text-foreground font-mono" />
                </div>

                {/* End Date */}
                <div className="relative flex items-center">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 text-muted-foreground pointer-events-none" />
                    <input type="date" value={filters.endDate || ""} onChange={(e) => onFilterChange({ endDate: e.target.value || undefined, page: 1 })} className="w-full pl-8 pr-3 py-2 bg-[#1a0e07] border border-border rounded-xl text-xs outline-none text-foreground font-mono" />
                </div>

                {/* Limit Selector */}
                <div className="flex items-center gap-2 bg-[#1a0e07] border border-border rounded-xl px-3 py-1.5">
                    <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground font-mono shrink-0">Rows:</span>
                    <select value={filters.limit || 20} onChange={(e) => onFilterChange({ limit: Number(e.target.value), page: 1 })} className="bg-transparent text-xs text-foreground outline-none cursor-pointer w-full font-mono">
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
