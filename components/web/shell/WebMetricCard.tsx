"use client";

import React from "react";
import { fmt } from "@/lib/mockData";

export function WebMetricCard({ title, value, subtitle, color }: { title: string; value: number; subtitle: string; color: string }) {
    return (
        <div className="bg-[#251508] border border-border rounded-2xl p-6 flex flex-col gap-1.5 relative overflow-hidden shadow-md">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest font-mono">{title}</p>
            <p className={`text-3xl font-black ${color} font-mono`}>{fmt(value)}</p>
            <p className="text-xs text-muted-foreground font-sans">{subtitle}</p>
        </div>
    );
}

const AVATAR_COLORS = ["#c06010", "#8b6914", "#3d7a5c", "#5a4a8a", "#7a3d3d"];

export function avatarColor(id: string) {
    return AVATAR_COLORS[id.charCodeAt(1) % AVATAR_COLORS.length];
}

export function initials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}
