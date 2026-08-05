"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Home, ShoppingBag, Receipt, User, Plus, Bell, ChevronDown, ShieldCheck, Lock, LogOut, X } from "lucide-react";
import { GroupStats } from "@/types";
import { initials } from "@/components/web/shell/WebMetricCard";

export function WebHeader({
    scrolled,
    stats,
    tab,
    setTab,
    setShowAddExpense,
    setShowAddBill,
    showNotifDropdown,
    setShowNotifDropdown,
    notifDropdownRef,
    unreadCount,
    markAllAsRead,
    deleteAllNotifications,
    deleteNotification,
    notifLoading,
    notifData,
    showUserDropdown,
    setShowUserDropdown,
    dropdownRef,
    currentUser,
    onLogout,
}: {
    scrolled: boolean;
    stats?: GroupStats;
    tab: string;
    setTab: (tab: "home" | "expenses" | "bills" | "notifications" | "profile") => void;
    setShowAddExpense: (show: boolean) => void;
    setShowAddBill: (show: boolean) => void;
    showNotifDropdown: boolean;
    setShowNotifDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    notifDropdownRef: React.RefObject<HTMLDivElement | null>;
    unreadCount?: number;
    markAllAsRead: () => void;
    deleteAllNotifications: () => void;
    deleteNotification: (id: string) => void;
    notifLoading: boolean;
    notifData?: any;
    showUserDropdown: boolean;
    setShowUserDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    currentUser?: any;
    onLogout: () => void;
}) {
    const router = useRouter();

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out select-none border-b ${scrolled ? "bg-[#251508]/85 backdrop-blur-md border-[rgba(232,160,32,0.3)] shadow-2xl" : "bg-[#251508] border-[rgba(232,160,32,0.15)] shadow-md"}`}>
            <div className={`container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ease-in-out ${scrolled ? "h-16" : "h-20"}`}>
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
                            <button key={item.id} onClick={() => setTab(item.id as any)} className="relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer" style={{ color: active ? "#e8a020" : "#a08060" }}>
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
                            {unreadCount ? <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold font-mono rounded-full flex items-center justify-center animate-pulse">{unreadCount}</span> : null}
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
                                            {unreadCount ? <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-primary/20 text-primary border border-primary/30">{unreadCount} New</span> : null}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button onClick={() => markAllAsRead()} className="text-[10px] font-mono text-primary hover:underline cursor-pointer">
                                                Mark Read
                                            </button>
                                            <span className="text-muted-foreground/40 text-[10px]">•</span>
                                            <button onClick={() => deleteAllNotifications()} className="text-[10px] font-mono text-destructive hover:underline cursor-pointer">
                                                Clear All
                                            </button>
                                        </div>
                                    </div>

                                    {/* Notifications List */}
                                    <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                                        {notifLoading ? (
                                            <div className="p-6 text-center text-xs font-mono text-muted-foreground">Loading notifications…</div>
                                        ) : notifData?.data && notifData.data.length > 0 ? (
                                            notifData.data.map((n: any) => (
                                                <div key={n._id} className={`p-3 rounded-xl border transition-all text-left flex items-start justify-between gap-2 ${!n.isRead ? "bg-primary/10 border-primary/30" : "bg-[#1a0e07] border-border/60 hover:bg-white/5"}`}>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-2 mb-0.5 font-mono text-[10px]">
                                                            <span className="font-bold text-primary truncate">{n.title}</span>
                                                            <span className="text-muted-foreground shrink-0 text-[9px]">{new Date(n.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-xs text-foreground font-sans line-clamp-2 leading-relaxed">{n.message}</p>
                                                    </div>
                                                    <button onClick={() => deleteNotification(n._id)} className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors shrink-0" title="Delete notification">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="p-6 text-center text-xs font-mono text-muted-foreground">No notifications recorded yet.</p>
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
                        <button onClick={() => setShowUserDropdown((prev) => !prev)} className="flex items-center gap-2 p-1 rounded-full border border-border/80 hover:border-primary/50 bg-[#1a0e07] transition-all cursor-pointer shadow-md">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-primary flex items-center justify-center font-bold text-xs text-primary-foreground shrink-0">
                                {currentUser?.profileImage ? <img src={currentUser.profileImage} alt={currentUser.name} className="w-full h-full object-cover" /> : initials(currentUser?.name || "User")}
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
                                            {currentUser?.profileImage ? <img src={currentUser.profileImage} alt={currentUser.name} className="w-full h-full object-cover" /> : initials(currentUser?.name || "User")}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-1">
                                                <h4 className="text-xs font-bold text-foreground truncate">{currentUser?.name || "User"}</h4>
                                                {currentUser?.role && <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-primary/20 text-primary border border-primary/30 shrink-0">{currentUser.role}</span>}
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
    );
}
