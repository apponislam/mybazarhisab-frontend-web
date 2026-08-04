"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
    Plus,
    Search,
    X,
    User,
    Lock,
    Mail,
    Phone,
    Camera,
    ShoppingBag,
    Receipt,
    Users as UsersIcon,
    Settings as SettingsIcon,
} from "lucide-react";
import { BazarUnit, BillCategory, MockBazarEntry, MockBill } from "@/types";
import { INITIAL_ENTRIES, INITIAL_BILLS, MOCK_USERS, MOCK_PRODUCTS, BILL_META, fmt, fmtFull, fmtDate } from "@/lib/mockData";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardPage() {
    const router = useRouter();
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

    // Core App States
    const [tab, setTab] = useState<"overview" | "expenses" | "bills" | "members" | "settings">("overview");
    const [entries, setEntries] = useState<MockBazarEntry[]>(INITIAL_ENTRIES);
    const [bills, setBills] = useState<MockBill[]>(INITIAL_BILLS);

    // Search & Filter States
    const [expenseSearch, setExpenseSearch] = useState("");
    const [billSearch, setBillSearch] = useState("");
    const [expenseFilter, setExpenseFilter] = useState<"month" | "all">("month");
    const [billFilter, setBillFilter] = useState<"month" | "all">("month");

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

    const handleDeleteExpense = (id: string) => {
        setEntries((prev) => prev.filter((e) => e.id !== id));
    };

    const handleDeleteBill = (id: string) => {
        setBills((prev) => prev.filter((b) => b.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            {/* Left Sidebar Component */}
            <DashboardSidebar activeTab={tab} onTabChange={(t) => setTab(t as any)} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Top Header Bar */}
                <header className="h-20 border-b border-[rgba(232,160,32,0.1)] px-8 flex items-center justify-between shrink-0 bg-[#251508]/30">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight capitalize" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            {tab === "overview" ? "Dashboard Overview" : tab === "members" ? "Group Split Billing" : `${tab} Dashboard`}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold font-mono">
                            <span>Sabzi Mandi Group ⭐️</span>
                        </div>

                        {/* Quick action buttons */}
                        <button
                            onClick={() => setShowAddExpense(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl transition-all hover:bg-accent cursor-pointer shadow-md shadow-primary/20"
                        >
                            <Plus className="w-4 h-4" /> Add Expense
                        </button>
                        <button
                            onClick={() => setShowAddBill(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-accent text-accent text-sm font-semibold rounded-xl transition-all hover:bg-accent/10 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" /> Add Bill
                        </button>
                    </div>
                </header>

                {/* Tab contents wrapper */}
                <div className="flex-1 overflow-y-auto p-8">
                    <AnimatePresence mode="wait">
                        <motion.div key={tab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }} className="h-full flex flex-col gap-6">
                            {/* TAB: OVERVIEW */}
                            {tab === "overview" && (
                                <>
                                    {/* Metric summary grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
                                        <StatCard title="Bazar Total" value={calculations.totalBazar} subtitle={`${calculations.monthEntriesCount} items this month`} color="text-primary" />
                                        <StatCard title="Bills Total" value={calculations.totalBills} subtitle={`${calculations.monthBillsCount} bills this month`} color="text-accent" />
                                        <StatCard title="Grand Total" value={calculations.grandTotal} subtitle="Combined account volume" color="text-green-400" />
                                        <StatCard title="Group Members" value={MOCK_USERS.length} subtitle="Active shared billers" color="text-blue-400" isCount />
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                        <div className="lg:col-span-2 flex flex-col gap-6">
                                            {/* Member Splits */}
                                            <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
                                                <h3 className="text-base font-bold mb-4 font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                                    <span>📊</span> Member Balances & Spending
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {calculations.memberSplits.map((s) => {
                                                        const isPositive = s.balance >= 0;
                                                        return (
                                                            <div key={s.user.id} className="p-4 rounded-2xl border border-[rgba(232,160,32,0.08)] bg-[#1a0e07] flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner text-xs" style={{ background: avatarColor(s.user.id) }}>
                                                                        {initials(s.user.name)}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-semibold">{s.user.name}</h4>
                                                                        <p className="text-[10px] text-muted-foreground font-mono">Spent: {fmtFull(s.spent)}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className={`text-sm font-bold font-mono ${isPositive ? "text-green-400" : "text-destructive"}`}>
                                                                        {isPositive ? "+" : ""}{fmtFull(s.balance)}
                                                                    </p>
                                                                    <p className="text-[9px] text-muted-foreground">{isPositive ? "Owed" : "Owes"}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Settlements */}
                                            <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
                                                <h3 className="text-base font-bold mb-4 font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                                    <span>💸</span> Automated Settlements
                                                </h3>
                                                {calculations.settlements.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-6">
                                                        <span className="text-2xl mb-2">🎉</span>
                                                        <p className="text-sm">All room shares are completely settled!</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {calculations.settlements.map((s, idx) => (
                                                            <div key={idx} className="p-4 rounded-2xl border border-dashed border-primary/20 bg-primary/5 flex flex-col gap-2">
                                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                    <span className="font-semibold text-destructive">{s.from}</span>
                                                                    <span>owes</span>
                                                                    <span className="font-semibold text-green-400">{s.to}</span>
                                                                </div>
                                                                <div className="text-xl font-bold text-primary font-mono text-center">{fmtFull(s.amount)}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Activity feed */}
                                        <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col">
                                            <h3 className="text-base font-bold mb-4 font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                                <span>🛒</span> Recent Logs
                                            </h3>
                                            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                                                {entries.slice(0, 6).map((e) => (
                                                    <div key={e.id} className="p-3 rounded-xl bg-[#1a0e07] border border-[rgba(232,160,32,0.06)] flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <span className="text-lg">{e.product.emoji}</span>
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-semibold truncate text-[#f5ede2]">{e.product.name}</p>
                                                                <p className="text-[10px] text-muted-foreground font-mono">
                                                                    {e.user.name} • {fmtDate(e.date)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-xs font-bold text-primary font-mono">৳{(e.price * e.quantity).toLocaleString()}</p>
                                                            <p className="text-[9px] text-muted-foreground font-mono">{e.quantity} {e.unit}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* TAB: EXPENSES */}
                            {tab === "expenses" && (
                                <div className="flex-1 flex flex-col gap-6 min-h-0 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
                                    <div className="flex items-center justify-between gap-4 shrink-0">
                                        <div className="relative w-80">
                                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="text"
                                                value={expenseSearch}
                                                onChange={(e) => setExpenseSearch(e.target.value)}
                                                placeholder="Search bazar items or buyers..."
                                                className="w-full pl-10 pr-4 py-2.5 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none"
                                            />
                                        </div>

                                        <div className="flex gap-2 p-0.5 border border-border rounded-xl bg-[#1a0e07]">
                                            {(["month", "all"] as const).map((f) => (
                                                <button
                                                    key={f}
                                                    onClick={() => setExpenseFilter(f)}
                                                    className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                                                    style={{
                                                        background: expenseFilter === f ? "#e8a020" : "transparent",
                                                        color: expenseFilter === f ? "#1a0e07" : "#a08060",
                                                    }}
                                                >
                                                    {f === "month" ? "This Month" : "All Time"}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-auto rounded-2xl border border-[rgba(232,160,32,0.1)]">
                                        <table className="w-full border-collapse text-left text-sm">
                                            <thead className="bg-[#2e1a0a] text-muted-foreground font-mono text-xs border-b border-[rgba(232,160,32,0.1)] sticky top-0">
                                                <tr>
                                                    <th className="p-4">Item</th>
                                                    <th className="p-4">Buyer</th>
                                                    <th className="p-4">Date</th>
                                                    <th className="p-4 text-right">Price</th>
                                                    <th className="p-4 text-right">Qty</th>
                                                    <th className="p-4 text-right">Total</th>
                                                    <th className="p-4 text-center">Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[rgba(232,160,32,0.06)] bg-[#251508]">
                                                {entries
                                                    .filter((e) => {
                                                        const isThisMonth = (d: Date) => {
                                                            const now = new Date();
                                                            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                                                        };
                                                        if (expenseFilter === "month" && !isThisMonth(e.date)) return false;
                                                        const query = expenseSearch.toLowerCase();
                                                        return (
                                                            e.product.name.toLowerCase().includes(query) ||
                                                            e.user.name.toLowerCase().includes(query) ||
                                                            (e.notes && e.notes.toLowerCase().includes(query))
                                                        );
                                                    })
                                                    .map((e) => (
                                                        <tr key={e.id} className="hover:bg-primary/5 transition-colors">
                                                            <td className="p-4 font-semibold flex items-center gap-2">
                                                                <span className="text-xl">{e.product.emoji}</span>
                                                                <div>
                                                                    <p>{e.product.name}</p>
                                                                    {e.notes && <p className="text-[10px] text-muted-foreground font-normal italic">{e.notes}</p>}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] text-[#f5ede2] shrink-0" style={{ background: avatarColor(e.user.id) }}>
                                                                        {initials(e.user.name)}
                                                                    </div>
                                                                    <span>{e.user.name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-muted-foreground font-mono text-xs">{fmtDate(e.date)}</td>
                                                            <td className="p-4 text-right font-mono">৳{e.price.toLocaleString()}</td>
                                                            <td className="p-4 text-right font-mono text-xs">{e.quantity} {e.unit}</td>
                                                            <td className="p-4 text-right font-bold text-primary font-mono">৳{(e.price * e.quantity).toLocaleString()}</td>
                                                            <td className="p-4 text-center">
                                                                <button onClick={() => handleDeleteExpense(e.id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* TAB: BILLS */}
                            {tab === "bills" && (
                                <div className="flex-1 flex flex-col gap-6 min-h-0 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
                                    <div className="flex items-center justify-between gap-4 shrink-0">
                                        <div className="relative w-80">
                                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="text"
                                                value={billSearch}
                                                onChange={(e) => setBillSearch(e.target.value)}
                                                placeholder="Search bills or titles..."
                                                className="w-full pl-10 pr-4 py-2.5 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none"
                                            />
                                        </div>

                                        <div className="flex gap-2 p-0.5 border border-border rounded-xl bg-[#1a0e07]">
                                            {(["month", "all"] as const).map((f) => (
                                                <button
                                                    key={f}
                                                    onClick={() => setBillFilter(f)}
                                                    className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                                                    style={{
                                                        background: billFilter === f ? "#e8a020" : "transparent",
                                                        color: billFilter === f ? "#1a0e07" : "#a08060",
                                                    }}
                                                >
                                                    {f === "month" ? "This Month" : "All Time"}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-1">
                                            {bills
                                                .filter((b) => {
                                                    const isThisMonth = (d: Date) => {
                                                        const now = new Date();
                                                        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                                                    };
                                                    if (billFilter === "month" && !isThisMonth(b.date)) return false;
                                                    const query = billSearch.toLowerCase();
                                                    return b.title.toLowerCase().includes(query) || b.user.name.toLowerCase().includes(query) || b.category.toLowerCase().includes(query);
                                                })
                                                .map((b) => {
                                                    const meta = BILL_META[b.category];
                                                    return (
                                                        <div key={b.id} className="rounded-2xl border border-border bg-[#1a0e07] p-5 flex flex-col justify-between gap-4 relative overflow-hidden">
                                                            <div>
                                                                <div className="flex items-center justify-between gap-2 mb-3">
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono border" style={{ background: `${meta.color}15`, color: meta.color, borderColor: `${meta.color}30` }}>
                                                                        {meta.icon} {meta.label}
                                                                    </span>
                                                                    <button onClick={() => handleDeleteBill(b.id)} className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors cursor-pointer">
                                                                        <X className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                                <h4 className="text-base font-semibold text-foreground">{b.title}</h4>
                                                                {b.notes && <p className="text-xs text-muted-foreground mt-1.5 italic font-sans">"{b.notes}"</p>}
                                                            </div>

                                                            <div className="pt-3 border-t border-[rgba(232,160,32,0.06)] flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-[10px] text-muted-foreground font-mono">Paid by: {b.user.name}</p>
                                                                    <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{fmtDate(b.date)}</p>
                                                                </div>
                                                                <p className="text-lg font-bold text-accent font-mono">৳{b.amount.toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB: MEMBERS */}
                            {tab === "members" && (
                                <div className="flex-1 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-6">
                                    <h3 className="text-base font-bold font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                        <UsersIcon className="w-5 h-5 text-primary" /> Group Members & Room Share Split
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        {MOCK_USERS.map((u) => (
                                            <div key={u.id} className="p-5 rounded-2xl bg-[#1a0e07] border border-border flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md" style={{ background: avatarColor(u.id) }}>
                                                    {initials(u.name)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-foreground">{u.name}</h4>
                                                    <p className="text-xs text-muted-foreground font-mono">{u.email}</p>
                                                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 font-mono">
                                                        Active Roommate
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB: SETTINGS */}
                            {tab === "settings" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <div className="bg-[#251508] border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground">Edit Account Details</h3>
                                                <p className="text-xs text-muted-foreground">Update contact information</p>
                                            </div>
                                        </div>

                                        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-muted-foreground mb-1">Full Name</label>
                                                <input type="text" defaultValue="Ahmed Hassan" className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-muted-foreground mb-1">Email Address</label>
                                                <input type="email" defaultValue="ahmed@email.com" className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-muted-foreground mb-1">Phone Number</label>
                                                <input type="text" defaultValue="+880 1712-345678" className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none" />
                                            </div>
                                            <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-accent cursor-pointer">
                                                Save Changes
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Add Expense Modal */}
            <AnimatePresence>
                {showAddExpense && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-5">
                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <h3 className="text-lg font-bold text-foreground">Add Bazar Expense</h3>
                                <button onClick={() => setShowAddExpense(false)} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <AddExpenseForm onSubmit={(p, pr, q, u, d, n) => { handleAddExpense(p, pr, q, u, d, n); setShowAddExpense(false); }} onClose={() => setShowAddExpense(false)} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Bill Modal */}
            <AnimatePresence>
                {showAddBill && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-5">
                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <h3 className="text-lg font-bold text-foreground">Add Monthly Bill</h3>
                                <button onClick={() => setShowAddBill(false)} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <AddBillForm onSubmit={(c, t, a, d, n) => { handleAddBill(c, t, a, d, n); setShowAddBill(false); }} onClose={() => setShowAddBill(false)} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper components
function StatCard({ title, value, subtitle, color, isCount }: { title: string; value: number; subtitle: string; color: string; isCount?: boolean }) {
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

function AddExpenseForm({ onSubmit, onClose }: { onSubmit: (prod: string, price: number, qty: number, unit: BazarUnit, date: string, notes: string) => void; onClose: () => void }) {
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [unit, setUnit] = useState<BazarUnit>("KG");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!productName || !price || !quantity) return;
        onSubmit(productName, Number(price), Number(quantity), unit, date, notes);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Product Name</label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required placeholder="e.g. Tomatoes" className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none" />
            </div>
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Price (৳)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0" className="w-full px-3 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Quantity</label>
                    <input type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} required placeholder="1" className="w-full px-3 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Unit</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value as BazarUnit)} className="w-full px-3 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono">
                        <option value="KG">KG</option>
                        <option value="GM">GM</option>
                        <option value="LITER">Liter</option>
                        <option value="PIECE">Piece</option>
                        <option value="PACKET">Packet</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono" style={{ colorScheme: "dark" }} />
            </div>
            <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Notes (optional)</label>
                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add note…" className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none" />
            </div>
            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-white/5 cursor-pointer text-xs">
                    Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-accent cursor-pointer text-xs">
                    Save Expense
                </button>
            </div>
        </form>
    );
}

function AddBillForm({ onSubmit, onClose }: { onSubmit: (cat: BillCategory, title: string, amount: number, date: string, notes: string) => void; onClose: () => void }) {
    const [category, setCategory] = useState<BillCategory>("RENT");
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount) return;
        onSubmit(category, title, Number(amount), date, notes);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as BillCategory)} className="w-full px-3 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none" style={{ colorScheme: "dark" }}>
                        {BILL_CATEGORIES_LIST.map((c) => (
                            <option key={c.key} value={c.key}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Amount (৳)</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="0" className="w-full px-3 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. July House Rent" className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none" />
            </div>
            <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono" style={{ colorScheme: "dark" }} />
            </div>
            <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Notes (optional)</label>
                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add note…" className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none" />
            </div>
            <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-white/5 cursor-pointer text-xs">
                    Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-accent cursor-pointer text-xs">
                    Save Bill
                </button>
            </div>
        </form>
    );
}

const AVATAR_COLORS = ["#c06010", "#8b6914", "#3d7a5c", "#5a4a8a", "#7a3d3d"];

function avatarColor(id: string) {
    return AVATAR_COLORS[id.charCodeAt(1) % AVATAR_COLORS.length];
}

function initials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

const BILL_CATEGORIES_LIST = Object.entries(BILL_META).map(([k, v]) => ({ key: k as BillCategory, label: v.label }));
