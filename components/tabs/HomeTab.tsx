import React from "react";
import { motion } from "motion/react";
import { ChevronUp, ChevronDown, ShoppingBag, Star, Calendar, TrendingUp, Minus, BookOpen, Package, Receipt, BarChart2 } from "lucide-react";
import { GroupStats } from "@/types";
import { SectionLabel } from "@/components/ui/Shared";
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

function StatCard({ label, value, prev, icon, delay = 0, accent = false }: { label: string; value: number; prev?: number; icon: React.ReactNode; delay?: number; accent?: boolean }) {
    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="rounded-2xl border border-border bg-card p-4 flex flex-col gap-2" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.35)" }}>
            <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent ? "bg-accent/20 border border-accent/30" : "bg-primary/12 border border-primary/25"}`}>{icon}</div>
                {prev !== undefined && <Delta current={value} prev={prev} />}
            </div>
            <p className="text-2xl font-bold text-foreground font-mono">{fmt(value)}</p>
            <p className="text-xs text-muted-foreground leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {label}
            </p>
        </motion.div>
    );
}

function CountCard({ label, value, icon, delay = 0 }: { label: string; value: number; icon: React.ReactNode; delay?: number }) {
    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.35)" }}>
            <div className="w-10 h-10 rounded-xl bg-primary/12 border border-primary/25 flex items-center justify-center shrink-0">{icon}</div>
            <div>
                <p className="text-xl font-bold text-foreground font-mono">{value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {label}
                </p>
            </div>
        </motion.div>
    );
}

export function HomeTab({ stats }: { stats: GroupStats }) {
    const mn = now.toLocaleString("default", { month: "long" }),
        yr = now.getFullYear();
    return (
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
            <div className="flex items-center gap-3 px-6 pt-12 pb-4 shrink-0">
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
                <SectionLabel>Overview</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                    <CountCard label="Group Bazar Entries" value={stats.totalGroupBazarEntries} icon={<ShoppingBag className="w-5 h-5 text-primary" strokeWidth={1.8} />} delay={0.05} />
                    <CountCard label="My Bazar Entries" value={stats.totalMyBazarEntries} icon={<BookOpen className="w-5 h-5 text-primary" strokeWidth={1.8} />} delay={0.1} />
                </div>
                <CountCard label="Products Created by Me" value={stats.totalProductsCreatedByMe} icon={<Package className="w-5 h-5 text-primary" strokeWidth={1.8} />} delay={0.15} />
                <SectionLabel>Bazar Expense</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                    <StatCard label={`${mn} Bazar`} value={stats.thisMonthBazarExpense} prev={stats.prevMonthBazarExpense} icon={<ShoppingBag className="w-4 h-4 text-primary" strokeWidth={1.8} />} delay={0.2} />
                    <StatCard label="Prev Month" value={stats.prevMonthBazarExpense} icon={<ShoppingBag className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.25} />
                    <StatCard label={`${yr} Bazar`} value={stats.thisYearBazarExpense} prev={stats.prevYearBazarExpense} icon={<Calendar className="w-4 h-4 text-primary" strokeWidth={1.8} />} delay={0.3} />
                    <StatCard label={`${yr - 1} Bazar`} value={stats.prevYearBazarExpense} icon={<Calendar className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.35} />
                </div>
                <SectionLabel>Bill Expense</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                    <StatCard label={`${mn} Bills`} value={stats.thisMonthBillExpense} prev={stats.prevMonthBillExpense} icon={<Receipt className="w-4 h-4 text-accent" strokeWidth={1.8} />} delay={0.38} accent />
                    <StatCard label="Prev Month" value={stats.prevMonthBillExpense} icon={<Receipt className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.41} accent />
                    <StatCard label={`${yr} Bills`} value={stats.thisYearBillExpense} prev={stats.prevYearBillExpense} icon={<BarChart2 className="w-4 h-4 text-accent" strokeWidth={1.8} />} delay={0.44} accent />
                    <StatCard label={`${yr - 1} Bills`} value={stats.prevYearBillExpense} icon={<BarChart2 className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.47} accent />
                </div>
                <SectionLabel>Total Expense</SectionLabel>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl border border-primary/40 p-5 relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, rgba(232,160,32,0.14) 0%, rgba(192,96,16,0.08) 100%)", boxShadow: "0 4px 24px rgba(232,160,32,0.15)" }}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 -translate-y-8 translate-x-8 pointer-events-none" />
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest font-mono">
                        {mn} {yr} — Total
                    </p>
                    <p className="text-4xl font-bold text-primary mb-2 font-mono">{fmt(stats.thisMonthTotalExpense)}</p>
                    <div className="flex items-center gap-2">
                        <Delta current={stats.thisMonthTotalExpense} prev={stats.prevMonthTotalExpense} />
                        <span className="text-xs text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                            vs {fmt(stats.prevMonthTotalExpense)} last month
                        </span>
                    </div>
                </motion.div>
                <div className="grid grid-cols-2 gap-3">
                    <StatCard label={`${yr} Grand Total`} value={stats.thisYearTotalExpense} prev={stats.prevYearTotalExpense} icon={<TrendingUp className="w-4 h-4 text-primary" strokeWidth={1.8} />} delay={0.54} />
                    <StatCard label={`${yr - 1} Grand Total`} value={stats.prevYearTotalExpense} icon={<Minus className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />} delay={0.58} />
                </div>
            </div>
        </div>
    );
}
export default HomeTab;
