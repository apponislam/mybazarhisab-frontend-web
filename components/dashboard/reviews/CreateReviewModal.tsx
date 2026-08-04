"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, X } from "lucide-react";
import { toast } from "sonner";
import { useCreateReviewMutation } from "@/redux/features/review/reviewApi";

interface CreateReviewModalProps {
    show: boolean;
    onClose: () => void;
}

export function CreateReviewModal({ show, onClose }: CreateReviewModalProps) {
    const [createReview, { isLoading }] = useCreateReviewMutation();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error("Please enter a review comment");
            return;
        }

        try {
            await createReview({
                rating,
                comment: comment.trim(),
            }).unwrap();

            toast.success("Review submitted successfully!");
            setComment("");
            setRating(5);
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to submit review");
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-5"
                    >
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                                    <Star className="w-5 h-5 text-primary fill-primary" />
                                </div>
                                <h3 className="text-base font-bold text-foreground">Post User Review</h3>
                            </div>
                            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-2">Rating</label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="p-1 cursor-pointer transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-7 h-7 ${
                                                    star <= rating ? "text-primary fill-primary" : "text-muted-foreground/30"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-2 text-sm font-bold font-mono text-primary">{rating} / 5</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Review Comment</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write your feedback or review comment…"
                                    rows={4}
                                    required
                                    className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none focus:border-primary/60 text-foreground"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-white/5 cursor-pointer text-xs"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-accent cursor-pointer text-xs disabled:opacity-50"
                                >
                                    {isLoading ? "Submitting…" : "Post Review"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
