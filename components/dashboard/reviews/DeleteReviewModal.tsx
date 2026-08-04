"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { TReview, useDeleteReviewMutation } from "@/redux/features/review/reviewApi";

interface DeleteReviewModalProps {
    review: TReview | null;
    onClose: () => void;
}

export function DeleteReviewModal({ review, onClose }: DeleteReviewModalProps) {
    const [deleteReview, { isLoading }] = useDeleteReviewMutation();

    const handleDelete = async () => {
        if (!review) return;
        try {
            await deleteReview(review._id).unwrap();
            toast.success("Review deleted successfully!");
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to delete review");
        }
    };

    return (
        <AnimatePresence>
            {review && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-6"
                    >
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-destructive/15 border border-destructive/30 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-destructive" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Delete User Review</h3>
                                    <p className="text-xs text-muted-foreground">Confirm deletion</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>
                                Are you sure you want to delete the review by <strong className="text-foreground">{review.user?.name || "User"}</strong>?
                            </p>
                            <p className="italic text-xs text-foreground bg-[#1a0e07] p-3 rounded-xl border border-border">"{review.comment}"</p>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-white/5 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="px-6 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs hover:bg-destructive/90 transition-all disabled:opacity-50 cursor-pointer shadow-md"
                            >
                                {isLoading ? "Deleting…" : "Delete Review"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
