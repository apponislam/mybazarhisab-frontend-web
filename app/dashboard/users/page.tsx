"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Users, ShieldCheck, UserCheck } from "lucide-react";
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
                    <button
                        onClick={() => refetch()}
                        className="p-2 rounded-xl border border-border bg-[#1a0e07] hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                        title="Refresh user list"
                    >
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
                            {/* Role Filter */}
                            <div className="flex items-center gap-1.5 bg-[#1a0e07] border border-border rounded-2xl px-3 py-2 text-xs">
                                <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground font-mono">Role:</span>
                                <select
                                    value={queryParams.role || ""}
                                    onChange={(e) => handleFilterChange({ role: e.target.value || undefined, page: 1 })}
                                    className="bg-transparent text-foreground font-bold outline-none cursor-pointer font-mono"
                                >
                                    <option value="">All Roles</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="USER">USER</option>
                                </select>
                            </div>

                            {/* Active Status Filter */}
                            <div className="flex items-center gap-1.5 bg-[#1a0e07] border border-border rounded-2xl px-3 py-2 text-xs">
                                <UserCheck className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground font-mono">Status:</span>
                                <select
                                    value={queryParams.isActive === undefined ? "" : String(queryParams.isActive)}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        handleFilterChange({
                                            isActive: val === "" ? undefined : val === "true",
                                            page: 1,
                                        });
                                    }}
                                    className="bg-transparent text-foreground font-bold outline-none cursor-pointer font-mono"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="true">Active</option>
                                    <option value="false">Suspended</option>
                                </select>
                            </div>

                            {/* Rows Limit Filter */}
                            <div className="flex items-center gap-1.5 bg-[#1a0e07] border border-border rounded-2xl px-3 py-2 text-xs">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground font-mono">Rows:</span>
                                <select
                                    value={queryParams.limit || 10}
                                    onChange={(e) => handleFilterChange({ limit: Number(e.target.value), page: 1 })}
                                    className="bg-transparent text-foreground font-bold outline-none cursor-pointer font-mono"
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <UsersTable users={users} isLoading={isLoading} />

                    {/* Pagination Footer */}
                    {meta && (
                        <div className="bg-[#251508] border border-border rounded-2xl px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono shadow-xl shrink-0">
                            <div>
                                Showing <span className="font-bold text-foreground">{users.length}</span> of{" "}
                                <span className="font-bold text-foreground">{meta.total}</span> users (Page{" "}
                                <span className="font-bold text-primary">{meta.page}</span> of {meta.totalPages || 1})
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
