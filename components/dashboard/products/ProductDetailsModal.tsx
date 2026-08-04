"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Package, X } from "lucide-react";
import { useGetProductByIdQuery } from "@/redux/features/product/productApi";

interface ProductDetailsModalProps {
    id: string | null;
    onClose: () => void;
}

export function ProductDetailsModal({ id, onClose }: ProductDetailsModalProps) {
    const { data, isLoading, isError } = useGetProductByIdQuery(id || "", {
        skip: !id,
    });
    const product = data?.data;

    return (
        <AnimatePresence>
            {id && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-5"
                    >
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h3 className="text-base font-bold text-foreground">Product Details</h3>
                            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="py-8 flex flex-col items-center justify-center gap-2">
                                <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                <p className="text-xs text-muted-foreground font-mono">Fetching product details…</p>
                            </div>
                        ) : isError || !product ? (
                            <div className="py-8 text-center text-destructive text-xs">Failed to load product details</div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-[#1a0e07] border border-border flex items-center justify-center overflow-hidden shrink-0">
                                        {product.photo ? (
                                            <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package className="w-8 h-8 text-primary" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-foreground">{product.name}</h4>
                                        <p className="text-xs text-muted-foreground font-mono">ID: {product._id}</p>
                                    </div>
                                </div>

                                <div className="bg-[#1a0e07] border border-border rounded-xl p-4 flex flex-col gap-2.5 text-xs font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Description:</span>
                                        <span className="text-foreground text-right">{product.description || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">18+ Restricted:</span>
                                        <span className={product.is18Plus ? "text-destructive font-bold" : "text-foreground"}>
                                            {product.is18Plus ? "Yes (18+)" : "No"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Active Status:</span>
                                        <span className={product.isActive !== false ? "text-green-400 font-bold" : "text-muted-foreground"}>
                                            {product.isActive !== false ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Created At:</span>
                                        <span className="text-foreground">{new Date(product.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-accent cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
