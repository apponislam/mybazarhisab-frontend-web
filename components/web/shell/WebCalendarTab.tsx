"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Receipt,
    ShoppingBag,
    CalendarDays,
    X,
    Sparkles,
    ChevronDown,
    Check,
} from "lucide-react";
import { useGetGroupCalendarQuery, TGroupCalendarDay } from "@/redux/features/dashboard/dashboardApi";
import { fmt } from "@/lib/mockData";

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Generate years list: Next year (current + 1), Current year, down to 10 past years
const currentRealYear = new Date().getFullYear();
// [2027, 2026, 2025, 2024, ..., 2016]
const YEARS_LIST = Array.from({ length: 12 }, (_, i) => (currentRealYear + 1) - i);

export function WebCalendarTab() {
    const today = new Date();
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
    const [activeDay, setActiveDay] = useState<TGroupCalendarDay | null>(null);

    // Custom dropdown states & refs
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const monthDropdownRef = useRef<HTMLDivElement>(null);
    const yearDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
                setShowMonthDropdown(false);
            }
            if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
                setShowYearDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const { data: calendarResp, isLoading, isFetching } = useGetGroupCalendarQuery({
        year: selectedYear,
        month: selectedMonth,
    });

    const calendarData = calendarResp?.data;

    // Helper functions for month navigation
    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear((y) => y - 1);
        } else {
            setSelectedMonth((m) => m - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear((y) => y + 1);
        } else {
            setSelectedMonth((m) => m + 1);
        }
    };

    const handleResetToToday = () => {
        setSelectedYear(today.getFullYear());
        setSelectedMonth(today.getMonth() + 1);
    };

    // Calculate calendar grid blank starting slots
    const getFirstDayOfWeek = () => {
        const firstDate = new Date(selectedYear, selectedMonth - 1, 1);
        return firstDate.getDay(); // 0 = Sun, 1 = Mon, ...
    };

    const startOffset = getFirstDayOfWeek();
    const daysList: TGroupCalendarDay[] = calendarData?.days || [];

    const isCurrentMonth = today.getFullYear() === selectedYear && (today.getMonth() + 1) === selectedMonth;
    const currentDayNum = today.getDate();

    return (
        <div className="space-y-6 font-sans">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#251508] border border-border shadow-xl">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <CalendarDays className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                            Group Expense <span className="text-primary">Calendar</span>
                        </h2>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">
                        Daily breakdown of bazar expenses & monthly bills for {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap z-20">
                    {/* Reset to today */}
                    {!isCurrentMonth && (
                        <button
                            onClick={handleResetToToday}
                            className="px-3 py-2 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-all cursor-pointer font-mono"
                        >
                            Today
                        </button>
                    )}

                    {/* Custom Month Dropdown */}
                    <div className="relative" ref={monthDropdownRef}>
                        <button
                            type="button"
                            onClick={() => {
                                setShowMonthDropdown((prev) => !prev);
                                setShowYearDropdown(false);
                            }}
                            className="flex items-center justify-between gap-2 bg-[#1a0e07] border border-border/80 hover:border-primary/50 text-foreground text-xs font-bold font-mono rounded-xl px-3.5 py-2 transition-all cursor-pointer min-w-[130px] shadow-md"
                        >
                            <span>{MONTH_NAMES[selectedMonth - 1]}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${showMonthDropdown ? "rotate-180 text-primary" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {showMonthDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#251508] border border-border shadow-2xl p-1.5 z-50 max-h-60 overflow-y-auto font-mono text-xs space-y-0.5"
                                >
                                    {MONTH_NAMES.map((name, idx) => {
                                        const mVal = idx + 1;
                                        const isSelected = selectedMonth === mVal;
                                        return (
                                            <button
                                                key={name}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedMonth(mVal);
                                                    setShowMonthDropdown(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                                                    isSelected
                                                        ? "bg-primary/20 text-primary font-bold border border-primary/30"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                                }`}
                                            >
                                                <span>{name}</span>
                                                {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Custom Year Dropdown */}
                    <div className="relative" ref={yearDropdownRef}>
                        <button
                            type="button"
                            onClick={() => {
                                setShowYearDropdown((prev) => !prev);
                                setShowMonthDropdown(false);
                            }}
                            className="flex items-center justify-between gap-2 bg-[#1a0e07] border border-border/80 hover:border-primary/50 text-foreground text-xs font-bold font-mono rounded-xl px-3.5 py-2 transition-all cursor-pointer min-w-[95px] shadow-md"
                        >
                            <span>{selectedYear}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${showYearDropdown ? "rotate-180 text-primary" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {showYearDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#251508] border border-border shadow-2xl p-1.5 z-50 max-h-64 overflow-y-auto font-mono text-xs space-y-0.5"
                                >
                                    {YEARS_LIST.map((y) => {
                                        const isSelected = selectedYear === y;
                                        return (
                                            <button
                                                key={y}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedYear(y);
                                                    setShowYearDropdown(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                                                    isSelected
                                                        ? "bg-primary/20 text-primary font-bold border border-primary/30"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                                }`}
                                            >
                                                <span>{y}</span>
                                                {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Prev / Next buttons */}
                    <div className="flex items-center gap-1 bg-[#1a0e07] p-1 rounded-xl border border-border/80">
                        <button
                            onClick={handlePrevMonth}
                            className="p-1.5 hover:bg-white/5 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
                            title="Previous Month"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleNextMonth}
                            className="p-1.5 hover:bg-white/5 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
                            title="Next Month"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Monthly Summary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#251508] border border-border/80 shadow-md flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground font-mono">Bazar Expenses</p>
                        <h4 className="text-xl font-bold font-mono text-primary mt-1">
                            ৳{(calendarData?.summary?.totalExpense || 0).toLocaleString()}
                        </h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#251508] border border-border/80 shadow-md flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground font-mono">Fixed Bills</p>
                        <h4 className="text-xl font-bold font-mono text-accent mt-1">
                            ৳{(calendarData?.summary?.totalBill || 0).toLocaleString()}
                        </h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        <Receipt className="w-5 h-5" />
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#251508] border border-border/80 shadow-md flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-muted-foreground font-mono">Grand Total</p>
                        <h4 className="text-xl font-bold font-mono text-foreground mt-1">
                            ৳{(calendarData?.summary?.grandTotal || 0).toLocaleString()}
                        </h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-foreground">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Calendar Grid Container */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#251508] border border-border shadow-xl space-y-4">
                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-2 text-center">
                    {DAYS_OF_WEEK.map((day) => (
                        <div key={day} className="py-2 text-xs font-bold font-mono uppercase text-muted-foreground">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Loading state */}
                {isLoading || isFetching ? (
                    <div className="py-20 text-center text-xs font-mono text-muted-foreground">
                        Loading group calendar data…
                    </div>
                ) : (
                    <div className="grid grid-cols-7 gap-2">
                        {/* Empty offset cells */}
                        {Array.from({ length: startOffset }).map((_, i) => (
                            <div
                                key={`offset-${i}`}
                                className="min-h-[90px] sm:min-h-[110px] rounded-xl bg-[#1a0e07]/40 border border-border/30 opacity-40 pointer-events-none"
                            />
                        ))}

                        {/* Calendar Days */}
                        {daysList.map((dayObj) => {
                            const isToday = isCurrentMonth && dayObj.day === currentDayNum;
                            const hasCost = dayObj.total > 0;
                            const isSelected = activeDay?.date === dayObj.date;

                            return (
                                <motion.div
                                    key={dayObj.date}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveDay(dayObj)}
                                    className={`min-h-[90px] sm:min-h-[110px] p-2 sm:p-2.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer select-none relative ${
                                        isSelected
                                            ? "bg-primary/15 border-primary shadow-lg ring-1 ring-primary/50"
                                            : isToday
                                            ? "bg-accent/10 border-accent/60"
                                            : hasCost
                                            ? "bg-[#1a0e07] border-border/80 hover:border-primary/40 hover:bg-white/5"
                                            : "bg-[#1a0e07]/60 border-border/40 hover:bg-white/5"
                                    }`}
                                >
                                    {/* Top Bar: Day Number & Indicators */}
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                                                isToday
                                                    ? "bg-accent text-accent-foreground shadow-sm"
                                                    : isSelected
                                                    ? "bg-primary text-primary-foreground font-extrabold"
                                                    : "text-foreground"
                                            }`}
                                        >
                                            {dayObj.day}
                                        </span>

                                        {isToday && (
                                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-accent/20 text-accent border border-accent/30 hidden sm:inline-block">
                                                Today
                                            </span>
                                        )}
                                    </div>

                                    {/* Bottom Info: Daily Expenses */}
                                    {hasCost ? (
                                        <div className="space-y-1 mt-2">
                                            {dayObj.expense > 0 && (
                                                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">
                                                    <span className="truncate hidden sm:inline">Exp</span>
                                                    <span className="font-bold">৳{dayObj.expense.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {dayObj.bill > 0 && (
                                                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent">
                                                    <span className="truncate hidden sm:inline">Bill</span>
                                                    <span className="font-bold">৳{dayObj.bill.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {dayObj.expense > 0 && dayObj.bill > 0 && (
                                                <div className="text-right text-[11px] font-mono font-extrabold text-foreground pt-0.5">
                                                    ৳{dayObj.total.toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-[10px] font-mono text-muted-foreground/40 text-center py-2 hidden sm:block">
                                            —
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Selected Day Details Drawer/Popover Modal */}
            <AnimatePresence>
                {activeDay && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="w-full max-w-md bg-[#251508] border border-border shadow-2xl rounded-2xl p-5 font-sans space-y-4 relative"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-border/60 pb-3">
                                <div>
                                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4 text-primary" />
                                        {activeDay.dayOfWeek}, {activeDay.date}
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                        Daily expense details
                                    </p>
                                </div>
                                <button
                                    onClick={() => setActiveDay(null)}
                                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="space-y-3 font-mono text-xs">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a0e07] border border-border/60">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <ShoppingBag className="w-4 h-4 text-primary" /> Bazar Expense
                                    </span>
                                    <span className="font-bold text-primary text-sm">৳{activeDay.expense.toLocaleString()}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-[#1a0e07] border border-border/60">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Receipt className="w-4 h-4 text-accent" /> Fixed Bills
                                    </span>
                                    <span className="font-bold text-accent text-sm">৳{activeDay.bill.toLocaleString()}</span>
                                </div>

                                <div className="flex items-center justify-between p-3.5 rounded-xl bg-primary/10 border border-primary/30">
                                    <span className="font-bold text-foreground flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-primary" /> Total Daily Cost
                                    </span>
                                    <span className="font-extrabold text-foreground text-base">৳{activeDay.total.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Modal Action Footer */}
                            <div className="pt-2">
                                <button
                                    onClick={() => setActiveDay(null)}
                                    className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-accent transition-all cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
