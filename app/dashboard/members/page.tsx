"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, RefreshCw, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useGetAllGroupsAdminQuery } from "@/redux/features/group/groupApi";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MembersGrid } from "@/components/dashboard/members/MembersGrid";

export default function DashboardMembersPage() {
    const router = useRouter();

    // Query state
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);

    // RTK Query Admin Hook
    const {
        data: responseData,
        isLoading,
        isFetching,
        refetch,
    } = useGetAllGroupsAdminQuery({
        searchTerm: searchTerm || undefined,
        page,
        limit,
    });

    const groups = responseData?.data || [];
    const meta = responseData?.meta;

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            {/* Left Dashboard Sidebar */}
            <DashboardSidebar activeTab="members" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                <DashboardHeader title="Group Members & Roommates Management">
                    <button onClick={() => refetch()} className="p-2 rounded-xl border border-border bg-[#1a0e07] hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer" title="Refresh groups">
                        <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
                    </button>
                </DashboardHeader>

                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                    {/* Controls Bar */}
                    <div className="bg-[#251508] border border-border rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4 shrink-0">
                        <p className="text-xs text-muted-foreground font-mono">Admin view of all roommate groups and active memberships</p>

                        <CustomGroupsLimitDropdown
                            limit={limit}
                            onChange={(newLimit) => {
                                setLimit(newLimit);
                                setPage(1);
                            }}
                        />
                    </div>

                    {/* Members Grid */}
                    <MembersGrid
                        groups={groups}
                        isLoading={isLoading}
                        searchTerm={searchTerm}
                        onSearchChange={(val) => {
                            setSearchTerm(val);
                            setPage(1);
                        }}
                    />

                    {/* Pagination Footer */}
                    {meta && (
                        <div className="bg-[#251508] border border-border rounded-2xl px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono shadow-xl">
                            <div>
                                Showing <span className="font-bold text-foreground">{groups.length}</span> of <span className="font-bold text-foreground">{meta.total}</span> groups (Page <span className="font-bold text-primary">{meta.page}</span> of {meta.totalPages || 1})
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={!meta.hasPrev || page <= 1}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-[#1a0e07] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span>Previous</span>
                                </button>

                                <span className="px-2 font-bold text-foreground">
                                    {meta.page} / {meta.totalPages || 1}
                                </span>

                                <button
                                    onClick={() => setPage((p) => p + 1)}
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

function CustomGroupsLimitDropdown({ limit, onChange }: { limit: number; onChange: (val: number) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const options = [4, 6, 12, 24];

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center gap-1.5 bg-[#1a0e07] border border-border hover:border-primary/50 rounded-xl px-3 py-1.5 text-xs font-mono text-foreground transition-colors cursor-pointer select-none"
            >
                <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Groups per page:</span>
                <span className="font-bold text-primary">{limit}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-44 bg-[#251508] border border-border rounded-xl shadow-2xl py-1.5 z-50 font-mono">
                        {options.map((opt) => {
                            const isSelected = limit === opt;
                            return (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                                        isSelected ? "bg-primary/15 text-primary" : "text-foreground hover:bg-white/5"
                                    }`}
                                >
                                    <span>{opt} groups</span>
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
