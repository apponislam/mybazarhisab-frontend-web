"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { BazarUnit, BillCategory, MockBazarEntry, MockBill } from "@/types";
import { INITIAL_ENTRIES, INITIAL_BILLS, MOCK_USERS, MOCK_PRODUCTS } from "@/lib/mockData";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { MemberBalances } from "@/components/dashboard/overview/MemberBalances";
import { SettlementList } from "@/components/dashboard/overview/SettlementList";
import { RecentActivityFeed } from "@/components/dashboard/overview/RecentActivityFeed";
import { AddExpenseModal } from "@/components/dashboard/expenses/AddExpenseModal";
import { AddBillModal } from "@/components/dashboard/bills/AddBillModal";

export default function DashboardPage() {
    const router = useRouter();
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

    // Core App States
    const [entries, setEntries] = useState<MockBazarEntry[]>(INITIAL_ENTRIES);
    const [bills, setBills] = useState<MockBill[]>(INITIAL_BILLS);

    // Modal States
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddBill, setShowAddBill] = useState(false);

    // Check Screen size
    useEffect(() => {
        const handleCheck = () => {
            if (window.innerWidth < 768) {
                router.replace("/web");
            } else {
                setIsDesktop(true);
            }
        };
        handleCheck();

        const handleResize = () => {
            if (window.innerWidth < 768) {
                router.replace("/web");
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [router]);

    // Calculations
    const calculations = useMemo(() => {
        const isThisMonth = (d: Date) => {
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        };

        const monthEntries = entries.filter((e) => isThisMonth(e.date));
        const monthBills = bills.filter((b) => isThisMonth(b.date));

        const totalBazar = monthEntries.reduce((sum, e) => sum + e.price * e.quantity, 0);
        const totalBills = monthBills.reduce((sum, b) => sum + b.amount, 0);
        const grandTotal = totalBazar + totalBills;

        const memberSpendMap: Record<string, number> = {};
        MOCK_USERS.forEach((u) => {
            memberSpendMap[u.id] = 0;
        });

        entries.forEach((e) => {
            if (memberSpendMap[e.user.id] !== undefined) {
                memberSpendMap[e.user.id] += e.price * e.quantity;
            }
        });

        bills.forEach((b) => {
            if (memberSpendMap[b.user.id] !== undefined) {
                memberSpendMap[b.user.id] += b.amount;
            }
        });

        const averageSpend = grandTotal / MOCK_USERS.length;

        const memberSplits = MOCK_USERS.map((u) => {
            const spent = memberSpendMap[u.id] || 0;
            const balance = spent - averageSpend;
            return {
                user: u,
                spent,
                balance,
            };
        });

        const debtors: { id: string; name: string; amount: number }[] = [];
        const creditors: { id: string; name: string; amount: number }[] = [];

        memberSplits.forEach((s) => {
            if (s.balance < -0.01) {
                debtors.push({ id: s.user.id, name: s.user.name, amount: Math.abs(s.balance) });
            } else if (s.balance > 0.01) {
                creditors.push({ id: s.user.id, name: s.user.name, amount: s.balance });
            }
        });

        const settlements: { from: string; to: string; amount: number }[] = [];
        let dIdx = 0,
            cIdx = 0;

        while (dIdx < debtors.length && cIdx < creditors.length) {
            const debtor = debtors[dIdx];
            const creditor = creditors[cIdx];
            const settlementAmount = Math.min(debtor.amount, creditor.amount);

            settlements.push({
                from: debtor.name,
                to: creditor.name,
                amount: settlementAmount,
            });

            debtor.amount -= settlementAmount;
            creditor.amount -= settlementAmount;

            if (debtor.amount < 0.01) dIdx++;
            if (creditor.amount < 0.01) cIdx++;
        }

        return {
            totalBazar,
            totalBills,
            grandTotal,
            averageSpend,
            memberSplits,
            settlements,
            monthEntriesCount: monthEntries.length,
            monthBillsCount: monthBills.length,
        };
    }, [entries, bills]);

    if (isDesktop === null) {
        return (
            <div className="min-h-screen bg-[#1a0e07] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    // Action handlers
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

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            <DashboardSidebar activeTab="overview" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            <main className="flex-1 flex flex-col min-w-0 relative">
                <DashboardHeader
                    title="Dashboard Overview"
                    onAddExpense={() => setShowAddExpense(true)}
                    onAddBill={() => setShowAddBill(true)}
                />

                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                    {/* Stats Summary Row */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
                        <StatCard title="Bazar Total" value={calculations.totalBazar} subtitle={`${calculations.monthEntriesCount} items this month`} color="text-primary" />
                        <StatCard title="Bills Total" value={calculations.totalBills} subtitle={`${calculations.monthBillsCount} bills this month`} color="text-accent" />
                        <StatCard title="Grand Total" value={calculations.grandTotal} subtitle="Combined account volume" color="text-green-400" />
                        <StatCard title="Group Members" value={MOCK_USERS.length} subtitle="Active shared billers" color="text-blue-400" isCount />
                    </div>

                    {/* Overview Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <MemberBalances memberSplits={calculations.memberSplits} />
                            <SettlementList settlements={calculations.settlements} />
                        </div>
                        <RecentActivityFeed entries={entries} />
                    </div>
                </div>
            </main>

            <AddExpenseModal
                show={showAddExpense}
                onClose={() => setShowAddExpense(false)}
                onSubmit={handleAddExpense}
            />

            <AddBillModal
                show={showAddBill}
                onClose={() => setShowAddBill(false)}
            />
        </div>
    );
}
