import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Home, ShoppingBag, Receipt, User, Plus, Search, X, LogOut, Lock, Mail, Phone, Camera, ShieldCheck, Globe, MapPin, LayoutDashboard, ChevronDown, Edit3, Bell, MessageSquare, Star, Send } from "lucide-react";
import { toast } from "sonner";
import { BazarUnit, BillCategory, MockBazarEntry, MockBill, GroupStats } from "@/types";
import { INITIAL_ENTRIES, INITIAL_BILLS, MOCK_USERS, MOCK_PRODUCTS, BILL_META, fmt, fmtFull, fmtDate } from "@/lib/mockData";
import { PrimaryButton } from "@/components/app/ui/Shared";
import { useGetMeQuery, useUpdateProfileMutation, useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { useSubmitMessageMutation } from "@/redux/features/contact/contactApi";
import { useCreateFeedbackMutation } from "@/redux/features/feedback/feedbackApi";
import { useCreateReviewMutation } from "@/redux/features/review/reviewApi";
import { useGetMyNotificationsQuery, useGetUnreadCountQuery, useMarkAllAsReadMutation, useDeleteAllNotificationsMutation, useDeleteNotificationMutation } from "@/redux/features/notification/notificationApi";
import { useCreateBazarEntryMutation, useGetAllBazarEntriesQuery, useDeleteBazarEntryMutation } from "@/redux/features/bazar-entry/bazarEntryApi";
import { useCreateBillMutation, useGetAllBillsQuery, useDeleteBillMutation } from "@/redux/features/bill/billApi";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { ProductSelectInput } from "@/components/dashboard/expenses/ProductSelectInput";
import { WebPagination } from "@/components/web/shell/WebPagination";
import { WebConfirmModal } from "@/components/web/shell/WebModal";

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
    const { data: bazarEntriesResponse, isLoading: bazarEntriesLoading, isFetching: bazarEntriesFetching } = useGetAllBazarEntriesQuery(
        {
            filter: expenseFilter === "all" ? "ALL" : undefined,
            searchTerm: expenseSearch.trim() || undefined,
            page: expensePage,
            limit: 10,
        },
        { skip: tab !== "expenses" && tab !== "home" }
    );
    const { data: billsResponse, isLoading: billsLoading, isFetching: billsFetching } = useGetAllBillsQuery(
        {
            filter: billFilter === "all" ? "ALL" : undefined,
            searchTerm: billSearch.trim() || undefined,
            page: billPage,
            limit: 10,
        },
        { skip: tab !== "bills" && tab !== "home" }
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
            const settlementAmount = Math.min(debtor.amount, creditor.amount);

            settlements.push({
                from: debtor.name,
                to: creditor.name,
                amount: settlementAmount,
            });

            debtor.amount -= settlementAmount;
            creditor.amount -= settlementAmount;

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
            {/* ─── Top Website Header (Animated Sticky Header) ────────────────────── */}
            <header
                className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out select-none border-b ${
                    scrolled
                        ? "bg-[#251508]/85 backdrop-blur-md border-[rgba(232,160,32,0.3)] shadow-2xl"
                        : "bg-[#251508] border-[rgba(232,160,32,0.15)] shadow-md"
                }`}
            >
                <div
                    className={`container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ease-in-out ${
                        scrolled ? "h-16" : "h-20"
                    }`}
                >
                    {/* Logo & Group */}
                    <div className="flex items-center gap-3">
                        <img src="/assets/logo.png" alt="Bazar Hisab" className="w-9 h-9 object-contain rounded-xl" />
                        <div>
                            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                                My Bazar <span className="text-primary">Hisab</span>
                            </span>
                            <span className="ml-3 hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-semibold font-mono">{stats?.groupName || "My Bazar Group"}</span>
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="hidden md:flex items-center gap-1">
                        {[
                            { id: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
                            { id: "expenses", label: "Expenses", icon: <ShoppingBag className="w-4 h-4" /> },
                            { id: "bills", label: "Bills", icon: <Receipt className="w-4 h-4" /> },
                            { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
                        ].map((item) => {
                            const active = tab === item.id;
                            return (
                                <button key={item.id} onClick={() => setTab(item.id as never)} className="relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer" style={{ color: active ? "#e8a020" : "#a08060" }}>
                                    {item.icon}
                                    {item.label}
                                    {active && <motion.div layoutId="web-nav-underline" className="absolute bottom-0 left-5 right-5 h-0.5 bg-primary rounded-full" />}
                                </button>
                            );
                        })}
                    </nav>

                    {/* User profile dropdown & actions */}
                    <div className="flex items-center gap-3">
                        {/* Quick Action Trigger Buttons */}
                        <div className="hidden sm:flex items-center gap-2">
                            <button onClick={() => setShowAddExpense(true)} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg transition-all hover:bg-accent cursor-pointer shadow-md shadow-primary/10">
                                <Plus className="w-3.5 h-3.5" /> Expense
                            </button>
                            <button onClick={() => setShowAddBill(true)} className="flex items-center gap-1 px-3 py-1.5 border border-accent text-accent text-xs font-bold rounded-lg transition-all hover:bg-accent/10 cursor-pointer">
                                <Plus className="w-3.5 h-3.5" /> Bill
                            </button>
                        </div>

                        {/* Notification Bell Dropdown Button */}
                        <div className="relative" ref={notifDropdownRef}>
                            <button
                                onClick={() => {
                                    setShowNotifDropdown((prev) => !prev);
                                    if (!showNotifDropdown) {
                                        markAllAsRead();
                                    }
                                }}
                                className="p-2 rounded-full border border-border/80 hover:border-primary/50 bg-[#1a0e07] text-muted-foreground hover:text-primary transition-all relative cursor-pointer"
                                title="Notifications"
                            >
                                <Bell className="w-4 h-4" />
                                {unreadData?.data?.count ? (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold font-mono rounded-full flex items-center justify-center animate-pulse">
                                        {unreadData.data.count}
                                    </span>
                                ) : null}
                            </button>

                            {/* Notification Dropdown Panel */}
                            <AnimatePresence>
                                {showNotifDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#251508] border border-border shadow-2xl p-4 z-50 flex flex-col gap-3 font-sans"
                                    >
                                        {/* Dropdown Header */}
                                        <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                                            <div className="flex items-center gap-2">
                                                <Bell className="w-4 h-4 text-primary" />
                                                <h4 className="text-xs font-bold text-foreground">Notifications</h4>
                                                {unreadData?.data?.count ? (
                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-primary/20 text-primary border border-primary/30">
                                                        {unreadData.data.count} New
                                                    </span>
                                                ) : null}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => markAllAsRead()}
                                                    className="text-[10px] font-mono text-primary hover:underline cursor-pointer"
                                                >
                                                    Mark Read
                                                </button>
                                                <span className="text-muted-foreground/40 text-[10px]">•</span>
                                                <button
                                                    onClick={() => deleteAllNotifications()}
                                                    className="text-[10px] font-mono text-destructive hover:underline cursor-pointer"
                                                >
                                                    Clear All
                                                </button>
                                            </div>
                                        </div>

                                        {/* Notifications List */}
                                        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                                            {notifLoading ? (
                                                <div className="p-6 text-center text-xs font-mono text-muted-foreground">
                                                    Loading notifications…
                                                </div>
                                            ) : notifData?.data && notifData.data.length > 0 ? (
                                                notifData.data.map((n: any) => (
                                                    <div
                                                        key={n._id}
                                                        className={`p-3 rounded-xl border transition-all text-left flex items-start justify-between gap-2 ${
                                                            !n.isRead
                                                                ? "bg-primary/10 border-primary/30"
                                                                : "bg-[#1a0e07] border-border/60 hover:bg-white/5"
                                                        }`}
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center justify-between gap-2 mb-0.5 font-mono text-[10px]">
                                                                <span className="font-bold text-primary truncate">{n.title}</span>
                                                                <span className="text-muted-foreground shrink-0 text-[9px]">
                                                                    {new Date(n.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-foreground font-sans line-clamp-2 leading-relaxed">
                                                                {n.message}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteNotification(n._id)}
                                                            className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors shrink-0"
                                                            title="Delete notification"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="p-6 text-center text-xs font-mono text-muted-foreground">
                                                    No notifications recorded yet.
                                                </p>
                                            )}
                                        </div>

                                        {/* Dropdown Footer: See All Notifications Page trigger */}
                                        <div className="border-t border-border/60 pt-2 flex items-center justify-center">
                                            <button
                                                onClick={() => {
                                                    setShowNotifDropdown(false);
                                                    setTab("notifications");
                                                }}
                                                className="text-xs font-bold text-primary hover:underline font-mono cursor-pointer py-1"
                                            >
                                                See All Notifications →
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Dynamic User Profile Avatar & Dropdown Menu */}
                        <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowUserDropdown((prev) => !prev)}
                                className="flex items-center gap-2 p-1 rounded-full border border-border/80 hover:border-primary/50 bg-[#1a0e07] transition-all cursor-pointer shadow-md"
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center font-bold text-xs text-primary-foreground shrink-0">
                                    {currentUser?.profileImage ? (
                                        <img src={currentUser.profileImage} alt={currentUser.name} className="w-full h-full object-cover" />
                                    ) : (
                                        initials(currentUser?.name || "User")
                                    )}
                                </div>
                                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 mr-1 ${showUserDropdown ? "rotate-180 text-primary" : ""}`} />
                            </button>

                            {/* Dropdown Menu Box */}
                            <AnimatePresence>
                                {showUserDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#251508] border border-border shadow-2xl p-3 z-50 flex flex-col gap-2 font-sans"
                                    >
                                        {/* User Header */}
                                        <div className="p-2.5 rounded-xl bg-[#1a0e07] border border-border/60 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center font-bold text-xs text-primary-foreground shrink-0 shadow-sm">
                                                {currentUser?.profileImage ? (
                                                    <img src={currentUser.profileImage} alt={currentUser.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    initials(currentUser?.name || "User")
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-1">
                                                    <h4 className="text-xs font-bold text-foreground truncate">{currentUser?.name || "User"}</h4>
                                                    {currentUser?.role && (
                                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-primary/20 text-primary border border-primary/30 shrink-0">
                                                            {currentUser.role}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-muted-foreground font-mono truncate">{currentUser?.email || "user@email.com"}</p>
                                            </div>
                                        </div>

                                        {/* Admin Dashboard Navigation Button */}
                                        {currentUser?.role === "ADMIN" && (
                                            <button
                                                onClick={() => {
                                                    setShowUserDropdown(false);
                                                    router.push("/dashboard");
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-primary/15 border border-primary/30 text-primary font-bold text-xs hover:bg-primary/25 transition-all cursor-pointer"
                                            >
                                                <ShieldCheck className="w-4 h-4 text-primary" />
                                                <span>Go to Admin Dashboard</span>
                                            </button>
                                        )}

                                        {/* Profile Details Button */}
                                        <button
                                            onClick={() => {
                                                setTab("profile");
                                                setShowUserDropdown(false);
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground text-xs font-semibold transition-all cursor-pointer"
                                        >
                                            <User className="w-4 h-4 text-muted-foreground" />
                                            <span>Profile & Settings</span>
                                        </button>

                                        {/* Change Password Button */}
                                        <button
                                            onClick={() => {
                                                setTab("profile");
                                                setShowUserDropdown(false);
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground text-xs font-semibold transition-all cursor-pointer"
                                        >
                                            <Lock className="w-4 h-4 text-muted-foreground" />
                                            <span>Change Password</span>
                                        </button>

                                        <div className="h-px bg-border/60 my-0.5" />

                                        {/* Log Out Button */}
                                        <button
                                            onClick={() => {
                                                setShowUserDropdown(false);
                                                onLogout();
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-destructive/15 text-muted-foreground hover:text-destructive text-xs font-semibold transition-all cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4 text-destructive" />
                                            <span>Log Out</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

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
                                                        <td className="p-4"><div className="h-4 bg-[#2e1a0a] rounded-md w-32" /></td>
                                                        <td className="p-4"><div className="h-4 bg-[#2e1a0a] rounded-md w-24" /></td>
                                                        <td className="p-4"><div className="h-4 bg-[#2e1a0a] rounded-md w-20" /></td>
                                                        <td className="p-4"><div className="h-4 bg-[#2e1a0a] rounded-md w-16 ml-auto" /></td>
                                                        <td className="p-4"><div className="h-4 bg-[#2e1a0a] rounded-md w-12 ml-auto" /></td>
                                                        <td className="p-4"><div className="h-4 bg-[#2e1a0a] rounded-md w-16 ml-auto" /></td>
                                                        <td className="p-4"><div className="h-4 bg-[#2e1a0a] rounded-md w-6 mx-auto" /></td>
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
                                        <div className="p-16 text-center text-xs font-mono text-muted-foreground bg-[#1a0e07] border border-border/60 rounded-2xl">
                                            No monthly bills found.
                                        </div>
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
                            <div className="flex-1 flex flex-col gap-6 min-h-0 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl font-sans">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground">Notifications & Activity Feed</h3>
                                            <p className="text-xs text-muted-foreground font-mono">
                                                All room updates, bazar entries, and account notifications
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => markAllAsRead()}
                                            className="px-4 py-2 rounded-xl bg-primary/15 border border-primary/30 text-primary text-xs font-bold font-mono hover:bg-primary/25 transition-all cursor-pointer"
                                        >
                                            Mark All as Read
                                        </button>
                                        <button
                                            onClick={() => deleteAllNotifications()}
                                            className="px-4 py-2 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-bold font-mono hover:bg-destructive/25 transition-all cursor-pointer"
                                        >
                                            Clear All Logs
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                    {notifLoading ? (
                                        <div className="p-12 text-center text-xs font-mono text-muted-foreground">
                                            Fetching notifications log history…
                                        </div>
                                    ) : notifData?.data && notifData.data.length > 0 ? (
                                        notifData.data.map((n: any) => (
                                            <div
                                                key={n._id}
                                                className={`p-4 rounded-2xl border transition-all text-left flex items-start justify-between gap-4 ${
                                                    !n.isRead
                                                        ? "bg-primary/10 border-primary/40 shadow-md"
                                                        : "bg-[#1a0e07] border-border/60 hover:bg-white/5"
                                                }`}
                                            >
                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <div className="flex items-center justify-between font-mono text-xs">
                                                        <span className="font-bold text-primary">{n.title}</span>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {new Date(n.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-foreground font-sans leading-relaxed">{n.message}</p>
                                                </div>
                                                <button
                                                    onClick={() => deleteNotification(n._id)}
                                                    className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer"
                                                    title="Delete notification"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-16 text-center text-xs font-mono text-muted-foreground bg-[#1a0e07] border border-border/60 rounded-2xl">
                                            No notifications found in your account logs.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ─── TAB: PROFILE (WEBSITE PROFILE EDITOR) ─────────────────── */}
                        {tab === "profile" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start font-sans">
                                {/* Profile Overview / Edit Panel */}
                                {!isEditingProfile ? (
                                    <div className="bg-[#251508] border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-6">
                                        <div className="flex items-center justify-between border-b border-border pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-foreground">User Profile Overview</h3>
                                                    <p className="text-xs text-muted-foreground">Your account & contact details</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsEditingProfile(true)}
                                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-accent transition-all cursor-pointer shadow-md"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                <span>Edit Profile</span>
                                            </button>
                                        </div>

                                        {/* Avatar & Name Header */}
                                        <div className="flex flex-col items-center justify-center py-2 text-center border-b border-border/60 pb-6">
                                            <div className="w-24 h-24 rounded-full overflow-hidden bg-primary flex items-center justify-center font-bold text-2xl text-primary-foreground border-2 border-primary/40 shadow-xl mb-3">
                                                {profileImage ? (
                                                    <img src={profileImage} alt={name} className="w-full h-full object-cover" />
                                                ) : (
                                                    initials(name || "User")
                                                )}
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground">{name || "User Name"}</h3>
                                            <p className="text-xs text-muted-foreground font-mono mt-0.5">{email}</p>
                                            {currentUser?.role && (
                                                <span className="mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-primary/15 text-primary border border-primary/30">
                                                    {currentUser.role} ROLE
                                                </span>
                                            )}
                                        </div>

                                        {/* Details Grid */}
                                        <div className="space-y-3.5 text-xs">
                                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1a0e07] border border-border/60">
                                                <span className="text-muted-foreground font-semibold flex items-center gap-2">
                                                    <Phone className="w-3.5 h-3.5 text-primary" /> Phone Number:
                                                </span>
                                                <span className="font-mono font-bold text-foreground">{phone || "Not specified"}</span>
                                            </div>

                                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#1a0e07] border border-border/60">
                                                <span className="text-muted-foreground font-semibold flex items-center gap-2">
                                                    <Globe className="w-3.5 h-3.5 text-primary" /> Language:
                                                </span>
                                                <span className="font-bold text-foreground">{language || "English"}</span>
                                            </div>

                                            {aboutme && (
                                                <div className="p-3.5 rounded-2xl bg-[#1a0e07] border border-border/60 space-y-1">
                                                    <span className="text-muted-foreground font-semibold block">About Me / Bio:</span>
                                                    <p className="text-foreground italic">{aboutme}</p>
                                                </div>
                                            )}

                                            <div className="p-4 rounded-2xl bg-[#1a0e07] border border-border/60 space-y-2">
                                                <span className="text-muted-foreground font-bold font-mono flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                                                    <MapPin className="w-3.5 h-3.5 text-primary" /> Address Details
                                                </span>
                                                <p className="text-foreground font-mono text-xs">
                                                    {[street, city, state, zipCode, country].filter(Boolean).join(", ") || "No address specified"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quick Actions & Support Section inside Profile */}
                                        <div className="pt-4 border-t border-border flex flex-col gap-3">
                                            <h4 className="text-xs font-bold text-muted-foreground font-mono uppercase tracking-wider">Help & Support Actions</h4>
                                            <div className="grid grid-cols-3 gap-3">
                                                <button
                                                    onClick={() => setShowFeedback(true)}
                                                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1a0e07] border border-border/60 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all cursor-pointer gap-1.5"
                                                >
                                                    <MessageSquare className="w-5 h-5 text-primary" />
                                                    <span className="text-[11px] font-bold">Feedback</span>
                                                </button>
                                                <button
                                                    onClick={() => setShowContact(true)}
                                                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1a0e07] border border-border/60 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all cursor-pointer gap-1.5"
                                                >
                                                    <Mail className="w-5 h-5 text-primary" />
                                                    <span className="text-[11px] font-bold">Contact</span>
                                                </button>
                                                <button
                                                    onClick={() => setShowReview(true)}
                                                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1a0e07] border border-border/60 hover:border-amber-400/50 text-muted-foreground hover:text-amber-400 transition-all cursor-pointer gap-1.5"
                                                >
                                                    <Star className="w-5 h-5 text-amber-400" />
                                                    <span className="text-[11px] font-bold">Review</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Editable Profile Form Panel */
                                    <div className="bg-[#251508] border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-6">
                                        <div className="flex items-center justify-between border-b border-border pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-foreground">Edit Profile Details</h3>
                                                    <p className="text-xs text-muted-foreground">Update your contact information</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsEditingProfile(false)}
                                                className="px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-white/5 cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                        {/* Profile Avatar Photo (Full Round & Centered) */}
                                        <div className="flex flex-col items-center justify-center text-center py-2">
                                            <ImageUpload
                                                label="Profile Avatar Photo"
                                                variant="circle"
                                                value={profileImage}
                                                onChange={(url) => setProfileImage(url)}
                                                onRemove={() => setProfileImage("")}
                                            />
                                        </div>

                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                if (!name.trim()) {
                                                    toast.error("Name cannot be empty");
                                                    return;
                                                }
                                                try {
                                                    await updateProfile({
                                                        profileImage: profileImage || undefined,
                                                        name: name.trim(),
                                                        phone: phone.trim() || undefined,
                                                        language: language.trim() || undefined,
                                                        aboutme: aboutme.trim() || undefined,
                                                        address: {
                                                            street: street.trim() || undefined,
                                                            city: city.trim() || undefined,
                                                            state: state.trim() || undefined,
                                                            zipCode: zipCode.trim() || undefined,
                                                            country: country.trim() || undefined,
                                                        },
                                                    }).unwrap();
                                                    toast.success("Complete profile details updated successfully!");
                                                    setIsEditingProfile(false);
                                                } catch (err: any) {
                                                    toast.error(err?.data?.message || err?.message || "Failed to update profile");
                                                }
                                            }}
                                            className="flex flex-col gap-4"
                                        >
                                            <FieldBox label="Full Name" focused={false}>
                                                <div className="flex items-center">
                                                    <span className="pl-4 text-muted-foreground">
                                                        <User className="w-4 h-4" />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                        className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none text-foreground"
                                                    />
                                                </div>
                                            </FieldBox>

                                            <div>
                                                <div className="flex items-center justify-between mb-1.5 px-1">
                                                    <span className="text-xs font-semibold text-muted-foreground">Email Address</span>
                                                    <span className="text-[10px] text-muted-foreground/80 font-mono flex items-center gap-1">
                                                        <Lock className="w-3 h-3 text-muted-foreground" /> Cannot be updated
                                                    </span>
                                                </div>
                                                <div className="flex items-center bg-[#170c06] border border-border/40 rounded-2xl opacity-60 cursor-not-allowed">
                                                    <span className="pl-4 text-muted-foreground/50">
                                                        <Mail className="w-4 h-4" />
                                                    </span>
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        disabled
                                                        readOnly
                                                        title="Email address cannot be changed."
                                                        className="flex-1 px-3 py-3.5 bg-transparent text-sm text-muted-foreground font-mono cursor-not-allowed select-none outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <FieldBox label="Phone Number" focused={false}>
                                                <div className="flex items-center">
                                                    <span className="pl-4 text-muted-foreground">
                                                        <Phone className="w-4 h-4" />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        placeholder="+880 1700-000000"
                                                        className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none font-mono text-foreground"
                                                    />
                                                </div>
                                            </FieldBox>

                                            <FieldBox label="Preferred Language" focused={false}>
                                                <div className="flex items-center">
                                                    <span className="pl-4 text-muted-foreground">
                                                        <Globe className="w-4 h-4" />
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={language}
                                                        onChange={(e) => setLanguage(e.target.value)}
                                                        placeholder="e.g. English, Bengali"
                                                        className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none text-foreground"
                                                    />
                                                </div>
                                            </FieldBox>

                                            <div>
                                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 px-1">About Me / Bio</label>
                                                <textarea
                                                    value={aboutme}
                                                    onChange={(e) => setAboutme(e.target.value)}
                                                    rows={2}
                                                    placeholder="Write a brief intro about yourself…"
                                                    className="w-full px-4 py-3 bg-[#170c06] border border-border/60 rounded-2xl text-sm outline-none text-foreground focus:border-primary/60 transition-colors"
                                                />
                                            </div>

                                            {/* Address Section */}
                                            <div className="border-t border-border/60 pt-4 flex flex-col gap-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">Address Details</span>
                                                </div>

                                                <FieldBox label="Street Address" focused={false}>
                                                    <div className="flex items-center">
                                                        <span className="pl-4 text-muted-foreground">
                                                            <MapPin className="w-4 h-4" />
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={street}
                                                            onChange={(e) => setStreet(e.target.value)}
                                                            placeholder="House / Flat #, Road name"
                                                            className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none text-foreground"
                                                        />
                                                    </div>
                                                </FieldBox>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <FieldBox label="City" focused={false}>
                                                        <input
                                                            type="text"
                                                            value={city}
                                                            onChange={(e) => setCity(e.target.value)}
                                                            placeholder="Dhaka"
                                                            className="w-full px-4 py-3.5 bg-transparent text-sm outline-none text-foreground"
                                                        />
                                                    </FieldBox>
                                                    <FieldBox label="State / Division" focused={false}>
                                                        <input
                                                            type="text"
                                                            value={state}
                                                            onChange={(e) => setState(e.target.value)}
                                                            placeholder="Dhaka"
                                                            className="w-full px-4 py-3.5 bg-transparent text-sm outline-none text-foreground"
                                                        />
                                                    </FieldBox>
                                                    <FieldBox label="Zip Code" focused={false}>
                                                        <input
                                                            type="text"
                                                            value={zipCode}
                                                            onChange={(e) => setZipCode(e.target.value)}
                                                            placeholder="1212"
                                                            className="w-full px-4 py-3.5 bg-transparent text-sm outline-none font-mono text-foreground"
                                                        />
                                                    </FieldBox>
                                                    <FieldBox label="Country" focused={false}>
                                                        <input
                                                            type="text"
                                                            value={country}
                                                            onChange={(e) => setCountry(e.target.value)}
                                                            placeholder="Bangladesh"
                                                            className="w-full px-4 py-3.5 bg-transparent text-sm outline-none text-foreground"
                                                        />
                                                    </FieldBox>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 pt-4 border-t border-border/60">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditingProfile(false)}
                                                    className="flex-1 py-3 border border-border text-foreground font-bold text-xs rounded-xl hover:bg-secondary transition-all cursor-pointer text-center"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={profileLoading}
                                                    className="flex-1 py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-accent transition-all cursor-pointer shadow-md shadow-primary/10 disabled:opacity-50 text-center"
                                                >
                                                    {profileLoading ? "Saving…" : "Save Changes"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Change Password Panel */}
                                <div className="bg-[#251508] border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-6">
                                    <div className="flex items-center gap-3 border-b border-border pb-4">
                                        <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                                            <Lock className="w-5 h-5 text-accent" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground">Update Account Password</h3>
                                            <p className="text-xs text-muted-foreground">Change your password regularly for security</p>
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            if (!currentPassword || !newPassword) {
                                                toast.error("Please fill in all password fields");
                                                return;
                                            }
                                            if (newPassword !== repeatPassword) {
                                                toast.error("Passwords do not match");
                                                return;
                                            }
                                            try {
                                                await changePassword({ currentPassword, newPassword }).unwrap();
                                                toast.success("Password changed successfully!");
                                                setCurrentPassword("");
                                                setNewPassword("");
                                                setRepeatPassword("");
                                            } catch (err: any) {
                                                toast.error(err?.data?.message || err?.message || "Failed to change password");
                                            }
                                        }}
                                        className="flex flex-col gap-4"
                                    >
                                        <FieldBox label="Current Password" focused={false}>
                                            <div className="flex items-center">
                                                <span className="pl-4 text-muted-foreground">
                                                    <Lock className="w-4 h-4" />
                                                </span>
                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                                    required
                                                    placeholder="••••••••"
                                                    className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none text-foreground"
                                                />
                                            </div>
                                        </FieldBox>

                                        <FieldBox label="New Password" focused={false}>
                                            <div className="flex items-center">
                                                <span className="pl-4 text-muted-foreground">
                                                    <Lock className="w-4 h-4" />
                                                </span>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    required
                                                    placeholder="Min. 8 characters"
                                                    className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none text-foreground"
                                                />
                                            </div>
                                        </FieldBox>

                                        <FieldBox label="Re-enter New Password" focused={false}>
                                            <div className="flex items-center">
                                                <span className="pl-4 text-muted-foreground">
                                                    <Lock className="w-4 h-4" />
                                                </span>
                                                <input
                                                    type="password"
                                                    value={repeatPassword}
                                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                                    required
                                                    placeholder="Re-enter new password"
                                                    className="flex-1 px-3 py-3.5 bg-transparent text-sm outline-none text-foreground"
                                                />
                                            </div>
                                        </FieldBox>

                                        <div className="pt-4 border-t border-border/60 flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={passLoading}
                                                className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-accent transition-all cursor-pointer shadow-md shadow-primary/10 disabled:opacity-50 text-center"
                                            >
                                                {passLoading ? "Resetting Password…" : "Reset Password"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
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
                        <input
                            type="text"
                            value={contactSubject}
                            onChange={(e) => setContactSubject(e.target.value)}
                            required
                            placeholder="What can we help you with?"
                            className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Message</label>
                        <textarea
                            value={contactMsg}
                            onChange={(e) => setContactMsg(e.target.value)}
                            required
                            rows={4}
                            placeholder="Type your message details here…"
                            className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none resize-none"
                        />
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
                        <select
                            value={feedbackCategory}
                            onChange={(e) => setFeedbackCategory(e.target.value as any)}
                            className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-sans"
                            style={{ colorScheme: "dark" }}
                        >
                            <option value="GENERAL">General Feedback</option>
                            <option value="BUG">Report a Bug</option>
                            <option value="FEATURE_REQUEST">Feature Request</option>
                            <option value="UI_UX">UI / UX Improvement</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Subject</label>
                        <input
                            type="text"
                            value={feedbackSubject}
                            onChange={(e) => setFeedbackSubject(e.target.value)}
                            required
                            placeholder="Feedback title..."
                            className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Feedback Details</label>
                        <textarea
                            value={feedbackMsg}
                            onChange={(e) => setFeedbackMsg(e.target.value)}
                            required
                            rows={4}
                            placeholder="Tell us what you think..."
                            className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none resize-none"
                        />
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
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (!reviewComment) return;
                        try {
                            await createReview({
                                rating: reviewRating,
                                comment: reviewComment,
                            }).unwrap();
                            toast.success("Review posted successfully!");
                            setReviewComment("");
                            setShowReview(false);
                        } catch (err: any) {
                            toast.error(err?.data?.message || "Failed to post review");
                        }
                    }}
                    className="flex flex-col gap-4 text-left"
                >
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Rating (1 to 5 Stars)</label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewRating(star)}
                                    className="p-2 text-2xl transition-transform hover:scale-110 cursor-pointer"
                                >
                                    <Star className={`w-7 h-7 ${star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Your Review</label>
                        <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            required
                            rows={4}
                            placeholder="Share your experience using My Bazar Hisab..."
                            className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none resize-none"
                        />
                    </div>
                    <div className="flex gap-3 mt-2">
                        <button type="button" onClick={() => setShowReview(false)} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-secondary cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" disabled={reviewLoading} className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-accent cursor-pointer disabled:opacity-50">
                            {reviewLoading ? "Posting…" : "Post Review"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Website Dialog: Notifications Full Modal */}
            <Modal show={showNotifications} onClose={() => setShowNotifications(false)} title="Notification History & Logs">
                <div className="flex flex-col gap-4 font-sans text-left">
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <span className="text-xs font-mono text-muted-foreground">
                            Total: <span className="font-bold text-primary">{notifData?.data?.length || 0}</span> notifications
                        </span>
                        {notifData?.data && notifData.data.length > 0 && (
                            <button
                                onClick={() => deleteAllNotifications()}
                                className="px-3 py-1 rounded-xl bg-destructive/15 text-destructive border border-destructive/30 text-xs font-mono font-bold hover:bg-destructive/25 transition-all cursor-pointer"
                            >
                                Clear All Notifications
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
                        {notifData?.data && notifData.data.length > 0 ? (
                            notifData.data.map((n: any) => (
                                <div
                                    key={n._id}
                                    className={`p-4 rounded-2xl border transition-all text-left flex items-start justify-between gap-3 ${
                                        !n.isRead
                                            ? "bg-primary/10 border-primary/40 shadow-sm"
                                            : "bg-[#1a0e07] border-border/60 hover:bg-white/5"
                                    }`}
                                >
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex items-center justify-between font-mono text-xs">
                                            <span className="font-bold text-primary">{n.title}</span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {new Date(n.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-foreground font-sans leading-relaxed">{n.message}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteNotification(n._id)}
                                        className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer"
                                        title="Delete notification"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="p-12 text-center text-xs font-mono text-muted-foreground">
                                No notification messages recorded.
                            </p>
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

// Stats Card Layout
function MetricCard({ title, value, subtitle, color }: { title: string; value: number; subtitle: string; color: string }) {
    return (
        <div className="bg-[#251508] border border-border rounded-2xl p-6 flex flex-col gap-1.5 relative overflow-hidden shadow-md">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest font-mono">{title}</p>
            <p className={`text-3xl font-black ${color} font-mono`}>{fmt(value)}</p>
            <p className="text-xs text-muted-foreground font-sans">{subtitle}</p>
        </div>
    );
}

// Modal component
function Modal({ show, onClose, title, children }: { show: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="w-full max-w-lg bg-[#251508] border border-border rounded-3xl p-8 relative z-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                                {title}
                            </h3>
                            <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#2e1a0a] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// FieldBox wrapper (mimics original field box style)
function FieldBox({ label, focused, error, children }: { label: string; focused: boolean; error?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">{label}</label>
            <div className="rounded-xl border transition-all duration-200" style={{ borderColor: error ? "rgba(212,24,61,0.6)" : focused ? "rgba(232,160,32,0.7)" : "rgba(232,160,32,0.18)", background: "#2e1a0a" }}>
                {children}
            </div>
            {error && <p className="text-xs text-destructive mt-0.5">{error}</p>}
        </div>
    );
}

// Add forms components (using direct design matching web view)
function AddExpenseForm({ onSubmit, onClose, isLoading }: { onSubmit: (prod: string, price: number, qty: number, unit: BazarUnit, date: string, notes: string) => void; onClose: () => void; isLoading?: boolean }) {
    const [product, setProduct] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState<BazarUnit>("KG");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!product || !price || !quantity) return;
        onSubmit(product, Number(price), Number(quantity), unit, date, notes);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Product Name</label>
                <ProductSelectInput
                    valueName={product}
                    onSelect={(p) => setProduct(p.name)}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Price (৳)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0.00" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-mono text-foreground" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Quantity</label>
                    <input type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} required placeholder="e.g. 2, 1.5" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-mono text-foreground" />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Unit</label>
                <div className="flex gap-2">
                    {(["KG", "PIECE", "GM"] as BazarUnit[]).map((u) => (
                        <button
                            key={u}
                            type="button"
                            onClick={() => setUnit(u)}
                            className="flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer font-mono"
                            style={{ borderColor: unit === u ? "rgba(232,160,32,0.8)" : "rgba(232,160,32,0.18)", background: unit === u ? "rgba(232,160,32,0.15)" : "#2e1a0a", color: unit === u ? "#e8a020" : "#a08060" }}
                        >
                            {u}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Purchase Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground font-mono" style={{ colorScheme: "dark" }} />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Add purchase details..." className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none resize-none text-foreground" />
            </div>
            <div className="flex gap-3 mt-4">
                <button type="button" onClick={onClose} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl transition-all hover:bg-secondary cursor-pointer">
                    Cancel
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:bg-accent cursor-pointer disabled:opacity-50">
                    {isLoading ? "Saving Entry…" : "Save Entry"}
                </button>
            </div>
        </form>
    );
}

function AddBillForm({ onSubmit, onClose, isLoading }: { onSubmit: (cat: BillCategory, title: string, amount: number, date: string, notes: string) => void; onClose: () => void; isLoading?: boolean }) {
    const [category, setCategory] = useState<BillCategory>("RENT");
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount) return;
        onSubmit(category, title, Number(amount), date, notes);
    };

    const BILL_CATEGORIES_LIST = Object.entries(BILL_META).map(([k, v]) => ({ key: k as BillCategory, label: v.label }));

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as BillCategory)} className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-sans text-foreground" style={{ colorScheme: "dark" }}>
                        {BILL_CATEGORIES_LIST.map((c) => (
                            <option key={c.key} value={c.key}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Amount (৳)</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="0.00" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-mono text-foreground" />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Bill Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. July House Rent, Wi-Fi Bill" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground" />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Billing Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground font-mono" style={{ colorScheme: "dark" }} />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Add billing details..." className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none resize-none text-foreground" />
            </div>
            <div className="flex gap-3 mt-4">
                <button type="button" onClick={onClose} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl transition-all hover:bg-secondary cursor-pointer">
                    Cancel
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:bg-accent cursor-pointer disabled:opacity-50">
                    {isLoading ? "Saving Bill…" : "Save Bill"}
                </button>
            </div>
        </form>
    );
}

const AVATAR_COLORS = ["#c06010", "#8b6914", "#3d7a5c", "#5a4a8a", "#7a3d3d"];

function avatarColor(id: string) {
    return AVATAR_COLORS[id.charCodeAt(1) % AVATAR_COLORS.length];
}

function initials(name: string) {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}
