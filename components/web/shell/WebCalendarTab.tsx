"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, TrendingUp, Receipt, ShoppingBag, CalendarDays, X, Sparkles, ChevronDown, Check, Wallet, ArrowUpRight, PieChart } from "lucide-react";
import { useGetGroupCalendarQuery, TGroupCalendarDay } from "@/redux/features/dashboard/dashboardApi";
import { fmt } from "@/lib/mockData";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const currentRealYear = new Date().getFullYear();
const YEARS_LIST = Array.from({ length: 12 }, (_, i) => currentRealYear + 1 - i);

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

    const {
        data: calendarResp,
        isLoading,
        isFetching,
    } = useGetGroupCalendarQuery({
        year: selectedYear,
        month: selectedMonth,
    });

    const calendarData = calendarResp?.data;

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

    const getFirstDayOfWeek = () => {
        const firstDate = new Date(selectedYear, selectedMonth - 1, 1);
        return firstDate.getDay();
    };

    const startOffset = getFirstDayOfWeek();
    const daysList: TGroupCalendarDay[] = calendarData?.days || [];

    const isCurrentMonth = today.getFullYear() === selectedYear && today.getMonth() + 1 === selectedMonth;
    const currentDayNum = today.getDate();

    return (
        <div className="space-y-6 font-sans">
            {/* Header & Controls */}
            <div className="relative z-30 p-6 rounded-3xl bg-linear-to-r from-[#251508] via-[#2d1a0b] to-[#1d0f05] border border-[rgba(232,160,32,0.25)] shadow-2xl backdrop-blur-xl">
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-semibold">
                            <Sparkles className="w-3.5 h-3.5" /> Group Financial Overview
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                            Expense <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-amber-400 to-amber-200">Calendar</span>
                        </h2>
                        <p className="text-xs text-muted-foreground font-mono">
                            Daily expense breakdown for{" "}
                            <span className="text-primary font-bold">
                                {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                            </span>
                        </p>
                    </div>

                    {/* Filter & Navigation Bar */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {!isCurrentMonth && (
                            <button onClick={handleResetToToday} className="px-3.5 py-2 rounded-xl border border-primary/30 bg-primary/15 hover:bg-primary/25 text-primary text-xs font-bold font-mono transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95">
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
                                className="flex items-center justify-between gap-3 bg-[#150a04]/90 border border-border/80 hover:border-primary/60 text-foreground text-xs font-bold font-mono rounded-2xl px-4 py-2.5 transition-all cursor-pointer min-w-36 shadow-lg backdrop-blur-md"
                            >
                                <span className="flex items-center gap-2">
                                    <CalendarDays className="w-3.5 h-3.5 text-primary" />
                                    {MONTH_NAMES[selectedMonth - 1]}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${showMonthDropdown ? "rotate-180 text-primary" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {showMonthDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#201006] border border-primary/30 shadow-2xl p-2 z-50 max-h-64 overflow-y-auto font-mono text-xs space-y-1 backdrop-blur-2xl"
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
                                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                                        isSelected ? "bg-linear-to-r from-primary/30 to-amber-500/20 text-primary font-bold border border-primary/40 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
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
                                className="flex items-center justify-between gap-2.5 bg-[#150a04]/90 border border-border/80 hover:border-primary/60 text-foreground text-xs font-bold font-mono rounded-2xl px-4 py-2.5 transition-all cursor-pointer min-w-28 shadow-lg backdrop-blur-md"
                            >
                                <span>{selectedYear}</span>
                                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${showYearDropdown ? "rotate-180 text-primary" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {showYearDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#201006] border border-primary/30 shadow-2xl p-2 z-50 max-h-64 overflow-y-auto font-mono text-xs space-y-1 backdrop-blur-2xl"
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
                                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                                        isSelected ? "bg-linear-to-r from-primary/30 to-amber-500/20 text-primary font-bold border border-primary/40 shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
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
                        <div className="flex items-center gap-1 bg-[#150a04]/90 p-1.5 rounded-2xl border border-border/80 shadow-md">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-xl transition-all cursor-pointer active:scale-90" title="Previous Month">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <div className="h-4 w-px bg-border/60" />
                            <button onClick={handleNextMonth} className="p-2 hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-xl transition-all cursor-pointer active:scale-90" title="Next Month">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Monthly Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Bazar Expense */}
                <div className="group relative overflow-hidden p-5 rounded-3xl bg-linear-to-br from-[#251508] to-[#1c0d04] border border-primary/20 shadow-xl transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5">
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wider">Bazar Expenses</span>
                            <h4 className="text-2xl font-extrabold font-mono text-primary mt-2">৳{(calendarData?.summary?.totalExpense || 0).toLocaleString()}</h4>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center text-primary shadow-inner group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                        <span>Group daily purchases</span>
                        <span className="text-primary font-bold flex items-center gap-0.5">
                            Bazar <ArrowUpRight className="w-3 h-3" />
                        </span>
                    </div>
                </div>

                {/* Fixed Bills */}
                <div className="group relative overflow-hidden p-5 rounded-3xl bg-linear-to-br from-[#251508] to-[#1c0d04] border border-accent/20 shadow-xl transition-all hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/5">
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wider">Fixed Monthly Bills</span>
                            <h4 className="text-2xl font-extrabold font-mono text-accent mt-2">৳{(calendarData?.summary?.totalBill || 0).toLocaleString()}</h4>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-accent/20 to-accent/5 border border-accent/30 flex items-center justify-center text-accent shadow-inner group-hover:scale-110 transition-transform">
                            <Receipt className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                        <span>Rent, utilities & internet</span>
                        <span className="text-accent font-bold flex items-center gap-0.5">
                            Bills <ArrowUpRight className="w-3 h-3" />
                        </span>
                    </div>
                </div>

                {/* Grand Total */}
                <div className="group relative overflow-hidden p-5 rounded-3xl bg-linear-to-br from-[#2a170a] to-[#170a03] border border-white/15 shadow-xl transition-all hover:border-white/30 hover:shadow-2xl">
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wider">Grand Total Cost</span>
                            <h4 className="text-2xl font-extrabold font-mono text-foreground mt-2">৳{(calendarData?.summary?.grandTotal || 0).toLocaleString()}</h4>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-white/15 to-white/5 border border-white/20 flex items-center justify-center text-foreground shadow-inner group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                        <span>Combined monthly spend</span>
                        <span className="text-foreground font-bold flex items-center gap-0.5">
                            Total <PieChart className="w-3 h-3 text-amber-400" />
                        </span>
                    </div>
                </div>
            </div>

            {/* Calendar Grid Container */}
            <div className="p-5 sm:p-7 rounded-3xl bg-[#251508]/90 border border-border/80 shadow-2xl space-y-5 backdrop-blur-md">
                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-3 text-center pb-2 border-b border-border/40">
                    {DAYS_OF_WEEK.map((day, idx) => (
                        <div key={day} className={`py-1.5 text-xs font-extrabold font-mono uppercase tracking-wider ${idx === 0 || idx === 6 ? "text-amber-400/80" : "text-muted-foreground"}`}>
                            {day}
                        </div>
                    ))}
                </div>

                {/* Loading state */}
                {isLoading || isFetching ? (
                    <div className="py-28 text-center flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <span className="text-xs font-mono text-muted-foreground">Fetching group calendar records…</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-7 gap-2.5 sm:gap-3">
                        {/* Empty offset cells */}
                        {Array.from({ length: startOffset }).map((_, i) => (
                            <div key={`offset-${i}`} className="min-h-24 sm:min-h-32 rounded-2xl bg-[#170c05]/30 border border-white/5 opacity-30 pointer-events-none" />
                        ))}

                        {/* Calendar Days */}
                        {daysList.map((dayObj) => {
                            const isToday = isCurrentMonth && dayObj.day === currentDayNum;
                            const hasCost = dayObj.total > 0;
                            const isSelected = activeDay?.date === dayObj.date;

                            return (
                                <motion.div
                                    key={dayObj.date}
                                    whileHover={{ scale: 1.03, y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setActiveDay(dayObj)}
                                    className={`min-h-24 sm:min-h-32 p-2.5 sm:p-3.5 rounded-2xl border flex flex-col justify-between transition-all cursor-pointer select-none relative group overflow-hidden ${
                                        isSelected
                                            ? "bg-linear-to-br from-primary/25 via-[#2b170a] to-[#1f0d04] border-primary shadow-xl ring-2 ring-primary/60"
                                            : isToday
                                              ? "bg-linear-to-br from-accent/20 via-[#26160b] to-[#190c04] border-accent/80 shadow-md"
                                              : hasCost
                                                ? "bg-[#1d0e05] border-border/80 hover:border-primary/50 hover:bg-[#251206] shadow-sm"
                                                : "bg-[#180b03]/60 border-border/30 hover:bg-[#200e04]/80 opacity-80"
                                    }`}
                                >
                                    {/* Ambient card highlight effect */}
                                    {hasCost && <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl pointer-events-none group-hover:bg-primary/15 transition-all" />}

                                    {/* Header: Date Number & Badge */}
                                    <div className="flex items-center justify-between relative z-10">
                                        <span
                                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold font-mono transition-transform group-hover:scale-110 ${
                                                isToday ? "bg-accent text-accent-foreground shadow-md font-black" : isSelected ? "bg-primary text-primary-foreground font-black shadow-md" : hasCost ? "bg-white/10 text-foreground" : "text-muted-foreground/80"
                                            }`}
                                        >
                                            {dayObj.day}
                                        </span>

                                        {isToday && <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/40 hidden sm:inline-block shadow-sm">Today</span>}
                                    </div>

                                    {/* Expense & Bill Badges */}
                                    {hasCost ? (
                                        <div className="space-y-1.5 mt-2 relative z-10">
                                            {dayObj.expense > 0 && (
                                                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono px-2 py-1 rounded-lg bg-primary/15 border border-primary/30 text-primary font-bold shadow-sm">
                                                    <span className="truncate hidden sm:inline text-[9px] uppercase tracking-wider">Exp</span>
                                                    <span>৳{dayObj.expense.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {dayObj.bill > 0 && (
                                                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono px-2 py-1 rounded-lg bg-accent/15 border border-accent/30 text-accent font-bold shadow-sm">
                                                    <span className="truncate hidden sm:inline text-[9px] uppercase tracking-wider">Bill</span>
                                                    <span>৳{dayObj.bill.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {dayObj.expense > 0 && dayObj.bill > 0 && <div className="text-right text-[11px] sm:text-xs font-mono font-black text-amber-300 pt-0.5">৳{dayObj.total.toLocaleString()}</div>}
                                        </div>
                                    ) : (
                                        <div className="text-[10px] font-mono text-muted-foreground/30 text-center py-2 hidden sm:block">—</div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Selected Day Details Popover Modal */}
            <AnimatePresence>
                {activeDay && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-md bg-linear-to-b from-[#2a170a] to-[#1c0c03] border border-primary/30 shadow-2xl rounded-3xl p-6 font-sans space-y-5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                                <div>
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/20">Day Summary</span>
                                    <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2 mt-1.5">
                                        <CalendarIcon className="w-5 h-5 text-primary" />
                                        {activeDay.dayOfWeek}, {activeDay.date}
                                    </h3>
                                </div>
                                <button onClick={() => setActiveDay(null)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Breakdown List */}
                            <div className="space-y-3 font-mono text-xs relative z-10">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#150a04]/90 border border-primary/20 shadow-inner">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                            <ShoppingBag className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground">Bazar Expense</p>
                                            <p className="text-[10px] text-muted-foreground">Daily grocery purchases</p>
                                        </div>
                                    </div>
                                    <span className="font-extrabold text-primary text-base">৳{activeDay.expense.toLocaleString()}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#150a04]/90 border border-accent/20 shadow-inner">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                                            <Receipt className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground font-sans">Fixed Bills</p>
                                            <p className="text-[10px] text-muted-foreground font-sans">Utility & recurring bills</p>
                                        </div>
                                    </div>
                                    <span className="font-extrabold text-accent text-base">৳{activeDay.bill.toLocaleString()}</span>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-linear-to-r from-primary/20 via-amber-500/15 to-accent/20 border border-primary/40 shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-primary/25 border border-primary/40 flex items-center justify-center text-amber-300">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="font-black text-foreground">Total Daily Spend</p>
                                            <p className="text-[10px] text-muted-foreground">Combined expense</p>
                                        </div>
                                    </div>
                                    <span className="font-black text-amber-300 text-lg">৳{activeDay.total.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-2 relative z-10">
                                <button onClick={() => setActiveDay(null)} className="w-full py-3 rounded-2xl bg-linear-to-r from-primary to-amber-500 text-primary-foreground font-extrabold text-xs shadow-lg hover:brightness-110 transition-all cursor-pointer">
                                    Close Details
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
