"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Edit2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { TProduct, CreateProductPayload, useUpdateProductMutation } from "@/redux/features/product/productApi";
import { ImageUpload } from "@/components/dashboard/ImageUpload";

interface EditProductModalProps {
    product: TProduct | null;
    onClose: () => void;
}

export function EditProductModal({ product, onClose }: EditProductModalProps) {
    const [updateProduct, { isLoading }] = useUpdateProductMutation();
    const [formData, setFormData] = useState<CreateProductPayload>({
        name: "",
        photo: "",
        description: "",
        is18Plus: false,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                photo: product.photo || "",
                description: product.description || "",
                is18Plus: Boolean(product.is18Plus),
            });
        }
    }, [product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        if (!formData.name.trim()) {
            toast.error("Product name is required");
            return;
        }

        try {
            await updateProduct({
                id: product._id,
                data: {
                    name: formData.name.trim(),
                    photo: formData.photo?.trim() || undefined,
                    description: formData.description?.trim() || undefined,
                    is18Plus: formData.is18Plus,
                },
            }).unwrap();

            toast.success("Product updated successfully!");
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to update product");
        }
    };

    return (
        <AnimatePresence>
            {product && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                                    <Edit2 className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        Edit Product
                                    </h3>
                                    <p className="text-xs text-muted-foreground">Update details for {product.name}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                                    Product Name <span className="text-destructive">*</span>
                                </label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none focus:border-primary/60 text-foreground" />
                            </div>

                            <ImageUpload value={formData.photo} onChange={(url) => setFormData({ ...formData, photo: url })} onRemove={() => setFormData({ ...formData, photo: "" })} label="Product Photo" variant="square" />

                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none focus:border-primary/60 text-foreground" />
                            </div>

                            <div className="flex items-center justify-between p-3.5 bg-[#1a0e07] border border-border rounded-xl cursor-pointer select-none" onClick={() => setFormData({ ...formData, is18Plus: !formData.is18Plus })}>
                                <div>
                                    <p className="text-xs font-bold text-foreground">18+ Restricted Product</p>
                                    <p className="text-[10px] text-muted-foreground">Mark if item requires age verification</p>
                                </div>
                                <div
                                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                                        formData.is18Plus ? "bg-accent border-accent text-accent-foreground shadow-xs shadow-accent/40" : "bg-[#2e1a0a] border-border text-transparent"
                                    }`}
                                >
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-white/5 cursor-pointer">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading} className="px-6 py-2.5 rounded-xl bg-accent text-accent-foreground font-bold text-xs hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer shadow-md">
                                    {isLoading ? "Updating…" : "Update Product"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
