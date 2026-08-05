"use client";

import React, { useState } from "react";
import { X, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BazarUnit, BillCategory } from "@/types";
import { BILL_META } from "@/lib/mockData";
import { ProductSelectInput } from "@/components/dashboard/expenses/ProductSelectInput";
import { TMyReviewResponse } from "@/redux/features/review/reviewApi";

// ── Generic Animated Modal ───────────────────────────────────────────────────
export function WebDialogModal({ show, onClose, title, children }: { show: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="w-full max-w-lg bg-[#251508] border border-border rounded-3xl p-8 relative z-10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
                                {title}
                            </h3>
                            <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#2e1a0a] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// ── FieldBox Form Wrapper ────────────────────────────────────────────────────
export function WebFieldBox({ label, focused, error, children }: { label: string; focused: boolean; error?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">{label}</label>
            <div
                className="rounded-xl border transition-all duration-200"
                style={{
                    borderColor: error ? "rgba(212,24,61,0.6)" : focused ? "rgba(232,160,32,0.7)" : "rgba(232,160,32,0.18)",
                    background: "#2e1a0a",
                }}
            >
                {children}
            </div>
            {error && <p className="text-xs text-destructive mt-0.5">{error}</p>}
        </div>
    );
}

// ── Add Bazar Expense Form ───────────────────────────────────────────────────
export function WebAddExpenseForm({ onSubmit, onClose, isLoading }: { onSubmit: (prod: string, price: number, qty: number, unit: BazarUnit, date: string, notes: string) => void; onClose: () => void; isLoading?: boolean }) {
    const [product, setProduct] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState<BazarUnit>("KG");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!product || !price || !quantity) return;
        onSubmit(product, Number(price), Number(quantity), unit, date, notes);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Product Name</label>
                <ProductSelectInput valueName={product} onSelect={(p) => setProduct(p.name)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Price (৳)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0.00" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-mono text-foreground" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Quantity</label>
                    <input type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} required placeholder="e.g. 2, 1.5" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-mono text-foreground" />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Unit</label>
                <div className="flex gap-2">
                    {(["KG", "PIECE", "GM"] as BazarUnit[]).map((u) => (
                        <button
                            key={u}
                            type="button"
                            onClick={() => setUnit(u)}
                            className="flex-1 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer font-mono"
                            style={{
                                borderColor: unit === u ? "rgba(232,160,32,0.8)" : "rgba(232,160,32,0.18)",
                                background: unit === u ? "rgba(232,160,32,0.15)" : "#2e1a0a",
                                color: unit === u ? "#e8a020" : "#a08060",
                            }}
                        >
                            {u}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Purchase Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground font-mono" style={{ colorScheme: "dark" }} />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Add purchase details..." className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none resize-none text-foreground" />
            </div>
            <div className="flex gap-3 mt-4">
                <button type="button" onClick={onClose} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl transition-all hover:bg-secondary cursor-pointer">
                    Cancel
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:bg-accent cursor-pointer disabled:opacity-50">
                    {isLoading ? "Saving Entry…" : "Save Entry"}
                </button>
            </div>
        </form>
    );
}

// ── Add Monthly Bill Form ────────────────────────────────────────────────────
export function WebAddBillForm({ onSubmit, onClose, isLoading }: { onSubmit: (cat: BillCategory, title: string, amount: number, date: string, notes: string) => void; onClose: () => void; isLoading?: boolean }) {
    const [category, setCategory] = useState<BillCategory>("RENT");
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !amount) return;
        onSubmit(category, title, Number(amount), date, notes);
    };

    const BILL_CATEGORIES_LIST = Object.entries(BILL_META).map(([k, v]) => ({ key: k as BillCategory, label: v.label }));

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as BillCategory)} className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-sans text-foreground" style={{ colorScheme: "dark" }}>
                        {BILL_CATEGORIES_LIST.map((c) => (
                            <option key={c.key} value={c.key}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Amount (৳)</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="0.00" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none font-mono text-foreground" />
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Bill Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. July House Rent, Wi-Fi Bill" className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground" />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Billing Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none text-foreground font-mono" style={{ colorScheme: "dark" }} />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Notes (optional)</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Add billing details..." className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none resize-none text-foreground" />
            </div>
            <div className="flex gap-3 mt-4">
                <button type="button" onClick={onClose} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl transition-all hover:bg-secondary cursor-pointer">
                    Cancel
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:bg-accent cursor-pointer disabled:opacity-50">
                    {isLoading ? "Saving Bill…" : "Save Bill"}
                </button>
            </div>
        </form>
    );
}

// ── Leave Review Form / View ─────────────────────────────────────────────────
export function WebReviewModalContent({
    myReviewLoading,
    userReviewState,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    onSubmitReview,
    onClose,
    reviewLoading,
}: {
    myReviewLoading: boolean;
    userReviewState?: TMyReviewResponse;
    reviewRating: number;
    setReviewRating: (val: number) => void;
    reviewComment: string;
    setReviewComment: (val: string) => void;
    onSubmitReview: (e: React.FormEvent) => void;
    onClose: () => void;
    reviewLoading: boolean;
}) {
    if (myReviewLoading) {
        return <div className="py-8 text-center text-sm text-muted-foreground">Checking review status...</div>;
    }

    if (userReviewState?.hasReviewed) {
        return (
            <div className="flex flex-col gap-4 text-left">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border flex flex-col gap-2">
                    <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider font-mono">You have already submitted a review</span>
                    <div className="flex items-center gap-1 my-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-5 h-5 ${star <= (userReviewState.review?.rating || 0) ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
                        ))}
                    </div>
                    <p className="text-sm text-foreground italic">"{userReviewState.review?.comment}"</p>
                </div>
                <p className="text-xs text-muted-foreground">Thank you for sharing your feedback with us!</p>
                <div className="flex justify-end mt-2">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 border border-border text-foreground font-bold rounded-xl hover:bg-secondary cursor-pointer text-sm">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmitReview} className="flex flex-col gap-4 text-left">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setReviewRating(star)} className="p-2 text-2xl transition-transform hover:scale-110 cursor-pointer">
                            <Star className={`w-7 h-7 ${star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">Your Review</label>
                <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    rows={4}
                    placeholder="Share your experience using My Bazar Hisab..."
                    className="w-full px-4 py-3 bg-[#2e1a0a] border border-border rounded-xl text-sm outline-none resize-none text-foreground"
                />
            </div>
            <div className="flex gap-3 mt-2">
                <button type="button" onClick={onClose} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-secondary cursor-pointer">
                    Cancel
                </button>
                <button type="submit" disabled={reviewLoading} className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-accent cursor-pointer disabled:opacity-50">
                    {reviewLoading ? "Posting…" : "Post Review"}
                </button>
            </div>
        </form>
    );
}
