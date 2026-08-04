"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Receipt,
    Package,
    Users,
    Settings,
    LogOut,
} from "lucide-react";

interface DashboardSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
    const router = useRouter();

    const navItems = [
        { id: "overview", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, href: "/dashboard" },
        { id: "expenses", label: "Bazar Expenses", icon: <ShoppingBag className="w-4 h-4" />, href: "/dashboard/expenses" },
        { id: "bills", label: "Monthly Bills", icon: <Receipt className="w-4 h-4" />, href: "/dashboard/bills" },
        { id: "products", label: "Products Catalog", icon: <Package className="w-4 h-4" />, href: "/dashboard/products" },
        { id: "members", label: "Group Members", icon: <Users className="w-4 h-4" />, href: "/dashboard/members" },
        { id: "settings", label: "Account Settings", icon: <Settings className="w-4 h-4" />, href: "/dashboard/settings" },
    ];

    return (
        <aside className="w-80 bg-[#251508] border-r border-[rgba(232,160,32,0.15)] flex flex-col shrink-0">
            {/* Logo Section */}
            <div className="flex items-center gap-3 p-6 border-b border-[rgba(232,160,32,0.1)]">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary flex items-center justify-center">
                    <img src="/assets/logo.png" alt="Bazar Hisab" className="w-full h-full object-contain rounded-xl" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-foreground leading-none" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        My Bazar <span className="text-primary">Hisab</span>
                    </h1>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Desktop Manager</span>
                </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5">
                {navItems.map((item) => {
                    const active = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                onTabChange(item.id);
                                router.push(item.href);
                            }}
                            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer text-left"
                            style={{
                                background: active ? "rgba(232,160,32,0.15)" : "transparent",
                                color: active ? "#e8a020" : "#a08060",
                                border: active ? "1px solid rgba(232,160,32,0.25)" : "1px solid transparent",
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* User Details Footer */}
            <div className="p-4 border-t border-[rgba(232,160,32,0.1)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-sm text-primary-foreground">AH</div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold truncate">Ahmed Hassan</h4>
                    <p className="text-[10px] text-muted-foreground truncate font-mono">ahmed@email.com</p>
                </div>
                <button
                    onClick={() => router.push("/login")}
                    className="p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
                    title="Logout"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </aside>
    );
}
