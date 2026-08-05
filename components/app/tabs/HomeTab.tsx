import React from "react";
import { motion } from "motion/react";
import { ChevronUp, ChevronDown, ShoppingBag, Star, Calendar, TrendingUp, Minus, BookOpen, Package, Receipt, BarChart2 } from "lucide-react";
import { GroupStats } from "@/types";
import { SectionLabel } from "@/components/app/ui/Shared";
import { fmt } from "@/lib/mockData";

const now = new Date();

function Delta({ current, prev }: { current: number; prev: number }) {
    if (prev === 0) return null;
    const pct = Math.round(((current - prev) / prev) * 100);
    const up = pct >= 0;
    return (
        <span className="flex items-center gap-0.5 text-xs font-medium font-mono" style={{ color: up ? "#22c55e" : "#ef4444" }}>
            {up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {Math.abs(pct)}%
        </span>
    );
}

function LoadingDots({ currency = true }: { currency?: boolean }) {
    return (
        <span className="inline-flex items-center gap-1 font-mono font-bold">
            {currency && <span>৳</span>}
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </span>
    );
}

function StatCard({ label, value, prev, icon, delay = 0, accent = false, isLoading = false }: { label: string; value: number; prev?: number; icon: React.ReactNode; delay?: number; accent?: boolean; isLoading?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-2 transition-shadow hover:shadow-2xl"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.35)" }}
        >
            <div className="flex items-center justify-between">
                <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 350, damping: 15 }}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent ? "bg-accent/20 border border-accent/30 text-accent" : "bg-primary/12 border border-primary/25 text-primary"}`}
                >
                    {icon}
                </motion.div>
                {!isLoading && prev !== undefined && <Delta current={value} prev={prev} />}
            </div>
            <div className="min-h-[2rem] flex items-center text-2xl font-bold text-foreground font-mono">
                {isLoading ? <LoadingDots currency /> : <p>{fmt(value)}</p>}
            </div>
            <p className="text-xs text-muted-foreground leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {label}
            </p>
        </motion.div>
    );
}

function CountCard({ label, value, icon, delay = 0, isLoading = false }: { label: string; value: number; icon: React.ReactNode; delay?: number; isLoading?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3 transition-shadow hover:shadow-2xl"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.35)" }}
        >
            <motion.div whileHover={{ scale: 1.2, rotate: -10 }} transition={{ type: "spring", stiffness: 350, damping: 15 }} className="w-10 h-10 rounded-xl bg-primary/12 border border-primary/25 flex items-center justify-center shrink-0 text-primary">
                {icon}
            </motion.div>
            <div>
                <div className="min-h-[1.75rem] flex items-center text-xl font-bold text-foreground font-mono">
                    {isLoading ? <LoadingDots currency={false} /> : <p>{value.toLocaleString()}</p>}
                </div>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {label}
                </p>
            </div>
        </motion.div>
    );
}

export function HomeTab({ stats, isLoading = false }: { stats: GroupStats; isLoading?: boolean }) {
    const mn = now.toLocaleString("default", { month: "long" }),
        yr = now.getFullYear();
    return (
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center gap-3 px-6 pt-4 pb-4 shrink-0">
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-foreground truncate" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        {stats.groupName}
                    </h1>
                    <p className="text-muted-foreground text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Hisab Overview
                    </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10">
                    <Star className="w-3 h-3 text-primary" strokeWidth={2} />
                    <span className="text-primary text-xs font-semibold font-mono">{stats.totalMembers} members</span>
                </div>
            </div>
            <div className="mx-6 h-px bg-border mb-1 shrink-0" />
            <div className="flex flex-col px-6 pb-6 gap-4">
                {/* 1. Total Expense */}
                <SectionLabel>Total Expense</SectionLabel>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="rounded-2xl border border-primary/40 p-5 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, rgba(232,160,32,0.14) 0%, rgba(192,96,16,0.08) 100%)", boxShadow: "0 4px 24px rgba(232,160,32,0.15)" }}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 -translate-y-8 translate-x-8 pointer-events-none" />
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-mono">
                        {mn} {yr} — Total
                    </p>
                    <div className="min-h-[2.5rem] flex items-center mb-2 text-4xl font-bold text-primary font-mono">
                        {isLoading ? <LoadingDots currency /> : <p>{fmt(stats.thisMonthTotalExpense)}</p>}
                    </div>
                    {!isLoading && (
                        <div className="flex items-center gap-2">
                            <Delta current={stats.thisMonthTotalExpense} prev={stats.prevMonthTotalExpense} />
                            <span className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                vs {fmt(stats.prevMonthTotalExpense)} last month
                            </span>
                        </div>
                    )}
                </motion.div>
                <div className="grid grid-cols-2 gap-3">
                    <StatCard label={`${yr} Grand Total`} value={stats.thisYearTotalExpense} prev={stats.prevYearTotalExpense} icon={<TrendingUp className="w-4 h-4 text-primary" strokeWidth={1.8} />} delay={0.1} isLoading={isLoading} />
                    <StatCard label={`${yr - 1} Grand Total`} value={stats.prevYearTotalExpense} icon={<Minus className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.15} isLoading={isLoading} />
                </div>

                {/* 2. Bazar Expense */}
                <SectionLabel>Bazar Expense</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                    <StatCard label={`${mn} Bazar`} value={stats.thisMonthBazarExpense} prev={stats.prevMonthBazarExpense} icon={<ShoppingBag className="w-4 h-4 text-primary" strokeWidth={1.8} />} delay={0.2} isLoading={isLoading} />
                    <StatCard label="Prev Month" value={stats.prevMonthBazarExpense} icon={<ShoppingBag className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.25} isLoading={isLoading} />
                    <StatCard label={`${yr} Bazar`} value={stats.thisYearBazarExpense} prev={stats.prevYearBazarExpense} icon={<Calendar className="w-4 h-4 text-primary" strokeWidth={1.8} />} delay={0.3} isLoading={isLoading} />
                    <StatCard label={`${yr - 1} Bazar`} value={stats.prevYearBazarExpense} icon={<Calendar className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.35} isLoading={isLoading} />
                </div>

                {/* 3. Bill Expense */}
                <SectionLabel>Bill Expense</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                    <StatCard label={`${mn} Bills`} value={stats.thisMonthBillExpense} prev={stats.prevMonthBillExpense} icon={<Receipt className="w-4 h-4 text-accent" strokeWidth={1.8} />} delay={0.38} accent isLoading={isLoading} />
                    <StatCard label="Prev Month" value={stats.prevMonthBillExpense} icon={<Receipt className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.41} accent isLoading={isLoading} />
                    <StatCard label={`${yr} Bills`} value={stats.thisYearBillExpense} prev={stats.prevYearBillExpense} icon={<BarChart2 className="w-4 h-4 text-accent" strokeWidth={1.8} />} delay={0.44} accent isLoading={isLoading} />
                    <StatCard label={`${yr - 1} Bills`} value={stats.prevYearBillExpense} icon={<BarChart2 className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.47} accent isLoading={isLoading} />
                </div>

                {/* 4. Group Entries */}
                <SectionLabel>Group Entries</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                    <CountCard label="Group Bazar Entries" value={stats.totalGroupBazarEntries} icon={<ShoppingBag className="w-5 h-5 text-primary" strokeWidth={1.8} />} delay={0.5} isLoading={isLoading} />
                    <CountCard label="My Bazar Entries" value={stats.totalMyBazarEntries} icon={<BookOpen className="w-5 h-5 text-primary" strokeWidth={1.8} />} delay={0.55} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
export default HomeTab;
