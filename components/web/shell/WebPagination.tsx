"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WebPaginationProps {
    page: number;
    totalPages: number;
    total: number;
    itemLabel?: string;
    hasPrev: boolean;
    hasNext: boolean;
    onPrev: () => void;
    onNext: () => void;
}

export function WebPagination({ page, totalPages, total, itemLabel = "entries", hasPrev, hasNext, onPrev, onNext }: WebPaginationProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs font-mono select-none">
            <span className="text-muted-foreground">
                Showing Page <span className="text-primary font-bold">{page}</span> of <span className="font-bold">{totalPages || 1}</span> (Total {total} {itemLabel})
            </span>
            <div className="flex items-center gap-2">
                <button onClick={onPrev} disabled={!hasPrev} className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-border bg-[#1a0e07] text-foreground hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                    <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button onClick={onNext} disabled={!hasNext} className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl border border-border bg-[#1a0e07] text-foreground hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                    Next <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
