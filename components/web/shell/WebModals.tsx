"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export function Modal({ show, onClose, title, children }: { show: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#251508] border border-border w-full max-w-md rounded-3xl shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
                    <h3 className="text-lg font-bold text-foreground">{title}</h3>
                    <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export function MetricCard({ title, value, subtitle, color }: { title: string; value: number; subtitle: string; color: string }) {
    return (
        <div className="bg-[#251508] border border-border rounded-2xl p-6 flex flex-col gap-1.5 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20" style={{ background: color }} />
            <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">{title}</span>
            <span className="text-2xl font-black font-mono text-foreground">৳{value.toLocaleString()}</span>
            <span className="text-[11px] text-muted-foreground font-mono">{subtitle}</span>
        </div>
    );
}
