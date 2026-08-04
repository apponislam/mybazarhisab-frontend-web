"use client";

import React from "react";
import { Plus, Bell, User, LogOut, ChevronDown, CheckCheck, Trash2, X, LayoutDashboard } from "lucide-react";
import { initials } from "@/lib/mockData";

interface WebHeaderProps {
    tab: "home" | "expenses" | "bills" | "notifications" | "profile";
    setTab: (t: "home" | "expenses" | "bills" | "notifications" | "profile") => void;
    currentUser: any;
    unreadCount: number;
    showNotifDropdown: boolean;
    setShowNotifDropdown: (v: boolean | ((prev: boolean) => boolean)) => void;
    showUserDropdown: boolean;
    setShowUserDropdown: (v: boolean | ((prev: boolean) => boolean)) => void;
    notifDropdownRef: React.RefObject<HTMLDivElement | null>;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    notifData: any;
    notifLoading: boolean;
    onMarkAllAsRead: () => void;
    onDeleteAllNotifications: () => void;
    onDeleteNotification: (id: string) => void;
    onOpenAddExpense: () => void;
    onOpenAddBill: () => void;
    onLogout: () => void;
}

export function WebHeader({
    tab,
    setTab,
    currentUser,
    unreadCount,
    showNotifDropdown,
    setShowNotifDropdown,
    showUserDropdown,
    setShowUserDropdown,
    notifDropdownRef,
    dropdownRef,
    notifData,
    notifLoading,
    onMarkAllAsRead,
    onDeleteAllNotifications,
    onDeleteNotification,
    onOpenAddExpense,
    onOpenAddBill,
    onLogout,
}: WebHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4 p-4 border-b border-border bg-[#1a0e07]/80 backdrop-blur-md sticky top-0 z-30">
            {/* Left Nav */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setTab("home")}>
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-black text-primary-foreground text-lg shadow-lg">
                        B
                    </div>
                    <span className="font-extrabold text-lg text-foreground tracking-tight hidden sm:inline">My Bazar Hisab</span>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-[#251508] p-1 rounded-xl border border-border">
                    <button
                        onClick={() => setTab("home")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            tab === "home" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setTab("expenses")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            tab === "expenses" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Expenses
                    </button>
                    <button
                        onClick={() => setTab("bills")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            tab === "bills" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        Bills
                    </button>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenAddExpense}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-accent transition-all cursor-pointer shadow-md"
                >
                    <Plus className="w-4 h-4" /> Expense
                </button>

                <button
                    onClick={onOpenAddBill}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 text-primary text-xs font-bold hover:bg-primary/10 transition-all cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Bill
                </button>

                {/* Notification Dropdown */}
                <div className="relative" ref={notifDropdownRef}>
                    <button
                        onClick={() => setShowNotifDropdown((prev) => !prev)}
                        className="relative p-2 rounded-xl border border-border bg-[#251508] text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                    >
                        <Bell className="w-4 h-4" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifDropdown && (
                        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#251508] border border-border shadow-2xl overflow-hidden text-left z-50">
                            <div className="p-3 border-b border-border flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground">Notifications</span>
                                <div className="flex items-center gap-1">
                                    <button onClick={onMarkAllAsRead} className="p-1 text-muted-foreground hover:text-primary rounded-lg transition-colors cursor-pointer" title="Mark all read">
                                        <CheckCheck className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={onDeleteAllNotifications} className="p-1 text-muted-foreground hover:text-destructive rounded-lg transition-colors cursor-pointer" title="Clear all">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="max-h-72 overflow-y-auto divide-y divide-border/40">
                                {notifLoading ? (
                                    <p className="p-4 text-center text-xs text-muted-foreground font-mono">Loading notifications...</p>
                                ) : notifData?.data && notifData.data.length > 0 ? (
                                    notifData.data.slice(0, 5).map((n: any) => (
                                        <div key={n._id} className="p-3 text-xs flex items-start justify-between gap-2 hover:bg-white/5 transition-colors">
                                            <div>
                                                <p className="font-bold text-primary">{n.title}</p>
                                                <p className="text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                                            </div>
                                            <button onClick={() => onDeleteNotification(n._id)} className="text-muted-foreground hover:text-destructive shrink-0 cursor-pointer">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="p-4 text-center text-xs text-muted-foreground font-mono">No notifications found.</p>
                                )}
                            </div>
                            <div className="p-2 border-t border-border bg-[#1a0e07] text-center">
                                <button
                                    onClick={() => {
                                        setTab("notifications");
                                        setShowNotifDropdown(false);
                                    }}
                                    className="text-xs font-bold text-primary hover:underline cursor-pointer"
                                >
                                    See All Notifications →
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowUserDropdown((prev) => !prev)}
                        className="flex items-center gap-2 p-1 pl-2.5 rounded-xl border border-border bg-[#251508] hover:border-primary/40 transition-all cursor-pointer"
                    >
                        <span className="text-xs font-bold text-foreground max-w-[90px] truncate">{currentUser?.name || "User"}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>

                    {showUserDropdown && (
                        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#251508] border border-border shadow-2xl overflow-hidden text-left z-50">
                            <div className="p-3 border-b border-border bg-[#1a0e07]">
                                <p className="text-xs font-bold text-foreground truncate">{currentUser?.name || "User"}</p>
                                <p className="text-[10px] text-muted-foreground font-mono truncate">{currentUser?.email || "user@bazarhisab.com"}</p>
                            </div>
                            <div className="p-1">
                                <button
                                    onClick={() => {
                                        setTab("profile");
                                        setShowUserDropdown(false);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl text-xs font-bold text-foreground hover:bg-primary/10 flex items-center gap-2 transition-all cursor-pointer"
                                >
                                    <User className="w-4 h-4 text-primary" /> Profile & Settings
                                </button>
                            </div>
                            <div className="p-1 border-t border-border bg-[#1a0e07]">
                                <button onClick={onLogout} className="w-full px-3 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-all cursor-pointer">
                                    <LogOut className="w-4 h-4" /> Log Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
