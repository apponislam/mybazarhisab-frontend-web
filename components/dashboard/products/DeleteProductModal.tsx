"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TProduct, useDeleteProductMutation } from "@/redux/features/product/productApi";

interface DeleteProductModalProps {
    product: TProduct | null;
    onClose: () => void;
}

export function DeleteProductModal({ product, onClose }: DeleteProductModalProps) {
    const [deleteProduct, { isLoading }] = useDeleteProductMutation();

    const handleDelete = async () => {
        if (!product) return;
        try {
            await deleteProduct(product._id).unwrap();
            toast.success("Product deleted successfully!");
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to delete product");
        }
    };

    return (
        <AnimatePresence>
            {product && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-5 text-center">
                        <div className="w-12 h-12 rounded-full bg-destructive/15 border border-destructive/30 text-destructive flex items-center justify-center mx-auto">
                            <Trash2 className="w-6 h-6" />
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-foreground">Delete Product?</h3>
                            <p className="text-xs text-muted-foreground mt-1 font-sans">
                                Are you sure you want to delete <span className="font-bold text-foreground">"{product.name}"</span>? This operation cannot be undone.
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-white/5 cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={isLoading} className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold text-xs hover:bg-destructive/90 transition-all disabled:opacity-50 cursor-pointer shadow-md">
                                {isLoading ? "Deleting…" : "Delete Item"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
