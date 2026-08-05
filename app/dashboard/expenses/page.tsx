"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, RefreshCw, SlidersHorizontal } from "lucide-react";
import { TBazarEntry, useGetAllBazarEntriesByAdminQuery } from "@/redux/features/bazar-entry/bazarEntryApi";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ExpensesTable } from "@/components/dashboard/expenses/ExpensesTable";
import { AddExpenseModal } from "@/components/dashboard/expenses/AddExpenseModal";
import { EditExpenseModal } from "@/components/dashboard/expenses/EditExpenseModal";
import { DeleteExpenseModal } from "@/components/dashboard/expenses/DeleteExpenseModal";

export default function DashboardExpensesPage() {
    const router = useRouter();

    // Query state
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // RTK Query Admin Hook
    const {
        data: responseData,
        isLoading,
        isFetching,
        refetch,
    } = useGetAllBazarEntriesByAdminQuery({
        searchTerm: searchTerm || undefined,
        page,
        limit,
    });

    const entries = responseData?.data || [];
    const meta = responseData?.meta;

    // Modal state
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [editingExpense, setEditingExpense] = useState<TBazarEntry | null>(null);
    const [deletingExpense, setDeletingExpense] = useState<TBazarEntry | null>(null);

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            {/* Left Dashboard Sidebar */}
            <DashboardSidebar activeTab="expenses" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                <DashboardHeader title="Bazar Expenses Management (Admin)" onAddExpense={() => setShowAddExpense(true)}>
                    <button onClick={() => refetch()} className="p-2 rounded-xl border border-border bg-[#1a0e07] hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer" title="Refresh expenses">
                        <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
                    </button>
                </DashboardHeader>

                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                    {/* Controls Bar */}
                    <div className="bg-[#251508] border border-border rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4 shrink-0">
                        <p className="text-xs text-muted-foreground font-mono">Admin view of all bazar expense logs across the system</p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span>Rows per page:</span>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="bg-[#1a0e07] border border-border rounded-lg px-2 py-1 text-xs outline-none text-foreground cursor-pointer"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>

                    {/* Expenses Table Component */}
                    <ExpensesTable
                        entries={entries}
                        isLoading={isLoading}
                        searchTerm={searchTerm}
                        onSearchChange={(val) => {
                            setSearchTerm(val);
                            setPage(1);
                        }}
                        onEditExpense={(entry) => setEditingExpense(entry)}
                        onDeleteExpense={(entry) => setDeletingExpense(entry)}
                    />

                    {/* Pagination Footer */}
                    {meta && (
                        <div className="bg-[#251508] border border-border rounded-2xl px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono shadow-xl">
                            <div>
                                Showing <span className="font-bold text-foreground">{entries.length}</span> of <span className="font-bold text-foreground">{meta.total}</span> expenses (Page <span className="font-bold text-primary">{meta.page}</span> of {meta.totalPages || 1})
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

            {/* Modals */}
            <AddExpenseModal show={showAddExpense} onClose={() => setShowAddExpense(false)} />
            <EditExpenseModal entry={editingExpense} onClose={() => setEditingExpense(null)} />
            <DeleteExpenseModal entry={deletingExpense} onClose={() => setDeletingExpense(null)} />
        </div>
    );
}
