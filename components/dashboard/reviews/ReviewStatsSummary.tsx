"use client";

import React from "react";
import { Star, MessageSquare } from "lucide-react";
import { TReviewSummary } from "@/redux/features/review/reviewApi";

interface ReviewStatsSummaryProps {
    summary?: TReviewSummary;
}

export function ReviewStatsSummary({ summary }: ReviewStatsSummaryProps) {
    const total = summary?.totalReviews || 0;
    const avg = summary?.averageRating || 0;
    const dist = summary?.ratingDistribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0 font-sans">
            {/* Average Rating Box */}
            <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center text-center gap-2">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Average Rating</span>
                <div className="flex items-center gap-2">
                    <span className="text-4xl font-extrabold text-primary font-mono">{avg.toFixed(1)}</span>
                    <Star className="w-8 h-8 text-primary fill-primary" />
                </div>
                <p className="text-xs text-muted-foreground font-mono">Based on {total} total user reviews</p>
            </div>

            {/* Total Reviews Count Box */}
            <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center text-center gap-2">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Total Feedback</span>
                <div className="flex items-center gap-2">
                    <span className="text-4xl font-extrabold text-accent font-mono">{total}</span>
                    <MessageSquare className="w-8 h-8 text-accent" />
                </div>
                <p className="text-xs text-muted-foreground font-mono">Verified platform user feedback</p>
            </div>

            {/* Rating Breakdown Distribution */}
            <div className="bg-[#251508] border border-border rounded-3xl p-5 shadow-xl flex flex-col justify-center gap-1.5">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                    Rating Distribution
                </span>
                {[5, 4, 3, 2, 1].map((stars) => {
                    const count = dist[String(stars)] || 0;
                    const pct = total > 0 ? (count / total) * 100 : 0;
                    return (
                        <div key={stars} className="flex items-center gap-2 text-xs font-mono">
                            <span className="w-6 text-muted-foreground flex items-center gap-1">
                                {stars} <Star className="w-3 h-3 text-primary fill-primary" />
                            </span>
                            <div className="flex-1 h-2 rounded-full bg-[#1a0e07] border border-border overflow-hidden">
                                <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-8 text-right text-muted-foreground text-[10px]">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
