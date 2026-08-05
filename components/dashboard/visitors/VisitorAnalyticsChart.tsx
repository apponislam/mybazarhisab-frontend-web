"use client";

import { BarChart2, Globe, Smartphone, ShieldCheck } from "lucide-react";

interface VisitorAnalyticsChartProps {
    stats?: any;
    days: number;
}

export function VisitorAnalyticsChart({ stats, days }: VisitorAnalyticsChartProps) {
    const total = stats?.totalVisits ?? 0;

    const breakdown = stats?.allTimePlatformBreakdown || stats?.todayPlatformBreakdown || {};
    const web = breakdown?.WEB?.visits ?? 0;
    const android = breakdown?.ANDROID?.visits ?? 0;
    const ios = breakdown?.IOS?.visits ?? 0;
    const app = breakdown?.APP?.visits ?? 0;

    const webPct = total > 0 ? ((web / total) * 100).toFixed(1) : "0";
    const androidPct = total > 0 ? (((android + app) / total) * 100).toFixed(1) : "0";
    const iosPct = total > 0 ? ((ios / total) * 100).toFixed(1) : "0";

    const dailyTrend = stats?.dailyTrend || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start font-sans">
            {/* Platform Distribution Bar */}
            <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-primary" /> Platform Breakdown ({days} Days)
                    </h3>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-mono font-semibold">
                        <ShieldCheck className="w-4 h-4" /> Live Metrics
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Web */}
                    <div className="flex flex-col gap-1.5 font-mono text-xs">
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-foreground font-semibold">
                                <Globe className="w-4 h-4 text-blue-400" /> Web Browser
                            </span>
                            <span className="text-blue-400 font-bold">
                                {web.toLocaleString()} ({webPct}%)
                            </span>
                        </div>
                        <div className="w-full h-3 bg-[#1a0e07] border border-border rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${webPct}%` }} />
                        </div>
                    </div>

                    {/* Android */}
                    <div className="flex flex-col gap-1.5 font-mono text-xs">
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-foreground font-semibold">
                                <Smartphone className="w-4 h-4 text-green-400" /> Android App
                            </span>
                            <span className="text-green-400 font-bold">
                                {(android + app).toLocaleString()} ({androidPct}%)
                            </span>
                        </div>
                        <div className="w-full h-3 bg-[#1a0e07] border border-border rounded-full overflow-hidden">
                            <div className="h-full bg-green-400 transition-all duration-500" style={{ width: `${androidPct}%` }} />
                        </div>
                    </div>

                    {/* iOS */}
                    <div className="flex flex-col gap-1.5 font-mono text-xs">
                        <div className="flex justify-between items-center">
                            <span className="flex items-center gap-2 text-foreground font-semibold">
                                <Smartphone className="w-4 h-4 text-accent" /> iOS App
                            </span>
                            <span className="text-accent font-bold">
                                {ios.toLocaleString()} ({iosPct}%)
                            </span>
                        </div>
                        <div className="w-full h-3 bg-[#1a0e07] border border-border rounded-full overflow-hidden">
                            <div className="h-full bg-accent transition-all duration-500" style={{ width: `${iosPct}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Trend List */}
            <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-5">
                <h3 className="text-sm font-bold font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <span>📈</span> Daily Visitor Trend ({dailyTrend.length} Days)
                </h3>

                {dailyTrend.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground font-mono bg-[#1a0e07] border border-border rounded-2xl">No visitor trend logs recorded yet for this timeframe.</div>
                ) : (
                    <div className="space-y-3 font-mono text-xs max-h-64 overflow-y-auto pr-1">
                        {dailyTrend.map((item: any, idx: number) => (
                            <div key={idx} className="p-3 bg-[#1a0e07] border border-border rounded-2xl flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-foreground">{item.date || `Day ${idx + 1}`}</p>
                                    <p className="text-[10px] text-muted-foreground">{item.unique || 0} unique visitors</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary">{(item.visits || item.count || 0).toLocaleString()} views</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
