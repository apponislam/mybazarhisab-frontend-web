"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GitMerge, X } from "lucide-react";
import { toast } from "sonner";
import { TProduct, useMergeProductsMutation } from "@/redux/features/product/productApi";

interface MergeProductsModalProps {
    show: boolean;
    products: TProduct[];
    onClose: () => void;
}

export function MergeProductsModal({ show, products, onClose }: MergeProductsModalProps) {
    const [mergeProducts, { isLoading }] = useMergeProductsMutation();
    const [sourceProductId, setSourceProductId] = useState("");
    const [targetProductId, setTargetProductId] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sourceProductId || !targetProductId) {
            toast.error("Please select both source and target products");
            return;
        }
        if (sourceProductId === targetProductId) {
            toast.error("Source and target products cannot be the same");
            return;
        }

        try {
            await mergeProducts({
                sourceProductId,
                targetProductId,
            }).unwrap();

            toast.success("Products merged successfully!");
            setSourceProductId("");
            setTargetProductId("");
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to merge products");
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-6"
                    >
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                                    <GitMerge className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        Merge Duplicate Products
                                    </h3>
                                    <p className="text-xs text-muted-foreground">Consolidate redundant entries into a single target product</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                                    Source Product (Will be merged & removed) <span className="text-destructive">*</span>
                                </label>
                                <select
                                    value={sourceProductId}
                                    onChange={(e) => setSourceProductId(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none focus:border-primary/60 text-foreground cursor-pointer"
                                >
                                    <option value="">-- Select Source Product --</option>
                                    {products.map((p) => (
                                        <option key={`src_${p._id}`} value={p._id} disabled={p._id === targetProductId}>
                                            {p.name} ({p._id.slice(-6)})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-center my-1">
                                <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                                    <GitMerge className="w-4 h-4" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                                    Target Product (Will retain merged data) <span className="text-destructive">*</span>
                                </label>
                                <select
                                    value={targetProductId}
                                    onChange={(e) => setTargetProductId(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none focus:border-primary/60 text-foreground cursor-pointer"
                                >
                                    <option value="">-- Select Target Product --</option>
                                    {products.map((p) => (
                                        <option key={`tgt_${p._id}`} value={p._id} disabled={p._id === sourceProductId}>
                                            {p.name} ({p._id.slice(-6)})
                                        </option>
                                    ))}
                                </select>
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
                                    type="submit"
                                    disabled={isLoading || !sourceProductId || !targetProductId}
                                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-accent transition-all disabled:opacity-50 cursor-pointer shadow-md"
                                >
                                    {isLoading ? "Merging…" : "Merge Products"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
