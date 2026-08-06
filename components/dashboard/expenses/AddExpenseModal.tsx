"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Repeat } from "lucide-react";
import { toast } from "sonner";
import { BazarUnit, useCreateBazarEntryMutation } from "@/redux/features/bazar-entry/bazarEntryApi";
import { ProductSelectInput } from "./ProductSelectInput";

interface AddExpenseModalProps {
    show: boolean;
    onClose: () => void;
}

export function AddExpenseModal({ show, onClose }: AddExpenseModalProps) {
    const [createBazarEntry, { isLoading }] = useCreateBazarEntryMutation();
    const [productId, setProductId] = useState<string | undefined>(undefined);
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [priceMode, setPriceMode] = useState<"unit" | "total">("unit");
    const [quantity, setQuantity] = useState("1");
    const [unit, setUnit] = useState<BazarUnit>("KG");
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState("");

    const togglePriceMode = () => {
        setPriceMode((prev) => (prev === "unit" ? "total" : "unit"));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productName.trim() || !price || !quantity) {
            toast.error("Please select or enter product name, price, and quantity");
            return;
        }

        try {
            const payload: any = {
                productId: productId || undefined,
                name: productName.trim(),
                quantity: Number(quantity),
                unit,
                date: date ? new Date(date).toISOString() : undefined,
                notes: notes.trim() || undefined,
            };

            if (priceMode === "unit") {
                payload.price = Number(price);
            } else {
                payload.totalPrice = Number(price);
            }

            await createBazarEntry(payload).unwrap();

            toast.success("Bazar expense created successfully!");
            setProductId(undefined);
            setProductName("");
            setPrice("");
            setQuantity("1");
            setNotes("");
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || err?.message || "Failed to create bazar expense");
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-sans">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#251508] border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl flex flex-col gap-5">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                                    <Plus className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="text-base font-bold text-foreground">Add Bazar Expense</h3>
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
                                    valueName={productName}
                                    onSelect={(prod) => {
                                        setProductId(prod.id);
                                        setProductName(prod.name);
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                                        {priceMode === "unit" ? "Unit Price (৳)" : "Total Price (৳)"}
                                    </label>
                                    <div className="relative flex items-center">
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                            placeholder="0"
                                            className="w-full pl-3 pr-8 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono text-foreground"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePriceMode}
                                            title={priceMode === "unit" ? "Switch to Total Price" : "Switch to Unit Price"}
                                            className="absolute right-2 p-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                        >
                                            <Repeat className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
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
                                <button type="submit" disabled={isLoading} className="flex-1 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-accent cursor-pointer text-xs disabled:opacity-50">
                                    {isLoading ? "Saving…" : "Save Expense"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
