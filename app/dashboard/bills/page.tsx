"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MockBill, BillCategory } from "@/types";
import { INITIAL_BILLS, MOCK_USERS } from "@/lib/mockData";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { BillsGrid } from "@/components/dashboard/bills/BillsGrid";
import { AddBillModal } from "@/components/dashboard/bills/AddBillModal";

export default function DashboardBillsPage() {
    const router = useRouter();
    const [bills, setBills] = useState<MockBill[]>(INITIAL_BILLS);
    const [showAddBill, setShowAddBill] = useState(false);

    const handleAddBill = (category: BillCategory, title: string, amount: number, dateStr: string, notes: string) => {
        const newBill: MockBill = {
            id: "b_" + Date.now(),
            category,
            title,
            amount,
            date: new Date(dateStr),
            notes: notes || undefined,
            user: MOCK_USERS[0],
        };

        setBills((prev) => [newBill, ...prev]);
    };

    const handleDeleteBill = (id: string) => {
        setBills((prev) => prev.filter((b) => b.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            <DashboardSidebar activeTab="bills" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            <main className="flex-1 flex flex-col min-w-0 relative">
                <DashboardHeader title="Monthly Bills Management" onAddBill={() => setShowAddBill(true)} />

                <div className="flex-1 overflow-y-auto p-8 flex flex-col">
                    <BillsGrid bills={bills} onDeleteBill={handleDeleteBill} />
                </div>
            </main>

            <AddBillModal
                show={showAddBill}
                onClose={() => setShowAddBill(false)}
                onSubmit={handleAddBill}
            />
        </div>
    );
}
