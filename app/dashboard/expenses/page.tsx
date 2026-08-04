"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MockBazarEntry, BazarUnit } from "@/types";
import { INITIAL_ENTRIES, MOCK_USERS, MOCK_PRODUCTS } from "@/lib/mockData";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ExpensesTable } from "@/components/dashboard/expenses/ExpensesTable";
import { AddExpenseModal } from "@/components/dashboard/expenses/AddExpenseModal";

export default function DashboardExpensesPage() {
    const router = useRouter();
    const [entries, setEntries] = useState<MockBazarEntry[]>(INITIAL_ENTRIES);
    const [showAddExpense, setShowAddExpense] = useState(false);

    const handleAddExpense = (productName: string, price: number, quantity: number, unit: BazarUnit, dateStr: string, notes: string) => {
        const matchedProduct = MOCK_PRODUCTS.find((p) => p.name.toLowerCase() === productName.toLowerCase()) || {
            id: "p_" + Date.now(),
            name: productName,
            emoji: "🛒",
        };

        const newEntry: MockBazarEntry = {
            id: "e_" + Date.now(),
            product: matchedProduct,
            price,
            quantity,
            unit,
            date: new Date(dateStr),
            notes: notes || undefined,
            user: MOCK_USERS[0],
        };

        setEntries((prev) => [newEntry, ...prev]);
    };

    const handleDeleteExpense = (id: string) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            <DashboardSidebar activeTab="expenses" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            <main className="flex-1 flex flex-col min-w-0 relative">
                <DashboardHeader title="Bazar Expenses Management" onAddExpense={() => setShowAddExpense(true)} />

                <div className="flex-1 overflow-y-auto p-8 flex flex-col">
                    <ExpensesTable entries={entries} onDeleteExpense={handleDeleteExpense} />
                </div>
            </main>

            <AddExpenseModal
                show={showAddExpense}
                onClose={() => setShowAddExpense(false)}
                onSubmit={handleAddExpense}
            />
        </div>
    );
}
