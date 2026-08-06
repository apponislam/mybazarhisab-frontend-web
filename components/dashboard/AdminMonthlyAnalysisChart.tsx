"use client";

import React, { useState } from "react";
import { Calendar, RefreshCw, ChevronDown, TrendingUp, ShoppingBag, Receipt, Users, UsersRound, Package } from "lucide-react";
import { useGetAdminMonthlyAnalysisQuery } from "@/redux/features/dashboard/dashboardApi";

export function AdminMonthlyAnalysisChart() {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [isYearOpen, setIsYearOpen] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    const { data: analysisRes, isLoading, isFetching, refetch } = useGetAdminMonthlyAnalysisQuery({ year: selectedYear });
    const analysisData = analysisRes?.data?.analysis || [];

    const availableYears = Array.from({ length: 12 }, (_, i) => currentYear + 1 - i);

    const maxVal = Math.max(...analysisData.map((d) => d.totalExpense || 0), 100);
    const maxCountVal = Math.max(...analysisData.map((d) => Math.max(d.usersRegistered || 0, d.groupsCreated || 0, d.productsCreated || 0)), 10);

    const svgW = 840;
    const svgH = 240;
    const padLeft = 45;
    const padRight = 20;
    const padTop = 30;
    const padBottom = 35;
    const chartW = svgW - padLeft - padRight;
    const chartH = svgH - padTop - padBottom;

    const points = analysisData.map((d, i) => {
        const x = padLeft + (i / (analysisData.length - 1 || 1)) * chartW;
        const yTotal = padTop + chartH - ((d.totalExpense || 0) / maxVal) * chartH;
        const yBazar = padTop + chartH - ((d.bazarExpense || 0) / maxVal) * chartH;
        const yBill = padTop + chartH - ((d.billExpense || 0) / maxVal) * chartH;
        const yUsers = padTop + chartH - ((d.usersRegistered || 0) / maxCountVal) * chartH;
        const yGroups = padTop + chartH - ((d.groupsCreated || 0) / maxCountVal) * chartH;
        const yProducts = padTop + chartH - ((d.productsCreated || 0) / maxCountVal) * chartH;
        return { x, yTotal, yBazar, yBill, yUsers, yGroups, yProducts, item: d, idx: i };
    });

    const pathTotal = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yTotal}`).join(" ");
    const areaTotal = points.length > 0 ? `${pathTotal} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z` : "";
    const pathBazar = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yBazar}`).join(" ");
    const pathBill = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yBill}`).join(" ");
    const pathUsers = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yUsers}`).join(" ");
    const pathGroups = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yGroups}`).join(" ");
    const pathProducts = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yProducts}`).join(" ");

    const currentMonthNum = new Date().getMonth() + 1;
    const activePoint = hoveredIdx !== null ? points[hoveredIdx] : points.find((p) => p.item.monthNumber === currentMonthNum) || points[points.length - 1] || null;

    return (
        <div className="bg-[#251508] border border-border rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-foreground uppercase tracking-widest font-mono">
                            Admin Monthly Analysis ({selectedYear})
                        </h2>
                        <p className="text-xs text-muted-foreground font-mono">12-Month trend analysis across expenses, users, groups & products</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Custom Styled Year Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsYearOpen((prev) => !prev)}
                            className="flex items-center gap-2 bg-[#1a0e07] border border-border hover:border-primary/50 rounded-xl px-3.5 py-1.5 text-xs font-mono text-foreground transition-colors cursor-pointer select-none"
                        >
                            <span className="text-muted-foreground">Year:</span>
                            <span className="font-bold text-primary">{selectedYear}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isYearOpen ? "rotate-180 text-primary" : ""}`} />
                        </button>

                        {isYearOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsYearOpen(false)} />
                                <div className="absolute right-0 mt-2 w-36 bg-[#251508] border border-border rounded-xl shadow-2xl py-1.5 z-50 max-h-60 overflow-y-auto divide-y divide-border/20 font-mono">
                                    {availableYears.map((yr) => (
                                        <button
                                            key={yr}
                                            type="button"
                                            onClick={() => {
                                                setSelectedYear(yr);
                                                setIsYearOpen(false);
                                            }}
                                            className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                                selectedYear === yr ? "bg-primary/15 text-primary" : "text-foreground hover:bg-white/5"
                                            }`}
                                        >
                                            <span>{yr}</span>
                                            {selectedYear === yr && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => refetch()}
                        className="p-2 rounded-xl border border-border bg-[#1a0e07] hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                        title="Refresh monthly analysis"
                    >
                        <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Legend & Stats Overview - All 6 Metrics Included */}
            <div className="flex items-center gap-4 bg-[#1a0e07] border border-border/80 px-4 py-2.5 rounded-2xl text-xs font-mono mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#e8a020] shadow-sm shadow-[#e8a020]" />
                    <span className="text-foreground font-bold">Total Exp</span>
                </div>
                <div className="w-px h-3 bg-border/60" />
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                    <span className="text-muted-foreground">Bazar Exp</span>
                </div>
                <div className="w-px h-3 bg-border/60" />
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                    <span className="text-muted-foreground">Bill Exp</span>
                </div>
                <div className="w-px h-3 bg-border/60" />
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
                    <span className="text-muted-foreground">Users</span>
                </div>
                <div className="w-px h-3 bg-border/60" />
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
                    <span className="text-muted-foreground">Groups</span>
                </div>
                <div className="w-px h-3 bg-border/60" />
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                    <span className="text-muted-foreground">Products</span>
                </div>
            </div>

            {/* SVG Line Chart */}
            <div className="relative w-full overflow-x-auto select-none py-2">
                {isLoading ? (
                    <div className="h-60 rounded-2xl bg-[#1a0e07] animate-pulse flex items-center justify-center text-xs font-mono text-muted-foreground">
                        Loading monthly analysis line chart…
                    </div>
                ) : (
                    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto min-w-[680px] overflow-visible">
                        <defs>
                            <linearGradient id="adminMonthlyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#e8a020" stopOpacity="0.2" />
                                <stop offset="60%" stopColor="#e8a020" stopOpacity="0.04" />
                                <stop offset="100%" stopColor="#e8a020" stopOpacity="0.0" />
                            </linearGradient>
                        </defs>

                        {/* Y-Axis Grid Lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                            const y = padTop + chartH * ratio;
                            const val = Math.round(maxVal * (1 - ratio));
                            return (
                                <g key={ratio}>
                                    <line x1={padLeft} y1={y} x2={svgW - padRight} y2={y} stroke="rgba(232,160,32,0.08)" strokeDasharray="5 5" />
                                    <text x={padLeft - 10} y={y + 3.5} textAnchor="end" fill="#a08060" fontSize="10" fontFamily="monospace" fontWeight="600">
                                        ৳{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Area Fill */}
                        {areaTotal && <path d={areaTotal} fill="url(#adminMonthlyAreaGrad)" pointerEvents="none" />}

                        {/* Thin Solid Metric Lines */}
                        {pathUsers && <path d={pathUsers} fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 2" opacity="0.85" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />}
                        {pathGroups && <path d={pathGroups} fill="none" stroke="#ec4899" strokeWidth="1" strokeDasharray="3 2" opacity="0.85" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />}
                        {pathProducts && <path d={pathProducts} fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" opacity="0.85" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />}
                        {pathBazar && <path d={pathBazar} fill="none" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />}
                        {pathBill && <path d={pathBill} fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />}
                        {pathTotal && <path d={pathTotal} fill="none" stroke="#e8a020" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />}

                        {/* Hover Overlay Columns & Points */}
                        {points.map((p) => {
                            const isHovered = hoveredIdx === p.idx;

                            const tooltipW = 175;
                            const tooltipH = 115;
                            const tooltipX = Math.min(Math.max(p.x - tooltipW / 2, 10), svgW - tooltipW - 10);
                            const tooltipY = Math.max(p.yTotal - tooltipH - 12, 10);

                            return (
                                <g key={p.idx} onMouseEnter={() => setHoveredIdx(p.idx)} onMouseLeave={() => setHoveredIdx(null)}>
                                    {/* Invisible full-height hit area rectangle to prevent flicker on hover */}
                                    <rect x={p.x - 20} y={0} width="40" height={svgH} fill="transparent" className="cursor-pointer" />

                                    {isHovered && <line x1={p.x} y1={padTop} x2={p.x} y2={padTop + chartH} stroke="#e8a020" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" pointerEvents="none" />}

                                    <circle cx={p.x} cy={p.yUsers} r={isHovered ? "3.5" : "1.5"} fill="#a855f7" pointerEvents="none" />
                                    <circle cx={p.x} cy={p.yGroups} r={isHovered ? "3.5" : "1.5"} fill="#ec4899" pointerEvents="none" />
                                    <circle cx={p.x} cy={p.yProducts} r={isHovered ? "3.5" : "1.5"} fill="#f59e0b" pointerEvents="none" />
                                    <circle cx={p.x} cy={p.yBazar} r={isHovered ? "4" : "2"} fill="#10b981" pointerEvents="none" />
                                    <circle cx={p.x} cy={p.yBill} r={isHovered ? "4" : "2"} fill="#3b82f6" pointerEvents="none" />
                                    <circle
                                        cx={p.x}
                                        cy={p.yTotal}
                                        r={isHovered ? "5.5" : "2.5"}
                                        fill={isHovered ? "#e8a020" : "#1a0e07"}
                                        stroke="#e8a020"
                                        strokeWidth={isHovered ? "2" : "1"}
                                        pointerEvents="none"
                                    />

                                    <text
                                        x={p.x}
                                        y={svgH - 8}
                                        textAnchor="middle"
                                        fill={isHovered ? "#e8a020" : "#a08060"}
                                        fontSize={isHovered ? "12" : "11"}
                                        fontFamily="monospace"
                                        fontWeight={isHovered ? "800" : "500"}
                                        pointerEvents="none"
                                    >
                                        {p.item.month}
                                    </text>

                                    {isHovered && (
                                        <g pointerEvents="none">
                                            <rect
                                                x={tooltipX}
                                                y={tooltipY}
                                                width={tooltipW}
                                                height={tooltipH}
                                                rx="10"
                                                fill="#1a0e07"
                                                stroke="#e8a020"
                                                strokeWidth="1.2"
                                                className="shadow-2xl"
                                            />
                                            <text x={tooltipX + 10} y={tooltipY + 16} fill="#e8a020" fontSize="11" fontWeight="bold" fontFamily="monospace">
                                                {p.item.month} ({selectedYear})
                                            </text>
                                            <text x={tooltipX + 10} y={tooltipY + 32} fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                                                Total Exp: ৳{p.item.totalExpense.toLocaleString()}
                                            </text>
                                            <text x={tooltipX + 10} y={tooltipY + 48} fill="#10b981" fontSize="9.5" fontFamily="monospace">
                                                Bazar ({p.item.bazarEntriesCount}): ৳{p.item.bazarExpense.toLocaleString()}
                                            </text>
                                            <text x={tooltipX + 10} y={tooltipY + 62} fill="#3b82f6" fontSize="9.5" fontFamily="monospace">
                                                Bills ({p.item.billsCount}): ৳{p.item.billExpense.toLocaleString()}
                                            </text>
                                            <text x={tooltipX + 10} y={tooltipY + 78} fill="#a855f7" fontSize="9" fontFamily="monospace">
                                                Users Reg: +{p.item.usersRegistered}
                                            </text>
                                            <text x={tooltipX + 10} y={tooltipY + 92} fill="#ec4899" fontSize="9" fontFamily="monospace">
                                                Groups: +{p.item.groupsCreated} | Prods: +{p.item.productsCreated}
                                            </text>
                                        </g>
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                )}
            </div>
        </div>
    );
}
