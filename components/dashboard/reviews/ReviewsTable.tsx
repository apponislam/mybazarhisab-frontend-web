"use client";

import React from "react";
import { Star, Eye, EyeOff, Trash2, MessageSquare, ShieldCheck, Check, Globe } from "lucide-react";
import { TReview, useToggleReviewVisibilityMutation } from "@/redux/features/review/reviewApi";
import { toast } from "sonner";

interface ReviewsTableProps {
    reviews: TReview[];
    isLoading: boolean;
    onDeleteReview: (review: TReview) => void;
}

export function ReviewsTable({ reviews, isLoading, onDeleteReview }: ReviewsTableProps) {
    const [toggleVisibility, { isLoading: isToggling }] = useToggleReviewVisibilityMutation();

    const handleToggle = async (id: string) => {
        try {
            await toggleVisibility(id).unwrap();
            toast.success("Review visibility status updated!");
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to toggle visibility");
        }
    };

    const AVATAR_COLORS = ["#c06010", "#8b6914", "#3d7a5c", "#5a4a8a", "#7a3d3d"];

    function avatarColor(id: string) {
        if (!id) return AVATAR_COLORS[0];
        return AVATAR_COLORS[id.charCodeAt(id.length - 1) % AVATAR_COLORS.length];
    }

    function initials(name: string) {
        if (!name) return "U";
        return name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    return (
        <div className="overflow-x-auto flex-1 bg-[#251508] border border-border rounded-3xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" /> User Feedback & Ratings Catalog
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary font-mono font-semibold">
                    <ShieldCheck className="w-4 h-4" /> Admin Controls
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[rgba(232,160,32,0.1)]">
                <table className="w-full border-collapse text-left text-sm font-sans">
                    <thead className="bg-[#2e1a0a] text-muted-foreground font-mono text-xs border-b border-[rgba(232,160,32,0.1)]">
                        <tr>
                            <th className="p-4">User Info & ID</th>
                            <th className="p-4">Rating</th>
                            <th className="p-4">Comment</th>
                            <th className="p-4 text-center">Visibility</th>
                            <th className="p-4 text-center">Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(232,160,32,0.06)] bg-[#251508]">
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                        <p className="text-xs font-mono">Loading reviews catalog…</p>
                                    </div>
                                </td>
                            </tr>
                        ) : reviews.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Star className="w-10 h-10 text-muted-foreground/40 mb-1" />
                                        <p className="text-sm font-semibold">No user reviews found</p>
                                        <p className="text-xs text-muted-foreground">User ratings will appear here once submitted.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            reviews.map((rev) => (
                                <tr key={rev._id} className="hover:bg-primary/5 transition-colors group">
                                    {/* User Info */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-md"
                                                style={{ background: avatarColor(rev.user?._id || "") }}
                                            >
                                                {rev.user?.profileImage ? (
                                                    <img src={rev.user.profileImage} alt={rev.user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    initials(rev.user?.name || "User")
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">{rev.user?.name || "Anonymous User"}</h4>
                                                <p className="text-xs text-muted-foreground font-mono">{rev.user?.email}</p>
                                                <p className="text-[10px] text-muted-foreground font-mono select-all mt-0.5" title={rev._id}>
                                                    ID: {rev._id}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Rating */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${
                                                        star <= rev.rating ? "text-primary fill-primary" : "text-muted-foreground/30"
                                                    }`}
                                                />
                                            ))}
                                            <span className="ml-1 text-xs font-bold font-mono text-primary">{rev.rating}/5</span>
                                        </div>
                                    </td>

                                    {/* Comment */}
                                    <td className="p-4 max-w-sm">
                                        <p className="text-xs text-foreground leading-relaxed italic font-sans">"{rev.comment}"</p>
                                    </td>

                                    {/* Visibility Status */}
                                    <td className="p-4 text-center">
                                        {rev.isPublic ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-green-500/15 text-green-400 border border-green-500/30">
                                                <Globe className="w-3 h-3" /> Public
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
                                                <EyeOff className="w-3 h-3" /> Hidden
                                            </span>
                                        )}
                                    </td>

                                    {/* Date */}
                                    <td className="p-4 text-center text-xs text-muted-foreground font-mono">
                                        {new Date(rev.createdAt).toLocaleDateString()}
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => handleToggle(rev._id)}
                                                disabled={isToggling}
                                                className={`p-1.5 rounded-lg border border-border bg-[#1a0e07] hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors cursor-pointer disabled:opacity-50`}
                                                title={rev.isPublic ? "Hide from public website" : "Make public on landing page"}
                                            >
                                                {rev.isPublic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-primary" />}
                                            </button>

                                            <button
                                                onClick={() => onDeleteReview(rev)}
                                                className="p-1.5 rounded-lg border border-border bg-[#1a0e07] hover:border-destructive/50 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                                title="Delete Review"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
