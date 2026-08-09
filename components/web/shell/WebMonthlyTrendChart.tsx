"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, ShoppingBag, Receipt, Calendar, Sparkles, ChevronDown } from "lucide-react";
import { TDashboardMonthlyTrend } from "@/redux/features/dashboard/dashboardApi";

interface WebMonthlyTrendChartProps {
    data: TDashboardMonthlyTrend[];
    isLoading: boolean;
    selectedYear?: number;
    onYearChange?: (year: number) => void;
}

export function WebMonthlyTrendChart({ data, isLoading, selectedYear, onYearChange }: WebMonthlyTrendChartProps) {
    const currentYear = new Date().getFullYear();
    const activeYear = selectedYear || currentYear;
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Dynamic year list: 2027 down to currentYear - 9
    const yearOptions = Array.from({ length: 12 }, (_, i) => currentYear + 1 - i);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsYearDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isLoading) {
        return (
            <div className="bg-[#251508] border border-[rgba(232,160,32,0.18)] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="h-64 rounded-2xl bg-[#1a0e07] animate-pulse flex items-center justify-center text-xs font-mono text-muted-foreground">Loading monthly spending trends...</div>
            </div>
        );
    }

    const currentMonthLabel = new Date().toLocaleDateString("en-US", { month: "short" });
    const maxVal = Math.max(...data.map((d) => d.totalExpense || 0), 100);

    const svgW = 840;
    const svgH = 240;
    const padLeft = 45;
    const padRight = 20;
    const padTop = 30;
    const padBottom = 35;
    const chartW = svgW - padLeft - padRight;
    const chartH = svgH - padTop - padBottom;

    const points = data.map((d, i) => {
        const x = padLeft + (i / (data.length - 1 || 1)) * chartW;
        const yTotal = padTop + chartH - ((d.totalExpense || 0) / maxVal) * chartH;
        const yBazar = padTop + chartH - ((d.bazarExpense || 0) / maxVal) * chartH;
        const yBill = padTop + chartH - ((d.billExpense || 0) / maxVal) * chartH;
        return { x, yTotal, yBazar, yBill, item: d, idx: i };
    });

    const pathTotal = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yTotal}`).join(" ");
    const areaTotal = `${pathTotal} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`;
    const pathBazar = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yBazar}`).join(" ");
    const pathBill = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yBill}`).join(" ");

    const activePoint = hoveredIdx !== null ? points[hoveredIdx] : points.find((p) => p.item.label === currentMonthLabel) || points[points.length - 1];

    return (
        <div className="bg-[#251508] border border-[rgba(232,160,32,0.2)] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden font-sans">
            {/* Background Glow Effects */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none -translate-y-20 translate-x-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/5 blur-3xl pointer-events-none translate-y-20 -translate-x-20" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center text-primary shadow-inner">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-foreground tracking-tight" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                                Annual Expense Trend ({activeYear})
                            </h3>
                            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-[10px] font-mono font-bold">
                                <Sparkles className="w-3 h-3" /> Live
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">12-Month expense analytics for Bazar & Bills</p>
                    </div>
                </div>

                {/* Controls & Legend */}
                <div className="flex items-center gap-3">
                    {/* Custom Year Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                            className="flex items-center gap-2 bg-[#1a0e07] border border-border/80 hover:border-primary/50 px-3.5 py-2 rounded-2xl text-xs font-mono font-bold text-foreground transition-all shadow-md cursor-pointer"
                        >
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>{activeYear}{activeYear === currentYear ? " (Current)" : ""}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isYearDropdownOpen ? "rotate-180 text-primary" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {isYearDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-44 bg-[#1a0e07] border border-border rounded-2xl shadow-2xl py-1.5 z-50 overflow-hidden max-h-60 overflow-y-auto"
                                >
                                    <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/70 border-b border-border/40 mb-1">
                                        Select Year
                                    </div>
                                    {yearOptions.map((yr) => {
                                        const isSelected = yr === activeYear;
                                        const isCurrent = yr === currentYear;
                                        return (
                                            <button
                                                key={yr}
                                                type="button"
                                                onClick={() => {
                                                    onYearChange?.(yr);
                                                    setIsYearDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-3.5 py-2 text-xs font-mono font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                                    isSelected ? "bg-primary/15 text-primary font-bold" : "text-foreground/80 hover:bg-secondary/60 hover:text-foreground"
                                                }`}
                                            >
                                                <span>{yr}</span>
                                                {isCurrent && <span className="text-[10px] text-primary/80 font-normal">Current</span>}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Legend Pill */}
                    <div className="hidden sm:flex items-center gap-3 bg-[#1a0e07] border border-border/80 px-3.5 py-2 rounded-2xl text-xs font-mono shrink-0 shadow-md">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#e8a020] shadow-sm shadow-[#e8a020]" />
                            <span className="text-foreground font-bold">Total</span>
                        </div>
                        <div className="w-px h-3 bg-border/60" />
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                            <span className="text-muted-foreground">Bazar</span>
                        </div>
                        <div className="w-px h-3 bg-border/60" />
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                            <span className="text-muted-foreground">Bills</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SVG Chart Container */}
            <div className="relative w-full overflow-x-auto select-none py-2">
                <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto min-w-170 overflow-visible">
                    <defs>
                        <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#e8a020" stopOpacity="0.45" />
                            <stop offset="60%" stopColor="#e8a020" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#e8a020" stopOpacity="0.0" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
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

                    {/* Gradient Area Fill */}
                    <motion.path
                        d={areaTotal}
                        fill="url(#primaryAreaGrad)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />

                    {/* 3 Thin Solid Lines with smooth draw animation */}
                    {/* Bazar Expense Line (Emerald Green) */}
                    <motion.path
                        d={pathBazar}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                    />

                    {/* Bill Expense Line (Royal Blue) */}
                    <motion.path
                        d={pathBill}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeInOut", delay: 0.1 }}
                    />

                    {/* Total Expense Line (Warm Gold) */}
                    <motion.path
                        d={pathTotal}
                        fill="none"
                        stroke="#e8a020"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
                    />

                    {/* Interactive Column Hover Lines, Dots & Floating Tooltip */}
                    {points.map((p) => {
                        const isHovered = hoveredIdx === p.idx;
                        const isCurrent = p.item.label === currentMonthLabel;

                        // Tooltip positioning math
                        const tooltipW = 140;
                        const tooltipH = 75;
                        const tooltipX = Math.min(Math.max(p.x - tooltipW / 2, 10), svgW - tooltipW - 10);
                        const tooltipY = Math.max(p.yTotal - tooltipH - 12, 10);

                        return (
                            <g key={p.idx} onMouseEnter={() => setHoveredIdx(p.idx)} onMouseLeave={() => setHoveredIdx(null)} className="cursor-pointer">
                                {/* Invisible vertical hit zone */}
                                <rect x={p.x - 18} y={padTop} width="36" height={chartH} fill="transparent" />

                                {isHovered && <line x1={p.x} y1={padTop} x2={p.x} y2={padTop + chartH} stroke="#e8a020" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />}

                                {/* Point Markers for each line */}
                                <motion.circle cx={p.x} cy={p.yBazar} r={isHovered ? "4.5" : "2.5"} fill="#10b981" animate={{ r: isHovered ? 4.5 : 2.5 }} transition={{ duration: 0.15 }} />
                                <motion.circle cx={p.x} cy={p.yBill} r={isHovered ? "4.5" : "2.5"} fill="#3b82f6" animate={{ r: isHovered ? 4.5 : 2.5 }} transition={{ duration: 0.15 }} />
                                <motion.circle
                                    cx={p.x}
                                    cy={p.yTotal}
                                    r={isHovered ? 6 : isCurrent ? 4.5 : 3}
                                    fill={isHovered || isCurrent ? "#e8a020" : "#1a0e07"}
                                    stroke="#e8a020"
                                    strokeWidth={isHovered ? 2.5 : 1.5}
                                    animate={{ r: isHovered ? 6.5 : isCurrent ? 4.5 : 3, strokeWidth: isHovered ? 2.5 : 1.5 }}
                                    transition={{ duration: 0.15 }}
                                />

                                {/* X-Axis Month Label */}
                                <text x={p.x} y={svgH - 8} textAnchor="middle" fill={isHovered || isCurrent ? "#e8a020" : "#a08060"} fontSize={isHovered || isCurrent ? "12" : "11"} fontFamily="monospace" fontWeight={isHovered || isCurrent ? "800" : "500"}>
                                    {p.item.label}
                                </text>

                                {/* Floating Tooltip Popup Card */}
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.g
                                            pointerEvents="none"
                                            initial={{ opacity: 0, scale: 0.9, y: 4 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 4 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <rect x={tooltipX} y={tooltipY} width={tooltipW} height={tooltipH} rx="10" fill="#1a0e07" stroke="#e8a020" strokeWidth="1.5" className="shadow-2xl" />
                                            <text x={tooltipX + 10} y={tooltipY + 18} fill="#e8a020" fontSize="11" fontWeight="bold" fontFamily="monospace">
                                                {p.item.label} Overview
                                            </text>
                                            <text x={tooltipX + 10} y={tooltipY + 36} fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                                                Total: ৳{p.item.totalExpense.toLocaleString()}
                                            </text>
                                            <text x={tooltipX + 10} y={tooltipY + 52} fill="#10b981" fontSize="9.5" fontFamily="monospace">
                                                Bazar: ৳{p.item.bazarExpense.toLocaleString()}
                                            </text>
                                            <text x={tooltipX + 10} y={tooltipY + 66} fill="#3b82f6" fontSize="9.5" fontFamily="monospace">
                                                Bills: ৳{p.item.billExpense.toLocaleString()}
                                            </text>
                                        </motion.g>
                                    )}
                                </AnimatePresence>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Active Month Detail Bar */}
            <motion.div
                key={activePoint?.item.label}
                initial={{ opacity: 0.8, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 pt-4 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#1a0e07] p-4 rounded-2xl"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs font-mono">{activePoint?.item.label}</div>
                    <div>
                        <span className="text-xs font-bold text-foreground font-mono">{activePoint?.item.label} Breakdown</span>
                        <span className="text-[10px] text-muted-foreground ml-2 font-mono">Total: ৳{activePoint?.item.totalExpense.toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-xs font-mono">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-amber-400" />
                        <span className="text-muted-foreground">Bazar:</span>
                        <span className="font-bold text-foreground">৳{activePoint?.item.bazarExpense.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-blue-400" />
                        <span className="text-muted-foreground font-mono">Bills:</span>
                        <span className="font-bold text-foreground">৳{activePoint?.item.billExpense.toLocaleString()}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
