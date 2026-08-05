"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, User, Mail, Phone, ShoppingBag, Receipt, Star, Activity, Package } from "lucide-react";
import { useGetUserProfileAndSummaryQuery, useGetUserBazarEntriesQuery, useGetUserBillsQuery, useGetUserReviewsQuery, useGetUserProductsQuery, useGetUserActivitiesQuery } from "@/redux/features/user/userApi";

interface UserDetailModalProps {
    userId: string | null;
    onClose: () => void;
}

export function UserDetailModal({ userId, onClose }: UserDetailModalProps) {
    const [subTab, setSubTab] = useState<"summary" | "bazar" | "bills" | "products" | "reviews" | "activities">("summary");

    // Profile & Summary Stats
    const { data: responseData, isLoading } = useGetUserProfileAndSummaryQuery(userId || "", {
        skip: !userId,
    });

    const userSummary = responseData?.data;
    const user = userSummary?.user;
    const stats = userSummary?.stats;

    // Sub-resource Queries
    const { data: bazarData } = useGetUserBazarEntriesQuery({ userId: userId || "" }, { skip: !userId || subTab !== "bazar" });
    const { data: billsData } = useGetUserBillsQuery({ userId: userId || "" }, { skip: !userId || subTab !== "bills" });
    const { data: productsData } = useGetUserProductsQuery({ userId: userId || "" }, { skip: !userId || subTab !== "products" });
    const { data: reviewsData } = useGetUserReviewsQuery({ userId: userId || "" }, { skip: !userId || subTab !== "reviews" });
    const { data: activitiesData } = useGetUserActivitiesQuery({ userId: userId || "" }, { skip: !userId || subTab !== "activities" });

    function initials(name?: string) {
        if (!name) return "U";
        return name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    }

    return (
        <AnimatePresence>
            {userId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-2xl shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground">User Profile & Sub-Resource Explorer</h3>
                                    <p className="text-xs text-muted-foreground font-mono">Comprehensive user data & activity logs</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {isLoading || !user ? (
                            <div className="p-12 text-center text-muted-foreground font-mono text-xs flex items-center justify-center gap-3">
                                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                <span>Loading user summary details…</span>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* Header Card */}
                                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[#1a0e07] border border-border/80">
                                    <div className="w-14 h-14 rounded-full overflow-hidden bg-primary flex items-center justify-center font-bold text-lg text-primary-foreground shrink-0 shadow-lg border-2 border-primary/40">
                                        {user.profileImage ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" /> : initials(user.name)}
                                    </div>
                                    <div className="flex-1 min-w-0 text-center sm:text-left">
                                        <div className="flex items-center justify-center sm:justify-start gap-2">
                                            <h4 className="text-base font-bold text-foreground truncate">{user.name}</h4>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${user.role === "ADMIN" ? "bg-primary/20 text-primary border-primary/40" : "bg-white/10 text-muted-foreground border-white/20"}`}>{user.role || "USER"}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${user.isActive !== false ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-destructive/15 text-destructive border-destructive/30"}`}>
                                                {user.isActive !== false ? "Active" : "Suspended"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-mono mt-1 flex items-center justify-center sm:justify-start gap-1">
                                            <Mail className="w-3 h-3 text-muted-foreground" /> {user.email}
                                        </p>
                                        {user.phone && (
                                            <p className="text-xs text-muted-foreground font-mono mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                                                <Phone className="w-3 h-3 text-muted-foreground" /> {user.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Navigation Sub-Tabs */}
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border/60 scrollbar-none">
                                    {[
                                        { id: "summary", label: "Overview Stats", icon: <User className="w-3.5 h-3.5" /> },
                                        { id: "bazar", label: `Bazar (${stats?.totalBazarEntries || 0})`, icon: <ShoppingBag className="w-3.5 h-3.5" /> },
                                        { id: "bills", label: `Bills (${stats?.totalBills || 0})`, icon: <Receipt className="w-3.5 h-3.5" /> },
                                        { id: "products", label: `Products (${stats?.totalProducts || 0})`, icon: <Package className="w-3.5 h-3.5" /> },
                                        { id: "reviews", label: `Reviews (${stats?.totalReviews || 0})`, icon: <Star className="w-3.5 h-3.5" /> },
                                        { id: "activities", label: `Logs (${stats?.totalActivities || 0})`, icon: <Activity className="w-3.5 h-3.5" /> },
                                    ].map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setSubTab(t.id as any)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                                                subTab === t.id ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-[#1a0e07] text-muted-foreground border-border/60 hover:text-foreground hover:bg-white/5"
                                            }`}
                                        >
                                            {t.icon}
                                            <span>{t.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Contents */}
                                {subTab === "summary" && (
                                    <div className="space-y-4">
                                        <h5 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">Financial Summary</h5>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div className="p-3.5 rounded-2xl bg-[#1a0e07] border border-border/60">
                                                <p className="text-[10px] text-muted-foreground font-mono">Bazar Spent</p>
                                                <p className="text-lg font-bold text-primary font-mono mt-0.5">৳{(stats?.totalBazarSpent || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="p-3.5 rounded-2xl bg-[#1a0e07] border border-border/60">
                                                <p className="text-[10px] text-muted-foreground font-mono">Bills Spent</p>
                                                <p className="text-lg font-bold text-amber-400 font-mono mt-0.5">৳{(stats?.totalBillSpent || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/30">
                                                <p className="text-[10px] text-primary font-mono font-bold">Total Overall Spent</p>
                                                <p className="text-lg font-bold text-primary font-mono mt-0.5">৳{(stats?.totalOverallSpent || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {subTab === "bazar" && (
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                        {bazarData?.data?.length ? (
                                            bazarData.data.map((item: any) => (
                                                <div key={item._id} className="p-3 rounded-2xl bg-[#1a0e07] border border-border/60 flex items-center justify-between text-xs font-mono">
                                                    <div>
                                                        <p className="font-bold text-foreground">{item.product?.name || "Bazar Entry"}</p>
                                                        <p className="text-[10px] text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className="font-bold text-primary">৳{(item.price || 0).toLocaleString()}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-muted-foreground font-mono p-4 text-center">No bazar entries recorded for this user.</p>
                                        )}
                                    </div>
                                )}

                                {subTab === "bills" && (
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                        {billsData?.data?.length ? (
                                            billsData.data.map((bill: any) => (
                                                <div key={bill._id} className="p-3 rounded-2xl bg-[#1a0e07] border border-border/60 flex items-center justify-between text-xs font-mono">
                                                    <div>
                                                        <p className="font-bold text-foreground">{bill.title}</p>
                                                        <p className="text-[10px] text-muted-foreground">{bill.category}</p>
                                                    </div>
                                                    <span className="font-bold text-amber-400">৳{(bill.amount || 0).toLocaleString()}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-muted-foreground font-mono p-4 text-center">No bill entries recorded for this user.</p>
                                        )}
                                    </div>
                                )}

                                {subTab === "products" && (
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                        {productsData?.data?.length ? (
                                            productsData.data.map((p: any) => (
                                                <div key={p._id} className="p-3 rounded-2xl bg-[#1a0e07] border border-border/60 flex items-center justify-between text-xs font-mono">
                                                    <div className="flex items-center gap-2">
                                                        {p.photo && <img src={p.photo} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />}
                                                        <div>
                                                            <p className="font-bold text-foreground">{p.name}</p>
                                                            <p className="text-[10px] text-muted-foreground">{p.category}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-muted-foreground font-mono p-4 text-center">No products created by this user.</p>
                                        )}
                                    </div>
                                )}

                                {subTab === "reviews" && (
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                        {reviewsData?.data?.length ? (
                                            reviewsData.data.map((r: any) => (
                                                <div key={r._id} className="p-3 rounded-2xl bg-[#1a0e07] border border-border/60 space-y-1 text-xs">
                                                    <div className="flex items-center justify-between font-mono">
                                                        <span className="text-amber-400 font-bold">Rating: {r.rating} ⭐</span>
                                                        <span className="text-[10px] text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-foreground italic">"{r.comment}"</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-muted-foreground font-mono p-4 text-center">No reviews posted by this user.</p>
                                        )}
                                    </div>
                                )}

                                {subTab === "activities" && (
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                        {activitiesData?.data?.length ? (
                                            activitiesData.data.map((act: any) => (
                                                <div key={act._id} className="p-3 rounded-2xl bg-[#1a0e07] border border-border/60 flex items-center justify-between text-xs font-mono">
                                                    <div>
                                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-primary/20 text-primary border border-primary/30 uppercase">{act.action}</span>
                                                        <p className="text-foreground mt-1 text-[11px] font-sans">{act.details}</p>
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground shrink-0">{new Date(act.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-muted-foreground font-mono p-4 text-center">No audit activity logs recorded for this user.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end pt-2 border-t border-border/60">
                            <button onClick={onClose} className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-accent transition-all cursor-pointer">
                                Close Explorer
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
