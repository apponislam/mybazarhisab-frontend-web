"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useGetVisitorStatsQuery, useGetAllVisitorsQuery } from "@/redux/features/visitor/visitorApi";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { VisitorStatsGrid } from "@/components/dashboard/visitors/VisitorStatsGrid";
import { VisitorAnalyticsChart } from "@/components/dashboard/visitors/VisitorAnalyticsChart";
import { VisitorLogsTable } from "@/components/dashboard/visitors/VisitorLogsTable";

export default function DashboardVisitorsPage() {
    const router = useRouter();
    const [days, setDays] = useState(30);

    // Logs pagination & filtering state
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [platformFilter, setPlatformFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    // RTK Query hooks
    const { data: responseData, isLoading: statsLoading, isFetching: statsFetching, refetch: refetchStats } = useGetVisitorStatsQuery({ days });
    const stats = responseData?.data;

    const {
        data: allVisitorsData,
        isLoading: logsLoading,
        isFetching: logsFetching,
        refetch: refetchLogs,
    } = useGetAllVisitorsQuery({
        page,
        limit,
        platform: platformFilter || undefined,
        searchTerm: searchTerm || undefined,
        date: dateFilter || undefined,
    });

    const visitorsList = allVisitorsData?.data || [];
    const meta = allVisitorsData?.meta;

    const handleRefreshAll = () => {
        refetchStats();
        refetchLogs();
    };

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            {/* Left Dashboard Sidebar */}
            <DashboardSidebar activeTab="visitors" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                <DashboardHeader title="Visitor Analytics & Telemetry">
                    <button onClick={handleRefreshAll} className="p-2 rounded-xl border border-border bg-[#1a0e07] hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer" title="Refresh visitor stats & logs">
                        <RefreshCw className={`w-4 h-4 ${statsFetching || logsFetching ? "animate-spin text-primary" : ""}`} />
                    </button>
                </DashboardHeader>

                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                    {/* Visitor Telemetry Stats */}
                    <VisitorStatsGrid days={days} onDaysChange={setDays} stats={stats} isLoading={statsLoading} />

                    {/* Visitor Analytics Charts & Route Breakdown */}
                    <VisitorAnalyticsChart stats={stats} days={days} />

                    {/* Detailed Visitor Audit Logs Table */}
                    <VisitorLogsTable
                        visitors={visitorsList}
                        meta={meta}
                        isLoading={logsLoading}
                        page={page}
                        setPage={setPage}
                        platformFilter={platformFilter}
                        setPlatformFilter={setPlatformFilter}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        dateFilter={dateFilter}
                        setDateFilter={setDateFilter}
                    />
                </div>
            </main>
        </div>
    );
}
