"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useGetVisitorStatsQuery } from "@/redux/features/visitor/visitorApi";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { VisitorStatsGrid } from "@/components/dashboard/visitors/VisitorStatsGrid";
import { VisitorAnalyticsChart } from "@/components/dashboard/visitors/VisitorAnalyticsChart";

export default function DashboardVisitorsPage() {
    const router = useRouter();
    const [days, setDays] = useState(30);

    // RTK Query hook
    const { data: responseData, isLoading, isFetching, refetch } = useGetVisitorStatsQuery({ days });
    const stats = responseData?.data;

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            {/* Left Dashboard Sidebar */}
            <DashboardSidebar activeTab="visitors" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                <DashboardHeader title="Visitor Analytics & Telemetry">
                    <button
                        onClick={() => refetch()}
                        className="p-2 rounded-xl border border-border bg-[#1a0e07] hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                        title="Refresh visitor stats"
                    >
                        <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
                    </button>
                </DashboardHeader>

                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                    {/* Visitor Telemetry Stats */}
                    <VisitorStatsGrid days={days} onDaysChange={setDays} stats={stats} isLoading={isLoading} />

                    {/* Visitor Analytics Charts & Route Breakdown */}
                    <VisitorAnalyticsChart stats={stats} days={days} />
                </div>
            </main>
        </div>
    );
}
