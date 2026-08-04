"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ProfileSettingsForm } from "@/components/dashboard/settings/ProfileSettingsForm";
import { PasswordSettingsForm } from "@/components/dashboard/settings/PasswordSettingsForm";

export default function DashboardSettingsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            <DashboardSidebar activeTab="settings" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            <main className="flex-1 flex flex-col min-w-0 relative">
                <header className="h-20 border-b border-[rgba(232,160,32,0.1)] px-8 flex items-center justify-between shrink-0 bg-[#251508]/30">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight font-sans">Account Settings</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold font-mono">
                            <span>Sabzi Mandi Group ⭐️</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <ProfileSettingsForm />
                        <PasswordSettingsForm />
                    </div>
                </div>
            </main>
        </div>
    );
}
