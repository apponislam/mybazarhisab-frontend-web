"use client";

import React, { useState } from "react";
import { Activity, Trash2, User, Users, ShoppingBag, Receipt, Shield, Key, Clock } from "lucide-react";
import { TActivity } from "@/redux/features/activity/activityApi";
import { DeleteActivityModal } from "./DeleteActivityModal";

interface ActivitiesTableProps {
    activities: TActivity[];
    isLoading: boolean;
}

export function ActivitiesTable({ activities, isLoading }: ActivitiesTableProps) {
    const [selectedActivity, setSelectedActivity] = useState<TActivity | null>(null);

    const AVATAR_COLORS = ["#c06010", "#8b6914", "#3d7a5c", "#5a4a8a", "#7a3d3d"];

    function avatarColor(id?: string) {
        if (!id) return AVATAR_COLORS[0];
        return AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];
    }

    function initials(name?: string) {
        if (!name) return "U";
        return name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    const getActionBadgeColor = (action: string) => {
        const act = action.toUpperCase();
        if (act.includes("LOGIN") || act.includes("REGISTER") || act.includes("PASSWORD") || act.includes("PROFILE")) {
            return "bg-blue-500/15 text-blue-400 border-blue-500/30";
        }
        if (act.includes("PRODUCT")) {
            return "bg-purple-500/15 text-purple-400 border-purple-500/30";
        }
        if (act.includes("BAZAR")) {
            return "bg-primary/15 text-primary border-primary/30";
        }
        if (act.includes("BILL")) {
            return "bg-amber-500/15 text-amber-400 border-amber-500/30";
        }
        if (act.includes("GROUP")) {
            return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
        }
        return "bg-white/10 text-foreground border-white/20";
    };

    const getActionIcon = (action: string) => {
        const act = action.toUpperCase();
        if (act.includes("LOGIN") || act.includes("REGISTER") || act.includes("AUTH")) return <Key className="w-3.5 h-3.5" />;
        if (act.includes("PRODUCT")) return <ShoppingBag className="w-3.5 h-3.5" />;
        if (act.includes("BAZAR")) return <ShoppingBag className="w-3.5 h-3.5" />;
        if (act.includes("BILL")) return <Receipt className="w-3.5 h-3.5" />;
        if (act.includes("GROUP")) return <Users className="w-3.5 h-3.5" />;
        return <Activity className="w-3.5 h-3.5" />;
    };

    return (
        <div className="flex-1 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-4 font-sans overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                        <Activity className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">System Audit Feed</h4>
                        <p className="text-xs text-muted-foreground font-mono">Real-time user & admin operation logs</p>
                    </div>
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                    Total Records: <strong className="text-primary font-bold">{activities.length}</strong>
                </div>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl border border-[rgba(232,160,32,0.1)]">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-[#1a0e07] text-muted-foreground font-mono text-xs border-b border-[rgba(232,160,32,0.1)] sticky top-0 z-10">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Details</th>
                            <th className="p-4">Group</th>
                            <th className="p-4">Timestamp</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(232,160,32,0.06)] bg-[#251508]">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-muted-foreground font-mono text-xs">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span>Fetching activity audit logs…</span>
                                    </div>
                                </td>
                            </tr>
                        ) : activities.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Activity className="w-10 h-10 text-muted-foreground/40 mb-1" />
                                        <p className="text-sm font-semibold">No activity logs found</p>
                                        <p className="text-xs text-muted-foreground">User actions and backend events will be recorded here.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            activities.map((log) => {
                                const userObj = typeof log.user === "object" ? log.user : null;
                                const groupObj = typeof log.group === "object" ? log.group : null;
                                const userName = userObj?.name || "System User";
                                const userEmail = userObj?.email || "";
                                const groupName = groupObj?.name || "Global System";

                                return (
                                    <tr key={log._id} className="hover:bg-primary/5 transition-colors group">
                                        {/* User Column */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-2.5">
                                                <div
                                                    className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md"
                                                    style={{ background: avatarColor(userObj?._id || "") }}
                                                >
                                                    {userObj?.profileImage ? (
                                                        <img src={userObj.profileImage} alt={userName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        initials(userName)
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                                                    {userEmail && <p className="text-[10px] text-muted-foreground font-mono truncate">{userEmail}</p>}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Action Badge */}
                                        <td className="p-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold font-mono border uppercase tracking-wider ${getActionBadgeColor(
                                                    log.action
                                                )}`}
                                            >
                                                {getActionIcon(log.action)}
                                                <span>{log.action}</span>
                                            </span>
                                        </td>

                                        {/* Details Description */}
                                        <td className="p-4">
                                            <p className="text-xs text-foreground font-sans max-w-md line-clamp-2">{log.details}</p>
                                            {log.metadata && Object.keys(log.metadata).length > 0 && (
                                                <p className="text-[10px] text-muted-foreground/70 font-mono mt-0.5 truncate">
                                                    Meta: {JSON.stringify(log.metadata)}
                                                </p>
                                            )}
                                        </td>

                                        {/* Group */}
                                        <td className="p-4">
                                            <span className="text-xs font-mono text-muted-foreground bg-[#1a0e07] px-2.5 py-1 rounded-lg border border-border/60">
                                                {groupName}
                                            </span>
                                        </td>

                                        {/* Timestamp */}
                                        <td className="p-4 text-xs font-mono text-muted-foreground shrink-0">
                                            <div className="flex items-center gap-1 text-[11px]">
                                                <Clock className="w-3 h-3 text-muted-foreground/70" />
                                                <span>{new Date(log.createdAt).toLocaleString()}</span>
                                            </div>
                                        </td>

                                        {/* Delete Action Button */}
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => setSelectedActivity(log)}
                                                className="p-1.5 rounded-lg border border-border bg-[#1a0e07] text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors cursor-pointer"
                                                title="Delete Activity Log Record"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Custom Confirmation Modal */}
            <DeleteActivityModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
        </div>
    );
}
