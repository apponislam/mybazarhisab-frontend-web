"use client";

import React from "react";
import { Bell, CheckCheck, X } from "lucide-react";

interface WebNotificationsTabProps {
    notifData: any;
    onMarkAllAsRead: () => void;
    onDeleteAll: () => void;
    onDeleteOne: (id: string) => void;
}

export function WebNotificationsTab({
    notifData,
    onMarkAllAsRead,
    onDeleteAll,
    onDeleteOne,
}: WebNotificationsTabProps) {
    return (
        <div className="flex-1 flex flex-col gap-6 min-h-0 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl font-sans text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-4 select-none">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Bell className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-foreground">Notifications & Activity Feed</h3>
                        <p className="text-xs text-muted-foreground font-mono">
                            Recent alerts, group updates, and system activity logs
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onMarkAllAsRead}
                        className="px-3.5 py-1.5 rounded-xl border border-border bg-[#1a0e07] text-muted-foreground hover:text-foreground text-xs font-mono font-semibold hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        <CheckCheck className="w-3.5 h-3.5 text-primary" /> Mark All Read
                    </button>
                    {notifData?.data && notifData.data.length > 0 && (
                        <button
                            onClick={onDeleteAll}
                            className="px-3.5 py-1.5 rounded-xl bg-destructive/15 text-destructive border border-destructive/30 text-xs font-mono font-bold hover:bg-destructive/25 transition-all cursor-pointer"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {notifData?.data && notifData.data.length > 0 ? (
                    notifData.data.map((n: any) => (
                        <div
                            key={n._id}
                            className={`p-4 rounded-2xl border transition-all text-left flex items-start justify-between gap-4 ${
                                !n.isRead
                                    ? "bg-primary/10 border-primary/40 shadow-sm"
                                    : "bg-[#1a0e07] border-border/60 hover:bg-white/5"
                            }`}
                        >
                            <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center justify-between font-mono text-xs">
                                    <span className="font-bold text-primary">{n.title}</span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {new Date(n.createdAt).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-xs text-foreground font-sans leading-relaxed">{n.message}</p>
                            </div>
                            <button
                                onClick={() => onDeleteOne(n._id)}
                                className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer"
                                title="Delete notification"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="p-16 text-center text-xs font-mono text-muted-foreground bg-[#1a0e07] border border-border/60 rounded-2xl">
                        No notifications found.
                    </div>
                )}
            </div>
        </div>
    );
}
