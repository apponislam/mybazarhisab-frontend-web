import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Home, ShoppingBag, Receipt, User, Search, X, ChevronUp, ChevronDown, Star, Calendar, TrendingUp, Minus, BookOpen, Package, BarChart2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";
import { BazarUnit, BillCategory, GroupStats } from "@/types";
import { BILL_META, fmt } from "@/lib/mockData";
import { useGetUserDashboardStatsQuery, useGetMonthlyExpenseTrendQuery } from "@/redux/features/dashboard/dashboardApi";
import { useGetMeQuery, useUpdateProfileMutation, useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { useSubmitMessageMutation } from "@/redux/features/contact/contactApi";
import { useCreateFeedbackMutation } from "@/redux/features/feedback/feedbackApi";
import { useCreateReviewMutation, useGetMyReviewQuery } from "@/redux/features/review/reviewApi";
import { useGetMyNotificationsQuery, useGetUnreadCountQuery, useMarkAllAsReadMutation, useDeleteAllNotificationsMutation, useDeleteNotificationMutation } from "@/redux/features/notification/notificationApi";
import { useCreateBazarEntryMutation, useGetAllBazarEntriesQuery, useDeleteBazarEntryMutation, TBazarEntry } from "@/redux/features/bazar-entry/bazarEntryApi";
import { useCreateBillMutation, useGetAllBillsQuery, useDeleteBillMutation, TBill } from "@/redux/features/bill/billApi";
import { WebPagination } from "@/components/web/shell/WebPagination";
import { WebConfirmModal } from "@/components/web/shell/WebModal";
import { WebHeader } from "@/components/web/shell/WebHeader";
import { WebProfileTab } from "@/components/web/shell/WebProfileTab";
import { WebNotificationsTab } from "@/components/web/shell/WebNotificationsTab";
import { WebProductsTab } from "@/components/web/shell/WebProductsTab";
import { WebDialogModal as Modal, WebAddExpenseForm as AddExpenseForm, WebAddBillForm as AddBillForm, WebReviewModalContent, WebStatementModal } from "@/components/web/shell/WebDialogs";
import { WebBulkExpenseScreen } from "@/components/web/shell/WebBulkExpenseScreen";
import { WebBulkBillScreen } from "@/components/web/shell/WebBulkBillScreen";
import { avatarColor, initials } from "@/components/web/shell/WebMetricCard";
import { EditExpenseModal } from "@/components/dashboard/expenses/EditExpenseModal";
import { EditBillModal } from "@/components/dashboard/bills/EditBillModal";
import { WebMonthlyTrendChart } from "@/components/web/shell/WebMonthlyTrendChart";

// ─── Helper Components for Dashboard Stats ─────────────────────────────────

const now = new Date();
const mn = now.toLocaleString("default", { month: "long" });
const yr = now.getFullYear();

function WebDelta({ current, prev }: { current: number; prev: number }) {
    if (prev === 0) return null;
    const pct = Math.round(((current - prev) / prev) * 100);
    const up = pct >= 0;
    return (
        <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold font-mono px-1.5 py-0.5 rounded-md" style={{ color: up ? "#22c55e" : "#ef4444", background: up ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}>
            {up ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {Math.abs(pct)}%
        </span>
    );
}

function WebLoadingDots({ currency = true, size = "md" }: { currency?: boolean; size?: "sm" | "md" | "lg" }) {
    const dotSize = size === "lg" ? "w-2 h-2" : size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5";
    return (
        <span className="inline-flex items-center gap-1 font-mono font-bold">
            {currency && <span>৳</span>}
            <span className={`${dotSize} rounded-full bg-primary animate-bounce`} style={{ animationDelay: "0ms" }} />
            <span className={`${dotSize} rounded-full bg-primary animate-bounce`} style={{ animationDelay: "150ms" }} />
            <span className={`${dotSize} rounded-full bg-primary animate-bounce`} style={{ animationDelay: "300ms" }} />
        </span>
    );
}

function ExpenseRow({ label, value, prev, isLoading, color = "text-foreground" }: { label: string; value: number; prev?: number; isLoading: boolean; color?: string }) {
    return (
        <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/[0.02] transition-colors">
            <span className="text-sm text-muted-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
            <div className="flex items-center gap-3">
                {!isLoading && prev !== undefined && <WebDelta current={value} prev={prev} />}
                <span className={`text-sm font-bold font-mono ${color}`}>
                    {isLoading ? <WebLoadingDots currency size="sm" /> : fmt(value)}
                </span>
            </div>
        </div>
    );
}

export function WebAppShell({ stats, onLogout }: { stats?: GroupStats; onLogout: () => void }) {
    const router = useRouter();
    // Website Tabs
    const [tab, setTab] = useState<"home" | "expenses" | "bills" | "products" | "notifications" | "profile">("home");
    // Notification & User dropdown refs and states
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const notifDropdownRef = useRef<HTMLDivElement>(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false);
            }
            if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
                setShowNotifDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Pagination & Search & Filter States
    const [expensePage, setExpensePage] = useState(1);
    const [billPage, setBillPage] = useState(1);
    const [expenseSearch, setExpenseSearch] = useState("");
    const [billSearch, setBillSearch] = useState("");
    const [expenseFilter, setExpenseFilter] = useState<"month" | "all">("month");
    const [billFilter, setBillFilter] = useState<"month" | "all">("month");

    // RTK Query Hooks for Live Data Fetching & Pagination
    const {
        data: bazarEntriesResponse,
        isLoading: bazarEntriesLoading,
        isFetching: bazarEntriesFetching,
    } = useGetAllBazarEntriesQuery(
        {
            filter: expenseFilter === "all" ? "ALL" : undefined,
            searchTerm: expenseSearch.trim() || undefined,
            page: expensePage,
            limit: 10,
        },
        { skip: tab !== "expenses" && tab !== "home" },
    );
    const {
        data: billsResponse,
        isLoading: billsLoading,
        isFetching: billsFetching,
    } = useGetAllBillsQuery(
        {
            filter: billFilter === "all" ? "ALL" : undefined,
            searchTerm: billSearch.trim() || undefined,
            page: billPage,
            limit: 10,
        },
        { skip: tab !== "bills" && tab !== "home" },
    );

    const [deleteBazarEntry] = useDeleteBazarEntryMutation();
    const [deleteBill] = useDeleteBillMutation();

    // Dashboard stats for home tab (same API as /app)
    const { data: dashboardData, isLoading: isDashboardLoading } = useGetUserDashboardStatsQuery(undefined, {
        skip: tab !== "home",
    });
    const dashboardStats = dashboardData?.data;

    // Monthly Expense Trend (12 Months breakdown)
    const { data: monthlyTrendResponse, isLoading: isMonthlyTrendLoading } = useGetMonthlyExpenseTrendQuery(undefined, {
        skip: tab !== "home",
    });
    const monthlyTrendData = monthlyTrendResponse?.data || [];

    // Delete & Edit Modal States
    const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
    const [deletingBillId, setDeletingBillId] = useState<string | null>(null);
    const [editingExpense, setEditingExpense] = useState<TBazarEntry | null>(null);
    const [editingBill, setEditingBill] = useState<TBill | null>(null);

    // Onboarding & Interaction Modal States
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showBulkExpense, setShowBulkExpense] = useState(false);
    const [showAddBill, setShowAddBill] = useState(false);
    const [showBulkBill, setShowBulkBill] = useState(false);
    const [showStatement, setShowStatement] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // RTK Query Hooks for Interactions & Data Mutations
    const [createBazarEntry, { isLoading: bazarLoading }] = useCreateBazarEntryMutation();
    const [createBill, { isLoading: billMutationLoading }] = useCreateBillMutation();
    const { data: unreadData } = useGetUnreadCountQuery();
    const { data: notifData, isLoading: notifLoading } = useGetMyNotificationsQuery({ limit: 15 });
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const [deleteAllNotifications] = useDeleteAllNotificationsMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const [submitContact, { isLoading: contactLoading }] = useSubmitMessageMutation();
    const [createFeedback, { isLoading: feedbackLoading }] = useCreateFeedbackMutation();
    const [createReview, { isLoading: reviewLoading }] = useCreateReviewMutation();
    const {
        data: myReviewData,
        isLoading: myReviewLoading,
        refetch: refetchMyReview,
    } = useGetMyReviewQuery(undefined, {
        skip: !showReview,
        refetchOnMountOrArgChange: true,
    });
    const userReviewState = myReviewData?.data;

    // Form states for modals
    const [contactSubject, setContactSubject] = useState("");
    const [contactMsg, setContactMsg] = useState("");
    const [feedbackCategory, setFeedbackCategory] = useState<"BUG" | "FEATURE_REQUEST" | "UI_UX" | "GENERAL">("GENERAL");
    const [feedbackSubject, setFeedbackSubject] = useState("");
    const [feedbackMsg, setFeedbackMsg] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");

    // Profile RTK Query Hooks & State
    const { data: userData } = useGetMeQuery();
    const [updateProfile, { isLoading: profileLoading }] = useUpdateProfileMutation();
    const [changePassword, { isLoading: passLoading }] = useChangePasswordMutation();

    const currentUser = userData?.data;

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileImage, setProfileImage] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [language, setLanguage] = useState("English");
    const [aboutme, setAboutme] = useState("");

    // Address fields
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("Bangladesh");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (currentUser) {
            setProfileImage(currentUser.profileImage || "");
            setName(currentUser.name || "");
            setEmail(currentUser.email || "");
            setPhone(currentUser.phone || "");
            setLanguage(currentUser.language || "English");
            setAboutme(currentUser.aboutme || "");

            if (currentUser.address) {
                setStreet(currentUser.address.street || "");
                setCity(currentUser.address.city || "");
                setState(currentUser.address.state || "");
                setZipCode(currentUser.address.zipCode || "");
                setCountry(currentUser.address.country || "Bangladesh");
            }
        }
    }, [currentUser]);

    // Handlers
    const handleAddExpense = async (productName: string, price?: number, quantity?: number, unit?: BazarUnit, dateStr?: string, notes?: string, totalPrice?: number) => {
        try {
            await createBazarEntry({
                name: productName.trim(),
                price: price !== undefined ? Number(price) : undefined,
                totalPrice: totalPrice !== undefined ? Number(totalPrice) : undefined,
                quantity: Number(quantity),
                unit,
                date: dateStr,
                notes: notes ? notes.trim() : undefined,
            }).unwrap();

            toast.success(`Logged ${productName} expense successfully!`);
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to add bazar expense");
        }
    };

    const handleAddBill = async (category: BillCategory, title: string, amount: number, dateStr: string, notes: string) => {
        try {
            await createBill({
                category,
                title: title.trim(),
                amount: Number(amount),
                date: dateStr,
                notes: notes ? notes.trim() : undefined,
            }).unwrap();

            toast.success(`Logged ${title} bill successfully!`);
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to add monthly bill");
        }
    };

    const handleDeleteExpense = async (id: string) => {
        try {
            await deleteBazarEntry(id).unwrap();
            toast.success("Expense entry deleted successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete expense entry");
        }
    };

    const handleDeleteBill = async (id: string) => {
        try {
            await deleteBill(id).unwrap();
            toast.success("Monthly bill deleted successfully!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete bill");
        }
    };

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex flex-col font-sans overflow-x-clip">
            <WebHeader
                scrolled={scrolled}
                stats={stats}
                tab={tab}
                setTab={(newTab) => {
                    setShowBulkExpense(false);
                    setShowBulkBill(false);
                    setTab(newTab);
                }}
                setShowAddExpense={setShowAddExpense}
                setShowAddBill={setShowAddBill}
                onOpenStatement={() => setShowStatement(true)}
                showNotifDropdown={showNotifDropdown}
                setShowNotifDropdown={setShowNotifDropdown}
                notifDropdownRef={notifDropdownRef}
                unreadCount={unreadData?.data?.count}
                markAllAsRead={markAllAsRead}
                deleteAllNotifications={deleteAllNotifications}
                deleteNotification={deleteNotification}
                notifLoading={notifLoading}
                notifData={notifData}
                showUserDropdown={showUserDropdown}
                setShowUserDropdown={setShowUserDropdown}
                dropdownRef={dropdownRef}
                currentUser={currentUser}
                onLogout={onLogout}
            />

            {/* ─── Main Website Content Area ───────────────────────────────────────── */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col min-h-0 relative">
                {showBulkExpense ? (
                    <WebBulkExpenseScreen
                        onBack={() => setShowBulkExpense(false)}
                        onDone={() => {
                            setShowBulkExpense(false);
                            setTab("expenses");
                        }}
                    />
                ) : showBulkBill ? (
                    <WebBulkBillScreen
                        onBack={() => setShowBulkBill(false)}
                        onDone={() => {
                            setShowBulkBill(false);
                            setTab("bills");
                        }}
                    />
                ) : (
                    <>
                        {/* Mobile View Navigation Helper */}
                        <div className="md:hidden flex items-center justify-around bg-[#251508] border border-border p-1.5 rounded-2xl mb-6 select-none shadow-lg">
                            {[
                                { id: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
                                { id: "expenses", label: "Expenses", icon: <ShoppingBag className="w-4 h-4" /> },
                                { id: "bills", label: "Bills", icon: <Receipt className="w-4 h-4" /> },
                                { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
                            ].map((item) => (
                                <button key={item.id} onClick={() => setTab(item.id as never)} className="flex-1 py-2 flex flex-col items-center gap-1 rounded-xl text-xs font-medium cursor-pointer" style={{ color: tab === item.id ? "#e8a020" : "#a08060" }}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>

                <AnimatePresence mode="wait">
                    <motion.div key={tab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="flex-1 flex flex-col gap-8 min-h-0">
                        {/* ─── TAB: HOME (WEBSITE DESIGN) ─────────────────────────────── */}
                        {tab === "home" && (
                            <>
                                {/* ─── Group Header ───────────────────────────────────────── */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                                            {dashboardStats?.groupName || stats?.groupName || "My Bazar Group"}
                                        </h1>
                                        <p className="text-muted-foreground text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                            {mn} {yr} — Hisab Overview
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10">
                                            <Star className="w-3 h-3 text-primary" strokeWidth={2} />
                                            <span className="text-primary text-xs font-semibold font-mono">{dashboardStats?.totalMembers ?? stats?.totalMembers ?? 1} members</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-[#251508]">
                                            <BookOpen className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                                            <span className="text-muted-foreground text-xs font-semibold font-mono">
                                                {isDashboardLoading ? <WebLoadingDots currency={false} size="sm" /> : (dashboardStats?.totalGroupBazarAndBills ?? dashboardStats?.totalGroupBazarEntries ?? 0)} entries
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ─── 3 Hero Summary Cards ──────────────────────────────── */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {/* Total Expense Card */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                                        className="rounded-2xl border border-primary/30 p-6 relative overflow-hidden"
                                        style={{ background: "linear-gradient(145deg, rgba(232,160,32,0.15) 0%, rgba(192,96,16,0.06) 100%)", boxShadow: "0 4px 32px rgba(232,160,32,0.12)" }}
                                    >
                                        <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-primary/5 -translate-y-6 translate-x-6 pointer-events-none" />
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                                                <TrendingUp className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">Total Expense</span>
                                        </div>
                                        <div className="min-h-[2.5rem] flex items-center text-3xl font-bold text-primary font-mono mb-1">
                                            {isDashboardLoading ? <WebLoadingDots currency size="lg" /> : fmt(dashboardStats?.thisMonthTotalExpense ?? 0)}
                                        </div>
                                        {!isDashboardLoading && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <WebDelta current={dashboardStats?.thisMonthTotalExpense ?? 0} prev={dashboardStats?.prevMonthTotalExpense ?? 0} />
                                                <span className="text-[11px] text-muted-foreground">vs last month</span>
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Bazar Expense Card */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
                                        className="rounded-2xl border border-border bg-[#251508] p-6 relative overflow-hidden"
                                        style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/3 -translate-y-6 translate-x-6 pointer-events-none" />
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/12 border border-primary/20 flex items-center justify-center">
                                                <ShoppingBag className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">Bazar Expense</span>
                                        </div>
                                        <div className="min-h-[2.5rem] flex items-center text-3xl font-bold text-foreground font-mono mb-1">
                                            {isDashboardLoading ? <WebLoadingDots currency size="lg" /> : fmt(dashboardStats?.thisMonthBazarExpense ?? 0)}
                                        </div>
                                        {!isDashboardLoading && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <WebDelta current={dashboardStats?.thisMonthBazarExpense ?? 0} prev={dashboardStats?.prevMonthBazarExpense ?? 0} />
                                                <span className="text-[11px] text-muted-foreground">vs last month</span>
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Bill Expense Card */}
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.19 }}
                                        className="rounded-2xl border border-border bg-[#251508] p-6 relative overflow-hidden"
                                        style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-accent/3 -translate-y-6 translate-x-6 pointer-events-none" />
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center">
                                                <Receipt className="w-4 h-4 text-accent" />
                                            </div>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">Bill Expense</span>
                                        </div>
                                        <div className="min-h-[2.5rem] flex items-center text-3xl font-bold text-foreground font-mono mb-1">
                                            {isDashboardLoading ? <WebLoadingDots currency size="lg" /> : fmt(dashboardStats?.thisMonthBillExpense ?? 0)}
                                        </div>
                                        {!isDashboardLoading && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <WebDelta current={dashboardStats?.thisMonthBillExpense ?? 0} prev={dashboardStats?.prevMonthBillExpense ?? 0} />
                                                <span className="text-[11px] text-muted-foreground">vs last month</span>
                                            </div>
                                        )}
                                    </motion.div>
                                </div>

                                {/* ─── Expense Breakdown Panels + Recent Logs ─────────────── */}
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                                    {/* Left: Breakdown panels (3 cols) */}
                                    <div className="lg:col-span-3 flex flex-col gap-5">
                                        {/* Bazar Breakdown */}
                                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                                            className="bg-[#251508] border border-border rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.25)" }}
                                        >
                                            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-[#2e1a0a]/50">
                                                <ShoppingBag className="w-4 h-4 text-primary" />
                                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-mono">Bazar Breakdown</span>
                                            </div>
                                            <div className="divide-y divide-border/50">
                                                <ExpenseRow label={`${mn} ${yr}`} value={dashboardStats?.thisMonthBazarExpense ?? 0} prev={dashboardStats?.prevMonthBazarExpense ?? 0} isLoading={isDashboardLoading} color="text-primary" />
                                                <ExpenseRow label="Previous Month" value={dashboardStats?.prevMonthBazarExpense ?? 0} isLoading={isDashboardLoading} />
                                                <ExpenseRow label={`Year ${yr}`} value={dashboardStats?.thisYearBazarExpense ?? 0} prev={dashboardStats?.prevYearBazarExpense ?? 0} isLoading={isDashboardLoading} color="text-primary" />
                                                <ExpenseRow label={`Year ${yr - 1}`} value={dashboardStats?.prevYearBazarExpense ?? 0} isLoading={isDashboardLoading} />
                                            </div>
                                        </motion.div>

                                        {/* Bill Breakdown */}
                                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                            className="bg-[#251508] border border-border rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.25)" }}
                                        >
                                            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-[#2e1a0a]/50">
                                                <Receipt className="w-4 h-4 text-accent" />
                                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-mono">Bill Breakdown</span>
                                            </div>
                                            <div className="divide-y divide-border/50">
                                                <ExpenseRow label={`${mn} ${yr}`} value={dashboardStats?.thisMonthBillExpense ?? 0} prev={dashboardStats?.prevMonthBillExpense ?? 0} isLoading={isDashboardLoading} color="text-accent" />
                                                <ExpenseRow label="Previous Month" value={dashboardStats?.prevMonthBillExpense ?? 0} isLoading={isDashboardLoading} />
                                                <ExpenseRow label={`Year ${yr}`} value={dashboardStats?.thisYearBillExpense ?? 0} prev={dashboardStats?.prevYearBillExpense ?? 0} isLoading={isDashboardLoading} color="text-accent" />
                                                <ExpenseRow label={`Year ${yr - 1}`} value={dashboardStats?.prevYearBillExpense ?? 0} isLoading={isDashboardLoading} />
                                            </div>
                                        </motion.div>

                                        {/* Year Totals */}
                                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                                            className="bg-[#251508] border border-border rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.25)" }}
                                        >
                                            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-[#2e1a0a]/50">
                                                <BarChart2 className="w-4 h-4 text-green-400" />
                                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-mono">Yearly Summary</span>
                                            </div>
                                            <div className="divide-y divide-border/50">
                                                <ExpenseRow label={`${yr} Grand Total`} value={dashboardStats?.thisYearTotalExpense ?? 0} prev={dashboardStats?.prevYearTotalExpense ?? 0} isLoading={isDashboardLoading} color="text-green-400" />
                                                <ExpenseRow label={`${yr - 1} Grand Total`} value={dashboardStats?.prevYearTotalExpense ?? 0} isLoading={isDashboardLoading} />
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Right: Recent Bazar Logs (2 cols) */}
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                        className="lg:col-span-2 bg-[#251508] border border-border rounded-2xl overflow-hidden flex flex-col"
                                        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.25)" }}
                                    >
                                        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-[#2e1a0a]/50 shrink-0">
                                            <ShoppingBag className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-mono">Recent Bazar Logs</span>
                                        </div>

                                        <div className="flex-1 overflow-y-auto">
                                            {bazarEntriesLoading ? (
                                                <div className="divide-y divide-border/30">
                                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                                        <div key={i} className="flex items-center justify-between px-5 py-3 animate-pulse">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-[#2e1a0a]" />
                                                                <div>
                                                                    <div className="h-3 w-28 bg-[#2e1a0a] rounded mb-1.5" />
                                                                    <div className="h-2.5 w-20 bg-[#2e1a0a] rounded" />
                                                                </div>
                                                            </div>
                                                            <div className="h-3.5 w-14 bg-[#2e1a0a] rounded" />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : bazarEntriesResponse?.data && bazarEntriesResponse.data.length > 0 ? (
                                                <div className="divide-y divide-border/30">
                                                    {bazarEntriesResponse.data.slice(0, 10).map((e: any) => (
                                                        <div key={e._id} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition-colors">
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
                                                                    {e.product?.photo ? (
                                                                        <Image src={e.product.photo} alt={e.product?.name || e.name} width={32} height={32} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium truncate text-[#f5ede2]">{e.product?.name || e.name}</p>
                                                                    <p className="text-[11px] text-muted-foreground font-mono">
                                                                        {e.user?.name || "Unknown"} · {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right shrink-0 pl-3">
                                                                <p className="text-sm font-bold text-primary font-mono">৳{(e.totalPrice ?? ((e.price || 0) * (e.quantity || 1))).toLocaleString()}</p>
                                                                <p className="text-[10px] text-muted-foreground font-mono">{e.quantity} {e.unit}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-12">
                                                    <ShoppingBag className="w-8 h-8 mb-2 opacity-20" />
                                                    <p className="text-sm">No bazar entries yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* ─── Monthly Expense Trend Component ─── */}
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                                    <WebMonthlyTrendChart data={monthlyTrendData} isLoading={isMonthlyTrendLoading} />
                                </motion.div>
                            </>
                        )}

                        {/* ─── TAB: EXPENSES (WEBSITE LIST VIEW) ───────────────────────── */}
                        {tab === "expenses" && (
                            <div className="flex-1 flex flex-col gap-6 min-h-0 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
                                {/* Search & Actions */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 select-none">
                                    <div className="relative w-full sm:w-80">
                                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input type="text" value={expenseSearch} onChange={(e) => setExpenseSearch(e.target.value)} placeholder="Search bazar items or buyers..." className="w-full pl-10 pr-4 py-2.5 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none" />
                                    </div>

                                    <div className="flex gap-2 p-0.5 border border-border rounded-xl bg-[#1a0e07]">
                                        {(["month", "all"] as const).map((f) => (
                                            <button
                                                key={f}
                                                onClick={() => {
                                                    setExpenseFilter(f);
                                                    setExpensePage(1);
                                                }}
                                                className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                                                style={{
                                                    background: expenseFilter === f ? "#e8a020" : "transparent",
                                                    color: expenseFilter === f ? "#1a0e07" : "#a08060",
                                                }}
                                            >
                                                {f === "month" ? "This Month" : "All Time"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Table Feed */}
                                <div className="flex-1 overflow-auto rounded-2xl border border-[rgba(232,160,32,0.1)]">
                                    <table className="w-full border-collapse text-left text-sm">
                                        <thead className="bg-[#2e1a0a] text-muted-foreground font-mono text-xs border-b border-[rgba(232,160,32,0.1)] sticky top-0">
                                            <tr>
                                                <th className="p-4">Item</th>
                                                <th className="p-4">Buyer</th>
                                                <th className="p-4">Date</th>
                                                <th className="p-4 text-right">Price</th>
                                                <th className="p-4 text-right">Qty</th>
                                                 <th className="p-4 text-right">Total</th>
                                                <th className="p-4 text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[rgba(232,160,32,0.06)] bg-[#251508]">
                                            {bazarEntriesLoading || (bazarEntriesFetching && (!bazarEntriesResponse?.data || bazarEntriesResponse.data.length === 0)) ? (
                                                [1, 2, 3, 4, 5].map((i) => (
                                                    <tr key={i} className="animate-pulse">
                                                        <td className="p-4">
                                                            <div className="h-4 bg-[#2e1a0a] rounded-md w-32" />
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="h-4 bg-[#2e1a0a] rounded-md w-24" />
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="h-4 bg-[#2e1a0a] rounded-md w-20" />
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="h-4 bg-[#2e1a0a] rounded-md w-16 ml-auto" />
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="h-4 bg-[#2e1a0a] rounded-md w-12 ml-auto" />
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="h-4 bg-[#2e1a0a] rounded-md w-16 ml-auto" />
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="h-4 bg-[#2e1a0a] rounded-md w-12 mx-auto" />
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : bazarEntriesResponse?.data && bazarEntriesResponse.data.length > 0 ? (
                                                bazarEntriesResponse.data
                                                    .filter((e: any) => {
                                                        const query = expenseSearch.toLowerCase();
                                                        const pName = e.product?.name || "";
                                                        const uName = e.user?.name || "";
                                                        const notes = e.notes || "";
                                                        return pName.toLowerCase().includes(query) || uName.toLowerCase().includes(query) || notes.toLowerCase().includes(query);
                                                    })
                                                    .map((e: any) => (
                                                        <tr key={e._id} className="hover:bg-primary/5 transition-colors">
                                                            <td className="p-4 font-semibold flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-xl overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                                                    {e.product?.photo ? (
                                                                        <Image src={e.product.photo} alt={e.product?.name || "Bazar Item"} width={32} height={32} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <span className="text-base">🛒</span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p>{e.product?.name || "Bazar Item"}</p>
                                                                    {e.notes && <p className="text-[10px] text-muted-foreground font-normal italic">{e.notes}</p>}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center font-bold text-[9px] text-[#f5ede2] shrink-0" style={{ background: avatarColor(e.user?._id || "u") }}>
                                                                        {e.user?.profileImage ? (
                                                                            <Image src={e.user.profileImage} alt={e.user?.name || "User"} width={24} height={24} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            initials(e.user?.name || "U")
                                                                        )}
                                                                    </div>
                                                                    <span>{e.user?.name || "User"}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-muted-foreground font-mono text-xs">{new Date(e.date).toLocaleDateString()}</td>
                                                            <td className="p-4 text-right font-mono">৳{e.price.toLocaleString()}</td>
                                                            <td className="p-4 text-right font-mono text-xs">
                                                                {e.quantity} {e.unit}
                                                            </td>
                                                            <td className="p-4 text-right font-bold text-primary font-mono">৳{(e.totalPrice ?? (e.price * e.quantity)).toLocaleString()}</td>
                                                            <td className="p-4 text-center">
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <button onClick={() => setEditingExpense(e)} className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors cursor-pointer" title="Edit Expense">
                                                                        <Edit2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button onClick={() => setDeletingExpenseId(e._id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer" title="Delete Expense">
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="p-12 text-center text-xs font-mono text-muted-foreground">
                                                        No bazar entries found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Expenses Pagination Footer */}
                                {bazarEntriesResponse?.meta && (
                                    <WebPagination
                                        page={bazarEntriesResponse.meta.page}
                                        totalPages={bazarEntriesResponse.meta.totalPages}
                                        total={bazarEntriesResponse.meta.total}
                                        itemLabel="entries"
                                        hasPrev={bazarEntriesResponse.meta.hasPrev}
                                        hasNext={bazarEntriesResponse.meta.hasNext}
                                        onPrev={() => setExpensePage((p) => Math.max(p - 1, 1))}
                                        onNext={() => setExpensePage((p) => p + 1)}
                                    />
                                )}
                            </div>
                        )}

                        {/* ─── TAB: BILLS (WEBSITE CARD GRID VIEW) ────────────────────── */}
                        {tab === "bills" && (
                            <div className="flex-1 flex flex-col gap-6 min-h-0 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
                                {/* Search & Actions */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 select-none">
                                    <div className="relative w-full sm:w-80">
                                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input type="text" value={billSearch} onChange={(e) => setBillSearch(e.target.value)} placeholder="Search bills or titles..." className="w-full pl-10 pr-4 py-2.5 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none" />
                                    </div>

                                    <div className="flex gap-2 p-0.5 border border-border rounded-xl bg-[#1a0e07]">
                                        {(["month", "all"] as const).map((f) => (
                                            <button
                                                key={f}
                                                onClick={() => {
                                                    setBillFilter(f);
                                                    setBillPage(1);
                                                }}
                                                className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                                                style={{
                                                    background: billFilter === f ? "#e8a020" : "transparent",
                                                    color: billFilter === f ? "#1a0e07" : "#a08060",
                                                }}
                                            >
                                                {f === "month" ? "This Month" : "All Time"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Grid layout */}
                                <div className="flex-1 overflow-y-auto">
                                    {billsLoading || (billsFetching && (!billsResponse?.data || billsResponse.data.length === 0)) ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-1">
                                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                                <div key={i} className="rounded-2xl border border-border bg-[#1a0e07] p-5 flex flex-col justify-between gap-4 animate-pulse">
                                                    <div className="space-y-3">
                                                        <div className="h-5 bg-[#2e1a0a] rounded-lg w-24" />
                                                        <div className="h-5 bg-[#2e1a0a] rounded-md w-3/4" />
                                                    </div>
                                                    <div className="pt-3 border-t border-[rgba(232,160,32,0.06)] flex items-center justify-between">
                                                        <div className="h-4 bg-[#2e1a0a] rounded-md w-20" />
                                                        <div className="h-6 bg-[#2e1a0a] rounded-md w-16" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : billsResponse?.data && billsResponse.data.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pr-1">
                                            {billsResponse.data
                                                .filter((b: any) => {
                                                    const query = billSearch.toLowerCase();
                                                    const title = b.title || "";
                                                    const uName = b.user?.name || "";
                                                    const cat = b.category || "";
                                                    return title.toLowerCase().includes(query) || uName.toLowerCase().includes(query) || cat.toLowerCase().includes(query);
                                                })
                                                .map((b: any) => {
                                                    const meta = BILL_META[b.category as keyof typeof BILL_META] || { icon: "📄", label: b.category, color: "#e8a020" };
                                                    return (
                                                        <motion.div
                                                            key={b._id}
                                                            initial={{ opacity: 0, y: 15 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            whileHover={{ y: -4, scale: 1.015, boxShadow: `0 8px 30px ${meta.color}25` }}
                                                            transition={{ duration: 0.2 }}
                                                            className="rounded-2xl border border-border bg-[#1a0e07] p-5 flex flex-col justify-between gap-4 relative overflow-hidden transition-colors hover:border-primary/40 group"
                                                        >
                                                            <div>
                                                                <div className="flex items-center justify-between gap-2 mb-3">
                                                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold font-mono border shadow-sm transition-transform group-hover:scale-105" style={{ background: `${meta.color}15`, color: meta.color, borderColor: `${meta.color}30` }}>
                                                                        {meta.icon} {meta.label}
                                                                    </span>
                                                                    <div className="flex items-center gap-1">
                                                                        <button onClick={() => setEditingBill(b)} className="text-muted-foreground hover:text-primary p-1 rounded-md transition-colors cursor-pointer" title="Edit Bill">
                                                                            <Edit2 className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <button onClick={() => setDeletingBillId(b._id)} className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors cursor-pointer" title="Delete Bill">
                                                                            <X className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{b.title}</h4>
                                                                {b.notes && <p className="text-xs text-muted-foreground mt-1.5 italic font-sans">"{b.notes}"</p>}
                                                            </div>

                                                            <div className="pt-3 border-t border-[rgba(232,160,32,0.06)] flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-xs font-medium text-muted-foreground font-mono">Added by: <span className="text-foreground font-semibold">{b.user?.name || "User"}</span></p>
                                                                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{new Date(b.date).toLocaleDateString()}</p>
                                                                </div>
                                                                <p className="text-xl font-extrabold text-accent font-mono">৳{b.amount.toLocaleString()}</p>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                        </div>
                                    ) : (
                                        <div className="p-16 text-center text-xs font-mono text-muted-foreground bg-[#1a0e07] border border-border/60 rounded-2xl">No monthly bills found.</div>
                                    )}
                                </div>

                                {/* Bills Pagination Footer */}
                                {billsResponse?.meta && (
                                    <WebPagination
                                        page={billsResponse.meta.page}
                                        totalPages={billsResponse.meta.totalPages}
                                        total={billsResponse.meta.total}
                                        itemLabel="bills"
                                        hasPrev={billsResponse.meta.hasPrev}
                                        hasNext={billsResponse.meta.hasNext}
                                        onPrev={() => setBillPage((p) => Math.max(p - 1, 1))}
                                        onNext={() => setBillPage((p) => p + 1)}
                                    />
                                )}
                            </div>
                        )}

                        {/* ─── TAB: PRODUCTS (GROUP CATALOG & PRICE GROWTH) ───────── */}
                        {tab === "products" && <WebProductsTab />}

                        {/* ─── TAB: NOTIFICATIONS (FULL-PAGE NOTIFICATIONS LOGS VIEW) ─── */}
                        {tab === "notifications" && <WebNotificationsTab markAllAsRead={markAllAsRead} deleteAllNotifications={deleteAllNotifications} notifLoading={notifLoading} notifData={notifData} deleteNotification={deleteNotification} />}

                        {/* ─── TAB: PROFILE (WEBSITE PROFILE EDITOR) ─────────────────── */}
                        {tab === "profile" && (
                            <WebProfileTab
                                currentUser={currentUser}
                                isEditingProfile={isEditingProfile}
                                setIsEditingProfile={setIsEditingProfile}
                                profileImage={profileImage}
                                setProfileImage={setProfileImage}
                                name={name}
                                setName={setName}
                                email={email}
                                phone={phone}
                                setPhone={setPhone}
                                language={language}
                                setLanguage={setLanguage}
                                aboutme={aboutme}
                                setAboutme={setAboutme}
                                street={street}
                                setStreet={setStreet}
                                city={city}
                                setCity={setCity}
                                state={state}
                                setState={setState}
                                zipCode={zipCode}
                                setZipCode={setZipCode}
                                country={country}
                                setCountry={setCountry}
                                updateProfile={updateProfile}
                                profileLoading={profileLoading}
                                currentPassword={currentPassword}
                                setCurrentPassword={setCurrentPassword}
                                newPassword={newPassword}
                                setNewPassword={setNewPassword}
                                repeatPassword={repeatPassword}
                                setRepeatPassword={setRepeatPassword}
                                changePassword={changePassword}
                                passLoading={passLoading}
                                setShowFeedback={setShowFeedback}
                                setShowContact={setShowContact}
                                setShowReview={setShowReview}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
                </>
                )}
            </main>

            {/* Website Dialog: Add Bazar Expense */}
            <Modal
                show={showAddExpense}
                onClose={() => setShowAddExpense(false)}
                title="Add Bazar Expense"
                headerAction={
                    <button
                        type="button"
                        onClick={() => {
                            setShowAddExpense(false);
                            setShowBulkExpense(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-all cursor-pointer border border-primary/20"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Multiple
                    </button>
                }
            >
                <AddExpenseForm
                    isLoading={bazarLoading}
                    onSubmit={(prod, price, qty, unit, date, notes, totalPrice) => {
                        handleAddExpense(prod, price, qty, unit, date, notes, totalPrice);
                        setShowAddExpense(false);
                    }}
                    onClose={() => setShowAddExpense(false)}
                />
            </Modal>

            {/* Website Dialog: Add Monthly Bill */}
            <Modal
                show={showAddBill}
                onClose={() => setShowAddBill(false)}
                title="Add Monthly Bill"
                headerAction={
                    <button
                        type="button"
                        onClick={() => {
                            setShowAddBill(false);
                            setShowBulkBill(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent text-xs font-bold transition-all cursor-pointer border border-accent/20"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Multiple
                    </button>
                }
            >
                <AddBillForm
                    isLoading={billMutationLoading}
                    onSubmit={(cat, title, amount, date, notes) => {
                        handleAddBill(cat, title, amount, date, notes);
                        setShowAddBill(false);
                    }}
                    onClose={() => setShowAddBill(false)}
                />
            </Modal>

            {/* Website Dialog: Contact Us */}
            <Modal show={showContact} onClose={() => setShowContact(false)} title="Contact Us / Support">
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (!contactSubject || !contactMsg) return;
                        try {
                            await submitContact({
                                name: currentUser?.name || "User",
                                email: currentUser?.email || "user@example.com",
                                subject: contactSubject,
                                message: contactMsg,
                            }).unwrap();
                            toast.success("Message submitted successfully!");
                            setContactSubject("");
                            setContactMsg("");
                            setShowContact(false);
                        } catch (err: any) {
                            toast.error(err?.data?.message || "Failed to send message");
                        }
                    }}
                    className="flex flex-col gap-4 text-left"
                >
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Subject</label>
                        <input type="text" value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} required placeholder="What can we help you with?" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Message</label>
                        <textarea value={contactMsg} onChange={(e) => setContactMsg(e.target.value)} required rows={4} placeholder="Type your message details here…" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none resize-none" />
                    </div>
                    <div className="flex gap-3 mt-2">
                        <button type="button" onClick={() => setShowContact(false)} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-secondary cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" disabled={contactLoading} className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-accent cursor-pointer disabled:opacity-50">
                            {contactLoading ? "Sending…" : "Send Message"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Website Dialog: Give Feedback */}
            <Modal show={showFeedback} onClose={() => setShowFeedback(false)} title="Submit Feedback">
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (!feedbackSubject || !feedbackMsg) return;
                        try {
                            await createFeedback({
                                category: feedbackCategory,
                                subject: feedbackSubject,
                                message: feedbackMsg,
                            }).unwrap();
                            toast.success("Thank you! Feedback submitted.");
                            setFeedbackSubject("");
                            setFeedbackMsg("");
                            setShowFeedback(false);
                        } catch (err: any) {
                            toast.error(err?.data?.message || "Failed to submit feedback");
                        }
                    }}
                    className="flex flex-col gap-4 text-left"
                >
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Category</label>
                        <select value={feedbackCategory} onChange={(e) => setFeedbackCategory(e.target.value as any)} className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-sans" style={{ colorScheme: "dark" }}>
                            <option value="GENERAL">General Feedback</option>
                            <option value="BUG">Report a Bug</option>
                            <option value="FEATURE_REQUEST">Feature Request</option>
                            <option value="UI_UX">UI / UX Improvement</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Subject</label>
                        <input type="text" value={feedbackSubject} onChange={(e) => setFeedbackSubject(e.target.value)} required placeholder="Feedback title..." className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Feedback Details</label>
                        <textarea value={feedbackMsg} onChange={(e) => setFeedbackMsg(e.target.value)} required rows={4} placeholder="Tell us what you think..." className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none resize-none" />
                    </div>
                    <div className="flex gap-3 mt-2">
                        <button type="button" onClick={() => setShowFeedback(false)} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-secondary cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" disabled={feedbackLoading} className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-accent cursor-pointer disabled:opacity-50">
                            {feedbackLoading ? "Submitting…" : "Submit Feedback"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Website Dialog: Leave a Review */}
            <Modal show={showReview} onClose={() => setShowReview(false)} title="Leave a User Review">
                <WebReviewModalContent
                    myReviewLoading={myReviewLoading}
                    userReviewState={userReviewState}
                    reviewRating={reviewRating}
                    setReviewRating={setReviewRating}
                    reviewComment={reviewComment}
                    setReviewComment={setReviewComment}
                    onSubmitReview={async (e) => {
                        e.preventDefault();
                        if (!reviewComment) return;
                        try {
                            await createReview({
                                rating: reviewRating,
                                comment: reviewComment,
                            }).unwrap();
                            toast.success("Review posted successfully!");
                            setReviewComment("");
                            refetchMyReview();
                            setShowReview(false);
                        } catch (err: any) {
                            toast.error(err?.data?.message || "Failed to post review");
                        }
                    }}
                    onClose={() => setShowReview(false)}
                    reviewLoading={reviewLoading}
                />
            </Modal>

            {/* Website Dialog: Notifications Full Modal */}
            <Modal show={showNotifications} onClose={() => setShowNotifications(false)} title="Notification History & Logs">
                <div className="flex flex-col gap-4 font-sans text-left">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <span className="text-xs font-mono text-muted-foreground">
                            Total: <span className="font-bold text-primary">{notifData?.data?.length || 0}</span> notifications
                        </span>
                        {notifData?.data && notifData.data.length > 0 && (
                            <button onClick={() => deleteAllNotifications()} className="px-3 py-1 rounded-xl bg-destructive/15 text-destructive border border-destructive/30 text-xs font-mono font-bold hover:bg-destructive/25 transition-all cursor-pointer">
                                Clear All Notifications
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
                        {notifData?.data && notifData.data.length > 0 ? (
                            notifData.data.map((n: any) => (
                                <div key={n._id} className={`p-4 rounded-2xl border transition-all text-left flex items-start justify-between gap-3 ${!n.isRead ? "bg-primary/10 border-primary/40 shadow-sm" : "bg-[#1a0e07] border-border/60 hover:bg-white/5"}`}>
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex items-center justify-between font-mono text-xs">
                                            <span className="font-bold text-primary">{n.title}</span>
                                            <span className="text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs text-foreground font-sans leading-relaxed">{n.message}</p>
                                    </div>
                                    <button onClick={() => deleteNotification(n._id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer" title="Delete notification">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="p-12 text-center text-xs font-mono text-muted-foreground">No notification messages recorded.</p>
                        )}
                    </div>
                </div>
            </Modal>

            {/* Website Dialog: Delete Expense Confirmation */}
            <WebConfirmModal
                show={Boolean(deletingExpenseId)}
                onClose={() => setDeletingExpenseId(null)}
                title="Confirm Delete Expense"
                message="Are you sure you want to delete this bazar expense record? This action cannot be undone."
                onConfirm={async () => {
                    if (deletingExpenseId) {
                        await handleDeleteExpense(deletingExpenseId);
                        setDeletingExpenseId(null);
                    }
                }}
            />

            {/* Website Dialog: Delete Bill Confirmation */}
            <WebConfirmModal
                show={Boolean(deletingBillId)}
                onClose={() => setDeletingBillId(null)}
                title="Confirm Delete Monthly Bill"
                message="Are you sure you want to delete this monthly bill record? This action cannot be undone."
                onConfirm={async () => {
                    if (deletingBillId) {
                        await handleDeleteBill(deletingBillId);
                        setDeletingBillId(null);
                    }
                }}
            />

            {/* Edit Expense Modal */}
            <EditExpenseModal entry={editingExpense} onClose={() => setEditingExpense(null)} />

            {/* Edit Bill Modal */}
            <EditBillModal bill={editingBill} onClose={() => setEditingBill(null)} />

            {/* Expense & Bill Statement Generator Modal */}
            <WebStatementModal show={showStatement} onClose={() => setShowStatement(false)} />
        </div>
    );
}
