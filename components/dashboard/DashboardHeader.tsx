"use client";

import React from "react";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
    title: string;
    groupName?: string;
    onAddExpense?: () => void;
    onAddBill?: () => void;
    children?: React.ReactNode;
}

export function DashboardHeader({
    title,
    groupName = "Sabzi Mandi Group ⭐️",
    onAddExpense,
    onAddBill,
    children,
}: DashboardHeaderProps) {
    return (
        <header className="h-20 border-b border-[rgba(232,160,32,0.1)] px-8 flex items-center justify-between shrink-0 bg-[#251508]/30">
            <div>
                <h2 className="text-xl font-bold tracking-tight capitalize font-sans">{title}</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold font-mono">
                    <span>{groupName}</span>
                </div>

                {children}

                {onAddExpense && (
                    <button
                        onClick={onAddExpense}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl transition-all hover:bg-accent cursor-pointer shadow-md shadow-primary/20"
                    >
                        <Plus className="w-4 h-4" /> Add Expense
                    </button>
                )}

                {onAddBill && (
                    <button
                        onClick={onAddBill}
                        className="flex items-center gap-2 px-4 py-2 border border-accent text-accent text-sm font-semibold rounded-xl transition-all hover:bg-accent/10 cursor-pointer shadow-md"
                    >
                        <Plus className="w-4 h-4" /> Add Bill
                    </button>
                )}
            </div>
        </header>
    );
}
