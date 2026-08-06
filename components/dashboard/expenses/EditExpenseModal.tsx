"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Edit2, X, Repeat } from "lucide-react";
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
    const [priceMode, setPriceMode] = useState<"unit" | "total">("unit");
    const [quantity, setQuantity] = useState("1");
    const [unit, setUnit] = useState<BazarUnit>("KG");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (entry) {
            setProductId(entry.product?._id);
            setName(entry.product?.name || "");
            setPrice(entry.price ? String(entry.price) : "");
            setPriceMode("unit");
            setQuantity(entry.quantity ? String(entry.quantity) : "1");
            setUnit(entry.unit || "KG");
            setDate(entry.date ? new Date(entry.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
            setNotes(entry.notes || "");
        }
    }, [entry]);

    const togglePriceMode = () => {
        const p = Number(price);
        const q = Number(quantity);

        if (priceMode === "unit") {
            // Switching to Total Price: Total = Unit Price * Quantity
            if (p > 0 && q > 0) {
                setPrice(String(Number((p * q).toFixed(2))));
            }
            setPriceMode("total");
        } else {
            // Switching to Unit Price: Unit = Total Price / Quantity
            if (p > 0 && q > 0) {
                setPrice(String(Number((p / q).toFixed(2))));
            }
            setPriceMode("unit");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!entry) return;
        if (!name.trim() || !price || !quantity) {
            toast.error("Product name, price, and quantity are required");
            return;
        }

        try {
            const data: any = {
                productId: productId || undefined,
                name: name.trim(),
                quantity: Number(quantity),
                unit,
                date: date ? new Date(date).toISOString() : undefined,
                notes: notes.trim() || undefined,
            };

            if (priceMode === "unit") {
                data.price = Number(price);
            } else {
                data.totalPrice = Number(price);
            }

            await updateBazarEntry({
                id: entry._id,
                data,
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
                            <div className="grid grid-cols-2 gap-3">
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
                                            className="absolute right-2 p-1 text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                                        >
                                            <Repeat className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Quantity</label>
                                    <input type="number" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} required placeholder="1" className="w-full px-3 py-3 bg-[#1a0e07] border border-border rounded-xl text-sm outline-none font-mono text-foreground" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Unit</label>
                                <div className="flex gap-2">
                                    {(["KG", "PIECE", "GM"] as BazarUnit[]).map((u) => (
                                        <button
                                            key={u}
                                            type="button"
                                            onClick={() => setUnit(u)}
                                            className="flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer font-mono"
                                            style={{
                                                borderColor: unit === u ? "rgba(232,160,32,0.8)" : "rgba(232,160,32,0.18)",
                                                background: unit === u ? "rgba(232,160,32,0.15)" : "#1a0e07",
                                                color: unit === u ? "#e8a020" : "#a08060",
                                            }}
                                        >
                                            {u === "PIECE" ? "Piece" : u}
                                        </button>
                                    ))}
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
