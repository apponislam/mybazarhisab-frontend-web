"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { ActivityQueryParams, useClearActivitiesMutation } from "@/redux/features/activity/activityApi";

interface ClearActivitiesModalProps {
    isOpen: boolean;
    filters: ActivityQueryParams;
    onClose: () => void;
}

export function ClearActivitiesModal({ isOpen, filters, onClose }: ClearActivitiesModalProps) {
    const [clearActivities, { isLoading }] = useClearActivitiesMutation();

    const handleClear = async () => {
        try {
            const result = await clearActivities(filters).unwrap();
            toast.success(result?.message || `Cleared ${result?.data?.count || 0} activity logs!`);
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to clear activity logs");
        }
    };

    const hasActiveFilters = Boolean(filters.type || filters.action || filters.userId || filters.groupId || filters.startDate || filters.endDate);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-destructive/15 border border-destructive/30 flex items-center justify-center">
                                    <Trash2 className="w-5 h-5 text-destructive" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground">Clear Activity Logs</h3>
                                    <p className="text-xs text-muted-foreground font-mono">{hasActiveFilters ? "Clear filtered logs" : "Bulk purge all logs"}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-sm text-muted-foreground space-y-3">
                            <p>Are you sure you want to clear system activity logs?</p>

                            {hasActiveFilters ? (
                                <div className="p-3 rounded-2xl bg-[#1a0e07] border border-border/80 text-xs font-mono space-y-1">
                                    <span className="text-primary font-bold">Active Filters Applied:</span>
                                    {filters.type && <p>• Category: {filters.type}</p>}
                                    {filters.action && <p>• Action: {filters.action}</p>}
                                    {filters.userId && <p>• User ID: {filters.userId}</p>}
                                    {filters.groupId && <p>• Group ID: {filters.groupId}</p>}
                                    {filters.startDate && <p>• From: {filters.startDate}</p>}
                                    {filters.endDate && <p>• To: {filters.endDate}</p>}
                                </div>
                            ) : (
                                <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-xs font-mono text-destructive flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>Warning: No filters set. This will purge all un-deleted system audit logs!</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-white/5 cursor-pointer">
                                Cancel
                            </button>
                            <button type="button" onClick={handleClear} disabled={isLoading} className="px-6 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs hover:bg-destructive/90 transition-all disabled:opacity-50 cursor-pointer shadow-md">
                                {isLoading ? "Purging…" : "Confirm Purge"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
