"use client";

import React from "react";
import { Bell, X } from "lucide-react";

export function WebNotificationsTab({
    markAllAsRead,
    deleteAllNotifications,
    notifLoading,
    notifData,
    deleteNotification,
}: {
    markAllAsRead: () => void;
    deleteAllNotifications: () => void;
    notifLoading: boolean;
    notifData?: any;
    deleteNotification: (id: string) => void;
}) {
    return (
        <div className="bg-[#251508] border border-border rounded-3xl p-8 shadow-xl flex flex-col gap-6 font-sans">
            <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Notifications & Activity Feed</h3>
                        <p className="text-xs text-muted-foreground font-mono">All room updates, bazar entries, and account notifications</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => markAllAsRead()} className="px-4 py-2 rounded-xl bg-primary/15 border border-primary/30 text-primary text-xs font-bold font-mono hover:bg-primary/25 transition-all cursor-pointer">
                        Mark All as Read
                    </button>
                    <button onClick={() => deleteAllNotifications()} className="px-4 py-2 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs font-bold font-mono hover:bg-destructive/25 transition-all cursor-pointer">
                        Clear All Logs
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {notifLoading ? (
                    <div className="p-12 text-center text-xs font-mono text-muted-foreground">Fetching notifications log history…</div>
                ) : notifData?.data && notifData.data.length > 0 ? (
                    notifData.data.map((n: any) => (
                        <div key={n._id} className={`p-4 rounded-2xl border transition-all text-left flex items-start justify-between gap-4 ${!n.isRead ? "bg-primary/10 border-primary/40 shadow-md" : "bg-[#1a0e07] border-border/60 hover:bg-white/5"}`}>
                            <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center justify-between font-mono text-xs">
                                    <span className="font-bold text-primary">{n.title}</span>
                                    <span className="text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-foreground font-sans leading-relaxed">{n.message}</p>
                            </div>
                            <button onClick={() => deleteNotification(n._id)} className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer" title="Delete notification">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="p-16 text-center text-xs font-mono text-muted-foreground bg-[#1a0e07] border border-border/60 rounded-2xl">No notifications found in your account logs.</div>
                )}
            </div>
        </div>
    );
}
