"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, RefreshCw, SlidersHorizontal } from "lucide-react";
import { TContact, useGetAllMessagesQuery } from "@/redux/features/contact/contactApi";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ContactMessagesTable } from "@/components/dashboard/contacts/ContactMessagesTable";
import { ContactDetailsModal } from "@/components/dashboard/contacts/ContactDetailsModal";
import { ReplyContactModal } from "@/components/dashboard/contacts/ReplyContactModal";
import { DeleteContactModal } from "@/components/dashboard/contacts/DeleteContactModal";

export default function DashboardContactsPage() {
    const router = useRouter();

    // Query state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // RTK Query hook
    const { data: responseData, isLoading, isFetching, refetch } = useGetAllMessagesQuery({
        page,
        limit,
    });

    const messages = responseData?.data || [];
    const meta = responseData?.meta;

    // Modal states
    const [viewingContactId, setViewingContactId] = useState<string | null>(null);
    const [replyingContact, setReplyingContact] = useState<TContact | null>(null);
    const [deletingContact, setDeletingContact] = useState<TContact | null>(null);

    return (
        <div className="min-h-screen bg-[#1a0e07] text-[#f5ede2] flex font-sans overflow-hidden">
            {/* Left Dashboard Sidebar */}
            <DashboardSidebar activeTab="contacts" onTabChange={(t) => router.push(`/dashboard/${t === "overview" ? "" : t}`)} />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Top Header Bar */}
                <DashboardHeader title="Support Messages">
                    <button
                        onClick={() => refetch()}
                        className="p-2 rounded-xl border border-border bg-[#1a0e07] hover:border-primary/40 text-muted-foreground hover:text-primary transition-all cursor-pointer"
                        title="Refresh support messages"
                    >
                        <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-primary" : ""}`} />
                    </button>
                </DashboardHeader>

                {/* Dashboard Inner Workspace */}
                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                    {/* Controls Bar */}
                    <div className="bg-[#251508] border border-border rounded-2xl p-4 shadow-xl flex items-center justify-between gap-4 shrink-0">
                        <p className="text-xs text-muted-foreground font-mono">
                            Showing user contact submissions and support inquiries
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

                    {/* Table Container */}
                    <div className="bg-[#251508] border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col flex-1">
                        <ContactMessagesTable
                            messages={messages}
                            isLoading={isLoading}
                            onViewDetails={(id) => setViewingContactId(id)}
                            onReply={(contact) => setReplyingContact(contact)}
                            onDelete={(contact) => setDeletingContact(contact)}
                        />

                        {/* Pagination Footer */}
                        {meta && (
                            <div className="bg-[#2e1a0a] border-t border-[rgba(232,160,32,0.1)] px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
                                <div>
                                    Showing <span className="font-bold text-foreground">{messages.length}</span> of{" "}
                                    <span className="font-bold text-foreground">{meta.total}</span> messages (Page{" "}
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
                </div>
            </main>

            {/* Modals */}
            <ContactDetailsModal id={viewingContactId} onClose={() => setViewingContactId(null)} />
            <ReplyContactModal contact={replyingContact} onClose={() => setReplyingContact(null)} />
            <DeleteContactModal contact={deletingContact} onClose={() => setDeletingContact(null)} />
        </div>
    );
}
