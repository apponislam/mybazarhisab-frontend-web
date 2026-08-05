"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Edit2, X } from "lucide-react";
import { toast } from "sonner";
import { TBazarEntry, BazarUnit, useUpdateBazarEntryMutation } from "@/redux/features/bazar-entry/bazarEntryApi";
import { ProductSelectInput } from "./ProductSelectInput";

interface EditExpenseModalProps {
    entry: TBazarEntry | null;
    onClose: () => void;
}

export function EditExpenseModal({ entry, onClose }: EditExpenseModalProps) {
    const [updateBazarEntry, { isLoading }] = useUpdateBazarEntryMutation();
    const [productId, setProductId] = useState<string | undefined>(undefined);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [unit, setUnit] = useState<BazarUnit>("KG");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (entry) {
            setProductId(entry.product?._id);
            setName(entry.product?.name || "");
            setPrice(entry.price ? String(entry.price) : "");
            setQuantity(entry.quantity ? String(entry.quantity) : "1");
            setUnit(entry.unit || "KG");
            setDate(entry.date ? new Date(entry.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
            setNotes(entry.notes || "");
        }
    }, [entry]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!entry) return;
        if (!name.trim() || !price || !quantity) {
            toast.error("Product name, price, and quantity are required");
            return;
        }

        try {
            await updateBazarEntry({
                id: entry._id,
                data: {
                    productId: productId || undefined,
                    name: name.trim(),
                    price: Number(price),
                    quantity: Number(quantity),
                    unit,
                    date: date ? new Date(date).toISOString() : undefined,
                    notes: notes.trim() || undefined,
                },
            }).unwrap();

            toast.success("Bazar expense updated successfully!");
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to update bazar expense");
        }
    };

    return (
        <AnimatePresence>
            {entry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-5">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                                    <Edit2 className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-foreground">Edit Bazar Expense</h3>
                                    <p className="text-xs text-muted-foreground font-mono select-all">ID: {entry._id}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                                    Product Name <span className="text-destructive">*</span>
                                </label>
                                <ProductSelectInput
                                    valueName={name}
                                    onSelect={(prod) => {
                                        setProductId(prod.id);
                                        setName(prod.name);
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Price (৳)</label>
                                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="0" className="w-full px-3 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono text-foreground" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Quantity</label>
                                    <input type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} required placeholder="1" className="w-full px-3 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono text-foreground" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Unit</label>
                                    <select value={unit} onChange={(e) => setUnit(e.target.value as BazarUnit)} className="w-full px-3 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono text-foreground" style={{ colorScheme: "dark" }}>
                                        <option value="KG">KG</option>
                                        <option value="GM">GM</option>
                                        <option value="PIECE">Piece</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">Date</label>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono text-foreground" style={{ colorScheme: "dark" }} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1">Notes (optional)</label>
                                <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add note…" className="w-full px-4 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none text-foreground" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={onClose} className="flex-1 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-white/5 cursor-pointer text-xs">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-accent text-accent-foreground font-bold rounded-xl hover:opacity-90 cursor-pointer text-xs disabled:opacity-50">
                                    {isLoading ? "Updating…" : "Update Expense"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
