"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, RefreshCw, Plus, SlidersHorizontal } from "lucide-react";
import { TReview, useGetAllReviewsQuery, useGetReviewSummaryStatsQuery } from "@/redux/features/review/reviewApi";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ReviewStatsSummary } from "@/components/dashboard/reviews/ReviewStatsSummary";
import { ReviewsTable } from "@/components/dashboard/reviews/ReviewsTable";
import { CreateReviewModal } from "@/components/dashboard/reviews/CreateReviewModal";
import { DeleteReviewModal } from "@/components/dashboard/reviews/DeleteReviewModal";

export default function DashboardReviewsPage() {
    const router = useRouter();

    // Query state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // RTK Query hooks
    const { data: summaryData } = useGetReviewSummaryStatsQuery();
    const { data: responseData, isLoading, isFetching, refetch } = useGetAllReviewsQuery({ page, limit });

    const reviews = responseData?.data || [];
    const meta = responseData?.meta;

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [deletingReview, setDeletingReview] = useState<TReview | null>(null);

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            {/* Left Dashboard Sidebar */}
            <DashboardSidebar activeTab="reviews" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                <DashboardHeader title="User Reviews & Ratings">
                    <button
                        onClick={() => refetch()}
                        className="p-2 rounded-xl border border-border bg-[#1a0e07] hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                        title="Refresh reviews"
                    >
                        <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
                    </button>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl transition-all hover:bg-accent cursor-pointer shadow-md shadow-primary/20"
                    >
                        <Plus className="w-4 h-4" /> Post Review
                    </button>
                </DashboardHeader>

                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                    {/* Summary Cards */}
                    <ReviewStatsSummary summary={summaryData?.data} />

                    {/* Controls Bar */}
                    <div className="bg-[#251508] border border-border rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4 shrink-0">
                        <p className="text-xs text-muted-foreground font-mono">
                            Manage user rating submissions and landing page visibility
                        </p>

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

                    {/* Reviews Table */}
                    <ReviewsTable
                        reviews={reviews}
                        isLoading={isLoading}
                        onDeleteReview={(rev) => setDeletingReview(rev)}
                    />

                    {/* Pagination Footer */}
                    {meta && (
                        <div className="bg-[#251508] border border-border rounded-2xl px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono shadow-xl">
                            <div>
                                Showing <span className="font-bold text-foreground">{reviews.length}</span> of{" "}
                                <span className="font-bold text-foreground">{meta.total}</span> reviews (Page{" "}
                                <span className="font-bold text-primary">{meta.page}</span> of {meta.totalPages || 1})
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
            <CreateReviewModal show={showCreateModal} onClose={() => setShowCreateModal(false)} />
            <DeleteReviewModal review={deletingReview} onClose={() => setDeletingReview(null)} />
        </div>
    );
}
