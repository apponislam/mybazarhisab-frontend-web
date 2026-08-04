"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PolicyEditor } from "@/components/dashboard/policies/PolicyEditor";

export default function DashboardPoliciesPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            {/* Left Dashboard Sidebar */}
            <DashboardSidebar activeTab="policies" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                <DashboardHeader title="Legal Terms & Privacy Policies" />

                <div className="flex-1 overflow-y-auto p-8 flex flex-col">
                    <PolicyEditor />
                </div>
            </main>
        </div>
    );
}
