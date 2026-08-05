"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAllActivitiesQuery, ActivityQueryParams } from "@/redux/features/activity/activityApi";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ActivityFilterToolbar } from "@/components/dashboard/activities/ActivityFilterToolbar";
import { ActivitiesTable } from "@/components/dashboard/activities/ActivitiesTable";
import { ClearActivitiesModal } from "@/components/dashboard/activities/ClearActivitiesModal";

export default function DashboardActivitiesPage() {
    const router = useRouter();

    // Query parameters state
    const [queryParams, setQueryParams] = useState<ActivityQueryParams>({
        page: 1,
        limit: 20,
    });

    const [isClearModalOpen, setIsClearModalOpen] = useState(false);

    // RTK Query Admin Hook
    const { data: responseData, isLoading, isFetching, refetch } = useGetAllActivitiesQuery(queryParams);

    const activities = responseData?.data || [];
    const meta = responseData?.meta;

    const handleFilterChange = (newFilters: Partial<ActivityQueryParams>) => {
        setQueryParams((prev) => ({ ...prev, ...newFilters }));
    };

    const handleResetFilters = () => {
        setQueryParams({
            page: 1,
            limit: 20,
        });
    };

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            {/* Left Dashboard Sidebar */}
            <DashboardSidebar activeTab="activities" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                <DashboardHeader title="System Audit & Activity Logs">
                    <button onClick={() => refetch()} className="p-2 rounded-xl border border-border bg-[#1a0e07] hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer" title="Refresh activity audit logs">
                        <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
                    </button>
                </DashboardHeader>

                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                    {/* Activity Filter Toolbar */}
                    <ActivityFilterToolbar filters={queryParams} onFilterChange={handleFilterChange} onResetFilters={handleResetFilters} onOpenClearModal={() => setIsClearModalOpen(true)} />

                    {/* Activities Table */}
                    <ActivitiesTable activities={activities} isLoading={isLoading} />

                    {/* Pagination Footer */}
                    {meta && (
                        <div className="bg-[#251508] border border-border rounded-2xl px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono shadow-xl shrink-0">
                            <div>
                                Showing <span className="font-bold text-foreground">{activities.length}</span> of <span className="font-bold text-foreground">{meta.total}</span> activity records (Page <span className="font-bold text-primary">{meta.page}</span> of {meta.totalPages || 1})
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

            {/* Clear Activities Modal */}
            <ClearActivitiesModal isOpen={isClearModalOpen} filters={queryParams} onClose={() => setIsClearModalOpen(false)} />
        </div>
    );
}
