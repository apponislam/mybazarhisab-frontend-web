import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, TrendingUp, Receipt, ShoppingBag, X, Sparkles, PieChart, ChevronDown, Check } from "lucide-react";
import { ScreenShell, BackButton } from "@/components/app/ui/Shared";
import { useGetGroupCalendarQuery, TGroupCalendarDay } from "@/redux/features/dashboard/dashboardApi";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const currentRealYear = new Date().getFullYear();
const YEARS_LIST = Array.from({ length: 12 }, (_, i) => currentRealYear + 1 - i);

export function CalendarScreen({ onBack }: { onBack: () => void }) {
    const today = new Date();
    const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1);
    const [activeDay, setActiveDay] = useState<TGroupCalendarDay | null>(null);

    // Custom Dropdown states
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

    const { data: calendarResp, isLoading } = useGetGroupCalendarQuery({
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
        setActiveDay(null);
    };

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear((y) => y + 1);
        } else {
            setSelectedMonth((m) => m + 1);
        }
        setActiveDay(null);
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
        <ScreenShell scrollable>
            <div className="flex flex-col px-4 pt-6 pb-12 gap-5 font-sans">
                <BackButton onBack={onBack} label="Profile" />

                {/* Hero Header Card */}
                <div className="relative p-5 rounded-3xl bg-linear-to-br from-[#2c1809] via-[#231206] to-[#150a03] border border-primary/30 shadow-2xl overflow-hidden backdrop-blur-xl">
                    <div className="absolute -right-10 -top-10 w-44 h-44 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="inline-flex items-center gap-1.5 self-start px-3 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-[11px] font-mono font-semibold">
                            <Sparkles className="w-3.5 h-3.5" /> Group Financial Calendar
                        </div>
                        <h2 className="text-2xl font-extrabold text-foreground tracking-tight" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                            Expense <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-amber-400 to-amber-200">Calendar</span>
                        </h2>
                        <p className="text-xs text-muted-foreground font-mono">
                            Daily breakdown for <span className="text-primary font-bold">{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</span>
                        </p>
                    </div>
                </div>

                {/* Custom Month & Year Dropdown Controls */}
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#1c0e05]/90 border border-border/80 shadow-lg relative z-30">
                    <div className="flex items-center gap-2">
                        {/* Month Dropdown */}
                        <div className="relative" ref={monthDropdownRef}>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowMonthDropdown((prev) => !prev);
                                    setShowYearDropdown(false);
                                }}
                                className="flex items-center justify-between gap-2 bg-[#281407] border border-primary/30 hover:border-primary text-foreground text-xs font-bold font-mono rounded-xl px-3 py-2 transition-all cursor-pointer shadow-xs"
                            >
                                <span>{MONTH_NAMES[selectedMonth - 1]}</span>
                                <ChevronDown className={`w-3.5 h-3.5 text-primary transition-transform duration-200 ${showMonthDropdown ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {showMonthDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-0 mt-2 w-44 rounded-2xl bg-[#201006] border border-primary/40 shadow-2xl p-1.5 z-50 max-h-64 overflow-y-auto font-mono text-xs space-y-1 backdrop-blur-2xl"
                                    >
                                        {MONTH_NAMES.map((name, idx) => {
                                            const isSelected = selectedMonth === idx + 1;
                                            return (
                                                <button
                                                    key={name}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedMonth(idx + 1);
                                                        setShowMonthDropdown(false);
                                                        setActiveDay(null);
                                                    }}
                                                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-left transition-all ${
                                                        isSelected
                                                            ? "bg-linear-to-r from-primary/30 to-amber-500/20 text-primary font-bold border border-primary/40 shadow-xs"
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

                        {/* Year Dropdown */}
                        <div className="relative" ref={yearDropdownRef}>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowYearDropdown((prev) => !prev);
                                    setShowMonthDropdown(false);
                                }}
                                className="flex items-center justify-between gap-2 bg-[#281407] border border-primary/30 hover:border-primary text-foreground text-xs font-bold font-mono rounded-xl px-3 py-2 transition-all cursor-pointer shadow-xs"
                            >
                                <span>{selectedYear}</span>
                                <ChevronDown className={`w-3.5 h-3.5 text-primary transition-transform duration-200 ${showYearDropdown ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {showYearDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute left-0 mt-2 w-32 rounded-2xl bg-[#201006] border border-primary/40 shadow-2xl p-1.5 z-50 max-h-64 overflow-y-auto font-mono text-xs space-y-1 backdrop-blur-2xl"
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
                                                        setActiveDay(null);
                                                    }}
                                                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-left transition-all ${
                                                        isSelected
                                                            ? "bg-linear-to-r from-primary/30 to-amber-500/20 text-primary font-bold border border-primary/40 shadow-xs"
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
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-1 bg-[#281407] p-1 rounded-xl border border-primary/20">
                        <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-lg transition-all active:scale-90" title="Previous Month">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="h-4 w-px bg-border/60" />
                        <button onClick={handleNextMonth} className="p-1.5 hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-lg transition-all active:scale-90" title="Next Month">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Summary Stat Cards */}
                <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3.5 rounded-2xl bg-linear-to-br from-[#281508] to-[#1c0d04] border border-primary/30 shadow-lg flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
                            <PieChart className="w-3.5 h-3.5 text-amber-400" /> Grand Total
                        </div>
                        <p className="text-sm font-extrabold text-primary truncate font-mono">
                            ৳{calendarData?.summary?.grandTotal?.toLocaleString() ?? 0}
                        </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-linear-to-br from-[#281508] to-[#1c0d04] border border-border/80 shadow-lg flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
                            <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> Bazar
                        </div>
                        <p className="text-sm font-extrabold text-foreground truncate font-mono">
                            ৳{calendarData?.summary?.totalExpense?.toLocaleString() ?? 0}
                        </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-linear-to-br from-[#281508] to-[#1c0d04] border border-border/80 shadow-lg flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-muted-foreground text-[10px] font-mono uppercase tracking-wider">
                            <Receipt className="w-3.5 h-3.5 text-blue-400" /> Bills
                        </div>
                        <p className="text-sm font-extrabold text-foreground truncate font-mono">
                            ৳{calendarData?.summary?.totalBill?.toLocaleString() ?? 0}
                        </p>
                    </div>
                </div>

                {/* Calendar Grid Box */}
                <div className="p-4 rounded-3xl bg-[#231206]/90 border border-primary/20 shadow-2xl space-y-3 backdrop-blur-md">
                    {/* Days of Week Header */}
                    <div className="grid grid-cols-7 gap-1 text-center pb-2 border-b border-border/50">
                        {DAYS_OF_WEEK.map((day, idx) => (
                            <div key={day} className={`text-[11px] font-extrabold font-mono uppercase tracking-wider ${idx === 0 || idx === 6 ? "text-amber-400" : "text-muted-foreground"}`}>
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="py-24 text-center flex flex-col items-center justify-center gap-2">
                            <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                            <span className="text-xs font-mono text-muted-foreground">Loading calendar data...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-7 gap-1.5">
                            {/* Empty offset cells */}
                            {Array.from({ length: startOffset }).map((_, i) => (
                                <div key={`offset-${i}`} className="h-14 rounded-2xl bg-[#140a03]/40 border border-white/5 opacity-20 pointer-events-none" />
                            ))}

                            {/* Calendar Days */}
                            {daysList.map((dayObj, index) => {
                                const isToday = isCurrentMonth && dayObj.day === currentDayNum;
                                const hasCost = dayObj.total > 0;
                                const isSelected = activeDay?.date === dayObj.date;

                                // Compute grid position offset to prevent overflow:
                                const colIndex = (startOffset + index) % 7;
                                const positionClass =
                                    colIndex < 2
                                        ? "left-0 translate-x-0"
                                        : colIndex > 4
                                        ? "right-0 translate-x-0"
                                        : "left-1/2 -translate-x-1/2";

                                return (
                                    <div key={dayObj.date} className="relative group">
                                        <motion.button
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setActiveDay((prev) => (prev?.date === dayObj.date ? null : dayObj))}
                                            className={`w-full h-14 p-1.5 rounded-2xl border flex flex-col items-center justify-center transition-all select-none relative overflow-hidden text-center cursor-pointer ${
                                                isSelected
                                                    ? "bg-linear-to-br from-primary/35 via-[#331b0b] to-[#1f0d04] border-primary shadow-xl ring-2 ring-primary/60 z-20"
                                                    : isToday
                                                    ? "bg-linear-to-br from-amber-500/25 via-[#29160a] to-[#190c04] border-amber-400 shadow-md"
                                                    : hasCost
                                                    ? "bg-linear-to-br from-[#2c170a] to-[#1d0e04] border-primary/40 shadow-[0_0_10px_rgba(232,160,32,0.2)] hover:border-primary"
                                                    : "bg-[#180b03]/60 border-border/30 hover:bg-[#200e04]/80 opacity-60"
                                            }`}
                                        >
                                            {/* Glowing ambient background glow when day has cost */}
                                            {hasCost && (
                                                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xs pointer-events-none" />
                                            )}

                                            {/* Date Number Header */}
                                            <span
                                                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black font-mono transition-all relative z-10 ${
                                                    isToday
                                                        ? "bg-amber-400 text-black font-bold shadow-xs"
                                                        : isSelected
                                                        ? "bg-primary text-black font-bold shadow-xs"
                                                        : hasCost
                                                        ? "text-primary font-black"
                                                        : "text-muted-foreground/70"
                                                }`}
                                            >
                                                {dayObj.day}
                                            </span>

                                            {/* Glowing Dot Indicator (ONLY IF DATA EXISTS) */}
                                            {hasCost && (
                                                <div className="flex gap-1 items-center mt-1 relative z-10">
                                                    {dayObj.expense > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.9)]" />}
                                                    {dayObj.bill > 0 && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.9)]" />}
                                                </div>
                                            )}
                                        </motion.button>

                                        {/* Hover & Click Popover Tooltip */}
                                        <AnimatePresence>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 6, scale: 0.9 }}
                                                    transition={{ duration: 0.15 }}
                                                    className={`absolute z-40 w-44 p-2.5 rounded-2xl bg-[#1c0d04] border border-primary/50 shadow-2xl backdrop-blur-xl font-mono text-[11px] space-y-1.5 ${positionClass} bottom-full mb-2 pointer-events-auto`}
                                                >
                                                    <div className="flex items-center justify-between border-b border-primary/20 pb-1">
                                                        <span className="font-bold text-foreground text-[10px]">
                                                            {dayObj.dayOfWeek}, {MONTH_NAMES[selectedMonth - 1].slice(0, 3)} {dayObj.day}
                                                        </span>
                                                        <button onClick={(e) => { e.stopPropagation(); setActiveDay(null); }} className="text-muted-foreground hover:text-foreground">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <div className="flex items-center justify-between text-amber-400">
                                                            <span className="text-[9px] text-muted-foreground">Bazar:</span>
                                                            <span className="font-bold">৳{dayObj.expense.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-blue-400">
                                                            <span className="text-[9px] text-muted-foreground">Bill:</span>
                                                            <span className="font-bold">৳{dayObj.bill.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between border-t border-white/10 pt-1 text-amber-300 font-extrabold">
                                                            <span className="text-[9px] text-primary">Total:</span>
                                                            <span>৳{dayObj.total.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </ScreenShell>
    );
}
