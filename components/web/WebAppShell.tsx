import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Home, ShoppingBag, Receipt, User, Plus, Search, X, LogOut, Lock, Mail, Phone, ShieldCheck, Globe, MapPin, ChevronDown, Edit3, Bell, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";
import { BazarUnit, BillCategory, MockBazarEntry, MockBill, GroupStats } from "@/types";
import { INITIAL_ENTRIES, INITIAL_BILLS, MOCK_USERS, MOCK_PRODUCTS, BILL_META, fmt, fmtFull, fmtDate } from "@/lib/mockData";
import { useGetMeQuery, useUpdateProfileMutation, useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { useSubmitMessageMutation } from "@/redux/features/contact/contactApi";
import { useCreateFeedbackMutation } from "@/redux/features/feedback/feedbackApi";
import { useCreateReviewMutation, useGetMyReviewQuery } from "@/redux/features/review/reviewApi";
import { useGetMyNotificationsQuery, useGetUnreadCountQuery, useMarkAllAsReadMutation, useDeleteAllNotificationsMutation, useDeleteNotificationMutation } from "@/redux/features/notification/notificationApi";
import { useCreateBazarEntryMutation, useGetAllBazarEntriesQuery, useDeleteBazarEntryMutation } from "@/redux/features/bazar-entry/bazarEntryApi";
import { useCreateBillMutation, useGetAllBillsQuery, useDeleteBillMutation } from "@/redux/features/bill/billApi";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { WebPagination } from "@/components/web/shell/WebPagination";
import { WebConfirmModal } from "@/components/web/shell/WebModal";
import { WebHeader } from "@/components/web/shell/WebHeader";
import { WebProfileTab } from "@/components/web/shell/WebProfileTab";
import { WebNotificationsTab } from "@/components/web/shell/WebNotificationsTab";
import { WebDialogModal as Modal, WebFieldBox as FieldBox, WebAddExpenseForm as AddExpenseForm, WebAddBillForm as AddBillForm, WebReviewModalContent } from "@/components/web/shell/WebDialogs";
import { WebMetricCard as MetricCard, avatarColor, initials } from "@/components/web/shell/WebMetricCard";

export function WebAppShell({ stats, onLogout }: { stats?: GroupStats; onLogout: () => void }) {
    const router = useRouter();
    // Website Tabs
    const [tab, setTab] = useState<"home" | "expenses" | "bills" | "notifications" | "profile">("home");
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

    // Core App States (Independent copies for the web shell)
    const [entries, setEntries] = useState<MockBazarEntry[]>(INITIAL_ENTRIES);
    const [bills, setBills] = useState<MockBill[]>(INITIAL_BILLS);

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

    // Delete Confirmation Modal States
    const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
    const [deletingBillId, setDeletingBillId] = useState<string | null>(null);

    // Onboarding & Interaction Modal States
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showAddBill, setShowAddBill] = useState(false);
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

    // Calculations
    const calculations = useMemo(() => {
        const isThisMonth = (d: Date) => {
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        };

        // Filtered entries
        const monthEntries = entries.filter((e) => isThisMonth(e.date));
        const monthBills = bills.filter((b) => isThisMonth(b.date));

        const totalBazar = monthEntries.reduce((sum, e) => sum + e.price * e.quantity, 0);
        const totalBills = monthBills.reduce((sum, b) => sum + b.amount, 0);
        const grandTotal = totalBazar + totalBills;

        // Member-wise spending
        const memberSpendMap: Record<string, number> = {};
        MOCK_USERS.forEach((u) => {
            memberSpendMap[u.id] = 0;
        });

        entries.forEach((e) => {
            if (memberSpendMap[e.user.id] !== undefined) {
                memberSpendMap[e.user.id] += e.price * e.quantity;
            }
        });

        bills.forEach((b) => {
            if (memberSpendMap[b.user.id] !== undefined) {
                memberSpendMap[b.user.id] += b.amount;
            }
        });

        const averageSpend = grandTotal / MOCK_USERS.length;

        const memberSplits = MOCK_USERS.map((u) => {
            const spent = memberSpendMap[u.id] || 0;
            const balance = spent - averageSpend;
            return {
                user: u,
                spent,
                balance,
            };
        });

        // Calculate settlements (who owes whom)
        const debtors: { id: string; name: string; amount: number }[] = [];
        const creditors: { id: string; name: string; amount: number }[] = [];

        memberSplits.forEach((s) => {
            if (s.balance < -0.01) {
                debtors.push({ id: s.user.id, name: s.user.name, amount: Math.abs(s.balance) });
            } else if (s.balance > 0.01) {
                creditors.push({ id: s.user.id, name: s.user.name, amount: s.balance });
            }
        });

        const settlements: { from: string; to: string; amount: number }[] = [];
        let dIdx = 0,
            cIdx = 0;

        while (dIdx < debtors.length && cIdx < creditors.length) {
            const debtor = debtors[dIdx];
            const creditor = creditors[cIdx];
            const amount = Math.min(debtor.amount, creditor.amount);

            settlements.push({
                from: debtor.name,
                to: creditor.name,
                amount: amount,
            });

            debtor.amount -= amount;
            creditor.amount -= amount;

            if (debtor.amount < 0.01) dIdx++;
            if (creditor.amount < 0.01) cIdx++;
        }

        return {
            totalBazar,
            totalBills,
            grandTotal,
            averageSpend,
            memberSplits,
            settlements,
            monthEntriesCount: monthEntries.length,
            monthBillsCount: monthBills.length,
        };
    }, [entries, bills]);

    // Handlers
    const handleAddExpense = async (productName: string, price: number, quantity: number, unit: BazarUnit, dateStr: string, notes: string) => {
        try {
            await createBazarEntry({
                name: productName.trim(),
                price: Number(price),
                quantity: Number(quantity),
                unit,
                date: dateStr,
                notes: notes ? notes.trim() : undefined,
            }).unwrap();

            toast.success(`Logged ${productName} expense successfully!`);

            // Also update local mock copy for instant UI sync
            const matchedProduct = MOCK_PRODUCTS.find((p) => p.name.toLowerCase() === productName.toLowerCase()) || {
                id: "p_" + Date.now(),
                name: productName,
                emoji: "🛒",
            };

            const newEntry: MockBazarEntry = {
                id: "e_" + Date.now(),
                product: matchedProduct,
                price,
                quantity,
                unit,
                date: new Date(dateStr),
                notes: notes || undefined,
                user: MOCK_USERS[0],
            };

            setEntries((prev) => [newEntry, ...prev]);
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

            // Also update local mock copy for instant UI sync
            const newBill: MockBill = {
                id: "b_" + Date.now(),
                category,
                title,
                amount,
                date: new Date(dateStr),
                notes: notes || undefined,
                user: MOCK_USERS[0],
            };

            setBills((prev) => [newBill, ...prev]);
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to add monthly bill");
        }
    };

    const handleDeleteExpense = async (id: string) => {
        try {
            await deleteBazarEntry(id).unwrap();
            toast.success("Expense entry deleted successfully!");
            setEntries((prev) => prev.filter((e) => e.id !== id));
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete expense entry");
        }
    };

    const handleDeleteBill = async (id: string) => {
        try {
            await deleteBill(id).unwrap();
            toast.success("Monthly bill deleted successfully!");
            setBills((prev) => prev.filter((b) => b.id !== id));
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
                setTab={setTab}
                setShowAddExpense={setShowAddExpense}
                setShowAddBill={setShowAddBill}
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
                                {/* Banner metrics */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 shrink-0">
                                    <MetricCard title="Total Bazar Spent" value={calculations.totalBazar} subtitle={`${calculations.monthEntriesCount} shopping items logged`} color="text-primary" />
                                    <MetricCard title="Monthly Rent & Bills" value={calculations.totalBills} subtitle={`${calculations.monthBillsCount} bills this month`} color="text-accent" />
                                    <MetricCard title="Grand Combined Total" value={calculations.grandTotal} subtitle="All room accounts total" color="text-green-400" />
                                </div>

                                {/* Main Split Panels */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                                    {/* Left Column: Settlements & Member splits */}
                                    <div className="lg:col-span-2 flex flex-col gap-6">
                                        <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
                                            <h3 className="text-base font-bold mb-4 font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                                <span>📊</span> Room Splits & Balances
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {calculations.memberSplits.map((s) => {
                                                    const isPositive = s.balance >= 0;
                                                    return (
                                                        <div key={s.user.id} className="p-4 rounded-2xl border border-[rgba(232,160,32,0.08)] bg-[#1a0e07] flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner" style={{ background: avatarColor(s.user.id) }}>
                                                                    {initials(s.user.name)}
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-semibold">{s.user.name}</h4>
                                                                    <p className="text-[10px] text-muted-foreground font-mono">Spent: {fmtFull(s.spent)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className={`text-sm font-bold font-mono ${isPositive ? "text-green-400" : "text-destructive"}`}>
                                                                    {isPositive ? "+" : ""}
                                                                    {fmtFull(s.balance)}
                                                                </p>
                                                                <p className="text-[9px] text-muted-foreground">{isPositive ? "Owed" : "Owes"}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Settlement calculations */}
                                        <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl">
                                            <h3 className="text-base font-bold mb-4 font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                                <span>💸</span> Who owes Whom
                                            </h3>

                                            {calculations.settlements.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-8">
                                                    <span className="text-3xl mb-2">🎉</span>
                                                    <p className="text-sm">All room shares are completely settled!</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {calculations.settlements.map((s, idx) => (
                                                        <div key={idx} className="p-4 rounded-2xl border border-dashed border-primary/20 bg-primary/5 flex flex-col gap-2">
                                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                                <span className="font-semibold text-destructive">{s.from}</span>
                                                                <span>owes</span>
                                                                <span className="font-semibold text-green-400">{s.to}</span>
                                                            </div>
                                                            <div className="text-xl font-bold text-primary font-mono text-center">{fmtFull(s.amount)}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column: Recent Activity Feed */}
                                    <div className="bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col">
                                        <h3 className="text-base font-bold mb-4 font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                            <span>🛒</span> Recent Bazar Logs
                                        </h3>

                                        <div className="space-y-3.5 max-h-90 overflow-y-auto pr-1">
                                            {entries.slice(0, 5).map((e) => (
                                                <div key={e.id} className="p-3.5 rounded-xl bg-[#1a0e07] border border-[rgba(232,160,32,0.06)] flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <span className="text-xl">{e.product.emoji}</span>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-semibold truncate text-[#f5ede2]">{e.product.name}</p>
                                                            <p className="text-[10px] text-muted-foreground font-mono">
                                                                {e.user.name} • {fmtDate(e.date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-xs font-bold text-primary font-mono">৳{(e.price * e.quantity).toLocaleString()}</p>
                                                        <p className="text-[9px] text-muted-foreground font-mono">
                                                            {e.quantity} {e.unit}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
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
                                                <th className="p-4 text-center">Delete</th>
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
                                                            <div className="h-4 bg-[#2e1a0a] rounded-md w-6 mx-auto" />
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
                                                            <td className="p-4 font-semibold flex items-center gap-2">
                                                                <span className="text-xl">🛒</span>
                                                                <div>
                                                                    <p>{e.product?.name || "Bazar Item"}</p>
                                                                    {e.notes && <p className="text-[10px] text-muted-foreground font-normal italic">{e.notes}</p>}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] text-[#f5ede2] shrink-0" style={{ background: avatarColor(e.user?._id || "u") }}>
                                                                        {initials(e.user?.name || "U")}
                                                                    </div>
                                                                    <span>{e.user?.name || "User"}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 text-muted-foreground font-mono text-xs">{new Date(e.date).toLocaleDateString()}</td>
                                                            <td className="p-4 text-right font-mono">৳{e.price.toLocaleString()}</td>
                                                            <td className="p-4 text-right font-mono text-xs">
                                                                {e.quantity} {e.unit}
                                                            </td>
                                                            <td className="p-4 text-right font-bold text-primary font-mono">৳{(e.price * e.quantity).toLocaleString()}</td>
                                                            <td className="p-4 text-center">
                                                                <button onClick={() => setDeletingExpenseId(e._id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer" title="Delete Expense">
                                                                    <X className="w-4 h-4" />
                                                                </button>
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
                                                        <div key={b._id} className="rounded-2xl border border-border bg-[#1a0e07] p-5 flex flex-col justify-between gap-4 relative overflow-hidden">
                                                            <div>
                                                                <div className="flex items-center justify-between gap-2 mb-3">
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono border" style={{ background: `${meta.color}15`, color: meta.color, borderColor: `${meta.color}30` }}>
                                                                        {meta.icon} {meta.label}
                                                                    </span>
                                                                    <button onClick={() => setDeletingBillId(b._id)} className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors cursor-pointer" title="Delete Bill">
                                                                        <X className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                                <h4 className="text-base font-semibold text-foreground">{b.title}</h4>
                                                                {b.notes && <p className="text-xs text-muted-foreground mt-1.5 italic font-sans">"{b.notes}"</p>}
                                                            </div>

                                                            <div className="pt-3 border-t border-[rgba(232,160,32,0.06)] flex items-center justify-between">
                                                                <div>
                                                                    <p className="text-[10px] text-muted-foreground font-mono">Paid by: {b.user?.name || "User"}</p>
                                                                    <p className="text-[9px] text-muted-foreground font-mono mt-0.5">{new Date(b.date).toLocaleDateString()}</p>
                                                                </div>
                                                                <p className="text-lg font-bold text-accent font-mono">৳{b.amount.toLocaleString()}</p>
                                                            </div>
                                                        </div>
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

                        {/* ─── TAB: NOTIFICATIONS (FULL-PAGE NOTIFICATIONS LOGS VIEW) ─── */}
                        {tab === "notifications" && (
                            <WebNotificationsTab
                                markAllAsRead={markAllAsRead}
                                deleteAllNotifications={deleteAllNotifications}
                                notifLoading={notifLoading}
                                notifData={notifData}
                                deleteNotification={deleteNotification}
                            />
                        )}

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
            </main>

            {/* Website Dialog: Add Bazar Expense */}
            <Modal show={showAddExpense} onClose={() => setShowAddExpense(false)} title="Add Bazar Expense">
                <AddExpenseForm
                    isLoading={bazarLoading}
                    onSubmit={(prod, price, qty, unit, date, notes) => {
                        handleAddExpense(prod, price, qty, unit, date, notes);
                        setShowAddExpense(false);
                    }}
                    onClose={() => setShowAddExpense(false)}
                />
            </Modal>

            {/* Website Dialog: Add Monthly Bill */}
            <Modal show={showAddBill} onClose={() => setShowAddBill(false)} title="Add Monthly Bill">
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
        </div>
    );
}
