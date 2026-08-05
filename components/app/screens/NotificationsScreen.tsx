import React, { useState } from "react";
import { CheckCheck, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { ScreenShell, BackButton, Avatar } from "@/components/app/ui/Shared";
import { fmtDate } from "@/lib/mockData";
import { useGetMyNotificationsQuery, useMarkAllAsReadMutation, useDeleteAllNotificationsMutation, useDeleteNotificationMutation } from "@/redux/features/notification/notificationApi";

export function NotificationsScreen({ onBack }: { onBack: () => void }) {
    const { data: notifData, isLoading } = useGetMyNotificationsQuery();
    const [markAllRead, { isLoading: isMarking }] = useMarkAllAsReadMutation();
    const [deleteAll, { isLoading: isDeletingAll }] = useDeleteAllNotificationsMutation();
    const [deleteSingle] = useDeleteNotificationMutation();

    const notifications = notifData?.data || [];

    const handleMarkAllRead = async () => {
        try {
            await markAllRead().unwrap();
            toast.success("All notifications marked as read!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to mark notifications as read");
        }
    };

    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const handleDeleteAll = async () => {
        try {
            await deleteAll().unwrap();
            toast.success("Cleared all notifications!");
            setShowClearConfirm(false);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to clear notifications");
        }
    };

    const handleDeleteSingle = async (id: string) => {
        try {
            await deleteSingle(id).unwrap();
            toast.success("Notification removed");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to remove notification");
        }
    };

    return (
        <ScreenShell scrollable>
            <div className="flex flex-col px-6 pt-12 pb-8 gap-5">
                <div className="flex items-center justify-between">
                    <BackButton onBack={onBack} label="Profile" />
                    {notifications.length > 0 && (
                        <div className="flex items-center gap-2">
                            <button onClick={handleMarkAllRead} disabled={isMarking} className="px-3 py-1.5 rounded-xl border border-primary/40 bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5">
                                <CheckCheck className="w-3.5 h-3.5" />
                                {isMarking ? "Reading..." : "Mark all read"}
                            </button>
                            <button onClick={() => setShowClearConfirm(true)} className="w-8 h-8 rounded-xl border border-destructive/40 bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors" title="Clear all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {showClearConfirm && (
                    <div className="p-4 rounded-2xl border border-destructive/40 bg-card flex flex-col gap-3 shadow-xl">
                        <p className="text-xs font-bold text-destructive">Clear all notifications?</p>
                        <div className="flex gap-2">
                            <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-1.5 rounded-lg border border-border text-xs text-foreground font-semibold">
                                Cancel
                            </button>
                            <button onClick={handleDeleteAll} disabled={isDeletingAll} className="flex-1 py-1.5 rounded-lg bg-destructive text-white text-xs font-bold">
                                {isDeletingAll ? "Clearing..." : "Clear All"}
                            </button>
                        </div>
                    </div>
                )}

                <div>
                    <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                        Notifications
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        Group alerts & transaction history
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    {isLoading ? (
                        <div className="space-y-3 py-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-full h-24 rounded-2xl bg-card/60 border border-border/40 animate-pulse p-4 flex gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-secondary/80 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-secondary/80 rounded w-1/3" />
                                        <div className="h-3 bg-secondary/60 rounded w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-2xl mb-3">🔔</div>
                            <p className="text-sm font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                No Notifications
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 max-w-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                You are all caught up! New group expenses and bills will show up here.
                            </p>
                        </div>
                    ) : (
                        notifications.map((n: any) => (
                            <div key={n._id} className={`rounded-2xl border p-4 flex flex-col gap-2 transition-all relative ${n.isRead ? "border-border/60 bg-card/60" : "border-primary/50 bg-card"}`} style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                                {n.title}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground font-mono">{fmtDate(new Date(n.createdAt))}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteSingle(n._id)} className="w-7 h-7 rounded-lg border border-destructive/30 bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive/20 transition-colors shrink-0">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <p className="text-xs text-foreground/90 leading-relaxed pl-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                    {n.message}
                                </p>

                                {n.sender && (
                                    <div className="flex items-center gap-2 pt-1 mt-1 border-t border-border/40">
                                        <Avatar user={{ id: n.sender._id, name: n.sender.name, email: n.sender.email, phone: n.sender.phone || "" }} size={18} />
                                        <span className="text-xs text-muted-foreground font-medium">{n.sender.name}</span>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </ScreenShell>
    );
}
