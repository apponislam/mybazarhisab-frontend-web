import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, ShoppingBag, Receipt, User, Plus, Search, X, LogOut, Settings, Lock, Mail, Phone, Camera } from "lucide-react";
import { BazarUnit, BillCategory, MockBazarEntry, MockBill, GroupStats } from "@/types";
import { INITIAL_ENTRIES, INITIAL_BILLS, MOCK_USERS, MOCK_PRODUCTS, BILL_META, fmt, fmtFull, fmtDate } from "@/lib/mockData";
import { ScreenShell, PrimaryButton, SpinnerIcon } from "@/components/ui/Shared";

export function WebAppShell({ stats, onLogout }: { stats: GroupStats; onLogout: () => void }) {
    // Website Tabs
    const [tab, setTab] = useState<"home" | "expenses" | "bills" | "profile">("home");

    // Core App States (Independent copies for the web shell)
    const [entries, setEntries] = useState<MockBazarEntry[]>(INITIAL_ENTRIES);
    const [bills, setBills] = useState<MockBill[]>(INITIAL_BILLS);

    // Search & Filter States
    const [expenseSearch, setExpenseSearch] = useState("");
    const [billSearch, setBillSearch] = useState("");
    const [expenseFilter, setExpenseFilter] = useState<"month" | "all">("month");
    const [billFilter, setBillFilter] = useState<"month" | "all">("month");

    // Onboarding Modal States
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddBill, setShowAddBill] = useState(false);

    // Profile forms dummy states
    const [name, setName] = useState("Ahmed Hassan");
    const [email, setEmail] = useState("ahmed@email.com");
    const [phone, setPhone] = useState("+880 1712-345678");
    const [profileLoading, setProfileLoading] = useState(false);
    const [passLoading, setPassLoading] = useState(false);

    // Calculations
    const calculations = useMemo(() => {
        const isThisMonth = (d: Date) => {
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        };

        // Filtered entries
        const monthEntries = entries.filter((e) => isThisMonth(e.date));
        const monthBills = bills.filter((b) => isThisMonth(b.date));

        const totalBazar = monthEntries.reduce((sum, e) => sum + e.price * e.quantity, 0);
        const totalBills = monthBills.reduce((sum, b) => sum + b.amount, 0);
        const grandTotal = totalBazar + totalBills;

        // Member-wise spending
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

        // Calculate settlements (who owes whom)
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

    // Handlers
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
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex flex-col font-sans overflow-x-hidden">
            {/* ─── Top Website Header ────────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 w-full bg-[#251508] border-b border-[rgba(232,160,32,0.15)] shadow-md select-none">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo & Group */}
                    <div className="flex items-center gap-3">
                        <img src="/assets/logo.png" alt="Bazar Hisab" className="w-9 h-9 object-contain rounded-xl" />
                        <div>
                            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                                My Bazar <span className="text-primary">Hisab</span>
                            </span>
                            <span className="ml-3 hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-semibold font-mono">{stats.groupName} ⭐️</span>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="hidden md:flex items-center gap-1">
                        {[
                            { id: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
                            { id: "expenses", label: "Expenses", icon: <ShoppingBag className="w-4 h-4" /> },
                            { id: "bills", label: "Bills", icon: <Receipt className="w-4 h-4" /> },
                            { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
                        ].map((item) => {
                            const active = tab === item.id;
                            return (
                                <button key={item.id} onClick={() => setTab(item.id as never)} className="relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer" style={{ color: active ? "#e8a020" : "#a08060" }}>
                                    {item.icon}
                                    {item.label}
                                    {active && <motion.div layoutId="web-nav-underline" className="absolute bottom-0 left-5 right-5 h-0.5 bg-primary rounded-full" />}
                                </button>
                            );
                        })}
                    </nav>

                    {/* User profile dropdown & actions */}
                    <div className="flex items-center gap-3">
                        {/* Quick buttons */}
                        <div className="hidden sm:flex items-center gap-2">
                            <button onClick={() => setShowAddExpense(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg transition-all hover:bg-accent cursor-pointer shadow-md shadow-primary/10">
                                <Plus className="w-3.5 h-3.5" /> Expense
                            </button>
                            <button onClick={() => setShowAddBill(true)} className="flex items-center gap-1 px-3 py-1.5 border border-accent text-accent text-xs font-bold rounded-lg transition-all hover:bg-accent/10 cursor-pointer">
                                <Plus className="w-3.5 h-3.5" /> Bill
                            </button>
                        </div>

                        {/* User details */}
                        <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-xs text-primary-foreground">AH</div>
                            <button onClick={onLogout} className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer" title="Log Out">
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ─── Main Website Content Area ───────────────────────────────────────── */}
            <main className="max-w-6xl mx-auto w-full px-6 py-10 flex-1 flex flex-col min-h-0 relative">
                {/* Mobile View Navigation Helper */}
                <div className="md:hidden flex items-center justify-around bg-[#251508] border border-border p-1.5 rounded-2xl mb-6 select-none shadow-lg">
                    {[
                        { id: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
                        { id: "expenses", label: "Expenses", icon: <ShoppingBag className="w-4 h-4" /> },
                        { id: "bills", label: "Bills", icon: <Receipt className="w-4 h-4" /> },
                        { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
                    ].map((item) => (
                        <button key={item.id} onClick={() => setTab(item.id as never)} className="flex-1 py-2 flex flex-col items-center gap-1 rounded-xl text-xs font-medium cursor-pointer" style={{ color: tab === item.id ? "#e8a020" : "#a08060" }}>
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={tab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="flex-1 flex flex-col gap-8 min-h-0">
                        {/* ─── TAB: HOME (WEBSITE DESIGN) ─────────────────────────────── */}
                        {tab === "home" && (
                            <>
                                {/* Banner metrics */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 shrink-0">
                                    <MetricCard title="Total Bazar Spent" value={calculations.totalBazar} subtitle={`${calculations.monthEntriesCount} shopping items logged`} color="text-primary" />
                                    <MetricCard title="Monthly Rent & Bills" value={calculations.totalBills} subtitle={`${calculations.monthBillsCount} bills this month`} color="text-accent" />
                                    <MetricCard title="Grand Combined Total" value={calculations.grandTotal} subtitle="All room accounts total" color="text-green-400" />
                                </div>

                                {/* Main Split Panels */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                    {/* Left Column: Settlements & Member splits */}
                                    <div className="lg:col-span-2 flex flex-col gap-6">
                                        <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
                                            <h3 className="text-base font-bold mb-4 font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                                <span>📊</span> Room Splits & Balances
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {calculations.memberSplits.map((s) => {
                                                    const isPositive = s.balance >= 0;
                                                    return (
                                                        <div key={s.user.id} className="p-4 rounded-2xl border border-[rgba(232,160,32,0.08)] bg-[#1a0e07] flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner" style={{ background: avatarColor(s.user.id) }}>
                                                                    {initials(s.user.name)}
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-semibold">{s.user.name}</h4>
                                                                    <p className="text-[10px] text-muted-foreground font-mono">Spent: {fmtFull(s.spent)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className={`text-sm font-bold font-mono ${isPositive ? "text-green-400" : "text-destructive"}`}>
                                                                    {isPositive ? "+" : ""}
                                                                    {fmtFull(s.balance)}
                                                                </p>
                                                                <p className="text-[9px] text-muted-foreground">{isPositive ? "Owed" : "Owes"}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Settlement calculations */}
                                        <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
                                            <h3 className="text-base font-bold mb-4 font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                                <span>💸</span> Who owes Whom
                                            </h3>

                                            {calculations.settlements.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-8">
                                                    <span className="text-3xl mb-2">🎉</span>
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

                                    {/* Right Column: Recent Activity Feed */}
                                    <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col">
                                        <h3 className="text-base font-bold mb-4 font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                            <span>🛒</span> Recent Bazar Logs
                                        </h3>

                                        <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                                            {entries.slice(0, 5).map((e) => (
                                                <div key={e.id} className="p-3.5 rounded-xl bg-[#1a0e07] border border-[rgba(232,160,32,0.06)] flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <span className="text-xl">{e.product.emoji}</span>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-semibold truncate text-[#f5ede2]">{e.product.name}</p>
                                                            <p className="text-[10px] text-muted-foreground font-mono">
                                                                {e.user.name} • {fmtDate(e.date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-xs font-bold text-primary font-mono">৳{(e.price * e.quantity).toLocaleString()}</p>
                                                        <p className="text-[9px] text-muted-foreground font-mono">
                                                            {e.quantity} {e.unit}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ─── TAB: EXPENSES (WEBSITE LIST VIEW) ───────────────────────── */}
                        {tab === "expenses" && (
                            <div className="flex-1 flex flex-col gap-6 min-h-0 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
                                {/* Search & Actions */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 select-none">
                                    <div className="relative w-full sm:w-80">
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

                                {/* Table Feed */}
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
                                                    return e.product.name.toLowerCase().includes(query) || e.user.name.toLowerCase().includes(query) || (e.notes && e.notes.toLowerCase().includes(query));
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
                                                        <td className="p-4 text-right font-mono text-xs">
                                                            {e.quantity} {e.unit}
                                                        </td>
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

                        {/* ─── TAB: BILLS (WEBSITE CARD GRID VIEW) ────────────────────── */}
                        {tab === "bills" && (
                            <div className="flex-1 flex flex-col gap-6 min-h-0 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
                                {/* Search & Actions */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 select-none">
                                    <div className="relative w-full sm:w-80">
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

                                {/* Grid layout */}
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

                        {/* ─── TAB: PROFILE (WEBSITE PROFILE EDITOR) ─────────────────── */}
                        {tab === "profile" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                {/* Edit Profile Panel */}
                                <div className="bg-[#251508] border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                Edit Profile Details
                                            </h3>
                                            <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                Update your contact information
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-center my-2">
                                        <div className="relative cursor-pointer group">
                                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center font-bold text-2xl bg-[#1a0e07]">AH</div>
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                                                <Camera className="w-3.5 h-3.5 text-primary-foreground" />
                                            </div>
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            setProfileLoading(true);
                                            setTimeout(() => setProfileLoading(false), 1200);
                                        }}
                                        className="flex flex-col gap-4"
                                    >
                                        <FieldBox label="Full Name" focused={false}>
                                            <div className="flex items-center">
                                                <span className="pl-4 text-muted-foreground">
                                                    <User className="w-4 h-4" />
                                                </span>
                                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none" />
                                            </div>
                                        </FieldBox>

                                        <FieldBox label="Email Address" focused={false}>
                                            <div className="flex items-center">
                                                <span className="pl-4 text-muted-foreground">
                                                    <Mail className="w-4 h-4" />
                                                </span>
                                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none" />
                                            </div>
                                        </FieldBox>

                                        <FieldBox label="Phone Number" focused={false}>
                                            <div className="flex items-center">
                                                <span className="pl-4 text-muted-foreground">
                                                    <Phone className="w-4 h-4" />
                                                </span>
                                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none" />
                                            </div>
                                        </FieldBox>

                                        <div className="pt-2">
                                            <PrimaryButton loading={profileLoading} label="Save Profile Changes" loadingLabel="Saving changes…" />
                                        </div>
                                    </form>
                                </div>

                                {/* Change Password Panel */}
                                <div className="bg-[#251508] border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                                            <Lock className="w-5 h-5 text-accent" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                Update Account Password
                                            </h3>
                                            <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                Change your password regularly for security
                                            </p>
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            setPassLoading(true);
                                            setTimeout(() => setPassLoading(false), 1200);
                                        }}
                                        className="flex flex-col gap-4"
                                    >
                                        <FieldBox label="Current Password" focused={false}>
                                            <div className="flex items-center">
                                                <span className="pl-4 text-muted-foreground">
                                                    <Lock className="w-4 h-4" />
                                                </span>
                                                <input type="password" required placeholder="••••••••" className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none" />
                                            </div>
                                        </FieldBox>

                                        <FieldBox label="New Password" focused={false}>
                                            <div className="flex items-center">
                                                <span className="pl-4 text-muted-foreground">
                                                    <Lock className="w-4 h-4" />
                                                </span>
                                                <input type="password" required placeholder="Min. 8 characters" className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none" />
                                            </div>
                                        </FieldBox>

                                        <FieldBox label="Repeat New Password" focused={false}>
                                            <div className="flex items-center">
                                                <span className="pl-4 text-muted-foreground">
                                                    <Lock className="w-4 h-4" />
                                                </span>
                                                <input type="password" required placeholder="Re-enter new password" className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none" />
                                            </div>
                                        </FieldBox>

                                        <div className="pt-2">
                                            <PrimaryButton loading={passLoading} label="Reset Password" loadingLabel="Saving changes…" />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Website Dialog: Add Bazar Expense */}
            <Modal show={showAddExpense} onClose={() => setShowAddExpense(false)} title="Add Bazar Expense">
                <AddExpenseForm
                    onSubmit={(prod, price, qty, unit, date, notes) => {
                        handleAddExpense(prod, price, qty, unit, date, notes);
                        setShowAddExpense(false);
                    }}
                    onClose={() => setShowAddExpense(false)}
                />
            </Modal>

            {/* Website Dialog: Add Monthly Bill */}
            <Modal show={showAddBill} onClose={() => setShowAddBill(false)} title="Add Monthly Bill">
                <AddBillForm
                    onSubmit={(cat, title, amount, date, notes) => {
                        handleAddBill(cat, title, amount, date, notes);
                        setShowAddBill(false);
                    }}
                    onClose={() => setShowAddBill(false)}
                />
            </Modal>
        </div>
    );
}

// Stats Card Layout
function MetricCard({ title, value, subtitle, color }: { title: string; value: number; subtitle: string; color: string }) {
    return (
        <div className="bg-[#251508] border border-border rounded-2xl p-6 flex flex-col gap-1.5 relative overflow-hidden shadow-md">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest font-mono">{title}</p>
            <p className={`text-3xl font-black ${color} font-mono`}>{fmt(value)}</p>
            <p className="text-xs text-muted-foreground font-sans">{subtitle}</p>
        </div>
    );
}

// Modal component
function Modal({ show, onClose, title, children }: { show: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="w-full max-w-lg bg-[#251508] border border-border rounded-3xl p-8 relative z-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                                {title}
                            </h3>
                            <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#2e1a0a] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// FieldBox wrapper (mimics original field box style)
function FieldBox({ label, focused, error, children }: { label: string; focused: boolean; error?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">{label}</label>
            <div className="rounded-xl border transition-all duration-200" style={{ borderColor: error ? "rgba(212,24,61,0.6)" : focused ? "rgba(232,160,32,0.7)" : "rgba(232,160,32,0.18)", background: "#2e1a0a" }}>
                {children}
            </div>
            {error && <p className="text-xs text-destructive mt-0.5">{error}</p>}
        </div>
    );
}

// Add forms components (using direct design matching web view)
function AddExpenseForm({ onSubmit, onClose }: { onSubmit: (prod: string, price: number, qty: number, unit: BazarUnit, date: string, notes: string) => void; onClose: () => void }) {
    const [product, setProduct] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState<BazarUnit>("KG");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!product || !price || !quantity) return;
        onSubmit(product, Number(price), Number(quantity), unit, date, notes);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Product Name</label>
                <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} required placeholder="e.g. Rice, Hilsha Fish, Onion" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Price (৳)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0.00" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-mono" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Quantity</label>
                    <input type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} required placeholder="e.g. 2, 1.5" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-mono" />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Unit</label>
                <div className="flex gap-2">
                    {(["KG", "PIECE", "GM"] as BazarUnit[]).map((u) => (
                        <button
                            key={u}
                            type="button"
                            onClick={() => setUnit(u)}
                            className="flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer font-mono"
                            style={{ borderColor: unit === u ? "rgba(232,160,32,0.8)" : "rgba(232,160,32,0.18)", background: unit === u ? "rgba(232,160,32,0.15)" : "#2e1a0a", color: unit === u ? "#e8a020" : "#a08060" }}
                        >
                            {u}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Purchase Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground font-mono" style={{ colorScheme: "dark" }} />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Add purchase details..." className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none resize-none" />
            </div>
            <div className="flex gap-3 mt-4">
                <button type="button" onClick={onClose} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl transition-all hover:bg-secondary cursor-pointer">
                    Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:bg-accent cursor-pointer">
                    Save Entry
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

    const BILL_CATEGORIES_LIST = Object.entries(BILL_META).map(([k, v]) => ({ key: k as BillCategory, label: v.label }));

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as BillCategory)} className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-sans" style={{ colorScheme: "dark" }}>
                        {BILL_CATEGORIES_LIST.map((c) => (
                            <option key={c.key} value={c.key}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Amount (৳)</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="0.00" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-mono" />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Bill Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. July House Rent, Wi-Fi Bill" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Billing Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground font-mono" style={{ colorScheme: "dark" }} />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Add billing details..." className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none resize-none" />
            </div>
            <div className="flex gap-3 mt-4">
                <button type="button" onClick={onClose} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl transition-all hover:bg-secondary cursor-pointer">
                    Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:bg-accent cursor-pointer">
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
