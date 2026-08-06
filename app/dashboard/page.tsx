"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, UsersRound, Package, ShoppingBag, Receipt, Eye, Monitor, Smartphone, TrendingUp, DollarSign, Calendar, RefreshCw, ChevronDown } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AdminMonthlyAnalysisChart } from "@/components/dashboard/AdminMonthlyAnalysisChart";
import { AddExpenseModal } from "@/components/dashboard/expenses/AddExpenseModal";
import { AddBillModal } from "@/components/dashboard/bills/AddBillModal";
import { useGetAdminDashboardStatsQuery, useGetAdminMonthlyAnalysisQuery } from "@/redux/features/dashboard/dashboardApi";
import { fmt } from "@/lib/mockData";

export default function DashboardPage() {
    const router = useRouter();
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddBill, setShowAddBill] = useState(false);

    const { data: adminStatsResponse, isLoading } = useGetAdminDashboardStatsQuery();
    const stats = adminStatsResponse?.data;

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

    if (isDesktop === null) {
        return (
            <div className="min-h-screen bg-[#1a0e07] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            <DashboardSidebar activeTab="overview" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            <main className="flex-1 flex flex-col min-w-0 relative">
                <DashboardHeader title="Admin Dashboard Overview" onAddExpense={() => setShowAddExpense(true)} onAddBill={() => setShowAddBill(true)} />

                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                    {/* Key Totals Row */}
                    <div>
                        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-mono mb-4">Platform Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                            <AdminStatCard icon={<Users className="w-5 h-5 text-primary" />} label="Total Users" value={stats?.totalUsers ?? 0} isLoading={isLoading} />
                            <AdminStatCard icon={<UsersRound className="w-5 h-5 text-primary" />} label="Total Groups" value={stats?.totalGroups ?? 0} isLoading={isLoading} />
                            <AdminStatCard icon={<Package className="w-5 h-5 text-primary" />} label="Total Products" value={stats?.totalProducts ?? 0} isLoading={isLoading} />
                            <AdminStatCard icon={<ShoppingBag className="w-5 h-5 text-primary" />} label="Bazar Entries" value={stats?.totalBazarEntries ?? 0} isLoading={isLoading} />
                            <AdminStatCard icon={<Receipt className="w-5 h-5 text-accent" />} label="Total Bills" value={stats?.totalBills ?? 0} isLoading={isLoading} />
                        </div>
                    </div>

                    {/* Financial Averages & Totals */}
                    <div>
                        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-mono mb-4">Financial Insights</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <AdminMetricCard title="Avg Bazar Entry" value={fmt(stats?.averageBazarEntry ?? 0)} subtitle="Average price per logged item" color="text-primary" isLoading={isLoading} />
                            <AdminMetricCard title="Total Bill Amount" value={fmt(stats?.totalBillAmount ?? 0)} subtitle="Sum of all bill entries" color="text-accent" isLoading={isLoading} />
                            <AdminMetricCard title="Avg Bill Amount" value={fmt(stats?.averageBillAmount ?? 0)} subtitle="Average amount per bill" color="text-green-400" isLoading={isLoading} />
                        </div>
                    </div>

                    {/* Visitors Analytics Section */}
                    <div>
                        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-mono mb-4">Traffic & Visitors</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Today's Traffic Card */}
                            <div className="bg-[#251508] border border-border rounded-2xl p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-2 border-b border-border pb-3">
                                    <Eye className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-muted-foreground">Today Visitor Traffic</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Visits</p>
                                        <p className="text-2xl font-bold font-mono text-primary">{isLoading ? "..." : (stats?.visitors?.todayTotalVisits ?? 0).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Unique Visitors</p>
                                        <p className="text-2xl font-bold font-mono text-foreground">{isLoading ? "..." : (stats?.visitors?.todayUniqueVisitors ?? 0).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="h-px bg-border/50" />
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-1.5 text-muted-foreground"><Monitor className="w-3.5 h-3.5" /> Web Visits</span>
                                        <span className="font-mono font-bold">{stats?.visitors?.todayWebVisits ?? 0} ({stats?.visitors?.todayWebUnique ?? 0} unique)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-1.5 text-muted-foreground"><Smartphone className="w-3.5 h-3.5" /> App Visits</span>
                                        <span className="font-mono font-bold">{stats?.visitors?.todayAppVisits ?? 0} ({stats?.visitors?.todayAppUnique ?? 0} unique)</span>
                                    </div>
                                </div>
                            </div>

                            {/* All Time Traffic Card */}
                            <div className="bg-[#251508] border border-border rounded-2xl p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-2 border-b border-border pb-3">
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                    <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-muted-foreground">All-Time Traffic</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Visits</p>
                                        <p className="text-2xl font-bold font-mono text-green-400">{isLoading ? "..." : (stats?.visitors?.totalVisits ?? 0).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Unique Visitors</p>
                                        <p className="text-2xl font-bold font-mono text-foreground">{isLoading ? "..." : (stats?.visitors?.totalUniqueVisitors ?? 0).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="h-px bg-border/50" />
                                <div className="text-xs text-muted-foreground">
                                    <p className="font-semibold text-foreground mb-2">Platform Breakdown:</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <Monitor className="w-3.5 h-3.5 text-primary" />
                                            <span>Web: <strong className="text-foreground font-mono">{stats?.visitors?.allTimePlatformBreakdown?.web ?? 0}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Smartphone className="w-3.5 h-3.5 text-accent" />
                                            <span>App: <strong className="text-foreground font-mono">{stats?.visitors?.allTimePlatformBreakdown?.app ?? 0}</strong></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Daily Trend Summary Card */}
                            <div className="bg-[#251508] border border-border rounded-2xl p-6 flex flex-col gap-4">
                                <div className="flex items-center gap-2 border-b border-border pb-3">
                                    <Eye className="w-4 h-4 text-accent" />
                                    <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-muted-foreground">Recent Visitor Log</h3>
                                </div>
                                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                                    {isLoading ? (
                                        <p className="text-xs text-muted-foreground">Loading trend data...</p>
                                    ) : stats?.visitors?.dailyTrend && stats.visitors.dailyTrend.length > 0 ? (
                                        stats.visitors.dailyTrend.slice(0, 5).map((trend: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-center text-xs py-1.5 px-2 bg-[#1a0e07] rounded-lg border border-border/40">
                                                <span className="font-mono text-muted-foreground">{trend.date || trend._id}</span>
                                                <span className="font-mono font-bold text-primary">{trend.totalVisits ?? trend.count ?? 0} visits</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-muted-foreground">No recent trend logs</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Monthly Analysis Line Chart & Breakdown */}
                    <AdminMonthlyAnalysisChart />
                </div>
            </main>

            <AddExpenseModal show={showAddExpense} onClose={() => setShowAddExpense(false)} />
            <AddBillModal show={showAddBill} onClose={() => setShowAddBill(false)} />
        </div>
    );
}

function AdminStatCard({ icon, label, value, isLoading }: { icon: React.ReactNode; label: string; value: number; isLoading: boolean }) {
    return (
        <div className="bg-[#251508] border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-xl font-bold font-mono text-foreground">{isLoading ? "..." : value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground font-sans">{label}</p>
            </div>
        </div>
    );
}

function AdminMetricCard({ title, value, subtitle, color, isLoading }: { title: string; value: string; subtitle: string; color: string; isLoading: boolean }) {
    return (
        <div className="bg-[#251508] border border-border rounded-2xl p-6 flex flex-col gap-1.5 relative overflow-hidden shadow-md">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest font-mono">{title}</p>
            <p className={`text-3xl font-black ${color} font-mono`}>{isLoading ? "..." : value}</p>
            <p className="text-xs text-muted-foreground font-sans">{subtitle}</p>
        </div>
    );
}
