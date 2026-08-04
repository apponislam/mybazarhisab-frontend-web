"use client";

import React from "react";

interface StatCardProps {
    title: string;
    value: number;
    subtitle: string;
    color: string;
    isCount?: boolean;
}

export function StatCard({ title, value, subtitle, color, isCount }: StatCardProps) {
    return (
        <div className="p-5 rounded-2xl border border-border bg-[#251508] shadow-lg flex flex-col justify-between">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{title}</span>
            <h4 className={`text-2xl font-bold font-mono mt-2 ${color}`}>
                {isCount ? value : `৳${value.toLocaleString()}`}
            </h4>
            <p className="text-[10px] text-muted-foreground mt-1 font-mono">{subtitle}</p>
        </div>
    );
}
