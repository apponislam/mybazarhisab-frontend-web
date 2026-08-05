"use client";

import React from "react";
import { Users, Eye, Globe, Smartphone, Calendar, TrendingUp } from "lucide-react";

interface VisitorStatsGridProps {
    days: number;
    onDaysChange: (days: number) => void;
    stats?: any;
    isLoading: boolean;
}

export function VisitorStatsGrid({ days, onDaysChange, stats, isLoading }: VisitorStatsGridProps) {
    const totalVisits = stats?.totalVisits ?? 0;
    const uniqueVisitors = stats?.totalUniqueVisitors ?? 0;

    const platformData = stats?.allTimePlatformBreakdown || stats?.todayPlatformBreakdown || {};
    const webVisits = platformData?.WEB?.visits ?? 0;
    const appVisits = (platformData?.APP?.visits ?? 0) + (platformData?.ANDROID?.visits ?? 0) + (platformData?.IOS?.visits ?? 0);

    const todayTotal = stats?.todayTotalVisits ?? 0;
    const todayUnique = stats?.todayUniqueVisitors ?? 0;

    return (
        <div className="flex flex-col gap-6 font-sans">
            {/* Filter Toolbar */}
            <div className="bg-[#251508] border border-border rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <div>
                        <h3 className="text-sm font-bold text-foreground">Traffic Insights Overview</h3>
                        <p className="text-xs text-muted-foreground font-mono">
                            Today: <span className="text-primary font-bold">{todayTotal}</span> visits (<span className="text-accent font-bold">{todayUnique}</span> unique)
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-[#1a0e07] border border-border rounded-xl p-1.5 text-xs font-mono text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary ml-1" />
                    <span>Timeframe:</span>
                    {[7, 30, 90].map((d) => (
                        <button
                            key={d}
                            onClick={() => onDaysChange(d)}
                            className="px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer"
                            style={{
                                background: days === d ? "#e8a020" : "transparent",
                                color: days === d ? "#1a0e07" : "#a08060",
                            }}
                        >
                            Last {d} Days
                        </button>
                    ))}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl border border-border bg-[#251508] shadow-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Total Page Views</span>
                        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                            <Eye className="w-5 h-5" />
                        </div>
                    </div>
                    <h4 className="text-3xl font-extrabold font-mono text-primary mt-3">{isLoading ? "…" : totalVisits.toLocaleString()}</h4>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1">Recorded over last {days} days</p>
                </div>

                <div className="p-6 rounded-3xl border border-border bg-[#251508] shadow-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Unique Visitors</span>
                        <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <h4 className="text-3xl font-extrabold font-mono text-accent mt-3">{isLoading ? "…" : uniqueVisitors.toLocaleString()}</h4>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1">Distinct user devices & IPs</p>
                </div>

                <div className="p-6 rounded-3xl border border-border bg-[#251508] shadow-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Web Traffic</span>
                        <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                            <Globe className="w-5 h-5" />
                        </div>
                    </div>
                    <h4 className="text-3xl font-extrabold font-mono text-blue-400 mt-3">{isLoading ? "…" : webVisits.toLocaleString()}</h4>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1">Desktop & browser visitors</p>
                </div>

                <div className="p-6 rounded-3xl border border-border bg-[#251508] shadow-xl flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Mobile App Traffic</span>
                        <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/30 flex items-center justify-center text-green-400">
                            <Smartphone className="w-5 h-5" />
                        </div>
                    </div>
                    <h4 className="text-3xl font-extrabold font-mono text-green-400 mt-3">{isLoading ? "…" : appVisits.toLocaleString()}</h4>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1">Android & iOS mobile visits</p>
                </div>
            </div>
        </div>
    );
}
