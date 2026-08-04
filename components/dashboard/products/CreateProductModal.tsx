"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { CreateProductPayload, useCreateProductMutation } from "@/redux/features/product/productApi";
import { ImageUpload } from "./ImageUpload";

interface CreateProductModalProps {
    show: boolean;
    onClose: () => void;
}

export function CreateProductModal({ show, onClose }: CreateProductModalProps) {
    const [createProduct, { isLoading }] = useCreateProductMutation();
    const [formData, setFormData] = useState<CreateProductPayload>({
        name: "",
        photo: "",
        description: "",
        is18Plus: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Product name is required");
            return;
        }

        try {
            await createProduct({
                name: formData.name.trim(),
                photo: formData.photo?.trim() || undefined,
                description: formData.description?.trim() || undefined,
                is18Plus: formData.is18Plus,
            }).unwrap();

            toast.success("Product created successfully!");
            setFormData({ name: "", photo: "", description: "", is18Plus: false });
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to create product");
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
                                    <Plus className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                                        Add New Product
                                    </h3>
                                    <p className="text-xs text-muted-foreground">Create a new item in the catalog</p>
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
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Fresh Tomatoes"
                                    required
                                    className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none focus:border-primary/60 text-foreground"
                                />
                            </div>

                            <ImageUpload
                                value={formData.photo}
                                onChange={(url) => setFormData({ ...formData, photo: url })}
                                onRemove={() => setFormData({ ...formData, photo: "" })}
                                label="Product Photo (Cloudinary Upload)"
                            />

                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Add notes or category description…"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none focus:border-primary/60 text-foreground"
                                />
                            </div>

                            <div
                                className="flex items-center gap-3 p-3.5 bg-[#1a0e07] border border-border rounded-xl cursor-pointer"
                                onClick={() => setFormData({ ...formData, is18Plus: !formData.is18Plus })}
                            >
                                <input
                                    type="checkbox"
                                    checked={Boolean(formData.is18Plus)}
                                    onChange={(e) => setFormData({ ...formData, is18Plus: e.target.checked })}
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-0 cursor-pointer"
                                />
                                <div>
                                    <p className="text-xs font-bold text-foreground">18+ Restricted Product</p>
                                    <p className="text-[10px] text-muted-foreground">Mark if item requires age verification</p>
                                </div>
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
                                    disabled={isLoading}
                                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-accent transition-all disabled:opacity-50 cursor-pointer shadow-md"
                                >
                                    {isLoading ? "Creating…" : "Save Product"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
