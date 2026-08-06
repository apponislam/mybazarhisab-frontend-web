"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Search, SlidersHorizontal, ChevronLeft, ChevronRight, ShieldCheck, UserCheck, ChevronDown } from "lucide-react";
import { useGetAllUsersQuery, UserQueryParams } from "@/redux/features/user/userApi";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { UsersTable } from "@/components/dashboard/users/UsersTable";

export default function DashboardUsersPage() {
    const router = useRouter();

    const [queryParams, setQueryParams] = useState<UserQueryParams>({
        page: 1,
        limit: 10,
    });

    const { data: responseData, isLoading, isFetching, refetch } = useGetAllUsersQuery(queryParams);

    const users = responseData?.data || [];
    const meta = responseData?.meta;

    const handleFilterChange = (newFilters: Partial<UserQueryParams>) => {
        setQueryParams((prev) => ({ ...prev, ...newFilters }));
    };

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            {/* Left Dashboard Sidebar */}
            <DashboardSidebar activeTab="users" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                <DashboardHeader title="Registered Users & Account Control">
                    <button onClick={() => refetch()} className="p-2 rounded-xl border border-border bg-[#1a0e07] hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer" title="Refresh user list">
                        <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
                    </button>
                </DashboardHeader>

                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                    {/* Filter & Controls Toolbar */}
                    <div className="bg-[#251508] border border-border rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 font-sans shrink-0">
                        {/* Search Input */}
                        <div className="relative w-full md:w-80">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={queryParams.searchTerm || ""}
                                onChange={(e) => handleFilterChange({ searchTerm: e.target.value || undefined, page: 1 })}
                                placeholder="Search by name, email, or phone…"
                                className="w-full pl-10 pr-4 py-2.5 bg-[#1a0e07] border border-border rounded-2xl text-xs outline-none text-foreground focus:border-primary/60 transition-colors"
                            />
                        </div>

                        {/* Select Filters */}
                        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                            {/* Role Filter Custom Dropdown */}
                            <CustomUserFilterDropdown
                                icon={<ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />}
                                label="Role:"
                                value={queryParams.role || "All Roles"}
                                options={[
                                    { label: "All Roles", value: "" },
                                    { label: "ADMIN", value: "ADMIN" },
                                    { label: "USER", value: "USER" },
                                ]}
                                onSelect={(val) => handleFilterChange({ role: val || undefined, page: 1 })}
                            />

                            {/* Active Status Filter Custom Dropdown */}
                            <CustomUserFilterDropdown
                                icon={<UserCheck className="w-3.5 h-3.5 text-muted-foreground" />}
                                label="Status:"
                                value={queryParams.isActive === undefined ? "All Statuses" : queryParams.isActive ? "Active" : "Suspended"}
                                options={[
                                    { label: "All Statuses", value: "" },
                                    { label: "Active", value: "true" },
                                    { label: "Suspended", value: "false" },
                                ]}
                                onSelect={(val) =>
                                    handleFilterChange({
                                        isActive: val === "" ? undefined : val === "true",
                                        page: 1,
                                    })
                                }
                            />

                            {/* Rows Limit Filter Custom Dropdown */}
                            <CustomUserFilterDropdown
                                icon={<SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />}
                                label="Rows:"
                                value={String(queryParams.limit || 10)}
                                options={[
                                    { label: "10", value: "10" },
                                    { label: "20", value: "20" },
                                    { label: "50", value: "50" },
                                ]}
                                onSelect={(val) => handleFilterChange({ limit: Number(val), page: 1 })}
                            />
                        </div>
                    </div>

                    {/* Users Table */}
                    <UsersTable users={users} isLoading={isLoading} />

                    {/* Pagination Footer */}
                    {meta && (
                        <div className="bg-[#251508] border border-border rounded-2xl px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono shadow-xl shrink-0">
                            <div>
                                Showing <span className="font-bold text-foreground">{users.length}</span> of <span className="font-bold text-foreground">{meta.total}</span> users (Page <span className="font-bold text-primary">{meta.page}</span> of {meta.totalPages || 1})
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleFilterChange({ page: Math.max(1, (queryParams.page || 1) - 1) })}
                                    disabled={!meta.hasPrev || (queryParams.page || 1) <= 1}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-[#1a0e07] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span>Previous</span>
                                </button>

                                <span className="px-2 font-bold text-foreground">
                                    {meta.page} / {meta.totalPages || 1}
                                </span>

                                <button
                                    onClick={() => handleFilterChange({ page: (queryParams.page || 1) + 1 })}
                                    disabled={!meta.hasNext}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-[#1a0e07] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function CustomUserFilterDropdown({
    icon,
    label,
    value,
    options,
    onSelect,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onSelect: (val: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-1.5 bg-[#1a0e07] border border-border hover:border-primary/50 rounded-2xl px-3.5 py-2 text-xs font-mono text-foreground transition-colors cursor-pointer select-none"
            >
                {icon}
                <span className="text-muted-foreground">{label}</span>
                <span className="font-bold text-primary">{value}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-40 bg-[#251508] border border-border rounded-xl shadow-2xl py-1.5 z-50 font-mono">
                        {options.map((opt) => {
                            const isSelected = value === opt.label || value === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onSelect(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                        isSelected ? "bg-primary/15 text-primary" : "text-foreground hover:bg-white/5"
                                    }`}
                                >
                                    <span>{opt.label}</span>
                                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
